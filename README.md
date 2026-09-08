# Loadline public website

Independent static marketing site. It contains no workspace application, customer data, credentials, or account access.

Pages: `/`, `/download/`, `/workspaces/`.

Preview from the project root with `node workspace-ui/node_modules/vite/bin/vite.js marketing --host 127.0.0.1 --port 5175`.
Build with `node workspace-ui/node_modules/vite/bin/vite.js build marketing --outDir ../build/marketing`.
Vercel root directory: `marketing`. Static source can also be served directly with the provided rewrites.

The public installer is not available in the project downloads directory. The download page intentionally reports this instead of serving an unverified executable or collecting emails without a backend. Replace this availability state with a verified HTTPS release URL, version, requirements and checksum when the release is approved.

Brand: `extension/brand/loadline.svg`. Screenshot: supplied real Windows browser screenshot, copied without alteration. Manrope: locally hosted from existing workspace dependency; license included.

Design references inspected on Mobbin: https://mobbin.com/sites/sections/d5d45b77-5ade-432e-8093-994917105c34 and https://mobbin.com/sites/sections/f90bd9d9-1e62-49d6-9d03-f1a30446257d. Borrowed product screenshot prominence and clear download hierarchy, not their assets or branding.
