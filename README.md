# Wesley Ramalho — Personal Portfolio

My personal website and portfolio, live at **[wesleyramalho.com](https://wesleyramalho.com)**.

![Preview](public/linkedin.png)

---

## About

Personal portfolio for Wesley Ramalho, a Senior Software Engineer & AI Specialist with 9+ years of experience building high-performance web applications. The site showcases my work history, education, and technical skills through an interactive, animation-driven experience.

---

## Tech Stack

| Category   | Technology                             |
| ---------- | -------------------------------------- |
| Framework  | Next.js 15 (App Router)                |
| Language   | TypeScript                             |
| Styling    | Tailwind CSS                           |
| Animations | GSAP 3                                 |
| WebGL      | OGL + custom GLSL shaders              |
| i18n       | next-intl (EN / PT)                    |
| Fonts      | Montserrat Alternates, Orbitron        |
| Security   | Nonce-based CSP via Next.js middleware |
| Deployment | GitHub Pages (GitHub Actions)          |

---

## Features

- Interactive WebGL fluid simulation that reacts to mouse and touch movement
- GSAP-powered entrance animations with magnetic text repel effect on the hero
- Fullscreen section-based scroll with smooth fade transitions
- Persistent animated header with circular scroll-progress indicator
- Bilingual support (EN / PT) with live language switching
- Video background on the hero section
- Responsive design with animated mobile navigation menu
- Fluid typography using CSS `clamp` for seamless scaling across all screen sizes
- Custom GLSL shader pipeline (vertex + fragment shaders via OGL)
- Nonce-based Content Security Policy for improved security
- Graceful degradation when WebGL is unavailable

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata, OG image, CSP nonce
│   ├── page.tsx            # Homepage — SectionsContainer with all sections
│   ├── globals.css         # CSS variables, fluid typography, base styles
│   └── opengraph-image.tsx # Dynamic OG image generation
├── components/
│   ├── sections/
│   │   ├── Hero.tsx        # Animated name, video background, mouse repel
│   │   ├── About.tsx       # About me section with bio
│   │   ├── Experiences.tsx # Work history
│   │   └── Education.tsx   # Academic background
│   ├── ui/
│   │   ├── Nav.tsx                # Desktop navigation
│   │   ├── PersistentHeader.tsx   # Mobile header with animated hamburger
│   │   ├── CircleProgress.tsx     # Circular section progress indicator
│   │   ├── GlassCard.tsx          # Glassmorphism card component
│   │   ├── SectionHeading.tsx     # Shared h2 heading for content sections
│   │   ├── VideoBackground.tsx    # Hero video background
│   │   └── LanguageSwitcher.tsx   # EN / PT toggle buttons
│   ├── fluid/
│   │   ├── FluidCanvas.tsx        # WebGL canvas + mouse/touch interaction
│   │   └── FluidSimulationOGL.ts  # OGL fluid simulation (GLSL shaders)
│   ├── IntlProvider.tsx       # next-intl client provider
│   └── SectionsContainer.tsx  # Fullscreen scroll/snap manager
├── contexts/
│   ├── LocaleContext.tsx   # Locale state + localStorage persistence
│   ├── FluidContext.tsx    # Provides fluid sim instance to children
│   └── SectionContext.tsx  # Provides active section index/navigation
├── hooks/
│   └── useEntranceAnimation.ts  # Reusable GSAP section entrance animation
├── lib/
│   ├── constants.ts    # Simulation parameters, breakpoints
│   └── navigation.ts   # Shared NAV_ITEMS used by Nav and PersistentHeader
└── middleware.ts        # Per-request CSP nonce generation
messages/
├── en.json             # English translations
└── pt.json             # Portuguese translations
```

---

## Getting Started

```bash
npm install
npm run dev      # starts dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
npm test         # run unit tests (Jest + Testing Library)
```

---

## Deployment

The site is automatically deployed to GitHub Pages on every push to `main` via GitHub Actions (`.github/workflows/nextjs.yml`). The live version is always available at [wesleyramalho.com](https://wesleyramalho.com).
