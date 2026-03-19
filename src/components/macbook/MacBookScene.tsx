'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { useMacBookTransition } from '@/contexts/MacBookTransitionContext'
import { MOBILE_BREAKPOINT } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Camera keyframes — camera orbits around the MacBook, then zooms into screen.
// All rotY = 0 (model stays still, camera moves).
// Y target values are calibrated to the screen center once the model loads.
// ---------------------------------------------------------------------------
const KEYFRAMES = [
  // 0. Front view — first impression
  { p: 0.00, pos: [0, 0.5, 3.5],    target: [0, 0.3, 0],  rotY: 0 },
  // 1. Orbit left — show left profile
  { p: 0.20, pos: [-3.5, 0.8, 1.5], target: [0, 0.3, 0],  rotY: 0 },
  // 2. Continue orbit — show top/back of lid
  { p: 0.38, pos: [-1.0, 2.2, -2.5], target: [0, 0.4, 0], rotY: 0 },
  // 3. Swing to right — show right profile
  { p: 0.55, pos: [3.2, 0.7, 1.2],  target: [0, 0.3, 0],  rotY: 0 },
  // 4. Return front, raise camera to align with screen
  { p: 0.70, pos: [0, 0.42, 2.8],   target: [0, 0.42, 0], rotY: 0 },
  // 5. Approach
  { p: 0.85, pos: [0, 0.42, 1.0],   target: [0, 0.42, 0], rotY: 0 },
  // 6. Very close — screen fills viewport; canvas fades out → About section appears
  { p: 1.00, pos: [0, 0.42, 0.18],  target: [0, 0.42, 0], rotY: 0 },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function sampleKeyframes(progress: number) {
  let lo = KEYFRAMES[0]
  let hi = KEYFRAMES[KEYFRAMES.length - 1]
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (progress >= KEYFRAMES[i].p && progress <= KEYFRAMES[i + 1].p) {
      lo = KEYFRAMES[i]
      hi = KEYFRAMES[i + 1]
      break
    }
  }
  const span = hi.p - lo.p
  const t = span === 0 ? 1 : smoothstep(lo.p, hi.p, progress)

  const pos = lo.pos.map((v, i) => lerp(v, hi.pos[i], t))
  const target = lo.target.map((v, i) => lerp(v, hi.target[i], t))
  const rotY = lerp(lo.rotY, hi.rotY, t)
  return { pos, target, rotY }
}

function canvasOpacity(progress: number) {
  if (progress <= 0) return 0
  if (progress < 0.15) return progress / 0.15
  if (progress > 0.85) return (1 - progress) / 0.15
  return 1
}

export default function MacBookScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { progress } = useMacBookTransition()
  const progressRef = useRef(progress)
  const rafRef = useRef<number>(0)
  const loadedRef = useRef(false)

  // Keep progress in a ref so the rAF loop always sees the latest value
  useEffect(() => {
    progressRef.current = progress
    if (canvasRef.current) {
      const op = canvasOpacity(progress)
      canvasRef.current.style.opacity = String(op)
      canvasRef.current.style.display = progress <= 0 && op === 0 ? 'none' : 'block'
    }
  }, [progress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.innerWidth < MOBILE_BREAKPOINT) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0x0a0a0a, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    // Camera
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 100)
    camera.position.set(0, 0.5, 3.5)

    // Scene — dark background matching the page
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0a)

    // Environment map for PBR reflections (studio-like neutral lighting)
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    const neutralEnv = pmremGenerator.fromScene(new RoomEnvironment()).texture
    scene.environment = neutralEnv
    scene.environmentIntensity = 0.8

    // Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
    keyLight.position.set(2, 4, 3)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.8)
    fillLight.position.set(-3, 1, -1)
    scene.add(fillLight)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.0)
    rimLight.position.set(0, 2, -4)
    scene.add(rimLight)
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))

    let destroyed = false
    const lookAt = new THREE.Vector3()
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    // Load GLB with Three.js GLTFLoader (full PBR/clearcoat/transmission support)
    const loader = new GLTFLoader()
    loader.load(
      '/macbook_pro_14-inch_m5.glb',
      (gltf) => {
        if (destroyed) return
        modelGroup.add(gltf.scene)

        // Log model info to calibrate keyframes
        const box = new THREE.Box3().setFromObject(gltf.scene)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        console.log('[MacBookScene] Model bounding box center:', center)
        console.log('[MacBookScene] Model bounding box size:', size)
        console.log('[MacBookScene] Model min/max Y:', box.min.y, '/', box.max.y)

        // Log mesh names to find the screen mesh
        gltf.scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            console.log('[MacBookScene] Mesh:', obj.name, 'pos:', obj.getWorldPosition(new THREE.Vector3()))
          }
        })

        loadedRef.current = true
      },
      undefined,
      (err) => console.warn('[MacBookScene] Failed to load GLB:', err),
    )

    // Render loop
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)
      if (!loadedRef.current) return

      const p = progressRef.current
      if (p <= 0) return

      const { pos, target, rotY } = sampleKeyframes(p)

      camera.position.set(pos[0], pos[1], pos[2])
      lookAt.set(target[0], target[1], target[2])
      camera.lookAt(lookAt)

      modelGroup.rotation.y = rotY

      renderer.render(scene, camera)
    }
    rafRef.current = requestAnimationFrame(loop)

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }
    onResize()
    window.addEventListener('resize', onResize)

    return () => {
      destroyed = true
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      neutralEnv.dispose()
      pmremGenerator.dispose()
      renderer.dispose()
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
        zIndex: 55,
        pointerEvents: 'none',
        opacity: 0,
        display: 'none',
        backgroundColor: '#0a0a0a',
      }}
      aria-hidden="true"
    />
  )
}
