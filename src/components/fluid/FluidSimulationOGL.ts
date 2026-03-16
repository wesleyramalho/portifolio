import { Color, Geometry, Mesh, OGLRenderingContext, Program, RenderTarget, Renderer, Texture, Vec2 } from 'ogl'

import baseVertex from './shaders/base.vert.glsl'
import sceneVert from './shaders/scene.vert.glsl'
import sceneFrag from './shaders/scene.frag.glsl'
import splatFrag from './shaders/splat.frag.glsl'
import advectionFrag from './shaders/advection.frag.glsl'
import advectionManualFrag from './shaders/advection-manual.frag.glsl'
import curlFrag from './shaders/curl.frag.glsl'
import vorticityFrag from './shaders/vorticity.frag.glsl'
import divergenceFrag from './shaders/divergence.frag.glsl'
import pressureFrag from './shaders/pressure.frag.glsl'
import gradientSubtractFrag from './shaders/gradient-subtract.frag.glsl'
import clearFrag from './shaders/clear.frag.glsl'
import postFrag from './shaders/post.frag.glsl'

import {
  SIMULATION_RESOLUTION,
  DYE_RESOLUTION,
  DENSITY_DISSIPATION,
  VELOCITY_DISSIPATION,
  PRESSURE_DISSIPATION,
  CURL_STRENGTH,
  SPLAT_RADIUS,
  PRESSURE_ITERATIONS,
} from '@/lib/constants'

interface DoubleFBO {
  read: RenderTarget
  write: RenderTarget
  swap(): void
}

interface Splat {
  x: number
  y: number
  dx: number
  dy: number
}

function getSupportedFormat(
  gl: OGLRenderingContext,
  internalFormat: GLenum,
  format: GLenum,
  type: GLenum
): { internalFormat: GLenum; format: GLenum } | null {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    switch (internalFormat) {
      case (gl as WebGL2RenderingContext).R16F:
        return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, type)
      case (gl as WebGL2RenderingContext).RG16F:
        return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RGBA16F, gl.RGBA, type)
      default:
        return null
    }
  }
  return { internalFormat, format }
}

function supportRenderTextureFormat(
  gl: OGLRenderingContext,
  internalFormat: GLenum,
  format: GLenum,
  type: GLenum
): boolean {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)
  const fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
}

function createDoubleFBO(gl: OGLRenderingContext, options: Partial<ConstructorParameters<typeof RenderTarget>[1]>): DoubleFBO {
  const fbo: DoubleFBO = {
    read: new RenderTarget(gl, options),
    write: new RenderTarget(gl, options),
    swap() {
      const tmp = fbo.read
      fbo.read = fbo.write
      fbo.write = tmp
    },
  }
  return fbo
}

export class FluidSimulationOGL {
  private renderer: Renderer
  public gl: OGLRenderingContext
  private triangle: Geometry
  private sceneQuad: Geometry

  private density!: DoubleFBO
  private velocity!: DoubleFBO
  private pressure!: DoubleFBO
  private divergence!: RenderTarget
  private curl!: RenderTarget
  private sceneFBO!: RenderTarget

  private clearProgram!: Mesh
  private splatProgram!: Mesh
  private advectionProgram!: Mesh
  private divergenceProgram!: Mesh
  private curlProgram!: Mesh
  private vorticityProgram!: Mesh
  private pressureProgram!: Mesh
  private gradientSubtractProgram!: Mesh
  private postProgram!: Mesh

  private sceneItems = new Map<string, Mesh>()
  private splats: Splat[] = []
  private lastTime = Date.now()
  private width = 1
  private height = 1

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer({ canvas, alpha: true, dpr: 1 })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)

    this.triangle = new Geometry(this.gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    })

    // Quad geometry for scene items — Y-flipped UVs (canvas Y=0 is top)
    this.sceneQuad = new Geometry(this.gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]) },
      uv: { size: 2, data: new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]) },
      index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
    })

    this._initFBOs()
    this._initPrograms()
  }

  private _initFBOs() {
    const gl = this.gl
    const isWebGL2 = gl.renderer.isWebgl2
    const supportLinearFiltering = gl.renderer.extensions[
      `OES_texture_${isWebGL2 ? '' : 'half_'}float_linear`
    ]

    const halfFloat = isWebGL2
      ? (gl as WebGL2RenderingContext).HALF_FLOAT
      : (gl.renderer.extensions['OES_texture_half_float'] as OES_texture_half_float).HALF_FLOAT_OES

    const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST

    let rgba: { internalFormat: GLenum; format: GLenum } | null
    let rg: { internalFormat: GLenum; format: GLenum } | null
    let r: { internalFormat: GLenum; format: GLenum } | null

    if (isWebGL2) {
      const gl2 = gl as WebGL2RenderingContext
      rgba = getSupportedFormat(gl, gl2.RGBA16F, gl.RGBA, halfFloat)
      rg = getSupportedFormat(gl, gl2.RG16F, gl2.RG, halfFloat)
      r = getSupportedFormat(gl, gl2.R16F, gl2.RED, halfFloat)
    } else {
      rgba = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat)
      rg = rgba
      r = rgba
    }

    this.density = createDoubleFBO(gl, {
      width: DYE_RESOLUTION,
      height: DYE_RESOLUTION,
      type: halfFloat,
      format: rgba?.format,
      internalFormat: rgba?.internalFormat,
      minFilter: filtering,
      depth: false,
    })

    this.velocity = createDoubleFBO(gl, {
      width: SIMULATION_RESOLUTION,
      height: SIMULATION_RESOLUTION,
      type: halfFloat,
      format: rg?.format,
      internalFormat: rg?.internalFormat,
      minFilter: filtering,
      depth: false,
    })

    this.pressure = createDoubleFBO(gl, {
      width: SIMULATION_RESOLUTION,
      height: SIMULATION_RESOLUTION,
      type: halfFloat,
      format: r?.format,
      internalFormat: r?.internalFormat,
      minFilter: gl.NEAREST,
      depth: false,
    })

    this.divergence = new RenderTarget(gl, {
      width: SIMULATION_RESOLUTION,
      height: SIMULATION_RESOLUTION,
      type: halfFloat,
      format: r?.format,
      internalFormat: r?.internalFormat,
      minFilter: gl.NEAREST,
      depth: false,
    })

    this.curl = new RenderTarget(gl, {
      width: SIMULATION_RESOLUTION,
      height: SIMULATION_RESOLUTION,
      type: halfFloat,
      format: r?.format,
      internalFormat: r?.internalFormat,
      minFilter: gl.NEAREST,
      depth: false,
    })

    // Scene FBO — RGBA8, canvas resolution, rebuilt on resize
    this.sceneFBO = new RenderTarget(gl, {
      width: this.width,
      height: this.height,
      depth: false,
    })
  }

  private _mesh(frag: string, uniforms: Record<string, { value: unknown }>): Mesh {
    return new Mesh(this.gl, {
      geometry: this.triangle,
      program: new Program(this.gl, {
        vertex: baseVertex,
        fragment: frag,
        uniforms,
        depthTest: false,
        depthWrite: false,
      }),
    })
  }

  private _initPrograms() {
    const gl = this.gl
    const simTexel = new Vec2(1 / SIMULATION_RESOLUTION, 1 / SIMULATION_RESOLUTION)
    const dyeTexel = new Vec2(1 / DYE_RESOLUTION, 1 / DYE_RESOLUTION)
    const supportLinearFiltering = gl.renderer.extensions[
      `OES_texture_${gl.renderer.isWebgl2 ? '' : 'half_'}float_linear`
    ]

    this.clearProgram = this._mesh(clearFrag, {
      texelSize: { value: simTexel },
      uTexture: { value: null },
      value: { value: PRESSURE_DISSIPATION },
    })

    this.splatProgram = this._mesh(splatFrag, {
      texelSize: { value: simTexel },
      uTarget: { value: null },
      aspectRatio: { value: 1 },
      color: { value: new Color() },
      point: { value: new Vec2() },
      radius: { value: SPLAT_RADIUS / 100 },
    })

    this.advectionProgram = this._mesh(
      supportLinearFiltering ? advectionFrag : advectionManualFrag,
      {
        texelSize: { value: simTexel },
        dyeTexelSize: { value: dyeTexel },
        uVelocity: { value: null },
        uSource: { value: null },
        dt: { value: 0.016 },
        dissipation: { value: 1 },
      }
    )

    this.divergenceProgram = this._mesh(divergenceFrag, {
      texelSize: { value: simTexel },
      uVelocity: { value: null },
    })

    this.curlProgram = this._mesh(curlFrag, {
      texelSize: { value: simTexel },
      uVelocity: { value: null },
    })

    this.vorticityProgram = this._mesh(vorticityFrag, {
      texelSize: { value: simTexel },
      uVelocity: { value: null },
      uCurl: { value: null },
      curl: { value: CURL_STRENGTH },
      dt: { value: 0.016 },
    })

    this.pressureProgram = this._mesh(pressureFrag, {
      texelSize: { value: simTexel },
      uPressure: { value: null },
      uDivergence: { value: null },
    })

    this.gradientSubtractProgram = this._mesh(gradientSubtractFrag, {
      texelSize: { value: simTexel },
      uPressure: { value: null },
      uVelocity: { value: null },
    })

    this.postProgram = this._mesh(postFrag, {
      tMap: { value: null },
      tFluid: { value: null },
      texelSize: { value: dyeTexel },
    })
  }

  private _render(mesh: Mesh, target: RenderTarget | null) {
    this.renderer.render({ scene: mesh, target: target ?? undefined, sort: false, update: false })
  }

  private _splat(x: number, y: number, dx: number, dy: number) {
    const p = this.splatProgram.program.uniforms

    p.uTarget.value = this.velocity.read.texture
    p.aspectRatio.value = this.gl.canvas.width / this.gl.canvas.height
    p.point.value.set(x, y)
    p.color.value.set(dx, dy, 1)
    this._render(this.splatProgram, this.velocity.write)
    this.velocity.swap()

    p.uTarget.value = this.density.read.texture
    this._render(this.splatProgram, this.density.write)
    this.density.swap()
  }

  // ─── Scene item registry ────────────────────────────────────────────────────

  private _domRectToNDC(rect: DOMRect): Float32Array {
    const x = (rect.left / this.width) * 2 - 1
    const y = 1 - (rect.bottom / this.height) * 2
    const w = (rect.width / this.width) * 2
    const h = (rect.height / this.height) * 2
    return new Float32Array([x, y, w, h])
  }

  registerSceneItem(id: string, texture: Texture, rect: DOMRect) {
    const uRect = this._domRectToNDC(rect)
    const mesh = new Mesh(this.gl, {
      geometry: this.sceneQuad,
      program: new Program(this.gl, {
        vertex: sceneVert,
        fragment: sceneFrag,
        uniforms: {
          tMap: { value: texture },
          uRect: { value: uRect },
        },
        depthTest: false,
        depthWrite: false,
        transparent: true,
      }),
    })
    this.sceneItems.set(id, mesh)
  }

  unregisterSceneItem(id: string) {
    this.sceneItems.delete(id)
  }

  clearSceneItems() {
    this.sceneItems.clear()
  }

  updateSceneItemRect(id: string, rect: DOMRect) {
    const mesh = this.sceneItems.get(id)
    if (!mesh) return
    const uRect = this._domRectToNDC(rect)
    mesh.program.uniforms.uRect.value = uRect
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  addSplat(x: number, y: number, dx: number, dy: number) {
    this.splats.push({ x, y, dx, dy })
  }

  update() {
    const now = Date.now()
    const dt = Math.min((now - this.lastTime) / 1000, 0.016)
    this.lastTime = now

    this.renderer.autoClear = false

    for (const s of this.splats) {
      this._splat(s.x, s.y, s.dx, s.dy)
    }
    this.splats = []

    // Curl
    this.curlProgram.program.uniforms.uVelocity.value = this.velocity.read.texture
    this._render(this.curlProgram, this.curl)

    // Vorticity
    this.vorticityProgram.program.uniforms.uVelocity.value = this.velocity.read.texture
    this.vorticityProgram.program.uniforms.uCurl.value = this.curl.texture
    this.vorticityProgram.program.uniforms.dt.value = dt
    this._render(this.vorticityProgram, this.velocity.write)
    this.velocity.swap()

    // Divergence
    this.divergenceProgram.program.uniforms.uVelocity.value = this.velocity.read.texture
    this._render(this.divergenceProgram, this.divergence)

    // Clear pressure
    this.clearProgram.program.uniforms.uTexture.value = this.pressure.read.texture
    this._render(this.clearProgram, this.pressure.write)
    this.pressure.swap()

    // Pressure solve
    this.pressureProgram.program.uniforms.uDivergence.value = this.divergence.texture
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      this.pressureProgram.program.uniforms.uPressure.value = this.pressure.read.texture
      this._render(this.pressureProgram, this.pressure.write)
      this.pressure.swap()
    }

    // Gradient subtract
    this.gradientSubtractProgram.program.uniforms.uPressure.value = this.pressure.read.texture
    this.gradientSubtractProgram.program.uniforms.uVelocity.value = this.velocity.read.texture
    this._render(this.gradientSubtractProgram, this.velocity.write)
    this.velocity.swap()

    // Advect velocity
    const adv = this.advectionProgram.program.uniforms
    adv.dyeTexelSize.value.set(1 / SIMULATION_RESOLUTION)
    adv.uVelocity.value = this.velocity.read.texture
    adv.uSource.value = this.velocity.read.texture
    adv.dissipation.value = VELOCITY_DISSIPATION
    adv.dt.value = dt
    this._render(this.advectionProgram, this.velocity.write)
    this.velocity.swap()

    // Advect density
    adv.dyeTexelSize.value.set(1 / DYE_RESOLUTION)
    adv.uVelocity.value = this.velocity.read.texture
    adv.uSource.value = this.density.read.texture
    adv.dissipation.value = DENSITY_DISSIPATION
    this._render(this.advectionProgram, this.density.write)
    this.density.swap()

    // ── Scene pass: render registered items into sceneFBO ──────────────────
    const gl = this.gl

    // Clear sceneFBO to transparent black
    const sceneBuf = (this.sceneFBO as unknown as { buffer: WebGLFramebuffer | null }).buffer
    if (sceneBuf !== undefined) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuf)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    if (this.sceneItems.size > 0) {
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      this.sceneItems.forEach(mesh => {
        this._render(mesh, this.sceneFBO)
      })
      gl.disable(gl.BLEND)
    }

    // ── Post pass: displace sceneFBO + fluid trails → screen ──────────────
    this.renderer.autoClear = true
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    this.postProgram.program.uniforms.tMap.value = this.sceneFBO.texture
    this.postProgram.program.uniforms.tFluid.value = this.density.read.texture
    this.renderer.render({ scene: this.postProgram, sort: false, update: false })
    gl.disable(gl.BLEND)
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.renderer.setSize(width, height)
    // Recreate sceneFBO at new dimensions
    this.sceneFBO = new RenderTarget(this.gl, { width, height, depth: false })
  }

  destroy() {
    // OGL RenderTarget does not expose a dispose() method in its type definitions;
    // resources are released when the WebGL context is lost or renderer is destroyed.
  }
}
