'use client'

import { createContext, useContext, useState } from 'react'

interface MacBookTransitionContextValue {
  progress: number
  setProgress: (p: number) => void
}

const MacBookTransitionContext = createContext<MacBookTransitionContextValue>({
  progress: 0,
  setProgress: () => {},
})

export function MacBookTransitionProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0)
  return (
    <MacBookTransitionContext.Provider value={{ progress, setProgress }}>
      {children}
    </MacBookTransitionContext.Provider>
  )
}

export const useMacBookTransition = () => useContext(MacBookTransitionContext)
