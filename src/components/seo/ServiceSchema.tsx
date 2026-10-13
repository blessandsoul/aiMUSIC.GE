type ServiceSchemaProps = {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  provider?: {
    name: string;
    url: string;
    logo: string;
  };
  offers?: Array<{
    name: string;
    price: string;
    priceCurrency?: string;
    unitText?: string;
  }>;
};

export function ServiceSchema({
  name,
  description,
  url,
  serviceType,
  provider,
  offers,
}: ServiceSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    serviceType,
    provider: {
      "@type": "Organization",
      name: provider?.name ?? "aiMUSIC",
      url: provider?.url ?? "https://aimusic.ge",
      logo: provider?.logo ?? "https://aimusic.ge/logo.png",
    },
    areaServed: [
      { "@type": "Country", name: "Georgia" },
    ],
    availableLanguage: ["ka", "en", "ru"],
  };

  if (offers && offers.length > 0) {
    schema.offers = offers.map((o) => ({
      "@type": "Offer",
      name: o.name,
      price: o.price,
      priceCurrency: o.priceCurrency ?? "GEL",
      ...(o.unitText ? { eligibleQuantity: { "@type": "QuantitativeValue", unitText: o.unitText } } : {}),
      availability: "https://schema.org/InStock",
      url,
    }));
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
