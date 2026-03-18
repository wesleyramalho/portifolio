export const NAV_ITEMS = [
  { key: 'aboutMe', index: 1 },
  { key: 'experiences', index: 2 },
  { key: 'education', index: 3 },
] as const

export type NavKey = typeof NAV_ITEMS[number]['key']
