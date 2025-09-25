const Header = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="text-lg font-semibold tracking-tight">Telcoin Network</div>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <a href="#status" className="transition hover:text-white">
            Status
          </a>
          <a href="#roadmap" className="transition hover:text-white">
            Roadmap
          </a>
          <a href="#learn" className="transition hover:text-white">
            Learn
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
