import { useState } from 'react';
import referenceContentData, { PhaseState } from '../data/referenceContent';

const stateStyles: Record<PhaseState, string> = {
  complete: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-300/40',
  active: 'bg-sky-500/15 text-sky-200 ring-1 ring-inset ring-sky-300/40',
  upcoming: 'bg-slate-500/15 text-slate-200 ring-1 ring-inset ring-slate-300/40'
};

const stateLabel: Record<PhaseState, string> = {
  complete: 'Complete',
  active: 'In progress',
  upcoming: 'Planned'
};

const StatusLanding = () => {
  const { hero, currentPhase, security, roadmap, learnMore } = referenceContentData;
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(learnMore.accordion[0]?.id ?? null);

  return (
    <main className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-16 text-white" aria-labelledby="status-hero">
      <section className="space-y-6" aria-labelledby="status-hero">
        <p className="text-sm uppercase tracking-wider text-slate-300">Network Status</p>
        <div className="space-y-4 rounded-3xl border border-border/60 bg-surface/70 p-10 shadow-lg backdrop-blur">
          <div className="space-y-3">
            <h1 id="status-hero" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {hero.title}
            </h1>
            <p className="text-lg text-slate-200 sm:text-xl">{hero.description}</p>
          </div>
          <div className="text-sm text-slate-300" role="status">
            {hero.lastUpdatedLabel}
          </div>
        </div>
      </section>

      <section id="status" aria-labelledby="current-phase-heading" className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="current-phase-heading" className="text-2xl font-semibold tracking-tight">
              {currentPhase.title}
            </h2>
            <p className="max-w-2xl text-slate-300">{currentPhase.description}</p>
          </div>
          <div className="w-full sm:w-72">
            <div className="text-sm text-slate-400">{currentPhase.progress.label}</div>
            <div className="mt-2 h-2 rounded-full bg-slate-700">
              <div
                className="h-2 rounded-full bg-sky-400"
                style={{ width: `${currentPhase.progress.value}%` }}
                role="progressbar"
                aria-valuenow={currentPhase.progress.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={currentPhase.progress.assistive}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {currentPhase.cards.map((card) => (
            <article
              key={card.id}
              className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border/60 bg-surfaceAlt/80 p-6 shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${stateStyles[card.state]}`}>
                    {stateLabel[card.state]}
                  </span>
                  <span className="text-sm text-slate-300">{card.statusLabel}</span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{card.title}</h3>
                <p className="text-sm text-slate-200">{card.body}</p>
              </div>
              <div className="text-xs text-slate-400">{card.meta}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="security" aria-labelledby="security-heading" className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="security-heading" className="text-2xl font-semibold tracking-tight">
              {security.title}
            </h2>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="space-y-3 rounded-2xl border border-border/60 bg-surface/70 p-6">
            <ul className="list-disc space-y-2 pl-5 text-slate-200">
              {security.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {security.statCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-2xl border border-border/60 bg-surfaceAlt/80 p-5 text-sm text-slate-200"
                >
                  <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
                  <div className="mt-2 text-3xl font-semibold text-white">{card.value}</div>
                  <p className="mt-3 text-xs text-slate-400">{card.caption}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border/60 bg-surfaceAlt/80 p-5 text-sm text-slate-200">
              <div className="text-xs uppercase tracking-wider text-slate-400">{security.tableTitle}</div>
              <dl className="mt-3 space-y-3">
                {security.tableRows.map((row) => (
                  <div key={row.label} className="flex flex-col border-t border-border/40 pt-3 first:border-t-0 first:pt-0">
                    <dt className="text-xs text-slate-400">{row.label}</dt>
                    <dd className="text-sm text-slate-200">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" aria-labelledby="roadmap-heading" className="space-y-8">
        <div className="space-y-3">
          <h2 id="roadmap-heading" className="text-2xl font-semibold tracking-tight">
            {roadmap.title}
          </h2>
          <p className="max-w-2xl text-slate-300">{roadmap.description}</p>
        </div>
        <ol className="space-y-6">
          {roadmap.milestones.map((item) => (
            <li key={item.id} className="relative pl-8">
              <span className="absolute left-0 top-2 flex h-4 w-4 -translate-x-1/2 items-center justify-center">
                <span className={`h-3 w-3 rounded-full border border-slate-400 ${stateStyles[item.state]}`} />
              </span>
              <div className="rounded-2xl border border-border/60 bg-surface/70 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-white">{item.title}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${stateStyles[item.state]}`}>
                    {stateLabel[item.state]}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-200">{item.details}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="learn" aria-labelledby="learn-heading" className="space-y-8">
        <div className="space-y-3">
          <h2 id="learn-heading" className="text-2xl font-semibold tracking-tight">
            {learnMore.title}
          </h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            {learnMore.accordion.map((item) => {
              const isOpen = openAccordionId === item.id;
              return (
                <div key={item.id} className="rounded-2xl border border-border/60 bg-surface/70">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-content`}
                    id={`${item.id}-trigger`}
                    onClick={() => setOpenAccordionId(isOpen ? null : item.id)}
                  >
                    <span className="font-medium">{item.question}</span>
                    <span aria-hidden="true" className="text-lg">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    id={`${item.id}-content`}
                    role="region"
                    aria-labelledby={`${item.id}-trigger`}
                    className={`${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden px-5 pb-4 text-sm text-slate-200 transition-all duration-300 ease-out`}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-4">
            {learnMore.actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="inline-flex items-center justify-center rounded-2xl border border-border/60 bg-surfaceAlt/80 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-white/60 hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default StatusLanding;
