require('@testing-library/jest-dom')

// ── GSAP ──────────────────────────────────────────────────────────────────────
const mockTween = { kill: jest.fn(), pause: jest.fn(), play: jest.fn() }
const mockTimeline = () => ({
  to: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  fromTo: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
})

jest.mock('gsap', () => ({
  to: jest.fn(() => mockTween),
  from: jest.fn(() => mockTween),
  fromTo: jest.fn(() => mockTween),
  set: jest.fn(() => mockTween),
  timeline: jest.fn(mockTimeline),
}))

// ── next-intl ─────────────────────────────────────────────────────────────────
const MOCK_MESSAGES = {
  nav: {
    aboutMe: 'about me',
    experiences: 'experiences',
    projects: 'projects',
    education: 'education',
    contact: 'contact',
  },
  header: {
    jobTitle: 'Senior Software Engineer',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close menu',
  },
  hero: {
    jobTitle: 'Senior Software Engineer',
    scroll: 'scroll',
  },
  about: {
    jobTitle: 'Senior Software Engineer',
    location: 'São Paulo, BR',
    aiSpecialist: 'AI Specialist',
    frontend: 'Frontend',
    bio: 'I am a software engineer with {years}+ years of experience.',
  },
  experiences: {
    title: 'Experiences',
    items: [
      { role: 'Senior Software Engineer (Front-end focused)', description: ['Reduced client bundle size.'] },
      { role: 'Senior Software Engineer (Front-end focused)', description: ['Led feature enhancements.'] },
      { role: 'Senior Front-end Engineer (Front-end focused)', description: ['Integrated NFTs.'] },
      { role: 'Senior Front-end Engineer', description: ['Developed code.'] },
      { role: 'Senior Front-end Developer (Front-end focused)', description: ['Developed NFT app.'] },
      { role: 'Front-end Developer', description: ['Implemented micro front-end components.'] },
      { role: 'Front-end Developer', description: ['Implemented 3 projects.'] },
      { role: 'Software Development Intern', description: ['Worked with front-end development.'] },
    ],
  },
  projects: {
    title: 'Projects',
    live: 'Live',
    archived: 'Archived',
    items: [
      { title: 'MYPDFCV', description: 'A resume builder with multiple ATS-friendly templates.' },
      { title: 'iCarros', description: 'One of Brazil\'s largest vehicle e-commerce platforms.' },
      { title: 'Zappos (Marty Initiative)', description: 'Led feature enhancements for the Marty initiative at Zappos.' },
    ],
  },
  education: {
    title: 'Education',
    items: [
      { degree: 'Postgraduate Degree – Artificial Intelligence and Machine Learning' },
      { degree: 'System Analysis and Development' },
      { degree: 'Multi-platform Development (Web and Mobile)' },
      { degree: 'Technical Degree in Administration, Marketing' },
      { degree: 'High School' },
    ],
  },
}

jest.mock('next-intl', () => ({
  useTranslations: (namespace) => {
    const ns = MOCK_MESSAGES[namespace] || {}
    const t = (key, params) => {
      const value = ns[key]
      if (typeof value === 'string' && params) {
        return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ''))
      }
      return typeof value === 'string' ? value : key
    }
    t.raw = (key) => ns[key] || []
    return t
  },
  NextIntlClientProvider: ({ children }) => children,
}))

// ── react-google-recaptcha-v3 ────────────────────────────────────────────────
jest.mock('react-google-recaptcha-v3', () => ({
  GoogleReCaptchaProvider: ({ children }) => children,
  useGoogleReCaptcha: () => ({ executeRecaptcha: jest.fn().mockResolvedValue('mock-token') }),
}))

// ── Browser APIs ───────────────────────────────────────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.requestAnimationFrame = jest.fn(() => 0)
global.cancelAnimationFrame = jest.fn()

