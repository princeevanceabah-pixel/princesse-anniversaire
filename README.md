# Pour toi, Princesse

Une expérience romantique interactive en français, réalisée avec Next.js et
TypeScript : introduction, compteur, vidéo, lettre qui s'écrit, questions
intercalées, dernier mot et message d'anniversaire.

## Lancer le projet

```bash
npm run dev
```

Ouvre ensuite [http://localhost:3000](http://localhost:3000).

## Médias et personnalisation

- Vidéo : `public/media/videos/notre-histoire.mp4`
- Photo : `public/media/images/notre-photo.jpg`
- Illustrations SVG originales : `public/media/illustrations/`.
- Audio sous licence : dépose le fichier dans `public/media/audio/`, puis indique
  son chemin dans `AUDIO_SRC` de `app/story-config.ts`. Sans fichier, une
  ambiance musicale originale est synthétisée localement après le premier clic.

La date, l'âge, les réponses et les textes sont centralisés dans `app/story-config.ts`.
Les réponses attendues sont Le Raphaelo, Eru et Basketball. Le texte s'écrit
progressivement puis s'interrompt avant chaque question. La progression est
gardée dans l'onglet courant ; « Revoir notre histoire » la réinitialise.

Le morceau joint « Heat Waves » n'est pas copié dans le site : sa diffusion
publique nécessite les droits adaptés. Le contrôleur audio peut lire un fichier
que tu es autorisé à publier.

## Vérifier et construire

```bash
npm run lint
npm run build
npm run start
```

Sur téléphone, teste la lecture vidéo, les réponses justes et fausses, les trois
paragraphes, le retour et le redémarrage.

## Vercel

Pousse le projet sur GitHub, importe le dépôt depuis **Add New → Project** sur
Vercel, conserve la configuration Next.js détectée et déploie. Teste le lien
fourni sur ordinateur et téléphone. Aucun déploiement n'a été effectué ici.
