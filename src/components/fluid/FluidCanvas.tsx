'use client'

import { useEffect, useRef, useState } from 'react'
import { FluidSimulationOGL } from './FluidSimulationOGL'
import { FluidContext } from '@/contexts/FluidContext'
import { MOBILE_BREAKPOINT } from '@/lib/constants'

export default function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sim, setSim] = useState<FluidSimulationOGL | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.innerWidth < MOBILE_BREAKPOINT) return

    let simInstance: FluidSimulationOGL
    try {
      simInstance = new FluidSimulationOGL(canvas)
      simInstance.resize(window.innerWidth, window.innerHeight)
      setSim(simInstance)
    } catch {
      // WebGL unavailable — skip fluid simulation gracefully
      return
    }

    let animationFrameId: number
    const loop = () => {
      simInstance.update()
      animationFrameId = requestAnimationFrame(loop)
    }
    animationFrameId = requestAnimationFrame(loop)

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

      const deltaX = clientX - lastMouse.x
      const deltaY = clientY - lastMouse.y

      lastMouse.x = clientX
      lastMouse.y = clientY

      if (!Math.abs(deltaX) && !Math.abs(deltaY)) return

      // UV position (y flipped to match texture space)
      const uvX = clientX / window.innerWidth
      const uvY = 1 - clientY / window.innerHeight

      simInstance.addSplat(uvX, uvY, deltaX * 5, deltaY * -5)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })

    const onResize = () => {
      simInstance.resize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      setSim(null)
      cancelAnimationFrame(animationFrameId)
      simInstance.destroy()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <FluidContext.Provider value={sim}>
      <canvas
        ref={canvasRef}
        className="canvas-fluid"
        style={{ pointerEvents: "none" }}
      />
    </FluidContext.Provider>
  )
}
