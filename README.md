# Chinese Trainer

A browser-based Chinese learning app with adaptive vocabulary review, pronunciation feedback, sentence drills, geography practice, and vocabulary quizzes.

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

- Today turns saved progress into a three-session daily plan, recommends the next activity, and shows a seven-day practice streak and learning snapshot.
- Learning Progress turns browser history into a 28-day activity view, skill accuracy, personalized focus areas, recurring vocabulary misses, and expandable session review.
- The vocabulary word library searches all 1,256 HSK 1 and HSK 2 words by characters, tone-optional pinyin, or English; saved words feed directly into adaptive review.
- The HSK Vocabulary Path organizes the complete corpus by level and part, tracks New, Due, Learning, and Strong words, and launches focused part reviews or matching timed quizzes.
- Word Study keeps learners in context with review status, audio, dictionary notes, exact-match example sentences, pinyin, Tatoeba attribution, and the existing MDBG link.
- Daily Review builds a spaced vocabulary queue from quiz and review outcomes, with 1, 3, 7, 14, 30, and 60-day intervals.
- Review sessions mix character-to-pinyin recall with audio-to-meaning choices and support keyboard controls.
- Global navigation between Today, Vocabulary Quiz, Daily Review, Pronunciation, Geography of China, Sentence Drills, and History.
- Sentence drill navigation for Reading, Writing, and Listening.
- Global Beginner, Intermediate, and Advanced difficulty filters.
- 1,800 sourced sentence pairs: 600 Beginner, 600 Intermediate, and 600 Advanced.
- Sentence pairs retain source and translation IDs for Tatoeba attribution and auditing.
- Simplified Mandarin-only listening sentences with Normal, Slow, and Very slow voice speed options.
- 30-sentence sessions with immediate assessment.
- Timed vocabulary quizzes cover the sourced New HSK 1 and New HSK 2 lists across three HSK 1 parts and five HSK 2 parts.
- Vocabulary quiz tables show every character and translation, then reveal pinyin when the user types a correct answer.
- End-of-session vocabulary results show every found and missed word for review.
- Listening mode uses the browser Speech Synthesis API and prefers Microsoft Online or Microsoft Natural mainland Chinese speech when available.

## Sentence Data

Sentence pairs are sourced from Tatoeba and redistributed under CC BY 2.0 FR. Each row in `sentence-data.js` includes the Tatoeba source sentence ID and translation ID.

See `NOTICE.md` for attribution details.
