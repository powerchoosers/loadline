const supabaseUrl = 'https://utpmvqdmwelnopcdyfpd.supabase.co';
const publishableKey = 'sb_publishable_25JTKJORzIPboxqx19c6Ew_mtUnjpco';

export async function verifySignupAccessToken(accessToken, request = fetch) {
  const response = await request(supabaseUrl + '/auth/v1/user', {
    headers: { apikey: publishableKey, Authorization: 'Bearer ' + accessToken },
    cache: 'no-store',
  });
  if (!response.ok) return false;
  const user = await response.json().catch(() => null);
  return Boolean(user?.email_confirmed_at);
}

export async function consumeAuthReturn(search, hash, clearUrl, verifySignupToken = async () => false) {
  const query = new URLSearchParams(search);
  const fragment = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const hasError = ['error', 'error_code', 'error_description'].some(key => query.has(key) || fragment.has(key));
  const accessToken = fragment.get('access_token');
  const isSignupRedirect = fragment.get('type') === 'signup';
  const hasAuthResult = hasError || query.has('code') || fragment.has('access_token') || fragment.has('refresh_token') || fragment.has('type');

  if (hasAuthResult && (search || hash)) clearUrl();
  if (hasError) return 'error';
  if (accessToken && isSignupRedirect) {
    try {
      return await verifySignupToken(accessToken) ? 'confirmed' : 'error';
    } catch {
      return 'error';
    }
  }
  if (query.has('code') || isSignupRedirect) return 'inconclusive';
  return null;
}

export function confirmationCopy(result) {
  if (result === 'confirmed') {
    return {
      title: 'Your email is confirmed',
      message: 'Your Loadline account is ready. Return to Loadline and sign in to connect your cloud workspace.',
      next: 'This page confirms your email; it does not sign you in on this browser.',
    };
  }
  if (result === 'error') {
    return {
      title: 'We could not verify this confirmation',
      message: 'The link may have expired or already been used. Return to Loadline and sign in, or request a fresh confirmation link.',
      next: 'This page does not sign you in on this browser.',
    };
  }
  if (result === 'inconclusive') {
    return {
      title: 'Finish signing in with Loadline',
      message: 'This browser could not verify the confirmation response. Return to Loadline and try signing in; if it still asks you to confirm, request a new link.',
      next: 'This page does not sign you in on this browser.',
    };
  }
  return {
    title: 'No confirmation result found',
    message: 'Open Loadline and try your confirmation link again, or sign in if you have already confirmed your email.',
    next: 'You can also get Loadline for Windows below.',
  };
}
