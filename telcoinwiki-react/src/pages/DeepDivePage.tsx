import { DeepDiveFaqSections } from '../components/deepDive/DeepDiveFaqSections'

export function DeepDivePage() {
  return (
    <>
      <section
        id="deep-dive-hero"
        aria-labelledby="deep-dive-hero-heading"
        className="anchor-offset"
      >
        <div className="mx-auto w-full max-w-[min(1600px,95vw)] px-4 sm:px-8 lg:px-12 xl:px-16 pt-[calc(var(--header-height)+4rem)] pb-8 sm:pb-10 lg:pb-12">
          <div className="tc-card-glass p-10 sm:p-12 lg:p-16 text-center">
            <div className="flex flex-col items-center gap-4 mb-6 sm:mb-8 pt-4 sm:pt-6 lg:pt-8">
              <h1
                id="deep-dive-hero-heading"
                className="font-semibold text-telcoin-ink text-4xl sm:text-5xl lg:text-6xl"
              >
                Deep Dive
              </h1>
              <p className="max-w-none whitespace-normal sm:whitespace-nowrap font-medium text-telcoin-ink leading-tight text-lg sm:text-xl">
                Connect the pillars with deeper references
              </p>
              <p className="w-full max-w-5xl text-telcoin-ink-muted mt-4 mx-auto text-center text-base sm:text-lg">
                Move beyond the top-level story. Each section answers advanced questions, cites primary Telcoin resources, and links back to the main pillars so you can keep context straight.
              </p>
            </div>
          <nav className="toc-chips flex flex-wrap justify-center gap-2" aria-label="Deep-Dive sections">
            <a className="toc-chip" href="#deep-problem">
              The Problem
            </a>
            <a className="toc-chip" href="#deep-governance">
              Governance
            </a>
            <a className="toc-chip" href="#deep-network">
              Network
            </a>
            <a className="toc-chip" href="#deep-bank">
              Bank
            </a>
            <a className="toc-chip" href="#deep-tokenomics">
              Tokenomics
            </a>
            <a className="toc-chip" href="#deep-faq">
              FAQ tiebacks
            </a>
          </nav>
          </div>
        </div>
      </section>

      <DeepDiveFaqSections />
    </>
  )
}

