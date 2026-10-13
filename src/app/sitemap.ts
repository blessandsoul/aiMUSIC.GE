import type { MetadataRoute } from "next";
import { getPosts, getAvailableLocales } from "@/features/blog/lib/api";
import { INDEXED_LOCALES, getPageLocales } from "@/i18n/seo-locales";
import { APP_DOMAIN, SITE_CONTENT_UPDATED } from "@/lib/constants/app.constants";

const BASE_URL = `https://${APP_DOMAIN}`;
const BUILD_DATE = new Date(SITE_CONTENT_UPDATED);
const OWNER_REFERENCE_PAGE_PATHS = new Set<string>(["/about"]);

const STATIC_PAGES = ["", "/blog", "/about", "/contact", "/privacy", "/terms"] as const;
function localeUrl(locale: string, path: string) { return locale === "ka" ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`; }
function languages(path: string, locales: readonly string[]) { return Object.fromEntries([...locales.map((locale) => [locale, localeUrl(locale, path)]), ["x-default", localeUrl("ka", path)]]); }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = STATIC_PAGES.filter((path) => !OWNER_REFERENCE_PAGE_PATHS.has(path)).flatMap((path) => getPageLocales(path).map((locale) => ({ url: localeUrl(locale, path), lastModified: BUILD_DATE, changeFrequency: path === "/blog" ? "daily" as const : "monthly" as const, priority: path === "" ? 1 : 0.7, alternates: { languages: languages(path, getPageLocales(path)) } })));
  const postsByLocale = new Map(await Promise.all(INDEXED_LOCALES.map(async (locale) => [locale, await getPosts(locale)] as const)));
  const slugs = [...new Set([...postsByLocale.values()].flatMap((posts) => posts.map((post) => post.slug)))];
  const blogPages = slugs.flatMap((slug) => { const locales = getAvailableLocales(slug); return locales.map((locale) => { const post = postsByLocale.get(locale as typeof INDEXED_LOCALES[number])?.find((item) => item.slug === slug); return { url: localeUrl(locale, `/blog/${slug}`), lastModified: post?.updated ? new Date(post.updated) : post?.date ? new Date(post.date) : BUILD_DATE, changeFrequency: "monthly" as const, priority: 0.8, alternates: { languages: languages(`/blog/${slug}`, locales) } }; }); });
  return [...staticPages, ...blogPages];
}
