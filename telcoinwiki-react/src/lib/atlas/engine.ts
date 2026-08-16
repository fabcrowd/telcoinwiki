import { lookAt, multiply, perspective, projectPoint } from './mat4'
import type { Mat4, Vec3 } from './mat4'
import { CONSENSUS, ECOSYSTEM, ECOSYSTEM_EDGES, ECOSYSTEM_IDS, PALETTE, isEcosystemId } from './data'
import type { EcosystemEntity, NodeKind } from './data'

export type AtlasScene = 'dag' | 'eco'

export interface AtlasElements {
  /** The section containing the canvas — gets a `data-atlas-failed` flag if WebGL is unavailable. */
  stage: HTMLElement
  canvas: HTMLCanvasElement
  labelLayer: HTMLElement
  inspect: HTMLElement
  statsTitle: HTMLElement
  stats: HTMLElement
  legend: HTMLElement
  sceneDagButton: HTMLButtonElement
  sceneEcoButton: HTMLButtonElement
  sceneTabList: HTMLElement
  playButton: HTMLButtonElement
  resetButton: HTMLButtonElement
  hint: HTMLElement
}

export interface AtlasEngineOptions {
  /**
   * Called when the visitor activates a "Learn more" link inside a HUD panel.
   * The engine writes plain hrefs into its generated HTML (so they remain
   * real, right-clickable, open-in-new-tab-able links) and intercepts plain
   * left-clicks to hand off to the app router instead of a full page reload.
   */
  onNavigate: (path: string) => void
  /** Pre-select a scene on mount — e.g. arriving from a search result. */
  initialScene?: AtlasScene
  /** Pre-select an ecosystem entity on mount (only used when the initial scene is 'eco'). */
  initialEcoId?: string
}

export interface AtlasEngineHandle {
  destroy: () => void
}

interface Certificate {
  id: number
  round: number
  validatorIndex: number
  parents: Certificate[]
  state: 'certified' | 'leader' | 'committed'
  bornAt: number
  commitAt: number
  support: number
}

interface RenderNode {
  position: Vec3
  color: Vec3
  size: number
  alpha: number
  kind: 'cert' | 'eco'
  cert?: Certificate
  ecoId?: string
}

interface RenderEdge {
  a: Vec3
  b: Vec3
  color: Vec3
  alpha: number
  width: number
}

interface ScreenPoint {
  x: number
  y: number
  w: number
  radius: number
  node: RenderNode
}

type Picked = { kind: 'eco'; id: string } | { kind: 'cert'; cert: Certificate } | null

const NODE_VERTEX_SHADER = `
precision highp float;
attribute vec3 aCenter; attribute vec2 aCorner; attribute vec3 aColor;
attribute float aSize; attribute float aAlpha;
uniform mat4 uView; uniform mat4 uProj;
varying vec2 vUV; varying vec3 vColor; varying float vAlpha;
void main(){
  vec4 vp = uView * vec4(aCenter, 1.0);
  vp.xy += aCorner * aSize;
  gl_Position = uProj * vp;
  vUV = aCorner / max(aSize, 0.0001);
  vColor = aColor; vAlpha = aAlpha;
}`

const NODE_FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUV; varying vec3 vColor; varying float vAlpha;
void main(){
  float d = length(vUV) * 2.0;
  if (d > 1.0) discard;
  float core = smoothstep(0.62, 0.24, d);
  float glow = exp(-d * d * 3.2);
  float a = clamp(core * 0.95 + glow * 0.5, 0.0, 1.0) * vAlpha;
  if (a < 0.004) discard;
  vec3 c = vColor * (0.45 + core * 1.15);
  gl_FragColor = vec4(c * a, a);
}`

const EDGE_VERTEX_SHADER = `
precision highp float;
attribute vec3 aA; attribute vec3 aB; attribute float aSide; attribute float aT;
attribute vec3 aColor; attribute float aAlpha; attribute float aWidth;
uniform mat4 uView; uniform mat4 uProj;
varying vec3 vColor; varying float vAlpha; varying float vSide;
void main(){
  vec4 va = uView * vec4(aA, 1.0);
  vec4 vb = uView * vec4(aB, 1.0);
  vec4 p = mix(va, vb, aT);
  vec2 dir = vb.xy - va.xy;
  float L = length(dir);
  vec2 n = L > 0.00001 ? vec2(-dir.y, dir.x) / L : vec2(0.0, 1.0);
  p.xy += n * aSide * aWidth;
  gl_Position = uProj * p;
  vColor = aColor; vAlpha = aAlpha; vSide = aSide;
}`

const EDGE_FRAGMENT_SHADER = `
precision highp float;
varying vec3 vColor; varying float vAlpha; varying float vSide;
void main(){
  float feather = 1.0 - smoothstep(0.15, 1.0, abs(vSide) * 2.0);
  float a = vAlpha * feather;
  if (a < 0.003) discard;
  gl_FragColor = vec4(vColor * a, a);
}`

function ease(t: number): number {
  if (t < 0) return 0
  if (t > 1) return 1
  return 1 - Math.pow(1 - t, 3)
}

function mixVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function rgbCss(c: Vec3): string {
  return `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`
}

function escapeHtml(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Mounts the Network Atlas WebGL scene onto the given DOM elements and
 * starts its render loop. Returns a handle whose `destroy()` fully tears
 * everything down — this runs inside a React effect and must be safe to
 * call on every route change, not just once per page load.
 */
export function createAtlasEngine(el: AtlasElements, options: AtlasEngineOptions): AtlasEngineHandle {
  const { canvas, stage } = el
  const gl =
    (canvas.getContext('webgl2', { antialias: true, alpha: false, preserveDrawingBuffer: true }) as
      | WebGL2RenderingContext
      | WebGLRenderingContext
      | null) ??
    (canvas.getContext('webgl', { antialias: true, alpha: false, preserveDrawingBuffer: true }) as
      | WebGLRenderingContext
      | null)

  if (!gl) {
    stage.dataset.atlasFailed = 'true'
    return { destroy: () => {} }
  }

  function compileShader(type: number, source: string): WebGLShader | null {
    const shader = gl!.createShader(type)
    if (!shader) return null
    gl!.shaderSource(shader, source)
    gl!.compileShader(shader)
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error('[atlas] shader compile failed:', gl!.getShaderInfoLog(shader))
      gl!.deleteShader(shader)
      return null
    }
    return shader
  }

  function linkProgram(vsSrc: string, fsSrc: string): WebGLProgram | null {
    const vs = compileShader(gl!.VERTEX_SHADER, vsSrc)
    const fs = compileShader(gl!.FRAGMENT_SHADER, fsSrc)
    if (!vs || !fs) return null
    const program = gl!.createProgram()
    if (!program) return null
    gl!.attachShader(program, vs)
    gl!.attachShader(program, fs)
    gl!.linkProgram(program)
    // Shader objects are refcounted by the program once linked; freeing our
    // reference here avoids leaking them for the life of the context.
    gl!.deleteShader(vs)
    gl!.deleteShader(fs)
    if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
      console.error('[atlas] program link failed:', gl!.getProgramInfoLog(program))
      gl!.deleteProgram(program)
      return null
    }
    return program
  }

  const nodeProgram = linkProgram(NODE_VERTEX_SHADER, NODE_FRAGMENT_SHADER)
  const edgeProgram = linkProgram(EDGE_VERTEX_SHADER, EDGE_FRAGMENT_SHADER)
  if (!nodeProgram || !edgeProgram) {
    stage.dataset.atlasFailed = 'true'
    return { destroy: () => {} }
  }

  const nLoc = {
    aCenter: gl.getAttribLocation(nodeProgram, 'aCenter'),
    aCorner: gl.getAttribLocation(nodeProgram, 'aCorner'),
    aColor: gl.getAttribLocation(nodeProgram, 'aColor'),
    aSize: gl.getAttribLocation(nodeProgram, 'aSize'),
    aAlpha: gl.getAttribLocation(nodeProgram, 'aAlpha'),
    uView: gl.getUniformLocation(nodeProgram, 'uView'),
    uProj: gl.getUniformLocation(nodeProgram, 'uProj'),
  }
  const eLoc = {
    aA: gl.getAttribLocation(edgeProgram, 'aA'),
    aB: gl.getAttribLocation(edgeProgram, 'aB'),
    aSide: gl.getAttribLocation(edgeProgram, 'aSide'),
    aT: gl.getAttribLocation(edgeProgram, 'aT'),
    aColor: gl.getAttribLocation(edgeProgram, 'aColor'),
    aAlpha: gl.getAttribLocation(edgeProgram, 'aAlpha'),
    aWidth: gl.getAttribLocation(edgeProgram, 'aWidth'),
    uView: gl.getUniformLocation(edgeProgram, 'uView'),
    uProj: gl.getUniformLocation(edgeProgram, 'uProj'),
  }

  const nodeBuffer = gl.createBuffer()
  const edgeBuffer = gl.createBuffer()
  // node: center(3) corner(2) color(3) size(1) alpha(1)      = 10
  // edge: a(3) b(3) side(1) t(1) color(3) alpha(1) width(1)  = 13
  const NODE_STRIDE = 10
  const EDGE_STRIDE = 13
  let nodeArray = new Float32Array(0)
  let edgeArray = new Float32Array(0)
  let nodeVertexCount = 0
  let edgeVertexCount = 0

  const CORNERS: ReadonlyArray<readonly [number, number]> = [
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
    [-0.5, -0.5],
    [0.5, 0.5],
    [-0.5, 0.5],
  ]

  function uploadNodes(list: RenderNode[]) {
    const need = list.length * 6 * NODE_STRIDE
    if (nodeArray.length < need) nodeArray = new Float32Array(need * 2)
    let o = 0
    for (const n of list) {
      for (const [cx, cy] of CORNERS) {
        nodeArray[o++] = n.position[0]
        nodeArray[o++] = n.position[1]
        nodeArray[o++] = n.position[2]
        nodeArray[o++] = cx * n.size
        nodeArray[o++] = cy * n.size
        nodeArray[o++] = n.color[0]
        nodeArray[o++] = n.color[1]
        nodeArray[o++] = n.color[2]
        nodeArray[o++] = n.size
        nodeArray[o++] = n.alpha
      }
    }
    nodeVertexCount = list.length * 6
    gl!.bindBuffer(gl!.ARRAY_BUFFER, nodeBuffer)
    gl!.bufferData(gl!.ARRAY_BUFFER, nodeArray.subarray(0, o), gl!.DYNAMIC_DRAW)
  }

  const EQ: ReadonlyArray<readonly [number, number]> = [
    [-1, 0],
    [1, 0],
    [1, 1],
    [-1, 0],
    [1, 1],
    [-1, 1],
  ]

  function uploadEdges(list: RenderEdge[]) {
    const need = list.length * 6 * EDGE_STRIDE
    if (edgeArray.length < need) edgeArray = new Float32Array(need * 2)
    let o = 0
    for (const e of list) {
      for (const [side, t] of EQ) {
        edgeArray[o++] = e.a[0]
        edgeArray[o++] = e.a[1]
        edgeArray[o++] = e.a[2]
        edgeArray[o++] = e.b[0]
        edgeArray[o++] = e.b[1]
        edgeArray[o++] = e.b[2]
        edgeArray[o++] = side * 0.5
        edgeArray[o++] = t
        edgeArray[o++] = e.color[0]
        edgeArray[o++] = e.color[1]
        edgeArray[o++] = e.color[2]
        edgeArray[o++] = e.alpha
        edgeArray[o++] = e.width
      }
    }
    edgeVertexCount = list.length * 6
    gl!.bindBuffer(gl!.ARRAY_BUFFER, edgeBuffer)
    gl!.bufferData(gl!.ARRAY_BUFFER, edgeArray.subarray(0, o), gl!.DYNAMIC_DRAW)
  }

  function vertexAttrib(location: number, size: number, stride: number, offset: number) {
    if (location < 0) return
    gl!.enableVertexAttribArray(location)
    gl!.vertexAttribPointer(location, size, gl!.FLOAT, false, stride * 4, offset * 4)
  }

  // ==================================================================
  // Camera
  // ==================================================================
  const HOME: Record<AtlasScene, { az: number; el: number; dist: number; tx: number; ty: number; tz: number }> = {
    dag: { az: -0.52, el: 0.5, dist: 21, tx: -5.0, ty: -0.2, tz: 0 },
    eco: { az: -0.42, el: 0.24, dist: 24, tx: 1.6, ty: 1.8, tz: 0 },
  }
  const cam = { ...HOME.dag }
  const camTarget = { ...HOME.dag }
  let scene: AtlasScene = 'dag'
  let lastWidth = 1
  let lastHeight = 1
  let userTouched = false

  function goHome(instant: boolean) {
    const h = HOME[scene]
    const aspect = lastWidth / Math.max(lastHeight, 1)
    // Narrow viewports see far less width at the same distance, so pull back
    // enough to keep the whole graph in frame on a phone.
    const boost = aspect < 0.75 ? 1.75 : aspect < 1.05 ? 1.42 : aspect < 1.45 ? 1.15 : 1
    const tx = h.tx * (aspect < 1.05 ? 0.55 : 1)
    camTarget.az = h.az
    camTarget.el = h.el
    camTarget.dist = h.dist * boost
    camTarget.tx = tx
    camTarget.ty = h.ty
    camTarget.tz = h.tz
    if (instant) Object.assign(cam, camTarget)
  }

  function eyePosition(): Vec3 {
    const ce = Math.cos(cam.el)
    return [
      cam.tx + cam.dist * ce * Math.sin(cam.az),
      cam.ty + cam.dist * Math.sin(cam.el),
      cam.tz + cam.dist * ce * Math.cos(cam.az),
    ]
  }

  // AbortController lets every listener registered below be removed with a
  // single call, instead of hand-tracking each one for teardown.
  const controller = new AbortController()
  const { signal } = controller

  let dragging = false
  let lastX = 0
  let lastY = 0

  const hintEl = el.hint
  const hintTimer = window.setTimeout(hideHint, 9000)
  function hideHint() {
    hintEl.classList.add('atlas-hint--gone')
    window.clearTimeout(hintTimer)
  }

  canvas.addEventListener(
    'pointerdown',
    (e) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      canvas.classList.add('atlas-canvas--dragging')
      canvas.setPointerCapture(e.pointerId)
      userTouched = true
      hideHint()
    },
    { signal },
  )
  canvas.addEventListener(
    'pointermove',
    (e) => {
      if (!dragging) return
      camTarget.az -= (e.clientX - lastX) * 0.0062
      camTarget.el = Math.max(-0.35, Math.min(1.32, camTarget.el + (e.clientY - lastY) * 0.0052))
      lastX = e.clientX
      lastY = e.clientY
    },
    { signal },
  )
  function endDrag(e: PointerEvent) {
    if (!dragging) return
    dragging = false
    canvas.classList.remove('atlas-canvas--dragging')
    try {
      canvas.releasePointerCapture(e.pointerId)
    } catch {
      /* pointer already released */
    }
  }
  canvas.addEventListener('pointerup', endDrag, { signal })
  canvas.addEventListener('pointercancel', endDrag, { signal })
  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault()
      camTarget.dist = Math.max(7, Math.min(52, camTarget.dist * (1 + Math.sign(e.deltaY) * 0.11)))
      userTouched = true
      hideHint()
    },
    { signal, passive: false },
  )

  // ==================================================================
  // Scene 1 — Narwhal / Bullshark DAG simulation
  // ==================================================================
  const { validators: VALIDATORS, quorum: QUORUM, roundSpacing: ROUND_SPACING, laneSpacing: LANE_SPACING, keepRounds: KEEP_ROUNDS } = CONSENSUS
  const NV = VALIDATORS.length

  const dag = { certs: [] as Certificate[], round: -1, commits: 0, seq: 0 }

  function laneZ(v: number): number {
    return (v - (NV - 1) / 2) * LANE_SPACING
  }
  function leaderFor(round: number): number {
    return Math.floor(round / 2) % NV
  }

  function dagStep() {
    dag.round++
    const r = dag.round
    const prev = dag.certs.filter((c) => c.round === r - 1)
    const made: Certificate[] = []

    for (let v = 0; v < NV; v++) {
      const parents: Certificate[] = []
      if (prev.length) {
        const start = (v + r) % prev.length
        for (let i = 0; i < Math.min(QUORUM, prev.length); i++) parents.push(prev[(start + i) % prev.length])
      }
      const isLeader = r % 2 === 0 && v === leaderFor(r)
      const c: Certificate = {
        id: ++dag.seq,
        round: r,
        validatorIndex: v,
        parents,
        state: isLeader ? 'leader' : 'certified',
        bornAt: performance.now(),
        commitAt: 0,
        support: 0,
      }
      dag.certs.push(c)
      made.push(c)
    }

    const lr = r - 1
    if (lr >= 0 && lr % 2 === 0) {
      const leader = dag.certs.find((c) => c.round === lr && c.validatorIndex === leaderFor(lr))
      if (leader) {
        const support = made.filter((c) => c.parents.includes(leader)).length
        leader.support = support
        if (support >= QUORUM) commitFrom(leader)
      }
    }

    const cut = dag.round - KEEP_ROUNDS
    dag.certs = dag.certs.filter((c) => c.round > cut)
  }

  function commitFrom(leader: Certificate) {
    const seen: Certificate[] = []
    const stack: Certificate[] = [leader]
    const now = performance.now()
    while (stack.length) {
      const c = stack.pop()
      if (!c || c.state === 'committed' || seen.includes(c)) continue
      seen.push(c)
      stack.push(...c.parents)
    }
    seen.sort((a, b) => b.round - a.round)
    seen.forEach((c, i) => {
      c.state = 'committed'
      c.commitAt = now + i * 38 // staggered so the wave reads
    })
    dag.commits++
  }

  function dagWorldPosition(c: Certificate): Vec3 {
    return [(c.round - dag.round) * ROUND_SPACING, c.state === 'leader' ? 0.62 : 0, laneZ(c.validatorIndex)]
  }

  function buildDagScene(now: number, nodes: RenderNode[], edges: RenderEdge[]) {
    for (const c of dag.certs) {
      const p = dagWorldPosition(c)
      const age = (now - c.bornAt) / 420
      const grow = age < 1 ? 0.35 + 0.65 * ease(age) : 1
      let fade = 1
      const oldness = dag.round - c.round
      if (oldness > KEEP_ROUNDS - 2) fade = Math.max(0, 1 - (oldness - (KEEP_ROUNDS - 2)) / 2)

      let color = PALETTE.cyan
      let size = 0.62
      const alpha = 0.9
      if (c.state === 'leader') {
        color = PALETTE.gold
        size = 0.92
      }
      if (c.state === 'committed') {
        const since = now - c.commitAt
        if (since >= 0) {
          const pulse = since < 520 ? 1 - since / 520 : 0
          color = mixVec3(PALETTE.gold, PALETTE.hot, pulse)
          size = 0.66 + pulse * 0.5
        }
      }
      let nodeSize = size * grow
      if (picked?.kind === 'cert' && picked.cert === c) {
        nodeSize *= 1.45
        color = PALETTE.hot
      }
      nodes.push({ position: p, color, size: nodeSize, alpha: alpha * fade, kind: 'cert', cert: c })

      for (const parent of c.parents) {
        if (!dag.certs.includes(parent)) continue
        const bothCommitted = c.state === 'committed' && parent.state === 'committed'
        edges.push({
          a: p,
          b: dagWorldPosition(parent),
          color: bothCommitted ? PALETTE.gold : PALETTE.cyan,
          alpha: (bothCommitted ? 0.4 : 0.14) * fade,
          width: bothCommitted ? 0.03 : 0.02,
        })
      }
    }

    const back = -Math.min(dag.round, KEEP_ROUNDS) * ROUND_SPACING
    for (let v = 0; v < NV; v++) {
      edges.push({ a: [back - 1.2, -0.9, laneZ(v)], b: [1.6, -0.9, laneZ(v)], color: PALETTE.grid, alpha: 0.1, width: 0.012 })
    }
    for (let rr = 0; rr <= Math.min(dag.round, KEEP_ROUNDS); rr++) {
      const x = -rr * ROUND_SPACING
      edges.push({
        a: [x, -0.9, laneZ(0) - 1.1],
        b: [x, -0.9, laneZ(NV - 1) + 1.1],
        color: PALETTE.grid,
        alpha: 0.055,
        width: 0.01,
      })
    }
  }

  function dagLabels(): LabelSpec[] {
    const out: LabelSpec[] = VALIDATORS.map((name, v) => ({ p: [1.85, -0.55, laneZ(v)], text: name, cls: '' }))
    out.push({ p: [0, 2.6, 0], text: `round ${Math.max(dag.round, 0)}`, cls: 'atlas-label--strong atlas-label--cyan' })
    return out
  }

  // ==================================================================
  // Scene 2 — Ecosystem graph
  // ==================================================================
  let ecoSelected = 'network'

  function ecosystemRelated(id: string): Record<string, boolean> {
    const related: Record<string, boolean> = { [id]: true }
    for (const e of ECOSYSTEM_EDGES) {
      if (e.a === id) related[e.b] = true
      if (e.b === id) related[e.a] = true
    }
    return related
  }

  function kindColor(kind: NodeKind): Vec3 {
    return kind === 'gold' ? PALETTE.gold : kind === 'cyan' ? PALETTE.cyan : PALETTE.slate
  }

  function buildEcoScene(now: number, nodes: RenderNode[], edges: RenderEdge[]) {
    const focusId = hovered?.kind === 'eco' ? hovered.id : ecoSelected
    const related = ecosystemRelated(focusId)
    const breathe = 1 + Math.sin(now / 1400) * 0.03

    for (const id of ECOSYSTEM_IDS) {
      const entity = ECOSYSTEM[id]
      const on = !!related[id]
      let color = kindColor(entity.kind)
      let size = entity.size * breathe
      if (id === ecoSelected) size *= 1.22
      if (picked?.kind === 'eco' && picked.id === id) color = PALETTE.hot
      nodes.push({ position: entity.position, color, size, alpha: on ? 1 : 0.22, kind: 'eco', ecoId: id })
    }

    for (const e of ECOSYSTEM_EDGES) {
      const hot = related[e.a] && related[e.b]
      const color = e.kind === 'gov' ? PALETTE.slate : e.kind === 'money' ? PALETTE.gold : PALETTE.cyan
      edges.push({
        a: ECOSYSTEM[e.a].position,
        b: ECOSYSTEM[e.b].position,
        color,
        alpha: hot ? (e.kind === 'gov' ? 0.3 : 0.48) : 0.055,
        width: hot ? 0.032 : 0.016,
      })
    }

    for (let g = -4; g <= 4; g++) {
      edges.push({ a: [g * 2.6, -4.6, -7], b: [g * 2.6, -4.6, 7], color: PALETTE.grid, alpha: 0.05, width: 0.008 })
      edges.push({ a: [-10.4, -4.6, g * 1.8], b: [10.4, -4.6, g * 1.8], color: PALETTE.grid, alpha: 0.05, width: 0.008 })
    }
  }

  function ecoLabels(): LabelSpec[] {
    const focusId = hovered?.kind === 'eco' ? hovered.id : ecoSelected
    const related = ecosystemRelated(focusId)
    return ECOSYSTEM_IDS.map((id) => {
      const entity = ECOSYSTEM[id]
      const on = !!related[id]
      const cls = [
        id === ecoSelected ? 'atlas-label--strong' : '',
        on ? (entity.kind === 'gold' ? 'atlas-label--gold' : entity.kind === 'cyan' ? 'atlas-label--cyan' : '') : '',
      ]
        .filter(Boolean)
        .join(' ')
      return {
        p: [entity.position[0], entity.position[1] - entity.size - 0.62, entity.position[2]] as Vec3,
        text: entity.label,
        cls,
        dim: !on,
      }
    })
  }

  // ==================================================================
  // Shared render/pick state
  // ==================================================================
  let picked: Picked = null
  let hovered: Picked = null
  let playing = true
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let lastVP: Mat4 | null = null
  let screenPoints: ScreenPoint[] = []

  function project(p: Vec3): { x: number; y: number; w: number } | null {
    if (!lastVP) return null
    const clip = projectPoint(lastVP, p)
    if (!clip) return null
    return { x: (clip.clipX * 0.5 + 0.5) * lastWidth, y: (1 - (clip.clipY * 0.5 + 0.5)) * lastHeight, w: clip.w }
  }

  function hitTest(mx: number, my: number): RenderNode | null {
    let best: ScreenPoint | null = null
    let bestDist = 26
    for (const s of screenPoints) {
      const d = Math.hypot(s.x - mx, s.y - my)
      const r = Math.max(11, s.radius)
      if (d < r && d < bestDist + r) {
        if (!best || s.w < best.w) {
          best = s
          bestDist = d
        }
      }
    }
    return best ? best.node : null
  }

  canvas.addEventListener(
    'pointermove',
    (e) => {
      if (dragging) return
      const r = canvas.getBoundingClientRect()
      const n = hitTest(e.clientX - r.left, e.clientY - r.top)
      hovered = n ? (n.kind === 'eco' ? { kind: 'eco', id: n.ecoId! } : { kind: 'cert', cert: n.cert! }) : null
      canvas.style.cursor = n ? 'pointer' : 'grab'
    },
    { signal },
  )

  let pointerDownAt: { x: number; y: number } | null = null
  canvas.addEventListener('pointerdown', (e) => (pointerDownAt = { x: e.clientX, y: e.clientY }), { signal })
  canvas.addEventListener(
    'pointerup',
    (e) => {
      if (!pointerDownAt) return
      const moved = Math.hypot(e.clientX - pointerDownAt.x, e.clientY - pointerDownAt.y)
      pointerDownAt = null
      if (moved > 5) return // was an orbit drag, not a click
      const r = canvas.getBoundingClientRect()
      const n = hitTest(e.clientX - r.left, e.clientY - r.top)
      if (!n) return
      if (n.kind === 'eco') {
        ecoSelected = n.ecoId!
        picked = { kind: 'eco', id: n.ecoId! }
      } else {
        picked = { kind: 'cert', cert: n.cert! }
      }
      renderInspector()
    },
    { signal },
  )

  // ==================================================================
  // HUD
  // ==================================================================
  function bindNavLinks(root: HTMLElement) {
    root.addEventListener(
      'click',
      (e) => {
        const target = e.target as HTMLElement
        const link = target.closest('a[data-atlas-nav]') as HTMLAnchorElement | null
        if (!link) return
        const isPlainLeftClick =
          e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && link.target !== '_blank'
        if (!isPlainLeftClick) return
        e.preventDefault()
        options.onNavigate(link.getAttribute('href') || '/')
      },
      { signal },
    )
  }
  bindNavLinks(el.inspect)

  function renderLegend() {
    const items: Array<[Vec3, string]> =
      scene === 'dag'
        ? [
            [PALETTE.cyan, 'certified — 2f+1 signed'],
            [PALETTE.gold, 'leader — even round'],
            [PALETTE.hot, 'committing — causal history'],
            [PALETTE.grid, 'validator lane'],
          ]
        : [
            [PALETTE.cyan, 'network machine · TEL'],
            [PALETTE.gold, 'regulated money'],
            [PALETTE.slate, 'governance / application'],
          ]
    el.legend.innerHTML = items
      .map(([c, label]) => `<div class="atlas-legend-row"><i style="background:${rgbCss(c)};box-shadow:0 0 8px ${rgbCss(c)}"></i>${label}</div>`)
      .join('')
  }

  function renderStats() {
    if (scene === 'dag') {
      el.statsTitle.textContent = 'Narwhal / Bullshark — live'
      el.stats.innerHTML =
        `<div class="atlas-stat atlas-stat--cyan"><b>${Math.max(dag.round, 0)}</b><i>round</i></div>` +
        `<div class="atlas-stat"><b>${dag.certs.length}</b><i>certs in DAG</i></div>` +
        `<div class="atlas-stat atlas-stat--gold"><b>${dag.commits}</b><i>commits</i></div>` +
        `<div class="atlas-stat"><b>${NV}/${QUORUM}</b><i>nodes / quorum</i></div>`
    } else {
      el.statsTitle.textContent = 'Ecosystem topology'
      el.stats.innerHTML =
        `<div class="atlas-stat atlas-stat--cyan"><b>${ECOSYSTEM_IDS.length}</b><i>entities</i></div>` +
        `<div class="atlas-stat"><b>${ECOSYSTEM_EDGES.length}</b><i>relationships</i></div>` +
        `<div class="atlas-stat atlas-stat--gold"><b>2</b><i>kinds of money</i></div>`
    }
  }

  function factList(items: readonly string[]): string {
    return `<ul class="atlas-facts">${items.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
  }

  function learnMoreLink(href: string, label: string): string {
    return `<a class="atlas-learn-more" href="${escapeHtml(href)}" data-atlas-nav>${escapeHtml(label)} →</a>`
  }

  function renderInspector() {
    if (scene === 'eco') {
      const entity: EcosystemEntity = ECOSYSTEM[ecoSelected]
      const related = ECOSYSTEM_EDGES.filter((e) => e.a === ecoSelected || e.b === ecoSelected)
      el.inspect.className = `atlas-inspect ${entity.kind === 'gold' ? 'atlas-inspect--gold' : entity.kind === 'neutral' ? 'atlas-inspect--neutral' : 'atlas-inspect--cyan'}`
      el.inspect.innerHTML =
        `<div class="atlas-inspect-kicker">${escapeHtml(entity.kicker)}</div>` +
        `<h3>${escapeHtml(entity.label)}</h3>` +
        `<p>${escapeHtml(entity.body)}</p>` +
        factList(entity.facts) +
        learnMoreLink(entity.href, entity.hrefLabel) +
        `<div class="atlas-jump">${related
          .map((e) => {
            const otherId = e.a === ecoSelected ? e.b : e.a
            return `<button type="button" data-atlas-jump="${otherId}" title="${escapeHtml(e.label)}">${escapeHtml(ECOSYSTEM[otherId].label)}</button>`
          })
          .join('')}</div>`
      el.inspect.querySelectorAll<HTMLButtonElement>('[data-atlas-jump]').forEach((btn) => {
        btn.addEventListener(
          'click',
          () => {
            ecoSelected = btn.dataset.atlasJump!
            picked = { kind: 'eco', id: ecoSelected }
            renderInspector()
          },
          { signal },
        )
      })
      return
    }

    if (!picked || picked.kind !== 'cert' || !dag.certs.includes(picked.cert)) {
      el.inspect.className = 'atlas-inspect atlas-inspect--neutral'
      el.inspect.innerHTML =
        '<div class="atlas-inspect-kicker">Consensus layer</div><h3>The DAG, round by round</h3>' +
        '<p>Every round each validator issues one certificate anchored to a quorum of parents in the round before it. On even rounds one validator is the leader; when it collects quorum support, Bullshark commits its whole causal history.</p>' +
        factList(['Click any certificate to inspect it', 'Drag to orbit · scroll to zoom']) +
        learnMoreLink('/protocol#proto-consensus', 'Narwhal & Bullshark, in the docs')
      return
    }

    const c = picked.cert
    const stateLabel = c.state === 'committed' ? 'committed' : c.state === 'leader' ? 'leader (even round)' : 'certified'
    el.inspect.className = `atlas-inspect ${c.state === 'certified' ? 'atlas-inspect--cyan' : 'atlas-inspect--gold'}`
    const desc =
      c.state === 'committed'
        ? 'Part of a committed sub-DAG. Its ordering is final and it has been handed to the execution layer.'
        : c.state === 'leader'
          ? "This round's elected leader. If a quorum of the next round anchors to it, everything in its causal history commits."
          : 'Signed by a 2f+1 quorum of validator stake and inserted into the DAG, its parents already present.'
    el.inspect.innerHTML =
      `<div class="atlas-inspect-kicker">Certificate</div><h3>${escapeHtml(VALIDATORS[c.validatorIndex])} · round ${c.round}</h3>` +
      `<p>${desc}</p>` +
      '<div class="atlas-kv">' +
      `<div><span class="atlas-kv-k">state</span><span class="atlas-kv-v">${stateLabel}</span></div>` +
      `<div><span class="atlas-kv-k">validator</span><span class="atlas-kv-v">${escapeHtml(VALIDATORS[c.validatorIndex])}</span></div>` +
      `<div><span class="atlas-kv-k">round</span><span class="atlas-kv-v">${c.round}</span></div>` +
      `<div><span class="atlas-kv-k">parents</span><span class="atlas-kv-v">${c.parents.length} / ${QUORUM}</span></div>` +
      (c.state === 'leader' || c.support ? `<div><span class="atlas-kv-k">support</span><span class="atlas-kv-v">${c.support} / ${QUORUM}</span></div>` : '') +
      '</div>' +
      learnMoreLink('/protocol#proto-lifecycle', 'The full transaction lifecycle')
  }

  interface LabelSpec {
    p: Vec3
    text: string
    cls: string
    dim?: boolean
  }
  const labelPool: HTMLDivElement[] = []
  function syncLabels(list: LabelSpec[]) {
    while (labelPool.length < list.length) {
      const d = document.createElement('div')
      d.className = 'atlas-label'
      el.labelLayer.appendChild(d)
      labelPool.push(d)
    }
    labelPool.forEach((div, i) => {
      if (i >= list.length) {
        div.style.display = 'none'
        return
      }
      const L = list[i]
      const s = project(L.p)
      if (!s || s.x < -80 || s.x > lastWidth + 80 || s.y < -40 || s.y > lastHeight + 40) {
        div.style.display = 'none'
        return
      }
      div.style.display = 'block'
      div.style.left = `${s.x}px`
      div.style.top = `${s.y}px`
      div.style.opacity = L.dim ? '0.28' : '1'
      div.className = `atlas-label ${L.cls}`.trim()
      if (div.textContent !== L.text) div.textContent = L.text
    })
  }

  // ==================================================================
  // Scene switching + controls
  // ==================================================================
  function setScene(next: AtlasScene) {
    scene = next
    el.sceneDagButton.setAttribute('aria-selected', next === 'dag' ? 'true' : 'false')
    el.sceneEcoButton.setAttribute('aria-selected', next === 'eco' ? 'true' : 'false')
    el.sceneDagButton.tabIndex = next === 'dag' ? 0 : -1
    el.sceneEcoButton.tabIndex = next === 'eco' ? 0 : -1
    picked = null
    hovered = null
    goHome(false)
    renderLegend()
    renderStats()
    renderInspector()
  }
  el.sceneDagButton.addEventListener('click', () => setScene('dag'), { signal })
  el.sceneEcoButton.addEventListener('click', () => setScene('eco'), { signal })
  el.sceneTabList.addEventListener(
    'keydown',
    (e) => {
      const order: AtlasScene[] = ['dag', 'eco']
      const i = order.indexOf(scene)
      let next: number | null = null
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % 2
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i + 1) % 2
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = 1
      if (next === null) return
      e.preventDefault()
      setScene(order[next])
      ;(order[next] === 'dag' ? el.sceneDagButton : el.sceneEcoButton).focus()
    },
    { signal },
  )

  el.playButton.addEventListener(
    'click',
    () => {
      playing = !playing
      el.playButton.classList.toggle('atlas-icon-btn--playing', playing)
      el.playButton.setAttribute('aria-label', playing ? 'Pause simulation' : 'Play simulation')
    },
    { signal },
  )
  el.resetButton.addEventListener('click', () => goHome(false), { signal })

  // ==================================================================
  // Resize, visibility and viewport-intersection pausing
  // ==================================================================
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth || 1
    const h = canvas.clientHeight || 1
    const bw = Math.round(w * dpr)
    const bh = Math.round(h * dpr)
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw
      canvas.height = bh
    }
    lastWidth = w
    lastHeight = h
  }

  const resizeObserver = new ResizeObserver(() => {
    resize()
    if (!userTouched) goHome(false)
  })
  resizeObserver.observe(canvas)
  window.addEventListener('resize', resize, { signal })

  // The Atlas now lives inside a normal, scrollable page rather than being
  // the entire viewport — pausing the loop while it's off-screen or the tab
  // is hidden avoids burning a render thread for a scene nobody can see.
  let isIntersecting = true
  const intersectionObserver =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          ([entry]) => {
            const wasVisible = isIntersecting
            isIntersecting = entry.isIntersecting
            if (isIntersecting && !wasVisible) {
              nextStepAt = performance.now() + CONSENSUS.stepMs
              scheduleFrame()
            }
          },
          { threshold: 0.05 },
        )
      : null
  intersectionObserver?.observe(stage)

  let isDocumentVisible = !document.hidden
  document.addEventListener(
    'visibilitychange',
    () => {
      const wasVisible = isDocumentVisible
      isDocumentVisible = !document.hidden
      if (isDocumentVisible && !wasVisible) {
        nextStepAt = performance.now() + CONSENSUS.stepMs
        scheduleFrame()
      }
    },
    { signal },
  )

  // ==================================================================
  // Main loop
  // ==================================================================
  let nextStepAt = 0
  let rafHandle = 0
  let destroyed = false

  function scheduleFrame() {
    if (destroyed || rafHandle) return
    rafHandle = requestAnimationFrame(frame)
  }

  function frame(now: number) {
    rafHandle = 0
    if (destroyed) return
    if (!isIntersecting || !isDocumentVisible) return // resumed by the observers above

    resize()

    if (scene === 'dag' && playing && now >= nextStepAt) {
      dagStep()
      nextStepAt = now + CONSENSUS.stepMs
      renderStats()
      if (picked?.kind === 'cert' && !dag.certs.includes(picked.cert)) {
        picked = null
        renderInspector()
      }
    }

    if (!reducedMotion && !dragging && !userTouched) camTarget.az += 0.00042
    const k = 0.1
    cam.az += (camTarget.az - cam.az) * k
    cam.el += (camTarget.el - cam.el) * k
    cam.dist += (camTarget.dist - cam.dist) * k
    cam.tx += (camTarget.tx - cam.tx) * k
    cam.ty += (camTarget.ty - cam.ty) * k
    cam.tz += (camTarget.tz - cam.tz) * k

    const aspect = Math.max(lastWidth / Math.max(lastHeight, 1), 0.35)
    const proj = perspective(Math.PI / 4.6, aspect, 0.1, 300)
    const view = lookAt(eyePosition(), [cam.tx, cam.ty, cam.tz], [0, 1, 0])
    lastVP = multiply(proj, view)

    const nodes: RenderNode[] = []
    const edges: RenderEdge[] = []
    if (scene === 'dag') buildDagScene(now, nodes, edges)
    else buildEcoScene(now, nodes, edges)

    const eye = eyePosition()
    nodes.sort((a, b) => {
      const da = (a.position[0] - eye[0]) ** 2 + (a.position[1] - eye[1]) ** 2 + (a.position[2] - eye[2]) ** 2
      const db = (b.position[0] - eye[0]) ** 2 + (b.position[1] - eye[1]) ** 2 + (b.position[2] - eye[2]) ** 2
      return db - da
    })

    screenPoints = []
    for (const n of nodes) {
      const s = project(n.position)
      if (s) screenPoints.push({ x: s.x, y: s.y, w: s.w, radius: (n.size / Math.max(s.w, 0.001)) * lastHeight * 0.55, node: n })
    }

    uploadNodes(nodes)
    uploadEdges(edges)

    gl!.viewport(0, 0, canvas.width, canvas.height)
    gl!.clearColor(0.016, 0.027, 0.047, 1)
    gl!.clear(gl!.COLOR_BUFFER_BIT)
    gl!.disable(gl!.DEPTH_TEST)
    gl!.enable(gl!.BLEND)
    gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA) // premultiplied

    gl!.useProgram(edgeProgram)
    gl!.uniformMatrix4fv(eLoc.uView, false, view)
    gl!.uniformMatrix4fv(eLoc.uProj, false, proj)
    gl!.bindBuffer(gl!.ARRAY_BUFFER, edgeBuffer)
    vertexAttrib(eLoc.aA, 3, EDGE_STRIDE, 0)
    vertexAttrib(eLoc.aB, 3, EDGE_STRIDE, 3)
    vertexAttrib(eLoc.aSide, 1, EDGE_STRIDE, 6)
    vertexAttrib(eLoc.aT, 1, EDGE_STRIDE, 7)
    vertexAttrib(eLoc.aColor, 3, EDGE_STRIDE, 8)
    vertexAttrib(eLoc.aAlpha, 1, EDGE_STRIDE, 11)
    vertexAttrib(eLoc.aWidth, 1, EDGE_STRIDE, 12)
    gl!.drawArrays(gl!.TRIANGLES, 0, edgeVertexCount)

    gl!.useProgram(nodeProgram)
    gl!.uniformMatrix4fv(nLoc.uView, false, view)
    gl!.uniformMatrix4fv(nLoc.uProj, false, proj)
    gl!.bindBuffer(gl!.ARRAY_BUFFER, nodeBuffer)
    vertexAttrib(nLoc.aCenter, 3, NODE_STRIDE, 0)
    vertexAttrib(nLoc.aCorner, 2, NODE_STRIDE, 3)
    vertexAttrib(nLoc.aColor, 3, NODE_STRIDE, 5)
    vertexAttrib(nLoc.aSize, 1, NODE_STRIDE, 8)
    vertexAttrib(nLoc.aAlpha, 1, NODE_STRIDE, 9)
    gl!.drawArrays(gl!.TRIANGLES, 0, nodeVertexCount)

    syncLabels(scene === 'dag' ? dagLabels() : ecoLabels())

    scheduleFrame()
  }

  // ==================================================================
  // Boot
  // ==================================================================
  resize()
  if (options.initialScene === 'eco') {
    scene = 'eco'
    el.sceneDagButton.setAttribute('aria-selected', 'false')
    el.sceneDagButton.tabIndex = -1
    el.sceneEcoButton.setAttribute('aria-selected', 'true')
    el.sceneEcoButton.tabIndex = 0
    if (isEcosystemId(options.initialEcoId)) {
      ecoSelected = options.initialEcoId
      picked = { kind: 'eco', id: options.initialEcoId }
    }
  }
  goHome(true)
  for (let i = 0; i < 5; i++) dagStep() // warm start so the scene has depth
  nextStepAt = performance.now() + CONSENSUS.stepMs
  renderLegend()
  renderStats()
  renderInspector()
  scheduleFrame()

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      if (rafHandle) cancelAnimationFrame(rafHandle)
      window.clearTimeout(hintTimer)
      controller.abort()
      resizeObserver.disconnect()
      intersectionObserver?.disconnect()
      el.labelLayer.replaceChildren()

      gl!.deleteBuffer(nodeBuffer)
      gl!.deleteBuffer(edgeBuffer)
      gl!.deleteProgram(nodeProgram)
      gl!.deleteProgram(edgeProgram)
      // Proactively release the context rather than waiting on GC — browsers
      // cap the number of live WebGL contexts per page, and this component
      // can mount and unmount many times in one SPA session.
      const loseCtx = gl!.getExtension('WEBGL_lose_context')
      loseCtx?.loseContext()
    },
  }
}
