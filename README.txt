Milo's CivicAPI Connection Test — isolated diagnostic Worker

Deploy as a NEW Cloudflare Worker, not over the existing milos-election-desk Worker.
The wrangler name is milos-civicapi-probe.

Files: worker.js, wrangler.jsonc, public/index.html.
Use a separate GitHub repository and connect it to Cloudflare Workers Builds, with deploy command `npx wrangler deploy` if prompted.

Visit https://milos-civicapi-probe.<your-workers-subdomain>.workers.dev/
Click Run two tests and copy the JSON output back to ChatGPT.

This runs two sequential tests only when clicked:
1. GET https://civicapi.org/api/v2/race/87174
2. GET https://civicapi.org/api/v2/race/search?country=US&province=KY&election_type=General&start_date=2026-11-03&end_date=2026-11-04&limit=20

A 502 from both confirms the Cloudflare-to-CivicAPI problem persists even for a single race. This is a diagnostic, not a production fix.
