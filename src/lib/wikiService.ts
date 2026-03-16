export interface WikiData {
  extract: string | null;
  imageUrl: string | null;
  articleUrl: string | null;
  fetchedAt: number;
}

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const CACHE_PREFIX = "wiki_volcano_";

function truncateToSentences(text: string, count = 3): string {
  const sentences = text.match(/[^.!?]*[.!?]+/g);
  if (!sentences) return text;
  return sentences.slice(0, count).join("").trim();
}

function getCached(volcanoName: string): WikiData | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + volcanoName);
    if (!raw) return null;
    const data: WikiData = JSON.parse(raw);
    if (Date.now() - data.fetchedAt > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(volcanoName: string, data: WikiData) {
  try {
    localStorage.setItem(CACHE_PREFIX + volcanoName, JSON.stringify(data));
  } catch {
    // storage full — ignore
  }
}

async function fetchWikiSummary(name: string): Promise<WikiData | null> {
  const encoded = encodeURIComponent(name.replace(/ /g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.type === "disambiguation") return null;
    return {
      extract: json.extract ? truncateToSentences(json.extract, 3) : null,
      imageUrl: json.thumbnail?.source ?? null,
      articleUrl: json.content_urls?.desktop?.page ?? null,
      fetchedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

export async function getWikiData(volcanoName: string): Promise<WikiData | null> {
  const cached = getCached(volcanoName);
  if (cached) return cached;

  // Try exact name
  let data = await fetchWikiSummary(volcanoName);

  // Try with " volcano" suffix
  if (!data) {
    data = await fetchWikiSummary(`${volcanoName} volcano`);
  }

  // Try with "Mount " prefix
  if (!data && !volcanoName.startsWith("Mount ") && !volcanoName.startsWith("Mt.")) {
    data = await fetchWikiSummary(`Mount ${volcanoName}`);
  }

  if (data) {
    setCache(volcanoName, data);
    return data;
  }

  // Cache the miss too to avoid repeated failed fetches
  const miss: WikiData = { extract: null, imageUrl: null, articleUrl: null, fetchedAt: Date.now() };
  setCache(volcanoName, miss);
  return null;
}
