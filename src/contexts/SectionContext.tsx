'use client'

import { createContext, useContext } from 'react'

export interface SectionContextValue {
  isActive: boolean
  index: number
  gotoSection: (i: number) => void
}

export const SectionContext = createContext<SectionContextValue>({
  isActive: false,
  index: 0,
  gotoSection: () => {},
})

export const useSectionContext = () => useContext(SectionContext)
