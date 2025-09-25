import type { FC } from 'react';
import { statusData } from '../data/status';

const severityAccent: Record<string, string> = {
  High: 'text-rose-500',
  Medium: 'text-amber-500',
  Low: 'text-emerald-500',
  Info: 'text-sky-500',
};

export const SecurityAudits: FC = () => {
  const { securityAudits } = statusData;

  return (
    <section className="grid gap-8 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/60 dark:shadow-black/10 md:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
      <div className="space-y-6">
        <header>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Security &amp; Audits</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Live audit coverage and remediation progress.</p>
        </header>
        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          {securityAudits.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
      <aside className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-inner shadow-slate-200/40 dark:border-slate-700/60 dark:bg-slate-900/60">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{securityAudits.summary.label}</span>
          <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{securityAudits.summary.value}</div>
          {securityAudits.summary.helperText ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">{securityAudits.summary.helperText}</p>
          ) : null}
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-700/50">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Public-facing</th>
                <th className="px-4 py-3 font-medium">After fixes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {securityAudits.findings.map((row) => (
                <tr key={row.severity} className="bg-white/60 text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">
                  <td className="px-4 py-3 font-medium">
                    <span className={severityAccent[row.severity] ?? 'text-slate-500'}>{row.severity}</span>
                  </td>
                  <td className="px-4 py-3">{row.publicFacing}</td>
                  <td className="px-4 py-3">{row.afterFixes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600 shadow-inner dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-300">
          <div className="font-medium text-slate-900 dark:text-slate-100">{securityAudits.afterFixesSummary.label}</div>
          <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{securityAudits.afterFixesSummary.value}</div>
          {securityAudits.afterFixesSummary.helperText ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{securityAudits.afterFixesSummary.helperText}</p>
          ) : null}
        </div>
      </aside>
    </section>
  );
};

export default SecurityAudits;

