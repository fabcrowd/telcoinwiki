import type { CSSProperties } from 'react'

import { ColorShiftBackground } from '../components/cinematic/ColorShiftBackground'
import { StageBackdrop } from '../components/cinematic/StageBackdrop'
import { StickyModule } from '../components/cinematic/StickyModule'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { HeroFloatingChips } from '../components/home/HeroFloatingChips'
import { HeroTicker } from '../components/home/HeroTicker'
import { HeroTypingLoop } from '../components/home/HeroTypingLoop'
import { SlidingStack } from '../components/cinematic/SlidingStack'
import type { SlidingStackItem } from '../components/cinematic/SlidingStack'
import {
  useHomeBrokenMoneyScroll,
  useHomeEngineScroll,
  useHomeExperienceScroll,
  useHomeHeroScroll,
  useHomeLearnMoreScroll,
  useHomeTelcoinModelScroll,
} from '../hooks/useHomeScrollSections'

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
    label: 'Broken Money',
    heading: 'Why traditional money fails cross-border',
    description:
      'Learn the pain points Telcoin tackles before diving into wallets, tokens, or liquidity programs.',
    backgroundClip: '18%',
    cards: [
      {
        id: 'broken-money-fees',
        eyebrow: 'The pain point',
        title: 'Fees drain everyday transfers',
        body: 'Legacy remittance rails route through multiple intermediaries, adding cost and delays. Track live corridor data to see how Telcoin Wallet pricing compares.',
        href: '/problem#problem-fees',
      },
      {
        id: 'broken-money-access',
        eyebrow: 'Access gaps',
        title: 'Most people rely on mobile money',
        body: 'Billions of people operate without traditional bank accounts. Telcoin Wallet onboarding meets them where they are with localized identity checks and compliance.',
        href: '/problem#problem-access',
      },
      {
        id: 'broken-money-stability',
        eyebrow: 'Stable value',
        title: 'Savings need predictable purchasing power',
        body: 'Telcoin focuses on fully collateralized e-money tokens so families can hold value without exposure to speculative swings.',
        href: '/problem#problem-stability',
      },
    ],
  },
  {
    id: 'telcoin-model',
    label: 'Telcoin Model',
    heading: 'How the Telcoin model aligns incentives',
    description:
      'Understand how the Association, Telcoin company, and community divide responsibilities before you explore advanced docs.',
    backgroundClip: '20%',
    cards: [
      {
        id: 'telcoin-model-structure',
        eyebrow: 'Structure',
        title: 'Three groups, one mission',
        body: 'The Telcoin Association stewards the network, the Telcoin company builds wallet experiences, and the community curates knowledge. See how responsibilities connect.',
        href: '/model#model-structure',
      },
      {
        id: 'telcoin-model-tel',
        eyebrow: 'TEL incentives',
        title: 'TEL aligns operators and liquidity',
        body: 'TEL rewards validators and liquidity providers who keep the network performant. Learn how issuance, burns, and staking support long-term utility.',
        href: '/model#model-incentives',
      },
      {
        id: 'telcoin-model-guardrails',
        eyebrow: 'Guardrails',
        title: 'Policy keeps growth compliant',
        body: 'Regulatory licenses, reserves, and TELx program rules ensure Telcoin services launch responsibly in each market.',
        href: '/model#model-guardrails',
      },
    ],
  },
  {
    id: 'engine',
    label: 'Engine',
    heading: 'What powers the Telcoin engine',
    description:
      'Peek under the hood of the Telcoin Network so you know how value moves once you onboard.',
    backgroundClip: '22%',
    cards: [
      {
        id: 'engine-network',
        eyebrow: 'Network',
        title: 'Validator-operated infrastructure',
        body: 'Federated validators secure the Telcoin Network with audited performance and transparent uptime metrics.',
        href: '/engine#engine-network',
      },
      {
        id: 'engine-ramps',
        eyebrow: 'On / off ramps',
        title: 'Regulated partners connect local rails',
        body: 'Mobile money providers, banks, and fintech partners plug into Telcoin so cash-in and cash-out stay compliant.',
        href: '/engine#engine-ramps',
      },
      {
        id: 'engine-liquidity',
        eyebrow: 'Liquidity',
        title: 'TELx balances stable-value liquidity',
        body: 'Automated market maker pools rebalance liquidity for remittance pairs and digital cash conversions as demand grows.',
        href: '/engine#engine-liquidity',
      },
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    heading: 'What the Telcoin experience feels like',
    description:
      'Walk through the Telcoin Wallet step by step so newcomers know what to expect and how to stay safe.',
    backgroundClip: '24%',
    cards: [
      {
        id: 'experience-onboarding',
        eyebrow: 'Onboarding',
        title: 'Verification built for mobile-first users',
        body: 'KYC, recovery phrases, and device approvals are explained in plain language so anyone can complete setup confidently.',
        href: '/experience#experience-onboarding',
      },
      {
        id: 'experience-send',
        eyebrow: 'Send & receive',
        title: 'Transparent global transfers',
        body: 'Initiate transfers with upfront FX, instant quoting, and clear status updates directly inside the Telcoin Wallet.',
        href: '/experience#experience-transfers',
      },
      {
        id: 'experience-safety',
        eyebrow: 'Safety',
        title: 'Keep your account protected',
        body: 'Security reminders, notification controls, and recovery best practices help you retain control of your funds.',
        href: '/experience#experience-security',
      },
    ],
  },
  {
    id: 'learn-more',
    label: 'Learn More',
    heading: 'Keep learning with the Telcoin community',
    description:
      'Bookmark deeper references once you are comfortable with the basics. Each guide links back to official Telcoin sources.',
    backgroundClip: '26%',
    cards: [
      {
        id: 'learn-more-start',
        eyebrow: 'Start here',
        title: 'Quickstart your Telcoin research',
        body: 'Use the Start Here checklist to cover vocabulary, regulatory context, and wallet readiness in one sitting.',
        href: '/learn#learn-start',
      },
      {
        id: 'learn-more-faq',
        eyebrow: 'FAQ',
        title: 'Answers to recurring questions',
        body: 'The FAQ aggregates community-sourced answers, all linked to official releases for easy verification.',
        href: '/learn#learn-faq',
      },
      {
        id: 'learn-more-deep-dive',
        eyebrow: 'Deep dives',
        title: 'Advance to governance and liquidity',
        body: 'When you are ready to go further, the deep dives unpack TELx programs, policy decisions, and roadmap context.',
        href: '/learn#learn-deep-dive',
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

export function HomePage() {
  const hero = useHomeHeroScroll()
  const brokenMoney = useHomeBrokenMoneyScroll()
  const telcoinModel = useHomeTelcoinModelScroll()
  const engine = useHomeEngineScroll()
  const experience = useHomeExperienceScroll()
  const learnMore = useHomeLearnMoreScroll()

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

  return (
    <>
      <section
        id="home-hero"
        ref={hero.sectionRef}
        aria-labelledby="home-hero-heading"
        className="stage-theme relative isolate overflow-hidden bg-hero-linear animate-gradient [background-size:180%_180%]"
      >
        <ColorShiftBackground
          data-hero-background=""
          prefersReducedMotion={hero.prefersReducedMotion}
          className="opacity-90"
          style={colorShiftClip('65%', hero.prefersReducedMotion)}
        />
        <StageBackdrop progress={hero.stageProgress} />
        <HeroOverlay
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-telcoin-surface/0 via-telcoin-surface/20 to-telcoin-surface/0"
          style={hero.overlayStyle}
          data-hero-overlay=""
        >
          <HeroFloatingChips />
        </HeroOverlay>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6">
            <div data-hero-copy style={hero.copyStyle}>
              <HeroTypingLoop />
            </div>
            <h1
              id="home-hero-heading"
              className="text-3xl font-semibold text-telcoin-ink lg:text-5xl"
              data-hero-copy
              style={hero.copyStyle}
            >
              Understand the Telcoin platform in minutes
            </h1>
            <p className="max-w-3xl text-lg text-telcoin-ink-muted" data-hero-copy style={hero.copyStyle}>
              This unofficial wiki curates verified answers, onboarding checklists, and direct links to Telcoin Association and
              Telcoin company resources so newcomers can get started with confidence.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:gap-6" data-hero-copy style={hero.copyStyle}>
            <HeroTicker />
            <p className="text-sm text-telcoin-ink/70">
              Community-maintained reference. Confirm details inside the Telcoin Wallet or official Association releases.
            </p>
          </div>
        </div>
      </section>

      {sections.map(({ id, label, heading, description, backgroundClip, cards, state }) => (
        <StickyModule
          key={id}
          className="stage-theme"
          ref={state.sectionRef}
          id={`home-${id}`}
          aria-labelledby={`home-${id}-heading`}
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
            <div className="flex flex-col gap-4" data-section-intro style={state.introStyle}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">{label}</p>
              <h2 id={`home-${id}-heading`} className="text-3xl font-semibold text-telcoin-ink lg:text-4xl">
                {heading}
              </h2>
              <p className="max-w-xl text-lg text-telcoin-ink-muted">{description}</p>
            </div>
          }
          content={
            <SlidingStack
              items={cards}
              progress={state.stageProgress}
              prefersReducedMotion={state.prefersReducedMotion}
              style={state.stackStyle}
            />
          }
          prefersReducedMotion={state.prefersReducedMotion}
        />
      ))}
    </>
  )
}
