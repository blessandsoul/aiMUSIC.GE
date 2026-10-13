import {
  PUBLIC_FACTS,
  TIKTOK_PRODUCT_ROADMAP,
} from "@/lib/public-facts";

export const revalidate = 86400;

export function GET(): Response {
  return Response.json(
    {
      name: PUBLIC_FACTS.brand.name,
      url: PUBLIC_FACTS.brand.url,
      platform: "TikTok",
      status: "planned",
      availableNow: false,
      launchDate: null,
      limitation:
        "No live TikTok API connection is currently available. Launch depends on TikTok approval, approved scopes, account eligibility and regional availability.",
      products: TIKTOK_PRODUCT_ROADMAP,
      lastUpdated: PUBLIC_FACTS.lastUpdated,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    },
  );
}
