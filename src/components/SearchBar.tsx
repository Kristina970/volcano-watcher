import { useRef, useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { volcanoes, type Volcano } from "@/data/volcanoes";
import { useVolcanoStore } from "@/store/volcanoStore";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setSelectedVolcano, flyTo } = useVolcanoStore();

  const sorted = [...volcanoes].sort((a, b) => a.name.localeCompare(b.name));

  const filtered = query.trim()
    ? sorted.filter((v) =>
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : sorted.slice(0, 10);

  const selectVolcano = useCallback((v: Volcano) => {
    setQuery("");
    setIsOpen(false);
    flyTo(v.lat, v.lng, 9);
    setTimeout(() => setSelectedVolcano(v), 600);
  }, [flyTo, setSelectedVolcano]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0 && filtered[highlightIndex]) {
      selectVolcano(filtered[highlightIndex]);
    } else if (e.key === "Escape") {
      setQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [query]);

  return (
    <div className="relative">
      <div className={`relative flex items-center transition-all duration-200 ${isOpen ? "w-[480px]" : "w-[360px]"}`}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search volcanoes…"
          className="w-full h-9 pl-9 pr-8 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:bg-card focus:ring-1 focus:ring-ring transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-2 p-1 rounded hover:bg-secondary"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 w-full bg-card rounded-lg shadow-panel border border-border overflow-hidden z-50 max-h-[360px] overflow-y-auto custom-scrollbar"
        >
          {filtered.map((v, i) => (
            <button
              key={v.id}
              onClick={() => selectVolcano(v)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                i === highlightIndex ? "bg-secondary" : "hover:bg-muted"
              }`}
            >
              <span className="font-medium text-foreground">{v.name}</span>
              <span className="text-muted-foreground text-xs">
                {v.region}, {v.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
