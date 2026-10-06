import assert from 'node:assert/strict';
import test from 'node:test';
import { confirmationCopy, consumeAuthReturn, verifySignupAccessToken } from '../auth-return.mjs';

test('signup token verifier asks Supabase for confirmation without caching', async () => {
  let requestUrl = null;
  let options = null;
  const verified = await verifySignupAccessToken('test-access-token', async (url, init) => {
    requestUrl = url;
    options = init;
    return { ok: true, json: async () => ({ email_confirmed_at: '2026-10-06T00:00:00.000Z' }) };
  });
  assert.equal(verified, true);
  assert.equal(requestUrl, 'https://utpmvqdmwelnopcdyfpd.supabase.co/auth/v1/user');
  assert.equal(options.headers.Authorization, 'Bearer test-access-token');
  assert.equal(options.cache, 'no-store');
});

test('signup token verifier rejects users without confirmed email', async () => {
  const verified = await verifySignupAccessToken('test-access-token', async () => ({
    ok: true,
    json: async () => ({ email_confirmed_at: null }),
  }));
  assert.equal(verified, false);
});

test('valid signup token is verified after one-time URL values are removed', async () => {
  let replacement = null;
  const result = await consumeAuthReturn('', '#access_token=private-access&refresh_token=private-refresh&type=signup', () => {
    replacement = '/auth-confirmed.html';
  }, async token => {
    assert.equal(replacement, '/auth-confirmed.html');
    assert.equal(token, 'private-access');
    return true;
  });
  assert.equal(result, 'confirmed');
  assert.equal(replacement, '/auth-confirmed.html');
});

test('a fabricated or invalid access token cannot claim email confirmation', async () => {
  const result = await consumeAuthReturn('', '#access_token=fabricated&type=signup', () => {}, async () => false);
  assert.equal(result, 'error');
  assert.notEqual(confirmationCopy(result).title, 'Your email is confirmed');
});

test('a PKCE code without a local verifier is inconclusive, not confirmation', async () => {
  let replacement = null;
  const result = await consumeAuthReturn('?code=private-one-time-code', '', () => {
    replacement = '/auth-confirmed.html';
  });
  assert.equal(result, 'inconclusive');
  assert.equal(replacement, '/auth-confirmed.html');
  assert.match(confirmationCopy(result).message, /could not verify/i);
});

test('errors use generic copy and do not reflect provider details', async () => {
  let replacement = null;
  const result = await consumeAuthReturn('?error=access_denied&error_description=private+provider+detail', '', () => {
    replacement = '/auth-confirmed.html';
  });
  const copy = confirmationCopy(result);
  assert.equal(result, 'error');
  assert.equal(replacement, '/auth-confirmed.html');
  assert.doesNotMatch(`${copy.title} ${copy.message}`, /private provider detail/);
});

test('direct visits do not claim that an email was confirmed', async () => {
  assert.equal(await consumeAuthReturn('', '', () => assert.fail('must not clear the URL')), null);
  assert.equal(confirmationCopy(null).title, 'No confirmation result found');
});
