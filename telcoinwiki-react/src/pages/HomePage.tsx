import type { CSSProperties } from 'react'
import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { SCROLL_STORY_ENABLED } from '../config/featureFlags'

import { ColorShiftBackground } from '../components/cinematic/ColorShiftBackground'
// Removed HeroSequencer and HeroEntrance for performance optimization
import { StageBackdrop } from '../components/cinematic/StageBackdrop'
import { StickyModule } from '../components/cinematic/StickyModule'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { HeroFloatingChips } from '../components/home/HeroFloatingChips'
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
      "The world’s financial system is rigged against everyday people. Between sky-high remittance fees, multi-day delays, and a complete lack of access for the unbanked, it’s clear the problem isn’t the people—it’s the infrastructure. Telcoin starts with a bold fix: put financial power where it belongs—on your phone.",
    backgroundClip: '18%',
    cards: [
      {
        id: 'broken-money-fees',
        eyebrow: 'Cost & Delay',
        title: 'Transfers lose value midstream',
        body: 'Each traditional transfer touches multiple correspondent banks, payment processors, and gatekeepers—each adding cost, delay, and friction. Telcoin cuts out the middle and delivers value directly through the Telcoin App, using blockchain rails that move at internet speed.',
        href: '/deep-dive#deep-problem',
        imageSrc: '/media/deep-dive/digital-cash/inter-carrier-settlements.jpg',
        imageAlt: 'Inter-carrier settlements and payment flows',
        imageAnimation: 'slide-left',
      },
      {
        id: 'broken-money-access',
        eyebrow: 'Inclusion',
        title: 'Mobile-first by necessity',
        body: 'Billions of people don’t have a bank account, but they do have a phone. Telcoin designs its user experience for the real world—where mobile money is how people live, earn, and connect. Onboarding is accessible, secure, and doesn’t require legacy infrastructure.',
        href: '/deep-dive#deep-problem',
        imageSrc: '/media/deep-dive/digital-cash/wallet-mockup-home-r.png',
        imageAlt: 'Mobile wallet interface',
        imageAnimation: 'scale',
      },
      {
        id: 'broken-money-trust',
        eyebrow: 'Trust',
        title: 'Compliance needs transparency',
        body: 'Telcoin doesn’t cut corners—it builds trust. The Telcoin Application Network (TAN) reports usage, activity, and compliance directly to the Telcoin Association. Every feature is aligned with legal clarity and telecom-grade governance, without sacrificing user freedom.',
        href: '/deep-dive#deep-problem',
        imageSrc: '/media/deep-dive/digital-cash/TAN.svg',
        imageAlt: 'Telcoin Association Network',
        imageAnimation: 'rotate',
      },
    ],
  },
  {
    id: 'section-2',
    label: 'Telcoin Model',
    heading: 'Telecom + crypto + compliance, working together',
    description:
      "Telcoin isn’t just another crypto protocol. It’s a purpose-built system that leverages mobile networks, blockchain scalability, and a transparent governance model—engineered to deliver regulated financial access through your phone. Three layers, one seamless experience: Telcoin Network (L1), TELx (liquidity), and the Telcoin Bank app interface.",
    backgroundClip: '20%',
    cards: [
      {
        id: 'telcoin-model-governance',
        eyebrow: 'Governance',
        title: 'GSMA members help secure the chain',
        body: 'Telcoin doesn’t outsource trust. Network validators include GSMA mobile operators, and upgrades flow through an open governance framework led by the Telcoin Association—with direct proposals, working groups, and community oversight.',
        href: '/deep-dive#deep-governance',
        imageSrc: '/media/deep-dive/digital-cash/gsma.svg',
        imageAlt: 'GSMA Partnership',
        imageAnimation: 'slide-up',
      },
      {
        id: 'telcoin-model-network',
        eyebrow: 'Network',
        title: 'Modular by design',
        body: 'Monolithic chains are bloated. Telcoin uses a modular architecture that separates consensus, execution, and settlement—delivering the performance, scalability, and reliability needed for real-world money movement.',
        href: '/deep-dive#deep-network',
        imageSrc: '/media/deep-dive/digital-cash/network.svg',
        imageAlt: 'Telcoin Network Architecture',
        imageAnimation: 'scale',
      },
      {
        id: 'telcoin-model-bank',
        eyebrow: 'Bank Layer',
        title: 'Wallet + Digital Cash = everyday UX',
        body: 'With Telcoin Bank, users get a familiar banking interface—but behind the scenes, they hold their own keys and interact directly with digital cash on-chain. No middlemen. No lock-ins. Just ownership and utility.',
        href: '/deep-dive#deep-bank',
        imageSrc: '/media/deep-dive/digital-cash/telcoin-bank-logo.svg',
        imageAlt: 'Telcoin Digital Asset Bank',
        imageAnimation: 'slide-up',
      },
    ],
  },
  {
    id: 'section-3',
    label: 'The Engine',
    heading: 'Telcoin Network + TEL make it real',
    description:
      'Behind every transaction is Telcoin’s modular Layer 1 blockchain—built for security, speed, and telecom-grade stability. TEL is the fuel: it powers transfers, secures liquidity, and reinforces governance through a sustainable burn-and-regen model.',
    backgroundClip: '22%',
    cards: [
      {
        id: 'engine-topology',
        eyebrow: 'Network Infrastructure',
        title: 'Modular stack, telecom-backed',
        body: 'Telcoin uses Narwhal to handle transaction flow, Bullshark for secure consensus, and the EVM for universal smart contract support. This isn’t just tech—it’s infrastructure built to scale with GSMA-grade validators and no centralized bottlenecks.',
        href: '/deep-dive#deep-network',
        imageSrc: '/media/deep-dive/digital-cash/network.svg',
        imageAlt: 'Modular Network Architecture',
        imageAnimation: 'pulse',
      },
      {
        id: 'engine-tokenomics',
        eyebrow: 'Tokenomics',
        title: 'Burn, regenerate, recycle',
        body: 'Every TEL fee burned reduces supply. Every regenerated TEL flows into Association treasuries that fund future adoption. This flywheel rewards usage, decentralizes control, and sustains long-term growth—all without artificial inflation.',
        href: '/deep-dive#deep-tokenomics',
        imageSrc: '/media/deep-dive/digital-cash/TEL.svg',
        imageAlt: 'TEL Token',
        imageAnimation: 'rotate',
      },
      {
        id: 'engine-liquidity',
        eyebrow: 'Liquidity',
        title: 'TELx keeps flows instant',
        body: 'TELx is the decentralized liquidity engine inside Telcoin. It lets users swap TEL and Digital Cash instantly while keeping ownership—and powers efficient cross-border transfers without going through centralized bridges or exchanges.',
        href: '/deep-dive#deep-tokenomics',
        imageSrc: '/media/deep-dive/digital-cash/TELx.svg',
        imageAlt: 'TELx Platform',
        imageAnimation: 'slide-right',
      },
    ],
  },
  {
    id: 'section-4',
    label: 'Experience',
    heading: 'Real app. Real users. All self-custodied.',
    description:
      'Telcoin’s experience feels like fintech—but works like crypto. From mobile onboarding to instant remittance, users enjoy the freedom of self-custody and the security of blockchain without ever needing to touch a seed phrase.',
    backgroundClip: '24%',
    cards: [
      {
        id: 'experience-onboarding',
        eyebrow: 'Onboard',
        title: 'KYC that fits your phone',
        body: 'Onboarding should work anywhere, anytime. Telcoin’s mobile-native KYC and recovery flows make it simple to verify identity, secure your wallet, and retain full control—without needing a desktop or a crypto background.',
        href: '/deep-dive#deep-bank',
        imageSrc: '/media/deep-dive/digital-cash/wallet-mockup-home-r.png',
        imageAlt: 'Mobile wallet onboarding',
        imageAnimation: 'slide-up',
      },
      {
        id: 'experience-send',
        eyebrow: 'Send & Receive',
        title: 'Transparent before you tap',
        body: 'Telcoin’s remittance experience shows you fees, exchange rates, and delivery timing up front—no surprises. You tap send, and the app handles everything behind the scenes, from compliance checks to blockchain confirmation.',
        href: '/deep-dive#deep-bank',
        imageSrc: '/media/deep-dive/digital-cash/wallet-mockup-send-php-l.png',
        imageAlt: 'Transparent payment interface',
        imageAnimation: 'scale',
      },
      {
        id: 'experience-security',
        eyebrow: 'Stay Safe',
        title: 'Security that stays out of your way',
        body: 'Telcoin includes 2FA, push alerts, suspicious activity notifications, and device verification to keep you protected—without slowing down your experience or locking you out of your own wallet.',
        href: '/deep-dive#deep-bank',
        imageSrc: '/media/marquee/logos/icon-blockchain.svg',
        imageAlt: 'Blockchain security',
        imageAnimation: 'fade',
      },
    ],
  },
  {
    id: 'section-5',
    label: 'Learn More',
    heading: 'Go deeper once the story clicks',
    description:
      'Once you get the big picture, you might want the specifics. This section links into verified docs, live governance records, token mechanics, and answers that cite real sources—not speculation.',
    backgroundClip: '26%',
    cards: [
      {
        id: 'learn-more-governance',
        eyebrow: 'Governance Hub',
        title: 'See how proposals move',
        body: 'Want to understand how Telcoin evolves? Dive into validator policies, issuance mechanisms, and Association governance tools—all tracked and published publicly.',
        href: '/deep-dive#deep-governance',
        imageSrc: '/media/deep-dive/digital-cash/ta.svg',
        imageAlt: 'Telcoin Association',
        imageAnimation: 'slide-left',
      },
      {
        id: 'learn-more-faq',
        eyebrow: 'FAQ',
        title: 'Questions tied to sources',
        body: "Every answer in this FAQ cites Telcoin documentation directly—so you're never guessing, and never relying on outdated community posts.",
        href: '/deep-dive#deep-faq',
        imageSrc: '/media/marquee/logos/icon-blockchain.svg',
        imageAlt: 'Information and documentation',
        imageAnimation: 'scale',
      },
      {
        id: 'learn-more-deep',
        eyebrow: 'Deep Dives',
        title: 'Learn by comparing',
        body: 'What’s the difference between TEL and Digital Cash? How does TELx liquidity impact remittance speed? Use these docs to compare components across the Telcoin stack.',
        href: '/deep-dive#deep-dive-hero',
        imageSrc: '/media/deep-dive/digital-cash/TEL.svg',
        imageAlt: 'TEL, TELx, and Digital Cash',
        imageAnimation: 'fade',
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
        {/* Removed HeroSequencer and HeroEntrance for performance optimization */}
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






