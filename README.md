# Chinese Trainer

A browser-based Chinese training app for listening, writing, and reading practice.

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

This repo is ready for static GitHub Pages deployment from the `main` branch using the workflow in `.github/workflows/deploy-pages.yml`.

After creating the GitHub repository and pushing `main`, configure Pages with GitHub Actions as the build type. The workflow validates the app, builds `_site/`, uploads the Pages artifact, and deploys it.

GitHub Pages is available from private repositories on GitHub Pro, Team, Enterprise Cloud, and Enterprise Server plans. Private Pages access control is an Enterprise Cloud feature.

## Features

- Top-level training navigation for Listening, Writing, and Reading.
- Global Beginner, Intermediate, and Advanced difficulty filters.
- 1,800 sourced sentence pairs: 600 Beginner, 600 Intermediate, and 600 Advanced.
- Sentence pairs retain source and translation IDs for Tatoeba attribution and auditing.
- Simplified Mandarin-only listening sentences with Normal, Slow, and Very slow voice speed options.
- 30-sentence sessions with immediate assessment.
- End-of-session results table with expected answers and per-item scores.
- Listening mode uses the browser Speech Synthesis API and prefers Microsoft Online or Microsoft Natural mainland Chinese speech when available.

## Sentence Data

Sentence pairs are sourced from Tatoeba and redistributed under CC BY 2.0 FR. Each row in `sentence-data.js` includes the Tatoeba source sentence ID and translation ID.

See `NOTICE.md` for attribution details.
