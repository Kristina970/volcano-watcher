import { useEffect, useCallback } from "react";
import { X, ExternalLink, Skull, Users, Home, DollarSign, Mountain, Wind, Flame, AlertTriangle } from "lucide-react";
import { useVolcanoStore } from "@/store/volcanoStore";
import type { LastEruptionDetail } from "@/data/volcanoes";

const statusBadge: Record<string, string> = {
  active: "bg-volcano-active text-primary-foreground",
  dormant: "bg-volcano-dormant text-primary-foreground",
  extinct: "bg-volcano-extinct text-primary-foreground",
};

function VEIBar({ vei, maxVei = 8 }: { vei: number; maxVei?: number }) {
  const pct = Math.max(((vei + 1) / (maxVei + 1)) * 100, 8);
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden" style={{ width: "80px" }}>
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function OutcomeStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function LastEruptionSection({ detail }: { detail: LastEruptionDetail }) {
  const o = detail.outcomes;
  const hasStats = o.deaths != null || o.injuries != null || o.evacuated != null || o.homes_destroyed != null || o.damages_usd != null || o.area_affected_km2 != null || o.ash_column_km != null || o.lava_flow_km != null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Last Eruption Details</h3>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-muted-foreground text-xs block">Date</span>
          <span className="font-medium text-foreground">{detail.date}</span>
        </div>
        {detail.duration && (
          <div>
            <span className="text-muted-foreground text-xs block">Duration</span>
            <span className="font-medium text-foreground">{detail.duration}</span>
          </div>
        )}
      </div>

      {hasStats && (
        <div className="bg-muted/50 rounded-lg p-3 space-y-1.5 mb-3">
          {o.deaths != null && <OutcomeStat icon={Skull} label="Deaths" value={o.deaths.toLocaleString()} />}
          {o.injuries != null && <OutcomeStat icon={AlertTriangle} label="Injuries" value={o.injuries.toLocaleString()} />}
          {o.evacuated != null && <OutcomeStat icon={Users} label="Evacuated" value={o.evacuated.toLocaleString()} />}
          {o.homes_destroyed != null && <OutcomeStat icon={Home} label="Homes destroyed" value={o.homes_destroyed.toLocaleString()} />}
          {o.damages_usd != null && <OutcomeStat icon={DollarSign} label="Damages" value={o.damages_usd} />}
          {o.area_affected_km2 != null && <OutcomeStat icon={Mountain} label="Area affected" value={`${o.area_affected_km2.toLocaleString()} km²`} />}
          {o.ash_column_km != null && <OutcomeStat icon={Wind} label="Ash column" value={`${o.ash_column_km} km`} />}
          {o.lava_flow_km != null && <OutcomeStat icon={Flame} label="Lava flow" value={`${o.lava_flow_km} km`} />}
        </div>
      )}

      {o.additional.length > 0 && (
        <ul className="space-y-1">
          {o.additional.map((note, i) => (
            <li key={i} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
              <span className="text-accent shrink-0 mt-0.5">›</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const DetailPanel = () => {
  const { selectedVolcano, setSelectedVolcano } = useVolcanoStore();

  const close = useCallback(() => setSelectedVolcano(null), [setSelectedVolcano]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  if (!selectedVolcano) return null;

  const v = selectedVolcano;
  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(v.name.replace(/ /g, "_"))}`;
  const gvpUrl = `https://volcano.si.edu/volcano.cfm?vn=${v.gvp_number}`;

  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 z-10" onClick={close} />

      {/* Panel */}
      <div className="absolute top-4 right-4 z-20 w-[400px] max-h-[calc(100%-32px)] bg-card rounded-xl shadow-panel border border-border overflow-hidden animate-slide-in flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground truncate">{v.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{v.region}, {v.country}</p>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusBadge[v.status]}`}>
                {v.status}
              </span>
              <button onClick={close} className="p-1 rounded-md hover:bg-muted transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-5">
          {/* Data fields */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground text-xs block">Elevation</span>
              <span className="font-medium text-foreground">{v.elevation_m.toLocaleString()} m ({Math.round(v.elevation_m * 3.281).toLocaleString()} ft)</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block">Type</span>
              <span className="font-medium text-foreground">{v.type}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block">Last Eruption</span>
              <span className="font-medium text-foreground">{v.last_eruption?.date ?? v.last_eruption_year ?? "Unknown"}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block">GVP Number</span>
              <span className="font-medium text-foreground">{v.gvp_number}</span>
            </div>
          </div>

          {/* Last Eruption Details */}
          {v.last_eruption && <LastEruptionSection detail={v.last_eruption} />}

          {/* History */}
          {v.history_text && (
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Eruption History</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.history_text}</p>

              {v.eruption_history.length > 0 && (
                <div className="mt-3 space-y-2">
                  {v.eruption_history.slice(0, 5).map((e, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="w-10 text-right font-mono text-foreground font-medium">{e.year}</span>
                      <VEIBar vei={e.vei} />
                      <span className="text-muted-foreground">VEI {e.vei}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Facts */}
          {v.facts.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Did you know?</h3>
              <ul className="space-y-1.5">
                {v.facts.map((fact, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-accent shrink-0 mt-0.5">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex gap-4">
          <a
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View on Wikipedia <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={gvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View on GVP <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </>
  );
};

export default DetailPanel;
