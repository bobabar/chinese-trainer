const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const wordData = fs.readFileSync(path.join(ROOT, "word-data.js"), "utf8");
const vocabData = fs.readFileSync(path.join(ROOT, "vocab-data.js"), "utf8");
const appSource = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const queuedTimers = [];
const speechCalls = {
  cancel: 0,
  speak: [],
};
const localStorageEntries = new Map();

const context = {
  window: {
    ADDITIONAL_SENTENCES: [],
    addEventListener() {},
    clearInterval() {},
    setInterval: () => 1,
    setTimeout(callback) {
      queuedTimers.push(callback);
      return queuedTimers.length;
    },
    speechSynthesis: {
      addEventListener() {},
      cancel() {
        speechCalls.cancel += 1;
      },
      getVoices: () => [
        {
          lang: "zh-CN",
          localService: false,
          name: "Microsoft Xiaoxiao Online",
          voiceURI: "Microsoft Xiaoxiao Online",
        },
      ],
      speak(utterance) {
        speechCalls.speak.push(utterance.text);
        utterance.onstart?.();
      },
    },
  },
  document: {
    readyState: "loading",
    addEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
  },
  localStorage: {
    getItem: (key) => localStorageEntries.get(key) || null,
    setItem(key, value) {
      localStorageEntries.set(key, String(value));
    },
    removeItem(key) {
      localStorageEntries.delete(key);
    },
  },
  SpeechSynthesisUtterance: function SpeechSynthesisUtterance(text) {
    this.text = text;
  },
  console,
};

vm.createContext(context);
vm.runInContext(wordData, context, { filename: "word-data.js" });
vm.runInContext(vocabData, context, { filename: "vocab-data.js" });
vm.runInContext(`${appSource}
window.__tests = {
  VOCABULARY_MODES,
  VOCABULARY_QUIZ_SETS,
  assessVocabularyAnswer,
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  buildHistoryRecord,
  buildVocabularyQuizRows,
  buildVocabularyPromptMarkup,
  containsChinese,
  determineVocabularyTimeLimit,
  findVocabularyGuessMatches,
  getCurrentVocabularyRowId,
  getSelectedVocabularyIndex,
  getVocabularyHighScore,
  getVocabularyHighScoreRecords,
  getVocabularyResultStats,
  formatTimer,
  getSelectedVocabularySet,
  normalizeEnglish,
  normalizePinyinForCompare,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  sessionUsesAudioPrompt,
  speak,
  state,
  stopSpeech,
  vocabularyItemId,
};`, context, { filename: "app.js" });

const {
  VOCABULARY_MODES,
  VOCABULARY_QUIZ_SETS,
  assessVocabularyAnswer,
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  buildHistoryRecord,
  buildVocabularyQuizRows,
  buildVocabularyPromptMarkup,
  containsChinese,
  determineVocabularyTimeLimit,
  findVocabularyGuessMatches,
  getCurrentVocabularyRowId,
  getSelectedVocabularyIndex,
  getVocabularyHighScore,
  getVocabularyHighScoreRecords,
  getVocabularyResultStats,
  formatTimer,
  getSelectedVocabularySet,
  normalizeEnglish,
  normalizePinyinForCompare,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  sessionUsesAudioPrompt,
  speak,
  state,
  stopSpeech,
  vocabularyItemId,
} =
  context.window.__tests;
const annotated = buildAnswerBoxText("我爱你。");
const wordMarkup = buildAnnotatedChineseMarkup("我爱你。");
const firstVocabularySet = getSelectedVocabularySet();
const vocabularySetSizes = VOCABULARY_QUIZ_SETS.map((set) => set.words.length);
const hsk1VocabularySets = VOCABULARY_QUIZ_SETS.filter((set) => set.level === "New HSK 1");
const hsk2VocabularySets = VOCABULARY_QUIZ_SETS.filter((set) => set.level === "New HSK 2");
const allVocabularyWords = VOCABULARY_QUIZ_SETS.flatMap((set) => set.words);
const loveEntry = allVocabularyWords.find((item) => item.zh === "爱");
const hobbyEntry = allVocabularyWords.find((item) => item.zh === "爱好");

assert(containsChinese("Reference: 我爱你。"), "Chinese detection should find Han characters inside mixed text");
assert(annotated.includes("annotated-chinese"), "Chinese answer boxes should use annotated markup");
assert(annotated.includes("chinese-text"), "annotated Chinese should use the shared Chinese text styling");
assert(wordMarkup.includes("annotated-hanzi-line"), "annotated Chinese should include a separate Hanzi line");
assert(wordMarkup.includes("annotated-pinyin-line"), "annotated Chinese should include a separate pinyin line");
assert(wordMarkup.includes("data-gloss="), "annotated Chinese words should include gloss hover text");
assert(loveEntry, "test vocabulary should include 爱");
assert(hobbyEntry, "test vocabulary should include 爱好");
assert(
  scoreEnglish("He went to school.", "She went to school.", { ignoreGenderPronouns: true }) >= 0.99,
  "listening mode should keep he/she pronunciation ambiguity accepted",
);
assert(scoreEnglish("I am ready.", "I'm ready.") >= 0.99, "I am and I'm should be equivalent");
assert(scoreEnglish("You are right.", "You’re right.") >= 0.99, "curly apostrophe contractions should normalize");
assert(scoreEnglish("They have already left.", "Theyve already left.") >= 0.99, "missing apostrophe contractions should normalize");
assert(scoreEnglish("He will not go.", "He won't go.") >= 0.99, "negative contractions should normalize");
assert(scoreEnglish("Tom answer is correct.", "Tom's answer is correct.") >= 0.99, "possessive apostrophes should be lenient");
assert(normalizeEnglish("They were here.") === "they were here", "were should not be treated as we're");
assert(normalizeEnglish("I feel well today.") === "i feel well today", "well should not be treated as we'll");
assert(normalizeEnglish("Show me your ID.") === "show me your id", "id should not be treated as I'd");
assert(normalizeEnglish("Youre ready.") === "you are ready", "common missing apostrophe forms should still normalize");
assert(VOCABULARY_QUIZ_SETS.length === 10, "vocabulary quizzes should be split into ten comparable parts");
assert(hsk1VocabularySets.length === 4, "New HSK 1 vocabulary should stay in its own four quiz parts");
assert(hsk2VocabularySets.length === 6, "New HSK 2 vocabulary should stay in its own six quiz parts");
assert(vocabularySetSizes.every((size) => size === 125), "every vocabulary quiz part should have 125 words");
assert(!VOCABULARY_QUIZ_SETS.some((set) => set.level.includes("1 + 2")), "vocabulary quiz parts should not combine HSK 1 and HSK 2");
assert(state.vocabularyOrder === "random", "vocabulary quizzes should default to random order");
assert(state.vocabularyHideTranslations === false, "vocabulary translations should be visible unless the user hides them");
assert(VOCABULARY_MODES.meaning.label === "Audio", "vocabulary audio mode should be exposed as Audio");
assert(buildVocabularyPromptMarkup(loveEntry, "meaning").includes("Play word"), "audio vocabulary mode should render a word replay button");
assert(normalizePinyinForCompare("ài") === "ai4", "tone-mark pinyin should normalize to numeric tones");
assert(scorePinyin("ai4", loveEntry) >= 0.99, "numeric pinyin should be accepted");
assert(scorePinyin("ài", loveEntry) >= 0.99, "tone-mark pinyin should be accepted");
assert(scorePinyin("ai", loveEntry) >= 0.7, "tone-free pinyin should receive partial credit");
assert(scoreVocabularyMeaning("love", loveEntry) >= 0.99, "vocabulary meanings should match accepted meanings");
assert(assessVocabularyAnswer("love", loveEntry, "meaning").correct, "audio vocabulary mode should grade English meanings");
assert(sessionUsesAudioPrompt({ type: "vocabulary", quizMode: "meaning" }), "audio vocabulary mode should support replay shortcuts");
assert(!sessionUsesAudioPrompt({ type: "vocabulary", quizMode: "pinyin" }), "pinyin vocabulary mode should not use audio replay shortcuts");
assert(formatTimer(determineVocabularyTimeLimit(125)) === "15:00", "125-word vocabulary quiz should use a 15-minute timer");

const matchSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [loveEntry],
  foundIds: new Set(),
  selectedVocabularyIndex: 0,
};
assert(findVocabularyGuessMatches("ài", matchSession).length === 1, "tone-mark vocabulary answer should reveal a row");
assert(findVocabularyGuessMatches("ai4", matchSession).length === 1, "numeric-tone vocabulary answer should reveal a row");
assert(findVocabularyGuessMatches("ai", matchSession).length === 1, "tone-free vocabulary answer should reveal a row");

const compactPinyinSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [hobbyEntry],
  foundIds: new Set(),
  selectedVocabularyIndex: 0,
};
assert(findVocabularyGuessMatches("aihao", compactPinyinSession).length === 1, "tone-free compact pinyin should reveal a row");

const selectedOnlySession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [loveEntry, hobbyEntry],
  foundIds: new Set(),
  selectedVocabularyIndex: 0,
};
assert(
  findVocabularyGuessMatches("aihao", selectedOnlySession).length === 0,
  "pinyin answers should not reveal a non-selected row",
);
selectedOnlySession.selectedVocabularyIndex = 1;
assert(
  findVocabularyGuessMatches("aihao", selectedOnlySession).length === 1,
  "pinyin answers should reveal the manually selected row",
);

const highlightedRowSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [loveEntry, hobbyEntry],
  foundIds: new Set(),
  selectedVocabularyIndex: 0,
};
assert(
  getCurrentVocabularyRowId(highlightedRowSession) === vocabularyItemId(loveEntry, 0),
  "first pending vocabulary row should be current",
);
assert(
  buildVocabularyQuizRows(highlightedRowSession).includes('class="pending current selectable"'),
  "current vocabulary row should render with a highlight class",
);
highlightedRowSession.foundIds.add(vocabularyItemId(loveEntry, 0));
assert(
  getCurrentVocabularyRowId(highlightedRowSession) === vocabularyItemId(hobbyEntry, 1),
  "current vocabulary row should advance after a word is found",
);
assert(
  getSelectedVocabularyIndex(highlightedRowSession) === 1,
  "selected vocabulary index should fall forward to the next unanswered row",
);

const hiddenTranslationSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [loveEntry, hobbyEntry],
  foundIds: new Set(),
  selectedVocabularyIndex: 0,
  hideTranslations: true,
};
const hiddenTranslationRows = buildVocabularyQuizRows(hiddenTranslationSession);
assert(hiddenTranslationRows.includes("Hidden"), "hidden translation option should hide unanswered meanings");
assert(!hiddenTranslationRows.includes("to love"), "hidden translation option should not expose unanswered meanings");
hiddenTranslationSession.foundIds.add(vocabularyItemId(loveEntry, 0));
const revealedTranslationRows = buildVocabularyQuizRows(hiddenTranslationSession);
assert(revealedTranslationRows.includes("to love"), "hidden translation option should reveal answered meanings");

const audioRowSession = {
  type: "vocabulary",
  quizMode: "meaning",
  items: [loveEntry, hobbyEntry],
  foundIds: new Set(),
  answers: [],
  selectedVocabularyIndex: 0,
  index: 0,
};
const audioRows = buildVocabularyQuizRows(audioRowSession, { hideTranslation: true });
assert(audioRows.includes("Hidden"), "audio row table should hide translations during the quiz");
assert(!audioRows.includes("to love"), "audio row table should not expose the English meaning");
assert(audioRows.includes('<td class="muted-slot">Hidden</td>'), "audio row table should hide unanswered characters");
assert(!audioRows.includes('<td class="chinese-text">爱</td>'), "audio row table should not visibly expose unanswered characters");
assert(!audioRows.includes('<td class="pinyin-slot">ài</td>'), "audio row table should not visibly expose unanswered pinyin");
audioRowSession.answers.push({ item: loveEntry, itemIndex: 0, answer: "love", score: 1, correct: true });
const answeredAudioRows = buildVocabularyQuizRows(audioRowSession, { hideTranslation: true });
assert(answeredAudioRows.includes('<td class="chinese-text">爱</td>'), "audio row table should reveal answered characters");
assert(answeredAudioRows.includes('<td class="pinyin-slot">ài</td>'), "audio row table should reveal answered pinyin");

const completedPinyinResult = {
  type: "vocabulary",
  quizMode: "pinyin",
  setId: firstVocabularySet.id,
  setLabel: firstVocabularySet.label,
  order: [0, 1],
  items: [loveEntry, hobbyEntry],
  foundIds: [vocabularyItemId(loveEntry, 0), vocabularyItemId(hobbyEntry, 1)],
  answers: [],
  elapsedSeconds: 83,
  finishReason: "complete",
  timeLimitSeconds: 120,
};
const completedPinyinStats = getVocabularyResultStats(completedPinyinResult);
assert(completedPinyinStats.highScoreEligible, "complete perfect vocabulary quizzes should be high-score eligible");
const completedPinyinRecord = buildHistoryRecord(completedPinyinResult);
assert(completedPinyinRecord.answers.length === 2, "vocabulary history should store per-word answers");
assert(completedPinyinRecord.answers.every((answer) => answer.correct), "pinyin history should mark found rows as correct");
const slowerPinyinRecord = { ...completedPinyinRecord, id: "slower", elapsedSeconds: 120 };
assert(
  getVocabularyHighScore("pinyin", firstVocabularySet.id, [slowerPinyinRecord, completedPinyinRecord]).elapsedSeconds === 83,
  "vocabulary high score should use the fastest completed time for the mode and set",
);
assert(
  getVocabularyHighScoreRecords([slowerPinyinRecord, completedPinyinRecord]).length === 1,
  "high score history should keep one best record per vocabulary mode and set",
);

const incompleteAudioResult = {
  type: "vocabulary",
  quizMode: "meaning",
  setId: firstVocabularySet.id,
  setLabel: firstVocabularySet.label,
  order: [0, 1],
  items: [loveEntry, hobbyEntry],
  foundIds: [],
  answers: [{ item: loveEntry, itemIndex: 0, answer: "love", score: 1, correct: true }],
  elapsedSeconds: 42,
  finishReason: "ended",
  timeLimitSeconds: 120,
};
assert(
  !getVocabularyResultStats(incompleteAudioResult).highScoreEligible,
  "ended or incomplete audio vocabulary quizzes should not be high-score eligible",
);

validateSpeechReplay()
  .then(() => {
    console.log("Validated app annotation, scoring, and speech replay helpers.");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

async function validateSpeechReplay() {
  await speak("爱");
  assert(speechCalls.cancel === 1, "speech replay should cancel any active utterance before speaking");
  assert(speechCalls.speak.length === 0, "speech replay should queue playback after cancellation");
  runQueuedTimer();
  assert(speechCalls.speak[0] === "爱", "speech replay should speak the requested word");
  assert(state.isSpeaking, "speech replay should mark playback as active");

  await speak("你");
  assert(speechCalls.cancel === 2, "replaying audio should cancel the previous utterance");
  runQueuedTimer();
  assert(speechCalls.speak[1] === "你", "replaying audio should queue the latest utterance");

  await speak("好", { immediate: true });
  assert(speechCalls.cancel === 3, "immediate speech should still cancel active playback first");
  assert(speechCalls.speak[2] === "好", "immediate speech should play without waiting for a timer");

  stopSpeech();
  assert(speechCalls.cancel === 4, "stopping playback should cancel speech synthesis");
  assert(!state.isSpeaking, "stopping playback should clear playback state");
}

function runQueuedTimer() {
  const callback = queuedTimers.shift();
  assert(typeof callback === "function", "expected speech replay to queue a timer");
  callback();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
