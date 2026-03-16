import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { volcanoes, type Volcano } from "@/data/volcanoes";
import { useVolcanoStore } from "@/store/volcanoStore";

// Triangle marker icons
function createTriangleIcon(status: Volcano["status"], hover = false) {
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

  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <polygon points="${size / 2},0 ${size},${size} 0,${size}" fill="${fill}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "volcano-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    tooltipAnchor: [0, -size],
  });
}

// Map controller for fly-to
function MapController() {
  const map = useMap();
  const { flyToTarget, clearFlyTo } = useVolcanoStore();

  useEffect(() => {
    if (flyToTarget) {
      map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom, {
        duration: 1.2,
      });
      clearFlyTo();
    }
  }, [flyToTarget, map, clearFlyTo]);

  return null;
}

const MapCanvas = () => {
  const { setSelectedVolcano } = useVolcanoStore();
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  return (
    <div className="flex-1 relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        zoomControl={true}
        style={{ width: "100%", height: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController />

        {volcanoes.map((v) => (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={createTriangleIcon(v.status)}
            ref={(ref) => {
              if (ref) markerRefs.current.set(v.id, ref);
            }}
            eventHandlers={{
              click: () => setSelectedVolcano(v),
              mouseover: (e) => {
                const marker = e.target as L.Marker;
                marker.setIcon(createTriangleIcon(v.status, true));
              },
              mouseout: (e) => {
                const marker = e.target as L.Marker;
                marker.setIcon(createTriangleIcon(v.status));
              },
            }}
          >
            <Tooltip className="volcano-tooltip" direction="top" offset={[0, 0]}>
              <span>{v.name} · {v.region}, {v.country}</span>
              {v.last_eruption_year && (
                <span className="block text-[10px] opacity-80">Last eruption: {v.last_eruption_year}</span>
              )}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapCanvas;
