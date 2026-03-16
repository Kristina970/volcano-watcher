import { useEffect } from "react";
import { ChevronDown, ChevronUp, MapPin, RefreshCw } from "lucide-react";
import { useVolcanoStore } from "@/store/volcanoStore";
import { mockNews, type Severity } from "@/data/mockNews";
import { volcanoes } from "@/data/volcanoes";

const severityConfig: Record<Severity, { label: string; className: string }> = {
  eruption: { label: "Eruption", className: "bg-severity-eruption text-primary-foreground" },
  elevated: { label: "Elevated", className: "bg-severity-elevated text-primary-foreground" },
  seismic: { label: "Seismic", className: "bg-severity-seismic text-foreground" },
  degassing: { label: "Degassing", className: "bg-severity-degassing text-primary-foreground" },
  unrest: { label: "Unrest", className: "bg-severity-unrest text-primary-foreground" },
};

function relativeTime(isoStr: string) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

const LeftPanel = () => {
  const {
    newsItems, newsLoading, newsError, expandedNewsItem,
    setNewsItems, setNewsError, setExpandedNewsItem,
    setSelectedVolcano, flyTo,
  } = useVolcanoStore();

  const loadNews = () => {
    // Simulate async load with mock data
    useVolcanoStore.getState().setNewsLoading(true);
    setTimeout(() => {
      setNewsItems(mockNews);
    }, 800);
  };

  useEffect(() => { loadNews(); }, []);

  const handleViewOnMap = (volcanoName: string) => {
    const v = volcanoes.find((v) => v.name === volcanoName);
    if (v) {
      flyTo(v.lat, v.lng, 9);
      setTimeout(() => setSelectedVolcano(v), 600);
    }
  };

  const handleCardClick = (volcanoName: string) => {
    const v = volcanoes.find((v) => v.name === volcanoName);
    if (v) {
      flyTo(v.lat, v.lng, 6);
    }
  };

  return (
    <div className="w-80 shrink-0 bg-card border-r border-border flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">Latest Activity</h2>
          {!newsLoading && !newsError && (
            <span className="live-dot inline-block w-2 h-2 rounded-full bg-[hsl(var(--live-dot))]" />
          )}
        </div>
        <button
          onClick={loadNews}
          className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {newsLoading && (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {newsError && (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">Activity reports are currently unavailable. Try again shortly.</p>
            <button
              onClick={loadNews}
              className="text-sm font-medium text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!newsLoading && !newsError && newsItems.map((item) => {
          const isExpanded = expandedNewsItem === item.id;
          const sev = severityConfig[item.severity];

          return (
            <div
              key={item.id}
              className="border-b border-border px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleCardClick(item.volcanoName)}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                    item.severity === "eruption" ? "bg-severity-eruption" :
                    item.severity === "elevated" ? "bg-severity-elevated" :
                    item.severity === "seismic" ? "bg-severity-seismic" :
                    item.severity === "degassing" ? "bg-severity-degassing" :
                    "bg-severity-unrest"
                  }`} />
                  <span className="text-sm font-semibold text-foreground truncate">
                    {item.volcanoName}
                  </span>
                  <span className="text-xs text-muted-foreground">· {item.country}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                {item.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{relativeTime(item.timestamp)}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${sev.className}`}>
                    {sev.label}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedNewsItem(isExpanded ? null : item.id);
                  }}
                  className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isExpanded ? "Collapse" : "Expand"}
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-foreground leading-relaxed mb-2">{item.fullSummary}</p>
                  <p className="text-[11px] text-muted-foreground mb-2">Via {item.source}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewOnMap(item.volcanoName);
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <MapPin className="h-3 w-3" /> View on map →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftPanel;
