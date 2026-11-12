# Loadline product film

The homepage, Why Loadline page, and local `/design-lab/` have an actual Magic UI Hero Video Dialog. It currently opens an explicitly labeled storyboard placeholder. No playable film or simulated recording is presented as real footage.

## Record a 35–45 second screen demonstration

Use the actual Windows Loadline browser with synthetic demonstration records. Close unrelated tabs, dismiss notifications, and hide personal/customer details. Record at 1920 × 1080 or higher, 30 fps, with the browser at a readable 100% scale. Keep the cursor deliberate and pause briefly on each useful action.

| Time | Scene | What should be visible |
| --- | --- | --- |
| 0–8 seconds | Open a company website | Bring that company's Loadline account record into view beside the research. |
| 8–18 seconds | Keep the useful context | Review a contact, a source link, and a short working note. |
| 18–28 seconds | Review the energy details | Show the supplier, renewal date, usage period, and evidence basis using demonstration data. |
| 28–40 seconds | Leave the next action | Create or review an account-linked reminder, then end on the saved record. |

Optional narration: “Start with the company. Keep the people and useful details together. Review the energy context. Leave a clear next action, so you can pick up the conversation with the thread intact.” Describe only actions that actually succeed in the recorded version.

Record the working UI, rather than scrolling through this marketing website. Avoid typing long passages on camera. A short note and one reminder are enough to explain the journey. Leave Intelligence or live voice for a separate demonstration unless the full interaction is verified and readable in the available time.

## Export and replace the placeholder

1. Export H.264 MP4, 1920 × 1080, 30 fps, with web-optimized/fast-start metadata. Aim for roughly 6–8 Mbps and a file under 35 MB for this short recording. This is an export target, not a hard technical limit.
2. Add matching files at `assets/loadline-product-film.mp4` and `public/assets/loadline-product-film.mp4`.
3. Create English WebVTT captions at `assets/loadline-product-film.vtt` and `public/assets/loadline-product-film.vtt`. Include any narration and meaningful audio.
4. In `src/magic-experience.jsx`, set `productFilm.src` to `/assets/loadline-product-film.mp4`. Replace the poster if needed with an actual still from the film and mirror that image into `public/assets`.
5. Run `npm run build`. Test playback, captions, pause, close, Escape, focus return, and phone/iPad presentation in the local preview.

Playback is a self-hosted native `<video>` inside the installed Hero Video Dialog. No third-party embed, account connection, or new frame permission is needed. The existing public release manifest is unrelated to this film and must not be changed for it.
