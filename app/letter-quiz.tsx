"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import { letterParagraphs, questions } from "./story-config";
import { Icon, PrimaryButton } from "./story";

export function Typewriter({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= text.length) { onComplete(); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => setShown((current) => Math.min(current + 1, text.length)),
      reduced ? 1 : 18,
    );
    return () => window.clearTimeout(timer);
  }, [shown, text.length, onComplete]);

  return (
    <>
      <p className="typewriter-copy" aria-live="off">
        {text.slice(0, shown)}
        {shown < text.length && <span className="typing-cursor" aria-hidden="true" />}
      </p>
      {shown < text.length && (
        <button className="skip-writing" onClick={() => setShown(text.length)} type="button">
          Afficher le texte
        </button>
      )}
    </>
  );
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[’']/g, " ").replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ").trim();
}

function isCorrect(index: number, value: string) {
  const answer = normalize(value);
  if (index === 0) {
    return (answer.includes("raphaelo") && answer.includes("snack")) ||
      answer === "raphaelo" || answer === "le raphaelo";
  }
  if (index === 1) return /^(?:(?:le|la|l)\s+)?eru$/.test(answer);
  return /^(?:(?:le|la|mon)\s+)?basketball$/.test(answer);
}

function Checkpoint({
  index, onUnlock,
}: { index: number; onUnlock: () => void }) {
  const [choice, setChoice] = useState("");
  const [written, setWritten] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "right">("idle");
  const question = questions[index];
  const check = () => {
    const answer = written.trim() || choice;
    if (!answer || feedback === "right") return;
    setFeedback(isCorrect(index, answer) ? "right" : "wrong");
  };

  return (
    <div className="checkpoint glass-panel">
      <div className="checkpoint-title"><Icon name="spark" /><span>UNE PETITE QUESTION AVANT LA SUITE</span></div>
      <div className="checkpoint-progress" aria-label={`Question ${index + 1} sur 3`}>
        {questions.map((item, i) => <i className={i <= index ? "active" : ""} key={item.prompt} />)}
      </div>
      <h2>{question.prompt}</h2>
      <div className="answer-list" role="group" aria-label="Choisis une réponse">
        {question.answers.map((answer, i) => (
          <button
            aria-pressed={choice === answer}
            className={`answer-option${choice === answer && !written ? " selected" : ""}`}
            disabled={feedback === "right"}
            key={answer}
            onClick={() => { setChoice(answer); setWritten(""); setFeedback("idle"); }}
            type="button"
          >
            <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
            <span>{answer}</span>
          </button>
        ))}
      </div>
      <label className="write-answer">
        <span>Ou écris ta réponse</span>
        <input
          autoComplete="off"
          disabled={feedback === "right"}
          onChange={(event) => { setWritten(event.target.value); setChoice(""); setFeedback("idle"); }}
          onKeyDown={(event) => { if (event.key === "Enter") check(); }}
          placeholder="Ta réponse…"
          value={written}
        />
      </label>
      <div className="quiz-feedback" aria-live="polite">
        {feedback === "wrong" && <p className="feedback-wrong">Hmm, pas tout à fait, mon amour… 🥹 Réfléchis encore un petit peu. <span>{question.hint}</span></p>}
        {feedback === "right" && <p className="feedback-right">Exactement ! ❤️ Tu te souviens de ces petits détails…</p>}
      </div>
      {feedback === "right" ? (
        <PrimaryButton onClick={onUnlock}>Dévoiler la suite</PrimaryButton>
      ) : (
        <PrimaryButton disabled={!choice && !written.trim()} onClick={check}>Vérifier ma réponse</PrimaryButton>
      )}
    </div>
  );
}

export function LetterQuizStage({
  correctCount, setCorrectCount, onComplete,
}: {
  correctCount: number;
  setCorrectCount: Dispatch<SetStateAction<number>>;
  onComplete: () => void;
}) {
  const [typedParagraph, setTypedParagraph] = useState(-1);
  const handleTypingDone = useCallback(() => setTypedParagraph(correctCount), [correctCount]);
  const complete = correctCount >= letterParagraphs.length;
  const current = letterParagraphs[correctCount];

  return (
    <section className="scene letter-scene" aria-labelledby="letter-title">
      <span className="eyebrow"><i /> LA LETTRE SE DÉVOILE, UN MOT À LA FOIS</span>
      <h1 className="display-title" id="letter-title">💌 À ma <em>Princesse</em> ❤️</h1>
      <article className="letter-paper interactive-paper">
        <Image alt="" aria-hidden="true" className="letter-bouquet" height={260} src="/media/illustrations/rose-bouquet.svg" width={220} />
        <span className="letter-flower flower-top" aria-hidden="true">🌹</span>
        <div className="letter-inner">
          <span className="letter-label">écrit avec tout mon cœur</span>
          {letterParagraphs.slice(0, correctCount).map((paragraph) => (
            <section className="letter-section" key={paragraph.title}>
              <h3>{paragraph.title}</h3>
              <p className="letter-complete-copy">{paragraph.body}</p>
            </section>
          ))}
          {!complete && current && (
            <section className="letter-section current-letter-section">
              <h3>{current.title}</h3>
              {typedParagraph === correctCount ? (
                <>
                  <p className="letter-complete-copy">{current.body}</p>
                  <Checkpoint
                    index={correctCount}
                    key={`question-${correctCount}`}
                    onUnlock={() => setCorrectCount((value) => Math.min(value + 1, questions.length))}
                  />
                </>
              ) : (
                <Typewriter key={`paragraph-${correctCount}`} text={current.body} onComplete={handleTypingDone} />
              )}
            </section>
          )}
          {complete && (
            <div className="letter-unlocked">
              <span>✨ TOUTE LA LETTRE EST À TOI ✨</span>
              <PrimaryButton onClick={onComplete}>Lire le dernier mot</PrimaryButton>
            </div>
          )}
        </div>
        <span className="letter-flower flower-bottom" aria-hidden="true">💗</span>
      </article>
    </section>
  );
}
