import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { volcanoes, type Volcano } from "@/data/volcanoes";
import { useVolcanoStore } from "@/store/volcanoStore";

const RECENT_ERUPTION_YEARS = 5;

function isRecentlyErupted(v: Volcano): boolean {
  const currentYear = new Date().getFullYear();
  return v.status === "active" && v.last_eruption_year != null && (currentYear - v.last_eruption_year) <= RECENT_ERUPTION_YEARS;
}

function createTriangleIcon(status: Volcano["status"], hover = false, recentlyErupted = false) {
  const colors = {
    active: { fill: "#E8453C", stroke: "#C33A32" },
    dormant: { fill: "#3D3D3A", stroke: "#2A2A28" },
    extinct: { fill: "#888780", stroke: "#6E6E68" },
  };

  const sizes = {
    active: hover ? 18 : 14,
    dormant: hover ? 16 : 12,
    extinct: hover ? 14 : 10,
  };

  const size = sizes[status];
  const { fill, stroke } = colors[status];
  const outer = recentlyErupted ? size + 16 : size;
  const offset = recentlyErupted ? 8 : 0;

  const glowRing = recentlyErupted
    ? `<circle cx="${outer / 2}" cy="${outer / 2}" r="${outer / 2 - 2}" fill="none" stroke="${fill}" stroke-width="2" class="eruption-pulse-ring" opacity="0.6"/>
       <circle cx="${outer / 2}" cy="${outer / 2}" r="${outer / 2 - 5}" fill="${fill}" fill-opacity="0.12"/>`
    : "";

  const svg = `<svg width="${outer}" height="${outer}" viewBox="0 0 ${outer} ${outer}" xmlns="http://www.w3.org/2000/svg">
    ${glowRing}
    <polygon points="${outer / 2},${offset} ${outer / 2 + size / 2},${offset + size} ${outer / 2 - size / 2},${offset + size}" fill="${fill}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: `volcano-marker${recentlyErupted ? " erupting" : ""}`,
    iconSize: [outer, outer],
    iconAnchor: [outer / 2, offset + size],
    tooltipAnchor: [0, -(offset + size)],
  });
}

const MapCanvas = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { setSelectedVolcano, flyToTarget, clearFlyTo } = useVolcanoStore();

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
    });

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    volcanoes.forEach((v) => {
      const marker = L.marker([v.lat, v.lng], {
        icon: createTriangleIcon(v.status),
      }).addTo(map);

      marker.bindTooltip(
        `${v.name} · ${v.region}, ${v.country}${
          v.last_eruption_year ? `<br/>Last eruption: ${v.last_eruption_year}` : ""
        }`,
        {
          direction: "top",
          className: "volcano-tooltip",
          offset: [0, -4],
        }
      );

      marker.on("click", () => setSelectedVolcano(v));
      marker.on("mouseover", () => marker.setIcon(createTriangleIcon(v.status, true)));
      marker.on("mouseout", () => marker.setIcon(createTriangleIcon(v.status)));
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [setSelectedVolcano]);

  useEffect(() => {
    if (!flyToTarget || !mapRef.current) return;

    mapRef.current.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom, {
      duration: 1.2,
    });

    clearFlyTo();
  }, [flyToTarget, clearFlyTo]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};

export default MapCanvas;
