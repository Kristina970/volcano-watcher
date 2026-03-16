import { create } from "zustand";
import type { Volcano } from "@/data/volcanoes";
import type { NewsItem } from "@/data/mockNews";

interface VolcanoState {
  selectedVolcano: Volcano | null;
  mapCenter: [number, number];
  mapZoom: number;
  searchQuery: string;
  searchDropdownOpen: boolean;
  expandedNewsItem: string | null;
  newsItems: NewsItem[];
  newsLoading: boolean;
  newsError: boolean;
  flyToTarget: { lat: number; lng: number; zoom: number } | null;

  setSelectedVolcano: (v: Volcano | null) => void;
  setMapCenter: (c: [number, number]) => void;
  setMapZoom: (z: number) => void;
  setSearchQuery: (q: string) => void;
  setSearchDropdownOpen: (o: boolean) => void;
  setExpandedNewsItem: (id: string | null) => void;
  setNewsItems: (items: NewsItem[]) => void;
  setNewsLoading: (l: boolean) => void;
  setNewsError: (e: boolean) => void;
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  clearFlyTo: () => void;
}

export const useVolcanoStore = create<VolcanoState>((set) => ({
  selectedVolcano: null,
  mapCenter: [20, 0],
  mapZoom: 2,
  searchQuery: "",
  searchDropdownOpen: false,
  expandedNewsItem: null,
  newsItems: [],
  newsLoading: true,
  newsError: false,
  flyToTarget: null,

  setSelectedVolcano: (v) => set({ selectedVolcano: v }),
  setMapCenter: (c) => set({ mapCenter: c }),
  setMapZoom: (z) => set({ mapZoom: z }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSearchDropdownOpen: (o) => set({ searchDropdownOpen: o }),
  setExpandedNewsItem: (id) => set({ expandedNewsItem: id }),
  setNewsItems: (items) => set({ newsItems: items, newsLoading: false, newsError: false }),
  setNewsLoading: (l) => set({ newsLoading: l }),
  setNewsError: (e) => set({ newsError: e, newsLoading: false }),
  flyTo: (lat, lng, zoom = 9) => set({ flyToTarget: { lat, lng, zoom } }),
  clearFlyTo: () => set({ flyToTarget: null }),
}));
