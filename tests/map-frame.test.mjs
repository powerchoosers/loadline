import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../public/map-frame.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../public/map-frame.html', import.meta.url), 'utf8');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const { isMapPayload, isMapPlace, isTrustedParentMessage } = await import(moduleUrl);

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
  assert.equal(isMapPlace({ ...place, latitude: 91 }), false);
  assert.equal(isMapPlace({ ...place, longitude: Infinity }), false);
  assert.equal(isMapPlace({ ...place, name: 'x'.repeat(301) }), false);
  assert.equal(isMapPayload({ ...payload, places: Array(1_001).fill(place) }), false);
});

test('the frame accepts initialization only from its exact extension parent', () => {
  const parent = {};
  const extensionOrigin = 'chrome-extension://odgjoojkkgncedkjcghhckkmgihjmbge';
  const event = { origin: extensionOrigin, source: parent, data: { type: 'loadline-map-init', payload } };
  assert.equal(isTrustedParentMessage(event, parent), true);
  assert.equal(isTrustedParentMessage({ ...event, origin: 'https://attacker.example' }, parent), false);
  assert.equal(isTrustedParentMessage({ ...event, source: {} }, parent), false);
  assert.equal(isTrustedParentMessage({ ...event, data: { type: 'loadline-map-init', payload: { ...payload, mapType: 'unexpected' } } }, parent), false);
});

test('map labels and card details are rendered as text, and external links use safe targets', () => {
  assert.match(source, /textContent = text/);
  assert.match(source, /link\.rel = 'noopener noreferrer'/);
  assert.doesNotMatch(source, /\.innerHTML\s*=/);
  assert.match(source, /postMessage\(message, EXTENSION_ORIGIN\)/);
  assert.match(source, /event\.origin !== extensionOrigin \|\| event\.source !== parentWindow/);
  assert.match(html, /id="map-wait"/);
});
