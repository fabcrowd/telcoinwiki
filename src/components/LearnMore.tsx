import { useState, type FC } from 'react';
import { statusData } from '../data/status';

export const LearnMore: FC = () => {
  const { learnMore } = statusData;
  const [expanded, setExpanded] = useState<string | null>(learnMore.faqs[0]?.id ?? null);

  const toggle = (id: string) => {
    setExpanded((current) => (current === id ? null : id));
  };

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/60 dark:shadow-black/10">
      <header className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
          <span className="text-lg">ℹ️</span>
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Learn More</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Frequently asked questions about network phases.</p>
        </div>
      </header>
      <div className="space-y-4">
        {learnMore.faqs.map((faq) => {
          const isOpen = expanded === faq.id;
          return (
            <div key={faq.id} className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 shadow-inner shadow-slate-200/40 dark:border-slate-700/60 dark:bg-slate-950/40">
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900/60"
              >
                <span>{faq.question}</span>
                <span className="text-lg text-slate-400 dark:text-slate-500">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? (
                <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  {faq.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <footer className="mt-8 flex flex-wrap gap-3">
        {learnMore.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-600"
          >
            <span className="text-base">↗</span>
            {link.label}
          </a>
        ))}
      </footer>
    </section>
  );
};

export default LearnMore;

