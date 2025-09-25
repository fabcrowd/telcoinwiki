const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>&copy; {new Date().getFullYear()} Telcoin Wiki Community</span>
        <div className="flex flex-wrap gap-3">
          <a href="#privacy" className="hover:text-white">
            Privacy
          </a>
          <a href="#terms" className="hover:text-white">
            Terms
          </a>
          <a href="#contact" className="hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
