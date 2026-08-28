'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Ico } from '@/components/common/Ico';

import './music-hero-proof.css';

type VenueKey = 'cafe' | 'salon' | 'rooftop' | 'hotel';

type PlaylistTrack = {
  title: string;
  detail: string;
  source: string;
};

type VenueProfile = {
  label: string;
  icon: string;
  description: string;
  playlistTitle: string;
  tracks: PlaylistTrack[];
};

const AUDIO_ORIGIN = 'https://media.aimusic.ge';

const VENUES: Record<VenueKey, VenueProfile> = {
  cafe: {
    label: 'კაფე',
    icon: 'solar:sun-2-bold-duotone',
    description: 'კაფისთვის — დილიდან საღამომდე.',
    playlistTitle: 'ქალაქური კაფე · დღის ნაკადი',
    tracks: [
      { title: 'ყავის ფოკუსი', detail: 'ჯაზ-ჰოპი · 92 BPM', source: `${AUDIO_ORIGIN}/ffaab89f-a949-4521-8775-35cac94fcdf4.mp3` },
      { title: 'მზიანი დილა', detail: 'დაუნტემპო · 88 BPM', source: `${AUDIO_ORIGIN}/59df8c5b-6593-4b72-aa4a-9c60a4393c3c.mp3` },
      { title: 'თბილი შესვენება', detail: 'დაუნტემპო · 88 BPM', source: `${AUDIO_ORIGIN}/6b0fa174-faa8-4cc0-87ed-d9bd4034ec94.mp3` },
      { title: 'ფანჯარასთან', detail: 'დაუნტემპო · 88 BPM', source: `${AUDIO_ORIGIN}/d12fbdc4-8e9c-4da3-b2e0-41ab1da83124.mp3` },
    ],
  },
  salon: {
    label: 'სალონი',
    icon: 'solar:star-bold',
    description: 'სალონისთვის — მსუბუქი, სუფთა ტონი.',
    playlistTitle: 'სილამაზის სალონი · მსუბუქი ხასიათი',
    tracks: [
      { title: 'სალონის ნათება', detail: 'ნუ-დისკო · 110 BPM', source: `${AUDIO_ORIGIN}/ab2b1c1b-c2ba-4dbe-8d1e-29ee177eb3c3.mp3` },
      { title: 'სუფთა ხაზი', detail: 'ნუ-დისკო · 110 BPM', source: `${AUDIO_ORIGIN}/617e681d-4aac-4f94-99e2-b9ecca6e0bb5.mp3` },
      { title: 'რბილი ბზინვარება', detail: 'ნუ-დისკო · 110 BPM', source: `${AUDIO_ORIGIN}/5c8475b8-0eff-4a4f-b99f-327e096e4956.mp3` },
      { title: 'ნათელი პაუზა', detail: 'ნუ-დისკო · 110 BPM', source: `${AUDIO_ORIGIN}/333ae3a3-869f-4b98-99af-c8367e968d6e.mp3` },
    ],
  },
  rooftop: {
    label: 'ტერასა',
    icon: 'solar:sun-2-bold-duotone',
    description: 'ტერასისთვის — მსუბუქი ჰაუსი.',
    playlistTitle: 'ტერასა · მზის ჩასვლის სეტი',
    tracks: [
      { title: 'მზის ჩასვლა', detail: 'ორგანული ჰაუსი · 112 BPM', source: `${AUDIO_ORIGIN}/3e5125a8-fad7-4361-8960-58a2cc84659e.mp3` },
      { title: 'თბილი ჰაერი', detail: 'ორგანული ჰაუსი · 112 BPM', source: `${AUDIO_ORIGIN}/2d468e79-653a-4897-8012-7cacc6aaa3cb.mp3` },
      { title: 'ღია ცა', detail: 'ორგანული ჰაუსი · 112 BPM', source: `${AUDIO_ORIGIN}/d07bcc7f-8553-424c-aebc-9da62f83aadd.mp3` },
      { title: 'საღამოს რიტმი', detail: 'ორგანული ჰაუსი · 112 BPM', source: `${AUDIO_ORIGIN}/bd150252-c1f3-4306-9a68-4c0eebdf7b91.mp3` },
    ],
  },
  hotel: {
    label: 'სასტუმრო',
    icon: 'solar:map-point-bold-duotone',
    description: 'სასტუმროსთვის — მშვიდი ლობის ხასიათი.',
    playlistTitle: 'სასტუმრო · ლობის რიტმი',
    tracks: [
      { title: 'ღია ლობი', detail: 'ემბიენტ-დაუნტემპო · 78 BPM', source: `${AUDIO_ORIGIN}/0da77b83-6281-4e86-86cf-acf91caa9676.mp3` },
      { title: 'ნელი შემოსვლა', detail: 'ემბიენტ-დაუნტემპო · 78 BPM', source: `${AUDIO_ORIGIN}/5ae4ce94-332d-4359-8eba-3a085af63a85.mp3` },
      { title: 'საღამოს ფოიე', detail: 'ემბიენტ-დაუნტემპო · 78 BPM', source: `${AUDIO_ORIGIN}/128d4f4e-7caf-4fa5-b5f9-0937e1373570.mp3` },
      { title: 'ღამის სიმშვიდე', detail: 'ემბიენტ-დაუნტემპო · 78 BPM', source: `${AUDIO_ORIGIN}/ae49dcac-f0f2-49f9-b4f3-19ce5f1995f1.mp3` },
    ],
  },
};

const VENUE_KEYS = Object.keys(VENUES) as VenueKey[];
const WAVE = [18, 42, 30, 58, 34, 74, 45, 64, 26, 52, 38, 68, 31, 47, 24, 56];

export function HeroProof(): React.ReactElement {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [venue, setVenue] = useState<VenueKey>('cafe');
  const [activeTrack, setActiveTrack] = useState(0);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [audioError, setAudioError] = useState(false);
  const profile = useMemo(() => VENUES[venue], [venue]);

  const stopAudio = (): void => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlayingTrack(null);
  };

  useEffect(() => () => stopAudio(), []);

  const selectVenue = (nextVenue: VenueKey): void => {
    stopAudio();
    setAudioError(false);
    setActiveTrack(0);
    setVenue(nextVenue);
  };

  const toggleTrack = async (trackIndex: number): Promise<void> => {
    const audio = audioRef.current;
    const track = profile.tracks[trackIndex];
    if (!audio || !track) return;

    setAudioError(false);
    if (playingTrack === trackIndex) {
      stopAudio();
      return;
    }

    try {
      audio.src = track.source;
      audio.load();
      setActiveTrack(trackIndex);
      await audio.play();
    } catch {
      setPlayingTrack(null);
      setAudioError(true);
    }
  };

  return (
    <div
      className="music-hero-proof"
      data-hero-demo="true"
      data-landing-demo="true"
      data-demo-id="aimusic-venue-playlist"
      data-demo-state={playingTrack === null ? 'final' : 'playing'}
      role="region"
      aria-label="სივრცისთვის მომზადებული ფლეილისტის ნიმუში"
    >
      <audio
        ref={audioRef}
        data-music-preview="true"
        preload="none"
        onPlay={() => setPlayingTrack(activeTrack)}
        onPause={() => setPlayingTrack(null)}
        onEnded={() => setPlayingTrack(null)}
        onError={() => {
          setPlayingTrack(null);
          setAudioError(true);
        }}
      />

      <div className="music-proof-topbar">
        <span className="music-proof-brand"><Ico name="solar:record-circle-bold-duotone" />ფლეილისტის ნიმუში</span>
        <span className="music-proof-demo">მოუსმინეთ</span>
      </div>

      <div className="music-proof-grid">
        <aside className="music-proof-venues" aria-label="სივრცის ტიპი">
          {VENUE_KEYS.map((key) => {
            const item = VENUES[key];
            return (
              <button
                key={key}
                type="button"
                className={venue === key ? 'is-active' : ''}
                aria-pressed={venue === key}
                onClick={() => selectVenue(key)}
              >
                <Ico name={item.icon} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <section className="music-proof-main" aria-live="polite">
          <div className="music-proof-brief">
            <div>
              <span>რას ყიდულობთ</span>
              <p>{profile.description}</p>
            </div>
            <ol className="music-proof-steps" aria-label="aiMUSIC-ის პროცესი">
              <li><b>01</b>თქვენი სივრცე</li>
              <li><b>02</b>მუსიკალური პროფილი</li>
              <li><b>03</b>დღის ფლეილისტი</li>
            </ol>
          </div>

          <div className="music-proof-playlist">
            <div className="music-proof-playlist-heading">
              <div>
                <span>მოსასმენი ნიმუშები</span>
                <strong>{profile.playlistTitle}</strong>
              </div>
              <small>4 ტრეკი</small>
            </div>

            <div className="music-proof-track-list">
              {profile.tracks.map((track, index) => {
                const isPlaying = playingTrack === index;
                const isActive = activeTrack === index;
                return (
                  <div
                    key={track.source}
                    className={`music-proof-track${isPlaying ? ' is-playing' : ''}${isActive ? ' is-active' : ''}`}
                  >
                    <span className="music-proof-track-number">{String(index + 1).padStart(2, '0')}</span>
                    <button
                      type="button"
                      className="music-proof-play"
                      aria-label={isPlaying ? `შეჩერება: ${track.title}` : `ჩართვა: ${track.title}`}
                      aria-pressed={isPlaying}
                      onClick={() => void toggleTrack(index)}
                    >
                      <Ico name={isPlaying ? 'solar:pause-circle-bold-duotone' : 'solar:play-circle-bold-duotone'} />
                    </button>
                    <div className="music-proof-track-copy">
                      <strong>{track.title}</strong>
                      <small>{track.detail}</small>
                    </div>
                    <div className="music-proof-wave" aria-hidden="true">
                      {WAVE.map((height, waveIndex) => <i key={`${height}-${waveIndex}`} style={{ height: `${height}%` }} />)}
                    </div>
                  </div>
                );
              })}
            </div>
            {audioError && <p className="music-proof-error">ნიმუში ახლა ვერ ჩაირთო. სცადეთ ხელახლა.</p>}
          </div>
        </section>
      </div>

      <footer className="music-proof-footer">
        <span><Ico name="solar:shield-check-bold-duotone" />მუსიკალური პროფილი, დღის ფლეილისტი და გამოყენების პირობები</span>
        <small>დემო ნიმუშებია; პროექტის ფლეილისტს თქვენს სივრცეზე ვაწყობთ.</small>
      </footer>
    </div>
  );
}
