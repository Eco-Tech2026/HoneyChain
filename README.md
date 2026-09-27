# TraceGuard

**Know where your email is exposed. Protect what matters.**

TraceGuard is a full-stack email exposure & security scanner. It checks an email
address against legitimate, public security sources — known breach databases,
public web exposure, and domain-level mail security — and returns a
plain-language, transparent report.

TraceGuard is **not** an account-hacking or account-enumeration tool. It never
attempts logins, password guesses, credential stuffing, or access to private
accounts. See [Architecture & safety boundaries](#security-considerations) below.

---

## 1. Project overview

| | |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Data sources | Have I Been Pwned (breaches), an optional public search API, public DNS |
| Default mode | **Demo mode** — works out of the box with no API keys |

## 2. Features

- Email format validation with inline, real-time feedback
- Consent step before any scan runs
- Animated, staged scan progress that reflects real backend stages
- Confirmed-breach detection via Have I Been Pwned (never displays actual
  passwords/credentials — only category labels)
- Domain security checks (MX, SPF, DMARC, HTTPS) via real DNS lookups
- Public web exposure lookup via an optional, pluggable search API
- Transparent, explainable exposure score with a full point breakdown
- Clear three-way service categorization: **Confirmed / Public association /
  Unable to verify** — never an inferred "you have an account here"
- Plain-language security recommendations
- Built-in, clearly labeled **Demo Mode** for development without API keys
- Backend rate limiting, input sanitization, security headers, CORS
- Emails are masked everywhere (`na****@gmail.com`) — including in logs — and
  never appear in a URL
- Automated tests for validation, masking, risk scoring, and rate limiting

## 3. Architecture

```
Landing Page → Email Input → Consent → Scan Animation → Results Dashboard
```

```
ScanController
      ↓
ScanService
      ├── BreachScanner          (Have I Been Pwned / demo)
      ├── PasteExposureScanner   (pluggable provider / demo)
      ├── DomainScanner          (real DNS: MX, SPF, DMARC, HTTPS)
      ├── ReputationScanner      (confirmed / public / unverifiable)
      └── PublicMentionScanner   (pluggable search API / demo)
```

Each scanner is independent, so a provider can be added, replaced, or removed
without touching the orchestration logic in `ScanService`.

## 4. Tech stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Lucide React icons, Recharts
**Backend:** Node.js, Express, helmet, express-rate-limit, cors, validator
**Testing:** Jest, Supertest

## 5. Project structure

```
traceguard/
├── client/                # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       └── utils/
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── scanners/
│   │   ├── middleware/
│   │   └── utils/
│   └── tests/
├── .env.example
└── package.json
```

## 6. Installation

Requires **Node.js 18+**.

```bash
git clone <this-repo>
cd traceguard
cp .env.example .env
npm run install:all
```

`npm run install:all` installs both `server/` and `client/` dependencies. You
can also install them individually with `npm install --prefix server` and
`npm install --prefix client`.

## 7. Environment variables

Copy `.env.example` to `.env` in the project root (the server reads from
here) and fill in what you have. **Every field is optional** — with nothing
filled in, TraceGuard runs entirely in Demo Mode.

| Variable | Purpose |
|---|---|
| `PORT` | Backend port (default `4000`) |
| `CLIENT_ORIGIN` | Allowed CORS origin for the frontend |
| `DEMO_MODE` | `true` to force simulated data regardless of API keys |
| `HIBP_API_KEY` | [Have I Been Pwned](https://haveibeenpwned.com/API/Key) API key |
| `SEARCH_API_KEY` / `SEARCH_API_URL` | Any public-search provider (e.g. Bing Web Search, SerpAPI) for the Public Exposure scanner |
| `DISPOSABLE_EMAIL_API_KEY` | Optional disposable-email-detection provider |
| `DATABASE_URL` | Only needed if you enable persistent storage |
| `JWT_SECRET` | Reserved for future auth features |
| `RATE_LIMIT_WINDOW_MINUTES` / `RATE_LIMIT_MAX_SCANS_PER_IP` | Backend rate limiting |

**Never commit your real `.env` file.**

## 8. API setup

To run with real breach data:

1. Get a key at https://haveibeenpwned.com/API/Key
2. Set `HIBP_API_KEY=your-key` in `.env`
3. Set `DEMO_MODE=false`

Without a key, or with `DEMO_MODE=true`, the app automatically falls back to
clearly labeled demo data — real and simulated data are never mixed.

## 9. Running locally

From the project root:

```bash
npm run dev
```

This runs the backend (`http://localhost:4000`) and frontend
(`http://localhost:5173`) together. Open `http://localhost:5173` in your
browser.

To run them separately:

```bash
npm run dev:server   # backend only
npm run dev:client   # frontend only
```

Run the backend test suite:

```bash
npm run test:server
```

## 10. Demo mode

With `DEMO_MODE=true` (or simply no `HIBP_API_KEY` set), every scan returns
sample breach, exposure, and domain-security data. The Results dashboard
displays a persistent "Demo mode" banner whenever simulated data is shown, so
it is never mistaken for a real result.

## 11. Deployment

- **Frontend:** `npm run build --prefix client` produces a static build in
  `client/dist/`, deployable to Netlify, Vercel, or any static host.
- **Backend:** deploy `server/` to Render, Railway, Fly.io, or similar. Set
  the environment variables from step 7 in your hosting provider's dashboard.
- **Database:** only needed if you add persistent storage; MongoDB Atlas free
  tier is sufficient for light use.

Remember to set `CLIENT_ORIGIN` on the backend to your deployed frontend URL,
and point the frontend's `VITE_API_BASE_URL` at your deployed backend.

## 12. Security considerations

TraceGuard's architecture enforces the following boundaries — they are not
just policy, they are how the code is written:

- No login attempts, password guessing, credential stuffing, account
  enumeration, password-reset probing, OTP interception, session/cookie
  extraction, CAPTCHA bypass, or authentication bypass of any kind.
- Actual passwords, password hashes, tokens, or cookies are never returned or
  displayed — `BreachScanner` sanitizes every breach's data-category list
  down to labels like "Password-related data was included."
- All external data comes from legitimate providers, respecting their API
  terms, rate limits, and `robots.txt` where applicable.
- The backend applies Helmet security headers, strict CORS, JSON body-size
  limits, per-IP rate limiting, and input validation on every request.
- API keys are read only from environment variables and are never
  hard-coded or sent to the client.

## 13. Privacy considerations

- Email addresses are never appended to URLs — they travel only in POST
  request bodies.
- Every log line masks the email (`na****@gmail.com`); see
  `server/src/utils/logger.js` and `emailUtils.js`.
- Scan results and email addresses are not persisted by default.
- No raw email address is ever sent to a third-party analytics provider.

## 14. Limitations

- A scan can only surface what legitimate, public, or licensed sources
  currently expose — it cannot guarantee discovery of every place an email
  has ever been used.
- The exposure score is an informational heuristic, not a certified or
  scientific security rating.
- DKIM cannot be reliably checked via DNS alone (it depends on a
  provider-specific selector), so it is reported as "Could not verify" rather
  than guessed.
- Paste-exposure and public-search checks are only as complete as whichever
  provider you configure; without one, those sections report themselves as
  unavailable rather than silently returning nothing.

## 15. Future improvements

- Optional OAuth-based "Connect your account" flow (Google, Microsoft, etc.)
  so users can voluntarily check permitted account-security signals directly
  — never their passwords.
- Persistent, opt-in scan history.
- Additional legitimate breach and paste-data providers.
- Scheduled re-scans with change notifications.

---

*TraceGuard exposure score — an informational indicator, not a definitive
security rating.*
