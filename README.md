# Chinese Trainer

A browser-based Chinese learning app with adaptive vocabulary review, contextual grammar practice, pronunciation feedback, sentence drills, geography practice, and vocabulary quizzes.

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

- First-run study setup turns an HSK target or level check plus a learning focus into an editable daily plan, while existing learners migrate without interruption.
- Today turns saved progress into a three-session daily plan, recommends the next activity, and shows a seven-day practice streak and learning snapshot.
- The HSK mastery roadmap connects vocabulary coverage, spaced retention, grammar strength, and separate Pinyin and Audio benchmarks into a persistent HSK 1 or HSK 2 study target with a direct next action.
- A 20-question HSK 1–2 placement check samples vocabulary and grammar, explains each answer, recommends a starting roadmap, and saves the result for later review.
- Learning Progress turns browser history into a 28-day activity view, skill accuracy, personalized focus areas, recurring vocabulary misses, and expandable session review.
- Versioned learning-data backups protect settings, history, spaced-review scheduling, saved vocabulary, and saved sentences across browsers or devices.
- Installable offline access pre-caches the complete curriculum, sentence bank, word data, and China map, with explicit in-app update control for new releases.
- Global learning search connects vocabulary, grammar, and example sentences through Chinese, tone-insensitive pinyin, or English, with keyboard navigation and direct links into each study view.
- The vocabulary word library searches all 1,256 HSK 1 and HSK 2 words by characters, tone-optional pinyin, or English; saved words feed directly into adaptive review.
- The HSK Vocabulary Path organizes the complete corpus by level and part, tracks New, Due, Learning, and Strong words, and launches focused part reviews or matching timed quizzes.
- Word Study keeps learners in context with review status, audio, dictionary notes, exact-match example sentences, pinyin, Tatoeba attribution, and the existing MDBG link.
- The Sentence Library searches all 1,800 sourced examples by Chinese, tone-insensitive pinyin, or English, with optional pinyin, word glosses, audio, bookmarks, and saved-sentence drills.
- Daily Review builds a spaced vocabulary queue from quiz and review outcomes, with 1, 3, 7, 14, 30, and 60-day intervals.
- Quiz and sentence results turn missed answers into focused retry sessions, and recent History sessions can relaunch their saved mistakes directly.
- Review sessions mix character-to-pinyin recall with audio-to-meaning choices and support keyboard controls.
- Grammar Lab teaches 16 core New HSK 1 and 2 patterns with concise explanations, spoken examples, contextual multiple-choice checks, keyboard controls, focused mistake retries, and separate mastery history.
- Pronunciation includes a browser speech-recognition session plus a dependable 15-word tone-listening trainer with randomized tone-pattern choices, Pleco colors, keyboard shortcuts, post-answer word reveals, and separate progress history.
- Global navigation between Today, Vocabulary Quiz, Daily Review, Grammar Lab, Pronunciation, Geography of China, Sentence Drills, and History.
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
