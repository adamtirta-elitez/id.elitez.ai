# Elitez Indonesia — id.elitez.ai

Official website for **Elitez Indonesia** (PT Elit Indonesia Grup), part of the [Elitez Group of Companies](https://www.elitez.asia/).

Contact: **Adam Tirta** — Country Director  
Email: adam.tirta@elitez.asia  
ATS: https://ats.elitez.ai

---

## Project Structure

```
elitez-indonesia/
├── index.html          # Main website (self-contained single-page app)
├── README.md           # This file
├── api/
│   ├── submit-cv.js    # CV submission endpoint (Node.js/Express)
│   ├── hire-talent.js  # Hire Talent enquiry endpoint
│   └── config.js       # Environment config (email, ATS API keys)
├── .env.example        # Environment variable template
├── .gitignore
└── package.json        # For API server dependencies
```

---

## What's included

### Website (`index.html`)
A fully self-contained single-page website with:
- **Hero** — brand, stats, service cards
- **Services** — 6 service cards (recruitment, EOR, outsourcing, payroll parking, freelance, HRIS)
- **Industry Expertise** — 8 sectors with typical roles
- **Client Logo Wall** — Unilever, Nestlé, Shopee, Decathlon, Sembcorp + 7 text clients
- **Why Elitez** — 4 human-written value propositions
- **HRIS Platform** — 5 tabbed modules (payroll, leave, attendance, freelance, worksheet) with live demo UI
- **Indonesia Labour Law** — complete UMP 2026 table (all 38 provinces), 8 regulation cards, updated for PP 49/2025
- **Gross ↔ Net Payroll Calculator** — live JS calculator with 2026 BPJS/PPh 21 rates
- **Leadership Team** — Derrick Teo, Yvonne Tan, Wayne Chen, Adam Tirta
- **Locations** — 6 Elitez Group markets
- **Insights** — 3 market update cards
- **FAQ** — 10 expandable accordion items
- **Hire Talent** — dedicated employer section with Adam's contact + enquiry form
- **Submit CV** — dedicated job seeker section with file upload + ATS sync
- **Contact** — full contact form
- **Footer** — with Elitez Group logo, nav links

### Branding
- Primary: **Orange** `#E8690A` (Elitez brand colour)
- Secondary: **Navy** `#1B3A5C`
- Logos: Elitez Indonesia + Elitez Group embedded as base64 (no external dependency)

---

## API Integration

### 1. CV Submission → ATS

The Submit CV form (`#submit-cv`) needs a backend endpoint to:
1. Receive multipart form data (name, email, phone, industry, type, note + CV file)
2. Forward CV + details to `adam.tirta@elitez.asia`
3. POST candidate record to `https://ats.elitez.ai` API

Wire it up in `index.html` by replacing `submitCv()`:

```javascript
async function submitCv() {
  const formData = new FormData();
  formData.append('name', document.getElementById('cv-name').value);
  formData.append('email', document.getElementById('cv-email').value);
  formData.append('phone', document.getElementById('cv-phone').value);
  formData.append('location', document.getElementById('cv-location').value);
  formData.append('jobTitle', document.getElementById('cv-jobtitle').value);
  formData.append('industry', document.getElementById('cv-industry').value);
  formData.append('opportunityType', document.getElementById('cv-type').value);
  formData.append('note', document.getElementById('cv-note').value);
  formData.append('cv', document.getElementById('cvUpload').files[0]);

  const res = await fetch('/api/submit-cv', { method: 'POST', body: formData });
  if (res.ok) {
    document.getElementById('cvFormWrap').style.display = 'none';
    document.getElementById('cvSuccess').style.display = 'block';
  }
}
```

### 2. Hire Talent Enquiry → Email

The Hire Talent form (`#hire-talent`) sends JSON to `/api/hire-talent`:

```javascript
async function submitHireTalent() {
  const payload = {
    name: document.getElementById('ht-name').value,
    company: document.getElementById('ht-company').value,
    email: document.getElementById('ht-email').value,
    phone: document.getElementById('ht-phone').value,
    service: document.getElementById('ht-service').value,
    message: document.getElementById('ht-msg').value,
  };
  const res = await fetch('/api/hire-talent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    document.getElementById('ht-confirm-email').textContent = payload.email;
    document.getElementById('hireTalentFormWrap').style.display = 'none';
    document.getElementById('hireTalentSuccess').style.display = 'block';
  }
}
```

---

## Deployment

### Option A — Static hosting (Cloudflare Pages / Vercel / Netlify)
The site is a single `index.html` — deploy it directly. No build step needed.

```bash
# Vercel
vercel deploy index.html

# Netlify drag-and-drop
# Upload the index.html file at app.netlify.com/drop

# Cloudflare Pages
# Connect this GitHub repo → build output: /
```

Point your DNS `id.elitez.ai` → hosting provider CNAME.

### Option B — With API server (Node.js)
```bash
npm install
cp .env.example .env
# Fill in SMTP credentials and ATS API key
node api/server.js
```

---

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `SMTP_HOST` | Mail server (e.g. smtp.gmail.com) |
| `SMTP_PORT` | Mail port (587 for TLS) |
| `SMTP_USER` | Sending email address |
| `SMTP_PASS` | SMTP password / app password |
| `NOTIFY_EMAIL` | adam.tirta@elitez.asia |
| `ATS_API_URL` | https://ats.elitez.ai/api |
| `ATS_API_KEY` | API key from ats.elitez.ai |

---

## Licence

© 2026 PT Elit Indonesia Grup. All rights reserved.  
Part of [Elitez Group of Companies](https://www.elitez.asia/).
