import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { MessageChannel } from 'node:worker_threads';
import test from 'node:test';

const source = await readFile(new URL('../public/map-frame.js', import.meta.url), 'utf8');
const { isTrustedDesktopConnection, createMapFrameTransport } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const desktopPath = '/desktop-map-frame.html';
const place = { id: 'site', name: 'Test location', address: '10 Main Street', url: '', latitude: 32.8, longitude: -96.8, phone: '', businessStatus: '', openingHours: [] };
const payload = { apiKey: 'test-browser-key', accountName: 'Test account', places: [place], mapType: 'satellite' };

function fixture(pathname = desktopPath) {
  const listeners = new Map();
  const replies = [];
  const parent = { postMessage: (...args) => replies.push(args) };
  const win = { location: { pathname }, parent, addEventListener: (type, handler) => listeners.set(type, handler), removeEventListener: type => listeners.delete(type) };
  return { win, parent, replies, dispatch: event => listeners.get('message')?.(event) };
}

test('desktop connection requires its dedicated page, opaque parent, and exactly one transferred port', () => {
  const parent = {};
  const { port1, port2 } = new MessageChannel();
  const event = { origin: 'null', source: parent, data: { type: 'loadline-map-connect' }, ports: [port2] };
  try {
    assert.equal(isTrustedDesktopConnection(event, parent, desktopPath), true);
    for (const pathname of ['/map-frame.html', '/desktop-map-frame.html/','/other.html']) assert.equal(isTrustedDesktopConnection(event, parent, pathname), false);
    for (const origin of ['file://', 'https://loadlinehq.com', 'https://attacker.example']) assert.equal(isTrustedDesktopConnection({ ...event, origin }, parent, desktopPath), false);
    assert.equal(isTrustedDesktopConnection({ ...event, source: {} }, parent, desktopPath), false);
    for (const ports of [[], [port1, port2], [{}], undefined]) assert.equal(isTrustedDesktopConnection({ ...event, ports }, parent, desktopPath), false);
    assert.equal(isTrustedDesktopConnection({ ...event, data: { type: 'loadline-map-init', payload } }, parent, desktopPath), false);
    assert.equal(isTrustedDesktopConnection({ ...event, data: { type: 'loadline-map-connect', extra: payload } }, parent, desktopPath), false);
  } finally { port1.close(); port2.close(); }
});

test('desktop exchanges validated map data over one private channel and rejects window data or replacement channels', { timeout: 3000 }, async () => {
  const page = fixture();
  const channel = new MessageChannel();
  const replacement = new MessageChannel();
  const received = [];
  let resolveTheme;
  const themeReceived = new Promise(resolve => { resolveTheme = resolve; });
  const transport = createMapFrameTransport(page.win, message => { received.push(message); if (message.type === 'loadline-map-theme') resolveTheme(); });
  try {
    page.dispatch({ origin: 'null', source: page.parent, data: { type: 'loadline-map-connect' }, ports: [channel.port2] });
    page.dispatch({ origin: 'null', source: page.parent, data: { type: 'loadline-map-init', payload }, ports: [] });
    channel.port1.postMessage({ type: 'loadline-map-init', payload: { ...payload, places: [{ ...place, latitude: 200 }] } });
    channel.port1.postMessage({ type: 'unknown' });
    channel.port1.postMessage({ type: 'loadline-map-init', payload });
    channel.port1.postMessage({ type: 'loadline-map-theme', scheme: 'light' });
    await themeReceived;
    assert.deepEqual(received, [{ type: 'loadline-map-init', payload }, { type: 'loadline-map-theme', scheme: 'light' }]);
    page.dispatch({ origin: 'null', source: page.parent, data: { type: 'loadline-map-connect' }, ports: [replacement.port2] });
    const reply = once(channel.port1, 'message');
    transport.send({ type: 'loadline-map-map-ready' });
    assert.deepEqual(await reply, [{ type: 'loadline-map-map-ready' }]);
    assert.deepEqual(page.replies, []);
    transport.close();
    assert.equal(page.dispatch({ origin: 'null', source: page.parent, data: { type: 'loadline-map-connect' }, ports: [replacement.port2] }), undefined);
  } finally { transport.close(); channel.port1.close(); channel.port2.close(); replacement.port1.close(); replacement.port2.close(); }
});

test('legacy frame retains exact-origin messaging and never accepts desktop connections', () => {
  const page = fixture('/map-frame.html');
  const received = [];
  const transport = createMapFrameTransport(page.win, message => received.push(message));
  const channel = new MessageChannel();
  try {
    page.dispatch({ origin: 'null', source: page.parent, data: { type: 'loadline-map-connect' }, ports: [channel.port2] });
    page.dispatch({ origin: 'null', source: page.parent, data: { type: 'loadline-map-init', payload } });
    page.dispatch({ origin: 'https://attacker.example', source: page.parent, data: { type: 'loadline-map-init', payload } });
    assert.deepEqual(received, []);
    page.dispatch({ origin: 'https://loadlinehq.com', source: page.parent, data: { type: 'loadline-map-init', payload } });
    transport.send({ type: 'loadline-map-map-ready' });
    assert.deepEqual(received, [{ type: 'loadline-map-init', payload }]);
    assert.deepEqual(page.replies, [[{ type: 'loadline-map-map-ready' }, 'https://loadlinehq.com']]);
  } finally { transport.close(); channel.port1.close(); channel.port2.close(); }
});

test('only the dedicated desktop route permits file ancestors and both map routes avoid generic frame denial', async () => {
  const hostingText = await readFile(new URL('../vercel.json', import.meta.url), 'utf8');
  assert.equal(await readFile(new URL('../public/vercel.json', import.meta.url), 'utf8'), hostingText);
  const hosting = JSON.parse(hostingText);
  const desktopHeaders = hosting.headers.find(entry => entry.source === desktopPath)?.headers || [];
  const legacyHeaders = hosting.headers.find(entry => entry.source === '/map-frame.html')?.headers || [];
  const policy = headers => headers.find(header => header.key === 'Content-Security-Policy')?.value || '';
  assert.match(policy(desktopHeaders), /frame-ancestors file:;/);
  assert.doesNotMatch(policy(legacyHeaders), /frame-ancestors[^;]*file:/);
  assert.match(policy(legacyHeaders), /frame-ancestors chrome-extension:\/\/odgjoojkkgncedkjcghhckkmgihjmbge https:\/\/loadlinehq\.com;/);
  assert.equal(desktopHeaders.some(header => header.key === 'X-Frame-Options'), false);
  assert.equal(desktopHeaders.find(header => header.key === 'Referrer-Policy')?.value, 'strict-origin');
  const general = hosting.headers.find(entry => entry.source.startsWith('/((?!'));
  const matcher = new RegExp(`^${general.source}$`);
  assert.equal(matcher.test(desktopPath), false);
  assert.equal(matcher.test('/map-frame.html'), false);
  assert.equal(matcher.test('/index.html'), true);
  assert.equal(await readFile(new URL('../public/desktop-map-frame.html', import.meta.url), 'utf8'), await readFile(new URL('../public/map-frame.html', import.meta.url), 'utf8'));
});
