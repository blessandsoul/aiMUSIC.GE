import { getPosts } from "@/features/blog/lib/api";
import { INDEXED_LOCALES } from "@/i18n/seo-locales";
import { PUBLIC_FACTS, PUBLIC_POSITIONING, PUBLIC_PRODUCT_CATALOG } from "@/lib/public-facts";
const BASE_URL = "https://aimusic.ge";
function articleUrl(locale: string, slug: string) { return locale === "ka" ? `${BASE_URL}/blog/${slug}` : `${BASE_URL}/${locale}/blog/${slug}`; }
export async function GET() {
  const authored = await Promise.all(INDEXED_LOCALES.map(async (locale) => ({ locale, posts: await getPosts(locale) })));
  const articles = authored.flatMap(({ locale, posts }) => [`### ${locale.toUpperCase()} authored articles (${posts.length})`, ...posts.map((post) => `- [${post.title}](${articleUrl(locale, post.slug)})`), ""]);
  const product = PUBLIC_PRODUCT_CATALOG[0];
  const lines = [`# ${PUBLIC_FACTS.brand.name} — music profiles and usage records`, "", `> ${PUBLIC_FACTS.description}`, "", "## Product facts", "", `- Product: ${product.name}`, `- Website: ${BASE_URL}`, `- Description: ${product.description}`, `- Price: ${product.startingPrice}`, "", "## Workflow", "", PUBLIC_POSITIONING.statement, ...PUBLIC_POSITIONING.workflow.map((step, i) => `${i + 1}. ${step}`), "", `Catalog: ${BASE_URL}/ai/catalog.json`, `Summary: ${BASE_URL}/ai/summary.json`, `FAQ: ${BASE_URL}/ai/faq.json`, "", "## Authored articles", "", ...articles];
  return new Response(`${lines.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" } });
}
