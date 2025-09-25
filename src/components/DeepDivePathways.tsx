const DeepDivePathways = () => {
  return (
    <section className="mx-auto my-16 max-w-6xl rounded-3xl border border-border/60 bg-surface/80 p-8 shadow-lg" aria-labelledby="deep-dive-heading">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <h2 id="deep-dive-heading" className="text-2xl font-semibold tracking-tight text-white">
            Deep-Dive Pathways
          </h2>
          <p className="text-slate-300">
            Explore curated explainers, governance breakdowns, and technical references across the Telcoin ecosystem.
          </p>
        </div>
        <div className="grid gap-4 text-sm text-slate-200 md:w-80">
          <a className="rounded-xl border border-border/70 bg-surfaceAlt/70 p-4 transition hover:border-white/60" href="#wallets">
            Wallets &amp; Digital Cash
          </a>
          <a className="rounded-xl border border-border/70 bg-surfaceAlt/70 p-4 transition hover:border-white/60" href="#governance">
            Governance &amp; Policy
          </a>
          <a className="rounded-xl border border-border/70 bg-surfaceAlt/70 p-4 transition hover:border-white/60" href="#builders">
            Builders &amp; Integrations
          </a>
        </div>
      </div>
    </section>
  );
};

export default DeepDivePathways;
