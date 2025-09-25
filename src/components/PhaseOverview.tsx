import type { FC } from 'react';
import { statusData, type PhaseEntry, type ProgressState } from '../data/status';

const statusColorMap: Record<ProgressState, string> = {
  'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-200/20 dark:text-amber-300',
  upcoming: 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300',
  complete: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-200/20 dark:text-emerald-300',
};

const statusDotMap: Record<ProgressState, string> = {
  'in-progress': 'bg-amber-500',
  upcoming: 'bg-slate-400',
  complete: 'bg-emerald-500',
};

const PhaseCard: FC<{ phase: PhaseEntry }> = ({ phase }) => {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/80 dark:shadow-black/5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{phase.name}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{phase.headline}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusColorMap[phase.status]}`}>
          <span className={`h-2 w-2 rounded-full ${statusDotMap[phase.status]}`}></span>
          {phase.badgeLabel}
        </span>
      </header>
      <p className="text-sm text-slate-600 dark:text-slate-300">{phase.summary}</p>
      <ul className="mt-auto space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {phase.highlights.map((item) => (
          <li key={item.label} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </article>
  );
};

export const PhaseOverview: FC = () => {
  const { phaseOverview } = statusData;

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/60 dark:shadow-black/10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Live view</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Current Phase Overview</h2>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-slate-500 dark:text-slate-400 md:items-end">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Overall trajectory</span>
          </div>
          <div className="flex w-full max-w-xs items-center gap-3 md:w-60">
            <div className="relative h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${Math.round(phaseOverview.overallTrajectory * 100)}%` }}
              ></span>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {Math.round(phaseOverview.overallTrajectory * 100)}%
            </span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">Last updated {phaseOverview.lastUpdated}</span>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {phaseOverview.phases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>
    </section>
  );
};

export default PhaseOverview;

