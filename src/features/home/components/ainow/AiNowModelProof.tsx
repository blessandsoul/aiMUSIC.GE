"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { AiNowSectionFrame } from "./AiNowSectionFrame";
import { AiNowImage } from "./AiNowImage";
import { AiNowDisclosure } from "./AiNowDisclosure";
import {
  AIMUSIC_MODEL_PROOF_SOURCE_TONES,
  getAiMusicModelProofCopy as getModelProofCopy,
  aiMusicModelProofTrustItemClassName,
  type AiMusicModelProofProviderKey,
} from "./aimusic-model-proof-copy";

type RadarModel = {
  readonly name: string;
  readonly lab: string;
};

type RadarResponse = {
  readonly models?: readonly RadarModel[];
};

type Provider = {
  readonly lab: string;
  readonly mark: string | null;
  readonly wordmark: string;
  readonly tone: (typeof AIMUSIC_MODEL_PROOF_SOURCE_TONES)[AiMusicModelProofProviderKey];
};

const providers: readonly Provider[] = [
  { lab: "Venue brief", mark: null, wordmark: "Venue brief", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES["Venue brief"] },
  { lab: "Music profile", mark: null, wordmark: "Music profile", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES["Music profile"] },
  { lab: "Playlist", mark: null, wordmark: "Playlist", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES.Playlist },
  { lab: "Usage record", mark: null, wordmark: "Usage record", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES["Usage record"] },
  { lab: "Territory", mark: null, wordmark: "Territory", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES.Territory },
  { lab: "Term", mark: null, wordmark: "Term", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES.Term },
  { lab: "Source", mark: null, wordmark: "Source", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES.Source },
  { lab: "Mood", mark: null, wordmark: "Mood", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES.Mood },
  { lab: "Rights", mark: null, wordmark: "Rights", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES.Rights },
  { lab: "Scope", mark: null, wordmark: "Scope", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES.Scope },
  { lab: "Human review", mark: null, wordmark: "Human review", tone: AIMUSIC_MODEL_PROOF_SOURCE_TONES["Human review"] },
];

const legacyInitialModels: readonly RadarModel[] = [
  // Keep the fallback factual when the public model feed is unavailable.
  { lab: "Venue brief", name: "Venue brief" },
  { lab: "Music profile", name: "Music profile" },
  { lab: "Playlist", name: "Playlist" },
  { lab: "Usage record", name: "Usage record" },
];

const legacyCopyByLocale = {
  ka: {
    eyebrow: "aiMUSIC-ის სამუშაო ფენა",
    title: "მუსიკის პროფილი და გამოყენება.",
    description: "სივრცის brief, playlist და usage record შეთანხმებულ მოცულობაში.",
    radar: "ტექნოლოგიები, რომლებსაც ვიყენებთ",
    moreTechnologies: "სხვა ტექნოლოგიები",
    jevKicker: "გადაწყვეტილების ფენა",
    jevTitle: "Jev by TypeSafe",
    jevDescription: "Jev გვეხმარება შემდეგი მოქმედების არჩევაში.",
    trustLabel: "უსაფრთხოება, წვდომა და ხელმისაწვდომობა",
    brand: {
      established: "EST. 2025 · თბილისი",
      title: "BUILT FOR GEORGIAN BUSINESS",
      location: "თბილისი / ევროპული ინფრასტრუქტურა",
      language: "ქართული ენა. რეალური პროცესები.",
    },
    trust: [
      {
        value: "Meta",
        label: "VERIFIED META TECH PROVIDER",
        detail: "META APP REVIEW APPROVED",
        image: "/images/aimusic/venue-mood-profile-v1.png",
      },
      {
        value: "ევროპა, გერმანია",
        label: "Hetzner-ის ინფრასტრუქტურა",
        detail: "თუ პროექტისთვის ასე შევთანხმდებით.",
        image: "/images/aimusic/daily-playlist-v1.png",
      },
      {
        value: "Cloudflare",
        label: "Cloudflare-ის დაცვა",
        detail: "დაცვა პროექტის კონფიგურაციაზეა დამოკიდებული.",
        image: "/images/aimusic/usage-document-v1.png",
      },
      {
        value: "24/7",
        label: "365 დღე წელიწადში",
        detail: "ჩვენი გუნდი მუშაობს ღამითაც და უქმე დღეებშიც.",
        image: "/images/aimusic/venue-workflow-v1.png",
      },
    ],
  },
  en: {
    eyebrow: "aiMUSIC work layer",
    title: "Music profile and usage.",
    description: "Venue brief, playlist and usage record within agreed scope.",
    radar: "Technologies we use",
    moreTechnologies: "More technologies",
    jevKicker: "Decision layer",
    jevTitle: "Jev by TypeSafe",
    jevDescription: "Jev helps select the system's next action.",
    trustLabel: "Security, access and availability",
    brand: {
      established: "EST. 2025 · Tbilisi",
      title: "BUILT FOR GEORGIAN BUSINESS",
      location: "Tbilisi / European infrastructure",
      language: "Georgian language. Real workflows.",
    },
    trust: [
      {
        value: "Meta",
        label: "VERIFIED META TECH PROVIDER",
        detail: "META APP REVIEW APPROVED",
        image: "/images/model-trust/meta-verified-glass-v1.png",
      },
      {
        value: "Europe, Germany",
        label: "Hetzner infrastructure",
        detail: "Applied within the agreed project scope.",
        image: "/images/model-trust/germany-hetzner-glass-v1.png",
      },
      {
        value: "Cloudflare",
        label: "Cloudflare protection",
        detail: "Configured per project scope.",
        image: "/images/model-trust/cloudflare-protection-glass-v1.png",
      },
      {
        value: "24/7",
        label: "365 days a year",
        detail: "Our team works nights, weekends and holidays.",
        image: "/images/model-trust/always-on-glass-v1.png",
      },
    ],
  },
  ru: {
    eyebrow: "Рабочий слой aiMUSIC",
    title: "Музыкальный профиль и использование.",
    description: "Бриф площадки, плейлист и запись условий использования.",
    radar: "Технологии, которые мы используем",
    moreTechnologies: "Другие технологии",
    jevKicker: "Слой принятия решений",
    jevTitle: "Jev by TypeSafe",
    jevDescription: "Jev помогает выбрать следующее действие системы.",
    trustLabel: "Безопасность, доступ и доступность",
    brand: {
      established: "EST. 2025 · Тбилиси",
      title: "СОЗДАНО ДЛЯ ГРУЗИНСКОГО БИЗНЕСА",
      location: "Тбилиси / европейская инфраструктура",
      language: "Грузинский язык. Реальные процессы.",
    },
    trust: [
      {
        value: "Meta",
        label: "VERIFIED META TECH PROVIDER",
        detail: "META APP REVIEW APPROVED",
        image: "/images/model-trust/meta-verified-glass-v1.png",
      },
      {
        value: "Европа, Германия",
        label: "Инфраструктура Hetzner",
        detail: "В рамках согласованного проекта.",
        image: "/images/model-trust/germany-hetzner-glass-v1.png",
      },
      {
        value: "Cloudflare",
        label: "Защита Cloudflare",
        detail: "Настраивается в рамках проекта.",
        image: "/images/model-trust/cloudflare-protection-glass-v1.png",
      },
      {
        value: "24/7",
        label: "365 дней в году",
        detail: "Наша команда работает ночью, в выходные и праздники.",
        image: "/images/model-trust/always-on-glass-v1.png",
      },
    ],
  },
} as const;

function getCopy(locale: string) {
  return getModelProofCopy(locale);
}

// Retain the source-shaped fallback data for auditability; the product getter above is the consumer.
void legacyInitialModels;
void legacyCopyByLocale;

export const getAiMusicModelProofCopy = getModelProofCopy;

export function AiNowModelProof() {
  const locale = useLocale();
  const copy = getCopy(locale);
  const initialModels = useMemo<readonly RadarModel[]>(() => [
    { lab: "Venue brief", name: copy.initialModels["Venue brief"] },
    { lab: "Music profile", name: copy.initialModels["Music profile"] },
    { lab: "Playlist", name: copy.initialModels.Playlist },
    { lab: "Usage record", name: copy.initialModels["Usage record"] },
  ], [copy]);
  const [models, setModels] = useState<readonly RadarModel[]>(initialModels);

  useEffect(() => {
    let mounted = true;

    void fetch("/ai/models.json", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<RadarResponse>;
      })
      .then((payload) => {
        if (mounted && payload?.models?.length) setModels(payload.models);
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const modelNames = useMemo(() => {
    const names = new Map(models.map((model) => [model.lab, model.name]));
    return (provider: Provider) => names.get(provider.lab)
      ?? copy.initialModels[provider.lab as keyof typeof copy.initialModels]
      ?? copy.providerLabels[provider.lab as AiMusicModelProofProviderKey]
      ?? provider.wordmark;
  }, [copy, models]);

  const renderProvider = (provider: Provider) => {
    const providerLabel = copy.providerLabels[provider.lab as AiMusicModelProofProviderKey] ?? provider.wordmark;
    return (
    <div className={`ainow-model-stage__provider ainow-model-stage__provider--${provider.tone}`} key={provider.lab} title={`${providerLabel}: ${modelNames(provider)}`}>
      <span className="ainow-model-stage__provider-mark" aria-hidden="true">
        {provider.mark ? (
          <AiNowImage
            src={provider.mark}
            alt=""
            width={18}
            height={18}
            frameClassName="inline-flex size-[18px]"
            className="size-full object-contain"
            unoptimized
          />
        ) : (
          <span className="ainow-model-stage__wordmark">{providerLabel.slice(0, 1)}</span>
        )}
      </span>
      <span className="ainow-model-stage__provider-copy">
        <span className="ainow-model-stage__provider-lab">{providerLabel}</span>
        <span className="ainow-model-stage__provider-model">{modelNames(provider)}</span>
      </span>
    </div>
    );
  };

  return (
    <AiNowSectionFrame
      id="model-architecture"
      hasLaser={false}
      showTicks={false}
      containerClassName="px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
    >
      <section className="ainow-model-stage" aria-labelledby="ainow-model-stage-title">
        <div className="ainow-model-stage__intro">
          <div className="ainow-model-stage__eyebrow">
            <span className="ainow-model-stage__status" aria-hidden="true" />
            <span>{copy.eyebrow}</span>
          </div>
          <h2 id="ainow-model-stage-title">{copy.title}</h2>
          <p>{copy.description}</p>
        </div>

        <div
          className="ainow-model-stage__decision ainow-model-stage__visual-card"
        >
          <AiNowImage
            className="ainow-model-stage__decision-image"
            src="/images/aimusic/venue-mood-profile-v1.png"
            alt=""
            fill
            frameClassName="absolute inset-0"
            sizes="(max-width: 767px) 100vw, 40vw"
          />
          <div className="ainow-model-stage__decision-scrim" aria-hidden="true" />
          <div className="ainow-model-stage__decision-content">
            <div className="ainow-model-stage__decision-copy">
              <span>{copy.jevKicker}</span>
              <strong>{copy.jevTitle}</strong>
              <p>{copy.jevDescription}</p>
            </div>
          </div>
        </div>

        <div
          className="ainow-model-stage__catalog ainow-model-stage__visual-card"
          aria-label={copy.radar}
        >
          <AiNowImage
            className="ainow-model-stage__catalog-image"
            src="/images/aimusic/daily-playlist-v1.png"
            alt=""
            fill
            frameClassName="absolute inset-0"
            sizes="(max-width: 767px) 100vw, 58vw"
          />
          <div className="ainow-model-stage__catalog-scrim" aria-hidden="true" />
          <div className="ainow-model-stage__catalog-content">
            <div className="ainow-model-stage__catalog-heading">
              <span>{copy.radar}</span>
            </div>
            <div className="ainow-model-stage__providers" data-model-provider-group="primary">
              {providers.slice(0, 4).map(renderProvider)}
            </div>
            <AiNowDisclosure
              title={copy.moreTechnologies}
              className="mt-2 border-t border-slate-200/60 [&>button]:min-h-10 [&>button]:py-2 [&>button]:text-xs dark:border-white/10"
            >
              <div className="ainow-model-stage__providers pb-1" data-model-provider-group="additional">
                {providers.slice(4).map(renderProvider)}
              </div>
            </AiNowDisclosure>
          </div>
        </div>

        <dl className="ainow-model-stage__trust" aria-label={copy.trustLabel} tabIndex={0}>
          {copy.trust.map((item, index) => (
            <div className={aiMusicModelProofTrustItemClassName(index)} key={item.value}>
              <AiNowImage
                className="ainow-model-stage__trust-image"
                src={item.image}
                alt=""
                fill
                frameClassName="absolute inset-0"
                sizes="(max-width: 767px) 82vw, (max-width: 1040px) 25vw, 30vw"
              />
              <div className="ainow-model-stage__trust-copy">
                <dt>{item.value}</dt>
                <dd>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <section className="ainow-model-stage__brand ainow-model-stage__visual-card" aria-label={copy.brand.title}>
          <AiNowImage
            className="ainow-model-stage__brand-image"
            src="/images/aimusic/usage-document-v1.png"
            alt=""
            fill
            frameClassName="absolute inset-0"
            sizes="(max-width: 767px) 100vw, 100vw"
          />
          <div className="ainow-model-stage__brand-scrim" aria-hidden="true" />
          <div className="ainow-model-stage__brand-copy">
            <span>{copy.brand.established}</span>
            <h3>{copy.brand.title}</h3>
            <p>{copy.brand.language}</p>
            <small>{copy.brand.location}</small>
          </div>
        </section>
      </section>
    </AiNowSectionFrame>
  );
}
