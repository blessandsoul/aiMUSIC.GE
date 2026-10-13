import { getPosts, getPostBySlug } from "@/features/blog/lib/api";
import { INDEXED_LOCALES } from "@/i18n/seo-locales";
import { PUBLIC_FACTS, PUBLIC_POSITIONING, PUBLIC_PRODUCT_CATALOG } from "@/lib/public-facts";
const BASE_URL = "https://aimusic.ge";
function articleUrl(locale: string, slug: string) { return locale === "ka" ? `${BASE_URL}/blog/${slug}` : `${BASE_URL}/${locale}/blog/${slug}`; }
function plain(content: string) { return content.replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim(); }
export async function GET() {
  const articles: string[] = [];
  for (const locale of INDEXED_LOCALES) { const posts = await getPosts(locale); articles.push(`## ${locale.toUpperCase()} authored articles (${posts.length})`, ""); for (const post of posts) { const full = await getPostBySlug(post.slug, locale); if (!full?.content) continue; articles.push(`### ${full.title}`, "", `Language: ${locale}`, `URL: ${articleUrl(locale, full.slug)}`, `Published: ${full.date}`, `Author: ${full.author.name}`, "", plain(full.content), "", "---", ""); } }
  const product = PUBLIC_PRODUCT_CATALOG[0];
  const lines = [`# ${PUBLIC_FACTS.brand.name} — full authored content`, "", `> ${PUBLIC_FACTS.description}`, "", `Product: ${product.name}`, `URL: ${BASE_URL}`, `Description: ${product.description}`, `Price: ${product.startingPrice}`, "", "## Workflow", "", PUBLIC_POSITIONING.statement, ...PUBLIC_POSITIONING.workflow.map((step, i) => `${i + 1}. ${step}`), "", `Catalog: ${BASE_URL}/ai/catalog.json`, `FAQ: ${BASE_URL}/ai/faq.json`, "", ...articles];
  return new Response(`${lines.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600" } });
}
