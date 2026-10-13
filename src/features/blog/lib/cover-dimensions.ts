export type CoverDimensions = { width: number; height: number }

const COVER_DIMENSIONS: Record<string, CoverDimensions> = {
    "/blog-covers/aimusic-biznesis-musicis-gamoyenebis-uflebebi.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-clinic-waiting-room-music-brief.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-coworking-office-music.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-fitnes-studiis-musicis-gegma.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-gakhsnamde-trekebis-gadaxedva-chanacvlebis-protokoli.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-hotel-multi-zone-governance.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-kafis-gakhsnamde-musicis-gegma.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-kafis-restornis-dghis-ritmi.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-long-shift-music-rotation.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-magaziis-brendirebuli-musicis-gegma.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-music-audio-system-procurement.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-musikaluri-brifi-originaluri-playlist.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-pop-ap-sivrceshi-musicis-vadisa-da-farglebis-gegma.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-ramdenime-filialis-ertiani-musicis-profil.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-rebrendingis-shemdeg-musicis-shecvlis-gegma.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-restoranis-zonebis-musicis-gegma.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-salon-spa-zone-music.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-sastumros-lobis-musicis-dagegmva.png": { width: 1672, height: 941 },
    "/blog-covers/aimusic-sezonuri-musicis-ganakhleba-biznes-sivrceshi.png": { width: 1672, height: 941 },
    "/blog-covers/biznesis-musika-mza-servisi-tu-originaluri-fleilisti.png": { width: 1672, height: 941 },
}

export function getCoverDimensions(coverPath: string): CoverDimensions | undefined {
    return Object.hasOwn(COVER_DIMENSIONS, coverPath) ? COVER_DIMENSIONS[coverPath] : undefined
}
