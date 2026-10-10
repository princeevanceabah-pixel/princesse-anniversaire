"use client";

import { useCallback, useState } from "react";
import { finalMessage, letterSignature } from "./story-config";
import { PrimaryButton } from "./story";
import { Typewriter } from "./letter-quiz";

export function FinalNoteStage({ onFinish }: { onFinish: () => void }) {
  const [complete, setComplete] = useState(false);
  const handleComplete = useCallback(() => setComplete(true), []);

  return (
    <section className="scene letter-scene" aria-labelledby="last-note-title">
      <span className="eyebrow"><i /> LE DERNIER MOT, RIEN QU&apos;À TOI</span>
      <h1 className="display-title" id="last-note-title">Juste pour <em>toi</em> 💌</h1>
      <article className="letter-paper final-note-paper">
        <span className="letter-flower flower-top" aria-hidden="true">🌹</span>
        <div className="letter-inner">
          <span className="letter-label">le dernier message</span>
          <h2 className="letter-greeting">Ma Princesse,</h2>
          <Typewriter text={`${finalMessage}\n\n${letterSignature}`} onComplete={handleComplete} />
          <div className="letter-signature">
            <span>avec tout mon amour</span><strong>♥</strong>
          </div>
        </div>
        <span className="letter-flower flower-bottom" aria-hidden="true">💗</span>
      </article>
      <div className="letter-action">
        {complete && <PrimaryButton onClick={onFinish}>Découvrir la révélation finale</PrimaryButton>}
      </div>
    </section>
  );
}
