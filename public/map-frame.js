const EXTENSION_ORIGIN = 'chrome-extension://odgjoojkkgncedkjcghhckkmgihjmbge';
const LOADLINE_ORIGIN = 'https://loadlinehq.com';
const TRUSTED_PARENT_ORIGINS = [EXTENSION_ORIGIN, LOADLINE_ORIGIN];
const MAX_PAYLOAD_CHARS = 512_000;
const MAX_PLACES = 1_000;

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const boundedString = (value, max) => typeof value === 'string' && value.length <= max;
const validCoordinate = (value, min, max) => value === null || typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;

export function isMapPlace(value) {
  return isRecord(value)
    && boundedString(value.id, 512) && value.id.length > 0
    && boundedString(value.name, 300)
    && boundedString(value.address, 1_000)
    && boundedString(value.url, 2_048)
    && validCoordinate(value.latitude, -90, 90)
    && validCoordinate(value.longitude, -180, 180)
    && boundedString(value.phone, 100)
    && boundedString(value.businessStatus, 64)
    && Array.isArray(value.openingHours)
    && value.openingHours.length <= 24
    && value.openingHours.every(hour => boundedString(hour, 200));
}

export function isMapPayload(value) {
  if (!isRecord(value) || typeof value.apiKey !== 'string' || value.apiKey.length < 10 || value.apiKey.length > 256
      || !boundedString(value.accountName, 300)
      || !Array.isArray(value.places) || value.places.length > MAX_PLACES || !value.places.every(isMapPlace)
      || !(value.primaryId === undefined || boundedString(value.primaryId, 512))
      || !(value.focusedId === undefined || boundedString(value.focusedId, 512))
      || !(value.selected === undefined || value.selected === null || isMapPlace(value.selected))
      || !['roadmap', 'satellite'].includes(value.mapType)
      || !(value.is3d === undefined || typeof value.is3d === 'boolean')
      || !(value.scheme === undefined || value.scheme === 'light' || value.scheme === 'dark')) return false;
  try { return JSON.stringify(value).length <= MAX_PAYLOAD_CHARS; } catch { return false; }
}

export function isTrustedParentMessage(event, parentWindow, trustedOrigins = TRUSTED_PARENT_ORIGINS) {
  if (!event || !trustedOrigins.includes(event.origin) || event.source !== parentWindow || !isRecord(event.data)) return false;
  if (event.data.type === 'loadline-map-init') return isMapPayload(event.data.payload);
  return event.data.type === 'loadline-map-theme' && (event.data.scheme === 'light' || event.data.scheme === 'dark');
}

function installMapFrame(win, doc) {
  const shell = doc.querySelector('#map-shell');
  const mapNode = doc.querySelector('#map');
  const map3dNode = doc.querySelector('#map-3d');
  const map3dPlaceCard = doc.querySelector('#map-3d-place-card');
  const wait = doc.querySelector('#map-wait');
  const status = doc.querySelector('#map-status');
  const error = doc.querySelector('#map-error');
  const markers = [];
  const markers3d = [];
  let map;
  let map3d;
  let map3dReadyTimer;
  let infoWindow;
  let payload;
  let selected;
  let apiPromise;
  let maps3dPromise;
  let lastLocationKey = '';
  let last3dLocationKey = '';
  let last3dTargetKey = '';
  let map3dSettled = false;
  let parentOrigin = '';

  const send = message => { if (parentOrigin) win.parent.postMessage(message, parentOrigin); };
  const showError = message => { error.textContent = message; error.hidden = false; status.hidden = true; };
  const hideError = () => { error.textContent = ''; error.hidden = true; };
  const safeMapsUrl = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && ['www.google.com', 'maps.google.com', 'maps.app.goo.gl'].includes(url.hostname) ? url.href : '';
    } catch { return ''; }
  };
  const createElement = (tag, className, text) => {
    const element = doc.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const iconPaths = {
    mapPin: [['path', 'M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z'], ['circle', '12 10 2']],
    plus: [['path', 'M12 5v14M5 12h14']],
    minus: [['path', 'M5 12h14']],
    fullscreen: [['path', 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7']],
    exitFullscreen: [['path', 'M4 14h6v6M20 10h-6V4M10 14l-7 7M14 10l7-7']],
    copy: [['path', 'M8 8V4h12v12h-4M4 8h12v12H4z']],
    phone: [['path', 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62a2 2 0 0 1 1.99 2.29Z']],
    arrowUpRight: [['path', 'M7 17 17 7M7 7h10v10']],
  };
  const icon = name => {
    const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    for (const [key, value] of Object.entries({ viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' })) svg.setAttribute(key, value);
    for (const [kind, value] of iconPaths[name] || []) {
      const shape = doc.createElementNS('http://www.w3.org/2000/svg', kind);
      if (kind === 'path') shape.setAttribute('d', value);
      else { const [cx, cy, r] = value.split(' '); shape.setAttribute('cx', cx); shape.setAttribute('cy', cy); shape.setAttribute('r', r); }
      svg.append(shape);
    }
    return svg;
  };

  function loadMaps(apiKey) {
    if (win.google?.maps) return Promise.resolve(win.google.maps);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      const callbackName = `__loadlineMapsReady_${Math.random().toString(36).slice(2)}`;
      const script = doc.createElement('script');
      const params = new URLSearchParams({ key: apiKey, callback: callbackName, loading: 'async', v: 'weekly' });
      script.async = true;
      script.referrerPolicy = 'strict-origin';
      script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
      win[callbackName] = () => {
        delete win[callbackName];
        resolve(win.google.maps);
      };
      script.onerror = () => {
        delete win[callbackName];
        apiPromise = undefined;
        script.remove();
        reject(new Error('Google Maps could not be loaded. Try again later.'));
      };
      doc.head.append(script);
    });
    return apiPromise;
  }

  function loadMaps3d() {
    if (maps3dPromise) return maps3dPromise;
    maps3dPromise = win.google.maps.importLibrary('maps3d').catch(cause => {
      maps3dPromise = undefined;
      throw cause;
    });
    return maps3dPromise;
  }

  function placeCard(place) {
    const card = createElement('article', 'google-place-card');
    const heading = createElement('div', 'google-place-card-heading');
    const titleGroup = doc.createElement('div');
    titleGroup.append(createElement('span', 'google-place-kicker', 'Google Maps listing'), createElement('h3', '', place.name));
    const stateText = place.businessStatus === 'OPERATIONAL' ? 'Open for business'
      : place.businessStatus === 'CLOSED_PERMANENTLY' ? 'Permanently closed'
      : place.businessStatus === 'CLOSED_TEMPORARILY' ? 'Temporarily closed' : 'Status not provided';
    const state = createElement('span', `google-place-status ${place.businessStatus === 'OPERATIONAL' ? 'open' : place.businessStatus.startsWith('CLOSED') ? 'closed' : 'unknown'}`, stateText);
    heading.append(titleGroup, state);
    card.append(heading);

    if (place.phone) {
      const phone = createElement('div', 'google-place-phone');
      const phoneIcon = createElement('span', 'phone-symbol'); phoneIcon.append(icon('phone'));
      phone.append(phoneIcon, createElement('span', '', place.phone));
      const copy = createElement('button'); copy.append(icon('copy'));
      copy.type = 'button'; copy.setAttribute('aria-label', 'Copy Google phone'); copy.title = 'Copy Google phone';
      copy.addEventListener('click', async () => {
        try { await win.navigator.clipboard.writeText(place.phone); copy.textContent = '✓'; }
        catch { copy.textContent = '×'; }
      });
      phone.append(copy);
      const usePhone = createElement('button', 'use-phone', 'Use for company phone');
      usePhone.type = 'button';
      usePhone.addEventListener('click', () => send({ type: 'loadline-map-use-phone', phone: place.phone }));
      phone.append(usePhone);
      card.append(phone);
    }

    if (place.openingHours.length) {
      const hours = createElement('section', 'google-place-hours');
      hours.append(createElement('strong', '', 'Hours'));
      const list = doc.createElement('ul');
      for (const hour of place.openingHours) list.append(createElement('li', '', hour));
      hours.append(list); card.append(hours);
    } else if (!place.phone) {
      card.append(createElement('p', 'google-place-note', 'Google did not return a public phone number or hours.'));
    }

    const footer = createElement('div', 'google-place-card-footer');
    const mapsUrl = safeMapsUrl(place.url);
    if (mapsUrl) {
      const link = createElement('a', '', 'Open listing '); link.append(icon('arrowUpRight'));
      link.href = mapsUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
      footer.append(link);
    } else footer.append(doc.createElement('span'));
    footer.append(createElement('small', '', 'Google status can change.'));
    card.append(footer);
    return card;
  }

  function setSelected(place) {
    selected = place;
    infoWindow?.close();
    if (place && place.latitude !== null && place.longitude !== null && map && infoWindow) {
      infoWindow.setContent(placeCard(place));
      infoWindow.setPosition({ lat: place.latitude, lng: place.longitude });
      infoWindow.open({ map, shouldFocus: false });
    }
  }

  function primaryLocation() {
    return payload?.places.find(place => place.id === payload.primaryId && place.latitude !== null && place.longitude !== null)
      || payload?.places.find(place => place.id === payload.focusedId && place.latitude !== null && place.longitude !== null)
      || payload?.places.find(place => place.latitude !== null && place.longitude !== null);
  }

  function focusedLocation() {
    return payload?.places.find(place => place.id === payload.focusedId && place.latitude !== null && place.longitude !== null)
      || payload?.places.find(place => place.id === payload.primaryId && place.latitude !== null && place.longitude !== null)
      || payload?.places.find(place => place.latitude !== null && place.longitude !== null);
  }

  function render3dMarkers(Marker3DInteractiveElement) {
    for (const marker of markers3d.splice(0)) marker.remove();
    for (const place of payload.places) {
      if (place.latitude === null || place.longitude === null) continue;
      const marker = new Marker3DInteractiveElement({
        position: { lat: place.latitude, lng: place.longitude },
        ...(place.id === payload.primaryId ? { label: '★' } : {}),
        title: `${place.name}${place.id === payload.primaryId ? ' (Primary location)' : ''}`,
        drawsWhenOccluded: true,
      });
      marker.addEventListener('gmp-click', () => {
        send({ type: 'loadline-map-select-place', placeId: place.id, fallback: place });
      });
      map3d.append(marker);
      markers3d.push(marker);
    }
  }

  function render3dPlaceCard() {
    map3dPlaceCard.replaceChildren();
    if (!payload?.selected) {
      map3dPlaceCard.hidden = true;
      return;
    }
    const close = createElement('button', 'map-3d-place-card-close', 'Close');
    close.type = 'button';
    close.addEventListener('click', () => send({ type: 'loadline-map-close-place' }));
    map3dPlaceCard.append(close, placeCard(payload.selected));
    map3dPlaceCard.hidden = false;
  }

  function is3dViewVisible() {
    return Boolean(payload?.is3d) && !map3dNode.hidden;
  }

  async function show3dMap() {
    const { Map3DElement, Marker3DInteractiveElement } = await loadMaps3d();
    const location = focusedLocation();
    if (!location) throw new Error('Add mapped coordinates to use the 3D view.');
    const targetKey = JSON.stringify([location.id, location.latitude, location.longitude]);
    const reuseSettledView = Boolean(map3d) && targetKey === last3dTargetKey && map3dSettled;
    if (!map3d) {
      map3d = new Map3DElement({
        center: { lat: location.latitude, lng: location.longitude, altitude: 0 },
        range: 1400,
        tilt: 66,
        heading: -24,
        mode: 'SATELLITE',
        defaultUIHidden: true,
        gestureHandling: 'GREEDY',
        description: `Photorealistic 3D map of ${payload.accountName}`,
      });
      map3d.addEventListener('gmp-steadychange', event => {
        if (event.isSteady) {
          map3dSettled = true;
          if (!is3dViewVisible()) return;
          status.hidden = true;
          if (map3dReadyTimer) win.clearTimeout(map3dReadyTimer);
          map3dReadyTimer = win.setTimeout(() => {
            if (is3dViewVisible()) send({ type: 'loadline-map-map-ready' });
            map3dReadyTimer = undefined;
          }, 800);
        } else {
          if (!is3dViewVisible()) return;
          map3dSettled = false;
          status.hidden = false;
          if (map3dReadyTimer) win.clearTimeout(map3dReadyTimer);
          map3dReadyTimer = undefined;
        }
      });
      map3d.addEventListener('gmp-click', event => {
        if (!event.placeId) return;
        event.preventDefault();
        send({ type: 'loadline-map-select-place', placeId: event.placeId });
      });
      map3dNode.replaceChildren(map3d);
    } else {
      if (targetKey !== last3dTargetKey) {
        map3dSettled = false;
        map3d.center = { lat: location.latitude, lng: location.longitude, altitude: 0 };
      }
    }
    last3dTargetKey = targetKey;
    if (JSON.stringify([payload.primaryId, payload.places.map(place => [place.id, place.latitude, place.longitude, place.name])]) !== last3dLocationKey) {
      last3dLocationKey = JSON.stringify([payload.primaryId, payload.places.map(place => [place.id, place.latitude, place.longitude, place.name])]);
      render3dMarkers(Marker3DInteractiveElement);
    }
    mapNode.hidden = true;
    map3dNode.hidden = false;
    doc.querySelector('#map-type-toggle').hidden = true;
    render3dPlaceCard();
    if (reuseSettledView) {
      status.hidden = true;
      win.requestAnimationFrame(() => win.requestAnimationFrame(() => {
        if (is3dViewVisible()) send({ type: 'loadline-map-map-ready' });
      }));
    }
  }

  function hide3dMap() {
    const was3dVisible = !map3dNode.hidden;
    if (map3dReadyTimer) win.clearTimeout(map3dReadyTimer);
    map3dReadyTimer = undefined;
    map3dNode.hidden = true;
    mapNode.hidden = false;
    map3dPlaceCard.hidden = true;
    doc.querySelector('#map-type-toggle').hidden = false;
    if (was3dVisible) win.requestAnimationFrame(() => win.requestAnimationFrame(() => send({ type: 'loadline-map-map-ready' })));
  }

  function set3dRange(multiplier) {
    if (!map3d) return;
    map3d.range = Math.max(80, Math.min(100000, (Number(map3d.range) || 1400) * multiplier));
  }

  function updateViewport() {
    if (!map || !payload) return;
    const focus = payload.places.find(place => place.id === payload.focusedId && place.latitude !== null && place.longitude !== null);
    const primary = payload.places.find(place => place.id === payload.primaryId && place.latitude !== null && place.longitude !== null)
      || payload.places.find(place => place.latitude !== null && place.longitude !== null);
    if (focus) { map.setCenter({ lat: focus.latitude, lng: focus.longitude }); map.setZoom(17); return; }
    const located = payload.places.filter(place => place.latitude !== null && place.longitude !== null);
    if (located.length === 1) { map.setCenter({ lat: located[0].latitude, lng: located[0].longitude }); map.setZoom(17); return; }
    if (located.length > 1) {
      const bounds = new win.google.maps.LatLngBounds();
      for (const place of located) bounds.extend({ lat: place.latitude, lng: place.longitude });
      if (!bounds.isEmpty()) map.fitBounds(bounds, 64);
    } else if (primary) map.setCenter({ lat: primary.latitude, lng: primary.longitude });
  }

  function renderMarkers() {
    for (const marker of markers.splice(0)) marker.setMap(null);
    for (const place of payload.places) {
      if (place.latitude === null || place.longitude === null) continue;
      const marker = new win.google.maps.Marker({
        map,
        position: { lat: place.latitude, lng: place.longitude },
        title: `${place.name}${place.id === payload.primaryId ? ' (Primary location)' : ''}`,
        label: place.id === payload.primaryId ? '★' : undefined,
      });
      marker.addListener('click', () => {
        setSelected(place);
        send({ type: 'loadline-map-select-place', placeId: place.id, fallback: place });
      });
      markers.push(marker);
    }
  }

  function syncControls() {
    for (const button of doc.querySelectorAll('[data-map-type]')) {
      button.setAttribute('aria-pressed', String(button.dataset.mapType === payload.mapType));
    }
    const threeDButton = doc.querySelector('#map-3d-toggle');
    threeDButton.disabled = !payload?.places.some(place => place.latitude !== null && place.longitude !== null);
    threeDButton.setAttribute('aria-pressed', String(Boolean(payload.is3d)));
    threeDButton.title = threeDButton.disabled ? 'Add a location with coordinates to use 3D view' : 'Toggle photorealistic 3D view';
    const fullscreenButton = doc.querySelector('#map-fullscreen');
    fullscreenButton.setAttribute('aria-label', doc.fullscreenElement ? 'Exit fullscreen' : 'Toggle fullscreen');
    fullscreenButton.title = doc.fullscreenElement ? 'Exit fullscreen' : 'Toggle fullscreen';
    fullscreenButton.replaceChildren(icon(doc.fullscreenElement ? 'exitFullscreen' : 'fullscreen'));
  }

  async function applyPayload(next) {
    payload = next;
    doc.documentElement.dataset.workspaceScheme = payload.scheme || 'dark';
    wait.hidden = true;
    shell.hidden = false;
    status.hidden = false;
    hideError();
    try {
      await loadMaps(payload.apiKey);
      if (!map) {
        const initial = payload.places.find(place => place.id === payload.focusedId && place.latitude !== null && place.longitude !== null)
          || payload.places.find(place => place.id === payload.primaryId && place.latitude !== null && place.longitude !== null)
          || payload.places.find(place => place.latitude !== null && place.longitude !== null);
        map = new win.google.maps.Map(mapNode, {
          center: initial ? { lat: initial.latitude, lng: initial.longitude } : { lat: 30.2672, lng: -97.7431 },
          zoom: 17,
          mapTypeId: payload.mapType,
          renderingType: win.google.maps.RenderingType.VECTOR,
          gestureHandling: 'greedy', mapTypeControl: false, fullscreenControl: false,
          zoomControl: false, cameraControl: false, streetViewControl: false,
        });
        infoWindow = new win.google.maps.InfoWindow({ maxWidth: 260 });
        infoWindow.addListener('closeclick', () => { selected = null; send({ type: 'loadline-map-close-place' }); });
        map.addListener('click', event => {
          if (!event.placeId) return;
          event.stop(); setSelected(null);
          send({ type: 'loadline-map-select-place', placeId: event.placeId });
        });
        map.addListener('tilesloaded', () => {
          status.hidden = true;
          syncControls();
          send({ type: 'loadline-map-map-ready' });
        });
      }
      const locationKey = JSON.stringify([payload.primaryId, payload.focusedId, payload.places.map(place => [place.id, place.latitude, place.longitude, place.name])]);
      const locationsChanged = locationKey !== lastLocationKey;
      if (locationsChanged) {
        lastLocationKey = locationKey;
        renderMarkers();
        updateViewport();
      }
      map.setMapTypeId(payload.mapType);
      if (payload.is3d) await show3dMap();
      else hide3dMap();
      syncControls();
      selected = payload.selected || null;
      if (payload.is3d) render3dPlaceCard();
      else if (selected) setSelected(selected);
      else infoWindow.close();
    } catch (cause) {
      showError(cause instanceof Error ? cause.message : 'Google Maps could not be loaded. Try again later.');
    }
  }

  doc.querySelectorAll('[data-map-type]').forEach(button => button.addEventListener('click', () => {
    if (!payload) return;
    const mapType = button.dataset.mapType;
    if (mapType !== 'roadmap' && mapType !== 'satellite') return;
    payload = { ...payload, mapType };
    map?.setMapTypeId(mapType); syncControls(); send({ type: 'loadline-map-type', mapType });
  }));
  doc.querySelector('#map-3d-toggle').addEventListener('click', () => {
    if (!payload) return;
    payload = { ...payload, is3d: !payload.is3d };
    status.textContent = 'Loading photorealistic 3D map…';
    status.hidden = !payload.is3d;
    const nextIs3d = Boolean(payload.is3d);
    void (async () => {
      try {
        if (nextIs3d) await show3dMap();
        else hide3dMap();
        syncControls();
        send({ type: 'loadline-map-3d', is3d: nextIs3d });
      } catch (cause) {
        payload = { ...payload, is3d: false };
        hide3dMap();
        status.hidden = true;
        showError(cause instanceof Error ? cause.message : 'Photorealistic 3D Maps could not be loaded.');
        syncControls();
        send({ type: 'loadline-map-3d', is3d: false });
      }
    })();
  });
  doc.querySelector('#map-recenter').addEventListener('click', () => {
    const primary = primaryLocation();
    if (primary && primary.latitude !== null && primary.longitude !== null) {
      if (payload?.is3d && map3d) { map3d.center = { lat: primary.latitude, lng: primary.longitude, altitude: 0 }; map3d.range = 1400; map3d.tilt = 66; map3d.heading = -24; }
      else { map?.panTo({ lat: primary.latitude, lng: primary.longitude }); map?.setZoom(17); }
    }
  });
  doc.querySelector('#map-zoom-in').addEventListener('click', () => payload?.is3d ? set3dRange(0.72) : map?.setZoom(Math.min(21, (map.getZoom() || 17) + 1)));
  doc.querySelector('#map-zoom-out').addEventListener('click', () => payload?.is3d ? set3dRange(1.38) : map?.setZoom(Math.max(2, (map.getZoom() || 17) - 1)));
  doc.querySelector('#map-fullscreen').addEventListener('click', () => {
    if (doc.fullscreenElement) void doc.exitFullscreen(); else void doc.documentElement.requestFullscreen?.();
  });
  doc.addEventListener('fullscreenchange', syncControls);
  doc.querySelector('#map-recenter').append(icon('mapPin'));
  doc.querySelector('#map-zoom-in').append(icon('plus'));
  doc.querySelector('#map-zoom-out').append(icon('minus'));
  win.gm_authFailure = () => showError('Google Maps could not authorize this map. Contact Loadline support if it continues.');
  win.addEventListener('message', event => {
    if (!isTrustedParentMessage(event, win.parent)) return;
    parentOrigin = event.origin;
    if (event.data.type === 'loadline-map-theme') {
      doc.documentElement.dataset.workspaceScheme = event.data.scheme;
      return;
    }
    void applyPayload(event.data.payload);
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') installMapFrame(window, document);
