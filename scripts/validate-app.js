const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const indexSource = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const wordData = fs.readFileSync(path.join(ROOT, "word-data.js"), "utf8");
const vocabData = fs.readFileSync(path.join(ROOT, "vocab-data.js"), "utf8");
const chinaMapData = fs.readFileSync(path.join(ROOT, "china-map-data.js"), "utf8");
const appSource = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const stylesSource = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
const queuedTimers = [];
const speechCalls = {
  cancel: 0,
  speak: [],
};
const speechState = {
  paused: false,
  pending: false,
  speaking: false,
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
        speechState.paused = false;
        speechState.pending = false;
        speechState.speaking = false;
      },
      getVoices: () => [
        {
          lang: "zh-CN",
          localService: false,
          name: "Microsoft Xiaoxiao Online",
          voiceURI: "Microsoft Xiaoxiao Online",
        },
      ],
      get paused() {
        return speechState.paused;
      },
      get pending() {
        return speechState.pending;
      },
      get speaking() {
        return speechState.speaking;
      },
      resume() {
        speechState.paused = false;
      },
      speak(utterance) {
        speechCalls.speak.push(utterance.text);
        speechState.pending = false;
        speechState.speaking = true;
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
vm.runInContext(chinaMapData, context, { filename: "china-map-data.js" });
vm.runInContext(`${appSource}
window.__tests = {
  CHINA_CITIES,
  CHINA_MAP_ITEMS,
  CHINA_PROVINCES,
  DASHBOARD_DAILY_GOAL,
  PROGRESS_ACTIVITY_DAYS,
  REVIEW_SESSION_LENGTH,
  SENTENCE_LIBRARY_PAGE_SIZE,
  VOCABULARY_LIBRARY_PAGE_SIZE,
  VOCABULARY_MODES,
  VOCABULARY_QUIZ_SETS,
  assessMapQuizSelection,
  assessVocabularyAnswer,
  assessPronunciationTranscript,
  applyReviewAttempt,
  buildAnswerBox,
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  buildFeedbackMarkup,
  buildDashboardPlan,
  buildDashboardWeekMarkup,
  buildHistoryRecord,
  buildHistoryRowMarkup,
  buildHistorySessionMarkup,
  buildProgressActivityMarkup,
  buildHighScoreCelebration,
  buildChinaMapMarkup,
  buildMapQuizFeedbackMarkup,
  buildPronunciationSentenceMarkup,
  buildDrillViewSwitcher,
  buildReviewFeedbackMarkup,
  buildReviewQueue,
  buildMdbgWordUrl,
  buildToneColoredPinyinMarkup,
  buildVocabularyChoiceMarkup,
  buildVocabularyDetailDialog,
  buildVocabularyExampleMarkup,
  buildVocabularyLibraryRow,
  buildVocabularyPathPartMarkup,
  buildVocabularyQuizRows,
  buildVocabularySetPicker,
  buildVocabularyPromptMarkup,
  buildVocabularyViewSwitcher,
  buildSentenceLibraryRow,
  containsChinese,
  choosePreferredVoice,
  determineVocabularyTimeLimit,
  extractPinyinTones,
  findVocabularyGuessMatches,
  formatVocabularyChoiceText,
  formatVocabularySetOption,
  filterVocabularyLibraryItems,
  filterSentenceLibraryItems,
  findVocabularyExamples,
  formatMistakePracticeAction,
  getDashboardData,
  getDashboardFocusInsight,
  getDashboardPronunciationAccuracy,
  getDashboardWeek,
  getHistoryActivityDays,
  getHistoryMistakeRetryData,
  getHistoryProgressData,
  getHistorySkillStats,
  getPracticeStreakDays,
  getProgressPronunciationFocus,
  getRecommendedDrillMode,
  formatReviewDueLabel,
  getVocabularySetMeta,
  getCurrentVocabularyRowId,
  getSelectedVocabularyIndex,
  getVocabularyChoiceSet,
  getVocabularyHighScore,
  getVocabularyHighScoreRecords,
  getVocabularyPinyinAnsweredCount,
  getVocabularyResultStats,
  getVocabularyLibraryStatus,
  getVocabularyMistakeStats,
  getVocabularyPathData,
  getVocabularyDetailProgress,
  getMapQuizPool,
  getMissedSentenceDrillItems,
  getMissedVocabularyReviewItems,
  getAllVocabularyReviewItems,
  getReviewChoiceSet,
  getReviewDashboardData,
  getPronunciationWeaknessStats,
  getPronunciationRecognitionErrorMessage,
  formatTimer,
  getSelectedVocabularySet,
  getSavedSentenceItems,
  getSentenceSearchPinyin,
  getRecommendedVocabularyPathPart,
  getVocabularySetReviewItems,
  isVocabularyRowAnswered,
  isVocabularyRowCorrect,
  isDashboardPlanRecordComplete,
  highlightVocabularyTermMarkup,
  loadHistoryRecords,
  loadReviewProgress,
  loadSavedVocabularyKeys,
  loadSavedSentenceIds,
  dismissHighScoreCelebration,
  markVocabularyHighScoreResult,
  normalizeEnglish,
  normalizePinyinForCompare,
  parsePinyinSyllable,
  reviewItemKey,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  selectNextVocabularyRowAfter,
  sessionUsesAudioPrompt,
  speak,
  state,
  stopSpeech,
  trashIconMarkup,
  toggleSavedVocabularyItem,
  toggleSavedSentence,
  ensureVocabularyReviewEntry,
  updateReviewProgressFromVocabularyResult,
  vocabularyItemId,
};`, context, { filename: "app.js" });

const {
  CHINA_CITIES,
  CHINA_MAP_ITEMS,
  CHINA_PROVINCES,
  DASHBOARD_DAILY_GOAL,
  PROGRESS_ACTIVITY_DAYS,
  REVIEW_SESSION_LENGTH,
  SENTENCE_LIBRARY_PAGE_SIZE,
  VOCABULARY_LIBRARY_PAGE_SIZE,
  VOCABULARY_MODES,
  VOCABULARY_QUIZ_SETS,
  assessMapQuizSelection,
  assessVocabularyAnswer,
  assessPronunciationTranscript,
  applyReviewAttempt,
  buildAnswerBox,
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  buildFeedbackMarkup,
  buildDashboardPlan,
  buildDashboardWeekMarkup,
  buildHistoryRecord,
  buildHistoryRowMarkup,
  buildHistorySessionMarkup,
  buildProgressActivityMarkup,
  buildHighScoreCelebration,
  buildChinaMapMarkup,
  buildMapQuizFeedbackMarkup,
  buildPronunciationSentenceMarkup,
  buildDrillViewSwitcher,
  buildReviewFeedbackMarkup,
  buildReviewQueue,
  buildMdbgWordUrl,
  buildToneColoredPinyinMarkup,
  buildVocabularyChoiceMarkup,
  buildVocabularyDetailDialog,
  buildVocabularyExampleMarkup,
  buildVocabularyLibraryRow,
  buildVocabularyPathPartMarkup,
  buildVocabularyQuizRows,
  buildVocabularySetPicker,
  buildVocabularyPromptMarkup,
  buildVocabularyViewSwitcher,
  buildSentenceLibraryRow,
  containsChinese,
  choosePreferredVoice,
  determineVocabularyTimeLimit,
  extractPinyinTones,
  findVocabularyGuessMatches,
  formatVocabularyChoiceText,
  formatVocabularySetOption,
  filterVocabularyLibraryItems,
  filterSentenceLibraryItems,
  findVocabularyExamples,
  formatMistakePracticeAction,
  getDashboardData,
  getDashboardFocusInsight,
  getDashboardPronunciationAccuracy,
  getDashboardWeek,
  getHistoryActivityDays,
  getHistoryMistakeRetryData,
  getHistoryProgressData,
  getHistorySkillStats,
  getPracticeStreakDays,
  getProgressPronunciationFocus,
  getRecommendedDrillMode,
  formatReviewDueLabel,
  getVocabularySetMeta,
  getCurrentVocabularyRowId,
  getSelectedVocabularyIndex,
  getVocabularyChoiceSet,
  getVocabularyHighScore,
  getVocabularyHighScoreRecords,
  getVocabularyPinyinAnsweredCount,
  getVocabularyResultStats,
  getVocabularyLibraryStatus,
  getVocabularyMistakeStats,
  getVocabularyPathData,
  getVocabularyDetailProgress,
  getMapQuizPool,
  getMissedSentenceDrillItems,
  getMissedVocabularyReviewItems,
  getAllVocabularyReviewItems,
  getReviewChoiceSet,
  getReviewDashboardData,
  getPronunciationWeaknessStats,
  getPronunciationRecognitionErrorMessage,
  formatTimer,
  getSelectedVocabularySet,
  getSavedSentenceItems,
  getSentenceSearchPinyin,
  getRecommendedVocabularyPathPart,
  getVocabularySetReviewItems,
  isVocabularyRowAnswered,
  isVocabularyRowCorrect,
  isDashboardPlanRecordComplete,
  highlightVocabularyTermMarkup,
  loadHistoryRecords,
  loadReviewProgress,
  loadSavedVocabularyKeys,
  loadSavedSentenceIds,
  dismissHighScoreCelebration,
  markVocabularyHighScoreResult,
  normalizeEnglish,
  normalizePinyinForCompare,
  parsePinyinSyllable,
  reviewItemKey,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  selectNextVocabularyRowAfter,
  sessionUsesAudioPrompt,
  speak,
  state,
  stopSpeech,
  trashIconMarkup,
  toggleSavedVocabularyItem,
  toggleSavedSentence,
  ensureVocabularyReviewEntry,
  updateReviewProgressFromVocabularyResult,
  vocabularyItemId,
} =
  context.window.__tests;
const annotated = buildAnswerBoxText("我爱你。");
const wordMarkup = buildAnnotatedChineseMarkup("我爱你。");
const firstVocabularySet = getSelectedVocabularySet();
const vocabularySetSizes = VOCABULARY_QUIZ_SETS.map((set) => set.words.length);
const hsk1VocabularySets = VOCABULARY_QUIZ_SETS.filter((set) => set.level === "New HSK 1");
const hsk2VocabularySets = VOCABULARY_QUIZ_SETS.filter((set) => set.level === "New HSK 2");
const hsk1VocabularyWords = hsk1VocabularySets.flatMap((set) => set.words);
const hsk2VocabularyWords = hsk2VocabularySets.flatMap((set) => set.words);
const hsk1VocabularyKeys = new Set(hsk1VocabularyWords.map(vocabularyEntryKey));
const hsk2VocabularyKeys = new Set(hsk2VocabularyWords.map(vocabularyEntryKey));
const allVocabularyWords = VOCABULARY_QUIZ_SETS.flatMap((set) => set.words);
const loveEntry = allVocabularyWords.find((item) => item.zh === "爱");
const hobbyEntry = allVocabularyWords.find((item) => item.zh === "爱好");
const eightEntry = allVocabularyWords.find((item) => item.zh === "八");
const womanEntry = allVocabularyWords.find((item) => item.zh === "女");
const shortWhileEntry = allVocabularyWords.find((item) => item.zh === "不一会儿" && item.pinyin === "bù yīhuǐr5");
const toolNavButtons = [...indexSource.matchAll(/<button class="tool-tab"[^>]*data-tool="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g)];
const toolNavOrder = toolNavButtons
  .map((match) => `${match[1]}:${stripHtml(match[2])}`);
const drillModeOrder = [...indexSource.matchAll(/<button class="mode-tab"[^>]*data-mode="([^"]+)"[^>]*>([^<]+)<\/button>/g)]
  .map((match) => `${match[1]}:${match[2]}`);

assert(
  toolNavOrder.join("|") === "dashboard:Today|vocabulary:Vocabulary Quiz|review:Daily Review|pronunciation:Pronunciation|map:Geography of China|drill:Sentence Drills|history:History",
  "global nav should show Today before the learning tools and History",
);
assert(
  toolNavButtons.every((match) => match[2].includes("tool-tab-icon")),
  "global nav tool buttons should include distinguishing icons",
);
assert(
  drillModeOrder.join("|") === "reading:Reading|writing:Writing|listening:Listening",
  "sentence drill modes should show Reading, Writing, then Listening",
);
assert(SENTENCE_LIBRARY_PAGE_SIZE === 40, "sentence library should use a focused initial result batch");
assert(indexSource.includes('class="mode-nav drill-only"'), "sentence modes should remain available while choosing saved-sentence practice");
const sentenceLibraryFixtures = [
  {
    id: "library-love",
    level: "beginner",
    zh: "我爱你。",
    en: "I love you.",
    source: "Tatoeba",
    sourceId: 101,
    translationId: 201,
  },
  {
    id: "library-running",
    level: "intermediate",
    zh: "他每天跑步。",
    en: "He runs every day.",
    source: "Tatoeba",
    sourceId: 102,
    translationId: 202,
  },
  {
    id: "library-weather",
    level: "advanced",
    zh: "今天的天气很好。",
    en: "The weather is pleasant today.",
    source: "Tatoeba",
    sourceId: 103,
    translationId: 203,
  },
];
const allSentenceLevels = new Set(["beginner", "intermediate", "advanced"]);
assert(filterSentenceLibraryItems(sentenceLibraryFixtures, { query: "love", levels: allSentenceLevels })[0].id === "library-love", "sentence library should search English translations");
assert(filterSentenceLibraryItems(sentenceLibraryFixtures, { query: "每天", levels: allSentenceLevels })[0].id === "library-running", "sentence library should search Chinese text");
assert(filterSentenceLibraryItems(sentenceLibraryFixtures, { query: "wo ai ni", levels: allSentenceLevels })[0].id === "library-love", "sentence library should search tone-insensitive pinyin");
assert(filterSentenceLibraryItems(sentenceLibraryFixtures, { levels: new Set(["advanced"]) }).map((item) => item.id).join("") === "library-weather", "sentence library should respect selected difficulty levels");
const savedSentenceFixtureIds = new Set(["library-running"]);
assert(filterSentenceLibraryItems(sentenceLibraryFixtures, { levels: allSentenceLevels, savedOnly: true, savedIds: savedSentenceFixtureIds })[0].id === "library-running", "sentence library should isolate saved examples");
assert(getSavedSentenceItems(sentenceLibraryFixtures, savedSentenceFixtureIds).map((item) => item.id).join("") === "library-running", "saved sentence practice should contain only bookmarked examples");
assert(getSavedSentenceItems(sentenceLibraryFixtures, savedSentenceFixtureIds, new Set(["beginner"])).length === 0, "saved sentence practice should respect the active difficulty filter");
const sentenceLibraryRow = buildSentenceLibraryRow(sentenceLibraryFixtures[0], { saved: true, showPinyin: true });
assert(sentenceLibraryRow.includes("annotated-pinyin-line") && sentenceLibraryRow.includes("Tatoeba") && sentenceLibraryRow.includes('aria-pressed="true"'), "sentence rows should include pinyin, source attribution, and bookmark state");
assert(!buildSentenceLibraryRow(sentenceLibraryFixtures[0], { showPinyin: false }).includes("annotated-pinyin-line"), "sentence rows should hide pinyin when requested");
assert(getSentenceSearchPinyin(sentenceLibraryFixtures[0]).includes("woaini"), "sentence pinyin indexing should use local word annotations");
const previousDrillView = state.drillView;
state.drillView = "library";
assert(buildDrillViewSwitcher().includes('class="active" type="button" data-drill-view="library"'), "sentence library should have a distinct active navigation state");
state.drillView = previousDrillView;
localStorageEntries.delete("chineseTrainerSavedSentences");
assert(toggleSavedSentence(sentenceLibraryFixtures[0]), "saving a sentence should return its saved state");
assert(loadSavedSentenceIds().has("library-love"), "saved sentences should persist in browser storage");
assert(!toggleSavedSentence(sentenceLibraryFixtures[0]), "toggling a saved sentence should remove it");
assert(!loadSavedSentenceIds().size, "removed sentences should leave the saved set");
const savedSentenceHistory = buildHistoryRecord({
  type: "drill",
  source: "saved",
  mode: "reading",
  levels: ["beginner"],
  answers: [{ item: sentenceLibraryFixtures[0], answer: "I love you", score: 1, correct: true }],
  elapsedSeconds: 9,
});
assert(savedSentenceHistory.source === "saved" && buildHistoryRowMarkup(savedSentenceHistory).includes("Saved sentences"), "History should distinguish saved-sentence drills");
const sentenceRetryResult = {
  type: "drill",
  source: "random",
  mode: "reading",
  levels: ["beginner", "intermediate"],
  answers: [
    { item: sentenceLibraryFixtures[0], answer: "I love you", score: 1, correct: true },
    { item: sentenceLibraryFixtures[1], answer: "", score: 0, correct: false },
  ],
  elapsedSeconds: 18,
};
assert(
  getMissedSentenceDrillItems(sentenceRetryResult).map((item) => item.id).join("") === "library-running",
  "sentence retries should contain only missed prompts",
);
const sentenceRetryHistory = buildHistoryRecord(sentenceRetryResult);
const sentenceHistoryRetry = getHistoryMistakeRetryData(sentenceRetryHistory);
assert(
  sentenceRetryHistory.answers[1].zh === sentenceLibraryFixtures[1].zh && sentenceRetryHistory.answers[1].en === sentenceLibraryFixtures[1].en,
  "drill history should retain both sentence sides for later retries",
);
assert(
  sentenceHistoryRetry?.type === "drill" && sentenceHistoryRetry.items[0].id === "library-running",
  "History should reconstruct the exact missed sentence and mode",
);
assert(
  buildHistorySessionMarkup(sentenceRetryHistory).includes("Review 1 mistake"),
  "recent sentence sessions should offer focused mistake practice",
);
const vocabularyRetryResult = {
  type: "vocabulary",
  quizMode: "pinyin",
  setId: "retry-set",
  setLabel: "HSK 1 · Part 1",
  items: [loveEntry, eightEntry],
  foundIds: [vocabularyItemId(eightEntry, 1)],
  answers: [{ item: eightEntry, itemIndex: 1, answer: "ba", score: 1, correct: true }],
};
const vocabularyRetryItems = getMissedVocabularyReviewItems(vocabularyRetryResult);
assert(
  vocabularyRetryItems.length === 1 && vocabularyRetryItems[0].zh === loveEntry.zh && vocabularyRetryItems[0].reviewMode === "pinyin",
  "pinyin quiz retries should preserve the missed word and recall mode",
);
const audioVocabularyRetryItems = getMissedVocabularyReviewItems({
  ...vocabularyRetryResult,
  quizMode: "meaning",
  foundIds: [],
  answers: [
    { item: loveEntry, itemIndex: 0, answer: "love", score: 1, correct: true },
    { item: eightEntry, itemIndex: 1, answer: "seven", score: 0, correct: false },
  ],
});
assert(
  audioVocabularyRetryItems.length === 1 && audioVocabularyRetryItems[0].zh === eightEntry.zh && audioVocabularyRetryItems[0].reviewMode === "meaning",
  "audio quiz retries should preserve the missed word and listening mode",
);
assert(formatMistakePracticeAction(1) === "Review 1 mistake", "single-item retries should use a concise action label");
assert(formatMistakePracticeAction(18) === "Review 12 of 18 mistakes", "large vocabulary retries should advertise a focused review batch");
const vocabularyRetryHistory = buildHistoryRecord({
  ...vocabularyRetryResult,
  foundIds: [vocabularyItemId(eightEntry, 1)],
  missedIds: [],
  elapsedSeconds: 12,
  finishReason: "ended",
  timeLimitSeconds: 300,
});
assert(
  getHistoryMistakeRetryData(vocabularyRetryHistory)?.items[0].zh === loveEntry.zh,
  "History should reconstruct missed vocabulary for targeted review",
);
assert(stylesSource.includes(".sentence-library-row") && stylesSource.includes(".drill-view-switcher"), "sentence library should include dedicated responsive styling");
assert(stylesSource.includes(".history-retry-btn"), "History mistake actions should include responsive styling");
assert(!/<body[^>]*data-mode=/i.test(indexSource), "initial page markup should not make the body look like a drill mode control");
localStorageEntries.set("chineseTrainerHistory", JSON.stringify([
  { id: "unsupported-record", type: "unsupported" },
  { id: "kept-drill", type: "drill" },
  { id: "kept-review", type: "review" },
]));
assert(
  loadHistoryRecords().map((record) => record.id).join("|") === "kept-drill|kept-review",
  "history loading should ignore unsupported record types",
);
localStorageEntries.delete("chineseTrainerHistory");
const reviewVocabulary = getAllVocabularyReviewItems();
const reviewNow = Date.UTC(2026, 6, 14, 2, 0, 0);
assert(REVIEW_SESSION_LENGTH === 12, "daily review should use a focused 12-word session");
assert(reviewVocabulary.length === hsk1VocabularyWords.length + hsk2VocabularyWords.length, "daily review should cover the full HSK 1 and HSK 2 vocabulary pool");
assert(new Set(reviewVocabulary.map(reviewItemKey)).size === reviewVocabulary.length, "daily review vocabulary keys should be unique");
const reviewProgressFixture = {};
const firstReviewSchedule = applyReviewAttempt(reviewProgressFixture, reviewVocabulary[0], true, { mode: "pinyin", now: reviewNow });
assert(firstReviewSchedule.reviewStage === 1, "a correct new review should advance to stage one");
assert(firstReviewSchedule.nextDueAt === reviewNow + 24 * 60 * 60 * 1000, "stage one should schedule the word for tomorrow");
const missedReviewSchedule = applyReviewAttempt(reviewProgressFixture, reviewVocabulary[1], false, { mode: "meaning", now: reviewNow });
assert(missedReviewSchedule.reviewStage === 0 && missedReviewSchedule.nextDueAt === reviewNow, "a missed review should return the word to the due queue");
const reviewQueue = buildReviewQueue(reviewProgressFixture, reviewNow, reviewVocabulary.slice(0, 4));
assert(reviewItemKey(reviewQueue[0].item) === reviewItemKey(reviewVocabulary[1]), "due review words should be prioritized ahead of new and upcoming words");
assert(reviewQueue[0].statusLabel === "Due" && reviewQueue.some((entry) => entry.statusLabel === "New"), "review queue should distinguish due and new words");
assert(formatReviewDueLabel(reviewNow, false, reviewNow) === "Due now", "missed words should clearly show that they are immediately due");
assert(formatReviewDueLabel(reviewNow + 24 * 60 * 60 * 1000, true, reviewNow) === "Tomorrow", "one-day review intervals should use a clear tomorrow label");
const firstPathSet = VOCABULARY_QUIZ_SETS[0];
const firstPathItems = getVocabularySetReviewItems(firstPathSet);
const pathDay = 24 * 60 * 60 * 1000;
const pathProgressFixture = {
  [reviewItemKey(firstPathItems[0])]: { stage: 2, dueAt: reviewNow - 1 },
  [reviewItemKey(firstPathItems[1])]: { stage: 2, dueAt: reviewNow + pathDay },
  [reviewItemKey(firstPathItems[2])]: { stage: 4, dueAt: reviewNow + pathDay },
};
const vocabularyPath = getVocabularyPathData(pathProgressFixture, reviewNow);
const firstPathPart = vocabularyPath.parts[0];
assert(vocabularyPath.levels.length === 2, "HSK path should keep HSK 1 and HSK 2 as separate levels");
assert(vocabularyPath.parts.length === VOCABULARY_QUIZ_SETS.length, "HSK path should include every vocabulary quiz part");
assert(vocabularyPath.totals.total === reviewVocabulary.length, "HSK path should account for the complete HSK 1 and HSK 2 vocabulary corpus");
assert(vocabularyPath.totals.new + vocabularyPath.totals.due + vocabularyPath.totals.learning + vocabularyPath.totals.strong === vocabularyPath.totals.total, "HSK path statuses should be mutually exclusive and exhaustive");
assert(firstPathPart.counts.due === 1 && firstPathPart.counts.learning === 1 && firstPathPart.counts.strong === 1, "HSK path should distinguish due, learning, and strong words within each part");
assert(firstPathPart.counts.introduced === 3, "HSK path coverage should count every previously reviewed word");
assert(getRecommendedVocabularyPathPart(vocabularyPath).set.id === firstPathSet.id, "HSK path should recommend a part with due vocabulary first");
const pathPartMarkup = buildVocabularyPathPartMarkup(firstPathPart, { recommended: true, totalParts: vocabularyPath.levels[0].parts.length });
assert(pathPartMarkup.includes("Up next"), "recommended HSK path parts should be visibly identified");
assert(pathPartMarkup.includes(`data-vocabulary-path-review="${firstPathSet.id}"`), "HSK path parts should launch a focused review");
assert(pathPartMarkup.includes(`data-vocabulary-path-quiz="${firstPathSet.id}"`), "HSK path parts should link to their timed quiz");
const previousVocabularyView = state.vocabularyView;
state.vocabularyView = "path";
const vocabularyViewSwitcherMarkup = buildVocabularyViewSwitcher();
assert(vocabularyViewSwitcherMarkup.includes('data-vocabulary-view="path"'), "vocabulary navigation should expose the HSK path");
assert(vocabularyViewSwitcherMarkup.includes('class="active" type="button" data-vocabulary-view="path"'), "HSK path should have a distinct active navigation state");
state.vocabularyView = previousVocabularyView;
localStorageEntries.set("chineseTrainerReviewProgress", JSON.stringify(reviewProgressFixture));
const reviewDashboard = getReviewDashboardData(reviewNow);
assert(reviewDashboard.dueCount === 1, "review dashboard should count words due now");
assert(reviewDashboard.reviewedToday === 2, "review dashboard should count words reviewed today");
const dashboardDay = 24 * 60 * 60 * 1000;
const dashboardNow = Date.parse("2026-07-14T12:00:00+08:00");
const dashboardHistory = [
  {
    type: "review",
    completedAt: new Date(dashboardNow).toISOString(),
    total: 12,
    correct: 10,
  },
  {
    type: "pronunciation",
    completedAt: new Date(dashboardNow).toISOString(),
    total: 15,
    averageScore: 0.8,
    weaknesses: {
      tones: [{ label: "Tone 3", count: 4 }],
      initials: [{ label: "zh", count: 2 }],
      finals: [],
    },
  },
  {
    type: "drill",
    completedAt: new Date(dashboardNow - dashboardDay).toISOString(),
    mode: "reading",
    total: 30,
    correct: 21,
    averageScore: 0.7,
  },
  {
    type: "drill",
    completedAt: new Date(dashboardNow - dashboardDay * 2).toISOString(),
    mode: "writing",
    total: 30,
    correct: 27,
    averageScore: 0.9,
  },
  {
    type: "drill",
    completedAt: new Date(dashboardNow - dashboardDay * 3).toISOString(),
    mode: "listening",
    total: 30,
    correct: 24,
    averageScore: 0.8,
  },
];
assert(DASHBOARD_DAILY_GOAL === 3, "Today should use a focused three-activity daily goal");
assert(state.tool === "dashboard", "new learners should start on the Today dashboard");
assert(isDashboardPlanRecordComplete(dashboardHistory[0]), "a complete 12-word review should satisfy the daily review activity");
assert(!isDashboardPlanRecordComplete({ type: "review", total: 2 }), "an early-ended review should not satisfy the daily plan");
const dashboardPlan = buildDashboardPlan(dashboardHistory, { dueCount: 0, totalTracked: 20 }, dashboardNow);
assert(dashboardPlan.filter((activity) => activity.completed).length === 2, "Today should recognize completed review and pronunciation activities");
assert(!dashboardPlan.find((activity) => activity.id === "drill").completed, "a sentence drill from a prior day should remain in today's plan");
assert(getRecommendedDrillMode(dashboardHistory) === "reading", "Today should recommend the learner's weakest practiced drill mode");
assert(getPracticeStreakDays(dashboardHistory, dashboardNow) === 4, "practice streaks should count consecutive local calendar days across tools");
const dashboardWeek = getDashboardWeek(dashboardHistory, dashboardNow);
assert(dashboardWeek.length === 7 && dashboardWeek.at(-1).count === 2, "weekly activity should include seven days and today's saved sessions");
assert(buildDashboardWeekMarkup(dashboardWeek).includes("Today"), "weekly activity markup should label the current day clearly");
assert(Math.abs(getDashboardPronunciationAccuracy(dashboardHistory) - 0.8) < 0.001, "Today should calculate recent pronunciation accuracy");
const pronunciationFocus = getDashboardFocusInsight(dashboardHistory, { dueCount: 0 });
assert(pronunciationFocus.title.includes("Tone 3") && pronunciationFocus.tool === "pronunciation", "Today should surface observed pronunciation weaknesses when review is caught up");
const dueFocus = getDashboardFocusInsight(dashboardHistory, { dueCount: 3 });
assert(dueFocus.tool === "review" && dueFocus.title.includes("3 vocabulary words"), "due vocabulary should take priority in focus guidance");
const dashboardData = getDashboardData(dashboardNow, dashboardHistory);
assert(dashboardData.completedCount === 2 && dashboardData.nextActivity.id === "drill", "Today should continue with the first incomplete activity");
assert(stylesSource.includes(".dashboard-week-chart") && stylesSource.includes("body[data-tool=\"dashboard\"] .tool-controls"), "Today should have responsive dashboard styling and hide irrelevant global controls");
const progressHistory = [
  ...dashboardHistory,
  {
    type: "vocabulary",
    completedAt: new Date(dashboardNow - dashboardDay).toISOString(),
    quizMode: "pinyin",
    setLabel: "HSK 1 · Part 1",
    total: 2,
    correct: 1,
    elapsedSeconds: 45,
    answers: [
      { zh: loveEntry.zh, pinyin: loveEntry.pinyin, meaning: "to love", answer: "ai", correct: false },
      { zh: eightEntry.zh, pinyin: eightEntry.pinyin, meaning: "eight", answer: "ba", correct: true },
    ],
  },
  {
    type: "review",
    source: "adaptive",
    completedAt: new Date(dashboardNow - dashboardDay * 2).toISOString(),
    total: 1,
    correct: 0,
    elapsedSeconds: 12,
    answers: [
      { zh: loveEntry.zh, pinyin: loveEntry.pinyin, meaning: "to love", answer: "", correct: false },
    ],
  },
  {
    type: "map",
    mapQuizMode: "province",
    completedAt: new Date(dashboardNow - dashboardDay * 5).toISOString(),
    total: 34,
    correct: 30,
    elapsedSeconds: 90,
    answers: [],
  },
];
const progressSkills = getHistorySkillStats(progressHistory);
assert(progressSkills.length === 6, "Learning progress should report every core skill in a stable order");
assert(Math.abs(progressSkills.find((skill) => skill.id === "reading").accuracy - 0.7) < 0.001, "Learning progress should calculate sentence-mode accuracy");
assert(progressSkills.find((skill) => skill.id === "vocabulary").attempts === 15, "Learning progress should combine vocabulary quizzes and reviews");
const progressActivity = getHistoryActivityDays(progressHistory, dashboardNow);
assert(PROGRESS_ACTIVITY_DAYS === 28 && progressActivity.length === 28, "Learning progress should show a four-week activity window");
assert(progressActivity.at(-1).count === 2 && progressActivity.at(-1).isToday, "Learning progress activity should count today's sessions");
assert(buildProgressActivityMarkup(progressActivity).includes("Last") === false && buildProgressActivityMarkup(progressActivity).includes("level-"), "activity markup should encode visible intensity levels");
assert(getProgressPronunciationFocus(progressHistory).label === "Tone 3", "Learning progress should aggregate pronunciation weaknesses");
const progressMistakes = getVocabularyMistakeStats(progressHistory);
assert(progressMistakes[0].zh === loveEntry.zh && progressMistakes[0].misses === 2, "Learning progress should rank repeatedly missed vocabulary");
const progressData = getHistoryProgressData(progressHistory, dashboardNow, { dueCount: 3, strongCount: 8, totalTracked: 20 });
assert(progressData.weekSessions === progressHistory.length && progressData.focusItems[0].id === "due-vocabulary", "due review should lead the learner's progress priorities");
assert(progressData.weekAnswers === 154, "Learning progress should total recent answer volume");
const progressSessionMarkup = buildHistorySessionMarkup(progressHistory.at(-3));
assert(progressSessionMarkup.includes("Mistake review") && progressSessionMarkup.includes("to love"), "recent progress sessions should expose answer-level mistake review");
assert(stylesSource.includes(".progress-metric-strip") && stylesSource.includes(".history-session-item"), "Learning progress should include responsive insight and session-review styling");
const reviewSessionFixture = {
  type: "review",
  items: reviewVocabulary.slice(0, 6).map((item, index) => ({ ...item, reviewMode: index % 2 ? "meaning" : "pinyin" })),
  index: 1,
  answers: [],
  choiceSets: new Map(),
  currentAssessment: null,
};
const reviewChoices = getReviewChoiceSet(reviewSessionFixture, 1);
assert(reviewChoices.length === 5 && reviewChoices.filter((choice) => choice.correct).length === 1, "audio review prompts should offer five choices with one correct answer");
assert(reviewChoices.map((choice) => choice.shortcut).join("") === "12345", "review choices should expose keyboard shortcuts one through five");
assert(sessionUsesAudioPrompt(reviewSessionFixture), "audio review prompts should support the shared replay shortcut");
reviewSessionFixture.index = 0;
assert(!sessionUsesAudioPrompt(reviewSessionFixture), "pinyin review prompts should not trigger audio automatically");
const reviewFeedback = buildReviewFeedbackMarkup(reviewVocabulary[0], {
  answer: "ren",
  correct: true,
  nextDueAt: reviewNow + 24 * 60 * 60 * 1000,
});
assert(reviewFeedback.includes("Correct") && reviewFeedback.includes("Tomorrow"), "review feedback should show the answer outcome and next interval");
const reviewHistoryRecord = buildHistoryRecord({
  type: "review",
  answers: [{
    item: reviewVocabulary[0],
    answer: "ren",
    correct: true,
    score: 1,
    reviewMode: "pinyin",
    previousStage: 0,
    reviewStage: 1,
    nextDueAt: reviewNow + 24 * 60 * 60 * 1000,
  }],
  elapsedSeconds: 18,
});
assert(reviewHistoryRecord.type === "review" && reviewHistoryRecord.correct === 1, "daily review runs should create review history records");
assert(reviewHistoryRecord.answers[0].reviewStage === 1, "review history should retain scheduling outcomes");
assert(buildHistoryRowMarkup(reviewHistoryRecord).includes("Daily review"), "History should label adaptive review runs clearly");
const pathReviewHistoryRecord = buildHistoryRecord({
  type: "review",
  source: "path",
  setId: firstPathSet.id,
  setLabel: firstPathSet.label,
  answers: [{
    item: firstPathItems[0],
    answer: firstPathItems[0].pinyin,
    correct: true,
    score: 1,
    reviewMode: "pinyin",
    previousStage: 0,
    reviewStage: 1,
    nextDueAt: reviewNow + pathDay,
  }],
  elapsedSeconds: 12,
});
const pathHistoryMarkup = buildHistoryRowMarkup(pathReviewHistoryRecord);
assert(pathReviewHistoryRecord.setId === firstPathSet.id, "HSK path review history should retain its curriculum part");
assert(pathHistoryMarkup.includes("HSK path review") && pathHistoryMarkup.includes("HSK 1 · Part 1"), "History should identify focused HSK path review sessions");
assert(stylesSource.includes(".review-practice-layout"), "daily review should include a dedicated responsive practice layout");
assert(stylesSource.includes(".vocabulary-path-part") && stylesSource.includes(".vocabulary-path-level"), "HSK path should include dedicated responsive curriculum styling");
localStorageEntries.set("chineseTrainerReviewProgress", "{}");
updateReviewProgressFromVocabularyResult({
  type: "vocabulary",
  quizMode: "pinyin",
  items: [reviewVocabulary[0]],
  foundIds: [vocabularyItemId(reviewVocabulary[0], 0)],
  missedIds: [],
  answers: [],
});
assert(loadReviewProgress()[reviewItemKey(reviewVocabulary[0])].stage === 1, "completed vocabulary answers should feed the adaptive review schedule");
localStorageEntries.delete("chineseTrainerReviewProgress");
assert(VOCABULARY_LIBRARY_PAGE_SIZE === 80, "the vocabulary library should render a focused initial batch");
assert(reviewVocabulary.every((item) => item.level), "vocabulary library entries should retain their HSK level");
const libraryWoman = reviewVocabulary.find((item) => item.zh === "女");
const libraryLove = reviewVocabulary.find((item) => item.zh === "爱");
const libraryFatherResults = filterVocabularyLibraryItems(reviewVocabulary, { query: "father" });
assert(libraryFatherResults.some((item) => item.zh === "爸" || item.zh === "爸爸"), "library search should match English meanings");
assert(filterVocabularyLibraryItems(reviewVocabulary, { query: "nu" })[0]?.zh === "女", "exact tone-free pinyin matches should rank ahead of definition substrings");
assert(filterVocabularyLibraryItems(reviewVocabulary, { query: "爱" }).some((item) => item.zh === "爱"), "library search should match Chinese characters");
const hskOneLibrary = filterVocabularyLibraryItems(reviewVocabulary, { level: "1" });
assert(hskOneLibrary.length === hsk1VocabularyWords.length, "library level filtering should isolate the complete HSK 1 collection");
const savedLibraryKeys = new Set([reviewItemKey(libraryWoman)]);
assert(
  filterVocabularyLibraryItems(reviewVocabulary, { status: "saved", savedKeys: savedLibraryKeys }).length === 1,
  "library filtering should isolate saved words",
);
const libraryStatusProgress = {};
ensureVocabularyReviewEntry(libraryStatusProgress, libraryWoman, reviewNow);
assert(getVocabularyLibraryStatus(libraryWoman, libraryStatusProgress, reviewNow).id === "due", "newly saved words should be due for review");
libraryStatusProgress[reviewItemKey(libraryWoman)].stage = 4;
libraryStatusProgress[reviewItemKey(libraryWoman)].dueAt = reviewNow + dashboardDay;
assert(getVocabularyLibraryStatus(libraryWoman, libraryStatusProgress, reviewNow).id === "strong", "mature vocabulary should show a strong status");
const libraryRow = buildVocabularyLibraryRow(libraryWoman, {
  saved: true,
  status: { id: "strong", label: "Strong" },
});
assert(libraryRow.includes("mdbg.net") && libraryRow.includes("data-vocabulary-audio-key") && libraryRow.includes("data-vocabulary-study-key") && libraryRow.includes("aria-pressed=\"true\""), "library rows should include dictionary, study, audio, and saved-word controls");
const wordDetailSentences = [
  { id: "short-beginner", level: "beginner", zh: "我爱你。", en: "I love you.", sourceId: 101 },
  { id: "long-beginner", level: "beginner", zh: "他真的很爱她。", en: "He really loves her.", sourceId: 102 },
  { id: "short-intermediate", level: "intermediate", zh: "他爱她。", en: "He loves her.", sourceId: 103 },
  { id: "longer-word", level: "beginner", zh: "她很可爱。", en: "She is lovely.", sourceId: 104 },
];
const wordDetailExamples = findVocabularyExamples(libraryLove, wordDetailSentences, 2);
assert(wordDetailExamples.map((sentence) => sentence.id).join("|") === "short-beginner|long-beginner", "word study should rank concise level-appropriate examples first");
assert(!wordDetailExamples.some((sentence) => sentence.id === "longer-word"), "word study should not treat a shared character inside a longer word as an exact vocabulary example");
assert(highlightVocabularyTermMarkup("我爱你。", "爱").includes('<mark class="word-detail-highlight">爱</mark>'), "word study should highlight the target term inside examples");
const detailProgress = getVocabularyDetailProgress(libraryWoman, libraryStatusProgress, reviewNow);
assert(detailProgress.status.id === "strong" && detailProgress.attempts === 0, "word study should reflect the learner's current review status");
const wordDetailDialog = buildVocabularyDetailDialog(libraryWoman, {
  progress: libraryStatusProgress,
  savedKeys: savedLibraryKeys,
  now: reviewNow,
});
assert(wordDetailDialog.includes("Word study") && wordDetailDialog.includes("Open in MDBG") && wordDetailDialog.includes("Saved for review"), "word study should retain dictionary access and saved-review controls");
const wordExampleMarkup = buildVocabularyExampleMarkup(wordDetailSentences[0], libraryLove, 0);
assert(wordExampleMarkup.includes("Tatoeba") && wordExampleMarkup.includes("data-word-example-audio") && wordExampleMarkup.includes("word-detail-highlight"), "word study examples should include source attribution, playback, and highlighting");
localStorageEntries.delete("chineseTrainerSavedVocabulary");
localStorageEntries.delete("chineseTrainerReviewProgress");
assert(toggleSavedVocabularyItem(libraryWoman, reviewNow), "saving a library word should return its saved state");
assert(loadSavedVocabularyKeys().has(reviewItemKey(libraryWoman)), "saved words should persist in browser storage");
const savedSchedule = loadReviewProgress()[reviewItemKey(libraryWoman)];
assert(savedSchedule?.dueAt === reviewNow && savedSchedule.attempts === 0, "saving a word should schedule it now without recording a false attempt");
assert(!toggleSavedVocabularyItem(libraryWoman, reviewNow), "toggling a saved word again should remove the bookmark");
assert(!loadSavedVocabularyKeys().size, "removed saved words should leave the saved list");
const savedReviewHistory = buildHistoryRecord({ type: "review", source: "saved", answers: [], elapsedSeconds: 4 });
assert(savedReviewHistory.source === "saved" && buildHistoryRowMarkup(savedReviewHistory).includes("Saved vocabulary"), "History should distinguish saved-word review sessions");
assert(stylesSource.includes(".vocabulary-library-row") && stylesSource.includes(".vocabulary-view-switcher") && stylesSource.includes(".word-detail-dialog"), "the word library and study dialog should include dedicated responsive styling");
localStorageEntries.delete("chineseTrainerSavedVocabulary");
localStorageEntries.delete("chineseTrainerReviewProgress");
assert(CHINA_PROVINCES.length === 34, "map quiz should include 34 provincial-level region targets");
assert(CHINA_CITIES.length === 34, "map quiz should include 34 city pin targets");
assert(CHINA_MAP_ITEMS.length === CHINA_PROVINCES.length + CHINA_CITIES.length, "map quiz pool should combine provinces and cities");
assert(
  getMapQuizPool("province").length === CHINA_PROVINCES.length &&
    getMapQuizPool("province").every((item) => item.kind === "province"),
  "region map mode should only draw provincial-level quiz targets",
);
assert(
  getMapQuizPool("city").length === CHINA_CITIES.length &&
    getMapQuizPool("city").every((item) => item.kind === "city"),
  "city map mode should only draw city quiz targets",
);
assert(
  CHINA_PROVINCES.some((item) => item.name === "新疆维吾尔自治区") &&
    CHINA_PROVINCES.some((item) => item.name === "台湾省") &&
    CHINA_PROVINCES.some((item) => item.name === "香港特别行政区") &&
    CHINA_PROVINCES.some((item) => item.name === "澳门特别行政区"),
  "map quiz should use official Chinese provincial-level region names",
);
const guangdongProvince = CHINA_PROVINCES.find((item) => item.name === "广东省");
const guangzhouCity = CHINA_CITIES.find((item) => item.name === "广州市");
const beijingCity = CHINA_CITIES.find((item) => item.name === "北京市");
assert(guangdongProvince, "map data should include 广东省");
assert(guangzhouCity, "map data should include 广州市");
assert(beijingCity, "map data should include 北京市");
const mapMarkup = buildChinaMapMarkup({ type: "map", mapQuizMode: "province", items: [{ ...guangdongProvince, kind: "province" }], index: 0, currentAssessment: null });
const cityMapMarkup = buildChinaMapMarkup({ type: "map", mapQuizMode: "city", items: [{ ...guangzhouCity, kind: "city" }], index: 0, currentAssessment: null });
const cityProvinceAssessmentMarkup = buildChinaMapMarkup({
  type: "map",
  mapQuizMode: "city",
  items: [{ ...guangzhouCity, kind: "city" }],
  index: 0,
  currentAssessment: {
    selectedKind: "province",
    selectedId: guangdongProvince.id,
    correct: false,
  },
});
const cityWrongAssessment = {
  selectedKind: "city",
  selectedId: beijingCity.id,
  selectedName: beijingCity.name,
  selectedPinyin: beijingCity.pinyin,
  correct: false,
};
const cityWrongAssessmentMarkup = buildChinaMapMarkup({
  type: "map",
  mapQuizMode: "city",
  items: [{ ...guangzhouCity, kind: "city" }],
  index: 0,
  currentAssessment: cityWrongAssessment,
});
state.session = {
  type: "map",
  mapQuizMode: "city",
  items: [{ ...guangzhouCity, kind: "city" }],
  index: 0,
};
const cityWrongFeedbackMarkup = buildMapQuizFeedbackMarkup(cityWrongAssessment);
state.session = null;
assert(indexSource.includes("china-map-data.js"), "map quiz should load committed China map data before app startup");
assert(mapMarkup.includes("china-map-canvas"), "map quiz should render a local offline China map canvas");
assert(mapMarkup.includes("china-province-shape"), "map quiz should render local province boundary shapes");
assert(mapMarkup.includes("china-province-outline"), "province map mode should render a top outline layer for complete highlighted borders");
assert(mapMarkup.includes("china-small-region-selector"), "province map mode should render enlarged selectors for very small regions");
assert(mapMarkup.includes("Small provincial-level region selector"), "small region selectors should be available to keyboard and assistive tech users");
assert(mapMarkup.includes("map-zoom-controls"), "map quiz should render zoom controls");
assert(mapMarkup.includes("data-map-transform-layer"), "map quiz should render a transform layer for zooming and panning");
assert(appSource.includes("bindChinaMapZoomControls"), "map quiz should bind zoom and pan controls");
assert(stylesSource.includes(".map-zoom-controls"), "map quiz should style the zoom controls");
assert(stylesSource.includes(".china-small-region-selector"), "map quiz should style enlarged selectors for very small regions");
assert(stylesSource.includes("touch-action: none"), "map quiz should disable native touch gestures inside the map for custom zooming");
assert(!mapMarkup.includes("mapProvinceLift"), "map quiz should not use the province shadow filter that can render black selection artifacts");
assert(!mapMarkup.includes("map-legend-row"), "map quiz should not render the bottom legend");
assert(!mapMarkup.includes("map-tip"), "map quiz should not render the bottom tip");
assert(!indexSource.includes("amap-config.js"), "map quiz should not load map API config at runtime");
assert(!appSource.includes("webapi.amap.com"), "map quiz should not call the Gaode JavaScript API at runtime");
assert(!appSource.includes("List Quiz"), "map quiz should not render the removed List Quiz chip");
assert(!appSource.includes("Mode: China Map"), "map quiz should not render the removed Mode chip");
assert(appSource.includes("Test your knowledge of China's geography"), "map quiz home should use the concise geography description");
assert(!appSource.includes("Practice provincial-level regions without city pins covering small municipalities."), "map quiz should not use the old region practice description");
assert(!appSource.includes("Practice city locations using pins without region answer highlights."), "map quiz should not use the old city practice description");
assert(!appSource.includes("<span>China Map</span>"), "map prompt cards should not render a redundant China Map label above the prompt");
assert(!appSource.includes("<span>${promptType}</span>"), "active map prompts should not render a redundant prompt-type label above the Chinese text");
assert(!appSource.includes("Provincial-level region questions use the region shape."), "map review feedback should not repeat province interaction guidance");
assert(!appSource.includes("City questions use the pin."), "map review feedback should not repeat city interaction guidance");
assert(appSource.includes("map-mode-header"), "map quiz should render province/city mode selection at the top");
assert(appSource.includes("mapShowPinyinNames"), "map pinyin name preference should be wired into app state");
assert(appSource.includes("data-map-pinyin-toggle"), "map quiz should render a pinyin names toggle");
assert(appSource.includes("bindMapNameTextToggle"), "map pinyin names toggle should have an event binding");
assert(appSource.includes("showPinyinNames: state.mapShowPinyinNames"), "map sessions should copy the pinyin names option at start");
assert(appSource.includes("map-prompt-pinyin"), "map prompt should render a pinyin line when enabled");
assert(stylesSource.includes(".map-prompt-pinyin"), "map prompt pinyin should have dedicated styling");
assert(stylesSource.includes(".map-name-toggle"), "map pinyin names toggle should have dedicated styling");
assert(
  !/map-quiz-session">\s*\$\{buildMapModeHeaderMarkup/.test(appSource),
  "active map quiz sessions should not render the mode header above the game shell",
);
assert(appSource.includes("scrollMapSessionIntoView(\"session\")"), "mobile map quiz should scroll the active session into view");
assert(appSource.includes("scrollMapSessionIntoView(\"feedback\")"), "mobile map quiz should scroll answer feedback into view");
assert(stylesSource.includes(".map-quiz-session .china-map-svg"), "mobile map quiz should have session-specific SVG framing");
assert(stylesSource.includes("height: clamp(320px, 48vh, 380px)"), "active mobile map should keep a stable frame instead of shrinking after quiz start");
assert(stylesSource.includes(".map-quiz-session .china-map-canvas {\n    padding: 0;"), "active mobile map should not shrink from extra canvas padding");
assert(stylesSource.includes(".map-quiz-session .map-prompt"), "mobile map quiz should compact the prompt text to leave more map space");
assert(!appSource.includes("MAP_QUIZ_SESSION_LENGTH"), "map quiz should use the full target pool instead of a fixed 20-question cap");
assert(
  !appSource.includes("shuffle(getMapQuizPool(mapQuizMode)).slice"),
  "map quiz should not slice the shuffled target pool before starting a session",
);
assert(
  CHINA_CITIES.every((item) => Number.isFinite(item.lng) && Number.isFinite(item.lat)),
  "map quiz city targets should include longitude and latitude for local pins",
);
assert(!mapMarkup.includes("data-map-city-id"), "province map mode should not render city pins");
assert(cityMapMarkup.includes("data-map-city-id"), "city map mode should render city pins");
assert(!cityMapMarkup.includes("data-map-province-id"), "city map mode should not make province shapes selectable");
assert(!cityMapMarkup.includes("china-province-outline"), "city map mode should not render province highlight outlines");
assert(!cityMapMarkup.includes("china-small-region-selector"), "city map mode should not render province-mode small region selectors");
assert(
  !/china-province-shape[^"]*is-(hint|correct|wrong)/.test(cityProvinceAssessmentMarkup),
  "city map mode should not apply answer highlights to province shapes",
);
assert(cityWrongAssessmentMarkup.includes("china-city-pin-halo"), "wrong city answers should make the correct city pin prominent");
assert(cityWrongAssessmentMarkup.includes("china-city-pin-label-backdrop"), "wrong city answers should give the correct city a label backdrop");
assert(cityWrongAssessmentMarkup.includes("china-city-pin is-correct"), "wrong city answers should mark the correct city pin");
assert(cityWrongAssessmentMarkup.includes("china-city-pin is-wrong"), "wrong city answers should mark the selected wrong city pin");
assert(cityWrongFeedbackMarkup.includes("map-correct-answer-card"), "wrong city feedback should include a prominent correct city card");
assert(cityWrongFeedbackMarkup.includes("Correct city"), "wrong city feedback should label the correct city clearly");
assert(cityWrongFeedbackMarkup.includes(guangzhouCity.pinyin), "wrong city feedback should show the correct city pinyin");
assert(!mapMarkup.includes("map-info-bubble"), "map quiz should not render a map source info bubble");
assert(appSource.includes("Reveal: ${escapeHtml(current.pinyin)}"), "map quiz should label the pinyin reveal as Reveal");
assert(appSource.includes('session.hintVisible ? "Revealed" : "Reveal"'), "map quiz reveal button should use reveal wording");
assert(!appSource.includes('"Show hint"'), "map quiz should not call the pinyin reveal a hint");
assert(!appSource.includes('"Hint shown"'), "map quiz should not label the revealed state as a hint");
assert(
  assessMapQuizSelection("province", guangdongProvince.id, { ...guangdongProvince, kind: "province" }).correct,
  "province questions should be correct when the matching province is selected",
);
assert(
  !assessMapQuizSelection("city", guangzhouCity.id, { ...guangdongProvince, kind: "province" }).correct,
  "province questions should not accept clicking a city pin",
);
assert(
  assessMapQuizSelection("city", guangzhouCity.id, { ...guangzhouCity, kind: "city" }).correct,
  "city questions should be correct when the matching city pin is selected",
);
const trashIcon = trashIconMarkup();
assert(trashIcon.includes("<svg"), "clear history should use a trash can icon");
assert(trashIcon.includes('aria-hidden="true"'), "clear history icon should be hidden from assistive tech");
assert(containsChinese("Reference: 我爱你。"), "Chinese detection should find Han characters inside mixed text");
assert(annotated.includes("annotated-chinese"), "Chinese answer boxes should use annotated markup");
assert(annotated.includes("chinese-text"), "annotated Chinese should use the shared Chinese text styling");
assert(wordMarkup.includes("annotated-hanzi-line"), "annotated Chinese should include a separate Hanzi line");
assert(wordMarkup.includes("annotated-pinyin-line"), "annotated Chinese should include a separate pinyin line");
assert(wordMarkup.includes("data-gloss="), "annotated Chinese words should include gloss hover text");
assert(loveEntry, "test vocabulary should include 爱");
assert(hobbyEntry, "test vocabulary should include 爱好");
assert(womanEntry, "test vocabulary should include 女");
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
assert(VOCABULARY_QUIZ_SETS.length === 8, "vocabulary quizzes should be split into eight level-specific parts");
assert(hsk1VocabularySets.length === 3, "New HSK 1 vocabulary should fit in three quiz parts");
assert(hsk2VocabularySets.length === 5, "New HSK 2 vocabulary should fit in five quiz parts");
assert(hsk1VocabularyWords.length === 506, "New HSK 1 vocabulary parts should cover the full sourced level list");
assert(hsk2VocabularyWords.length === 750, "New HSK 2 vocabulary parts should cover the full sourced level list");
assert(hsk1VocabularyKeys.size === hsk1VocabularyWords.length, "New HSK 1 vocabulary parts should not duplicate entries");
assert(hsk2VocabularyKeys.size === hsk2VocabularyWords.length, "New HSK 2 vocabulary parts should not duplicate entries");
assert(new Set(vocabularySetSizes).size > 1, "vocabulary quiz parts should no longer be forced to equal sizes");
assert(!VOCABULARY_QUIZ_SETS.some((set) => set.level.includes("1 + 2")), "vocabulary quiz parts should not combine HSK 1 and HSK 2");
assert(formatVocabularySetOption(firstVocabularySet) === firstVocabularySet.label, "vocabulary set labels should not repeat the word count");
const firstVocabularySetMeta = getVocabularySetMeta(firstVocabularySet);
assert(firstVocabularySetMeta.levelLabel === "HSK 1", "vocabulary set icons should expose the HSK level");
assert(firstVocabularySetMeta.partLabel === "Part 1", "vocabulary set icons should expose the quiz part");
const vocabularySetPickerMarkup = buildVocabularySetPicker(firstVocabularySet.id);
assert(vocabularySetPickerMarkup.includes("quiz-set-card"), "vocabulary set picker should render icon buttons");
assert(vocabularySetPickerMarkup.includes("quiz-set-icon-level"), "vocabulary set picker should render level icons");
assert(vocabularySetPickerMarkup.includes('aria-pressed="true"'), "vocabulary set picker should mark the selected set");
assert(vocabularySetPickerMarkup.includes("Part 5"), "vocabulary set picker should include the fifth HSK 2 part");
assert(!vocabularySetPickerMarkup.includes("Part 6"), "vocabulary set picker should not include a sixth HSK 2 part");
assert(!vocabularySetPickerMarkup.includes("125 words"), "vocabulary set picker should not repeat the word count");
assert(state.vocabularyOrder === "random", "vocabulary quizzes should default to random order");
assert(state.vocabularyHideTranslations === false, "vocabulary translations should be visible unless the user hides them");
assert(VOCABULARY_MODES.meaning.label === "Audio", "vocabulary audio mode should be exposed as Audio");
assert(buildVocabularyPromptMarkup(loveEntry, "meaning").includes("Play word"), "audio vocabulary mode should render a word replay button");
assert(!buildVocabularyPromptMarkup(loveEntry, "meaning").includes("爱"), "audio vocabulary mode should hide the character before answering");
assert(
  buildMdbgWordUrl(loveEntry) === "https://www.mdbg.net/chinese/dictionary?page=worddict&wdqb=%E7%88%B1&wdrst=0",
  "vocabulary words should link to the matching MDBG word dictionary search",
);
assert(normalizePinyinForCompare("ài") === "ai4", "tone-mark pinyin should normalize to numeric tones");
assert(extractPinyinTones("ài").join("") === "4", "tone extraction should read marked fourth tone pinyin");
assert(extractPinyinTones("bù yīhuǐr5", 4).join("") === "4135", "tone extraction should read mixed marked and numeric pinyin");
assert(buildToneColoredPinyinMarkup("ài").includes("tone-four"), "vocabulary pinyin answers should use Pleco tone color spans");
assert(scorePinyin("ai4", loveEntry) >= 0.99, "numeric pinyin should be accepted");
assert(scorePinyin("ài", loveEntry) >= 0.99, "tone-mark pinyin should be accepted");
assert(scorePinyin("ai", loveEntry) >= 0.7, "tone-free pinyin should receive partial credit");
assert(scorePinyin("nu", womanEntry) >= 0.7, "plain u should be accepted for ü pinyin");
assert(scoreVocabularyMeaning("love", loveEntry) >= 0.99, "vocabulary meanings should match accepted meanings");
assert(assessVocabularyAnswer("love", loveEntry, "meaning").correct, "audio vocabulary mode should grade English meanings");
assert(sessionUsesAudioPrompt({ type: "vocabulary", quizMode: "meaning" }), "audio vocabulary mode should support replay shortcuts");
assert(!sessionUsesAudioPrompt({ type: "vocabulary", quizMode: "pinyin" }), "pinyin vocabulary mode should not use audio replay shortcuts");
assert(formatTimer(determineVocabularyTimeLimit(125)) === "15:00", "125-word vocabulary quiz should use a 15-minute timer");
assert(normalizePinyinForCompare("bù yīhuǐr5") === "bu4 yihuir5", "mixed tone-mark and numeric pinyin should normalize");
assert(!appSource.includes('words found in'), "pinyin vocabulary results should not describe correct answers as found words");
assert(!appSource.includes('>Found</span>'), "pinyin vocabulary result stats should label score as Correct instead of Found");
assert(!appSource.includes('found, ${left} left'), "pinyin vocabulary progress should label score as correct instead of found");
assert(!appSource.includes('revealed, ${left} left'), "pinyin vocabulary progress should label misses as wrong instead of revealed");
assert(appSource.includes('const statusText = found ? "Correct" : "Wrong";'), "pinyin vocabulary result row status should use Correct/Wrong labels");
assert(appSource.includes('return `${found} correct, ${missed} wrong, ${left} left`;'), "pinyin vocabulary progress should use correct/wrong wording");

const matchSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [loveEntry],
  foundIds: new Set(),
  missedIds: new Set(),
  selectedVocabularyIndex: 0,
};
assert(findVocabularyGuessMatches("ài", matchSession).length === 1, "tone-mark vocabulary answer should reveal a row");
assert(findVocabularyGuessMatches("ai4", matchSession).length === 1, "numeric-tone vocabulary answer should reveal a row");
assert(findVocabularyGuessMatches("ai", matchSession).length === 1, "tone-free vocabulary answer should reveal a row");

const umlautPinyinSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [womanEntry],
  foundIds: new Set(),
  missedIds: new Set(),
  selectedVocabularyIndex: 0,
};
assert(findVocabularyGuessMatches("nǚ", umlautPinyinSession).length === 1, "tone-mark ü pinyin should reveal 女");
assert(findVocabularyGuessMatches("nü", umlautPinyinSession).length === 1, "umlaut pinyin should reveal 女");
assert(findVocabularyGuessMatches("nv", umlautPinyinSession).length === 1, "keyboard v pinyin should reveal 女");
assert(findVocabularyGuessMatches("nu", umlautPinyinSession).length === 1, "plain u pinyin should reveal 女");

const compactPinyinSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [hobbyEntry],
  foundIds: new Set(),
  missedIds: new Set(),
  selectedVocabularyIndex: 0,
};
assert(findVocabularyGuessMatches("aihao", compactPinyinSession).length === 1, "tone-free compact pinyin should reveal a row");

const erhuaPinyinSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [shortWhileEntry],
  foundIds: new Set(),
  missedIds: new Set(),
  selectedVocabularyIndex: 0,
};
assert(findVocabularyGuessMatches("buyihuir", erhuaPinyinSession).length === 1, "compact erhua pinyin should reveal 不一会儿");
assert(findVocabularyGuessMatches("buyihuier", erhuaPinyinSession).length === 1, "expanded erhua pinyin should reveal 不一会儿");

const selectedOnlySession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [loveEntry, hobbyEntry],
  foundIds: new Set(),
  missedIds: new Set(),
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
  items: [loveEntry, hobbyEntry, eightEntry],
  foundIds: new Set(),
  missedIds: new Set(),
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
assert(
  buildVocabularyQuizRows(highlightedRowSession).includes('class="vocab-word-link"'),
  "visible vocabulary quiz words should link to MDBG",
);
assert(
  !buildVocabularyQuizRows(highlightedRowSession).includes("tone-pinyin"),
  "unanswered pinyin vocabulary rows should not leak pinyin tone colors",
);
highlightedRowSession.foundIds.add(vocabularyItemId(loveEntry, 0));
highlightedRowSession.lastCorrectItemIndex = 0;
assert(
  buildVocabularyQuizRows(highlightedRowSession).includes("correct-celebration"),
  "recently correct pinyin vocabulary rows should animate",
);
assert(
  buildVocabularyQuizRows(highlightedRowSession).includes("tone-pinyin tone-four"),
  "answered pinyin vocabulary rows should reveal Pleco tone-colored pinyin",
);
assert(
  getCurrentVocabularyRowId(highlightedRowSession) === vocabularyItemId(hobbyEntry, 1),
  "current vocabulary row should advance after a word is found",
);
assert(
  getSelectedVocabularyIndex(highlightedRowSession) === 1,
  "selected vocabulary index should fall forward to the next unanswered row",
);
const skippedRowAdvanceSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [loveEntry, hobbyEntry, eightEntry],
  foundIds: new Set([vocabularyItemId(hobbyEntry, 1)]),
  missedIds: new Set(),
  selectedVocabularyIndex: 1,
};
assert(
  selectNextVocabularyRowAfter(skippedRowAdvanceSession, 1) === 2,
  "selected vocabulary row should advance forward instead of returning to an earlier skipped row",
);
skippedRowAdvanceSession.missedIds.add(vocabularyItemId(eightEntry, 2));
assert(
  selectNextVocabularyRowAfter(skippedRowAdvanceSession, 2) === 0,
  "selected vocabulary row should wrap to earlier skipped rows only after later rows are answered",
);

const hiddenTranslationSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [loveEntry, hobbyEntry],
  foundIds: new Set(),
  missedIds: new Set(),
  selectedVocabularyIndex: 0,
  hideTranslations: true,
};
const hiddenTranslationRows = buildVocabularyQuizRows(hiddenTranslationSession);
assert(hiddenTranslationRows.includes("Hidden"), "hidden translation option should hide unanswered meanings");
assert(!hiddenTranslationRows.includes("to love"), "hidden translation option should not expose unanswered meanings");
hiddenTranslationSession.foundIds.add(vocabularyItemId(loveEntry, 0));
const revealedTranslationRows = buildVocabularyQuizRows(hiddenTranslationSession);
assert(revealedTranslationRows.includes("to love"), "hidden translation option should reveal answered meanings");
assert(revealedTranslationRows.includes("mdbg.net/chinese/dictionary"), "revealed pinyin quiz rows should retain MDBG word links");

const givenUpRowSession = {
  type: "vocabulary",
  quizMode: "pinyin",
  items: [loveEntry, hobbyEntry],
  foundIds: new Set(),
  missedIds: new Set([vocabularyItemId(loveEntry, 0)]),
  selectedVocabularyIndex: 0,
  hideTranslations: true,
};
const givenUpRows = buildVocabularyQuizRows(givenUpRowSession);
assert(isVocabularyRowAnswered(givenUpRowSession, 0), "given up pinyin rows should count as answered");
assert(!isVocabularyRowCorrect(givenUpRowSession, 0), "given up pinyin rows should not count as correct");
assert(getVocabularyPinyinAnsweredCount(givenUpRowSession) === 1, "given up rows should count toward quiz completion");
assert(givenUpRows.includes('class="missed"'), "given up rows should render as missed");
assert(givenUpRows.includes("ài"), "given up rows should reveal the pinyin answer");
assert(givenUpRows.includes("to love"), "given up rows should reveal the translation");

const audioRowSession = {
  type: "vocabulary",
  quizMode: "meaning",
  items: [loveEntry, hobbyEntry],
  foundIds: new Set(),
  missedIds: new Set(),
  answers: [],
  selectedVocabularyIndex: 0,
  index: 0,
};
const audioRows = buildVocabularyQuizRows(audioRowSession, { hideTranslation: true });
assert(audioRows.includes("Hidden"), "audio row table should hide translations during the quiz");
assert(!audioRows.includes("to love"), "audio row table should not expose the English meaning");
assert(audioRows.includes('<td class="vocab-character-cell muted-slot">Hidden</td>'), "audio row table should hide unanswered characters");
assert(!audioRows.includes('<td class="chinese-text">爱</td>'), "audio row table should not visibly expose unanswered characters");
assert(!audioRows.includes('<td class="pinyin-slot">ài</td>'), "audio row table should not visibly expose unanswered pinyin");
assert(!audioRows.includes("mdbg.net/chinese/dictionary"), "audio row table should not link hidden unanswered characters");
audioRowSession.answers.push({ item: loveEntry, itemIndex: 0, answer: "love", score: 1, correct: true });
const answeredAudioRows = buildVocabularyQuizRows(audioRowSession, { hideTranslation: true });
assert(!answeredAudioRows.includes("tone-character"), "audio row table should not apply tone color spans to characters");
assert(!answeredAudioRows.includes("tone-colored-hanzi"), "audio row table should not apply tone color classes to characters");
assert(answeredAudioRows.includes("tone-pinyin tone-four"), "audio row table should reveal answered pinyin with tone colors");
assert(answeredAudioRows.includes("mdbg.net/chinese/dictionary"), "audio row table should link answered characters to MDBG");

const audioChoiceSession = {
  type: "vocabulary",
  quizMode: "meaning",
  items: [loveEntry, hobbyEntry],
  foundIds: new Set(),
  answers: [],
  selectedVocabularyIndex: 0,
  index: 0,
};
const audioChoices = getVocabularyChoiceSet(audioChoiceSession, 0);
assert(audioChoices.length === 5, "audio vocabulary mode should render five answer choices");
assert(audioChoices.filter((choice) => choice.correct).length === 1, "audio answer choices should include one correct answer");
assert(
  audioChoices.some((choice) => choice.correct && choice.text.includes("to love")),
  "audio answer choices should include the correct English meaning",
);
assert(
  audioChoices.map((choice) => choice.shortcut).join("") === "12345",
  "audio answer choices should expose 1-5 keyboard shortcuts",
);
assert(
  new Set(audioChoices.map((choice) => choice.text)).size === 5,
  "audio answer choices should not duplicate meanings",
);
assert(
  audioChoices.every((choice) => !containsChinese(choice.text)),
  "audio answer choices should be English-only",
);
assert(
  getVocabularyChoiceSet(audioChoiceSession, 0) === audioChoices,
  "audio answer choices should stay stable for the current question",
);
const chineseHintChoiceText = formatVocabularyChoiceText({ meanings: ["variant of 蛋", "egg"] });
assert(!containsChinese(chineseHintChoiceText), "audio choice text should remove Chinese hints from meanings");
assert(chineseHintChoiceText.includes("egg"), "audio choice text should keep English alternatives");
const choiceMarkup = buildVocabularyChoiceMarkup(audioChoices);
assert(choiceMarkup.includes('data-choice-id="choice-0-'), "audio answer choices should be clickable buttons");
assert(choiceMarkup.includes('<span class="choice-key">1</span>'), "audio answer choices should render shortcut labels");
const correctAudioPromptMarkup = buildVocabularyPromptMarkup(loveEntry, "meaning", {
  quizMode: "meaning",
  correct: true,
});
assert(
  correctAudioPromptMarkup.includes("answer-status-pill correct correct-celebration"),
  "correct audio answers should show an animated correct status",
);
assert(correctAudioPromptMarkup.includes("Correct"), "correct audio answers should label the answer as correct");
assert(correctAudioPromptMarkup.includes("爱"), "audio vocabulary mode should reveal the character after answering");
const wrongAudioPromptMarkup = buildVocabularyPromptMarkup(loveEntry, "meaning", {
  quizMode: "meaning",
  correct: false,
});
assert(wrongAudioPromptMarkup.includes("answer-status-pill wrong"), "wrong audio answers should show a wrong status");
assert(wrongAudioPromptMarkup.includes("Wrong"), "wrong audio answers should label the answer as wrong");
assert(
  !wrongAudioPromptMarkup.includes("wrong correct-celebration"),
  "wrong audio answers should not use the correct animation",
);
const selectedCorrectChoiceMarkup = buildVocabularyChoiceMarkup(
  [{ id: "choice-test", shortcut: "1", text: "to love", correct: true }],
  { choiceId: "choice-test", correct: true },
);
assert(
  selectedCorrectChoiceMarkup.includes("correct-celebration"),
  "correct selected audio choices should animate",
);
const correctDrillFeedbackMarkup = buildFeedbackMarkup(
  { mode: "reading", answer: "to love", score: 1, correct: true },
  { zh: "爱", en: "to love" },
);
assert(
  correctDrillFeedbackMarkup.includes("feedback good correct-celebration"),
  "correct sentence drill feedback should animate",
);

const pronunciationItem = { zh: "我爱你。", en: "I love you.", level: "beginner" };
const perfectPronunciation = assessPronunciationTranscript("我爱你", pronunciationItem);
assert(perfectPronunciation.score === 1, "perfect pronunciation transcripts should recognize all words");
assert(
  perfectPronunciation.tokens.filter((token) => token.type === "word").every((token) => token.recognized),
  "perfect pronunciation transcripts should mark each word recognized",
);
const partialPronunciation = assessPronunciationTranscript("我", pronunciationItem);
assert(partialPronunciation.goodCount === 1, "partial pronunciation transcripts should count recognized words");
assert(partialPronunciation.missedCount === 2, "partial pronunciation transcripts should count missed words");
const pronunciationMarkup = buildPronunciationSentenceMarkup(pronunciationItem, partialPronunciation);
assert(pronunciationMarkup.includes("pronunciation-token good"), "recognized pronunciation words should render green");
assert(pronunciationMarkup.includes("pronunciation-token missed"), "missed pronunciation words should render red");
assert(pronunciationMarkup.includes("pronunciation-pinyin-line"), "pronunciation prompts should optionally include pinyin");
const pronunciationNoPinyinMarkup = buildPronunciationSentenceMarkup(pronunciationItem, partialPronunciation, { showPinyin: false });
assert(!pronunciationNoPinyinMarkup.includes("pronunciation-pinyin-line"), "pronunciation prompts should hide pinyin when the option is disabled");
const plainPronunciationExpectedMarkup = buildAnswerBox("Expected", pronunciationItem.zh, { annotateChinese: false });
assert(!plainPronunciationExpectedMarkup.includes("annotated-pinyin-line"), "pronunciation feedback should hide annotated pinyin when the option is disabled");
assert(plainPronunciationExpectedMarkup.includes("answer-text chinese-text"), "plain pronunciation feedback should still render Chinese text cleanly");
assert(appSource.includes("state.session.showPinyin = state.pronunciationShowPinyin;"), "active pronunciation sessions should follow show-pinyin option changes");
assert(stylesSource.includes(".pronunciation-token.pending"), "pending pronunciation characters should use compact spacing");
assert(appSource.includes("recognition.continuous = true"), "pronunciation recording should keep listening across recognition chunks");
assert(appSource.includes("recognition.interimResults = true"), "pronunciation recording should collect interim speech instead of waiting for only one final result");
assert(appSource.includes("schedulePronunciationFinalization"), "pronunciation recording should wait for a quiet period before showing feedback");
assert(appSource.includes("requestPronunciationManualStop"), "pronunciation recording should let users stop and score the buffered transcript manually");
assert(appSource.includes('session.isListening ? "Show feedback" : "Record sentence"'), "pronunciation recording should expose a manual feedback action while listening");
assert(appSource.includes("if (state.session.isListening)"), "Enter should trigger manual feedback while pronunciation recording is active");
assert(appSource.includes("shouldRetryPronunciationRecognition"), "pronunciation recording should retry transient empty recognizer stops");
assert(appSource.includes("PRONUNCIATION_TERMINAL_ERRORS"), "pronunciation recording should still stop on terminal microphone and permission errors");
assert(
  getPronunciationRecognitionErrorMessage("network").includes("could not connect"),
  "pronunciation recording should explain browser speech service connection failures",
);
assert(
  getPronunciationRecognitionErrorMessage("audio-capture").includes("No microphone"),
  "pronunciation recording should explain missing microphone failures",
);
assert(stylesSource.includes(".recording-status"), "pronunciation recording should show listening status separately from the feedback action");
const pronunciationWeaknesses = getPronunciationWeaknessStats([partialPronunciation]);
assert(
  pronunciationWeaknesses.tones.some((item) => item.label === "Tone 4"),
  "missed pronunciation words should contribute tone weaknesses",
);
assert(
  pronunciationWeaknesses.initials.some((item) => item.label === "n"),
  "missed pronunciation words should contribute initial weaknesses",
);
assert(
  pronunciationWeaknesses.finals.some((item) => item.label === "ai"),
  "missed pronunciation words should contribute final weaknesses",
);
const parsedZhInitial = parsePinyinSyllable("zhong1");
assert(parsedZhInitial.initial === "zh", "pinyin parsing should prefer compound initials");
assert(parsedZhInitial.final === "ong", "pinyin parsing should extract finals");
assert(parsedZhInitial.toneLabel === "Tone 1", "pinyin parsing should expose tone labels");
const pronunciationRecord = buildHistoryRecord({
  type: "pronunciation",
  levels: ["beginner"],
  answers: [{ ...partialPronunciation, item: pronunciationItem, itemIndex: 0 }],
  elapsedSeconds: 18,
});
assert(pronunciationRecord.type === "pronunciation", "pronunciation history should store pronunciation records");
assert(pronunciationRecord.answers[0].missedWords.length === 2, "pronunciation history should store missed words");
assert(pronunciationRecord.weaknesses.tones.length > 0, "pronunciation history should store weakness summaries");
const mapRecord = buildHistoryRecord({
  type: "map",
  mapQuizMode: "city",
  answers: [
    {
      item: { ...guangzhouCity, kind: "city" },
      selectedName: "广州市",
      selectedKind: "city",
      correct: true,
      score: 1,
    },
    {
      item: { ...guangzhouCity, kind: "city" },
      selectedName: "广东省",
      selectedKind: "province",
      correct: false,
      score: 0,
    },
  ],
  elapsedSeconds: 25,
});
assert(mapRecord.type === "map", "map quiz history should store map records");
assert(mapRecord.mapQuizMode === "city", "map quiz history should store the map mode");
assert(mapRecord.correct === 1 && mapRecord.total === 2, "map quiz history should store score totals");
assert(mapRecord.answers[1].pinyin === guangzhouCity.pinyin, "map quiz history should store pinyin");

const fallbackChineseVoice = {
  lang: "zh-TW",
  localService: true,
  name: "Meijia",
  voiceURI: "Meijia",
};
assert(
  choosePreferredVoice([fallbackChineseVoice]) === fallbackChineseVoice,
  "speech playback should fall back to non-mainland Mandarin voices when needed",
);

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
localStorageEntries.set("chineseTrainerHistory", JSON.stringify([slowerPinyinRecord]));
const fasterPinyinResult = markVocabularyHighScoreResult({ ...completedPinyinResult, elapsedSeconds: 82 });
assert(fasterPinyinResult.isNewHighScore, "faster completed vocabulary results should be marked as a new high score");
assert(fasterPinyinResult.previousBestSeconds === 120, "new high scores should retain the previous best time");
const tiedPinyinResult = markVocabularyHighScoreResult({ ...completedPinyinResult, elapsedSeconds: 120 });
assert(!tiedPinyinResult.isNewHighScore, "ties should not be marked as new vocabulary high scores");
const incompleteHighScoreResult = markVocabularyHighScoreResult({ ...completedPinyinResult, finishReason: "ended" });
assert(
  !("isNewHighScore" in incompleteHighScoreResult),
  "incomplete vocabulary results should not receive high score celebration state",
);
const highScoreMarkup = buildHighScoreCelebration(fasterPinyinResult);
assert(highScoreMarkup.includes('role="status"'), "high score celebration should announce itself as status text");
assert(highScoreMarkup.includes("Nice, new best time!"), "high score celebration should include a short congratulation");
assert(
  highScoreMarkup.includes("Finished in 1:22. Beat 2:00."),
  "high score celebration should show the new time and previous best",
);
assert(
  buildHighScoreCelebration({ ...fasterPinyinResult, isNewHighScore: false }) === "",
  "non-high-score vocabulary results should not render a celebration",
);
let celebrationDismissed = false;
let celebrationRemoved = false;
const fakeCelebration = {
  isConnected: true,
  classList: {
    add(className) {
      if (className === "dismissed") {
        celebrationDismissed = true;
      }
    },
  },
  remove() {
    celebrationRemoved = true;
  },
};
context.document.querySelector = (selector) => (
  selector === ".high-score-celebration" ? fakeCelebration : null
);
dismissHighScoreCelebration();
runQueuedTimer();
assert(celebrationDismissed, "high score celebration should mark itself dismissed after a delay");
runQueuedTimer();
assert(celebrationRemoved, "high score celebration should remove itself after the fade");
context.document.querySelector = () => null;
localStorageEntries.delete("chineseTrainerHistory");

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

allVocabularyWords.forEach((item) => {
  const session = {
    type: "vocabulary",
    quizMode: "pinyin",
    items: [item],
    foundIds: new Set(),
    missedIds: new Set(),
    selectedVocabularyIndex: 0,
  };
  const normalized = normalizePinyinForCompare(item.pinyin);
  const compactToneFree = normalized.replace(/[1-5]/g, "").replace(/\s+/g, "");

  assert(findVocabularyGuessMatches(item.pinyin, session).length === 1, `${item.zh} should accept its tone-mark pinyin`);
  assert(findVocabularyGuessMatches(item.numeric, session).length === 1, `${item.zh} should accept its numeric pinyin`);
  assert(findVocabularyGuessMatches(compactToneFree, session).length === 1, `${item.zh} should accept compact tone-free pinyin`);
});

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
  assert(speechCalls.cancel === 0, "first speech playback should not cancel before speaking");
  assert(speechCalls.speak[0] === "爱", "speech replay should speak the requested word");
  assert(state.isSpeaking, "speech replay should mark playback as active");

  await speak("你");
  assert(speechCalls.cancel === 1, "replaying audio should cancel the previous utterance");
  assert(speechCalls.speak.length === 1, "replaying active audio should queue playback after cancellation");
  runQueuedTimer();
  assert(speechCalls.speak[1] === "你", "replaying audio should queue the latest utterance");

  await speak("好", { immediate: true });
  assert(speechCalls.cancel === 2, "immediate speech should still cancel active playback first");
  assert(speechCalls.speak.length === 2, "immediate replay should queue playback after cancellation");
  runQueuedTimer();
  assert(speechCalls.speak[2] === "好", "immediate speech should play after the cancellation delay");

  stopSpeech();
  assert(speechCalls.cancel === 3, "stopping playback should cancel speech synthesis");
  assert(!state.isSpeaking, "stopping playback should clear playback state");
}

function runQueuedTimer() {
  const callback = queuedTimers.shift();
  assert(typeof callback === "function", "expected speech replay to queue a timer");
  callback();
}

function vocabularyEntryKey(entry) {
  return `${entry.zh}::${entry.numeric || entry.pinyin}`;
}

function stripHtml(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
