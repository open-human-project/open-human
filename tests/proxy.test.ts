import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

function request(path: string, headers?: HeadersInit) {
  return new NextRequest(`https://openhuman.example${path}`, { headers });
}

describe("locale proxy", () => {
  it("uses English as the root fallback", () => {
    const response = proxy(request("/"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://openhuman.example/en");
  });

  it("recognizes an Indonesian browser preference", () => {
    const response = proxy(
      request("/", { "accept-language": "id-ID,id;q=0.9,en;q=0.8" }),
    );
    expect(response.headers.get("location")).toBe("https://openhuman.example/id");
  });

  it.each([
    ["id;q=0.2,en;q=0.9", "/en"],
    ["en;q=0,id;q=0.4", "/id"],
    ["en;q=0,*;q=0.8", "/id"],
  ])("honors weighted language preferences in %s", (acceptLanguage, expectedPath) => {
    const response = proxy(request("/", { "accept-language": acceptLanguage }));
    expect(response.headers.get("location")).toBe(`https://openhuman.example${expectedPath}`);
  });

  it("gives the saved preference priority over the browser", () => {
    const response = proxy(
      request("/", {
        "accept-language": "id-ID",
        cookie: "open-human-locale=en",
      }),
    );
    expect(response.headers.get("location")).toBe("https://openhuman.example/en");
  });

  it("permanently redirects a legacy URL while preserving its query", () => {
    const response = proxy(request("/concepts/sleep?from=legacy"));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://openhuman.example/en/concepts/sleep?from=legacy",
    );
  });

  it("does not redirect an explicitly localized URL", () => {
    const response = proxy(request("/id/concepts/sleep"));
    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-middleware-request-x-open-human-locale")).toBe("id");
  });
});
