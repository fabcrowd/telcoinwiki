import { Link } from 'react-router-dom'
import { ColorShiftBackground } from '../components/cinematic/ColorShiftBackground'
import { ScrollSplit } from '../components/cinematic/ScrollSplit'
import { StickyModule } from '../components/cinematic/StickyModule'
import { HeroOverlay } from '../components/content/HeroOverlay'
import { PageIntro } from '../components/content/PageIntro'
import { HeroFloatingChips } from '../components/home/HeroFloatingChips'
import { HeroTicker } from '../components/home/HeroTicker'
import { HeroTypingLoop } from '../components/home/HeroTypingLoop'
import { DeepDiveFaqSections } from '../components/deepDive/DeepDiveFaqSections'
import {
  useHomeCtaScroll,
  useHomeHeroScroll,
  useHomeCommunityProofScroll,
  useHomeProductPillarsScroll,
} from '../hooks/useHomeScrollSections'

const productPillars = [
  {
    id: 'orientation',
    eyebrow: 'Orientation',
    title: 'Understand the ecosystem',
    body: 'See how the Wallet, Telcoin Network, and Association work together before you dive into product specifics.',
    href: '/start-here',
    cta: 'Start the quickstart',
  },
  {
    id: 'wallet',
    eyebrow: 'Wallet basics',
    title: 'Set up and secure your app',
    body: 'Walk through verification, recovery phrases, and security best practices to keep your account protected.',
    href: '/wallet',
    cta: 'Open the wallet playbook',
  },
  {
    id: 'digital-cash',
    eyebrow: 'Digital Cash',
    title: 'Learn about stable-value assets',
    body: 'Understand supported e-money tokens, how minting works, and where to monitor reserve disclosures.',
    href: '/digital-cash',
    cta: 'Explore Digital Cash',
  },
  {
    id: 'remittances',
    eyebrow: 'Remittances',
    title: 'Move money across borders',
    body: 'Track active corridors, payout partners, and pricing straight from official Telcoin Wallet updates.',
    href: '/remittances',
    cta: 'Check remittance corridors',
  },
  {
    id: 'deep-dive',
    eyebrow: 'Deep dive',
    title: 'Go beyond the basics',
    body: 'Connect with TEL token utility, TELx liquidity programs, and governance resources when you’re ready for advanced topics.',
    href: '/deep-dive',
    cta: 'Review deep-dive guides',
  },
]

const communityHighlights = [
  {
    title: 'Contributions from Telcoin advocates',
    description:
      'Volunteer editors, community ambassadors, and early adopters share verified answers so new users can move faster.',
  },
  {
    title: 'Links back to official releases',
    description:
      'Every guide points to canonical Telcoin Association statements, Telcoin Wallet updates, and regulatory notices.',
  },
  {
    title: 'Context from real-world usage',
    description: 'Workflow walkthroughs and checklists come from people actively sending remittances and managing liquidity.',
  },
]

export function HomePage() {
  const hero = useHomeHeroScroll()
  const pillars = useHomeProductPillarsScroll()
  const community = useHomeCommunityProofScroll()
  const cta = useHomeCtaScroll()

  return (
    <>
      <PageIntro
        id="home-hero"
        ref={hero.sectionRef}
        variant="hero"
        aria-labelledby="home-hero-heading"
        className="relative isolate bg-hero-linear animate-gradient [background-size:180%_180%]"
        overlay={
          <>
            <ColorShiftBackground
              style={hero.backgroundStyle}
              from="rgba(18,101,255,0.35)"
              to="rgba(142,82,255,0.25)"
            />
            <HeroOverlay
              className="bg-gradient-to-br from-telcoin-surface/0 via-telcoin-surface/20 to-telcoin-surface/0"
              style={hero.overlayStyle}
              data-hero-overlay=""
            >
              <HeroFloatingChips />
            </HeroOverlay>
          </>
        }
        eyebrow={<HeroTypingLoop />}
        title={
          <span id="home-hero-heading" data-hero-copy style={hero.copyStyle}>
            Understand the Telcoin platform in minutes
          </span>
        }
        lede={
          <span data-hero-copy style={hero.copyStyle}>
            This unofficial wiki curates verified answers, onboarding checklists, and direct links to Telcoin Association and
            Telcoin company resources so newcomers can get started with confidence.
          </span>
        }
      >
        <div className="flex flex-col gap-4 lg:gap-6" data-hero-copy style={hero.copyStyle}>
          <HeroTicker />
          <p className="text-sm text-telcoin-ink/70">
            Community-maintained reference. Confirm details inside the Telcoin Wallet or official Association releases.
          </p>
        </div>
      </PageIntro>

      <StickyModule
        ref={pillars.sectionRef}
        id="home-pillars"
        aria-labelledby="home-pillars-heading"
        background={<ColorShiftBackground style={pillars.backgroundStyle} from="rgba(22,18,54,0.35)" to="rgba(67,34,122,0.25)" />}
        sticky={
          <div className="flex flex-col gap-4" data-pillars-intro>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">Product pillars</p>
            <h2 id="home-pillars-heading" className="text-3xl font-semibold text-telcoin-ink lg:text-4xl">
              Choose a pathway tailored to your goal
            </h2>
            <p className="max-w-xl text-lg text-telcoin-ink-muted">
              Five curated tracks map the Telcoin experience—from orientation through deep-dive liquidity strategies—so you
              can explore at your own pace.
            </p>
          </div>
        }
        content={
          <div className="grid gap-6" role="list">
            {productPillars.map((pillar) => (
              <article
                key={pillar.id}
                role="listitem"
                className="flex flex-col gap-4 rounded-2xl border border-telcoin-border bg-telcoin-surface/80 p-6 shadow-lg backdrop-blur"
                data-pillars-card
                style={pillars.cardStyle}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">
                  {pillar.eyebrow}
                </span>
                <h3 className="text-xl font-semibold text-telcoin-ink">{pillar.title}</h3>
                <p className="text-base text-telcoin-ink-muted">{pillar.body}</p>
                <p>
                  <Link className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent" to={pillar.href}>
                    {pillar.cta}
                    <span aria-hidden>→</span>
                  </Link>
                </p>
              </article>
            ))}
          </div>
        }
      />

      <StickyModule
        ref={community.sectionRef}
        id="home-community"
        aria-labelledby="home-community-heading"
        background={<ColorShiftBackground style={community.backgroundStyle} from="rgba(8, 38, 77, 0.35)" to="rgba(67, 157, 255, 0.25)" />}
        containerClassName="lg:gap-12"
        sticky={
          <ScrollSplit
            lead={
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle">Community proof</p>
                <h2 id="home-community-heading" className="text-3xl font-semibold text-telcoin-ink lg:text-4xl">
                  Built alongside the Telcoin community
                </h2>
                <p className="text-lg text-telcoin-ink-muted">
                  Real users publish the checklists and resources they rely on every day, while live network data keeps the
                  story grounded in what’s shipping now.
                </p>
              </>
            }
            asideTop="18vh"
            aside={
              <div data-scroll-split-aside style={community.asideStyle}>
                <HeroTicker />
              </div>
            }
          />
        }
        content={
          <ul className="grid gap-6" role="list">
            {communityHighlights.map((highlight) => (
              <li
                key={highlight.title}
                className="rounded-2xl border border-telcoin-border/80 bg-telcoin-surface/80 p-6 shadow-md backdrop-blur"
                data-community-proof-item
                style={community.itemStyle}
              >
                <h3 className="text-lg font-semibold text-telcoin-ink">{highlight.title}</h3>
                <p className="mt-2 text-base text-telcoin-ink-muted">{highlight.description}</p>
              </li>
            ))}
          </ul>
        }
      />

      <section
        ref={cta.sectionRef}
        id="home-cta"
        aria-labelledby="home-cta-heading"
        className="relative isolate overflow-hidden"
      >
        <ColorShiftBackground style={cta.backgroundStyle} from="rgba(28,20,56,0.5)" to="rgba(105,67,255,0.25)" />
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-telcoin-ink-subtle" data-cta-copy style={cta.copyStyle}>
              Keep going
            </p>
            <h2 id="home-cta-heading" className="text-3xl font-semibold text-telcoin-ink lg:text-4xl" data-cta-copy style={cta.copyStyle}>
              Stay curious with Telcoin deep dives and FAQs
            </h2>
            <p className="text-lg text-telcoin-ink-muted" data-cta-copy style={cta.copyStyle}>
              Bookmark the wiki to check corridor updates, compare Telcoin Wallet releases, or answer the next question your
              friends ask. The FAQ below surfaces our most-read explainers.
            </p>
            <div data-cta-copy style={cta.copyStyle}>
              <Link className="inline-flex items-center gap-2 text-sm font-semibold text-telcoin-accent" to="/start-here">
                See the onboarding guide
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-telcoin-border/80 bg-telcoin-surface/90 p-6 shadow-lg backdrop-blur" data-cta-reveal style={cta.panelStyle}>
            <DeepDiveFaqSections />
          </div>
        </div>
      </section>
    </>
  )
}
