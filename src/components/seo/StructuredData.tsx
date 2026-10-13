import { getAiNowHomeCopy } from "@/features/home/components/ainow/AiNowHomeCopy";
import { PRODUCT_OG_URL } from "@/lib/product-og";
import { PARENT_ORGANIZATION, PUBLIC_FACTS, PUBLIC_PRODUCT_CATALOG } from "@/lib/public-facts";

const product = PUBLIC_PRODUCT_CATALOG[0];
const parentOrganizationSchema = {
  "@type": "Organization",
  "@id": "https://ainow.ge#organization",
  name: PARENT_ORGANIZATION.name,
  legalName: PARENT_ORGANIZATION.legalName,
  url: PARENT_ORGANIZATION.url,
};
const productNode = {
  "@type": "Product",
  "@id": `${PUBLIC_FACTS.brand.url}#product`,
  name: product.name,
  url: product.url,
  image: PRODUCT_OG_URL,
  description: product.description,
  brand: { "@type": "Brand", name: product.name },
  manufacturer: { "@id": "https://ainow.ge#organization" },
};
const siteNode = {
  "@type": "WebSite",
  "@id": `${PUBLIC_FACTS.brand.url}#website`,
  name: PUBLIC_FACTS.brand.name,
  url: PUBLIC_FACTS.brand.url,
  inLanguage: ["ka-GE", "en-US", "ru-RU"],
  publisher: { "@id": "https://ainow.ge#organization" },
  dateModified: PUBLIC_FACTS.lastUpdated,
};

export async function StructuredData(): Promise<React.ReactElement> {
  const graph = { "@context": "https://schema.org", "@graph": [parentOrganizationSchema, productNode, siteNode] };
  return <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}

export async function HomeFaqSchema({ locale }: { locale: string }) {
  const items = getAiNowHomeCopy(locale).faq.items;
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: Object.values(items).map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
  return <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
