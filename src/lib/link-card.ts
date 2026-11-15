import ogs from "open-graph-scraper";
import type { OgObject } from "open-graph-scraper/types";

/** 表示するリンクとメタデータ取得先を、認証情報を含まないHTTP(S) URLに制限する。 */
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
    // 外部サイトに接続できなくても、静的サイトのビルドを継続する。
    return null;
  }
}
