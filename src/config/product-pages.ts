import type { IntegrationStatus, PageStatus, ProductPagesConfig } from '@/features/product-pages/types';

/**
 * Product-owned publication facts.
 *
 * This is the secondary-page equivalent of site.ts: shared components may read
 * it, but the family sync tool never overwrites it. Do not put JSX, CSS, prices
 * or prose fragments here. Commercial records and translated copy are added by
 * the product-specific data adapters in the page implementation.
 */
export const PRODUCT_PAGES = {
  pricing: {
    status: 'off' as PageStatus,
    mode: 'project',
  },
  contact: {
    status: 'public',
  },
  blog: {
    status: 'public' as PageStatus,
  },
  integrations: {
    status: 'off' as PageStatus,
    records: [
      {
        id: 'website-brief',
        name: 'Website brief',
        icon: 'solar:global-bold-duotone',
        category: 'businessSystems',
        connection: 'direct',
        status: 'available' as IntegrationStatus,
        dataFlow: 'websiteEvents',
        machineDescription: 'The public website collects a venue brief for preparing a first music profile.',
        requirements: ['Venue description and customer contact details'],
        officialSources: ['https://aimusic.ge/'],
      },
    ],
  },
  security: {
    status: 'off' as PageStatus,
  },
  privacy: {
    status: 'off' as PageStatus,
  },
  terms: {
    status: 'off' as PageStatus,
  },
  cookies: {
    status: 'off' as PageStatus,
  },
  solutions: {
    status: 'off' as PageStatus,
    slugs: [],
  },
  localeNamespaces: {
    ka: [
      'productPages.common',
      'productPages.pricing',
      'productPages.contact',
      'productPages.blog',
      'productPages.integrations',
      'productPages.security',
      'productPages.privacy',
      'productPages.terms',
    ],
    en: [
      'productPages.common',
      'productPages.pricing',
      'productPages.contact',
      'productPages.blog',
      'productPages.integrations',
      'productPages.security',
      'productPages.privacy',
      'productPages.terms',
    ],
    ru: [
      'productPages.common',
      'productPages.pricing',
      'productPages.contact',
      'productPages.blog',
      'productPages.integrations',
      'productPages.security',
      'productPages.privacy',
      'productPages.terms',
    ],
  },
} as const satisfies ProductPagesConfig;
