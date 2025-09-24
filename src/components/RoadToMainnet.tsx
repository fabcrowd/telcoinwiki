import type { FC } from 'react';
import { statusData, type RoadmapMilestone } from '../data/status';

const statusText: Record<RoadmapMilestone['status'], string> = {
  'in-progress': 'text-amber-500',
  upcoming: 'text-slate-400',
  complete: 'text-emerald-500',
  planned: 'text-slate-400',
};

const statusLabel: Record<RoadmapMilestone['status'], string> = {
  'in-progress': 'In progress',
  upcoming: 'Upcoming',
  planned: 'Planned',
  complete: 'Complete',
};

const indicatorBg: Record<RoadmapMilestone['status'], string> = {
  'in-progress': 'bg-amber-400',
  upcoming: 'bg-slate-300',
  planned: 'bg-slate-300',
  complete: 'bg-emerald-500',
};

export const RoadToMainnet: FC = () => {
  const { roadmap } = statusData;

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/60 dark:shadow-black/10">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Road to Mainnet</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track the key milestones that close out the Mainnet launch checklist.
        </p>
      </header>
      <ol className="relative space-y-6">
        <span className="absolute left-4 top-0 hidden h-full w-px bg-slate-200 dark:bg-slate-800 md:block" aria-hidden="true"></span>
        {roadmap.milestones.map((milestone) => (
          <li key={milestone.id} className="relative flex flex-col gap-2 rounded-2xl border border-transparent bg-white/60 p-4 transition hover:border-slate-200 dark:bg-slate-950/30 dark:hover:border-slate-700 md:ml-6 md:p-5">
            <span
              className={`absolute left-0 top-5 hidden h-3 w-3 -translate-x-1/2 rounded-full ${indicatorBg[milestone.status]} md:block`}
              aria-hidden="true"
            ></span>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{milestone.title}</h3>
              <span className={`text-xs font-medium uppercase tracking-wide ${statusText[milestone.status]}`}>
                {statusLabel[milestone.status]}
              </span>
            </div>
            {milestone.description ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">{milestone.description}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default RoadToMainnet;

