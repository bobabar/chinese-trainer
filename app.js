"use strict";

const SESSION_LENGTH = 30;
const SETTINGS_KEY = "chineseTrainerSettings";

const LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const SENTENCE_COUNTS = {
  beginner: 600,
  intermediate: 600,
  advanced: 600,
};

const SENTENCE_DATA_SRC = "./sentence-data.js";
const WORD_DATA_SRC = "./word-data.js";

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

const TOOLS = {
  drill: {
    label: "Drill Tool",
  },
  vocabulary: {
    label: "Vocabulary Quiz",
  },
};

const VOCABULARY_MODES = {
  pinyin: {
    label: "Pinyin",
    task: "Read the Chinese word and type its pinyin.",
    promptLabel: "Chinese word",
    answerPlaceholder: "Type pinyin; spaces and tones optional",
  },
  meaning: {
    label: "Audio",
    task: "Listen to the Chinese word and type its English meaning.",
    promptLabel: "Audio word",
    answerPlaceholder: "Type the English meaning",
  },
};

const ACCEPTANCE_THRESHOLD = 0.7;

const VOICE_SPEEDS = {
  normal: 0.82,
  slow: 0.68,
  "very-slow": 0.52,
};

const PREVIEW_CELLS = {
  listening: {
    character: "听",
    description: "Audio-first translation practice",
  },
  writing: {
    character: "写",
    description: "English to written Chinese recall",
  },
  reading: {
    character: "读",
    description: "Chinese reading comprehension",
  },
};

const VOCABULARY_PREVIEW_CELLS = {
  pinyin: {
    character: "词",
    description: "Chinese characters to pinyin recall",
  },
  meaning: {
    character: "听",
    description: "Audio-first vocabulary meaning recall",
  },
};

const SENTENCES = [];
const RAW_VOCABULARY_QUIZ_SETS = Array.isArray(window.VOCABULARY_QUIZ_SETS)
  ? window.VOCABULARY_QUIZ_SETS
  : [];
const VOCABULARY_QUIZ_SETS = buildVocabularyQuizSets(RAW_VOCABULARY_QUIZ_SETS);
const VOCABULARY_ORDER_OPTIONS = {
  list: "List order",
  random: "Random order",
};
const VOCABULARY_SECONDS_PER_WORD = 6.85;
const VOCABULARY_MIN_TIMER_SECONDS = 300;
const VOCABULARY_PREVIEW_LIMIT = 12;
const loadedScripts = new Map();
let sentenceDataPromise = null;
let sentenceDataLoaded = false;
let wordDataPromise = null;
let wordDataLoaded = false;
let vocabularyTimerId = 0;
let speechRequestId = 0;
let CHINESE_WORD_DATA = {};
let MAX_CHINESE_WORD_LENGTH = 1;
const HAN_CHARACTER_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;
const PINYIN_TONE_MARKS = {
  ā: ["a", "1"],
  á: ["a", "2"],
  ǎ: ["a", "3"],
  à: ["a", "4"],
  ē: ["e", "1"],
  é: ["e", "2"],
  ě: ["e", "3"],
  è: ["e", "4"],
  ī: ["i", "1"],
  í: ["i", "2"],
  ǐ: ["i", "3"],
  ì: ["i", "4"],
  ō: ["o", "1"],
  ó: ["o", "2"],
  ǒ: ["o", "3"],
  ò: ["o", "4"],
  ū: ["u", "1"],
  ú: ["u", "2"],
  ǔ: ["u", "3"],
  ù: ["u", "4"],
  ǖ: ["v", "1"],
  ǘ: ["v", "2"],
  ǚ: ["v", "3"],
  ǜ: ["v", "4"],
  ü: ["v", ""],
  ń: ["n", "2"],
  ň: ["n", "3"],
  ǹ: ["n", "4"],
  ḿ: ["m", "2"],
};

const state = {
  tool: "drill",
  mode: "listening",
  vocabularyMode: "pinyin",
  vocabularySetId: VOCABULARY_QUIZ_SETS[0]?.id || "",
  vocabularyOrder: "list",
  selectedLevels: new Set(["beginner"]),
  voiceSpeed: "normal",
  voices: [],
  preferredVoice: null,
  isSpeaking: false,
  isLoadingSentences: false,
  isCheckingAnswer: false,
  dataError: "",
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
  bindGlossTooltipAlignment();
  loadVoices();
  primeVoicesOnFirstInteraction();
  render();
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    if (saved.tool && TOOLS[saved.tool]) {
      state.tool = saved.tool;
    }
    if (saved.mode && MODES[saved.mode]) {
      state.mode = saved.mode;
    }
    if (saved.vocabularyMode && VOCABULARY_MODES[saved.vocabularyMode]) {
      state.vocabularyMode = saved.vocabularyMode;
    }
    if (saved.vocabularySetId && VOCABULARY_QUIZ_SETS.some((set) => set.id === saved.vocabularySetId)) {
      state.vocabularySetId = saved.vocabularySetId;
    }
    if (saved.vocabularyOrder && VOCABULARY_ORDER_OPTIONS[saved.vocabularyOrder]) {
      state.vocabularyOrder = saved.vocabularyOrder;
    }
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

  if (!state.vocabularySetId && VOCABULARY_QUIZ_SETS[0]) {
    state.vocabularySetId = VOCABULARY_QUIZ_SETS[0].id;
  }

  voiceSpeed.value = state.voiceSpeed;
}

function saveSettings() {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        tool: state.tool,
        mode: state.mode,
        vocabularyMode: state.vocabularyMode,
        vocabularySetId: state.vocabularySetId,
        vocabularyOrder: state.vocabularyOrder,
        selectedLevels: [...state.selectedLevels],
        voiceSpeed: state.voiceSpeed,
      }),
    );
  } catch {
    // Settings persistence is a convenience; practice sessions still work without it.
  }
}

function bindTopLevelControls() {
  document.querySelectorAll(".tool-tab").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTool = button.dataset.tool;
      if (!TOOLS[nextTool] || nextTool === state.tool) return;

      if (state.session && !window.confirm("Switch tools and end this session?")) {
        return;
      }

      stopSpeech();
      state.tool = nextTool;
      state.session = null;
      state.result = null;
      state.dataError = "";
      saveSettings();
      render();
    });
  });

  document.querySelectorAll("[data-mode]").forEach((button) => {
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
      saveSettings();
      render();
    });
  });

  document.querySelectorAll("[data-vocabulary-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.vocabularyMode;
      if (!VOCABULARY_MODES[nextMode] || nextMode === state.vocabularyMode) return;

      if (state.session && !window.confirm("Switch quiz type and end this session?")) {
        return;
      }

      stopSpeech();
      state.vocabularyMode = nextMode;
      state.session = null;
      state.result = null;
      saveSettings();
      render();
    });
  });

  document.addEventListener("keydown", handleSessionShortcut);

  voiceSpeed.addEventListener("change", () => {
    state.voiceSpeed = voiceSpeed.value;
    saveSettings();
  });
}

function bindGlossTooltipAlignment() {
  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest?.(".annotated-word.has-gloss");
    if (target) {
      alignGlossTooltip(target);
    }
  });

  document.addEventListener("focusin", (event) => {
    const target = event.target.closest?.(".annotated-word.has-gloss");
    if (target) {
      alignGlossTooltip(target);
    }
  });
}

function handleSessionShortcut(event) {
  if (event.isComposing || event.altKey) {
    return;
  }

  const isEnter = event.key === "Enter";
  if (!isEnter) {
    return;
  }

  if ((event.metaKey || event.ctrlKey) && sessionUsesAudioPrompt(state.session)) {
    event.preventDefault();
    const current = state.session.items[state.session.index];
    if (current) {
      speak(current.zh);
    }
    return;
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey) {
    return;
  }

  if (isTypingTarget(event.target) && event.target?.id !== "answerInput") {
    return;
  }

  if (!state.session) {
    if (shouldStartSessionFromShortcut(event.target)) {
      event.preventDefault();
      startActiveSession();
    }
    return;
  }

  event.preventDefault();

  if (state.session.currentAssessment) {
    nextQuestion();
    return;
  }

  if (state.session.type === "vocabulary") {
    if (state.session.quizMode === "pinyin") {
      const input = document.querySelector("#vocabularyGuess");
      if (input) {
        submitVocabularyGuess(input.value);
      }
      return;
    }

    const input = document.querySelector("#answerInput");
    if (input) {
      submitAnswer(input.value);
    }
    return;
  }

  const input = document.querySelector("#answerInput");
  if (input) {
    submitAnswer(input.value);
  }
}

function isTypingTarget(target) {
  const tagName = target?.tagName?.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target?.isContentEditable;
}

function shouldStartSessionFromShortcut(target) {
  return !isTypingTarget(target) && !state.result;
}

function sessionUsesAudioPrompt(session) {
  return session?.type === "vocabulary"
    ? session.quizMode === "meaning"
    : session?.mode === "listening";
}

function renderLevelOptions() {
  const selectedPoolCount = getSelectedSentenceCount();
  const levelMarkup = LEVELS.map((level) => {
    const checked = state.selectedLevels.has(level.id) ? "checked" : "";
    return `
      <label class="level-check">
        <input type="checkbox" value="${level.id}" ${checked}>
        ${level.label}
      </label>
    `;
  }).join("");

  levelOptions.innerHTML = `
    ${levelMarkup}
    <span class="level-check pool-count-pill" aria-label="Selected sentence pool: ${selectedPoolCount}">
      <strong>${selectedPoolCount}</strong>
      <span>Selected sentence pool</span>
    </span>
  `;

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
      renderLevelOptions();
      render();
    });
  });
}

function ensureSentenceData() {
  hydrateSentenceDataFromWindow();
  if (sentenceDataLoaded) {
    return Promise.resolve();
  }

  if (!sentenceDataPromise) {
    sentenceDataPromise = loadScriptOnce(SENTENCE_DATA_SRC)
      .then(() => {
        hydrateSentenceDataFromWindow();
        if (!sentenceDataLoaded) {
          throw new Error("The sentence bank loaded, but no sentences were found.");
        }
      })
      .catch((error) => {
        sentenceDataPromise = null;
        throw error;
      });
  }

  return sentenceDataPromise;
}

function hydrateSentenceDataFromWindow() {
  if (typeof window === "undefined" || !Array.isArray(window.ADDITIONAL_SENTENCES)) {
    return;
  }

  const seenIds = new Set(SENTENCES.map((item) => item.id));
  window.ADDITIONAL_SENTENCES.forEach((item) => {
    if (!seenIds.has(item.id)) {
      SENTENCES.push(item);
      seenIds.add(item.id);
    }
  });

  sentenceDataLoaded = SENTENCES.length > 0;
}

function ensureWordData() {
  hydrateWordDataFromWindow();
  if (wordDataLoaded) {
    return Promise.resolve();
  }

  if (!wordDataPromise) {
    wordDataPromise = loadScriptOnce(WORD_DATA_SRC)
      .then(() => {
        hydrateWordDataFromWindow();
        if (!wordDataLoaded) {
          throw new Error("The word glossary loaded, but no word data was found.");
        }
      })
      .catch((error) => {
        wordDataPromise = null;
        throw error;
      });
  }

  return wordDataPromise;
}

function hydrateWordDataFromWindow() {
  if (
    typeof window === "undefined" ||
    !window.CHINESE_WORD_DATA ||
    typeof window.CHINESE_WORD_DATA !== "object"
  ) {
    return;
  }

  CHINESE_WORD_DATA = window.CHINESE_WORD_DATA;
  MAX_CHINESE_WORD_LENGTH = Math.max(1, ...Object.keys(CHINESE_WORD_DATA).map((word) => word.length));
  wordDataLoaded = true;
}

function loadScriptOnce(src) {
  if (loadedScripts.has(src)) {
    return loadedScripts.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing || document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.dynamicSrc = src;

    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Could not load ${src}.`)), { once: true });

    if (!existing) {
      document.head.append(script);
    }
  });

  loadedScripts.set(src, promise);
  return promise;
}

function queueIdleTask(callback) {
  if (typeof window === "undefined") {
    return;
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 2500 });
    return;
  }

  window.setTimeout(callback, 400);
}

function loadVoices() {
  if (!supportsSpeechSynthesis()) {
    return;
  }

  const refresh = refreshVoices;

  refresh();
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
  } else {
    window.speechSynthesis.onvoiceschanged = refresh;
  }
}

function primeVoicesOnFirstInteraction() {
  if (!supportsSpeechSynthesis()) {
    return;
  }

  const prime = () => refreshVoices();
  ["pointerdown", "touchstart", "keydown"].forEach((eventName) => {
    document.addEventListener(eventName, prime, { once: true, passive: true });
  });
}

function refreshVoices() {
  if (!supportsSpeechSynthesis()) {
    return [];
  }

  state.voices = window.speechSynthesis.getVoices();
  state.preferredVoice = choosePreferredVoice(state.voices);
  return state.voices;
}

function waitForVoices(timeout = 450) {
  const voices = refreshVoices();
  if (voices.length) {
    return Promise.resolve(voices);
  }

  return new Promise((resolve) => {
    let settled = false;
    let intervalId = 0;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearInterval(intervalId);
      resolve(refreshVoices());
    };

    const onVoicesChanged = () => finish();

    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged, { once: true });
    }

    intervalId = window.setInterval(() => {
      if (window.speechSynthesis.getVoices().length) {
        finish();
      }
    }, 75);

    window.setTimeout(finish, timeout);
  });
}

function choosePreferredVoice(voices) {
  const mandarinVoices = voices.filter(isSimplifiedMandarinVoice);
  return mandarinVoices
    .map((voice) => ({ voice, score: scoreMandarinVoice(voice) }))
    .sort((a, b) => b.score - a.score)[0]?.voice || null;
}

function scoreMandarinVoice(voice) {
  const name = `${voice.name || ""} ${voice.voiceURI || ""}`.toLowerCase();
  const lang = (voice.lang || "").toLowerCase();
  let score = lang === "zh-cn" ? 140 : 100;

  if (name.includes("microsoft") && (name.includes("online") || name.includes("natural"))) score += 900;
  if (name.includes("xiaoxiao")) score += 820;
  if (name.includes("xiaoyi")) score += 760;
  if (name.includes("yunxi") || name.includes("yunyang")) score += 720;
  if (name.includes("microsoft")) score += 650;
  if (name.includes("google")) score += 560;
  if (name.includes("ting-ting") || name.includes("tingting") || name.includes("ting ting")) score += 500;
  if (name.includes("premium") || name.includes("enhanced") || name.includes("neural")) score += 420;
  if (name.includes("natural") || name.includes("siri")) score += 360;
  if (voice.localService === false) score += 90;
  if (name.includes("compact") || name.includes("eloquence")) score -= 260;

  return score;
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
  updateNavigationState();

  if (state.result) {
    stopVocabularyTimer();
    if (state.result.type === "vocabulary") {
      renderVocabularyResults();
    } else {
      renderResults();
    }
    return;
  }

  if (state.session) {
    renderSession();
    if (state.session.type === "vocabulary") {
      startVocabularyTimer();
    } else {
      stopVocabularyTimer();
    }
    return;
  }

  stopVocabularyTimer();
  if (state.tool === "vocabulary") {
    renderVocabularyHome();
    return;
  }

  renderModeHome();
}

function updateNavigationState() {
  document.body.dataset.tool = state.tool;
  document.body.dataset.mode = state.tool === "drill" ? state.mode : "vocabulary";
  document.querySelectorAll(".tool-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === state.tool);
  });
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
  document.querySelectorAll("[data-vocabulary-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.vocabularyMode === state.vocabularyMode);
  });
}

function shortcutHint(key, options = {}) {
  const commandControl = options.commandControl || false;
  const label = commandControl ? `Command or Control plus ${key}` : key;
  const modifierMarkup = commandControl
    ? `<kbd>⌘</kbd><span class="shortcut-separator">/</span><kbd>Ctrl</kbd><span class="shortcut-plus">+</span>`
    : "";

  return `
    <span class="shortcut-hint" aria-label="${label}">
      ${modifierMarkup}<kbd>${key}</kbd>
    </span>
  `;
}

function renderModeHome() {
  const mode = MODES[state.mode];
  const preview = PREVIEW_CELLS[state.mode];
  const hasEnoughSentences = getSelectedSentenceCount() >= SESSION_LENGTH;
  const startLabel = state.isLoadingSentences ? "Loading sentence bank..." : "Start 30-sentence session";

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="mode-heading">
        <div>
          <h2>${mode.label} Training</h2>
          <p>${mode.task}</p>
        </div>
      </div>

      <div class="task-preview" aria-hidden="true">
        <div class="preview-cell">
          <strong>${preview.character}</strong>
          <span>${preview.description}</span>
        </div>
      </div>

      ${hasEnoughSentences ? "" : `
        <p class="empty-note">
          Select at least ${SESSION_LENGTH} available sentences before starting a session.
        </p>
      `}
      ${state.dataError ? `<p class="empty-note error-note">${escapeHtml(state.dataError)}</p>` : ""}

      <button class="primary-btn shortcut-btn" type="button" id="startSession" ${hasEnoughSentences && !state.isLoadingSentences ? "" : "disabled"}>
        <span>${startLabel}</span>
        ${shortcutHint("Enter")}
      </button>
    </section>
  `;

  document.querySelector("#startSession").addEventListener("click", startSession);
}

function renderVocabularyHome() {
  const mode = VOCABULARY_MODES[state.vocabularyMode];
  const selectedSet = getSelectedVocabularySet();
  const wordCount = selectedSet?.words.length || 0;
  const timeLimit = formatTimer(determineVocabularyTimeLimit(wordCount));
  const canStart = Boolean(selectedSet && wordCount);
  const startLabel = wordCount
    ? `Start ${wordCount}-word ${state.vocabularyMode === "meaning" ? "audio quiz" : "timed quiz"}`
    : "No vocabulary sets loaded";
  const previewRows = selectedSet
    ? buildVocabularyPreviewRows(selectedSet.words, VOCABULARY_PREVIEW_LIMIT)
    : "";
  const previewNote = selectedSet && wordCount > VOCABULARY_PREVIEW_LIMIT
    ? `<p class="table-note">Showing ${VOCABULARY_PREVIEW_LIMIT} of ${wordCount} words. The full list appears in the quiz.</p>`
    : "";

  app.innerHTML = `
    <section class="workspace-panel vocabulary-home">
      <div class="mode-heading">
        <div>
          <h2>${mode.label} Vocabulary Quiz</h2>
          <p>${mode.task}</p>
        </div>
      </div>

      <div class="quiz-config">
        <label class="field">
          <span>Quiz</span>
          <select id="vocabularySet" ${VOCABULARY_QUIZ_SETS.length ? "" : "disabled"}>
            ${VOCABULARY_QUIZ_SETS.map((set) => `
              <option value="${set.id}" ${set.id === state.vocabularySetId ? "selected" : ""}>${escapeHtml(formatVocabularySetOption(set))}</option>
            `).join("")}
          </select>
        </label>

        <label class="field">
          <span>Order</span>
          <select id="vocabularyOrder">
            ${Object.entries(VOCABULARY_ORDER_OPTIONS).map(([id, label]) => `
              <option value="${id}" ${id === state.vocabularyOrder ? "selected" : ""}>${label}</option>
            `).join("")}
          </select>
        </label>
      </div>

      <div class="quiz-start-strip">
        <div>
          <strong>${wordCount}</strong>
          <span>Words</span>
        </div>
        <div>
          <strong>${timeLimit}</strong>
          <span>Timer</span>
        </div>
        <button class="primary-btn shortcut-btn" type="button" id="startVocabularySession" ${canStart ? "" : "disabled"}>
          <span>${startLabel}</span>
          ${shortcutHint("Enter")}
        </button>
      </div>

      ${canStart ? "" : `
        <p class="empty-note error-note">
          The vocabulary quiz data could not be loaded.
        </p>
      `}

      ${selectedSet ? `
        <div class="vocab-table-section">
          <div class="vocab-section-heading">
            <h3>Word List Preview</h3>
            <span>${escapeHtml(selectedSet.label)}</span>
          </div>
          <div class="vocab-table-wrap preview-table-wrap" tabindex="0">
            <table class="vocab-table">
              <thead>
                <tr>
                  <th>Character</th>
                  <th>Pinyin</th>
                  <th>Translation</th>
                </tr>
              </thead>
              <tbody>${previewRows}</tbody>
            </table>
          </div>
          ${previewNote}
        </div>
      ` : ""}
    </section>
  `;

  document.querySelector("#vocabularySet").addEventListener("change", (event) => {
    state.vocabularySetId = event.target.value;
    state.result = null;
    saveSettings();
    render();
  });

  document.querySelector("#vocabularyOrder").addEventListener("change", (event) => {
    state.vocabularyOrder = event.target.value;
    state.result = null;
    saveSettings();
    render();
  });

  document.querySelector("#startVocabularySession").addEventListener("click", startVocabularySession);
}

function formatVocabularySetOption(set) {
  const label = set.label || set.shortLabel;
  const count = set.words?.length || 0;
  return `${label} (${count} words)`;
}

function renderSession() {
  if (state.session?.type === "vocabulary") {
    renderVocabularySession();
    return;
  }

  const session = state.session;
  const current = session.items[session.index];
  const mode = MODES[session.mode];
  const submitted = Boolean(session.currentAssessment);
  const answer = submitted ? session.currentAssessment.answer : "";
  const sessionLength = session.items.length;
  const progressPercent = Math.round((session.index / sessionLength) * 100);
  const sentenceMarkup = buildSentenceMarkup(current, session.mode);
  const feedbackMarkup = submitted ? buildFeedbackMarkup(session.currentAssessment, current) : "";

  app.innerHTML = `
    <section class="workspace-panel session-shell">
      <div class="progress-row">
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <span class="progress-label">Sentence ${session.index + 1} of ${sessionLength}</span>
      </div>

      <div class="sentence-card">
        <span class="sentence-label">${mode.sentenceLabel}</span>
        ${sentenceMarkup}
      </div>

      <form class="answer-form" id="answerForm">
        <textarea
          id="answerInput"
          lang="${session.mode === "writing" ? "zh-CN" : "en"}"
          class="${session.mode === "writing" ? "chinese-text" : ""}"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          enterkeyhint="done"
          placeholder="${mode.answerPlaceholder}"
          ${submitted ? "disabled" : ""}
        >${escapeHtml(answer)}</textarea>
        <div class="form-actions">
          ${
            submitted
              ? `<button class="primary-btn shortcut-btn" type="button" id="nextQuestion">
                  <span>${session.index + 1 === sessionLength ? "View results" : "Next sentence"}</span>
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
    revealFeedbackPanel();
  } else {
    const form = document.querySelector("#answerForm");
    const input = document.querySelector("#answerInput");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitAnswer(input.value);
    });
    if (!isTouchLikeDevice()) {
      input.focus();
    }
  }
}

function renderVocabularySession() {
  if (state.session?.quizMode === "meaning") {
    renderVocabularyMeaningSession();
    return;
  }

  renderVocabularyPinyinSession();
}

function renderVocabularyPinyinSession() {
  const session = state.session;
  const mode = VOCABULARY_MODES[session.quizMode];
  const sessionLength = session.items.length;
  const foundCount = session.foundIds.size;
  const progressPercent = Math.round((foundCount / sessionLength) * 100);
  const remaining = getVocabularyRemainingSeconds(session);
  const rows = buildVocabularyQuizRows(session);

  app.innerHTML = `
    <section class="workspace-panel session-shell vocabulary-session">
      <div class="quiz-play-header">
        <div class="quiz-meter">
          <span>Score</span>
          <strong id="vocabularyScore">${foundCount}/${sessionLength}</strong>
        </div>
        <div class="quiz-meter">
          <span>Timer</span>
          <strong id="vocabularyTimer">${formatTimer(remaining)}</strong>
        </div>
        <button class="ghost-btn" type="button" id="endSession">End quiz</button>
      </div>

      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" id="vocabularyProgress" style="width: ${progressPercent}%"></div>
      </div>

      <form class="vocab-guess-form" id="vocabularyGuessForm">
        <label class="field">
          <span>Answer</span>
          <input
            id="vocabularyGuess"
            class="answer-input"
            type="text"
            lang="en"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            enterkeyhint="done"
            placeholder="${mode.answerPlaceholder}"
          >
        </label>
        <button class="secondary-btn shortcut-btn" type="submit">
          <span>Submit</span>
          ${shortcutHint("Enter")}
        </button>
      </form>

      <div class="vocab-table-section">
        <div class="vocab-section-heading">
          <h3>${escapeHtml(session.setLabel)}</h3>
          <span>${foundCount} found, ${sessionLength - foundCount} left</span>
        </div>
        <div class="vocab-table-wrap" tabindex="0">
          <table class="vocab-table">
            <thead>
              <tr>
                <th>Character</th>
                <th>Pinyin</th>
                <th>Translation</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);

  const form = document.querySelector("#vocabularyGuessForm");
  const input = document.querySelector("#vocabularyGuess");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitVocabularyGuess(input.value);
  });
  input.addEventListener("input", () => {
    submitVocabularyGuess(input.value, { live: true });
  });
  if (!isTouchLikeDevice()) {
    input.focus();
  }
}

function renderVocabularyMeaningSession() {
  const session = state.session;
  const mode = VOCABULARY_MODES[session.quizMode];
  const current = session.items[session.index];
  const submitted = Boolean(session.currentAssessment);
  const answer = submitted ? session.currentAssessment.answer : "";
  const sessionLength = session.items.length;
  const answeredCount = session.answers.length;
  const correctCount = session.answers.filter((entry) => entry.correct).length;
  const progressPercent = Math.round((answeredCount / sessionLength) * 100);
  const remaining = getVocabularyRemainingSeconds(session);
  const feedbackMarkup = submitted ? buildVocabularyFeedbackMarkup(session.currentAssessment, current) : "";

  app.innerHTML = `
    <section class="workspace-panel session-shell vocabulary-session">
      <div class="quiz-play-header">
        <div class="quiz-meter">
          <span>Score</span>
          <strong id="vocabularyScore">${correctCount}/${sessionLength}</strong>
        </div>
        <div class="quiz-meter">
          <span>Timer</span>
          <strong id="vocabularyTimer">${formatTimer(remaining)}</strong>
        </div>
        <button class="ghost-btn" type="button" id="endSession">End quiz</button>
      </div>

      <div class="progress-row">
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" id="vocabularyProgress" style="width: ${progressPercent}%"></div>
        </div>
        <span class="progress-label">Word ${session.index + 1} of ${sessionLength}</span>
      </div>

      <div class="sentence-card">
        <span class="sentence-label">${mode.promptLabel}</span>
        ${buildVocabularyPromptMarkup(current, session.quizMode)}
      </div>

      <form class="answer-form" id="answerForm">
        <textarea
          id="answerInput"
          lang="en"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          enterkeyhint="done"
          placeholder="${mode.answerPlaceholder}"
          ${submitted ? "disabled" : ""}
        >${escapeHtml(answer)}</textarea>
        <div class="form-actions">
          ${
            submitted
              ? `<button class="primary-btn shortcut-btn" type="button" id="nextQuestion">
                  <span>${session.index + 1 === sessionLength ? "View results" : "Next word"}</span>
                  ${shortcutHint("Enter")}
                </button>`
              : `<button class="primary-btn shortcut-btn" type="submit">
                  <span>Check meaning</span>
                  ${shortcutHint("Enter")}
                </button>`
          }
          <button class="ghost-btn" type="button" id="endSessionSecondary">End quiz</button>
        </div>
      </form>

      ${feedbackMarkup}
    </section>
  `;

  document.querySelector("#playAudio")?.addEventListener("click", () => speak(current.zh));
  document.querySelector("#endSession").addEventListener("click", finishSessionEarly);
  document.querySelector("#endSessionSecondary").addEventListener("click", finishSessionEarly);

  if (submitted) {
    document.querySelector("#nextQuestion").addEventListener("click", nextQuestion);
    revealFeedbackPanel();
    return;
  }

  const form = document.querySelector("#answerForm");
  const input = document.querySelector("#answerInput");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAnswer(input.value);
  });
  if (!isTouchLikeDevice()) {
    input.focus();
  }
}

function buildVocabularyPromptMarkup(item, quizMode) {
  if (quizMode === "pinyin") {
    return `<p class="sentence-text zh quiz-word chinese-text" lang="zh-CN">${escapeHtml(item.zh)}</p>`;
  }

  return `
    <div class="audio-sentence">
      <button class="secondary-btn shortcut-btn" type="button" id="playAudio" ${supportsSpeechSynthesis() ? "" : "disabled"}>
        <span>Play word</span>
        ${shortcutHint("Enter", { commandControl: true })}
      </button>
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

function buildVocabularyFeedbackMarkup(assessment, item) {
  const status = answerStatusTone(assessment);
  const title = answerStatusLabel(assessment);
  const expectedPrimary = assessment.quizMode === "pinyin"
    ? item.pinyin
    : formatVocabularyMeanings(item);
  const referenceMarkup = assessment.quizMode === "pinyin"
    ? `
      <div class="answer-pair">
        ${buildAnswerBox("Word", item.zh)}
        ${buildAnswerBox("Meaning", formatVocabularyMeanings(item))}
      </div>
    `
    : `
      <div class="answer-pair">
        ${buildAnswerBox("Word", item.zh)}
        ${buildAnswerBox("Pinyin", item.pinyin)}
      </div>
    `;

  return `
    <section class="feedback ${status}" id="feedbackPanel" tabindex="-1">
      <div class="feedback-title">
        <span>${title}</span>
        <span class="score-badge">${Math.round(assessment.score * 100)}%</span>
      </div>
      <div class="answer-pair">
        <div class="answer-box">
          <span class="answer-box-label">Your answer</span>
          ${buildPlainAnswerText(assessment.answer || "No answer entered")}
        </div>
        ${buildAnswerBox(assessment.quizMode === "pinyin" ? "Expected pinyin" : "Expected meaning", expectedPrimary)}
      </div>
      ${referenceMarkup}
    </section>
  `;
}

function buildSentenceMarkup(item, mode) {
  if (mode === "writing") {
    return `<p class="sentence-text">${escapeHtml(item.en)}</p>`;
  }

  if (mode === "reading") {
    return `<p class="sentence-text zh chinese-text" lang="zh-CN">${escapeHtml(item.zh)}</p>`;
  }

  return `
    <div class="audio-sentence">
      <button class="secondary-btn shortcut-btn" type="button" id="playAudio" ${supportsSpeechSynthesis() ? "" : "disabled"}>
        <span>Play sentence</span>
        ${shortcutHint("Enter", { commandControl: true })}
      </button>
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

function revealFeedbackPanel() {
  const panel = document.querySelector("#feedbackPanel");
  if (!panel) {
    return;
  }

  const scrollToFeedback = () => {
    panel.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  requestAnimationFrame(() => {
    window.setTimeout(scrollToFeedback, window.visualViewport ? 180 : 80);
  });
}

function buildFeedbackMarkup(assessment, item) {
  const status = answerStatusTone(assessment);
  const title = answerStatusLabel(assessment);
  const expectedPrimary = assessment.mode === "writing" ? item.zh : item.en;
  const expectedSecondary = assessment.mode === "writing" ? item.en : item.zh;
  return `
    <section class="feedback ${status}" id="feedbackPanel" tabindex="-1">
      <div class="feedback-title">
        <span>${title}</span>
        <span class="score-badge">${Math.round(assessment.score * 100)}%</span>
      </div>
      <div class="answer-pair">
        <div class="answer-box">
          <span class="answer-box-label">Your answer</span>
          ${buildPlainAnswerText(assessment.answer || "No answer entered")}
        </div>
        ${buildAnswerBox("Expected", expectedPrimary)}
      </div>
      ${buildAnswerBox("Reference", expectedSecondary)}
    </section>
  `;
}

function answerStatusLabel(answer) {
  const scorePercent = Math.round(answer.score * 100);
  if (scorePercent >= 100) return "Perfect";
  if (scorePercent >= 70) return "Good";
  if (scorePercent > 50) return "Okay";
  return "Review needed";
}

function answerStatusTone(answer) {
  const scorePercent = Math.round(answer.score * 100);
  if (scorePercent >= 70) return "good";
  if (scorePercent > 50) return "okay";
  return "review";
}

function buildPlainAnswerText(value) {
  const className = containsChinese(value) ? ` class="answer-text chinese-text"` : ` class="answer-text"`;
  const lang = containsChinese(value) ? ` lang="zh-CN"` : "";
  return `<p${className}${lang}>${escapeHtml(value)}</p>`;
}

function buildAnswerBox(label, value) {
  return `
    <div class="answer-box">
      <span class="answer-box-label">${label}</span>
      ${buildAnswerBoxText(value)}
    </div>
  `;
}

function buildAnswerBoxText(value) {
  if (!containsChinese(value)) {
    return `<p>${escapeHtml(value)}</p>`;
  }

  return buildAnnotatedChineseMarkup(value);
}

function buildAnnotatedChineseMarkup(value) {
  hydrateWordDataFromWindow();
  const tokens = tokenizeAnnotatedChinese(value);
  const textMarkup = tokens.map(buildAnnotatedTextTokenMarkup).join("");
  const pinyinMarkup = tokens.map(buildAnnotatedPinyinTokenMarkup).join("");

  return `
    <div class="annotated-chinese chinese-text" lang="zh-CN">
      <p class="annotated-hanzi-line">${textMarkup}</p>
      <p class="annotated-pinyin-line">${pinyinMarkup}</p>
    </div>
  `;
}

function tokenizeAnnotatedChinese(value) {
  const tokens = [];
  let index = 0;

  while (index < value.length) {
    const character = value[index];
    if (!isChineseCharacter(character)) {
      tokens.push({ type: "punctuation", text: character });
      index += 1;
      continue;
    }

    const word = findAnnotatedWord(value, index);
    tokens.push({ type: "word", text: word, entry: CHINESE_WORD_DATA[word] || {} });
    index += word.length;
  }

  return tokens;
}

function findAnnotatedWord(value, index) {
  const maxLength = Math.min(MAX_CHINESE_WORD_LENGTH, value.length - index);

  for (let length = maxLength; length > 0; length -= 1) {
    const candidate = value.slice(index, index + length);
    if (isChineseText(candidate) && Object.prototype.hasOwnProperty.call(CHINESE_WORD_DATA, candidate)) {
      return candidate;
    }
  }

  return value[index];
}

function buildAnnotatedTextTokenMarkup(token) {
  if (token.type !== "word") {
    return `<span class="annotation-punctuation">${escapeHtml(token.text)}</span>`;
  }

  const gloss = token.entry.gloss || "";
  const glossAttributes = gloss
    ? ` has-gloss" title="${escapeHtml(gloss)}" data-gloss="${escapeHtml(gloss)}" tabindex="0"`
    : `"`;

  return `<span class="annotated-word${glossAttributes}>${escapeHtml(token.text)}</span>`;
}

function buildAnnotatedPinyinTokenMarkup(token) {
  if (token.type !== "word") {
    return `<span class="annotation-pinyin-punctuation">${escapeHtml(token.text)}</span>`;
  }

  return `<span class="annotation-pinyin-word">${escapeHtml(token.entry.pinyin || "")}</span>`;
}

function alignGlossTooltip(wordElement) {
  const tooltipWidth = measureGlossTooltipWidth(wordElement.dataset.gloss || "");
  const rect = wordElement.getBoundingClientRect();
  const edgePadding = 12;
  const centeredLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
  const centeredRight = centeredLeft + tooltipWidth;

  if (centeredLeft < edgePadding) {
    wordElement.dataset.tooltipAlign = "left";
    return;
  }

  if (centeredRight > window.innerWidth - edgePadding) {
    wordElement.dataset.tooltipAlign = "right";
    return;
  }

  wordElement.dataset.tooltipAlign = "center";
}

function measureGlossTooltipWidth(gloss) {
  const maxWidth = Math.min(260, Math.max(120, window.innerWidth - 24));
  const measurer = getGlossTooltipMeasurer();
  measurer.style.maxWidth = `${maxWidth}px`;
  measurer.textContent = gloss;
  return Math.min(Math.ceil(measurer.getBoundingClientRect().width), maxWidth);
}

function getGlossTooltipMeasurer() {
  const existing = document.querySelector("#glossTooltipMeasurer");
  if (existing) {
    return existing;
  }

  const measurer = document.createElement("span");
  measurer.id = "glossTooltipMeasurer";
  measurer.className = "gloss-tooltip-measurer";
  document.body.append(measurer);
  return measurer;
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
      const statusClass = `status-${answerStatusTone(answer)}`;
      const statusText = answerStatusLabel(answer);
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
          <p>${correct} correct out of ${result.answers.length}; average score ${percent}%.</p>
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
          <span>Correct</span>
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

function renderVocabularyResults() {
  const result = state.result;
  if (result.quizMode === "meaning") {
    renderVocabularyMeaningResults();
    return;
  }

  const foundIds = new Set(result.foundIds || []);
  const total = result.items.length;
  const correct = foundIds.size;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const resultLabel = result.finishReason === "complete"
    ? "Completed"
    : result.finishReason === "time"
      ? "Time expired"
      : "Ended";
  const rows = result.items
    .map((item, index) => {
      const id = vocabularyItemId(item, index);
      const found = foundIds.has(id);
      return `
        <tr class="${found ? "found" : "missed"}">
          <td>${index + 1}</td>
          <td class="chinese-text">${escapeHtml(item.zh)}</td>
          <td>${escapeHtml(item.pinyin)}</td>
          <td>${escapeHtml(formatVocabularyMeanings(item))}</td>
          <td class="${found ? "status-good" : "status-review"}">${found ? "Found" : "Missed"}</td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="results-header">
        <div>
          <h2>Vocabulary Results</h2>
          <p>${resultLabel}: ${correct} of ${total} words found in ${formatTimer(result.elapsedSeconds)}.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another quiz</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to quiz</button>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat">
          <strong>${correct}/${total}</strong>
          <span>Score</span>
        </div>
        <div class="stat">
          <strong>${percent}%</strong>
          <span>Found</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.elapsedSeconds)}</strong>
          <span>Time used</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.timeLimitSeconds)}</strong>
          <span>Time limit</span>
        </div>
      </div>

      <div class="results-table-wrap vocab-table-wrap" tabindex="0">
        <table class="vocab-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Character</th>
              <th>Pinyin</th>
              <th>Translation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", startVocabularySession);
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    render();
  });
}

function renderVocabularyMeaningResults() {
  const result = state.result;
  const total = result.items.length;
  const answered = result.answers.length;
  const correct = result.answers.filter((answer) => answer.correct).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const resultLabel = result.finishReason === "complete"
    ? "Completed"
    : result.finishReason === "time"
      ? "Time expired"
      : "Ended";
  const answersByIndex = new Map(result.answers.map((answer) => [answer.itemIndex, answer]));
  const rows = result.items
    .map((item, index) => {
      const answer = answersByIndex.get(index);
      const statusTone = answer ? answerStatusTone(answer) : "review";
      const statusText = answer ? answerStatusLabel(answer) : "Unanswered";
      return `
        <tr class="${answer?.correct ? "found" : "missed"}">
          <td>${index + 1}</td>
          <td class="chinese-text">${escapeHtml(item.zh)}</td>
          <td>${escapeHtml(item.pinyin)}</td>
          <td>${escapeHtml(answer?.answer || "No answer entered")}</td>
          <td>${escapeHtml(formatVocabularyMeanings(item))}</td>
          <td>${answer ? `${Math.round(answer.score * 100)}%` : "0%"}</td>
          <td class="status-${statusTone}">${statusText}</td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="workspace-panel">
      <div class="results-header">
        <div>
          <h2>Audio Vocabulary Results</h2>
          <p>${resultLabel}: ${correct} correct out of ${total}; ${answered} answered in ${formatTimer(result.elapsedSeconds)}.</p>
        </div>
        <div class="result-actions">
          <button class="secondary-btn shortcut-btn" type="button" id="restartSession">
            <span>Start another quiz</span>
            ${shortcutHint("Enter")}
          </button>
          <button class="ghost-btn" type="button" id="backToModes">Back to quiz</button>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat">
          <strong>${correct}/${total}</strong>
          <span>Score</span>
        </div>
        <div class="stat">
          <strong>${percent}%</strong>
          <span>Correct</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.elapsedSeconds)}</strong>
          <span>Time used</span>
        </div>
        <div class="stat">
          <strong>${formatTimer(result.timeLimitSeconds)}</strong>
          <span>Time limit</span>
        </div>
      </div>

      <div class="results-table-wrap vocab-table-wrap" tabindex="0">
        <table class="vocab-table audio-results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Character</th>
              <th>Pinyin</th>
              <th>Your answer</th>
              <th>Expected meaning</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;

  document.querySelector("#restartSession").addEventListener("click", startVocabularySession);
  document.querySelector("#backToModes").addEventListener("click", () => {
    state.result = null;
    state.session = null;
    render();
  });
}

function startActiveSession() {
  if (state.tool === "vocabulary") {
    startVocabularySession();
    return;
  }

  startSession();
}

async function startSession() {
  if (state.isLoadingSentences) {
    return;
  }

  stopSpeech();
  state.dataError = "";
  state.isLoadingSentences = true;
  render();

  try {
    await ensureSentenceData();
  } catch {
    state.dataError = "The sentence bank could not be loaded. Check your connection and try again.";
    state.isLoadingSentences = false;
    render();
    return;
  }

  state.isLoadingSentences = false;
  const pool = shuffle(getFilteredPool());
  if (pool.length < SESSION_LENGTH) {
    render();
    return;
  }

  const items = pool.slice(0, SESSION_LENGTH);

  state.result = null;
  state.session = {
    type: "drill",
    mode: state.mode,
    levels: [...state.selectedLevels],
    items,
    index: 0,
    answers: [],
    currentAssessment: null,
  };

  render();
  queueIdleTask(() => {
    ensureWordData().catch(() => {});
  });
  if (state.mode === "listening") {
    speak(state.session.items[0].zh);
  }
}

function startVocabularySession() {
  const selectedSet = getSelectedVocabularySet();
  if (!selectedSet?.words.length) {
    return;
  }

  stopSpeech();
  const items = state.vocabularyOrder === "random"
    ? shuffle(selectedSet.words)
    : [...selectedSet.words];
  const timeLimitSeconds = determineVocabularyTimeLimit(items.length);
  const startedAt = Date.now();

  state.result = null;
  state.session = {
    type: "vocabulary",
    quizMode: state.vocabularyMode,
    setId: selectedSet.id,
    setLabel: selectedSet.label,
    setShortLabel: selectedSet.shortLabel,
    order: state.vocabularyOrder,
    items,
    index: 0,
    foundIds: new Set(),
    answers: [],
    currentAssessment: null,
    startedAt,
    endsAt: startedAt + timeLimitSeconds * 1000,
    timeLimitSeconds,
  };

  saveSettings();
  render();
  if (state.session.quizMode === "meaning") {
    speak(state.session.items[0].zh);
  }
}

function submitVocabularyGuess(answer, options = {}) {
  const session = state.session;
  if (session?.type !== "vocabulary" || session.quizMode !== "pinyin") {
    return;
  }

  const trimmed = answer.trim();
  if (!trimmed) {
    return;
  }

  const matches = findVocabularyGuessMatches(trimmed, session);
  if (!matches.length) {
    return;
  }

  const foundAt = Math.max(0, Math.round((Date.now() - session.startedAt) / 1000));
  matches.forEach(({ item, id }) => {
    session.foundIds.add(id);
    session.answers.push({
      answer: trimmed,
      correct: true,
      foundAt,
      item,
      score: 1,
    });
  });

  if (session.foundIds.size >= session.items.length) {
    finishVocabularySession("complete");
    return;
  }

  if (options.live) {
    const input = document.querySelector("#vocabularyGuess");
    if (input) {
      input.value = "";
    }
    updateVocabularySessionMetrics(session);
    return;
  }

  render();
}

async function submitAnswer(answer) {
  if (state.isCheckingAnswer) {
    return;
  }

  const session = state.session;
  if (!session) {
    return;
  }

  state.isCheckingAnswer = true;
  document.activeElement?.blur?.();

  try {
    await ensureWordData();
  } catch {
    // Annotation is a convenience; answer checking should still work if the glossary fails.
  }

  if (state.session !== session) {
    state.isCheckingAnswer = false;
    return;
  }

  const item = session.items[session.index];
  const assessment = session.type === "vocabulary"
    ? assessVocabularyAnswer(answer, item, session.quizMode)
    : assessAnswer(answer, item, session.mode);
  session.currentAssessment = assessment;
  session.answers.push({
    ...assessment,
    item,
    ...(session.type === "vocabulary" ? { itemIndex: session.index } : {}),
  });
  state.isCheckingAnswer = false;
  render();
}

function nextQuestion() {
  const session = state.session;
  const sessionLength = session.items.length;

  if (session.index + 1 >= sessionLength) {
    state.result = buildSessionResult(
      session.type === "vocabulary"
        ? { ...session, finishReason: "complete" }
        : session,
    );
    state.session = null;
    stopSpeech();
    render();
    return;
  }

  session.index += 1;
  session.currentAssessment = null;
  render();

  if (sessionUsesAudioPrompt(session)) {
    speak(session.items[session.index].zh);
  }
}

function finishSessionEarly() {
  const session = state.session;
  if (session?.type === "vocabulary") {
    finishVocabularySession("ended");
    return;
  }

  if (!session.answers.length) {
    state.session = null;
    stopSpeech();
    render();
    return;
  }

  state.result = buildSessionResult(session);
  state.session = null;
  stopSpeech();
  render();
}

function finishVocabularySession(reason) {
  const session = state.session;
  if (session?.type !== "vocabulary") {
    return;
  }

  state.result = buildSessionResult({ ...session, finishReason: reason });
  state.session = null;
  stopVocabularyTimer();
  render();
}

function buildSessionResult(session) {
  if (session.type === "vocabulary") {
    const elapsedSeconds = Math.min(
      session.timeLimitSeconds,
      Math.max(0, Math.round((Date.now() - session.startedAt) / 1000)),
    );
    return {
      type: "vocabulary",
      quizMode: session.quizMode,
      setId: session.setId,
      setLabel: session.setLabel,
      setShortLabel: session.setShortLabel,
      order: session.order,
      items: session.items,
      foundIds: [...session.foundIds],
      answers: session.answers,
      elapsedSeconds,
      finishReason: session.finishReason || "ended",
      timeLimitSeconds: session.timeLimitSeconds,
    };
  }

  return {
    type: "drill",
    mode: session.mode,
    levels: session.levels,
    answers: session.answers,
  };
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

function assessVocabularyAnswer(answer, item, quizMode) {
  const trimmed = answer.trim();
  const score = quizMode === "pinyin"
    ? scorePinyin(trimmed, item)
    : scoreVocabularyMeaning(trimmed, item);

  return {
    quizMode,
    answer: trimmed,
    score,
    correct: score >= ACCEPTANCE_THRESHOLD,
  };
}

function scorePinyin(actual, item) {
  const normalizedActual = normalizePinyinForCompare(actual);
  if (!normalizedActual) return 0;

  const expectedVariants = getVocabularyPinyinVariants(item)
    .map(normalizePinyinForCompare)
    .filter(Boolean);
  const compactActual = compactPinyin(normalizedActual);

  if (expectedVariants.some((expected) => normalizedActual === expected || compactActual === compactPinyin(expected))) {
    return 1;
  }

  const actualBase = stripPinyinTones(normalizedActual);
  const compactActualBase = compactPinyin(actualBase);
  const expectedBases = expectedVariants.map(stripPinyinTones);

  if (expectedBases.some((expected) => actualBase === expected || compactActualBase === compactPinyin(expected))) {
    return 0.82;
  }

  const bestBaseSimilarity = Math.max(
    0,
    ...expectedBases.map((expected) => stringSimilarity(compactActualBase, compactPinyin(expected))),
  );
  const bestToneSimilarity = Math.max(
    0,
    ...expectedVariants.map((expected) => stringSimilarity(compactActual, compactPinyin(expected))),
  );

  return clamp(Math.max(bestBaseSimilarity * 0.68, bestToneSimilarity * 0.78), 0, 1);
}

function scoreVocabularyMeaning(actual, item) {
  if (!normalizeEnglish(actual)) return 0;
  const candidates = getVocabularyMeaningCandidates(item);
  return clamp(Math.max(0, ...candidates.map((candidate) => scoreEnglish(actual, candidate))), 0, 1);
}

function getVocabularyPinyinVariants(item) {
  return uniqueStrings([
    item.pinyin,
    item.numeric,
    ...(item.pinyinAlternates || []),
    ...(item.numericAlternates || []),
  ]);
}

function getVocabularyMeaningCandidates(item) {
  return uniqueStrings(item.meanings || [])
    .flatMap((meaning) => String(meaning).split(/[;/]/))
    .map((meaning) => meaning.trim())
    .filter(Boolean);
}

function formatVocabularyMeanings(item) {
  const meanings = getVocabularyMeaningCandidates(item);
  return meanings.length ? meanings.join("; ") : "No meaning listed";
}

function normalizePinyinForCompare(value) {
  return String(value)
    .normalize("NFC")
    .toLowerCase()
    .replace(/u:/g, "v")
    .replace(/ü/g, "v")
    .replace(/['’`]/g, " ")
    .replace(/[^a-z0-9āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňǹḿü:\s-]/g, " ")
    .split(/[\s-]+/)
    .map(convertPinyinSyllable)
    .filter(Boolean)
    .join(" ")
    .trim();
}

function convertPinyinSyllable(value) {
  const syllable = value.replace(/u:/g, "v").replace(/ü/g, "v");
  if (/[1-5]$/.test(syllable)) {
    return syllable.replace(/[^a-zv1-5]/g, "");
  }

  let base = "";
  let tone = "";
  [...syllable].forEach((character) => {
    const mark = PINYIN_TONE_MARKS[character];
    if (mark) {
      base += mark[0];
      tone = mark[1] || tone;
      return;
    }

    if (/[a-zv]/.test(character)) {
      base += character;
    }
  });

  return `${base}${tone}`;
}

function stripPinyinTones(value) {
  return String(value).replace(/[1-5]/g, "").replace(/\s+/g, " ").trim();
}

function compactPinyin(value) {
  return String(value).replace(/\s+/g, "");
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
    .replace(/[\u2018\u2019\u201b\u2032]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\bwon['’]?t\b/g, "will not")
    .replace(/\bcan['’]?t\b/g, "can not")
    .replace(/\bshan['’]?t\b/g, "shall not")
    .replace(/\blet['’]?s\b/g, "let us")
    .replace(/\bdo['’]?nt\b/g, "do not")
    .replace(/\bdoes['’]?nt\b/g, "does not")
    .replace(/\bdid['’]?nt\b/g, "did not")
    .replace(/\bis['’]?nt\b/g, "is not")
    .replace(/\bare['’]?nt\b/g, "are not")
    .replace(/\bwas['’]?nt\b/g, "was not")
    .replace(/\bwere['’]?nt\b/g, "were not")
    .replace(/\bhave['’]?nt\b/g, "have not")
    .replace(/\bhas['’]?nt\b/g, "has not")
    .replace(/\bhad['’]?nt\b/g, "had not")
    .replace(/\bshould['’]?nt\b/g, "should not")
    .replace(/\bcould['’]?nt\b/g, "could not")
    .replace(/\bwould['’]?nt\b/g, "would not")
    .replace(/\bmust['’]?nt\b/g, "must not")
    .replace(/\b([a-z]+)n't\b/g, "$1 not")
    .replace(/\bim\b/g, "i am")
    .replace(/\byoure\b/g, "you are")
    .replace(/\btheyre\b/g, "they are")
    .replace(/\b(i)'m\b/g, "$1 am")
    .replace(/\b(you|we|they)'re\b/g, "$1 are")
    .replace(/\b(i|you|we|they)['’]?ve\b/g, "$1 have")
    .replace(/\byoull\b/g, "you will")
    .replace(/\btheyll\b/g, "they will")
    .replace(/\b(i|you|he|she|it|we|they)'ll\b/g, "$1 will")
    .replace(/\byoud\b/g, "you would")
    .replace(/\btheyd\b/g, "they would")
    .replace(/\b(i|you|he|she|it|we|they)'d\b/g, "$1 would")
    .replace(/\b([a-z]+)'re\b/g, "$1 are")
    .replace(/\b([a-z]+)'ve\b/g, "$1 have")
    .replace(/\b([a-z]+)'ll\b/g, "$1 will")
    .replace(/\b([a-z]+)'d\b/g, "$1 would")
    .replace(/\b(he|she|it|that|there|what|who|where|when|why|how)['’]?s\b/g, "$1 is")
    .replace(/\b([a-z]+)['’]s\b/g, "$1")
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
  speechRequestId += 1;
  if (supportsSpeechSynthesis()) {
    window.speechSynthesis.cancel();
  }
  setPlaybackState(false);
}

async function speak(text) {
  if (!supportsSpeechSynthesis()) return;

  const requestId = speechRequestId + 1;
  speechRequestId = requestId;
  await waitForVoices();
  if (requestId !== speechRequestId) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = VOICE_SPEEDS[state.voiceSpeed] || VOICE_SPEEDS.normal;
  utterance.pitch = 1;
  utterance.volume = 1;

  state.preferredVoice = choosePreferredVoice(refreshVoices());
  if (state.preferredVoice) {
    utterance.voice = state.preferredVoice;
  }

  utterance.onstart = () => {
    if (requestId === speechRequestId) {
      setPlaybackState(true);
    }
  };
  utterance.onend = () => {
    if (requestId === speechRequestId) {
      setPlaybackState(false);
    }
  };
  utterance.onerror = () => {
    if (requestId === speechRequestId) {
      setPlaybackState(false);
    }
  };

  window.speechSynthesis.cancel();
  setPlaybackState(true);
  window.setTimeout(() => {
    if (requestId === speechRequestId) {
      window.speechSynthesis.speak(utterance);
    }
  }, 40);
}

function supportsSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function buildVocabularyQuizSets(sourceSets) {
  if (!Array.isArray(sourceSets) || !sourceSets.length) {
    return [];
  }

  const partSets = sourceSets.map((set) => ({
    id: set.id,
    label: set.label || set.shortLabel,
    shortLabel: set.shortLabel || set.label,
    level: set.level || set.shortLabel || set.label || "Vocabulary",
    words: dedupeVocabularyWords(set.words || []),
  }));
  const byLevel = [];
  partSets.forEach((set) => {
    const level = set.level || set.shortLabel || set.label || "Vocabulary";
    let group = byLevel.find((item) => item.level === level);
    if (!group) {
      group = { level, words: [] };
      byLevel.push(group);
    }
    group.words.push(...(set.words || []));
  });

  const levelSets = byLevel.map((group) => ({
    id: slugifyVocabularySetId(group.level),
    label: `${group.level} · All`,
    shortLabel: `${group.level} · All`,
    level: group.level,
    words: dedupeVocabularyWords(group.words),
  }));

  if (levelSets.length < 2) {
    return [...partSets, ...levelSets];
  }

  return [
    ...partSets,
    ...levelSets,
    {
      id: "new-hsk-1-2",
      label: "New HSK 1 + 2 · All",
      shortLabel: "New HSK 1 + 2 · All",
      level: "New HSK 1 + 2",
      words: dedupeVocabularyWords(levelSets.flatMap((set) => set.words)),
    },
  ];
}

function dedupeVocabularyWords(words) {
  const seen = new Set();
  return words.filter((word) => {
    const key = `${word.zh}::${word.pinyin}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function slugifyVocabularySetId(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildVocabularyPreviewRows(items, limit) {
  return items.slice(0, limit).map((item) => `
    <tr>
      <td class="chinese-text">${escapeHtml(item.zh)}</td>
      <td class="pinyin-slot muted-slot">Hidden during quiz</td>
      <td>${escapeHtml(formatVocabularyMeanings(item))}</td>
    </tr>
  `).join("");
}

function buildVocabularyQuizRows(session) {
  const currentId = getCurrentVocabularyRowId(session);
  return session.items.map((item, index) => {
    const id = vocabularyItemId(item, index);
    const found = session.foundIds.has(id);
    const current = !found && id === currentId;
    const rowClasses = [
      found ? "found" : "pending",
      current ? "current" : "",
    ].filter(Boolean).join(" ");

    return `
      <tr class="${rowClasses}" data-vocab-id="${escapeHtml(id)}" ${current ? `aria-current="true"` : ""}>
        <td class="chinese-text">${escapeHtml(item.zh)}</td>
        <td class="pinyin-slot">${found ? escapeHtml(item.pinyin) : ""}</td>
        <td>${escapeHtml(formatVocabularyMeanings(item))}</td>
      </tr>
    `;
  }).join("");
}

function getCurrentVocabularyRowId(session) {
  if (session?.type !== "vocabulary" || session.quizMode !== "pinyin") {
    return "";
  }

  const nextIndex = session.items.findIndex((item, index) => {
    const id = vocabularyItemId(item, index);
    return !session.foundIds.has(id);
  });

  return nextIndex >= 0
    ? vocabularyItemId(session.items[nextIndex], nextIndex)
    : "";
}

function findVocabularyGuessMatches(answer, session) {
  const normalizedAnswer = normalizePinyinForCompare(answer);
  if (!normalizedAnswer) {
    return [];
  }

  return session.items
    .map((item, index) => ({ item, id: vocabularyItemId(item, index) }))
    .filter(({ item, id }) => !session.foundIds.has(id) && isAcceptedVocabularyPinyinGuess(normalizedAnswer, item));
}

function isAcceptedVocabularyPinyinGuess(normalizedAnswer, item) {
  const compactAnswer = compactPinyin(normalizedAnswer);
  const toneFreeAnswer = stripPinyinTones(normalizedAnswer);
  const compactToneFreeAnswer = compactPinyin(toneFreeAnswer);

  return getVocabularyPinyinVariants(item)
    .map(normalizePinyinForCompare)
    .filter(Boolean)
    .some((expected) => {
      const compactExpected = compactPinyin(expected);
      const toneFreeExpected = stripPinyinTones(expected);
      const compactToneFreeExpected = compactPinyin(toneFreeExpected);

      return normalizedAnswer === expected ||
        compactAnswer === compactExpected ||
        toneFreeAnswer === toneFreeExpected ||
        compactToneFreeAnswer === compactToneFreeExpected;
    });
}

function vocabularyItemId(item, index) {
  return `${index}:${item.zh}:${item.pinyin}`;
}

function determineVocabularyTimeLimit(wordCount) {
  if (!wordCount) {
    return VOCABULARY_MIN_TIMER_SECONDS;
  }

  return Math.max(
    VOCABULARY_MIN_TIMER_SECONDS,
    Math.ceil((wordCount * VOCABULARY_SECONDS_PER_WORD) / 60) * 60,
  );
}

function getVocabularyRemainingSeconds(session) {
  if (!session?.endsAt) {
    return 0;
  }

  return Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
}

function formatTimer(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function startVocabularyTimer() {
  if (vocabularyTimerId || state.session?.type !== "vocabulary") {
    return;
  }

  vocabularyTimerId = window.setInterval(() => {
    const session = state.session;
    if (session?.type !== "vocabulary") {
      stopVocabularyTimer();
      return;
    }

    if (getVocabularyRemainingSeconds(session) <= 0) {
      finishVocabularySession("time");
      return;
    }

    updateVocabularySessionMetrics(session);
  }, 250);
}

function stopVocabularyTimer() {
  if (!vocabularyTimerId) {
    return;
  }

  window.clearInterval(vocabularyTimerId);
  vocabularyTimerId = 0;
}

function updateVocabularySessionMetrics(session) {
  const total = session.items.length;
  const found = session.quizMode === "pinyin"
    ? session.foundIds.size
    : session.answers.filter((answer) => answer.correct).length;
  const progressCount = session.quizMode === "pinyin"
    ? found
    : session.answers.length;
  const score = document.querySelector("#vocabularyScore");
  const timer = document.querySelector("#vocabularyTimer");
  const progress = document.querySelector("#vocabularyProgress");
  const tableSection = document.querySelector(".vocab-section-heading span");

  if (score) {
    score.textContent = `${found}/${total}`;
  }
  if (timer) {
    timer.textContent = formatTimer(getVocabularyRemainingSeconds(session));
  }
  if (progress) {
    progress.style.width = `${Math.round((progressCount / total) * 100)}%`;
  }
  if (tableSection) {
    tableSection.textContent = `${found} found, ${total - found} left`;
  }

  if (session.quizMode !== "pinyin") {
    return;
  }

  const currentId = getCurrentVocabularyRowId(session);
  session.items.forEach((item, index) => {
    const id = vocabularyItemId(item, index);
    const row = document.querySelector(`tr[data-vocab-id="${cssEscape(id)}"]`);
    if (!row) {
      return;
    }

    const isFound = session.foundIds.has(id);
    const isCurrent = !isFound && id === currentId;
    row.classList.toggle("found", isFound);
    row.classList.toggle("pending", !isFound);
    row.classList.toggle("current", isCurrent);
    if (isCurrent) {
      row.setAttribute("aria-current", "true");
    } else {
      row.removeAttribute("aria-current");
    }

    const pinyinCell = row.querySelector(".pinyin-slot");
    if (pinyinCell) {
      pinyinCell.textContent = isFound ? item.pinyin : "";
    }
  });
}

function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }

  return String(value).replace(/["\\]/g, "\\$&");
}

function getFilteredPool() {
  hydrateSentenceDataFromWindow();
  return SENTENCES.filter((item) => state.selectedLevels.has(item.level));
}

function getSelectedSentenceCount() {
  return [...state.selectedLevels].reduce((total, level) => total + (SENTENCE_COUNTS[level] || 0), 0);
}

function selectedLevelLabels(levelIds = [...state.selectedLevels]) {
  return levelIds.map(selectedLevelLabel).join(", ");
}

function selectedLevelLabel(levelId) {
  return LEVELS.find((level) => level.id === levelId)?.label || levelId;
}

function getSelectedVocabularySet() {
  return VOCABULARY_QUIZ_SETS.find((set) => set.id === state.vocabularySetId) || VOCABULARY_QUIZ_SETS[0] || null;
}

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function containsChinese(value) {
  return [...String(value)].some(isChineseCharacter);
}

function isChineseText(value) {
  return [...String(value)].every(isChineseCharacter);
}

function isChineseCharacter(value) {
  return HAN_CHARACTER_PATTERN.test(value);
}

function splitPinyinSyllables(value) {
  return String(value).trim().split(/\s+/).filter(Boolean);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
}

function isTouchLikeDevice() {
  return window.matchMedia?.("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
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
