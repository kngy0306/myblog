import { describe, expect, mock, test } from "bun:test";

const scrape = mock();
mock.module("open-graph-scraper", () => ({ default: scrape }));
const { getOpenGraphData, parseWebUrl } = await import("./link-card");

describe("link card URL validation", () => {
  test.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "file:///etc/passwd",
    "https://user:secret@example.com/",
    "https://example.com@evil.example/",
    "not a URL",
  ])("rejects %s", (value) => {
    expect(parseWebUrl(value)).toBeNull();
  });

  test("resolves relative metadata images using URL semantics", () => {
    const base = new URL("https://example.com/posts/article");
    expect(parseWebUrl("../image.png", base)?.href).toBe("https://example.com/image.png");
    expect(parseWebUrl("//cdn.example.com/image.png", base)?.href).toBe("https://cdn.example.com/image.png");
    expect(parseWebUrl("javascript:alert(1)", base)).toBeNull();
  });

  test("preserves ordinary HTTP and HTTPS links", () => {
    expect(parseWebUrl("http://example.com")?.href).toBe("http://example.com/");
    expect(parseWebUrl("https://example.com/?a=1&b=2")?.searchParams.get("b")).toBe("2");
  });
});

describe("optional Open Graph metadata", () => {
  const url = new URL("https://example.com/");

  test("uses a bounded request and returns successful metadata", async () => {
    scrape.mockResolvedValueOnce({ error: false, result: { ogTitle: "Example" } });
    expect(await getOpenGraphData(url)).toEqual({ ogTitle: "Example" });
    expect(scrape).toHaveBeenLastCalledWith({ url: url.href, timeout: 5 });
  });

  test("discards metadata returned with an error", async () => {
    scrape.mockResolvedValueOnce({ error: true, result: { ogTitle: "Error page" } });
    expect(await getOpenGraphData(url)).toBeNull();
  });

  test("allows rendering to continue after a timeout or network rejection", async () => {
    scrape.mockRejectedValueOnce(new Error("Request timed out"));
    expect(await getOpenGraphData(url)).toBeNull();
  });
});
