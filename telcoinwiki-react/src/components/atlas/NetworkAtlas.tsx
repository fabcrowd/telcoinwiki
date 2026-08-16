import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createAtlasEngine } from '../../lib/atlas/engine'
import type { AtlasScene } from '../../lib/atlas/engine'

/**
 * The interactive Network Atlas stage: a WebGL scene (live Narwhal/Bullshark
 * DAG simulation, and an orbitable ecosystem graph) with a HUD overlay.
 *
 * All render-loop state lives inside the imperative engine, not React state
 * — this runs a persistent 60fps loop and hand-writes its HUD panels via
 * direct DOM updates, the same way the rest of the app's expandable panels
 * animate outside React's render cycle. This component's job is just to
 * own the DOM shell, mount the engine once, and guarantee it is fully torn
 * down on unmount so navigating away and back doesn't leak a WebGL context.
 */
export function NetworkAtlas() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const labelLayerRef = useRef<HTMLDivElement | null>(null)
  const inspectRef = useRef<HTMLDivElement | null>(null)
  const statsTitleRef = useRef<HTMLDivElement | null>(null)
  const statsRef = useRef<HTMLDivElement | null>(null)
  const legendRef = useRef<HTMLDivElement | null>(null)
  const sceneTabListRef = useRef<HTMLDivElement | null>(null)
  const sceneDagRef = useRef<HTMLButtonElement | null>(null)
  const sceneEcoRef = useRef<HTMLButtonElement | null>(null)
  const playRef = useRef<HTMLButtonElement | null>(null)
  const resetRef = useRef<HTMLButtonElement | null>(null)
  const hintRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (
      !stageRef.current ||
      !canvasRef.current ||
      !labelLayerRef.current ||
      !inspectRef.current ||
      !statsTitleRef.current ||
      !statsRef.current ||
      !legendRef.current ||
      !sceneTabListRef.current ||
      !sceneDagRef.current ||
      !sceneEcoRef.current ||
      !playRef.current ||
      !resetRef.current ||
      !hintRef.current
    ) {
      return
    }

    // Read once at mount time: a search result can link to
    // /atlas?scene=eco&node=digitalcash to land pre-focused on that entity.
    // Later edits to the URL (e.g. from the engine's own scene switching)
    // deliberately don't feed back in — this is an entry-point deep link,
    // not a two-way synced state.
    const initialScene = searchParams.get('scene') === 'eco' ? ('eco' as AtlasScene) : undefined
    const initialEcoId = searchParams.get('node') ?? undefined

    const handle = createAtlasEngine(
      {
        stage: stageRef.current,
        canvas: canvasRef.current,
        labelLayer: labelLayerRef.current,
        inspect: inspectRef.current,
        statsTitle: statsTitleRef.current,
        stats: statsRef.current,
        legend: legendRef.current,
        sceneTabList: sceneTabListRef.current,
        sceneDagButton: sceneDagRef.current,
        sceneEcoButton: sceneEcoRef.current,
        playButton: playRef.current,
        resetButton: resetRef.current,
        hint: hintRef.current,
      },
      { onNavigate: navigate, initialScene, initialEcoId },
    )

    return () => handle.destroy()
    // Mount once per component instance: navigate is stable from
    // react-router, and searchParams is intentionally read only at mount
    // (see comment above) so this effect must not re-run on URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="atlas-stage" ref={stageRef}>
      <canvas
        className="atlas-canvas"
        ref={canvasRef}
        aria-label="Interactive 3D model. Drag to orbit, scroll to zoom, click a node to inspect it."
      />
      <div className="atlas-labels" ref={labelLayerRef} aria-hidden="true" />

      <div className="atlas-nogl">
        <div>
          <p className="atlas-nogl-kicker">WebGL unavailable</p>
          <p>
            This model renders with hardware-accelerated WebGL. Your browser or device has it disabled, so the 3D
            view can&rsquo;t start &mdash; the written reference on{' '}
            <a href="/protocol">the Protocol page</a> and the{' '}
            <a href="/deep-dive">Deep Dive</a> cover the same material.
          </p>
        </div>
      </div>

      <div className="atlas-hud atlas-hud--tl">
        <div className="atlas-glass atlas-scenes" role="tablist" aria-label="Choose a model" ref={sceneTabListRef}>
          <button type="button" className="atlas-scene-btn" ref={sceneDagRef} role="tab" aria-selected="true">
            Consensus DAG
          </button>
          <button type="button" className="atlas-scene-btn" ref={sceneEcoRef} role="tab" aria-selected="false">
            Ecosystem
          </button>
        </div>
      </div>

      <div className="atlas-hud atlas-hud--tr">
        <button
          type="button"
          className="atlas-icon-btn atlas-icon-btn--playing"
          ref={playRef}
          aria-label="Pause simulation"
          title="Play / pause"
        >
          <svg className="atlas-icon-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg className="atlas-icon-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        </button>
        <button type="button" className="atlas-icon-btn" ref={resetRef} aria-label="Reset camera" title="Reset camera">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      <div className="atlas-hud atlas-hud--bl">
        <div className="atlas-glass atlas-readout">
          <div className="atlas-readout-title" ref={statsTitleRef}>
            Narwhal / Bullshark — live
          </div>
          <div className="atlas-stats" ref={statsRef} />
          <div className="atlas-legend" ref={legendRef} />
        </div>
      </div>

      <div className="atlas-hud atlas-hud--br">
        <div className="atlas-glass atlas-inspect" ref={inspectRef} aria-live="polite" />
      </div>

      <div className="atlas-hint" ref={hintRef}>
        Drag to orbit · scroll to zoom · click a node
      </div>
    </div>
  )
}
