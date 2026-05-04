"use strict";

const SESSION_LENGTH = 30;
const SETTINGS_KEY = "chineseTrainerSettings";

const LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const MODES = {
  listening: {
    label: "Listening",
    task: "Listen to the Chinese sentence and type the English meaning.",
    sentenceLabel: "Audio sentence",
    answerPlaceholder: "Type the English meaning you heard",
  },
  writing: {
    label: "Writing",
    task: "Read the English sentence and write it in Chinese.",
    sentenceLabel: "English sentence",
    answerPlaceholder: "Write the Chinese sentence",
  },
  reading: {
    label: "Reading",
    task: "Read the Chinese sentence and type the English meaning.",
    sentenceLabel: "Chinese sentence",
    answerPlaceholder: "Type the English meaning",
  },
};

const ACCEPTANCE_THRESHOLD = 0.7;

const VOICE_SPEEDS = {
  normal: 1,
  slow: 0.82,
  "very-slow": 0.68,
};

const SENTENCES = [];

if (typeof window !== "undefined" && Array.isArray(window.ADDITIONAL_SENTENCES)) {
  const seenIds = new Set(SENTENCES.map((item) => item.id));
  window.ADDITIONAL_SENTENCES.forEach((item) => {
    if (!seenIds.has(item.id)) {
      SENTENCES.push(item);
      seenIds.add(item.id);
    }
  });
}

const state = {
  mode: "listening",
  selectedLevels: new Set(["beginner"]),
  voiceSpeed: "normal",
  voices: [],
  preferredVoice: null,
  isSpeaking: false,
  session: null,
  result: null,
};

const app = document.querySelector("#app");
const levelOptions = document.querySelector("#levelOptions");
const voiceSpeed = document.querySelector("#voiceSpeed");

function init() {
  if (!app || !levelOptions || !voiceSpeed) {
    throw new Error("Chinese Trainer could not find its required page elements.");
  }

  loadSettings();
  renderLevelOptions();
  bindTopLevelControls();
  loadVoices();
  render();
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    if (Array.isArray(saved.selectedLevels) && saved.selectedLevels.length) {
      state.selectedLevels = new Set(
        saved.selectedLevels.filter((level) => LEVELS.some((item) => item.id === level)),
      );
    }
    if (saved.voiceSpeed && VOICE_SPEEDS[saved.voiceSpeed]) {
      state.voiceSpeed = saved.voiceSpeed;
    }
  } catch {
    state.selectedLevels = new Set(["beginner"]);
  }

  if (!state.selectedLevels.size) {
    state.selectedLevels.add("beginner");
  }

  voiceSpeed.value = state.voiceSpeed;
}

function saveSettings() {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        selectedLevels: [...state.selectedLevels],
        voiceSpeed: state.voiceSpeed,
      }),
    );
  } catch {
    // Settings persistence is a convenience; practice sessions still work without it.
  }
}

function bindTopLevelControls() {
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.mode;
      if (nextMode === state.mode) return;

      if (state.session && !window.confirm("Switch training type and end this session?")) {
        return;
      }

      stopSpeech();
      state.mode = nextMode;
      state.session = null;
      state.result = null;
      render();
    });
  });

  document.addEventListener("keydown", handleSessionShortcut);

  voiceSpeed.addEventListener("change", () => {
    state.voiceSpeed = voiceSpeed.value;
    saveSettings();
  });
}

function handleSessionShortcut(event) {
  if (!(event.metaKey || event.ctrlKey)) {
    return;
  }

  const isEnter = event.key === "Enter";
  const isPeriod = event.key === "." || event.code === "Period";

  if (isPeriod && state.session?.mode === "listening") {
    event.preventDefault();
    speak(state.session.items[state.session.index].zh);
    return;
  }

  if (!isEnter) {
    return;
  }

  event.preventDefault();

  if (!state.session) {
    startSession();
    return;
  }

  if (state.session.currentAssessment) {
    nextQuestion();
    return;
  }

  const input = document.querySelector("#answerInput");
  if (input) {
    submitAnswer(input.value);
  }
}

function renderLevelOptions() {
  levelOptions.innerHTML = LEVELS.map((level) => {
    const checked = state.selectedLevels.has(level.id) ? "checked" : "";
    return `
      <label class="level-check">
        <input type="checkbox" value="${level.id}" ${checked}>
        ${level.label}
      </label>
    `;
  }).join("");

  levelOptions.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.selectedLevels.add(input.value);
      } else if (state.selectedLevels.size > 1) {
        state.selectedLevels.delete(input.value);
      } else {
        input.checked = true;
      }

      state.session = null;
      state.result = null;
      saveSettings();
      render();
    });
  });
}

function loadVoices() {
  if (!supportsSpeechSynthesis()) {
    return;
  }

  const refresh = () => {
    state.voices = window.speechSynthesis.getVoices();
    state.preferredVoice = choosePreferredVoice(state.voices);
  };

  refresh();
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
  } else {
    window.speechSynthesis.onvoiceschanged = refresh;
  }
}

function choosePreferredVoice(voices) {
  const mandarinVoices = voices.filter(isSimplifiedMandarinVoice);
  const microsoftOnline = mandarinVoices.find((voice) => {
    const name = voice.name.toLowerCase();
    return name.includes("microsoft") && (name.includes("online") || name.includes("natural"));
  });

  return (
    microsoftOnline ||
    mandarinVoices.find((voice) => voice.name.toLowerCase().includes("microsoft")) ||
    mandarinVoices.find((voice) => voice.lang.toLowerCase() === "zh-cn") ||
    mandarinVoices[0] ||
    null
  );
}

function isSimplifiedMandarinVoice(voice) {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  const excludedNames = ["yue", "hong kong", "hk", "taiwan", "taiwanese", "tw"];
  const mainlandMandarinLangs = ["zh-cn", "zh-hans", "cmn-cn", "cmn-hans", "cmn-hans-cn"];

  return mainlandMandarinLangs.some((prefix) => lang.startsWith(prefix)) &&
    !excludedNames.some((term) => name.includes(term));
}

function render() {
  updateModeTabs();

  if (state.result) {
    renderResults();
    return;
  }

  if (state.session) {
    renderSession();
    return;
  }

  renderModeHome();
}

function updateModeTabs() {
  document.body.dataset.mode = state.mode;
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
}

function shortcutHint(key) {
  return `
    <span class="shortcut-hint" aria-label="Command or Control plus ${key}">
      <kbd>⌘</kbd><span class="shortcut-separator">/</span><kbd>Ctrl</kbd><span class="shortcut-plus">+</span><kbd>${key}</kbd>
    </span>
  `;
}

function renderModeHome() {
  const mode = MODES[state.mode];
  const pool = getFilteredPool();
  const hasEnoughSentences = pool.length >= SESSION_LENGTH;
  const levelPills = LEVELS
    .filter((level) => state.selectedLevels.has(level.id))
    .map((level) => `<span class="meta-pill">${level.label}</span>`)
    .join("");

  app.innerHTML = `
    <div class="workspace-grid">
      <section class="workspace-panel">
        <div class="mode-heading">
          <div>
            <h2>${mode.label} Training</h2>
            <p>${mode.task}</p>
          </div>
          <div class="session-meta">
            ${levelPills}
          </div>
        </div>

        <div class="task-preview" aria-hidden="true">
          <div class="preview-cell">
            <strong>听</strong>
            <span>Audio-first translation practice</span>
          </div>
          <div class="preview-cell">
            <strong>写</strong>
            <span>English to written Chinese recall</span>
          </div>
          <div class="preview-cell">
            <strong>读</strong>
            <span>Chinese reading comprehension</span>
          </div>
        </div>

        ${hasEnoughSentences ? "" : `
          <p class="empty-note">
            Select at least ${SESSION_LENGTH} available sentences before starting a session.
          </p>
        `}

        <button class="primary-btn shortcut-btn" type="button" id="startSession" ${hasEnoughSentences ? "" : "disabled"}>
          <span>Start 30-sentence session</span>
          ${shortcutHint("Enter")}
        </button>
      </section>

      <aside class="workspace-panel side-panel">
        <div class="stat-grid">
          <div class="stat">
            <strong>${SESSION_LENGTH}</strong>
            <span>Questions</span>
          </div>
          <div class="stat">
            <strong>${pool.length}</strong>
            <span>Selected sentence pool</span>
          </div>
          <div class="stat wide">
            <strong>${SENTENCES.length}</strong>
            <span>Total sentence bank</span>
            <div class="level-counts" aria-label="Sentence count by difficulty">
              ${LEVELS.map((level) => `
                <span>${level.label}: ${countByLevel(level.id)} sentences</span>
              `).join("")}
            </div>
          </div>
        </div>
        <div class="script-board" aria-hidden="true">
          <span>中</span><span>文</span><span>练</span>
          <span>习</span><span>听</span><span>写</span>
          <span>阅</span><span>读</span><span>测</span>
        </div>
      </aside>
    </div>
  `;

  document.querySelector("#startSession").addEventListener("click", startSession);
}

function renderSession() {
  const session = state.session;
  const current = session.items[session.index];
  const mode = MODES[session.mode];
  const submitted = Boolean(session.currentAssessment);
  const answer = submitted ? session.currentAssessment.answer : "";
  const progressPercent = Math.round((session.index / SESSION_LENGTH) * 100);
  const sentenceMarkup = buildSentenceMarkup(current, session.mode);
  const feedbackMarkup = submitted ? buildFeedbackMarkup(session.currentAssessment, current) : "";

  app.innerHTML = `
    <section class="workspace-panel session-shell">
      <div class="progress-row">
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <span class="progress-label">Sentence ${session.index + 1} of ${SESSION_LENGTH}</span>
      </div>

      <div class="sentence-card">
        <span class="sentence-label">${mode.sentenceLabel}</span>
        ${sentenceMarkup}
      </div>

      <form class="answer-form" id="answerForm">
        <textarea
          id="answerInput"
          lang="${session.mode === "writing" ? "zh-CN" : "en"}"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          placeholder="${mode.answerPlaceholder}"
          ${submitted ? "disabled" : ""}
        >${escapeHtml(answer)}</textarea>
        <div class="form-actions">
          ${
            submitted
              ? `<button class="primary-btn shortcut-btn" type="button" id="nextQuestion">
                  <span>${session.index + 1 === SESSION_LENGTH ? "View results" : "Next sentence"}</span>
                  ${shortcutHint("Enter")}
                </button>`
              : `<button class="primary-btn shortcut-btn" type="submit">
                  <span>Check sentence</span>
                  ${shortcutHint("Enter")}
                </button>`
          }
          <button class="ghost-btn" type="button" id="endSession">End session</button>
        </div>
      </form>

      ${feedbackMarkup}
    </section>
  `;

  if (session.mode === "listening") {
    document.querySelector("#playAudio").addEventListener("click", () => speak(current.zh));
  }

  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);

  if (submitted) {
    document.querySelector("#nextQuestion").addEventListener("click", nextQuestion);
  } else {
    const form = document.querySelector("#answerForm");
    const input = document.querySelector("#answerInput");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitAnswer(input.value);
    });
    input.focus();
  }
}

function buildSentenceMarkup(item, mode) {
  if (mode === "writing") {
    return `<p class="sentence-text">${escapeHtml(item.en)}</p>`;
  }

  if (mode === "reading") {
    return `<p class="sentence-text zh" lang="zh-CN">${escapeHtml(item.zh)}</p>`;
  }

  return `
    <div class="audio-sentence">
      <button class="secondary-btn shortcut-btn" type="button" id="playAudio" ${supportsSpeechSynthesis() ? "" : "disabled"}>
        <span>Play sentence</span>
        ${shortcutHint(".")}
      </button>
      <span class="meta-pill">${selectedLevelLabel(item.level)}</span>
      ${supportsSpeechSynthesis() ? "" : `
        <span class="audio-warning">Speech playback is unavailable in this browser.</span>
      `}
      <span class="sound-indicator ${state.isSpeaking ? "active" : ""}" id="soundIndicator" aria-live="polite">
        <span class="sound-bars" aria-hidden="true"><span></span><span></span><span></span></span>
        Playing
      </span>
    </div>
  `;
}

function buildFeedbackMarkup(assessment, item) {
  const status = assessment.correct ? "good" : "review";
  const title = assessment.correct ? "Accepted" : "Review needed";
  const expectedPrimary = assessment.mode === "writing" ? item.zh : item.en;
  const expectedSecondary = assessment.mode === "writing" ? item.en : item.zh;
  return `
    <section class="feedback ${status}">
      <div class="feedback-title">
        <span>${title}</span>
        <span class="score-badge">${Math.round(assessment.score * 100)}%</span>
      </div>
      <div class="answer-pair">
        <div class="answer-box">
          <span>Your answer</span>
          <p>${escapeHtml(assessment.answer || "No answer entered")}</p>
        </div>
        <div class="answer-box">
          <span>Expected</span>
          <p>${escapeHtml(expectedPrimary)}</p>
        </div>
      </div>
      <div class="answer-box">
        <span>Reference</span>
        <p>${escapeHtml(expectedSecondary)}</p>
      </div>
    </section>
  `;
}

function renderResults() {
  const result = state.result;
  const correct = result.answers.filter((answer) => answer.correct).length;
  const average = result.answers.length
    ? result.answers.reduce((sum, answer) => sum + answer.score, 0) / result.answers.length
    : 0;
  const percent = Math.round(average * 100);
  const rows = result.answers
    .map((answer, index) => {
      const item = answer.item;
      const sentence =
        result.mode === "writing"
          ? item.en
          : result.mode === "reading"
            ? item.zh
            : "Audio sentence";
      const expected = result.mode === "writing" ? item.zh : item.en;
      const statusClass = answer.correct ? "status-good" : "status-review";
      const statusText = answer.correct ? "Accepted" : "Review";
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${selectedLevelLabel(item.level)}</td>
          <td>${escapeHtml(sentence)}</td>
          <td>${escapeHtml(answer.answer || "No answer entered")}</td>
          <td>${escapeHtml(expected)}</td>
          <td>${Math.round(answer.score * 100)}%</td>
          <td class="${statusClass}">${statusText}</td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="results-header">
        <div>
          <h2>${MODES[result.mode].label} Results</h2>
          <p>${correct} accepted out of ${result.answers.length}; average score ${percent}%.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another session</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to trainer</button>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat">
          <strong>${correct}/${result.answers.length}</strong>
          <span>Accepted</span>
        </div>
        <div class="stat">
          <strong>${percent}%</strong>
          <span>Average</span>
        </div>
        <div class="stat">
          <strong>${selectedLevelLabels(result.levels)}</strong>
          <span>Difficulty filter</span>
        </div>
        <div class="stat">
          <strong>${result.answers.length}</strong>
          <span>Session size</span>
        </div>
      </div>

      <div class="results-table-wrap" tabindex="0">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Level</th>
              <th>Sentence</th>
              <th>Your answer</th>
              <th>Expected</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", startSession);
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    render();
  });
}

function startSession() {
  stopSpeech();
  const pool = shuffle(getFilteredPool());
  if (pool.length < SESSION_LENGTH) {
    render();
    return;
  }

  const items = pool.slice(0, SESSION_LENGTH);

  state.result = null;
  state.session = {
    mode: state.mode,
    levels: [...state.selectedLevels],
    items,
    index: 0,
    answers: [],
    currentAssessment: null,
  };

  render();
  if (state.mode === "listening") {
    speak(state.session.items[0].zh);
  }
}

function submitAnswer(answer) {
  const session = state.session;
  const item = session.items[session.index];
  const assessment = assessAnswer(answer, item, session.mode);
  session.currentAssessment = assessment;
  session.answers.push({ ...assessment, item });
  render();
}

function nextQuestion() {
  const session = state.session;

  if (session.index + 1 >= SESSION_LENGTH) {
    state.result = {
      mode: session.mode,
      levels: session.levels,
      answers: session.answers,
    };
    state.session = null;
    stopSpeech();
    render();
    return;
  }

  session.index += 1;
  session.currentAssessment = null;
  render();

  if (session.mode === "listening") {
    speak(session.items[session.index].zh);
  }
}

function finishSessionEarly() {
  const session = state.session;
  if (!session.answers.length) {
    state.session = null;
    stopSpeech();
    render();
    return;
  }

  state.result = {
    mode: session.mode,
    levels: session.levels,
    answers: session.answers,
  };
  state.session = null;
  stopSpeech();
  render();
}

function assessAnswer(answer, item, mode) {
  const trimmed = answer.trim();
  const score = mode === "writing"
    ? scoreChinese(trimmed, item.zh)
    : scoreEnglish(trimmed, item.en, {
        ignoreGenderPronouns: mode === "listening" && /[他她]/.test(item.zh),
      });
  return {
    mode,
    answer: trimmed,
    score,
    correct: score >= ACCEPTANCE_THRESHOLD,
  };
}

function scoreChinese(actual, expected) {
  const normalizedActual = normalizeChinese(actual);
  const normalizedExpected = normalizeChinese(expected);

  if (!normalizedActual) return 0;
  if (normalizedActual === normalizedExpected) return 1;

  const orderedSimilarity =
    lcsLength(normalizedActual, normalizedExpected) /
    Math.max(normalizedActual.length, normalizedExpected.length);
  const editSimilarity = stringSimilarity(normalizedActual, normalizedExpected);
  return clamp(Math.max(orderedSimilarity, editSimilarity), 0, 1);
}

function scoreEnglish(actual, expected, options = {}) {
  const normalizedActual = options.ignoreGenderPronouns
    ? neutralizeGenderPronouns(normalizeEnglish(actual))
    : normalizeEnglish(actual);
  const normalizedExpected = options.ignoreGenderPronouns
    ? neutralizeGenderPronouns(normalizeEnglish(expected))
    : normalizeEnglish(expected);

  if (!normalizedActual) return 0;
  if (normalizedActual === normalizedExpected) return 1;

  const actualTokens = contentTokens(normalizedActual);
  const expectedTokens = contentTokens(normalizedExpected);
  const tokenScore = f1Score(actualTokens, expectedTokens);
  const editScore = stringSimilarity(normalizedActual, normalizedExpected);

  return clamp(Math.max(tokenScore, editScore * 0.92), 0, 1);
}

function neutralizeGenderPronouns(value) {
  return value
    .replace(/\b(he|she|him|her|his|hers|himself|herself)\b/g, "person")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeChinese(value) {
  return value
    .replace(/[，。！？、；：“”‘’《》（）\s]/g, "")
    .replace(/[,.!?;:'"()[\]]/g, "")
    .trim();
}

function normalizeEnglish(value) {
  return value
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/let's/g, "let us")
    .replace(/didn't/g, "did not")
    .replace(/don't/g, "do not")
    .replace(/doesn't/g, "does not")
    .replace(/can't/g, "can not")
    .replace(/won't/g, "will not")
    .replace(/i'm/g, "i am")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contentTokens(value) {
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "to",
    "of",
    "at",
    "in",
    "on",
    "for",
    "with",
    "is",
    "are",
    "am",
    "be",
    "was",
    "were",
    "do",
    "does",
    "did",
    "have",
    "has",
    "had",
    "will",
  ]);

  return value
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => !stopWords.has(token));
}

function f1Score(actualTokens, expectedTokens) {
  if (!actualTokens.length || !expectedTokens.length) return 0;

  const expectedCounts = new Map();
  expectedTokens.forEach((token) => expectedCounts.set(token, (expectedCounts.get(token) || 0) + 1));

  let matches = 0;
  actualTokens.forEach((token) => {
    const count = expectedCounts.get(token) || 0;
    if (count > 0) {
      matches += 1;
      expectedCounts.set(token, count - 1);
    }
  });

  const precision = matches / actualTokens.length;
  const recall = matches / expectedTokens.length;
  return precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
}

function stringSimilarity(a, b) {
  if (!a.length || !b.length) return 0;
  const distance = levenshteinDistance(a, b);
  return 1 - distance / Math.max(a.length, b.length);
}

function levenshteinDistance(a, b) {
  const previous = new Array(b.length + 1).fill(0).map((_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function lcsLength(a, b) {
  const rows = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      rows[i][j] =
        a[i - 1] === b[j - 1]
          ? rows[i - 1][j - 1] + 1
          : Math.max(rows[i - 1][j], rows[i][j - 1]);
    }
  }

  return rows[a.length][b.length];
}

function setPlaybackState(isSpeaking) {
  state.isSpeaking = isSpeaking;
  const indicator = document.querySelector("#soundIndicator");
  if (indicator) {
    indicator.classList.toggle("active", isSpeaking);
  }
}

function stopSpeech() {
  if (supportsSpeechSynthesis()) {
    window.speechSynthesis.cancel();
  }
  setPlaybackState(false);
}

function speak(text) {
  if (!supportsSpeechSynthesis()) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = VOICE_SPEEDS[state.voiceSpeed] || VOICE_SPEEDS.normal;
  utterance.pitch = 1;
  utterance.volume = 1;

  state.preferredVoice = choosePreferredVoice(window.speechSynthesis.getVoices());
  if (state.preferredVoice) {
    utterance.voice = state.preferredVoice;
  }

  utterance.onstart = () => setPlaybackState(true);
  utterance.onend = () => setPlaybackState(false);
  utterance.onerror = () => setPlaybackState(false);

  window.speechSynthesis.cancel();
  setPlaybackState(true);
  window.speechSynthesis.speak(utterance);
}

function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getFilteredPool() {
  return SENTENCES.filter((item) => state.selectedLevels.has(item.level));
}

function countByLevel(level) {
  return SENTENCES.filter((item) => item.level === level).length;
}

function selectedLevelLabels(levelIds = [...state.selectedLevels]) {
  return levelIds.map(selectedLevelLabel).join(", ");
}

function selectedLevelLabel(levelId) {
  return LEVELS.find((level) => level.id === levelId)?.label || levelId;
}

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
