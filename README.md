# Wesley Ramalho — Personal Portfolio

My personal website and portfolio, live at **[wesleyramalho.com](https://wesleyramalho.com)**.

![Preview](public/linkedin.png)

---

## Tech Stack

| Category    | Technology                             |
| ----------- | -------------------------------------- |
| Framework   | Next.js 15 (App Router)                |
| Language    | TypeScript                             |
| Styling     | Tailwind CSS                           |
| Animations  | GSAP 3                                 |
| WebGL       | OGL + custom GLSL shaders              |
| i18n        | next-intl (EN / PT)                    |
| Email       | Resend                                 |
| Fonts       | Montserrat Alternates, Orbitron        |
| Security    | Nonce-based CSP via Next.js middleware |
| Deployment  | Vercel + GitHub Actions                |

---

## Features

- Interactive WebGL fluid simulation reacting to mouse and touch
- GSAP entrance animations with magnetic text repel on the hero
- Fullscreen section-based navigation with smooth fade transitions
- Contact form with client-side validation, 5s undo countdown, and branded email via Resend
- Persistent animated header with circular scroll-progress indicator
- Bilingual support (EN / PT) with live language switching
- Video background on the hero section
- Responsive design with animated mobile navigation
- Fluid typography via CSS `clamp` for seamless scaling
- Custom GLSL shader pipeline (vertex + fragment shaders via OGL)
- Nonce-based Content Security Policy
- Graceful WebGL degradation

---

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
npm test
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable          | Description                                      |
| ----------------- | ------------------------------------------------ |
| `RESEND_API_KEY`  | API key from [resend.com](https://resend.com)    |
| `RESEND_TO_EMAIL` | Email address that receives contact form messages |

---

## Deployment

Deployed to **Vercel** on every push to `main`. Set the environment variables above in your Vercel project settings under **Settings → Environment Variables**.
