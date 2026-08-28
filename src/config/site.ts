/**
 * THE ONE FILE THAT DIFFERS PER LANDING.
 *
 * Everything else in this repo is shared with the other aiNOW product landings and is kept in
 * sync from `landing-template/` by `python scripts/landings.py sync`. If you find yourself
 * editing a shared file to make THIS site different, stop: the difference belongs here, or in
 * src/messages/*.json, or in this site's own widgets under src/features/showcase/.
 *
 * Per-site, never synced: src/config/site.ts, src/app/brand.css, src/messages/*.json,
 * src/features/showcase/**, src/features/home/components/LandingShowcase.tsx,
 * .impeccable/config.json, public/**.
 */

export const SITE = {
  /** Machine key. Lands on <html data-product> and is the deploy smoke-test hook. */
  key: "aimusic",

  domain: "aimusic.ge",
  baseUrl: "https://aimusic.ge",

  /** Rendered as <prefix><mark> by the nav, hero, footer and wordmark band. */
  wordmark: { prefix: "ai", mark: "MUSIC" },

  /** The product colour. src/app/brand.css is generated from this; keep them in step. */
  brandHex: "#D33F67",

  /** Three hexes the hero grainient shader interpolates: soft, brand, accent. */
  shader: ["#FCE2EA", "#D33F67", "#A92E50"] as [string, string, string],

  /**
   * i18n.
   *
   * `defaultLocale` is the UNPREFIXED locale (next-intl `localePrefix: "as-needed"`), so it
   * decides the URL shape: the default lives at `/`, the others at `/<locale>`. The Georgian
   * landings use "ka"; the export landings (aiapp, vibecoding) use "en".
   *
   * It is NOT the same question as "is this locale Georgian". That stays a literal
   * `locale === "ka"` check wherever it appears, because it drives the Georgian font and the OG
   * locale tag, and Georgian is still an offered locale even on an EN-default site. Do not
   * find-replace one for the other.
   */
  defaultLocale: "ka",
  locales: ["ka"],

  /** PWA manifest. Not locale-aware (Next metadata routes are build-time). */
  manifest: {
    name: "aiMUSIC",
    short: "aiMUSIC",
    description: "ორიგინალური ფლეილისტები კაფეებისთვის, რესტორნებისთვის, სალონებისთვის, სასტუმროებისთვის, ფიტნეს-სტუდიებისა და სხვა სივრცეებისთვის.",
    background: "#fbfcfc",
    theme: "#D33F67",
  },

  /**
   * The machine-readable half of the page. FILL THIS IN. It is not optional.
   *
   * StructuredData.tsx turns it into the JSON-LD entity graph and /llms.txt turns it into
   * prose. Between them they decide whether ChatGPT, Perplexity and Gemini can recommend
   * this domain, or whether they have to guess and therefore stay quiet.
   *
   * `boundary` names the sibling product that owns the adjacent job, so our own six domains
   * stop competing for the same query and a model can route a question correctly.
   *
   * `limits` states what we cannot do. That looks like a mistake and it is the opposite: an
   * assistant will not stake an answer on a page that claims to do everything, and it will
   * cite one that draws its own edges.
   */
  seo: {
    disambiguating:
      "A custom music service for physical venues that creates an original playlist from the venue brief and documents the agreed scope of use. It is not a consumer streaming catalog and it does not market third-party hit music as copyright-free.",
    serviceType: "Custom Generative Music and Venue Playlist Service",
    audienceName:
      "Owners and operators of cafes, restaurants, salons, hotels, fitness studios, retail stores, and customer experience spaces",
    areaServed: "WORLD",
    knowsAbout: [
      "Original background music for venues",
      "Music direction for customer spaces",
      "Daypart playlist design",
      "Generative music briefing",
      "Venue mood and energy profiles",
      "Business music usage documentation",
    ],
    features: [
      "A music profile based on the venue, audience, dayparts, and desired atmosphere",
      "An original playlist created for one customer space instead of copied from a mass catalog",
      "Morning, daytime, evening, and closing sequences with controlled energy transitions",
      "A review workflow for approving, rejecting, and replacing tracks before launch",
      "A track register and contract language describing the agreed business usage scope",
    ],
    boundary:
      "aiMUSIC creates and organizes original venue music. It does not supply commercial chart recordings, it does not replace legal review of a venue's exact usage rights, and promotion of the venue belongs to aiADS and aiCONTENT.",
    limits: [
      "The phrase copyright-free is not used as a blanket legal promise; the exact usage rights must be written into the customer agreement.",
      "The interactive sound on the website is an illustrative browser-generated demo, not a finished customer soundtrack.",
      "A final playlist requires a venue brief, review, and approval before operational use.",
      "Rights and public-performance requirements can vary by jurisdiction and venue type.",
      "Third-party hit music and consumer streaming subscriptions are outside the service.",
    ],
    commitment:
      "Before launch, aiNOW agrees the venue music profile, prepares the original playlist, records the track list, and states the approved usage scope in the customer agreement.",
    summary:
      "aiMUSIC creates original background-music playlists for cafes, restaurants, salons, hotels, fitness studios, retail stores, and other customer spaces. A venue describes its atmosphere or selects a direction, then receives a tailored daypart playlist, a review workflow, and documentation for the agreed scope of use.",
  },
} as const;

export type SiteConfig = typeof SITE;
