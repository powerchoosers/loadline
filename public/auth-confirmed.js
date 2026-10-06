import { confirmationCopy, consumeAuthReturn, verifySignupAccessToken } from './auth-return.mjs';

// Clear one-time auth data before validating the signup token with Supabase.
const result = await consumeAuthReturn(window.location.search, window.location.hash, () => {
  window.history.replaceState({}, document.title, window.location.pathname);
}, verifySignupAccessToken);

const title = document.querySelector('#confirmation-title');
const message = document.querySelector('#confirmation-message');
const next = document.querySelector('#confirmation-next');
const copy = confirmationCopy(result);
title.textContent = copy.title;
message.textContent = copy.message;
next.textContent = copy.next;
