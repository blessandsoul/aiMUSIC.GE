export const AIMUSIC_MODEL_PROOF_PROVIDER_KEYS = [
  "Venue brief",
  "Music profile",
  "Playlist",
  "Usage record",
  "Territory",
  "Term",
  "Source",
  "Mood",
  "Rights",
  "Scope",
  "Human review",
] as const;

export type AiMusicModelProofProviderKey = (typeof AIMUSIC_MODEL_PROOF_PROVIDER_KEYS)[number];
export type AiMusicModelProofSourceTone = "openai" | "anthropic" | "google" | "xai" | "mistral" | "deepseek" | "meta" | "qwen" | "cohere" | "zai" | "kimi";

// The source tone slots are structural CSS roles, not provider endorsements.
export const AIMUSIC_MODEL_PROOF_SOURCE_TONES: Record<AiMusicModelProofProviderKey, AiMusicModelProofSourceTone> = {
  "Venue brief": "openai",
  "Music profile": "anthropic",
  Playlist: "google",
  "Usage record": "xai",
  Territory: "mistral",
  Term: "deepseek",
  Source: "meta",
  Mood: "qwen",
  Rights: "cohere",
  Scope: "zai",
  "Human review": "kimi",
};

type TrustCard = {
  value: string;
  label: string;
  detail: string;
  image: string;
};

export type AiMusicModelProofCopy = {
  eyebrow: string;
  title: string;
  description: string;
  radar: string;
  moreTechnologies: string;
  jevKicker: string;
  jevTitle: string;
  jevDescription: string;
  trustLabel: string;
  providerLabels: Record<AiMusicModelProofProviderKey, string>;
  initialModels: Record<"Venue brief" | "Music profile" | "Playlist" | "Usage record", string>;
  brand: {
    established: string;
    title: string;
    location: string;
    language: string;
  };
  trust: readonly TrustCard[];
};

export function aiMusicModelProofTrustItemClassName(index: number): string {
  return `ainow-model-stage__trust-item${index === 3 ? " ainow-model-stage__trust-item--always-on" : ""}`;
}

const images = {
  profile: "/images/aimusic/venue-mood-profile-v1.png",
  playlist: "/images/aimusic/daily-playlist-v1.png",
  usage: "/images/aimusic/usage-document-v1.png",
  review: "/images/aimusic/venue-workflow-v1.png",
} as const;

export const AIMUSIC_MODEL_PROOF_COPY: Record<"ka" | "en" | "ru", AiMusicModelProofCopy> = {
  ka: {
    eyebrow: "მუსიკის პროფილი და გამოყენების პირობები",
    title: "მუსიკის პროფილი შეთანხმებულ გამოყენებას ეყრდნობა.",
    description: "ვაზუსტებთ სივრცის კონტექსტს, მუსიკის განწყობას, ფლეილისტს, გამოყენების ვადასა და უფლებების დოკუმენტაციას.",
    radar: "მუსიკის პროფილი, ფლეილისტი და გამოყენების პირობები",
    moreTechnologies: "დამატებითი პირობები",
    jevKicker: "გამოყენების ფარგლები",
    jevTitle: "მუსიკის პროფილი, ფლეილისტი და გამოყენების ჩანაწერი",
    jevDescription: "სივრცის ბრიფი, ფლეილისტი და დოკუმენტი მკაფიოდ ჩანს შეთანხმებულ მოცულობაში.",
    trustLabel: "პროფილი, ფლეილისტი და გამოყენების შემოწმება",
    providerLabels: {
      "Venue brief": "სივრცის ბრიფი",
      "Music profile": "მუსიკის პროფილი",
      Playlist: "ფლეილისტი",
      "Usage record": "გამოყენების ჩანაწერი",
      Territory: "ტერიტორია",
      Term: "ვადა",
      Source: "წყარო",
      Mood: "განწყობა",
      Rights: "უფლებები",
      Scope: "მოცულობა",
      "Human review": "ადამიანის შემოწმება",
    },
    initialModels: {
      "Venue brief": "სივრცის კონტექსტი",
      "Music profile": "მუსიკის პროფილი",
      Playlist: "დღიური ფლეილისტი",
      "Usage record": "გამოყენების ჩანაწერი",
    },
    brand: {
      established: "aiMUSIC · თბილისი",
      title: "მუსიკა ბიზნესის სივრცისთვის",
      location: "თბილისი / შეთანხმებული მოცულობა",
      language: "სივრცის კონტექსტი. წერილობითი პირობები.",
    },
    trust: [
      { value: "ბრიფი", label: "სივრცის კონტექსტი", detail: "მუსიკის მიზანი თავიდანვე თანხმდება.", image: images.profile },
      { value: "ფლეილისტი", label: "დღის სტრუქტურა", detail: "განმეორებადი არჩევანი მკაფიოდ ჩანს.", image: images.playlist },
      { value: "გამოყენება", label: "წყაროს დოკუმენტი", detail: "ვადა და ტერიტორია წერილობით ფიქსირდება.", image: images.usage },
      { value: "შემოწმება", label: "ადამიანის დამტკიცება", detail: "გამოყენება შეთანხმებულ შემოწმებას მიჰყვება.", image: images.review },
      { value: "TikTok", label: "ვერიფიკაცია გავლილია", detail: "TikTok-მა aiNOW-ს ჩატის, რეკლამისა და გამოქვეყნების API-ებზე წვდომა დაუმტკიცა.", image: "/images/model-trust/tiktok-verified-glass-v1.png" },
    ],
  },
  en: {
    eyebrow: "Music profile and usage terms",
    title: "A venue music profile needs agreed use.",
    description: "We define venue context, mood, playlist, term, territory and usage documentation before use.",
    radar: "Music profile, playlist and usage terms",
    moreTechnologies: "More usage terms",
    jevKicker: "Usage boundary",
    jevTitle: "Music profile, playlist and usage record",
    jevDescription: "The venue brief, playlist and usage record stay visible within the agreed scope.",
    trustLabel: "Profile, playlist and usage review",
    providerLabels: {
      "Venue brief": "Venue brief",
      "Music profile": "Music profile",
      Playlist: "Playlist",
      "Usage record": "Usage record",
      Territory: "Territory",
      Term: "Term",
      Source: "Source",
      Mood: "Mood",
      Rights: "Rights",
      Scope: "Scope",
      "Human review": "Human review",
    },
    initialModels: {
      "Venue brief": "Venue context",
      "Music profile": "Music profile",
      Playlist: "Daily playlist",
      "Usage record": "Usage record",
    },
    brand: {
      established: "aiMUSIC · Tbilisi",
      title: "MUSIC FOR THE VENUE",
      location: "Tbilisi / agreed scope",
      language: "Venue context. Written usage terms.",
    },
    trust: [
      { value: "Brief", label: "VENUE CONTEXT", detail: "The music goal is agreed first.", image: images.profile },
      { value: "Playlist", label: "DAILY STRUCTURE", detail: "The repeatable selection stays visible.", image: images.playlist },
      { value: "Usage", label: "SOURCE RECORD", detail: "Term and territory are written down.", image: images.usage },
      { value: "Review", label: "HUMAN APPROVAL", detail: "Use follows the agreed review boundary.", image: images.review },
      { value: "TikTok", label: "Verification completed", detail: "TikTok approved aiNOW's access to chat, advertising and publishing APIs.", image: "/images/model-trust/tiktok-verified-glass-v1.png" },
    ],
  },
  ru: {
    eyebrow: "Музыкальный профиль и условия использования",
    title: "Музыка для бизнеса. Условия — заранее.",
    description: "До использования определяем контекст площадки, настроение, плейлист, срок, территорию и документы об использовании.",
    radar: "Музыкальный профиль, плейлист и условия использования",
    moreTechnologies: "Дополнительные условия использования",
    jevKicker: "Граница использования",
    jevTitle: "Музыкальный профиль, плейлист и запись использования",
    jevDescription: "Бриф площадки, плейлист и запись условий остаются видимыми в согласованном объёме.",
    trustLabel: "Профиль, плейлист и проверка использования",
    providerLabels: {
      "Venue brief": "Бриф площадки",
      "Music profile": "Музыкальный профиль",
      Playlist: "Плейлист",
      "Usage record": "Запись использования",
      Territory: "Территория",
      Term: "Срок",
      Source: "Источник",
      Mood: "Настроение",
      Rights: "Права",
      Scope: "Объём",
      "Human review": "Проверка человеком",
    },
    initialModels: {
      "Venue brief": "Контекст площадки",
      "Music profile": "Музыкальный профиль",
      Playlist: "Ежедневный плейлист",
      "Usage record": "Запись использования",
    },
    brand: {
      established: "aiMUSIC · Тбилиси",
      title: "МУЗЫКА ДЛЯ ПЛОЩАДКИ",
      location: "Тбилиси / согласованный объём",
      language: "Контекст площадки. Письменные условия.",
    },
    trust: [
      { value: "Бриф", label: "КОНТЕКСТ ПЛОЩАДКИ", detail: "Музыкальная задача согласуется заранее.", image: images.profile },
      { value: "Плейлист", label: "СТРУКТУРА ДНЯ", detail: "Повторяемый выбор остаётся видимым.", image: images.playlist },
      { value: "Использование", label: "ДОКУМЕНТ ИСТОЧНИКА", detail: "Срок и территория фиксируются письменно.", image: images.usage },
      { value: "Проверка", label: "ПОДТВЕРЖДЕНИЕ ЧЕЛОВЕКОМ", detail: "Использование следует согласованной проверке.", image: images.review },
      { value: "TikTok", label: "Верификация пройдена", detail: "TikTok одобрил aiNOW доступ к API чатов, рекламы и публикации.", image: "/images/model-trust/tiktok-verified-glass-v1.png" },
    ],
  },
};

export function getAiMusicModelProofCopy(locale: string): AiMusicModelProofCopy {
  return AIMUSIC_MODEL_PROOF_COPY[locale === "ka" || locale === "ru" ? locale : "en"];
}
