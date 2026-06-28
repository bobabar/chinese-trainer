# Chinese Trainer

A browser-based Chinese training app for sentence drills and vocabulary quizzes.

## Live Site

https://brownsugarboba.com/

## Run

Open `index.html` in a browser, or run a local static server:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Checks

```sh
npm run check
npm run build
```

`npm run check` validates JavaScript syntax and the sentence corpus. `npm run build` writes the GitHub Pages artifact to `_site/`.

## GitHub Pages

This public repo deploys to GitHub Pages from the `main` branch using the workflow in `.github/workflows/deploy-pages.yml`.

Pages is configured with GitHub Actions as the build type. The workflow validates the app, builds `_site/`, uploads the Pages artifact, and deploys it.

## Features

- Global navigation between the Drill Tool and Vocabulary Quiz.
- Drill training navigation for Listening, Writing, and Reading.
- Global Beginner, Intermediate, and Advanced difficulty filters.
- 1,800 sourced sentence pairs: 600 Beginner, 600 Intermediate, and 600 Advanced.
- Sentence pairs retain source and translation IDs for Tatoeba attribution and auditing.
- Simplified Mandarin-only listening sentences with Normal, Slow, and Very slow voice speed options.
- 30-sentence sessions with immediate assessment.
- Timed vocabulary quizzes for 506 New HSK 1 words and 750 New HSK 2 words, with part, level, and combined HSK 1+2 options.
- Vocabulary quiz tables show every character and translation, then reveal pinyin when the user types a correct answer.
- End-of-session vocabulary results show every found and missed word for review.
- Listening mode uses the browser Speech Synthesis API and prefers Microsoft Online or Microsoft Natural mainland Chinese speech when available.

## Sentence Data

Sentence pairs are sourced from Tatoeba and redistributed under CC BY 2.0 FR. Each row in `sentence-data.js` includes the Tatoeba source sentence ID and translation ID.

See `NOTICE.md` for attribution details.
