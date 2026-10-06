import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const globalRule = config.headers.find(entry => entry.source === '/((?!map-frame\\.html$).*)');
const globalHeaders = globalRule?.headers ?? [];
const header = name => globalHeaders.find(entry => entry.key.toLowerCase() === name.toLowerCase())?.value;

test('public pages ship a restrictive content security policy with only the Auth API exception', () => {
  const csp = header('Content-Security-Policy');
  assert.ok(csp);
  for (const directive of [
    "default-src 'self'",
    "script-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "connect-src 'self' https://utpmvqdmwelnopcdyfpd.supabase.co",
  ]) assert.ok(csp.includes(directive), `missing CSP directive: ${directive}`);
});

test('public pages deny framing, MIME sniffing, referrer leakage, and unused browser capabilities', () => {
  assert.equal(header('X-Frame-Options'), 'DENY');
  assert.equal(header('X-Content-Type-Options'), 'nosniff');
  assert.equal(header('Referrer-Policy'), 'no-referrer');
  assert.equal(header('Permissions-Policy'), 'camera=(), geolocation=(), microphone=()');
});

test('email callback responses are not cached or indexed', () => {
  const callbackHeaders = config.headers.find(entry => entry.source === '/auth-confirmed.html')?.headers ?? [];
  assert.ok(callbackHeaders.some(entry => entry.key.toLowerCase() === 'cache-control' && entry.value === 'no-store'));
  assert.ok(callbackHeaders.some(entry => entry.key.toLowerCase() === 'x-robots-tag' && entry.value === 'noindex, nofollow'));
});

test('the hosted map only allows the Loadline extension to frame it', () => {
  const mapRule = config.headers.find(entry => entry.source === '/map-frame.html');
  const mapHeaders = mapRule?.headers ?? [];
  const mapHeader = name => mapHeaders.find(entry => entry.key.toLowerCase() === name.toLowerCase())?.value;
  const csp = mapHeader('Content-Security-Policy');
  assert.ok(csp);
  assert.ok(csp.includes("default-src 'none'"));
  assert.ok(csp.includes('frame-ancestors chrome-extension://odgjoojkkgncedkjcghhckkmgihjmbge'));
  assert.ok(csp.includes('https://*.googleapis.com'));
  assert.ok(csp.includes('https://*.gstatic.com'));
  assert.equal(mapHeader('Referrer-Policy'), 'strict-origin');
  assert.equal(mapHeader('Cache-Control'), 'no-store');
  assert.equal(mapHeader('X-Frame-Options'), undefined);

  const appliesToPage = new RegExp(`^${globalRule.source}$`);
  assert.equal(appliesToPage.test('/map-frame.html'), false);
  for (const path of ['/', '/download/', '/auth-confirmed.html', '/map-frame.js']) {
    assert.equal(appliesToPage.test(path), true, `global security headers must still cover ${path}`);
  }
});
