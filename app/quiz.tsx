"use client";

import { useState } from "react";
import { questions } from "./story-config";
import { Icon, PrimaryButton } from "./story";

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

export function QuizStage({
  questionIndex, setQuestionIndex, correctCount, setCorrectCount, onComplete,
}: {
  questionIndex: number;
  setQuestionIndex: (value: number) => void;
  correctCount: number;
  setCorrectCount: (value: number | ((current: number) => number)) => void;
  onComplete: () => void;
}) {
  const [choice, setChoice] = useState("");
  const [written, setWritten] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "wrong" | "right">("idle");
  const done = correctCount >= questions.length;
  const question = questions[Math.min(questionIndex, questions.length - 1)];

  const validate = () => {
    const answer = written.trim() || choice;
    if (!answer || feedback === "right") return;
    if (isCorrect(questionIndex, answer)) {
      setFeedback("right");
      setCorrectCount((current) => Math.max(current, questionIndex + 1));
    } else {
      setFeedback("wrong");
    }
  };

  const nextQuestion = () => {
    setQuestionIndex(questionIndex + 1);
    setChoice("");
    setWritten("");
    setFeedback("idle");
  };

  return (
    <section className="scene quiz-scene" aria-labelledby="quiz-title">
      <span className="eyebrow"><i /> LE PETIT JEU DES SOUVENIRS</span>
      <h1 className="display-title" id="quiz-title">Tu me connais <em>vraiment ?</em></h1>
      <p className="scene-lede">Une bonne réponse, un petit bout de lettre qui se dévoile. ❤️</p>

      {done ? (
        <div className="quiz-complete glass-panel">
          <span className="success-orbit"><Icon name="heart" /></span>
          <span className="eyebrow"><i /> TROIS SOUVENIRS DÉBLOQUÉS</span>
          <h2>Bravo, Princesse !</h2>
          <p>Tu as retrouvé nos petits souvenirs. Maintenant, tu peux découvrir ce que j&apos;ai préparé pour toi, avec tout mon cœur. 💌</p>
          <PrimaryButton onClick={onComplete}>Découvrir ma lettre</PrimaryButton>
        </div>
      ) : (
        <div className="quiz-card glass-panel">
          <div className="quiz-meta">
            <span>QUESTION {questionIndex + 1} <i>/</i> {questions.length}</span>
            <div className="quiz-progress" role="progressbar" aria-label="Progression du jeu" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={correctCount}>
              {questions.map((item, index) => <i className={index < correctCount ? "done" : ""} key={item.prompt} />)}
            </div>
          </div>
          <h2 className="question-text">{question.prompt}</h2>
          <div className="answer-list" role="group" aria-label="Choisis une réponse">
            {question.answers.map((answer, index) => {
              const selected = choice === answer && !written;
              return (
                <button
                  aria-pressed={selected}
                  className={`answer-option${selected ? " selected" : ""}${feedback === "right" && isCorrect(questionIndex, answer) ? " correct" : ""}`}
                  disabled={feedback === "right"}
                  key={answer}
                  onClick={() => { setChoice(answer); setWritten(""); setFeedback("idle"); }}
                  type="button"
                >
                  <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                  <span>{answer}</span>
                  {feedback === "right" && isCorrect(questionIndex, answer) && <span className="answer-check" aria-label="Bonne réponse">✓</span>}
                </button>
              );
            })}
          </div>
          <label className="write-answer">
            <span>Ou écris ta réponse</span>
            <input
              autoComplete="off"
              disabled={feedback === "right"}
              onChange={(event) => { setWritten(event.target.value); setChoice(""); setFeedback("idle"); }}
              onKeyDown={(event) => { if (event.key === "Enter") validate(); }}
              placeholder="Ta réponse…"
              value={written}
            />
          </label>
          <div className="quiz-feedback" aria-live="polite">
            {feedback === "wrong" && <p className="feedback-wrong">Hmm, pas tout à fait, mon amour… 🥹 Réfléchis encore un petit peu. <span>{question.hint}</span></p>}
            {feedback === "right" && <p className="feedback-right">Exactement ! ❤️ Tu te souviens de ces petits détails… et ce sont justement ces moments qui rendent notre histoire spéciale.</p>}
          </div>
          {feedback === "right" && questionIndex < questions.length - 1 ? (
            <PrimaryButton onClick={nextQuestion}>Question suivante</PrimaryButton>
          ) : (
            <PrimaryButton disabled={!choice && !written.trim()} onClick={validate}>Vérifier ma réponse</PrimaryButton>
          )}
        </div>
      )}
    </section>
  );
}
