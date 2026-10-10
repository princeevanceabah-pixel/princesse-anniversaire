export const START_DATE = new Date(2026, 6, 18);
export const PHOTO_SRC = "/media/images/notre-photo.jpg";
export const VIDEO_SRC = "/media/videos/notre-histoire.mp4";
export const AUDIO_SRC = "/media/audio/heat-waves.mp3";
export const AUTO_PLAY_MESSAGE = "";
export const BIRTHDAY_AGE = 18;

export const steps = [
  "La surprise",
  "Le temps",
  "Le film",
  "La lettre-jeu",
  "Le dernier mot",
  "Joyeux anniversaire",
] as const;

export const questions = [
  {
    prompt: "Où avons-nous eu notre premier rendez-vous ?",
    answers: ["Au bord de la mer", "Dans un parc", "Le Raphaelo, un snack", "À la maison"],
    correct: "Le Raphaelo, un snack",
    hint: "Pense au lieu où l'on s'est retrouvés pour manger.",
  },
  {
    prompt: "Quelle est ma nourriture préférée ?",
    answers: ["Le riz", "Eru", "Les pâtes", "Le poulet"],
    correct: "Eru",
    hint: "Pense à ce que j'aime retrouver à table.",
  },
  {
    prompt: "Quel est mon sport préféré ?",
    answers: ["Le football", "Le basketball", "Le tennis", "La natation"],
    correct: "Basketball",
    hint: "C'est un sport collectif qui se joue avec un ballon.",
  },
] as const;

export const letterParagraphs = [
  {
    title: "💗 Paragraphe 1 — Tu es spéciale",
    body: `Mon amour, ma Princesse,

Je ne sais pas si les mots suffiront à te montrer tout ce que tu représentes pour moi, mais aujourd'hui, j'ai envie d'essayer.

Depuis le 18 juillet 2026, tu fais partie de mon histoire, de mes souvenirs et de ces petits moments qui rendent la vie plus belle. Si je pouvais te permettre de te voir à travers mes yeux, tu comprendrais peut-être pourquoi ton sourire est si précieux pour moi.

Tu n'as pas besoin d'être parfaite pour être merveilleuse. Tu as simplement besoin d'être toi. ❤️`,
  },
  {
    title: "🌹 Paragraphe 2 — Notre histoire",
    body: `Je repense à notre première rencontre, à notre premier rendez-vous et à tous ces petits instants qui ont commencé à écrire notre histoire. Ce sont peut-être des souvenirs simples, mais ils ont une place particulière dans mon cœur parce que je les partage avec toi.

Je ne te promets pas une histoire parfaite, mais j'espère que nous continuerons à rire, à nous découvrir et à construire de beaux souvenirs ensemble.

Merci d'être toi, avec ta douceur, ton sourire et cette petite chose qui te rend unique à mes yeux.

Parfois, les plus beaux cadeaux de la vie ne sont pas des objets, mais des personnes qui rendent nos journées plus belles. 💗`,
  },
  {
    title: "🥹 Paragraphe 3 — Mon vœu pour toi",
    body: `Pour ton anniversaire, je te souhaite bien plus que des cadeaux et des bougies. Je te souhaite la santé, la paix du cœur, la réussite et le courage de réaliser tous tes rêves.

J'espère que la vie t'offrira mille raisons de sourire, même dans les moments difficiles, et que tu n'oublieras jamais à quel point tu es précieuse.

Je ne sais pas tout ce que l'avenir nous réserve, mais je souhaite que nous continuions à écrire notre histoire avec sincérité, tendresse et bonheur.

Joyeux anniversaire, ma Princesse. Que cette nouvelle année de ta vie soit aussi belle que les rêves que tu portes en toi. 🎂❤️`,
  },
] as const;

export const finalMessage = `Si tu ne devais retenir qu'une seule chose de cette lettre, retiens ceci : tu comptes pour moi, et je suis heureux de pouvoir partager une partie de mon histoire avec toi.

J'espère que cette petite surprise t'aura donné le sourire, quelques frissons, et peut-être même une petite larme de bonheur.

Aujourd'hui, c'est ton jour, mon amour. Profite de chaque instant, souris autant que possible et n'oublie jamais que tu mérites de belles choses.

Joyeux anniversaire, Princesse ! ❤️🎂`;

export const letterSignature = `Avec toute ma tendresse,
Ton Prince, qui est heureux de pouvoir t'appeler sa Princesse. 💗`;

export const birthdayParagraphs = [
  "Aujourd'hui, c'est ton jour.",
  "Je te souhaite une vie remplie de bonheur, de douceur, de beaux moments et de rêves qui deviennent réalité.",
  "Merci d'être toi, avec tout ce qui fait de toi une personne unique.",
  "Que cette nouvelle année de ta vie t'apporte des sourires sincères, de belles surprises et mille raisons d'être heureuse.",
  "Joyeux anniversaire, Princesse. ❤️",
] as const;

export type Screen = 0 | 1 | 2 | 3 | 4 | 5;
