"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PHOTO_SRC, START_DATE, VIDEO_SRC } from "./story-config";

export type IconName = "arrow" | "back" | "crown" | "heart" | "music" | "play" | "refresh" | "spark" | "volume";

const paths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  back: <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
  crown: <><path d="m2 8 5 4 5-7 5 7 5-4-2 12H4L2 8Z" /><path d="M6 16h12" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1 7.8 7.8 7.8-7.8 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />,
  music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
  play: <path d="m8 5 12 7-12 7V5Z" />,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.5-2L20 12M4 12l2.9 5a7 7 0 0 0 11.5-2" /></>,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.1L22 17l-1.8.9L19 20l-1.1-2.1L16 17l1.9-.9L19 14ZM5 3l.8 1.7 1.7.8-1.7.8L5 8l-.8-1.7-1.7-.8 1.7-.8L5 3Z" /></>,
  volume: <><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></>,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export function StarField() {
  return (
    <div className="star-field" aria-hidden="true">
      {Array.from({ length: 34 }, (_, i) => (
        <i className="star-dot" key={i} style={{
          "--left": `${(i * 47 + 7) % 100}%`,
          "--top": `${(i * 67 + 9) % 100}%`,
          "--delay": `${(i % 8) * -0.7}s`,
        } as CSSProperties} />
      ))}
      <span className="ambient-orb ambient-orb-one" />
      <span className="ambient-orb ambient-orb-two" />
      <div className="floating-emojis">
        <span>💗</span><span>✨</span><span>🌹</span><span>💫</span><span>💕</span>
      </div>
    </div>
  );
}

export function PrimaryButton({
  children, onClick, disabled = false,
}: {
  children: ReactNode; onClick: () => void; disabled?: boolean;
}) {
  return (
    <button className="primary-button" disabled={disabled} onClick={onClick} type="button">
      <span>{children}</span><Icon name="arrow" className="button-icon" />
    </button>
  );
}

export function IntroStage({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="scene intro-scene" aria-labelledby="intro-title">
      <div className="intro-copy">
        <span className="eyebrow"><i /> UNE PETITE SURPRISE, RIEN QUE POUR TOI</span>
        <h1 className="hero-title" id="intro-title">Coucou,<br /><em>Princesse</em><span className="hero-heart">♥</span></h1>
        <p className="intro-lede">J&apos;ai préparé quelque chose de spécial pour toi.</p>
        <p className="intro-body">Aujourd&apos;hui, je ne veux pas simplement te souhaiter quelque chose. J&apos;aimerais t&apos;emmener dans une petite histoire, une histoire qui compte beaucoup pour moi.</p>
        <p className="intro-body">Alors, installe-toi confortablement, prends quelques minutes pour toi et laisse-moi te montrer ce que j&apos;ai préparé… Cette petite surprise est rien que pour toi. <span className="pink-text">♥</span></p>
        <PrimaryButton onClick={onContinue}>Découvrir ma surprise ✨</PrimaryButton>
        <div className="quiet-note"><Icon name="heart" /> Fais défiler cette histoire à ton rythme</div>
      </div>
      <figure className="memory-frame">
        <Image
          alt=""
          aria-hidden="true"
          className="photo-orbit-art"
          height={180}
          src="/media/illustrations/heart-orbit.svg"
          width={220}
        />
        <div className="memory-image-wrap">
          <Image alt="Un souvenir précieux à deux" className="memory-image" height={908} priority src={PHOTO_SRC} width={1080} />
          <span className="photo-heart photo-heart-one">♥</span>
        </div>
        <figcaption>un souvenir <Icon name="heart" /></figcaption>
      </figure>
    </section>
  );
}

export function CounterStage({ onContinue }: { onContinue: () => void }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const validDate = Number.isFinite(START_DATE.getTime());
  const elapsed = now === null || !validDate ? 0 : now - START_DATE.getTime();
  const seconds = Math.max(0, Math.floor(elapsed / 1000));
  const values = [
    ["Jours", Math.floor(seconds / 86_400)],
    ["Heures", Math.floor((seconds % 86_400) / 3600)],
    ["Minutes", Math.floor((seconds % 3600) / 60)],
    ["Secondes", seconds % 60],
  ] as const;

  return (
    <section className="scene counter-scene" aria-labelledby="counter-title">
      <div className="counter-lake" aria-hidden="true">
        <Image alt="" height={250} src="/media/illustrations/moon-lake.svg" width={360} />
      </div>
      <span className="eyebrow"><i /> UN PETIT RETOUR DANS LE TEMPS</span>
      <h1 className="display-title" id="counter-title">Depuis le <em>18 juillet 2026…</em></h1>
      <p className="scene-lede">Tu es dans ma vie et tout est plus beau.</p>
      <div className="counter-panel" aria-label="Temps écoulé depuis le 18 juillet 2026">
        {!validDate || (now !== null && elapsed < 0) ? (
          <p className="counter-message">{!validDate ? "La date de départ doit être vérifiée." : "Notre histoire commence bientôt…"}</p>
        ) : now === null ? (
          <p className="counter-message">Un instant…</p>
        ) : values.map(([label, value]) => (
          <div className="counter-unit" key={label}>
            <strong>{String(value).padStart(2, "0")}</strong><span>{label}</span>
          </div>
        ))}
      </div>
      <p className="counter-copy">Chaque seconde est un cadeau. Depuis ce jour, le temps continue d&apos;avancer vers de nouveaux souvenirs, de nouveaux sourires et toutes ces petites choses qui rendent une histoire unique. ❤️</p>
      <PrimaryButton onClick={onContinue}>Revivre nos souvenirs</PrimaryButton>
    </section>
  );
}

export function VideoStage({
  onContinue, pauseBackground, resumeBackground,
}: {
  onContinue: () => void;
  pauseBackground: () => boolean;
  resumeBackground: () => Promise<void>;
}) {
  const [videoError, setVideoError] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const resumeMusic = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (!resumeMusic.current) resumeMusic.current = pauseBackground();
  };

  const handleEnd = () => {
    setVideoFinished(true);
    if (resumeMusic.current) {
      resumeMusic.current = false;
      void resumeBackground();
    }
  };

  const continueStory = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    if (resumeMusic.current) {
      resumeMusic.current = false;
      void resumeBackground();
    }
    onContinue();
  };

  return (
    <section className="scene film-scene" aria-labelledby="film-title">
      <span className="eyebrow"><i /> NOTRE PETIT CINÉMA</span>
      <h1 className="display-title" id="film-title">Un instant <em>à nous</em></h1>
      <p className="scene-lede film-lede">Certains souvenirs sont trop précieux pour rester simplement dans nos téléphones… Alors, j&apos;ai rassemblé quelques instants que j&apos;avais envie de partager avec toi. <span className="pink-text">♥</span></p>
      <div className="cinema-frame">
        {videoError ? (
          <div className="video-fallback" role="status">
            <Icon name="play" className="fallback-play" />
            <p>La vidéo n&apos;a pas pu être chargée.</p>
            <small>Vérifie le fichier <code>public/media/videos/notre-histoire.mp4</code>.</small>
          </div>
        ) : (
          <video className="memory-video" aria-label="Notre montage vidéo" controls playsInline preload="metadata" poster={PHOTO_SRC} ref={videoRef} onEnded={handleEnd} onError={() => setVideoError(true)} onPlay={handlePlay}>
            <source src={VIDEO_SRC} type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture de cette vidéo.
          </video>
        )}
      </div>
      <div className="film-ending" aria-live="polite">
        <p>{videoFinished ? <>Ce n&apos;est qu&apos;une petite partie de notre histoire… mais chaque souvenir compte.<br /><span>Et maintenant, j&apos;ai quelque chose à te dire. 💌</span></> : videoError ? "Le souvenir reste là, et notre histoire continue." : "Prends tout ton temps…"}</p>
      </div>
      <PrimaryButton onClick={continueStory}>{videoFinished ? "Ouvrir ma lettre secrète" : "Continuer"}</PrimaryButton>
    </section>
  );
}
