import type { CSSProperties } from 'react'
import { SCROLL_STORY_ENABLED } from '../config/featureFlags'

import { ColorShiftBackground } from '../components/cinematic/ColorShiftBackground'
import { HeroSequencer } from '../components/cinematic/HeroSequencer'
import { StageBackdrop } from '../components/cinematic/StageBackdrop'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { HeroFloatingChips } from '../components/home/HeroFloatingChips'
import { HeroEntrance } from '../components/intro/HeroEntrance'
import { useHomeHeroScroll } from '../hooks/useHomeScrollSections'
import { useViewportHeight } from '../hooks/useViewportHeight'
import { FAQSection } from '../components/faq/FAQ'
import { faqGroups } from '../components/faq/data'

function colorShiftClip(value: string, prefersReducedMotion: boolean): CSSProperties {
  return {
    '--color-shift-clip': prefersReducedMotion ? '0%' : value,
  } as CSSProperties
}

export function DeepDivePage() {
  const hero = useHomeHeroScroll()
  const viewportHeight = useViewportHeight()

  return (
    <>
      <section
        id="deep-dive-hero"
        ref={hero.sectionRef}
        aria-labelledby="deep-dive-hero-heading"
        className="stage-theme relative isolate min-h-screen overflow-hidden bg-hero-linear animate-gradient [background-size:180%_180%]"
        style={viewportHeight ? { minHeight: `${viewportHeight}px` } : undefined}
        data-scroll-story={SCROLL_STORY_ENABLED ? '' : undefined}
      >
        <ColorShiftBackground
          data-hero-background=""
          prefersReducedMotion={hero.prefersReducedMotion}
          className="opacity-90"
          style={colorShiftClip('65%', hero.prefersReducedMotion)}
        />
        {/* Cinematic hero sequencer (uses CSS fallbacks until videos are provided) */}
        <HeroSequencer className="pointer-events-none absolute inset-0" />
        {/* Orchestrate the requested entrance sequence once mask & intro end */}
        <HeroEntrance />
        <StageBackdrop progress={hero.stageProgress} />
        <HeroOverlay
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-telcoin-surface/20 to-telcoin-surface/40"
          style={hero.overlayStyle}
          data-hero-overlay=""
        >
          <HeroFloatingChips />
        </HeroOverlay>
        <div
          className="relative mx-auto flex w-full max-w-none flex-col items-center justify-center gap-10 px-6 pb-24 text-center sm:px-8 lg:px-12 lg:pb-28"
          data-hero-card=""
        >
          <div className="home-hero-typography flex flex-col items-center gap-6 mb-16 sm:mb-20 lg:mb-24">
            <h1
              id="deep-dive-hero-heading"
              className="font-semibold text-telcoin-ink"
              data-hero-copy
              data-hero-title
              style={hero.copyStyle}
            >
              Deep Dive
            </h1>
            <p
              className="max-w-none whitespace-normal sm:whitespace-nowrap font-medium text-telcoin-ink leading-tight"
              data-hero-copy
              data-hero-subtitle
              style={hero.copyStyle}
            >
              Learn more about Telcoin
            </p>
            <p
              className="w-full max-w-5xl text-telcoin-ink-muted mt-6 mx-auto text-center"
              data-hero-copy
              data-hero-body
              style={hero.copyStyle}
            >
              Explore in-depth guides, technical documentation, and detailed explanations about the Telcoin Network, TELx, governance, and more. This deep dive section provides comprehensive resources for developers, validators, and anyone looking to understand Telcoin at a deeper level.
            </p>
            <p
              className="w-full max-w-3xl text-telcoin-ink-muted mx-auto text-center"
              data-hero-copy
              data-hero-body
              style={hero.copyStyle}
            >
              All content is kept current by contributors, with live reference points and connected resources across the
              Telcoin platform.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <div className="-mt-[80vh] sm:-mt-[85vh] lg:-mt-[90vh]">
        <FAQSection groups={faqGroups} singleOpen={false} trackHash={false} />
      </div>
    </>
  )
}

