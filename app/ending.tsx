"use client";

import Image from "next/image";
import { BIRTHDAY_AGE, birthdayParagraphs, PHOTO_SRC } from "./story-config";
import { Icon } from "./story";

export function BirthdayStage({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="scene birthday-scene" aria-labelledby="birthday-title">
      <div className="fireworks" aria-hidden="true"><i /><i /><i /><i /></div>
      <span className="eyebrow birthday-eyebrow"><i /> AUJOURD&apos;HUI, C&apos;EST TON JOUR</span>
      <div className="birthday-photo">
        <Image alt="Un tendre souvenir à deux" className="birthday-image" height={908} src={PHOTO_SRC} width={1080} />
        <span className="photo-tape" aria-hidden="true" />
      </div>
      <Icon name="crown" className="birthday-crown" />
      <h1 className="birthday-title" id="birthday-title">JOYEUX ANNIVERSAIRE,<em>PRINCESSE !</em></h1>
      <p className="birthday-age"><span>{BIRTHDAY_AGE}</span> ans <i>·</i> une nouvelle page s&apos;ouvre ✨</p>
      <div className="birthday-copy">
        {birthdayParagraphs.map((paragraph, index) => (
          <p key={paragraph} style={{ animationDelay: `${0.2 + index * 0.12}s` }}>{paragraph}</p>
        ))}
      </div>
      <p className="birthday-signature">Avec tout mon amour, <em>Princesse</em> <span>♥</span></p>
      <button className="replay-button" onClick={onRestart} type="button">
        <Icon name="refresh" /> Revoir notre histoire
      </button>
    </section>
  );
}
