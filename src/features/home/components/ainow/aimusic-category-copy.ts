export type AiMusicCategoryProductId =
  | "aichats" | "aicall" | "aicontent" | "aiads" | "aimusic" | "aistaff"
  | "aibrain" | "aioffice" | "aidocs" | "aiweb" | "aiapp" | "vibecoding";

export type AiMusicCategoryLocale = "ka" | "en" | "ru";
export type AiMusicCategoryProductCopy = {
  readonly name: string;
  readonly description: string;
  readonly href: "#hero" | "#categories" | "#how-we-work" | "#model-architecture" | "#architecture" | "#faq" | "#cta";
};

type Matrix = Record<AiMusicCategoryProductId, AiMusicCategoryProductCopy>;

export const AIMUSIC_CATEGORY_PRODUCT_COPY: Record<AiMusicCategoryLocale, Matrix> = {
  ka: {
    aichats: { name: "სივრცის ბრიფი", description: "აღწერეთ ადგილი, სტუმარი და სასურველი განწყობა.", href: "#hero" },
    aicall: { name: "მუსიკის მიზანი", description: "დაასახელეთ, რას უნდა ქმნიდეს მუსიკა სივრცეში.", href: "#categories" },
    aicontent: { name: "მუსიკის პროფილი", description: "შეათანხმეთ ჟღერადობა, ტემპი და დღის მონაკვეთები.", href: "#categories" },
    aiads: { name: "დღიური ფლეილისტი", description: "დაალაგეთ განმეორებადი არჩევანი შეთანხმებული სივრცისთვის.", href: "#how-we-work" },
    aimusic: { name: "გამოყენების ჩანაწერი", description: "დააფიქსირეთ, სად და როგორ გამოიყენება მუსიკა.", href: "#how-we-work" },
    aistaff: { name: "ადამიანის შემოწმება", description: "შეთანხმებამდე შედეგს პასუხისმგებელი ადამიანი ამოწმებს.", href: "#model-architecture" },
    aibrain: { name: "წყარო და პირობები", description: "მიუთითეთ მასალა და გამოყენების შეთანხმებული წესი.", href: "#model-architecture" },
    aioffice: { name: "ვადა და ტერიტორია", description: "ჩაწერეთ გამოყენების დროითი და გეოგრაფიული ფარგლები.", href: "#faq" },
    aidocs: { name: "უფლებების დოკუმენტი", description: "შეინახეთ გამოყენების პირობები წერილობით.", href: "#faq" },
    aiweb: { name: "სივრცის სამუშაო სქემა", description: "დაუკავშირეთ სივრცის ზონები მუსიკის არჩევანს.", href: "#cta" },
    aiapp: { name: "შეთანხმებული მოცულობა", description: "განსაზღვრეთ, რა შედის პირველ მუსიკალურ პაკეტში.", href: "#cta" },
    vibecoding: { name: "გამოყენების საზღვარი", description: "გამოყავით პირობები, რომლებიც ცალკე უნდა დადასტურდეს.", href: "#cta" },
  },
  en: {
    aichats: { name: "Venue brief", description: "Describe the place, audience and desired mood.", href: "#hero" },
    aicall: { name: "Music goal", description: "Name what the music should create in the venue.", href: "#categories" },
    aicontent: { name: "Music profile", description: "Agree sound, tempo and parts of the day.", href: "#categories" },
    aiads: { name: "Daily playlist", description: "Arrange a repeatable selection for the agreed venue.", href: "#how-we-work" },
    aimusic: { name: "Usage record", description: "Record where and how the music may be used.", href: "#how-we-work" },
    aistaff: { name: "Human review", description: "A responsible person reviews the result before agreement.", href: "#model-architecture" },
    aibrain: { name: "Source and terms", description: "Name the material and agreed usage rule.", href: "#model-architecture" },
    aioffice: { name: "Term and territory", description: "Write the time and geographic usage boundaries.", href: "#faq" },
    aidocs: { name: "Rights document", description: "Keep usage conditions in writing.", href: "#faq" },
    aiweb: { name: "Venue workflow", description: "Connect venue zones to the music selection.", href: "#cta" },
    aiapp: { name: "Agreed scope", description: "Define what belongs in the first music package.", href: "#cta" },
    vibecoding: { name: "Usage boundary", description: "Separate conditions that need their own confirmation.", href: "#cta" },
  },
  ru: {
    aichats: { name: "Бриф площадки", description: "Опишите место, аудиторию и нужное настроение.", href: "#hero" },
    aicall: { name: "Музыкальная задача", description: "Назовите, какое впечатление должна создавать музыка.", href: "#categories" },
    aicontent: { name: "Музыкальный профиль", description: "Согласуйте звучание, темп и части дня.", href: "#categories" },
    aiads: { name: "Ежедневный плейлист", description: "Соберите повторяемый выбор для согласованной площадки.", href: "#how-we-work" },
    aimusic: { name: "Запись использования", description: "Зафиксируйте, где и как можно использовать музыку.", href: "#how-we-work" },
    aistaff: { name: "Проверка человеком", description: "Ответственный человек проверяет результат до согласования.", href: "#model-architecture" },
    aibrain: { name: "Источник и условия", description: "Укажите материал и согласованное правило использования.", href: "#model-architecture" },
    aioffice: { name: "Срок и территория", description: "Запишите временные и географические границы использования.", href: "#faq" },
    aidocs: { name: "Документ о правах", description: "Сохраните условия использования письменно.", href: "#faq" },
    aiweb: { name: "Схема площадки", description: "Свяжите зоны площадки с музыкальным выбором.", href: "#cta" },
    aiapp: { name: "Согласованный объём", description: "Определите, что войдёт в первый музыкальный пакет.", href: "#cta" },
    vibecoding: { name: "Граница использования", description: "Отдельно выделите условия, требующие подтверждения.", href: "#cta" },
  },
};

export function getAiMusicCategoryProductCopy(locale: string): Matrix {
  return AIMUSIC_CATEGORY_PRODUCT_COPY[locale === "ka" || locale === "ru" ? locale : "en"];
}
