"use client";

import { useEffect, useRef, useState } from "react";
import { BirthdayStage } from "./ending";
import { FinalNoteStage } from "./letter";
import { LetterQuizStage } from "./letter-quiz";
import { AUDIO_SRC, AUTO_PLAY_MESSAGE, questions, steps, type Screen } from "./story-config";
import { CounterStage, Icon, IntroStage, StarField, VideoStage } from "./story";

type SavedProgress = {
  screen: Screen;
  correct: number;
};

function restoreProgress(): SavedProgress | null {
  try {
    const raw = window.sessionStorage.getItem("princesse-story-progress-v2");
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<SavedProgress>;
    if (!Number.isInteger(data.screen) || !Number.isInteger(data.correct)) return null;

    const correct = Math.min(Math.max(data.correct ?? 0, 0), questions.length);
    let screen = Math.min(Math.max(data.screen ?? 0, 0), 5) as Screen;
    if (screen >= 4 && correct < questions.length) screen = 3;
    return { screen, correct };
  } catch {
    return null;
  }
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>(0);
  const [correct, setCorrect] = useState(0);
  const [ready, setReady] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const playAutoVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(AUTO_PLAY_MESSAGE);
    utterance.lang = "fr-FR";
    utterance.rate = 0.9;
    utterance.pitch = 1.15;
    utterance.volume = 1;
    voiceRef.current = utterance;
    synth.speak(utterance);
    setAudioOn(true);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = restoreProgress();
      if (saved) {
        setScreen(saved.screen);
        setCorrect(saved.correct);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (AUDIO_SRC) {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.4;
        audio.loop = true;
        audio.muted = false;
        void audio.play().catch(() => setAudioOn(false));
      }
      setAudioOn(true);
      return;
    }

    playAutoVoice();
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(
        "princesse-story-progress-v2",
        JSON.stringify({ screen, correct } satisfies SavedProgress),
      );
    } catch (error) {
      console.error("Impossible de sauvegarder la progression dans cet onglet.", error);
    }
  }, [ready, screen, correct]);

  const navigate = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pauseBackground = () => {
    if (typeof window === "undefined") return false;
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    setAudioOn(false);
    return true;
  };

  const resumeBackground = async () => {
    if (typeof window === "undefined") return;
    if (window.speechSynthesis && voiceRef.current) {
      window.speechSynthesis.resume();
      setAudioOn(true);
    }
  };

  const restart = () => {
    try {
      window.sessionStorage.removeItem("princesse-story-progress-v2");
    } catch (error) {
      console.error("Impossible d'effacer la progression sauvegardée.", error);
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setScreen(0);
    setCorrect(0);
    setAudioOn(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startStory = () => {
    navigate(1);
    if (!audioOn) playAutoVoice();
  };

  if (!ready) {
    return <main className="experience loading-experience"><StarField /><div className="loading-mark"><Icon name="heart" /></div></main>;
  }

  return (
    <main className={`experience stage-${screen}`}>
      <StarField />
      {AUDIO_SRC && <audio loop preload="none" ref={audioRef} src={AUDIO_SRC} onError={() => setAudioOn(false)} />}

      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark"><Icon name="crown" /></span>
          <span className="brand-name">notre histoire<span>♥</span></span>
        </div>
        {screen !== 5 && (
          <div className="step-indicator" aria-label={`Étape ${screen + 1} sur ${steps.length}`}>
            <span>{String(screen + 1).padStart(2, "0")}</span><i /><span>{String(steps.length).padStart(2, "0")}</span>
          </div>
        )}
      </header>

      {screen !== 5 && (
        <nav className="journey-progress" aria-label="Progression de l'histoire">
          {steps.map((label, index) => (
            <span className={`journey-step${index <= screen ? " reached" : ""}${index === screen ? " current" : ""}`} key={label} aria-current={index === screen ? "step" : undefined} title={label}>
              <i /><span>{label}</span>
            </span>
          ))}
        </nav>
      )}

      <div className={`screen-transition screen-${screen}`} key={screen}>
        {screen === 0 && <IntroStage onContinue={startStory} />}
        {screen === 1 && <CounterStage onContinue={() => navigate(2)} />}
        {screen === 2 && <VideoStage pauseBackground={pauseBackground} resumeBackground={resumeBackground} onContinue={() => navigate(3)} />}
        {screen === 3 && <LetterQuizStage correctCount={correct} setCorrectCount={setCorrect} onComplete={() => navigate(4)} />}
        {screen === 4 && <FinalNoteStage onFinish={() => navigate(5)} />}
        {screen === 5 && <BirthdayStage onRestart={restart} />}
      </div>

      {screen > 0 && screen < 5 && (
        <button className="back-link" onClick={() => navigate((screen - 1) as Screen)} type="button">
          <Icon name="back" /> Retour
        </button>
      )}
      <footer className={`site-footer${screen === 5 ? " footer-birthday" : ""}`}>
        <span>Fait avec</span><Icon name="heart" /><span>pour toi, Princesse</span><i>·</i><Icon name="spark" />
      </footer>
    </main>
  );
}
