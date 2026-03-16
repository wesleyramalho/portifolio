'use client'

import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'

export function useGSAP(
  fn: () => void,
  scope?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const ctx = gsap.context(fn, scope?.current ?? undefined)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
