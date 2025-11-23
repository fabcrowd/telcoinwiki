import type { CSSProperties } from 'react'
import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { SCROLL_STORY_ENABLED } from '../config/featureFlags'

import { ColorShiftBackground } from '../components/cinematic/ColorShiftBackground'
import { HeroSequencer } from '../components/cinematic/HeroSequencer'
import { StageBackdrop } from '../components/cinematic/StageBackdrop'
import { StickyModule } from '../components/cinematic/StickyModule'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { HeroFloatingChips } from '../components/home/HeroFloatingChips'
import { HeroEntrance } from '../components/intro/HeroEntrance'
import { SlidingStack } from '../components/cinematic/SlidingStack'
import { MainWorkspaceCard } from '../components/cinematic/MainWorkspaceCard'
import type { SlidingStackItem } from '../components/cinematic/SlidingStack'
import {
  useHomeBrokenMoneyScroll,
  useHomeSection2Scroll,
  useHomeSection3Scroll,
  useHomeSection4Scroll,
  useHomeSection5Scroll,
  useHomeHeroScroll,
} from '../hooks/useHomeScrollSections'
import { cn } from '../utils/cn'
import { useViewportHeight } from '../hooks/useViewportHeight'
import { FAQSection } from '../components/faq/FAQ'
import { faqGroups } from '../components/faq/data'
interface HomeNarrativeSection {
  id: 'broken-money' | 'section-2' | 'section-3' | 'section-4' | 'section-5'
  label: string
  heading: string
  description: string
  backgroundClip: string
  cards: SlidingStackItem[]
}

const homeNarrativeSections: HomeNarrativeSection[] = [
  {
    id: 'broken-money',
    label: 'The Problem',
    heading: 'Broken money keeps billions locked out',
    description:
      'Remittance costs are high, delays are common, and most people globally are unbanked. Telcoin starts by fixing that—with mobile-native access.',
    backgroundClip: '18%',
    cards: [
      {
        id: 'broken-money-fees',
        eyebrow: 'Cost & Delay',
        title: 'Transfers lose value midstream',
        body: 'Traditional payments move through middlemen and fee layers. Telcoin compresses those inside the wallet.',
        href: '/deep-dive#deep-problem',
      },
      {
        id: 'broken-money-access',
        eyebrow: 'Inclusion',
        title: 'Mobile-first by necessity',
        body: 'Telcoin designs onboarding so users can access services without needing a bank account.',
        href: '/deep-dive#deep-problem',
      },
      {
        id: 'broken-money-trust',
        eyebrow: 'Trust',
        title: 'Compliance needs transparency',
        body: 'TAN reporting and Association-led policy keep telecom-grade oversight at the heart of the system.',
        href: '/deep-dive#deep-problem',
      },
    ],
  },
  {
    id: 'section-2',
    label: 'Telcoin Model',
    heading: 'Telecom + crypto + compliance, working together',
    description:
      'Telcoin blends telecom reach, blockchain infrastructure, and legal clarity into a single system—powered by the Telcoin Network, TELx, and the Telcoin Bank experience.',
    backgroundClip: '20%',
    cards: [
      {
        id: 'telcoin-model-governance',
        eyebrow: 'Governance',
        title: 'GSMA members help secure the chain',
        body: 'Telcoin Association stewards the protocol with validator input, open proposals, and TEL issuance policy.',
        href: '/deep-dive#deep-governance',
      },
      {
        id: 'telcoin-model-network',
        eyebrow: 'Network',
        title: 'Modular by design',
        body: 'Unlike monolithic chains, Telcoin separates execution, consensus, and settlement—improving scale and resilience.',
        href: '/deep-dive#deep-network',
      },
      {
        id: 'telcoin-model-bank',
        eyebrow: 'Bank Layer',
        title: 'Wallet + Digital Cash = everyday UX',
        body: 'The Telcoin Bank experience bridges fiat-backed assets with self-custodial wallets that feel familiar.',
        href: '/deep-dive#deep-bank',
      },
    ],
  },
  {
    id: 'section-3',
    label: 'The Engine',
    heading: 'Telcoin Network + TEL make it real',
    description:
      'Telcoin Network is a modular, EVM-compatible chain built for performance. TEL powers transactions, staking, liquidity, and rewards—via a burn-and-regen cycle.',
    backgroundClip: '22%',
    cards: [
      {
        id: 'engine-topology',
        eyebrow: 'Network Infrastructure',
        title: 'Modular stack, optimized consensus',
        body: 'Telcoin uses Narwhal for mempool ordering, Bullshark for BFT finality, and the EVM for execution—all modular, all optimized.',
        href: '/deep-dive#deep-network',
      },
      {
        id: 'engine-tokenomics',
        eyebrow: 'Tokenomics',
        title: 'Burn, regenerate, recycle',
        body: 'TEL fees are burned every block and regenerated into Telcoin Association treasuries—funding growth and governance.',
        href: '/deep-dive#deep-tokenomics',
      },
      {
        id: 'engine-liquidity',
        eyebrow: 'Liquidity',
        title: 'TELx keeps flows instant',
        body: 'TELx liquidity pools pair TEL with Digital Cash so users can swap, send, and settle without bottlenecks.',
        href: '/deep-dive#deep-tokenomics',
      },
    ],
  },
  {
    id: 'section-4',
    label: 'Experience',
    heading: 'Real app. Real users. All self-custodied.',
    description:
      'Telcoin App gives users control without complexity. Everything—onboarding, transfers, swaps—happens in a familiar, secure mobile flow.',
    backgroundClip: '24%',
    cards: [
      {
        id: 'experience-onboarding',
        eyebrow: 'Onboard',
        title: 'KYC that fits your phone',
        body: 'Mobile-native verification with recovery flows helps anyone onboard without needing a desktop or seed phrase.',
        href: '/deep-dive#deep-bank',
      },
      {
        id: 'experience-send',
        eyebrow: 'Send & Receive',
        title: 'Transparent before you tap',
        body: 'Corridor pricing shows fees, FX, and timing up front—aligned with TAN compliance tracking.',
        href: '/deep-dive#deep-bank',
      },
      {
        id: 'experience-security',
        eyebrow: 'Stay Safe',
        title: 'Security built-in',
        body: 'Notifications, 2FA prompts, and alerts give users confidence without slowing them down.',
        href: '/deep-dive#deep-bank',
      },
    ],
  },
  {
    id: 'section-5',
    label: 'Learn More',
    heading: 'Go deeper once the story clicks',
    description:
      "Browse full documentation, validator requirements, and a living FAQ—each tied back to Telcoin's ecosystem and verified sources.",
    backgroundClip: '26%',
    cards: [
      {
        id: 'learn-more-governance',
        eyebrow: 'Governance Hub',
        title: 'See how proposals move',
        body: 'Review Association roles, validator expectations, and how policy evolves in public.',
        href: '/deep-dive#deep-governance',
      },
      {
        id: 'learn-more-faq',
        eyebrow: 'FAQ',
        title: 'Questions tied to sources',
        body: 'Filterable answers cite Telcoin documentation directly—no guessing, no fluff.',
        href: '/deep-dive#deep-faq',
      },
      {
        id: 'learn-more-deep',
        eyebrow: 'Deep Dives',
        title: 'Learn by comparing',
        body: 'Explore TEL, TELx, and Digital Cash across use cases—from liquidity to treasury flows.',
        href: '/deep-dive#deep-dive-hero',
      },
    ],
  },
]

type HomeStackSectionState = ReturnType<typeof useHomeBrokenMoneyScroll>

function colorShiftClip(value: string, prefersReducedMotion: boolean): CSSProperties {
  return {
    '--color-shift-clip': prefersReducedMotion ? '0%' : value,
  } as CSSProperties
}

// Storyboard content removed per request

export function HomePage() {
  const hero = useHomeHeroScroll()
  const brokenMoney = useHomeBrokenMoneyScroll()
  const section2 = useHomeSection2Scroll()
  const section3 = useHomeSection3Scroll()
  const section4 = useHomeSection4Scroll()
  const section5 = useHomeSection5Scroll()
  const viewportHeight = useViewportHeight()

  // Lenis smooth scrolling is initialized in CinematicLayout
  // CSS sticky handles card stacking (not replaced by ScrollTrigger)

  // Toggle for non-storyboard narrative sections (disabled per request)
  const NON_STORYBOARD_ENABLED = true

  const sectionStates: Record<HomeNarrativeSection['id'], HomeStackSectionState> = useMemo(() => ({
    'broken-money': brokenMoney,
    'section-2': section2,
    'section-3': section3,
    'section-4': section4,
    'section-5': section5,
  }), [brokenMoney, section2, section3, section4, section5])

  const sections = useMemo(() => homeNarrativeSections.map((section) => ({
    ...section,
    state: sectionStates[section.id],
  })), [sectionStates])

  const location = useLocation()

  // Handle FAQ section scroll when hash is present
  useEffect(() => {
    if (location.hash === '#faq-section') {
      const faqSection = document.getElementById('faq-section')
      if (faqSection) {
        // Small delay to ensure page is rendered
        setTimeout(() => {
          faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [location.hash])

  // Removed story pin variables along with storyboard

  return (
    <>
      <section
        id="home-hero"
        ref={hero.sectionRef}
        aria-labelledby="home-hero-heading"
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
            {/* Keep same positioning; replace copy with requested text and sizing */}
            <h1
              id="home-hero-heading"
              className="font-semibold text-telcoin-ink"
              data-hero-copy
              data-hero-title
              style={hero.copyStyle}
            >
              The Telcoin Wiki
            </h1>
            <p
              className="max-w-none whitespace-normal sm:whitespace-nowrap font-medium text-telcoin-ink leading-tight"
              data-hero-copy
              data-hero-subtitle
              style={hero.copyStyle}
            >
              Clear answers. Fast learning. Community-powered.
            </p>
            <p
              className="w-full max-w-5xl text-telcoin-ink-muted mt-6 mx-auto text-center"
              data-hero-copy
              data-hero-body
              style={hero.copyStyle}
            >
              This community-curated wiki offers verified answers, explainers, and direct links to Telcoin Association and
              ecosystem tools—designed to help anyone learn how Telcoin works in minutes, not hours. Whether you&rsquo;re just getting
              started or diving deep into the Telcoin Network, TELx, or the Telcoin App, you&rsquo;ll find fast, reliable guidance
              grounded in official documentation and field-tested by active users.
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

      {/* Removed Storyboard sticky section per request */}

      {/* Former HorizontalRail removed per new header strategy. */}
      {/* Removed legacy sliding deck cards from previous build */}

      {NON_STORYBOARD_ENABLED ? sections.map((section, index) => {
        const { id, label, heading, description, backgroundClip, cards, state } = section
        const activeIndex = cards.length > 1
          ? Math.min(cards.length - 1, Math.floor(state.stackProgress * cards.length))
          : 0
        const isFirstSection = index === 0

        const isSection2Or3Or4Or5 = id === 'section-2' || id === 'section-3' || id === 'section-4' || id === 'section-5'
        const sectionOffset = 'sectionOffset' in state ? (state as { sectionOffset?: number }).sectionOffset : undefined

        return (
          <StickyModule
            key={id}
            className="stage-theme"
            ref={state.sectionRef}
            id={`home-${id}`}
            aria-labelledby={`home-${id}-heading`}
            containerClassName={cn(
              'max-w-[min(1920px,98vw)] pt-16 pb-16 lg:pt-20 lg:pb-20',
              isFirstSection && 'pt-4 lg:pt-6',
            )}
            style={isSection2Or3Or4Or5 && sectionOffset !== undefined ? { marginTop: `${sectionOffset}px` } : undefined}
          background={
            <>
              <ColorShiftBackground
                prefersReducedMotion={state.prefersReducedMotion}
                style={colorShiftClip(backgroundClip, state.prefersReducedMotion)}
              />
              <StageBackdrop progress={state.stageProgress} />
            </>
          }
          sticky={
            <MainWorkspaceCard progress={state.stageProgress}>
              <div className="flex flex-col gap-4" data-section-intro style={state.introStyle}>
                <p className="text-[1.5rem] font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">{label}</p>
                <h2 id={`home-${id}-heading`} className="text-[2.5rem] font-semibold text-telcoin-ink lg:text-[2.875rem]">
                  {heading}
                </h2>
                <p className="max-w-xl text-[1.75rem] text-telcoin-ink-muted">{description}</p>
                <ol className="workspace-pin__list">
                  {cards.map((card, index) => (
                    <li
                      key={card.id}
                      className={cn('workspace-pin__listItem', index === activeIndex && 'is-active')}
                    >
                      <span className={cn('workspace-pin__listIndex', index === activeIndex && 'is-active')}>
                        {index + 1}
                      </span>
                      <span className="workspace-pin__listLabel">{card.title}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </MainWorkspaceCard>
          }
          content={
            <SlidingStack
              items={cards}
              onProgressChange={state.onStackProgress}
              prefersReducedMotion={state.prefersReducedMotion}
              style={state.stackStyle}
              enabled={state.stackCardsEnabled !== false}
            />
          }
          prefersReducedMotion={state.prefersReducedMotion}
          stickyStyle={state.stickyStyle}
          timelineDriven
        />
        )
      }) : null}

      {/* FAQ section */}
      <div id="faq-section" className="-mt-[80vh] sm:-mt-[85vh] lg:-mt-[90vh]" style={{ scrollMarginTop: 'calc(var(--header-height) + 1rem)' }}>
        <FAQSection groups={faqGroups} singleOpen={false} trackHash={false} />
      </div>

      {/* Below this point, we intentionally remove additional content to focus on the sliding cards. */}
    </>
  )
}






