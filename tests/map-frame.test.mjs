import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../public/map-frame.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../public/map-frame.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../public/map-frame.css', import.meta.url), 'utf8');
const hosting = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const { isMapPayload, isMapPlace, isTrustedParentMessage } = await import(moduleUrl);
const mapFrameHeaders = hosting.headers.find(entry => entry.source === '/map-frame.html')?.headers || [];
const mapFramePolicy = mapFrameHeaders.find(header => header.key === 'Content-Security-Policy')?.value || '';

const place = {
  id: 'place-1', name: 'Loadline Test Location', address: '10 Main Street',
  url: 'https://www.google.com/maps/place/example', latitude: 32.8, longitude: -96.8,
  phone: '', businessStatus: '', openingHours: [],
};
const payload = {
  apiKey: 'AIzaSyA123456789012345678901234567890123', accountName: 'Test account',
  places: [place], primaryId: place.id, focusedId: place.id, selected: null,
  mapType: 'satellite', scheme: 'dark',
};

test('the frame validates bounded map data and geographic coordinates', () => {
  assert.equal(isMapPlace(place), true);
  assert.equal(isMapPayload(payload), true);
  assert.equal(isMapPayload({ ...payload, is3d: true }), true);
  assert.equal(isMapPayload({ ...payload, is3d: false }), true);
  assert.equal(isMapPayload({ ...payload, is3d: 'true' }), false);
  assert.equal(isMapPlace({ ...place, latitude: 91 }), false);
  assert.equal(isMapPlace({ ...place, longitude: Infinity }), false);
  assert.equal(isMapPlace({ ...place, name: 'x'.repeat(301) }), false);
  assert.equal(isMapPayload({ ...payload, places: Array(1_001).fill(place) }), false);
});

test('the hosted HTML sandbox exposes the 3D map and permits its Maps 3D runtime', () => {
  assert.match(html, /id="map-3d"/);
  assert.match(html, /id="map-3d-toggle"/);
  assert.match(css, /#map-3d\s+gmp-map-3d\s*\{[^}]*width:\s*100%[^}]*height:\s*100%/s);
  assert.match(source, /importLibrary\('maps3d'\)/);
  assert.match(source, /new Map3DElement\(/);
  assert.match(source, /function is3dViewVisible\(\)\s*\{\s*return Boolean\(payload\?\.is3d\) && !map3dNode\.hidden;/);
  assert.match(source, /function scheduleMap3dReady\(\)\s*\{\s*status\.hidden = true;/);
  assert.match(source, /if \(reuseSettledView \|\| map3dSettled\) scheduleMap3dReady\(\);/);
  assert.doesNotMatch(source, /Loading photorealistic 3D map/);
  assert.match(source, /type: 'loadline-map-3d', is3d: nextIs3d/);
  assert.match(mapFramePolicy, /script-src[^;]*https:\/\/\*\.googleapis\.com/);
  assert.match(mapFramePolicy, /script-src[^;]*'wasm-unsafe-eval'/);
  assert.match(mapFramePolicy, /frame-ancestors chrome-extension:\/\/odgjoojkkgncedkjcghhckkmgihjmbge/);
  assert.match(mapFramePolicy, /frame-ancestors[^;]*https:\/\/loadlinehq\.com/);
});

test('the frame accepts messages only from its exact extension or Loadline web parent', () => {
  const parent = {};
  const extensionOrigin = 'chrome-extension://odgjoojkkgncedkjcghhckkmgihjmbge';
  const event = { origin: extensionOrigin, source: parent, data: { type: 'loadline-map-init', payload } };
  assert.equal(isTrustedParentMessage(event, parent), true);
  assert.equal(isTrustedParentMessage({ ...event, origin: 'https://loadlinehq.com' }, parent), true);
  assert.equal(isTrustedParentMessage({ ...event, origin: 'https://attacker.example' }, parent), false);
  assert.equal(isTrustedParentMessage({ ...event, source: {} }, parent), false);
  assert.equal(isTrustedParentMessage({ ...event, data: { type: 'loadline-map-init', payload: { ...payload, mapType: 'unexpected' } } }, parent), false);
});

test('map labels and card details are rendered as text, and external links use safe targets', () => {
  assert.match(source, /textContent = text/);
  assert.match(source, /link\.rel = 'noopener noreferrer'/);
  assert.doesNotMatch(source, /\.innerHTML\s*=/);
  assert.match(source, /postMessage\(message, parentOrigin\)/);
  assert.match(source, /!trustedOrigins\.includes\(event\.origin\) \|\| event\.source !== parentWindow/);
  assert.match(html, /id="map-wait"/);
});
