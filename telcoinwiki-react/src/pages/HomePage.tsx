import type { CSSProperties } from 'react'
import { SCROLL_STORY_ENABLED } from '../config/featureFlags'

import { ColorShiftBackground } from '../components/cinematic/ColorShiftBackground'
import { HeroSequencer } from '../components/cinematic/HeroSequencer'
import { StageBackdrop } from '../components/cinematic/StageBackdrop'
import { StickyModule } from '../components/cinematic/StickyModule'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { HeroFloatingChips } from '../components/home/HeroFloatingChips'
import { HeroTicker } from '../components/home/HeroTicker'
import { SlidingStack } from '../components/cinematic/SlidingStack'
import { MainWorkspaceCard } from '../components/cinematic/MainWorkspaceCard'
import type { SlidingStackItem } from '../components/cinematic/SlidingStack'
import {
  useHomeBrokenMoneyScroll,
  useHomeEngineScroll,
  useHomeExperienceScroll,
  useHomeHeroScroll,
  useHomeLearnMoreScroll,
  useHomeTelcoinModelScroll,
} from '../hooks/useHomeScrollSections'
import { cn } from '../utils/cn'

interface HomeNarrativeSection {
  id: 'broken-money' | 'telcoin-model' | 'engine' | 'experience' | 'learn-more'
  label: string
  heading: string
  description: string
  backgroundClip: string
  cards: SlidingStackItem[]
}

const homeNarrativeSections: HomeNarrativeSection[] = [
  {
    id: 'broken-money',
    label: '1 â€” The Problem',
    heading: 'Broken money keeps billions locked out',
    description:
      'Start with the real-world friction: remittance fees, delayed settlements, and unbanked households who rely on mobile money.',
    backgroundClip: '18%',
    cards: [
      {
        id: 'broken-money-fees',
        eyebrow: 'Cost & delay',
        title: 'Transfers lose value in the middle',
        body: 'Traditional corridors route through multiple correspondent banks. Watch how Telcoin compresses fee stacks inside the Wallet.',
        href: '#broken-money-fees',
      },
      {
        id: 'broken-money-access',
        eyebrow: 'Inclusion',
        title: 'Mobile-first by necessity',
        body: 'Telcoin designs the onboarding flow so mobile money users can clear compliance without a legacy bank account.',
        href: '#broken-money-access',
      },
      {
        id: 'broken-money-trust',
        eyebrow: 'Trust',
        title: 'Compliance needs transparency',
        body: 'Association-led policy and TAN reporting make sure fintech conveniences do not abandon telecom-grade oversight.',
        href: '#broken-money-trust',
      },
    ],
  },
  {
    id: 'telcoin-model',
    label: '2 â€” Telcoin Model',
    heading: 'Telecom + crypto + compliance working together',
    description:
      'Meet the three-layer system: the Telcoin Network (L1), TELx liquidity, and the Telcoin Application Network (TAN).',
    backgroundClip: '20%',
    cards: [
      {
        id: 'telcoin-model-governance',
        eyebrow: 'Governance',
        title: 'GSMA members steward the chain',
        body: 'Explore how the Telcoin Association, councils, and working groups approve upgrades and TEL issuance policies.',
        href: '#telcoin-model-governance',
      },
      {
        id: 'telcoin-model-network',
        eyebrow: 'Network',
        title: 'DAG-powered consensus',
        body: 'Understand why the Telcoin Network pairs DAG execution with BFT finality and GSMA validators.',
        href: '#telcoin-model-network',
      },
      {
        id: 'telcoin-model-bank',
        eyebrow: 'Bank layer',
        title: 'Wallet + Digital Cash = familiar UX',
        body: 'Scroll into the Telcoin Bank experience to see how fiat-backed assets meet self-custody.',
        href: '#telcoin-model-bank',
      },
    ],
  },
  {
    id: 'engine',
    label: '3 â€” The Engine',
    heading: 'Network + TEL make the system real',
    description:
      'Dive into how consensus, liquidity, and burn/regen tokenomics keep the platform running.',
    backgroundClip: '22%',
    cards: [
      {
        id: 'engine-topology',
        eyebrow: 'Interactive topology',
        title: 'Trace value flows visually',
        body: 'Use the interactive network map to follow TEL burn, liquidity routes, and TAN compliance loops.',
        href: '#engine-topology',
      },
      {
        id: 'engine-tokenomics',
        eyebrow: 'Tokenomics',
        title: 'Burn, regen, and treasuries',
        body: 'See how TEL fees burn supply while Association treasuries recycle rewards into real usage.',
        href: '#engine-tokenomics',
      },
      {
        id: 'engine-liquidity',
        eyebrow: 'Liquidity',
        title: 'TELx routes liquidity instantly',
        body: 'Learn how TELx pools pair TEL with Digital Cash so remittances and swaps stay fluid.',
        href: '#engine-liquidity',
      },
    ],
  },
  {
    id: 'experience',
    label: '4 â€” Experience',
    heading: 'Real app. Real users. All self-custodied.',
    description:
      'Walk through the Telcoin Bank journey from onboarding to payout so new users know exactly what to expect.',
    backgroundClip: '24%',
    cards: [
      {
        id: 'experience-onboarding',
        eyebrow: 'Onboard',
        title: 'Clear, mobile-native KYC',
        body: 'Step-by-step copy, device binding, and recovery training help non-crypto natives finish verification.',
        href: '#experience-onboarding',
      },
      {
        id: 'experience-send',
        eyebrow: 'Send & receive',
        title: 'Transparent corridor pricing',
        body: 'Fees, FX, and timing surface before you tap send; status events mirror TAN compliance checkpoints.',
        href: '#experience-send',
      },
      {
        id: 'experience-security',
        eyebrow: 'Stay safe',
        title: 'Security-first guardrails',
        body: 'Notifications, two-factor prompts, and newsroom alerts keep everyday users aligned with best practice.',
        href: '#experience-security',
      },
    ],
  },
  {
    id: 'learn-more',
    label: '5 â€” Learn More & FAQ',
    heading: 'Go deeper once the story clicks',
    description:
      'Jump from these summaries into long-form documentation, governance minutes, and a living FAQ that ties each question back to source material.',
    backgroundClip: '26%',
    cards: [
      {
        id: 'learn-more-governance',
        eyebrow: 'Governance hub',
        title: 'Explore policy & councils',
        body: 'Read governance briefs, validator requirements, and how proposals advance through the Association.',
        href: '#learn-more-governance',
      },
      {
        id: 'learn-more-faq',
        eyebrow: 'FAQ',
        title: 'Answers that cite sources',
        body: 'Filterable FAQ entries cite Telcoin docs so curious users can verify everything themselves.',
        href: '#learn-more-faq',
      },
      {
        id: 'learn-more-deep',
        eyebrow: 'Deep dives',
        title: 'Compare TEL resources',
        body: 'Use the deep-dive library to contrast TEL, Digital Cash, and TELx mechanics across the Telcoin stack.',
        href: '#learn-more-deep',
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

const storyDeckStyle: CSSProperties & Record<'--stack-top' | '--stack-bottom' | '--stack-tail', string> = {
  '--stack-top': 'calc(var(--header-height) + 2.5vh)',
  '--stack-bottom': '0vh',
  '--stack-tail': '800vh',
}

export function HomePage() {
  const hero = useHomeHeroScroll()
  const brokenMoney = useHomeBrokenMoneyScroll()
  const telcoinModel = useHomeTelcoinModelScroll()
  const engine = useHomeEngineScroll()
  const experience = useHomeExperienceScroll()
  const learnMore = useHomeLearnMoreScroll()

  // Toggle for non-storyboard narrative sections (disabled per request)
  const NON_STORYBOARD_ENABLED = false

  const sectionStates: Record<HomeNarrativeSection['id'], HomeStackSectionState> = {
    'broken-money': brokenMoney,
    'telcoin-model': telcoinModel,
    engine,
    experience,
    'learn-more': learnMore,
  }

  const sections = homeNarrativeSections.map((section) => ({
    ...section,
    state: sectionStates[section.id],
  }))

  // Removed story pin variables along with storyboard

  return (
    <>
      <section
        id="home-hero"
        ref={hero.sectionRef}
        aria-labelledby="home-hero-heading"
        className="stage-theme relative isolate overflow-hidden bg-hero-linear animate-gradient [background-size:180%_180%]"
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
        <StageBackdrop progress={hero.stageProgress} />
        <HeroOverlay
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-telcoin-surface/0 via-telcoin-surface/20 to-telcoin-surface/0"
          style={hero.overlayStyle}
          data-hero-overlay=""
        >
          <HeroFloatingChips />
        </HeroOverlay>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pt-32 pb-24 sm:px-8 lg:px-12 lg:pt-44">
          <div className="flex flex-col gap-6">
            {/* Keep same positioning; replace copy with requested text and sizing */}
            <h1
              id="home-hero-heading"
              className="text-4xl font-semibold text-telcoin-ink sm:text-6xl lg:text-8xl"
              data-hero-copy
              style={hero.copyStyle}
            >
              The Telcoin Wiki
            </h1>
            <p
              className="max-w-none text-6xl font-medium text-telcoin-ink sm:text-8xl lg:text-9xl"
              data-hero-copy
              style={hero.copyStyle}
            >
              Clear answers. Fast learning. Community-powered.
            </p>
            <p className="max-w-4xl text-lg text-telcoin-ink-muted" data-hero-copy style={hero.copyStyle}>
              This community-curated wiki offers verified answers, explainers, and direct links to Telcoin Association and
              ecosystem tools—designed to help anyone learn how Telcoin works in minutes, not hours. Whether you're just getting
              started or diving deep into the Telcoin Network, TELx, or the Telcoin App, you'll find fast, reliable guidance
              grounded in official documentation and field-tested by active users.
            </p>
            <p className="max-w-4xl text-lg text-telcoin-ink-muted" data-hero-copy style={hero.copyStyle}>
              All content is kept current by contributors, with live reference points and connected resources across the
              Telcoin platform.
            </p>
          </div>
          {/* Ticker moved to bottom of hero for requested placement */}
        </div>
        <div
          className="pointer-events-auto absolute inset-x-6 bottom-6 sm:inset-x-8 lg:inset-x-12"
          data-hero-copy
          style={hero.copyStyle}
        >
          <div className="mx-auto max-w-6xl">
            <HeroTicker />
          </div>
        </div>
      </section>

      {/* Sliding deck: four-story beats directly under the hero (feature-flagged) */}
      {SCROLL_STORY_ENABLED ? (
        <section id="home-story-cards" className="anchor-offset">
          <div className="mx-auto w-full max-w-[min(1440px,90vw)] px-4 sm:px-8 lg:px-12 xl:px-16">
            <SlidingStack
              className="mt-4"
              style={storyDeckStyle}
              items={[
                {
                  id: 'story-problem',
                  tabLabel: 'The Problem:',
                  title: "Money Isn’t Built for People",
                  body:
                    'Most of the world’s financial infrastructure excludes the very people who need it most. Sending money costs too much, takes too long, and leaves billions behind.',
                },
                {
                  id: 'story-model',
                  tabLabel: 'The Telcoin Model:',
                  title: 'Financial Access, Rebuilt',
                  body:
                    'Telcoin is a new kind of system—combining telecom networks, blockchain rails, and regulatory clarity to move money like a message. It’s mobile-first, self-custodial, and built to reach anyone with a phone.',
                },
                {
                  id: 'story-engine',
                  tabLabel: 'The Engine:',
                  title: 'Telcoin Network + $TEL',
                  body:
                    'At the core is the Telcoin Network, a purpose-built Layer 1 blockchain secured by mobile network operators. The $TEL token powers everything—from transaction fees to staking, liquidity, and governance—through a unique burn-and-regen model.',
                },
                {
                  id: 'story-experience',
                  tabLabel: 'The Experience:',
                  title: 'Use It Like an App, Own It Like Crypto',
                  body:
                    'With the Telcoin App, users can send money, swap assets, and earn—all without giving up control. No middlemen, no passwords—just a secure wallet in your pocket that works like the apps you already use.',
                },
              ]}
            />
          </div>
          {/* spacer removed after storyboard removal */}
        </section>
      ) : null}

      {/* Removed Storyboard sticky section per request */}

      {/* Former HorizontalRail removed per new header strategy. */}

      {NON_STORYBOARD_ENABLED ? sections.map(({ id, label, heading, description, backgroundClip, cards, state }) => {
        const activeIndex = cards.length > 1
          ? Math.min(cards.length - 1, Math.floor(state.stackProgress * cards.length))
          : 0

        return (
          <StickyModule
          key={id}
          className="stage-theme"
          ref={state.sectionRef}
          id={`home-${id}`}
          aria-labelledby={`home-${id}-heading`}
          containerClassName="max-w-[min(1920px,98vw)]"
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">{label}</p>
                <h2 id={`home-${id}-heading`} className="text-3xl font-semibold text-telcoin-ink lg:text-4xl">
                  {heading}
                </h2>
                <p className="max-w-xl text-lg text-telcoin-ink-muted">{description}</p>
                <ol className="workspace-pin__list">
                  {cards.map((card, index) => (
                    <li
                      key={card.id}
                      className={cn('workspace-pin__listItem', { 'is-active': index === activeIndex })}
                    >
                      <span className={cn('workspace-pin__listIndex', { 'is-active': index === activeIndex })}>
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
            />
          }
          prefersReducedMotion={state.prefersReducedMotion}
          stickyStyle={state.stickyStyle}
          timelineDriven
        />
        )
      }) : null}

      {/* Below this point, we intentionally remove additional content to focus on the sliding cards. */}
    </>
  )
}

// import { LogoMarquee } from '../components/cinematic/LogoMarquee'
