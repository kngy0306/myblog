import ogs from "open-graph-scraper";
import type { OgObject } from "open-graph-scraper/types";

/** Limit rendered links and fetched metadata to web URLs without embedded credentials. */
export function parseWebUrl(value: string, base?: URL): URL | null {
  if (!URL.canParse(value, base)) return null;
  const url = new URL(value, base);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
  return url;
}

export async function getOpenGraphData(url: URL): Promise<OgObject | null> {
  try {
    const { result, error } = await ogs({ url: url.href, timeout: 5 });
    return error ? null : result;
  } catch {
    // An unavailable external site should not prevent the static site from building.
    return null;
  }
}
