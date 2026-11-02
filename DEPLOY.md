# Deployment Guide — Elitez Indonesia (id.elitez.ai)

## Option A — Cloudflare Pages (Recommended — Free, global CDN)

1. Push this repo to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. Connect your GitHub account → select this repo
4. Build settings:
   - **Build command:** *(leave blank — static site)*
   - **Build output directory:** `/`
5. Deploy → Cloudflare gives you a `.pages.dev` URL instantly
6. Add custom domain: Settings → Custom Domains → `id.elitez.ai`
7. Update DNS at your domain registrar:
   ```
   CNAME  id  <your-project>.pages.cloudflare.com
   ```

> For the API (CV + Hire Talent forms): deploy the `/api` folder as **Cloudflare Workers** or use a separate service (Railway, Render, etc.) and update the `fetch('/api/...')` URLs in `index.html` to point to that service.

---

## Option B — Vercel

```bash
npm install -g vercel
vercel login
vercel deploy
```

For API routes, Vercel automatically picks up `/api/*.js` as serverless functions.  
Add environment variables at: vercel.com → Project → Settings → Environment Variables.

---

## Option C — Netlify

1. Drag and drop `index.html` at [app.netlify.com/drop](https://app.netlify.com/drop) — instant deploy
2. For API: use Netlify Functions (put handlers in `/netlify/functions/`)
3. Custom domain: Site Settings → Domain Management → `id.elitez.ai`

---

## Option D — Self-hosted VPS (Node.js)

```bash
# On your server (Ubuntu)
git clone https://github.com/your-org/elitez-indonesia.git
cd elitez-indonesia
npm install
cp .env.example .env
nano .env           # Fill in SMTP and ATS credentials
node api/server.js  # Or use PM2 for production

# With PM2 (process manager)
npm install -g pm2
pm2 start api/server.js --name "elitez-indonesia"
pm2 save
pm2 startup

# Nginx reverse proxy (proxy port 3000 → id.elitez.ai)
# Add to /etc/nginx/sites-available/id.elitez.ai:
# server {
#   listen 80;
#   server_name id.elitez.ai;
#   location / { proxy_pass http://localhost:3000; }
# }
```

---

## API Integration with ats.elitez.ai

1. Log in to **ats.elitez.ai**
2. Go to Settings → API → Generate API Key
3. Copy the key into your `.env` file as `ATS_API_KEY`
4. The `/api/submit-cv` endpoint will POST each CV submission as a candidate record

---

## DNS Records Summary

| Type | Name | Value |
|------|------|-------|
| CNAME | id | your-hosting-cname |
| MX | @ | *(keep existing mail records)* |

