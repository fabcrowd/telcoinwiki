import type { FC } from 'react';
import { LearnMore, PhaseOverview, RoadToMainnet, SecurityAudits } from './components';

export const App: FC = () => {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col gap-2 text-slate-600 dark:text-slate-300">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Telcoin Network Status</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Live view of Devnet, Testnet, and Mainnet progress</h1>
      </header>
      <PhaseOverview />
      <SecurityAudits />
      <RoadToMainnet />
      <LearnMore />
    </div>
  );
};

export default App;

