'use client'

import { useEffect, useRef } from 'react'
import { FluidSimulationOGL } from './FluidSimulationOGL'
import { MOBILE_BREAKPOINT } from '@/lib/constants'

export default function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.innerWidth < MOBILE_BREAKPOINT) return

    const sim = new FluidSimulationOGL(canvas)
    sim.resize(window.innerWidth, window.innerHeight)

    let rafId: number
    const loop = () => {
      sim.update()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    const lastMouse = { x: 0, y: 0, init: false }

    const onMove = (e: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number

      if ('touches' in e) {
        if (e.touches.length === 0) return
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      if (!lastMouse.init) {
        lastMouse.x = clientX
        lastMouse.y = clientY
        lastMouse.init = true
        return
      }

      const dx = clientX - lastMouse.x
      const dy = clientY - lastMouse.y

      lastMouse.x = clientX
      lastMouse.y = clientY

      if (!Math.abs(dx) && !Math.abs(dy)) return

      // UV position (y flipped to match texture space)
      const x = clientX / window.innerWidth
      const y = 1 - clientY / window.innerHeight

      // Multiply here — identical to original Canvas.js updateMouse
      sim.addSplat(x, y, dx * 5, dy * -5)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })

    const onResize = () => {
      sim.resize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      sim.destroy()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
        mixBlendMode: 'screen',
      }}
    />
  )
}
