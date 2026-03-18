# Wesley Ramalho — Personal Portfolio

My personal website and portfolio, live at **[wesleyramalho.com](https://wesleyramalho.com)**.

![Preview](public/linkedin.png)

---

## About

Personal portfolio for Wesley Ramalho, a Senior Software Engineer with 9+ years of experience building high-performance web applications. The site showcases my work history, education, and technical skills through an interactive, animation-driven experience.

---

## Tech Stack

| Category   | Technology                      |
| ---------- | ------------------------------- |
| Framework  | Next.js 14 (App Router)         |
| Language   | TypeScript                      |
| Styling    | Tailwind CSS                    |
| Animations | GSAP 3                          |
| WebGL      | OGL + custom GLSL shaders       |
| Fonts      | Montserrat Alternates, Orbitron |
| Deployment | GitHub Pages (GitHub Actions)   |

---

## Features

- Interactive WebGL fluid simulation that reacts to mouse and touch movement
- GSAP-powered entrance animations with magnetic text repel effect on the hero
- Fullscreen section-based scroll with smooth fade transitions
- Persistent animated header with circular scroll-progress indicator
- Video background on the hero section
- Responsive design with animated mobile navigation menu
- Fluid typography using CSS `clamp` for seamless scaling across all screen sizes
- Custom GLSL shader pipeline (vertex + fragment shaders via OGL)
- Graceful degradation when WebGL is unavailable

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata, OG image
│   ├── page.tsx            # Homepage — SectionsContainer with all sections
│   ├── globals.css         # CSS variables, fluid typography, base styles
│   └── opengraph-image.tsx # Dynamic OG image generation
├── components/
│   ├── sections/
│   │   ├── Hero.tsx        # Animated name, video background, mouse repel
│   │   ├── About.tsx       # About me section
│   │   ├── Experiences.tsx # Work history
│   │   └── Education.tsx   # Academic background
│   ├── ui/
│   │   ├── Nav.tsx                # Desktop navigation
│   │   ├── PersistentHeader.tsx   # Mobile header with animated hamburger
│   │   ├── CircleProgress.tsx     # Circular section progress indicator
│   │   ├── GlassCard.tsx          # Glassmorphism card component
│   │   ├── SectionHeading.tsx     # Shared h2 heading for content sections
│   │   └── VideoBackground.tsx    # Hero video background
│   ├── fluid/
│   │   ├── FluidCanvas.tsx        # WebGL canvas + mouse/touch interaction
│   │   └── FluidSimulationOGL.ts  # OGL fluid simulation (GLSL shaders)
│   └── SectionsContainer.tsx      # Fullscreen scroll/snap manager
├── contexts/
│   ├── FluidContext.tsx    # Provides fluid sim instance to children
│   └── SectionContext.tsx  # Provides active section index/navigation
├── hooks/
│   └── useEntranceAnimation.ts  # Reusable GSAP section entrance animation
└── lib/
    ├── constants.ts    # Simulation parameters (resolution, dissipation…)
    └── navigation.ts   # Shared NAV_ITEMS used by Nav and PersistentHeader
```

---

## Getting Started

```bash
npm install
npm run dev      # starts dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

---

## Deployment

The site is automatically deployed to GitHub Pages on every push to `main` via GitHub Actions (`.github/workflows/nextjs.yml`). The live version is always available at [wesleyramalho.com](https://wesleyramalho.com).
