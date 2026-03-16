import SearchBar from "./SearchBar";

const VolcanoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 20H20L12 2Z" fill="hsl(5 76% 55%)" stroke="hsl(5 76% 45%)" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 14C9.5 12 10.5 11 12 10C13.5 11 14.5 12 15 14" stroke="hsl(36 90% 55%)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

const TopBar = () => {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-card shadow-topbar z-40 relative shrink-0">
      <div className="flex items-center gap-2.5">
        <VolcanoIcon />
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Volcano Explorer
        </h1>
      </div>

      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 10,10 0,10" fill="hsl(5 76% 55%)" />
          </svg>
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 10,10 0,10" fill="hsl(60 2% 24%)" />
          </svg>
          <span>Dormant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 10,10 0,10" fill="hsl(50 3% 53%)" />
          </svg>
          <span>Extinct</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
