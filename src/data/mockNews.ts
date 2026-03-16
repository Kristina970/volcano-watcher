export type Severity = "eruption" | "elevated" | "seismic" | "degassing" | "unrest";

export interface NewsItem {
  id: string;
  volcanoName: string;
  country: string;
  summary: string;
  fullSummary: string;
  timestamp: string;
  severity: Severity;
  source: string;
}

const now = Date.now();
const hour = 3600000;
const day = 86400000;

export const mockNews: NewsItem[] = [
  {
    id: "n1",
    volcanoName: "Kilauea",
    country: "USA",
    summary: "Lava flow activity observed at the summit vent with incandescence visible overnight…",
    fullSummary: "Lava flow activity continues at Kilauea's summit, with the lava lake within Halema'uma'u crater showing elevated surface levels. Incandescence is visible overnight from nearby vantage points. SO₂ emission rates remain elevated at approximately 3,000 tonnes per day. No threat to populated areas at this time.",
    timestamp: new Date(now - 2 * hour).toISOString(),
    severity: "eruption",
    source: "USGS Hawaiian Volcano Observatory",
  },
  {
    id: "n2",
    volcanoName: "Etna",
    country: "Italy",
    summary: "Strombolian explosions from the Southeast Crater producing ash emissions to 4.5 km…",
    fullSummary: "Mount Etna's Southeast Crater has produced intermittent Strombolian explosions over the past 48 hours. Ash emissions have reached altitudes of 4.5 km above sea level. Lava fountaining episodes lasting 15–30 minutes have been observed. Catania airport briefly suspended operations during peak activity. INGV maintains the alert level at Orange.",
    timestamp: new Date(now - 5 * hour).toISOString(),
    severity: "eruption",
    source: "INGV Catania",
  },
  {
    id: "n3",
    volcanoName: "Popocatépetl",
    country: "Mexico",
    summary: "Continuous exhalations with moderate ash content detected. Alert level remains at Yellow Phase 2…",
    fullSummary: "Popocatépetl continues to produce exhalations with low to moderate ash content, reaching up to 1 km above the crater. CENAPRED reports 86 exhalations in the last 24 hours and 4 volcano-tectonic earthquakes. The exclusion zone of 12 km remains in effect. Alert level stays at Amarillo Fase 2.",
    timestamp: new Date(now - 8 * hour).toISOString(),
    severity: "elevated",
    source: "CENAPRED",
  },
  {
    id: "n4",
    volcanoName: "Merapi",
    country: "Indonesia",
    summary: "Pyroclastic flows descended the southwest flank reaching 3 km from the summit dome…",
    fullSummary: "Mount Merapi's lava dome continues to grow, with pyroclastic flows traveling up to 3 km down the southwest flank. BPPTKG reports an estimated dome volume of 2.8 million cubic meters. Incandescent avalanches visible at night. The exclusion zone has been maintained at 7 km on the south-southwest sector. Communities are advised to remain vigilant for potential lahars during heavy rainfall.",
    timestamp: new Date(now - 12 * hour).toISOString(),
    severity: "eruption",
    source: "BPPTKG Indonesia",
  },
  {
    id: "n5",
    volcanoName: "Sakurajima",
    country: "Japan",
    summary: "Explosive eruption sent an ash plume to 3,200 m above the Minamidake crater…",
    fullSummary: "An explosive eruption at Sakurajima's Minamidake crater produced an ash plume reaching 3,200 m above the crater rim. Large volcanic bombs were ejected up to 1,300 m from the vent. This marks the 47th explosive event this month. JMA maintains Alert Level 3 (restricted entry to the volcano).",
    timestamp: new Date(now - 1 * day).toISOString(),
    severity: "eruption",
    source: "JMA Japan",
  },
  {
    id: "n6",
    volcanoName: "Klyuchevskoy",
    country: "Russia",
    summary: "Thermal anomaly detected via satellite. Strombolian activity continues at the summit…",
    fullSummary: "KVERT reports ongoing Strombolian activity at Klyuchevskoy with a strong thermal anomaly detected by Sentinel-2 satellite imagery. Ash plumes have extended approximately 150 km to the southeast. The Aviation Color Code remains at Orange. Explosive activity may intensify without warning.",
    timestamp: new Date(now - 1.5 * day).toISOString(),
    severity: "elevated",
    source: "KVERT Russia",
  },
  {
    id: "n7",
    volcanoName: "Villarrica",
    country: "Chile",
    summary: "Lava lake level has risen. Increased Strombolian spattering observed at the crater…",
    fullSummary: "SERNAGEOMIN reports an increase in the lava lake level within Villarrica's crater. Strombolian spattering events have become more frequent, with some ejecta landing on the upper flanks. Seismic tremor amplitude has also increased. The technical alert remains at Yellow.",
    timestamp: new Date(now - 2 * day).toISOString(),
    severity: "elevated",
    source: "SERNAGEOMIN Chile",
  },
  {
    id: "n8",
    volcanoName: "Stromboli",
    country: "Italy",
    summary: "Typical Strombolian explosions from multiple vents. Minor lava overflow on the Sciara del Fuoco…",
    fullSummary: "Stromboli continues its characteristic activity with explosions from three active vents in the crater terrace. A minor lava overflow reached the upper portion of the Sciara del Fuoco. INGV reports an average of 12 explosions per hour with material ejected to 150–200 m above the vents. Alert level remains at Yellow.",
    timestamp: new Date(now - 2.5 * day).toISOString(),
    severity: "eruption",
    source: "INGV Italy",
  },
  {
    id: "n9",
    volcanoName: "Nevado del Ruiz",
    country: "Colombia",
    summary: "Seismic swarm detected beneath the volcano. 340 earthquakes recorded in 24 hours…",
    fullSummary: "The Colombian Geological Survey (SGC) reports a seismic swarm beneath Nevado del Ruiz, with 340 volcano-tectonic earthquakes recorded in the last 24 hours. The largest event was magnitude 2.8 at a depth of 3.4 km. SO₂ emissions have also increased. The alert level remains at Yellow (Level III).",
    timestamp: new Date(now - 3 * day).toISOString(),
    severity: "seismic",
    source: "SGC Colombia",
  },
  {
    id: "n10",
    volcanoName: "Taal",
    country: "Philippines",
    summary: "Elevated SO₂ emissions measured at 8,900 tonnes/day. Volcanic smog affecting nearby towns…",
    fullSummary: "PHIVOLCS reports elevated sulfur dioxide emissions from Taal Volcano at approximately 8,900 tonnes per day, causing volcanic smog (vog) in nearby municipalities around Taal Lake. Upwelling activity continues in the Main Crater Lake with temperatures reaching 77°C. Alert Level 1 remains in effect.",
    timestamp: new Date(now - 3.5 * day).toISOString(),
    severity: "degassing",
    source: "PHIVOLCS Philippines",
  },
  {
    id: "n11",
    volcanoName: "Nyiragongo",
    country: "DR Congo",
    summary: "Thermal signatures indicate lava lake regeneration within the summit crater…",
    fullSummary: "Satellite-based thermal monitoring indicates a growing thermal anomaly within Nyiragongo's summit crater, suggesting the lava lake may be regenerating after the 2021 drainage event. Ground-based observations confirm incandescence visible at night. The Goma Volcano Observatory continues close monitoring given the proximity of Goma city.",
    timestamp: new Date(now - 4 * day).toISOString(),
    severity: "unrest",
    source: "Goma Volcano Observatory",
  },
  {
    id: "n12",
    volcanoName: "Semeru",
    country: "Indonesia",
    summary: "Continuous ash emissions from the summit. Pyroclastic density currents travel 4 km downstream…",
    fullSummary: "PVMBG reports continuous ash emissions from Semeru's summit crater, with columns reaching 600 m above the peak. Pyroclastic density currents have traveled up to 4 km down the Besuk Kobokan drainage. Communities along river channels have been advised to remain alert for lahars. Alert Level IV (Awas) is in effect.",
    timestamp: new Date(now - 4.5 * day).toISOString(),
    severity: "eruption",
    source: "PVMBG Indonesia",
  },
  {
    id: "n13",
    volcanoName: "Erta Ale",
    country: "Ethiopia",
    summary: "Lava lake remains active in the summit pit crater. New overflow observed on the south rim…",
    fullSummary: "Reports from field observers confirm that Erta Ale's lava lake remains vigorously active with frequent spattering. A new overflow event has sent lava over the south rim of the pit crater. The lava lake level appears elevated compared to previous months. Access remains difficult due to the remote location in the Danakil Depression.",
    timestamp: new Date(now - 5 * day).toISOString(),
    severity: "eruption",
    source: "Addis Ababa University",
  },
  {
    id: "n14",
    volcanoName: "Cotopaxi",
    country: "Ecuador",
    summary: "Intermittent ash and gas emissions. Internal tremor elevated above baseline levels…",
    fullSummary: "The Instituto Geofísico reports intermittent ash and gas emissions from Cotopaxi's summit crater. Internal volcanic tremor has been elevated above baseline levels for the past week. Ash fall has been reported in communities to the west. The alert level remains at Yellow. Climbing access to the summit is restricted.",
    timestamp: new Date(now - 6 * day).toISOString(),
    severity: "elevated",
    source: "IG-EPN Ecuador",
  },
  {
    id: "n15",
    volcanoName: "Erebus",
    country: "Antarctica",
    summary: "Persistent lava lake activity continues. Minor Strombolian bursts detected seismically…",
    fullSummary: "The Mount Erebus Volcano Observatory reports continued activity at the persistent lava lake. Seismic instruments have detected minor Strombolian burst events averaging 6 per day. The lava lake remains at a stable level. No impact on McMurdo Station or Scott Base operations.",
    timestamp: new Date(now - 7 * day).toISOString(),
    severity: "degassing",
    source: "MEVO / NM Tech",
  },
];
