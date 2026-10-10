<<<<<<< HEAD
"use client";

import { useEffect, useRef, useState } from "react";
import { BirthdayStage } from "./ending";
import { FinalNoteStage } from "./letter";
import { LetterQuizStage } from "./letter-quiz";
import { AUDIO_SRC, questions, steps, type Screen } from "./story-config";
import { CounterStage, Icon, IntroStage, StarField, VideoStage } from "./story";

type SavedProgress = {
  screen: Screen;
  correct: number;
};

type AmbientAudio = {
  context: AudioContext;
  master: GainNode;
  oscillators: OscillatorNode[];
  noteTimer: number;
};

function restoreProgress(): SavedProgress | null {
  try {
    const raw = window.sessionStorage.getItem("princesse-story-progress-v2");
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<SavedProgress>;
    if (
      !Number.isInteger(data.screen) ||
      !Number.isInteger(data.correct)
    ) return null;

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
  const [audioVolume, setAudioVolume] = useState(40);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ambientRef = useRef<AmbientAudio | null>(null);

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

  const toggleAudio = async () => {
    if (audioOn) {
      if (AUDIO_SRC) {
        audioRef.current?.pause();
      } else if (ambientRef.current) {
        await ambientRef.current.context.suspend();
      }
      setAudioOn(false);
      return;
    }

    try {
      if (AUDIO_SRC) {
        if (!audioRef.current) throw new Error("Le fichier audio configuré est absent.");
        audioRef.current.volume = audioVolume / 100;
        await audioRef.current.play();
      } else {
        let ambient = ambientRef.current;
        if (!ambient) {
          const context = new AudioContext();
          const master = context.createGain();
          master.gain.value = (audioVolume / 100) * 0.045;
          master.connect(context.destination);
          const oscillators: OscillatorNode[] = [];
          for (const frequency of [130.81, 164.81, 196]) {
            const oscillator = context.createOscillator();
            const voice = context.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            voice.gain.value = 0.2;
            oscillator.connect(voice);
            voice.connect(master);
            oscillator.start();
            oscillators.push(oscillator);
          }
          const notes = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33];
          let noteIndex = 0;
          const noteTimer = window.setInterval(() => {
            const oscillator = context.createOscillator();
            const voice = context.createGain();
            const now = context.currentTime;
            oscillator.type = "sine";
            oscillator.frequency.value = notes[noteIndex % notes.length];
            noteIndex += 1;
            voice.gain.setValueAtTime(0.0001, now);
            voice.gain.exponentialRampToValueAtTime(0.12, now + 0.18);
            voice.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
            oscillator.connect(voice);
            voice.connect(master);
            oscillator.start(now);
            oscillator.stop(now + 2.5);
          }, 3_200);
          ambient = { context, master, oscillators, noteTimer };
          ambientRef.current = ambient;
        }
        await ambient.context.resume();
      }
      setAudioOn(true);
    } catch (error) {
      console.error("La musique n'a pas pu être démarrée.", error);
      setAudioOn(false);
    }
  };

  const setVolume = (value: number) => {
    setAudioVolume(value);
    if (AUDIO_SRC && audioRef.current) {
      audioRef.current.volume = value / 100;
    } else if (ambientRef.current) {
      ambientRef.current.master.gain.setTargetAtTime(
        (value / 100) * 0.045,
        ambientRef.current.context.currentTime,
        0.25,
      );
    }
  };

  const pauseBackground = () => {
    if (!audioOn) return false;
    if (AUDIO_SRC) audioRef.current?.pause();
    else if (ambientRef.current) void ambientRef.current.context.suspend();
    setAudioOn(false);
    return true;
  };

  const resumeBackground = async () => {
    try {
      if (AUDIO_SRC) await audioRef.current?.play();
      else if (ambientRef.current) await ambientRef.current.context.resume();
      setAudioOn(true);
    } catch (error) {
      console.error("La musique n'a pas pu reprendre après la vidéo.", error);
      setAudioOn(false);
    }
  };

  const restart = () => {
    try {
      window.sessionStorage.removeItem("princesse-story-progress-v2");
    } catch (error) {
      console.error("Impossible d'effacer la progression sauvegardée.", error);
    }
    setScreen(0);
    setCorrect(0);
    setAudioOn(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (ambientRef.current) {
      window.clearInterval(ambientRef.current.noteTimer);
      ambientRef.current.oscillators.forEach((oscillator) => oscillator.stop());
      void ambientRef.current.context.close();
      ambientRef.current = null;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startStory = () => {
    navigate(1);
    if (!audioOn) void toggleAudio();
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
        <div className="audio-area">
          <button className={`audio-toggle${audioOn ? " active" : ""}`} aria-label={audioOn ? "Couper la musique" : "Activer la musique"} aria-pressed={audioOn} onClick={() => void toggleAudio()} type="button">
            <Icon name={audioOn ? "volume" : "music"} /><span>{audioOn ? "Ambiance douce" : "Musique"}</span>
          </button>
          <label className="volume-control">
            <span className="sr-only">Volume</span>
            <input aria-label="Volume de la musique" max="100" min="0" onChange={(event) => setVolume(Number(event.target.value))} type="range" value={audioVolume} />
          </label>
        </div>
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
=======
"use client";

import { useEffect, useRef, useState } from "react";
import { BirthdayStage } from "./ending";
import { FinalNoteStage } from "./letter";
import { LetterQuizStage } from "./letter-quiz";
import { AUDIO_SRC, questions, steps, type Screen } from "./story-config";
import { CounterStage, Icon, IntroStage, StarField, VideoStage } from "./story";

type SavedProgress = {
  screen: Screen;
  correct: number;
};

type AmbientAudio = {
  context: AudioContext;
  master: GainNode;
  oscillators: OscillatorNode[];
  noteTimer: number;
};

function restoreProgress(): SavedProgress | null {
  try {
    const raw = window.sessionStorage.getItem("princesse-story-progress-v2");
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<SavedProgress>;
    if (
      !Number.isInteger(data.screen) ||
      !Number.isInteger(data.correct)
    ) return null;

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
  const [audioVolume, setAudioVolume] = useState(40);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ambientRef = useRef<AmbientAudio | null>(null);

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

  const toggleAudio = async () => {
    if (audioOn) {
      if (AUDIO_SRC) {
        audioRef.current?.pause();
      } else if (ambientRef.current) {
        await ambientRef.current.context.suspend();
      }
      setAudioOn(false);
      return;
    }

    try {
      if (AUDIO_SRC) {
        if (!audioRef.current) throw new Error("Le fichier audio configuré est absent.");
        audioRef.current.volume = audioVolume / 100;
        await audioRef.current.play();
      } else {
        let ambient = ambientRef.current;
        if (!ambient) {
          const context = new AudioContext();
          const master = context.createGain();
          master.gain.value = (audioVolume / 100) * 0.045;
          master.connect(context.destination);
          const oscillators: OscillatorNode[] = [];
          for (const frequency of [130.81, 164.81, 196]) {
            const oscillator = context.createOscillator();
            const voice = context.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            voice.gain.value = 0.2;
            oscillator.connect(voice);
            voice.connect(master);
            oscillator.start();
            oscillators.push(oscillator);
          }
          const notes = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33];
          let noteIndex = 0;
          const noteTimer = window.setInterval(() => {
            const oscillator = context.createOscillator();
            const voice = context.createGain();
            const now = context.currentTime;
            oscillator.type = "sine";
            oscillator.frequency.value = notes[noteIndex % notes.length];
            noteIndex += 1;
            voice.gain.setValueAtTime(0.0001, now);
            voice.gain.exponentialRampToValueAtTime(0.12, now + 0.18);
            voice.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
            oscillator.connect(voice);
            voice.connect(master);
            oscillator.start(now);
            oscillator.stop(now + 2.5);
          }, 3_200);
          ambient = { context, master, oscillators, noteTimer };
          ambientRef.current = ambient;
        }
        await ambient.context.resume();
      }
      setAudioOn(true);
    } catch (error) {
      console.error("La musique n'a pas pu être démarrée.", error);
      setAudioOn(false);
    }
  };

  const setVolume = (value: number) => {
    setAudioVolume(value);
    if (AUDIO_SRC && audioRef.current) {
      audioRef.current.volume = value / 100;
    } else if (ambientRef.current) {
      ambientRef.current.master.gain.setTargetAtTime(
        (value / 100) * 0.045,
        ambientRef.current.context.currentTime,
        0.25,
      );
    }
  };

  const pauseBackground = () => {
    if (!audioOn) return false;
    if (AUDIO_SRC) audioRef.current?.pause();
    else if (ambientRef.current) void ambientRef.current.context.suspend();
    setAudioOn(false);
    return true;
  };

  const resumeBackground = async () => {
    try {
      if (AUDIO_SRC) await audioRef.current?.play();
      else if (ambientRef.current) await ambientRef.current.context.resume();
      setAudioOn(true);
    } catch (error) {
      console.error("La musique n'a pas pu reprendre après la vidéo.", error);
      setAudioOn(false);
    }
  };

  const restart = () => {
    try {
      window.sessionStorage.removeItem("princesse-story-progress-v2");
    } catch (error) {
      console.error("Impossible d'effacer la progression sauvegardée.", error);
    }
    setScreen(0);
    setCorrect(0);
    setAudioOn(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (ambientRef.current) {
      window.clearInterval(ambientRef.current.noteTimer);
      ambientRef.current.oscillators.forEach((oscillator) => oscillator.stop());
      void ambientRef.current.context.close();
      ambientRef.current = null;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startStory = () => {
    navigate(1);
    if (!audioOn) void toggleAudio();
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
        <div className="audio-area">
          <button className={`audio-toggle${audioOn ? " active" : ""}`} aria-label={audioOn ? "Couper la musique" : "Activer la musique"} aria-pressed={audioOn} onClick={() => void toggleAudio()} type="button">
            <Icon name={audioOn ? "volume" : "music"} /><span>{audioOn ? "Ambiance douce" : "Musique"}</span>
          </button>
          <label className="volume-control">
            <span className="sr-only">Volume</span>
            <input aria-label="Volume de la musique" max="100" min="0" onChange={(event) => setVolume(Number(event.target.value))} type="range" value={audioVolume} />
          </label>
        </div>
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
>>>>>>> a18a748 (Set birthday soundtrack to Heat Waves at 40% volume)
