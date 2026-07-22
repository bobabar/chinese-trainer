const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const indexSource = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const wordData = fs.readFileSync(path.join(ROOT, "word-data.js"), "utf8");
const vocabData = fs.readFileSync(path.join(ROOT, "vocab-data.js"), "utf8");
const grammarData = fs.readFileSync(path.join(ROOT, "grammar-data.js"), "utf8");
const componentData = fs.readFileSync(path.join(ROOT, "component-data.js"), "utf8");
const examData = fs.readFileSync(path.join(ROOT, "exam-data.js"), "utf8");
const readerData = fs.readFileSync(path.join(ROOT, "reader-data.js"), "utf8");
const chinaMapData = fs.readFileSync(path.join(ROOT, "china-map-data.js"), "utf8");
const accountSource = fs.readFileSync(path.join(ROOT, "account.js"), "utf8");
const appSource = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const stylesSource = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
const serviceWorkerSource = fs.readFileSync(path.join(ROOT, "service-worker.js"), "utf8");
const buildSiteSource = fs.readFileSync(path.join(ROOT, "scripts/build-site.js"), "utf8");
const webManifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.webmanifest"), "utf8"));
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
vm.runInContext(grammarData, context, { filename: "grammar-data.js" });
vm.runInContext(componentData, context, { filename: "component-data.js" });
vm.runInContext(examData, context, { filename: "exam-data.js" });
vm.runInContext(readerData, context, { filename: "reader-data.js" });
vm.runInContext(chinaMapData, context, { filename: "china-map-data.js" });
vm.runInContext(`${appSource}
window.__tests = {
  CHINA_CITIES,
  CHINA_MAP_ITEMS,
  CHINA_PROVINCES,
  CHARACTER_COMPONENT_LESSONS,
  CHARACTER_COMPONENT_MODULES,
  DASHBOARD_DAILY_GOAL,
  GRAMMAR_LESSONS,
  GRAMMAR_SESSION_LENGTH,
  HSK_MOCK_EXAMS,
  GRADED_READERS,
  PLACEMENT_GRAMMAR_PER_LEVEL,
  PLACEMENT_SESSION_LENGTH,
  PLACEMENT_VOCABULARY,
  PLACEMENT_VOCABULARY_PER_LEVEL,
  PROGRESS_ACTIVITY_DAYS,
  REVIEW_SESSION_LENGTH,
  STUDY_FOCUSES,
  TONE_LISTENING_SESSION_LENGTH,
  SENTENCE_LIBRARY_PAGE_SIZE,
  VOCABULARY_LIBRARY_PAGE_SIZE,
  VOCABULARY_CURRICULUM,
  VOCABULARY_MODES,
  VOCABULARY_QUIZ_SETS,
  assessMapQuizSelection,
  assessAnswer,
  assessHskExamAnswer,
  assessVocabularyAnswer,
  assessPronunciationTranscript,
  applyToneToPinyinSyllable,
  applySentenceDrillGrade,
  applyReviewAttempt,
  applyLearningBackup,
  buildAnswerBox,
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  buildFeedbackMarkup,
  buildDashboardPlan,
  buildDashboardWeekMarkup,
  buildHistoryRecord,
  buildHistoryRowMarkup,
  buildHistorySessionMarkup,
  buildHskRoadmapMarkup,
  buildGrammarPromptMarkup,
  buildGrammarSessionItems,
  buildComponentSessionItems,
  buildComponentExampleMarkup,
  buildLearningBackup,
  buildProgressActivityMarkup,
  buildHighScoreCelebration,
  buildChinaMapMarkup,
  buildMapQuizFeedbackMarkup,
  buildPlacementChoiceMarkup,
  buildPlacementFeedbackMarkup,
  buildPlacementSessionItems,
  buildPronunciationSentenceMarkup,
  buildPronunciationViewSwitcher,
  buildDrillViewSwitcher,
  buildReviewFeedbackMarkup,
  buildReviewQueue,
  buildMdbgWordUrl,
  buildToneColoredPinyinMarkup,
  buildToneChoiceMarkup,
  buildToneChoiceSet,
  buildVocabularyChoiceMarkup,
  buildVocabularyCurriculumSourceMarkup,
  buildVocabularyDetailDialog,
  buildVocabularyExampleMarkup,
  buildVocabularyLibraryRow,
  buildVocabularyPathPartMarkup,
  buildVocabularyQuizRows,
  buildVocabularySetPicker,
  buildVocabularyPromptMarkup,
  buildVocabularyViewSwitcher,
  buildSentenceLibraryRow,
  buildSentenceDrillGradeControls,
  containsChinese,
  choosePreferredVoice,
  canAccessReader,
  canAccessHskExamLevel,
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
  getStudyPlanPreview,
  getDashboardWeek,
  getHistoryActivityDays,
  getHistoryMistakeRetryData,
  getHistoryProgressData,
  getHistorySkillStats,
  getGrammarLessonProgress,
  getComponentCourseProgress,
  getReaderById,
  getGrammarQuestionPool,
  getGlobalSearchResults,
  getSavedGlobalSearchResults,
  getSavedNotebookData,
  getHskRoadmapData,
  getHskRoadmapRecommendation,
  getHskExamAttemptComparison,
  getHskExamAttemptSummary,
  getHskExamCoachRecommendations,
  getHskExamReadiness,
  getHskExamReviewExplanation,
  getHskExamResultStats,
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
  getPlacementRecommendation,
  getPlacementResultStats,
  getPlacementVocabularyPool,
  getMissedSentenceDrillItems,
  getMissedVocabularyReviewItems,
  getAllVocabularyReviewItems,
  getReviewChoiceSet,
  getReviewDashboardData,
  getPronunciationWeaknessStats,
  getPronunciationRecognitionErrorMessage,
  getToneListeningPool,
  getToneListeningWeaknessStats,
  getTonePattern,
  formatTimer,
  getSelectedVocabularySet,
  getSavedSentenceItems,
  getSentenceSearchPinyin,
  getRecommendedVocabularyPathPart,
  getVocabularySetReviewItems,
  isVocabularyRowAnswered,
  isVocabularyRowCorrect,
  isDashboardPlanRecordComplete,
  isReliableToneListeningItem,
  isSentenceDrillGradeShortcut,
  highlightVocabularyTermMarkup,
  loadHistoryRecords,
  loadReviewProgress,
  loadSavedVocabularyKeys,
  loadSavedSentenceIds,
  dismissHighScoreCelebration,
  markVocabularyHighScoreResult,
  normalizeEnglish,
  normalizeGlobalSearchText,
  normalizeLearningBackup,
  normalizePinyinForCompare,
  parsePinyinSyllable,
  reviewItemKey,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  selectNextVocabularyRowAfter,
  sessionUsesAudioPrompt,
  shouldStartSessionFromShortcut,
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
  CHARACTER_COMPONENT_LESSONS,
  CHARACTER_COMPONENT_MODULES,
  DASHBOARD_DAILY_GOAL,
  GRAMMAR_LESSONS,
  GRAMMAR_SESSION_LENGTH,
  HSK_MOCK_EXAMS,
  GRADED_READERS,
  PLACEMENT_GRAMMAR_PER_LEVEL,
  PLACEMENT_SESSION_LENGTH,
  PLACEMENT_VOCABULARY,
  PLACEMENT_VOCABULARY_PER_LEVEL,
  PROGRESS_ACTIVITY_DAYS,
  REVIEW_SESSION_LENGTH,
  STUDY_FOCUSES,
  TONE_LISTENING_SESSION_LENGTH,
  SENTENCE_LIBRARY_PAGE_SIZE,
  VOCABULARY_LIBRARY_PAGE_SIZE,
  VOCABULARY_CURRICULUM,
  VOCABULARY_MODES,
  VOCABULARY_QUIZ_SETS,
  assessMapQuizSelection,
  assessAnswer,
  assessHskExamAnswer,
  assessVocabularyAnswer,
  assessPronunciationTranscript,
  applyToneToPinyinSyllable,
  applySentenceDrillGrade,
  applyReviewAttempt,
  applyLearningBackup,
  buildAnswerBox,
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  buildFeedbackMarkup,
  buildDashboardPlan,
  buildDashboardWeekMarkup,
  buildHistoryRecord,
  buildHistoryRowMarkup,
  buildHistorySessionMarkup,
  buildHskRoadmapMarkup,
  buildGrammarPromptMarkup,
  buildGrammarSessionItems,
  buildComponentSessionItems,
  buildComponentExampleMarkup,
  buildLearningBackup,
  buildProgressActivityMarkup,
  buildHighScoreCelebration,
  buildChinaMapMarkup,
  buildMapQuizFeedbackMarkup,
  buildPlacementChoiceMarkup,
  buildPlacementFeedbackMarkup,
  buildPlacementSessionItems,
  buildPronunciationSentenceMarkup,
  buildPronunciationViewSwitcher,
  buildDrillViewSwitcher,
  buildReviewFeedbackMarkup,
  buildReviewQueue,
  buildMdbgWordUrl,
  buildToneColoredPinyinMarkup,
  buildToneChoiceMarkup,
  buildToneChoiceSet,
  buildVocabularyChoiceMarkup,
  buildVocabularyCurriculumSourceMarkup,
  buildVocabularyDetailDialog,
  buildVocabularyExampleMarkup,
  buildVocabularyLibraryRow,
  buildVocabularyPathPartMarkup,
  buildVocabularyQuizRows,
  buildVocabularySetPicker,
  buildVocabularyPromptMarkup,
  buildVocabularyViewSwitcher,
  buildSentenceLibraryRow,
  buildSentenceDrillGradeControls,
  containsChinese,
  choosePreferredVoice,
  canAccessReader,
  canAccessHskExamLevel,
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
  getStudyPlanPreview,
  getDashboardWeek,
  getHistoryActivityDays,
  getHistoryMistakeRetryData,
  getHistoryProgressData,
  getHistorySkillStats,
  getGrammarLessonProgress,
  getComponentCourseProgress,
  getReaderById,
  getGrammarQuestionPool,
  getGlobalSearchResults,
  getSavedGlobalSearchResults,
  getSavedNotebookData,
  getHskRoadmapData,
  getHskRoadmapRecommendation,
  getHskExamAttemptComparison,
  getHskExamAttemptSummary,
  getHskExamCoachRecommendations,
  getHskExamReadiness,
  getHskExamReviewExplanation,
  getHskExamResultStats,
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
  getPlacementRecommendation,
  getPlacementResultStats,
  getPlacementVocabularyPool,
  getMissedSentenceDrillItems,
  getMissedVocabularyReviewItems,
  getAllVocabularyReviewItems,
  getReviewChoiceSet,
  getReviewDashboardData,
  getPronunciationWeaknessStats,
  getPronunciationRecognitionErrorMessage,
  getToneListeningPool,
  getToneListeningWeaknessStats,
  getTonePattern,
  formatTimer,
  getSelectedVocabularySet,
  getSavedSentenceItems,
  getSentenceSearchPinyin,
  getRecommendedVocabularyPathPart,
  getVocabularySetReviewItems,
  isVocabularyRowAnswered,
  isVocabularyRowCorrect,
  isDashboardPlanRecordComplete,
  isReliableToneListeningItem,
  isSentenceDrillGradeShortcut,
  highlightVocabularyTermMarkup,
  loadHistoryRecords,
  loadReviewProgress,
  loadSavedVocabularyKeys,
  loadSavedSentenceIds,
  dismissHighScoreCelebration,
  markVocabularyHighScoreResult,
  normalizeEnglish,
  normalizeGlobalSearchText,
  normalizeLearningBackup,
  normalizePinyinForCompare,
  parsePinyinSyllable,
  reviewItemKey,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  selectNextVocabularyRowAfter,
  sessionUsesAudioPrompt,
  shouldStartSessionFromShortcut,
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
const hsk3VocabularySets = VOCABULARY_QUIZ_SETS.filter((set) => set.level === "New HSK 3");
const hsk1VocabularyWords = hsk1VocabularySets.flatMap((set) => set.words);
const hsk2VocabularyWords = hsk2VocabularySets.flatMap((set) => set.words);
const hsk3VocabularyWords = hsk3VocabularySets.flatMap((set) => set.words);
const hsk1VocabularyKeys = new Set(hsk1VocabularyWords.map((item) => item.officialIndex));
const hsk2VocabularyKeys = new Set(hsk2VocabularyWords.map((item) => item.officialIndex));
const hsk3VocabularyKeys = new Set(hsk3VocabularyWords.map((item) => item.officialIndex));
const allVocabularyWords = VOCABULARY_QUIZ_SETS.flatMap((set) => set.words);
const loveEntry = allVocabularyWords.find((item) => item.zh === "爱");
const hobbyEntry = allVocabularyWords.find((item) => item.zh === "爱好");
const eightEntry = allVocabularyWords.find((item) => item.zh === "八");
const womanEntry = allVocabularyWords.find((item) => item.zh === "女");
const erhuaEntry = allVocabularyWords.find((item) => item.zh === "好玩儿");
const toolNavButtons = [...indexSource.matchAll(/<button class="tool-tab"[^>]*data-tool="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g)];
const toolNavOrder = toolNavButtons
  .map((match) => `${match[1]}:${stripHtml(match[2])}`);
const drillModeOrder = [...indexSource.matchAll(/<button class="mode-tab"[^>]*data-mode="([^"]+)"[^>]*>([^<]+)<\/button>/g)]
  .map((match) => `${match[1]}:${match[2]}`);

assert(
  toolNavOrder.join("|") === "dashboard:Today|vocabulary:Vocabulary Quiz|review:Daily Review|grammar:Grammar Lab|components:Character Components|reader:Graded Readers|exam:Mock HSK Exam|pronunciation:Pronunciation|map:Geography of China|drill:Sentence Drills|history:History",
  "global nav should show Today before the learning tools and History",
);
assert(
  !toolNavButtons.some((match) => match[1] === "memory"),
  "the retired memory aid should not appear in global navigation",
);
assert(
  toolNavButtons.every((match) => match[2].includes("tool-tab-icon")),
  "global nav tool buttons should include distinguishing icons",
);
assert(
  drillModeOrder.join("|") === "reading:Reading|writing:Writing|listening:Listening",
  "sentence drill modes should show Reading, Writing, then Listening",
);
assert(indexSource.includes('rel="manifest" href="./manifest.webmanifest"'), "the app shell should expose its install manifest");
assert(indexSource.includes('<a class="skip-link" href="#app">Skip to main content</a>'), "the app shell should make the main learning task the first keyboard destination");
assert(indexSource.includes('rel="icon" href="./assets/logo-mandarin.svg" type="image/svg+xml"'), "the app shell should use the Mandarin tone mark");
assert(indexSource.includes('rel="apple-touch-icon" href="./assets/apple-touch-icon.png"'), "iOS installs should use the Mandarin Trainer icon");
assert(indexSource.includes('id="pwaAccess"') && indexSource.includes('id="installApp"') && indexSource.includes('id="refreshApp"'), "Options should expose install and update controls when the browser supports them");
assert(webManifest.name === "Mandarin Trainer" && webManifest.display === "standalone" && webManifest.start_url === "./", "the web manifest should launch Mandarin Trainer as a standalone app");
assert(
  webManifest.icons.some((icon) => icon.sizes === "192x192" && icon.purpose === "any") &&
    webManifest.icons.some((icon) => icon.sizes === "512x512" && icon.purpose === "any") &&
    webManifest.icons.some((icon) => icon.sizes === "512x512" && icon.purpose === "maskable"),
  "the install manifest should provide standard and maskable icons",
);
assertPngDimensions(path.join(ROOT, "assets/icon-192.png"), 192, 192, "the 192px app icon should have the declared dimensions");
assertPngDimensions(path.join(ROOT, "assets/icon-512.png"), 512, 512, "the 512px app icon should have the declared dimensions");
assertPngDimensions(path.join(ROOT, "assets/icon-maskable-512.png"), 512, 512, "the maskable app icon should have the declared dimensions");
assertPngDimensions(path.join(ROOT, "assets/apple-touch-icon.png"), 180, 180, "the iOS app icon should use the standard touch-icon dimensions");
assertPngDimensions(path.join(ROOT, "assets/logo-mandarin.png"), 900, 900, "the Mandarin tone mark should retain its high-resolution square master");
assertPngDimensions(path.join(ROOT, "assets/panda-mascot.png"), 800, 800, "the dashboard panda mascot should retain its square source dimensions");
assert(fs.statSync(path.join(ROOT, "assets/panda-mascot-192.webp")).size < 20000, "the rendered dashboard mascot should use a compact optimized asset");
[
  "index.html",
  "styles.css",
  "modern.css",
  "app-config.js",
  "account.js",
  "app.js",
  "vocab-data.js",
  "grammar-data.js",
  "component-data.js",
  "exam-data.js",
  "reader-data.js",
  "sentence-data.js",
  "word-data.js",
  "manifest.webmanifest",
  "assets/logo-mandarin.svg",
  "assets/logo-mandarin.png",
  "assets/panda-mascot-192.webp",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/icon-maskable-512.png",
  "assets/apple-touch-icon.png",
  "assets/vendor/SUPABASE-LICENSE.txt",
  "assets/exam/hsk-scenes-1.webp",
  "assets/exam/hsk-scenes-2.webp",
].forEach((asset) => {
  assert(serviceWorkerSource.includes(`"./${asset}"`), `${asset} should be available in the offline app shell`);
});
assert(serviceWorkerSource.includes("__BUILD_HASH__") && serviceWorkerSource.includes("APP_CACHE_PREFIX"), "offline caches should be rotated by a build-specific version");
assert(!serviceWorkerSource.includes('"./china-map-data.js"') && !serviceWorkerSource.includes('"./assets/vendor/supabase-2.110.5.js"'), "optional Geography and account payloads should not block offline-shell installation");
assert(appSource.includes('script.src = "./china-map-data.js"') && accountSource.includes('script.src = "./assets/vendor/supabase-2.110.5.js"'), "optional Geography and account payloads should load on demand");
assert(serviceWorkerSource.includes('request.mode === "navigate"') && serviceWorkerSource.includes("handleNavigationRequest"), "offline navigation should use a network-first app-shell fallback");
assert(serviceWorkerSource.includes('event.data?.type === "SKIP_WAITING"'), "app updates should activate only after an explicit update request");
assert(buildSiteSource.includes('"manifest.webmanifest"') && buildSiteSource.includes('"service-worker.js"') && buildSiteSource.includes("stampServiceWorker()"), "production builds should publish and version the offline app files");
assert(buildSiteSource.includes('"exam-data.js"'), "production builds should publish and cache-bust the HSK exam corpus");
assert(buildSiteSource.includes('"component-data.js"'), "production builds should publish and cache-bust the component course");
assert(buildSiteSource.includes('"reader-data.js"') && buildSiteSource.includes('"account.js"'), "production builds should publish account and graded-reader assets");
assert(!indexSource.includes('src="./assets/vendor/supabase-2.110.5.js"') && indexSource.indexOf("account.js") < indexSource.indexOf("app.js"), "account state should bind before the application while Supabase loads only on demand");
assert(!appSource.includes("study-plan-mobile-action"), "first-run setup should render only one primary completion action");
assert(appSource.includes("Listen to the Chinese word and choose its English meaning."), "Audio Quiz setup should describe its five-choice interaction");
assert(indexSource.includes('id="accountTrigger"') && indexSource.includes('id="accountDialog"'), "the app shell should expose account access and its secure dialog");
assert(indexSource.includes('id="supportProject"') && indexSource.includes("Donate"), "the global navigation should offer voluntary support");
assert(accountSource.includes("Support cross-cultural education") && accountSource.includes("Every tool remains free"), "the support dialog should explain that donations do not gate learning access");
assert(!indexSource.includes("Premium") && !accountSource.includes("Premium") && !appSource.includes("Premium"), "the learner-facing application should not advertise Premium access");
assert(fs.statSync(path.join(ROOT, "assets/exam/hsk-scenes-1.webp")).size > 10000, "the first HSK picture sheet should be a real optimized image asset");
assert(fs.statSync(path.join(ROOT, "assets/exam/hsk-scenes-2.webp")).size > 10000, "the second HSK picture sheet should be a real optimized image asset");
assert(appSource.includes('window.addEventListener("beforeinstallprompt"') && appSource.includes('updateViaCache: "none"'), "the app should expose native installation and bypass stale service-worker script caches");
assert(appSource.includes("showPwaUpdateReady") && appSource.includes('postMessage({ type: "SKIP_WAITING" })'), "new releases should wait for the learner to activate the update");
assert(stylesSource.includes(".pwa-status") && stylesSource.includes(".pwa-action-btn") && stylesSource.includes('body[data-tool="vocabulary"] .pwa-access'), "install and offline status controls should match the existing Options design and keep a full-width vocabulary row");
assert(GRADED_READERS.length === 12, "the graded reader shelf should include four original stories at each New HSK 1–3 level");
assert(new Set(GRADED_READERS.map((reader) => reader.id)).size === GRADED_READERS.length, "graded readers should have unique ids");
[1, 2, 3].forEach((level) => {
  const readers = GRADED_READERS.filter((reader) => reader.level === level);
  assert(readers.length === 4, `New HSK ${level} should include four graded readers`);
  readers.forEach((reader) => {
    assert(reader.sentences.length >= 6 && reader.vocabulary.length >= 4, `${reader.id} should contain a complete story and vocabulary list`);
    assert(reader.questions.length === 3, `${reader.id} should contain a three-question comprehension check`);
    assert(reader.questions.every((question) => question.options.length === 3 && question.answer >= 0 && question.answer < 3), `${reader.id} should contain valid answer choices`);
  });
});
assert(getReaderById(GRADED_READERS[0].id) === GRADED_READERS[0], "reader ids should resolve to their source story");
assert(GRADED_READERS.every((reader) => canAccessReader(reader)), "every New HSK 1–3 graded reader should be free without an account");
assert([1, 2, 3].every((level) => canAccessHskExamLevel(level)), "every New HSK 1–3 mock exam should be free without an account");
const readerHistoryFixture = buildHistoryRecord({
  type: "reader",
  readerId: GRADED_READERS[0].id,
  level: 1,
  title: GRADED_READERS[0].title,
  elapsedSeconds: 45,
  answers: GRADED_READERS[0].questions.map((question) => ({
    item: question,
    answer: question.options[question.answer],
    expected: question.options[question.answer],
    correct: true,
  })),
});
assert(readerHistoryFixture.type === "reader" && readerHistoryFixture.correct === 3, "completed reader checks should be stored in History");
const hskExpectedStructure = {
  1: { duration: 40, total: 40, sections: { listening: 20, reading: 20 } },
  2: { duration: 60, total: 60, sections: { listening: 25, reading: 25, writing: 10 } },
  3: { duration: 83, total: 70, sections: { listening: 30, reading: 30, writing: 10 } },
};
Object.entries(hskExpectedStructure).forEach(([level, expected]) => {
  const exam = HSK_MOCK_EXAMS.levels[level];
  const questions = exam.sections.flatMap((section) => section.parts.flatMap((part) => part.questions));
  const sectionCounts = Object.fromEntries(exam.sections.map((section) => [
    section.id,
    section.parts.reduce((count, part) => count + part.questions.length, 0),
  ]));
  assert(exam.durationMinutes === expected.duration, `New HSK ${level} should use its official-format total duration`);
  assert(exam.totalQuestions === expected.total && questions.length === expected.total, `New HSK ${level} should contain its official-format question total`);
  assert(JSON.stringify(sectionCounts) === JSON.stringify(expected.sections), `New HSK ${level} should use the official-format section counts`);
  assert(new Set(questions.map((question) => question.id)).size === questions.length, `New HSK ${level} question ids should be unique`);
});
const hskSpeakingPartCounts = HSK_MOCK_EXAMS.speaking.parts.map((part) => part.items.length);
assert(
  HSK_MOCK_EXAMS.speaking.durationMinutes === 15 &&
    HSK_MOCK_EXAMS.speaking.preparationMinutes === 6 &&
    hskSpeakingPartCounts.join("|") === "8|5|2",
  "New HSK 3 speaking should include 8 repeats, 5 picture descriptions, and 2 open responses within the official-format timing",
);
const hskChoiceQuestion = HSK_MOCK_EXAMS.levels[1].sections[0].parts[0].questions[0];
assert(assessHskExamAnswer(hskChoiceQuestion, hskChoiceQuestion.answer).correct, "HSK choice questions should score their keyed answer");
assert(!assessHskExamAnswer(hskChoiceQuestion, "not-the-answer").correct, "HSK choice questions should reject a wrong answer");
const hskReorderQuestion = HSK_MOCK_EXAMS.levels[2].sections
  .flatMap((section) => section.parts)
  .flatMap((part) => part.questions)
  .find((question) => question.type === "reorder");
const hskReorderAnswer = hskReorderQuestion.tokens.map((token, index) => ({ token, index }))
  .sort((left, right) => hskReorderQuestion.answer.indexOf(left.token) - hskReorderQuestion.answer.indexOf(right.token))
  .map((entry) => entry.index);
assert(assessHskExamAnswer(hskReorderQuestion, hskReorderAnswer).correct, "HSK word-order questions should score a correctly assembled sentence");
const hskFixtureAnswers = HSK_MOCK_EXAMS.levels[1].sections.flatMap((section) => section.parts.flatMap((part) => part.questions))
  .map((question) => assessHskExamAnswer(question, question.type === "choice" ? question.answer : question.answer));
const hskFixtureStats = getHskExamResultStats({ exam: HSK_MOCK_EXAMS.levels[1], answers: hskFixtureAnswers });
assert(hskFixtureStats.scaledScore === 200 && hskFixtureStats.maxScore === 200, "a perfect New HSK 1 fixture should score 200 of 200");
assert(
  HSK_MOCK_EXAMS.levels[1].sections.every((section) => section.parts.every((part) => part.questions.every((question) => question.partId === part.id))),
  "every HSK question should carry a stable part identifier for diagnostics",
);
const hskDiagnosticQuestions = HSK_MOCK_EXAMS.levels[1].sections.flatMap((section) => section.parts.flatMap((part) => part.questions));
const hskDiagnosticAnswers = hskDiagnosticQuestions.map((question, index) => {
  if (index === 0) {
    const wrongChoice = question.choices.find((choice) => choice.id !== question.answer);
    return assessHskExamAnswer(question, wrongChoice.id);
  }
  if (index === 5) {
    return assessHskExamAnswer(question, undefined);
  }
  return assessHskExamAnswer(question, question.answer);
});
const hskDiagnosticResult = {
  type: "exam",
  examMode: "written",
  level: 1,
  exam: HSK_MOCK_EXAMS.levels[1],
  answers: hskDiagnosticAnswers,
  historyRecordId: "current-exam",
};
const hskDiagnosticStats = getHskExamResultStats(hskDiagnosticResult);
assert(
  hskDiagnosticStats.sections[0].parts.length === 4 && hskDiagnosticStats.sections[0].parts[0].correct === 4,
  "HSK diagnostics should report each official part and its correct-answer count",
);
assert(getHskExamReadiness(0.86).id === "strong" && getHskExamReadiness(0.49).id === "foundation", "HSK readiness bands should distinguish strong and foundation-building results");
const hskCoachRecommendations = getHskExamCoachRecommendations(hskDiagnosticResult, hskDiagnosticStats);
assert(
  hskCoachRecommendations[0].id === "pace" && hskCoachRecommendations.some((item) => item.action === "listening"),
  "Exam Coach should prioritize unanswered items and launch practice for the weakest skill",
);
const hskAttemptHistory = [
  { id: "current-exam", type: "exam", examMode: "written", level: 1, scaledScore: hskDiagnosticStats.scaledScore, maxScore: 200, completedAt: "2026-07-15T05:00:00.000Z" },
  { id: "prior-exam", type: "exam", examMode: "written", level: 1, scaledScore: 150, maxScore: 200, completedAt: "2026-07-14T05:00:00.000Z" },
];
const hskComparison = getHskExamAttemptComparison(hskDiagnosticResult, hskAttemptHistory);
assert(hskComparison.attemptNumber === 2 && hskComparison.delta === hskDiagnosticStats.scaledScore - 150, "Exam Coach should compare the current attempt with the prior saved score");
const hskAttemptSummary = getHskExamAttemptSummary(1, hskAttemptHistory);
assert(hskAttemptSummary.attempts === 2 && hskAttemptSummary.bestScore === Math.max(150, hskDiagnosticStats.scaledScore), "exam level cards should report saved attempts and the personal best");
assert(getHskExamReviewExplanation(hskDiagnosticAnswers[5]).includes("expected response"), "unanswered exam review should explain the expected response and pacing lesson");
const hskDiagnosticHistory = buildHistoryRecord({
  ...hskDiagnosticResult,
  elapsedSeconds: 90,
  finishReason: "submitted",
});
assert(
  hskDiagnosticHistory.sections[0].parts.length === 4 && hskDiagnosticHistory.answers[0].partId === "1",
  "exam History should preserve part-level diagnostics for future comparisons",
);
assert(indexSource.includes('data-tool="exam"') && indexSource.includes('./exam-data.js'), "the app shell should expose and load the Mock HSK Exam tool");
assert(stylesSource.includes(".hsk-exam-session-shell") && stylesSource.includes(".hsk-exam-navigator") && stylesSource.includes(".hsk-exam-coach-priorities"), "mock exams should include dedicated responsive runner and coaching styling");
assert(SENTENCE_LIBRARY_PAGE_SIZE === 16, "sentence library should use a focused initial result batch");
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
const globalSearchFixtureResults = (query, options = {}) => Object.fromEntries(
  getGlobalSearchResults(query, {
    sentences: sentenceLibraryFixtures,
    ...options,
  }).map((group) => [group.id, group.results]),
);
const savedNotebookFixture = getSavedNotebookData({
  vocabulary: [loveEntry, eightEntry],
  sentences: sentenceLibraryFixtures,
  savedVocabularyKeys: new Set([reviewItemKey(loveEntry)]),
  savedSentenceIds: new Set(["library-running"]),
});
assert(
  savedNotebookFixture.total === 2 &&
    savedNotebookFixture.vocabulary[0].zh === "爱" &&
    savedNotebookFixture.sentences[0].id === "library-running",
  "the saved notebook should combine only bookmarked vocabulary and sentences",
);
const savedNotebookGroups = Object.fromEntries(
  getSavedGlobalSearchResults("", savedNotebookFixture).map((group) => [group.id, group.results]),
);
assert(
  savedNotebookGroups["saved-vocabulary"][0].item.zh === "爱" &&
    savedNotebookGroups["saved-sentences"][0].item.id === "library-running",
  "the saved notebook should preserve separate word and sentence groups",
);
assert(
  getSavedGlobalSearchResults("runs", savedNotebookFixture)
    .find((group) => group.id === "sentences")
    .results[0].item.id === "library-running",
  "the saved notebook should search within bookmarked material",
);
assert(
  globalSearchFixtureResults("爱").vocabulary[0].item.zh === "爱",
  "global search should prioritize an exact Chinese vocabulary match",
);
assert(
  globalSearchFixtureResults("nü").vocabulary[0].item.zh === "女",
  "global search should match tone-insensitive pinyin and accept an umlaut",
);
assert(
  globalSearchFixtureResults("love").vocabulary.some((result) => result.item.zh === "爱"),
  "global search should find vocabulary by English meaning",
);
assert(
  globalSearchFixtureResults("comparison").grammar[0].item.id === "hsk1-bi",
  "global search should find grammar by its English category",
);
assert(
  globalSearchFixtureResults("wo ai ni").sentences[0].item.id === "library-love",
  "global search should find sentences with tone-insensitive pinyin",
);
assert(
  globalSearchFixtureResults("the", { limit: 2 }).sentences.length <= 2,
  "global search should cap each result group",
);
assert(normalizeGlobalSearchText("  NǏ   HǍO  ") === "nǐ hǎo", "global search text normalization should preserve marked pinyin while normalizing spacing");
assert(
  indexSource.includes('id="globalSearchTrigger"') && indexSource.includes('id="globalSearchDialog"'),
  "the app shell should expose a global learning search",
);
assert(
  indexSource.includes('data-global-search-view="saved"') && indexSource.includes('id="globalSearchSavedActions"'),
  "the learning library should expose the saved notebook and its practice actions",
);
assert(
  appSource.includes('event.key.toLowerCase() !== "k"') &&
    appSource.includes('event.key === "Escape"') &&
    appSource.includes("activateGlobalSearchResult"),
  "global search should support keyboard entry, dismissal, and real study destinations",
);
assert(
  stylesSource.includes(".global-search-result") &&
    stylesSource.includes(".global-search-dialog") &&
    stylesSource.includes(".global-search-saved-actions") &&
    stylesSource.includes(".dashboard-notebook-button"),
  "global search and the saved notebook should include dedicated responsive styling",
);
assert(
  appSource.includes('id="openSavedNotebook"') && appSource.includes('openGlobalSearch({ view: "saved" })'),
  "Today should provide a direct entry into the saved notebook",
);
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
const exactReadingAssessment = assessAnswer("i love you", sentenceLibraryFixtures[0], "reading");
assert(
  exactReadingAssessment.correct && exactReadingAssessment.confirmed && exactReadingAssessment.gradeSource === "automatic",
  "sentence drills should automatically accept normalized exact English answers",
);
const exactWritingAssessment = assessAnswer("我 爱 你", sentenceLibraryFixtures[0], "writing");
assert(
  exactWritingAssessment.correct && exactWritingAssessment.confirmed,
  "writing drills should ignore punctuation and spacing for an otherwise exact Chinese answer",
);
const listeningGenderAssessment = assessAnswer("She runs every day", sentenceLibraryFixtures[1], "listening");
assert(
  listeningGenderAssessment.correct,
  "listening drills should not penalize the inaudible distinction between he and she",
);
const openEndedAssessment = assessAnswer("I adore you", sentenceLibraryFixtures[0], "reading");
assert(
  !openEndedAssessment.correct && !openEndedAssessment.confirmed && openEndedAssessment.gradeSource === "pending",
  "non-exact open-ended translations should require learner confirmation instead of receiving an arbitrary automatic percentage",
);
const previousShortcutSession = state.session;
state.session = { type: "drill", currentAssessment: null };
assert(
  !isSentenceDrillGradeShortcut({ key: "1", metaKey: false, ctrlKey: false, shiftKey: false }),
  "grading shortcuts should not consume numeric input before an answer has been assessed",
);
state.session.currentAssessment = openEndedAssessment;
assert(
  isSentenceDrillGradeShortcut({ key: "1", metaKey: false, ctrlKey: false, shiftKey: false }),
  "grading shortcuts should activate while an open-ended answer is being reviewed",
);
state.session = previousShortcutSession;
const selfCheckedAssessment = applySentenceDrillGrade(openEndedAssessment, true);
assert(
  selfCheckedAssessment.correct && selfCheckedAssessment.confirmed && selfCheckedAssessment.score === 1 && selfCheckedAssessment.gradeSource === "self",
  "learner-confirmed alternative wording should become a binary correct result",
);
const blankAssessment = assessAnswer("   ", sentenceLibraryFixtures[0], "reading");
assert(
  !blankAssessment.correct && blankAssessment.confirmed && blankAssessment.gradeSource === "blank",
  "blank sentence answers should be recorded directly as needing review",
);
const drillGradeControls = buildSentenceDrillGradeControls(openEndedAssessment);
assert(
  drillGradeControls.includes("Meaning is correct") && drillGradeControls.includes('data-drill-grade="correct"') && drillGradeControls.includes('data-drill-grade="review"'),
  "open-ended sentence feedback should provide explicit correct and review controls",
);
assert(
  buildSentenceDrillGradeControls({ ...openEndedAssessment, mode: "writing" }).includes("Chinese is correct"),
  "writing feedback should label its self-check in terms of the Chinese answer",
);
assert(
  !buildFeedbackMarkup(openEndedAssessment, sentenceLibraryFixtures[0]).includes("score-badge"),
  "sentence feedback should not display pseudo-precision similarity percentages",
);
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
  { id: "retired-memory", type: "memory" },
  { id: "kept-drill", type: "drill" },
  { id: "kept-review", type: "review" },
  { id: "kept-tone", type: "tone" },
  { id: "kept-grammar", type: "grammar" },
  { id: "kept-exam", type: "exam" },
  { id: "kept-placement", type: "placement" },
]));
assert(
  loadHistoryRecords().map((record) => record.id).join("|") === "kept-drill|kept-review|kept-tone|kept-grammar|kept-exam|kept-placement",
  "history loading should retain active practice types while ignoring records from the retired memory aid",
);
localStorageEntries.delete("chineseTrainerHistory");
const backupStorageSnapshot = new Map(localStorageEntries);
const backupTimestamp = Date.UTC(2026, 6, 15, 8, 30, 0);
localStorageEntries.set("chineseTrainerSettings", JSON.stringify({
  mode: "writing",
  voiceSpeed: "slow",
  studyTargetLevel: 2,
  studyFocus: "speaking",
  onboardingComplete: true,
}));
localStorageEntries.set("chineseTrainerHistory", JSON.stringify([
  { id: "backup-drill", type: "drill", mode: "reading" },
]));
localStorageEntries.set("chineseTrainerReviewProgress", JSON.stringify({
  "爱::ài": { stage: 2, dueAt: backupTimestamp },
}));
localStorageEntries.set("chineseTrainerSavedVocabulary", JSON.stringify(["爱::ài"]));
localStorageEntries.set("chineseTrainerSavedSentences", JSON.stringify(["library-love"]));
const learningBackup = buildLearningBackup(backupTimestamp);
assert(
  learningBackup.app === "chinese-trainer" && learningBackup.version === 1 && learningBackup.exportedAt === "2026-07-15T08:30:00.000Z",
  "learning backups should use a stable app identity, schema version, and timestamp",
);
assert(
  learningBackup.data.history[0].id === "backup-drill" &&
    learningBackup.data.settings.studyTargetLevel === 2 &&
    learningBackup.data.settings.studyFocus === "speaking" &&
    learningBackup.data.settings.onboardingComplete === true &&
    learningBackup.data.reviewProgress["爱::ài"].stage === 2 &&
    learningBackup.data.savedVocabulary[0] === "爱::ài" &&
    learningBackup.data.savedSentences[0] === "library-love",
  "learning backups should include the study target, history, review scheduling, saved words, and saved sentences",
);
const normalizedBackup = normalizeLearningBackup({
  ...learningBackup,
  data: {
    ...learningBackup.data,
    history: [...learningBackup.data.history, { id: "unsupported", type: "retired" }],
    savedVocabulary: ["爱::ài", "爱::ài"],
  },
});
assert(normalizedBackup.data.history.length === 1, "backup validation should discard unsupported history records");
assert(normalizedBackup.data.savedVocabulary.length === 1, "backup validation should deduplicate saved vocabulary keys");
assertThrows(
  () => normalizeLearningBackup({ ...learningBackup, app: "another-app" }),
  "backup validation should reject files from another app",
);
assertThrows(
  () => normalizeLearningBackup({ ...learningBackup, version: 99 }),
  "backup validation should reject unsupported schema versions",
);
localStorageEntries.set("chineseTrainerSavedSentences", JSON.stringify(["old-sentence"]));
applyLearningBackup(normalizedBackup);
assert(loadSavedSentenceIds().has("library-love"), "restoring a backup should replace saved sentence data");
assert(loadHistoryRecords()[0].id === "backup-drill", "restoring a backup should replace session history");
const beforeFailedRestore = new Map(localStorageEntries);
const originalStorageSetItem = context.localStorage.setItem;
let backupWriteCount = 0;
context.localStorage.setItem = function setItemWithFailure(key, value) {
  backupWriteCount += 1;
  if (backupWriteCount === 3) {
    throw new Error("Simulated storage failure");
  }
  originalStorageSetItem.call(this, key, value);
};
assertThrows(
  () => applyLearningBackup({
    ...normalizedBackup,
    data: { ...normalizedBackup.data, savedSentences: ["replacement"] },
  }),
  "backup restores should report browser storage failures",
);
context.localStorage.setItem = originalStorageSetItem;
assert(
  JSON.stringify([...localStorageEntries]) === JSON.stringify([...beforeFailedRestore]),
  "failed backup restores should roll back every learner data key",
);
localStorageEntries.clear();
backupStorageSnapshot.forEach((value, key) => localStorageEntries.set(key, value));
assert(appSource.includes('id="exportLearningData"') && appSource.includes('id="restoreLearningData"'), "Learning Progress should expose export and restore controls");
assert(
  stylesSource.includes(".history-data-actions") && stylesSource.includes(".progress-header .history-data-actions"),
  "learning data controls should preserve their compact responsive grid",
);
const reviewVocabulary = getAllVocabularyReviewItems();
const reviewNow = Date.UTC(2026, 6, 14, 2, 0, 0);
assert(REVIEW_SESSION_LENGTH === 12, "daily review should use a focused 12-word session");
assert(reviewVocabulary.length === hsk1VocabularyWords.length + hsk2VocabularyWords.length + hsk3VocabularyWords.length, "daily review should cover the full official HSK 1–3 vocabulary pool");
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
const firstHsk1ReviewItem = reviewVocabulary.find((item) => Number(getVocabularySetMeta(item).levelNumber) === 1);
const firstHsk2ReviewItem = reviewVocabulary.find((item) => Number(getVocabularySetMeta(item).levelNumber) === 2);
const firstHsk3ReviewItem = reviewVocabulary.find((item) => Number(getVocabularySetMeta(item).levelNumber) === 3);
const hsk2BaselineQueue = buildReviewQueue({}, reviewNow, reviewVocabulary, 2);
assert(
  Number(getVocabularySetMeta(hsk2BaselineQueue[0].item).levelNumber) === 2 &&
    hsk2BaselineQueue.every((entry) => entry.record || Number(getVocabularySetMeta(entry.item).levelNumber) === 2),
  "a new HSK 2 learner should receive HSK 2 unseen words instead of an HSK 1 baseline",
);
const hsk3BaselineQueue = buildReviewQueue({}, reviewNow, reviewVocabulary, 3);
assert(
  Number(getVocabularySetMeta(hsk3BaselineQueue[0].item).levelNumber) === 3 &&
    hsk3BaselineQueue.some((entry) => reviewItemKey(entry.item) === reviewItemKey(firstHsk3ReviewItem)),
  "a new HSK 3 learner should begin with unseen HSK 3 vocabulary",
);
const crossLevelDueQueue = buildReviewQueue({
  [reviewItemKey(firstHsk1ReviewItem)]: { stage: 1, dueAt: reviewNow - 1, lapses: 0 },
}, reviewNow, reviewVocabulary, 2);
assert(
  reviewItemKey(crossLevelDueQueue[0].item) === reviewItemKey(firstHsk1ReviewItem) &&
    crossLevelDueQueue.some((entry) => reviewItemKey(entry.item) === reviewItemKey(firstHsk2ReviewItem) && entry.statusLabel === "New"),
  "changing HSK targets should retain due words from earlier study while introducing new words from the selected level",
);
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
assert(vocabularyPath.levels.length === 3, "HSK path should keep HSK 1, HSK 2, and HSK 3 as separate levels");
assert(vocabularyPath.parts.length === VOCABULARY_QUIZ_SETS.length, "HSK path should include every vocabulary quiz part");
assert(vocabularyPath.totals.total === reviewVocabulary.length, "HSK path should account for the complete official HSK 1–3 vocabulary corpus");
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
const previousPronunciationView = state.pronunciationView;
state.pronunciationView = "tone";
const pronunciationViewSwitcherMarkup = buildPronunciationViewSwitcher();
assert(pronunciationViewSwitcherMarkup.includes('data-pronunciation-view="speaking"'), "pronunciation navigation should retain speaking practice");
assert(pronunciationViewSwitcherMarkup.includes('class="active" type="button" data-pronunciation-view="tone"'), "tone listening should have a distinct active navigation state");
state.pronunciationView = previousPronunciationView;
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
assert(dashboardPlan.find((activity) => activity.id === "grammar") && !dashboardPlan.find((activity) => activity.id === "grammar").completed, "Today should introduce grammar when it has not been practiced");
assert(Object.keys(STUDY_FOCUSES).join("|") === "balanced|speaking|literacy", "study setup should offer three distinct daily-plan focuses");
const speakingDashboardPlan = buildDashboardPlan(dashboardHistory, { dueCount: 0, totalTracked: 20 }, dashboardNow, "speaking");
assert(
  speakingDashboardPlan.map((activity) => `${activity.tool}:${activity.mode || ""}`).join("|") === "pronunciation:|drill:listening|review:",
  "the listening and speaking focus should prioritize pronunciation and a listening drill",
);
const literacyDashboardPlan = buildDashboardPlan(dashboardHistory, { dueCount: 0, totalTracked: 20 }, dashboardNow, "literacy");
assert(
  literacyDashboardPlan.map((activity) => `${activity.tool}:${activity.mode || ""}`).join("|") === "drill:writing|grammar:|review:",
  "the reading and writing focus should prioritize writing and grammar",
);
assert(
  getStudyPlanPreview("speaking")[1][0] === "Listening sentence drill" &&
    getStudyPlanPreview("literacy")[0][0] === "Writing sentence drill",
  "study setup previews should accurately reflect the plan that will be created",
);
const previousStudyTarget = state.studyTargetLevel;
state.studyTargetLevel = 3;
const hsk3LiteracyPlan = buildDashboardPlan(dashboardHistory, { dueCount: 0, totalTracked: 20 }, dashboardNow, "literacy");
assert(
  getStudyPlanPreview("literacy", "3")[1][0] === "Grammar pattern practice" &&
    hsk3LiteracyPlan.map((activity) => `${activity.tool}:${activity.mode || ""}`).join("|") === "drill:writing|grammar:|review:",
  "HSK 3 plans should include target-level Grammar Lab coverage",
);
state.studyTargetLevel = previousStudyTarget;
const completedGrammarPlan = buildDashboardPlan([
  { type: "grammar", scope: "mixed", completedAt: new Date(dashboardNow).toISOString(), total: 10, correct: 8 },
  ...dashboardHistory,
], { dueCount: 0, totalTracked: 20 }, dashboardNow);
assert(completedGrammarPlan.find((activity) => activity.id === "grammar")?.completed, "Today should retain a completed grammar activity instead of changing the plan after the session");
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
assert(dashboardData.completedCount === 2 && dashboardData.nextActivity.id === "grammar", "Today should continue with the first incomplete adaptive activity");
assert(stylesSource.includes(".dashboard-week-chart") && stylesSource.includes("body[data-tool=\"dashboard\"] .tool-controls"), "Today should have responsive dashboard styling and hide irrelevant global controls");
assert(
  appSource.includes('id="completeStudyPlan"') &&
    appSource.includes('data-study-plan-level="${option.id}"') &&
    appSource.includes('data-study-plan-focus="${id}"') &&
    appSource.includes('id="editStudyPlan"'),
  "new and returning learners should be able to create and edit a personalized study plan",
);
assert(
  appSource.includes('state.onboardingComplete = typeof saved.onboardingComplete === "boolean"') &&
    appSource.includes('state.onboardingComplete = true;'),
  "study-plan onboarding should persist while treating pre-existing settings as a completed migration",
);
assert(
  stylesSource.includes(".study-plan-layout") &&
    stylesSource.includes(".study-plan-focus-grid") &&
    stylesSource.includes(".dashboard-hero-actions"),
  "study setup and the editable plan controls should have responsive product styling",
);
assert(shouldStartSessionFromShortcut(null), "Enter should still launch the primary action when focus is not inside a control");
assert(
  !shouldStartSessionFromShortcut({ closest: () => ({ tagName: "BUTTON" }) }),
  "Enter on a focused setup button should use its native selection action instead of completing onboarding",
);
const emptyHsk1Roadmap = getHskRoadmapData(1, {
  history: [],
  progress: {},
  now: dashboardNow,
});
assert(emptyHsk1Roadmap.vocabularyLevel.totals.total === hsk1VocabularyWords.length, "HSK 1 roadmap should measure only the HSK 1 vocabulary curriculum");
assert(emptyHsk1Roadmap.lessons.length === 8 && emptyHsk1Roadmap.grammarStrong === 0, "HSK 1 roadmap should include the level's eight grammar patterns");
assert(emptyHsk1Roadmap.recommendation.type === "review-set" && emptyHsk1Roadmap.recommendation.setId === firstPathSet.id, "a new learner's roadmap should begin with the first vocabulary part");
const introducedRoadmapProgress = Object.fromEntries(
  firstPathItems.slice(0, REVIEW_SESSION_LENGTH).map((item) => [
    reviewItemKey(item),
    { stage: 1, dueAt: dashboardNow + dashboardDay, attempts: 1, correct: 1 },
  ]),
);
const introducedHsk1Roadmap = getHskRoadmapData(1, {
  history: [],
  progress: introducedRoadmapProgress,
  now: dashboardNow,
});
assert(introducedHsk1Roadmap.recommendation.type === "grammar-lesson", "the roadmap should introduce grammar after the learner establishes vocabulary coverage");
const dueHsk1Roadmap = getHskRoadmapData(1, {
  history: [],
  progress: pathProgressFixture,
  now: reviewNow,
});
assert(dueHsk1Roadmap.recommendation.type === "review-set" && dueHsk1Roadmap.recommendation.detail.includes("due"), "due vocabulary should override other roadmap recommendations");
const benchmarkRoadmap = getHskRoadmapData(1, {
  history: [
    { type: "vocabulary", setId: firstPathSet.id, quizMode: "pinyin", highScoreEligible: true },
    { type: "vocabulary", setId: firstPathSet.id, quizMode: "meaning", highScoreEligible: true },
    { type: "vocabulary", setId: hsk2VocabularySets[0].id, quizMode: "pinyin", highScoreEligible: true },
  ],
  progress: {},
  now: dashboardNow,
});
assert(benchmarkRoadmap.passedBenchmarks.size === 2, "roadmap benchmarks should track Pinyin and Audio separately while excluding other HSK levels");
const benchmarkReadyProgress = Object.fromEntries(
  firstPathItems.map((item) => [
    reviewItemKey(item),
    { stage: 1, dueAt: dashboardNow + dashboardDay, attempts: 1, correct: 1 },
  ]),
);
const benchmarkReadyHistory = GRAMMAR_LESSONS
  .filter((lesson) => lesson.level === 1)
  .map((lesson, index) => ({
    type: "grammar",
    completedAt: new Date(dashboardNow - index).toISOString(),
    answers: [{ lessonId: lesson.id, correct: false }],
  }));
const benchmarkReadyRoadmap = getHskRoadmapData(1, {
  history: benchmarkReadyHistory,
  progress: benchmarkReadyProgress,
  now: dashboardNow,
});
assert(
  benchmarkReadyRoadmap.recommendation.type === "quiz-set" &&
    benchmarkReadyRoadmap.recommendation.setId === firstPathSet.id &&
    benchmarkReadyRoadmap.recommendation.quizMode === "pinyin",
  "a fully introduced part should unlock its first missing timed benchmark once grammar practice is balanced",
);
const emptyHsk2Roadmap = getHskRoadmapData(2, { history: [], progress: {}, now: dashboardNow });
assert(emptyHsk2Roadmap.vocabularyLevel.totals.total === hsk2VocabularyWords.length && emptyHsk2Roadmap.level === 2, "HSK 2 roadmap should remain separate from HSK 1 progress");
const emptyHsk3Roadmap = getHskRoadmapData(3, { history: [], progress: {}, now: dashboardNow });
assert(
  emptyHsk3Roadmap.vocabularyLevel.totals.total === hsk3VocabularyWords.length &&
    emptyHsk3Roadmap.milestones.some((milestone) => milestone.id === "exam") &&
    emptyHsk3Roadmap.milestones.some((milestone) => milestone.id === "grammar") &&
    emptyHsk3Roadmap.lessons.length === 10,
  "HSK 3 roadmap should balance official vocabulary, core grammar, and timed mock readiness",
);
const roadmapMarkup = buildHskRoadmapMarkup(introducedHsk1Roadmap);
assert(roadmapMarkup.includes("HSK mastery roadmap") && roadmapMarkup.includes('data-roadmap-level="2"') && roadmapMarkup.includes('data-roadmap-level="3"'), "Today should expose all three official HSK roadmap targets");
assert(roadmapMarkup.includes('role="progressbar"') && roadmapMarkup.includes('id="continueHskRoadmap"'), "roadmap progress and continuation should be accessible and actionable");
assert(stylesSource.includes(".dashboard-roadmap-milestone") && stylesSource.includes(".dashboard-roadmap-levels"), "the HSK roadmap should include dedicated responsive styling");
assert(PLACEMENT_SESSION_LENGTH === 30, "the level check should sample HSK 1, 2, and 3 without overextending the session");
assert(PLACEMENT_VOCABULARY_PER_LEVEL === 6 && PLACEMENT_GRAMMAR_PER_LEVEL === 4, "the level check should balance six vocabulary and four language-use questions per level");
assert(Object.values(PLACEMENT_VOCABULARY).every((pool) => pool.length === 12), "each HSK level should have a varied placement vocabulary pool");
const placementVocabularyPools = [1, 2, 3].map((level) => getPlacementVocabularyPool(level));
assert(placementVocabularyPools.every((pool) => pool.length === 12 && pool.every((item) => item.pinyin)), "every curated placement word should resolve to sourced HSK vocabulary and pinyin");
const placementItems = buildPlacementSessionItems();
assert(placementItems.length === PLACEMENT_SESSION_LENGTH && new Set(placementItems.map((item) => item.id)).size === PLACEMENT_SESSION_LENGTH, "the level check should build thirty unique questions");
[1, 2, 3].forEach((level) => {
  const levelItems = placementItems.filter((item) => item.level === level);
  const vocabularyItems = levelItems.filter((item) => item.kind === "vocabulary");
  const languageItems = levelItems.filter((item) => item.kind === "language");
  assert(levelItems.length === 10 && vocabularyItems.length === 6 && languageItems.length === 4, `HSK ${level} placement should contain six vocabulary and four language-use questions`);
  assert(new Set(languageItems.map((item) => item.id)).size === 4, `HSK ${level} placement language use should sample four distinct questions`);
});
assert(
  placementItems.every((item) => item.choices.length === 4 && new Set(item.choices.map((choice) => choice.text)).size === 4 && item.choices.filter((choice) => choice.correct).length === 1),
  "every placement question should provide four unique choices with exactly one correct answer",
);
const buildPlacementFixture = (hsk1Correct, hsk2Correct, hsk3Correct) => {
  const levelOffsets = { 1: 0, 2: 0, 3: 0 };
  return {
    type: "placement",
    items: placementItems,
    elapsedSeconds: 145,
    answers: placementItems.map((item, itemIndex) => {
      const levelIndex = levelOffsets[item.level];
      levelOffsets[item.level] += 1;
      const expectedCorrect = item.level === 1 ? hsk1Correct : item.level === 2 ? hsk2Correct : hsk3Correct;
      const correct = levelIndex < expectedCorrect;
      const choice = correct ? item.choices.find((option) => option.correct) : item.choices.find((option) => !option.correct);
      return {
        item,
        itemIndex,
        choiceId: choice.id,
        answer: choice.text,
        expected: item.answer,
        correct,
        score: correct ? 1 : 0,
      };
    }),
  };
};
const hsk1FoundationPlacement = buildPlacementFixture(6, 10, 10);
const hsk2ReadyPlacement = buildPlacementFixture(7, 6, 10);
const hsk3ReadyPlacement = buildPlacementFixture(7, 7, 6);
const hsk3ConsolidationPlacement = buildPlacementFixture(7, 7, 7);
assert(getPlacementRecommendation(hsk1FoundationPlacement).band === "HSK 1 foundation", "sub-70% HSK 1 performance should recommend rebuilding the HSK 1 foundation");
assert(getPlacementRecommendation(hsk2ReadyPlacement).band === "Ready for HSK 2", "a secure HSK 1 result with weaker HSK 2 performance should recommend starting HSK 2");
assert(getPlacementRecommendation(hsk3ReadyPlacement).band === "Ready for HSK 3", "secure HSK 1 and 2 results with weaker HSK 3 performance should recommend starting HSK 3");
assert(getPlacementRecommendation(hsk3ConsolidationPlacement).band === "HSK 3 consolidation", "70% or better across all levels should recommend HSK 3 consolidation");
const placementStats = getPlacementResultStats(hsk2ReadyPlacement);
assert(placementStats.levels[1].correct === 7 && placementStats.levels[2].correct === 6, "placement results should preserve separate HSK 1 and HSK 2 scores");
assert(placementStats.levels[3].correct === 10, "placement results should preserve the separate HSK 3 score");
assert(placementStats.skills.vocabulary.total === 18 && placementStats.skills.language.total === 12, "placement results should preserve separate vocabulary and language-use totals");
const firstPlacementItem = placementItems[0];
const firstPlacementChoice = firstPlacementItem.choices[0];
assert(buildPlacementChoiceMarkup(firstPlacementItem, firstPlacementChoice, null).includes(`data-placement-choice-id="${firstPlacementChoice.id}"`), "placement choices should expose clickable keyboard-matched controls");
assert(buildPlacementFeedbackMarkup(firstPlacementItem, { correct: false }).includes("Review this one"), "placement feedback should explain incorrect answers immediately");
const placementHistoryRecord = buildHistoryRecord(hsk3ReadyPlacement);
assert(placementHistoryRecord.type === "placement" && placementHistoryRecord.recommendedLevel === 3 && placementHistoryRecord.correct === 20, "History should retain the placement score and recommended roadmap");
assert(placementHistoryRecord.answers.length === 30 && placementHistoryRecord.answers.every((answer) => answer.expected), "placement history should retain exact answer review data");
assert(buildHistoryRowMarkup(placementHistoryRecord).includes("Level check") && buildHistoryRowMarkup(placementHistoryRecord).includes("HSK 3 recommended"), "History should identify level checks and their recommendation");
assert(buildHistorySessionMarkup(placementHistoryRecord).includes("expected"), "placement History should explain missed vocabulary and grammar questions");
const placementRoadmap = getHskRoadmapData(3, { history: [placementHistoryRecord], progress: {}, now: dashboardNow });
const placementRoadmapMarkup = buildHskRoadmapMarkup(placementRoadmap);
assert(placementRoadmap.latestPlacement?.recommendedLevel === 3 && placementRoadmapMarkup.includes("Retake level check"), "Today should surface the latest placement and offer a retake");
assert(stylesSource.includes(".placement-session") && stylesSource.includes(".placement-results") && stylesSource.includes(".dashboard-placement-control"), "the placement check should include dedicated desktop and responsive styling");
assert(appSource.includes("scrollPlacementFeedbackIntoView()") && appSource.includes("scrollPlacementQuestionIntoView()"), "placement answers should keep feedback and the next prompt in view on compact screens");
assert(appSource.includes('aria-label="Level check progress"'), "placement progress should expose an accessible progressbar label");
assert(GRAMMAR_SESSION_LENGTH === 10, "mixed grammar practice should use a focused ten-question session");
assert(GRAMMAR_LESSONS.length === 26, "Grammar Lab should provide twenty-six core HSK 1, 2, and 3 pattern lessons");
assert(GRAMMAR_LESSONS.filter((lesson) => lesson.level === 1).length === 8, "Grammar Lab should provide eight HSK 1 patterns");
assert(GRAMMAR_LESSONS.filter((lesson) => lesson.level === 2).length === 8, "Grammar Lab should provide eight HSK 2 patterns");
assert(GRAMMAR_LESSONS.filter((lesson) => lesson.level === 3).length === 10, "Grammar Lab should provide ten HSK 3 patterns");
assert(
  GRAMMAR_LESSONS.every((lesson) => lesson.examples.length === 3 && lesson.questions.length === 3),
  "every grammar lesson should include three contextual examples and three checks",
);
assert(
  GRAMMAR_LESSONS.flatMap((lesson) => lesson.questions).every((question) => question.options.length === 4 && new Set(question.options).size === 4 && question.options.includes(question.answer)),
  "grammar checks should provide four unique choices including exactly one expected answer",
);
const grammarMixedItems = buildGrammarSessionItems("", 1);
assert(grammarMixedItems.length === 10 && new Set(grammarMixedItems.map((item) => item.id)).size === 10, "mixed grammar practice should select ten distinct questions");
assert(grammarMixedItems.every((item) => item.level === 1 && item.choices.length === 4), "mixed grammar practice should stay within the selected HSK level and build four choices");
const grammarHsk3Items = buildGrammarSessionItems("", 3);
assert(grammarHsk3Items.length === 10 && grammarHsk3Items.every((item) => item.level === 3), "mixed HSK 3 grammar practice should sample ten distinct target-level patterns");
const firstGrammarLesson = GRAMMAR_LESSONS[0];
const focusedGrammarItems = buildGrammarSessionItems(firstGrammarLesson.id, 1);
assert(focusedGrammarItems.length === 3 && focusedGrammarItems.every((item) => item.lessonId === firstGrammarLesson.id), "focused grammar checks should contain only the selected pattern");
assert(buildGrammarPromptMarkup("他___老师。").includes("grammar-blank") && !buildGrammarPromptMarkup("他___老师。").includes("___"), "grammar prompts should render a clear accessible blank");
const grammarResultFixture = {
  type: "grammar",
  scope: "lesson",
  lessonId: firstGrammarLesson.id,
  level: 1,
  answers: focusedGrammarItems.map((item, index) => ({
    item,
    answer: index ? item.answer : item.choices.find((choice) => !choice.correct).text,
    correct: index > 0,
    score: index > 0 ? 1 : 0,
  })),
  elapsedSeconds: 24,
};
const grammarHistoryRecord = buildHistoryRecord(grammarResultFixture);
assert(grammarHistoryRecord.type === "grammar" && grammarHistoryRecord.correct === 2 && grammarHistoryRecord.total === 3, "grammar history should retain focused practice scores");
assert(buildHistoryRowMarkup(grammarHistoryRecord).includes("Grammar practice"), "History should label grammar sessions clearly");
assert(buildHistorySessionMarkup(grammarHistoryRecord).includes("expected"), "grammar history should expose answer-level mistake review");
assert(getHistoryMistakeRetryData(grammarHistoryRecord)?.type === "grammar", "History should reconstruct missed grammar questions for focused retry");
const hsk3GrammarQuestion = getGrammarQuestionPool("", 3)[0];
const hsk3GrammarRetry = getHistoryMistakeRetryData({
  type: "grammar",
  level: 3,
  answers: [{ questionId: hsk3GrammarQuestion.id, correct: false }],
});
assert(hsk3GrammarRetry?.level === 3 && hsk3GrammarRetry.items[0].lessonId.startsWith("hsk3-"), "History should reconstruct HSK 3 grammar mistakes at the correct level");
assert(buildHistorySessionMarkup(grammarHistoryRecord).includes("Review 1 mistake"), "grammar History should offer exact mistake retry");
assert(getHistorySkillStats([grammarHistoryRecord]).find((skill) => skill.id === "grammar").accuracy === 2 / 3, "Learning progress should track grammar accuracy separately");
assert(getGrammarLessonProgress([grammarHistoryRecord], firstGrammarLesson.id).status === "Learning", "grammar lesson progress should distinguish learning patterns");
assert(isDashboardPlanRecordComplete(grammarHistoryRecord), "a completed focused grammar check should satisfy the adaptive language activity");
assert(stylesSource.includes(".grammar-lesson-list") && stylesSource.includes(".grammar-practice-layout"), "Grammar Lab should include first-class responsive lesson and practice styling");
assert(CHARACTER_COMPONENT_MODULES.length === 4, "Character Components should organize the curriculum into four progressive modules");
assert(CHARACTER_COMPONENT_LESSONS.length === 15, "Character Components should provide fifteen focused lessons");
assert(
  new Set(CHARACTER_COMPONENT_LESSONS.map((lesson) => lesson.id)).size === CHARACTER_COMPONENT_LESSONS.length,
  "component lessons should use unique identifiers",
);
assert(
  CHARACTER_COMPONENT_LESSONS.every((lesson) => lesson.examples.length === 3 && lesson.questions.length === 3),
  "every component lesson should include three worked examples and three inference checks",
);
assert(
  CHARACTER_COMPONENT_LESSONS.flatMap((lesson) => lesson.questions).every((question) => question.options.length === 4 && new Set(question.options).size === 4 && question.options.includes(question.answer)),
  "component checks should provide four unique choices including the expected answer",
);
assert(
  CHARACTER_COMPONENT_LESSONS.flatMap((lesson) => lesson.examples).every((example) => example.character && example.pinyin && example.meaning && example.semantic && example.phonetic),
  "worked component examples should identify the character, pronunciation, meaning clue, and sound clue",
);
const firstComponentLesson = CHARACTER_COMPONENT_LESSONS[0];
const focusedComponentItems = buildComponentSessionItems(firstComponentLesson.id);
assert(focusedComponentItems.length === 3 && focusedComponentItems.every((item) => item.lessonId === firstComponentLesson.id), "focused component checks should stay within the selected lesson");
assert(focusedComponentItems.every((item) => item.choices.length === 4 && item.choices.filter((choice) => choice.correct).length === 1), "component practice should create one correct choice among four keyboard-matched options");
const mixedComponentItems = buildComponentSessionItems();
assert(mixedComponentItems.length === 10 && new Set(mixedComponentItems.map((item) => item.id)).size === 10, "mixed component review should select ten distinct questions");
assert(
  buildComponentExampleMarkup(firstComponentLesson.examples[0], 0).includes("is-semantic") && buildComponentExampleMarkup(firstComponentLesson.examples[0], 0).includes("is-phonetic"),
  "worked examples should visibly distinguish meaning and sound clues",
);
const componentResultFixture = {
  type: "components",
  scope: "lesson",
  lessonId: firstComponentLesson.id,
  moduleId: firstComponentLesson.moduleId,
  items: focusedComponentItems,
  total: focusedComponentItems.length,
  elapsedSeconds: 42,
  answers: focusedComponentItems.map((item, index) => ({
    item,
    answer: index ? item.answer : item.choices.find((choice) => !choice.correct).text,
    expected: item.answer,
    correct: index > 0,
    score: index > 0 ? 1 : 0,
  })),
};
const componentHistoryRecord = buildHistoryRecord(componentResultFixture);
assert(componentHistoryRecord.type === "components" && componentHistoryRecord.correct === 2 && componentHistoryRecord.total === 3 && componentHistoryRecord.completed, "component history should retain completed lesson scores");
assert(buildHistoryRowMarkup(componentHistoryRecord).includes("Component practice"), "History should label component practice clearly");
assert(buildHistorySessionMarkup(componentHistoryRecord).includes("expected") && buildHistorySessionMarkup(componentHistoryRecord).includes(componentHistoryRecord.answers[0].character), "component History should retain answer-level decomposition review");
const componentProgress = getComponentCourseProgress([componentHistoryRecord]);
assert(componentProgress.completed === 1 && componentProgress.attempts === 3 && componentProgress.correct === 2, "component course progress should derive completion and accuracy from browser history");
assert(componentProgress.lessons.find((item) => item.lesson.id === firstComponentLesson.id).status === "Completed", "a completed component check below eighty percent should remain marked completed rather than strong");
assert(getHistorySkillStats([componentHistoryRecord]).find((skill) => skill.id === "components").accuracy === 2 / 3, "Learning progress should track component inference accuracy separately");
assert(stylesSource.includes(".component-lesson-list") && stylesSource.includes(".component-practice-layout"), "Character Components should include first-class responsive course and practice styling");
assert(appSource.includes("scrollComponentFeedbackIntoView()") && appSource.includes("scrollComponentQuestionIntoView()"), "component practice should keep feedback and each new prompt in view on compact screens");
assert(stylesSource.includes("animation: correct-highlight") && !stylesSource.includes("animation: correct-pop"), "success feedback should avoid transform-based compositor animations that can leave black artifacts");
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
assert(progressSkills.length === 10 && progressSkills[2].id === "components" && progressSkills[3].id === "exam", "Learning progress should report every core skill, including components and mock exams, in a stable order");
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
assert(sessionUsesAudioPrompt({ type: "tone" }), "tone listening should support the shared replay shortcut");
const reviewFeedback = buildReviewFeedbackMarkup(reviewVocabulary[0], {
  answer: "ren",
  correct: true,
  nextDueAt: Date.now() + 24 * 60 * 60 * 1000,
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
assert(VOCABULARY_LIBRARY_PAGE_SIZE === 24, "the vocabulary library should render a focused initial batch");
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
assert(!indexSource.includes('src="./china-map-data.js"') && appSource.includes('script.src = "./china-map-data.js"'), "map quiz should load committed China map data only when Geography opens");
assert(mapMarkup.includes("china-map-canvas"), "map quiz should render a local offline China map canvas");
assert(mapMarkup.includes("china-province-shape"), "map quiz should render local province boundary shapes");
assert(mapMarkup.includes("china-province-outline"), "province map mode should render a top outline layer for complete highlighted borders");
assert(mapMarkup.includes("china-small-region-selector"), "province map mode should render enlarged selectors for very small regions");
assert(mapMarkup.includes("enlarged selector"), "small region selectors should be available to keyboard and assistive tech users");
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
assert(VOCABULARY_QUIZ_SETS.length === 10, "vocabulary quizzes should be split into ten official level-specific parts");
assert(hsk1VocabularySets.length === 3, "New HSK 1 vocabulary should fit in three quiz parts");
assert(hsk2VocabularySets.length === 2, "New HSK 2 vocabulary should fit in two quiz parts");
assert(hsk3VocabularySets.length === 5, "New HSK 3 vocabulary should fit in five quiz parts");
assert(hsk1VocabularyWords.length === 300, "New HSK 1 parts should cover all 300 words in the official 2025 syllabus");
assert(hsk2VocabularyWords.length === 200, "New HSK 2 parts should cover all 200 additional words in the official 2025 syllabus");
assert(hsk3VocabularyWords.length === 500, "New HSK 3 parts should cover all 500 additional words in the official 2025 syllabus");
assert(hsk1VocabularyKeys.size === hsk1VocabularyWords.length, "New HSK 1 vocabulary should retain every official index");
assert(hsk2VocabularyKeys.size === hsk2VocabularyWords.length, "New HSK 2 vocabulary should retain every official index, including separate senses");
assert(hsk3VocabularyKeys.size === hsk3VocabularyWords.length, "New HSK 3 vocabulary should retain every official index, including separate senses");
assert(vocabularySetSizes.every((size) => size === 100), "official HSK 1–3 vocabulary should be split into focused 100-word quiz parts");
assert(VOCABULARY_QUIZ_SETS.every((set) => set.id.startsWith("new-hsk-2025-")), "official 2025 quiz parts should use versioned IDs so prior high scores remain honest");
assert(VOCABULARY_CURRICULUM.version === "2025-11" && VOCABULARY_CURRICULUM.levelCounts[3] === 500, "vocabulary metadata should identify the official 2025 HSK curriculum");
assert(
  allVocabularyWords.find((item) => item.officialIndex === 357).meanings[0] === "flower" &&
    allVocabularyWords.find((item) => item.officialIndex === 358).meanings[0] === "to spend money or time",
  "official numbered senses should remain distinct in meaning quizzes and review",
);
assert(formatVocabularySetOption(firstVocabularySet) === firstVocabularySet.label, "vocabulary set labels should not repeat the word count");
const firstVocabularySetMeta = getVocabularySetMeta(firstVocabularySet);
assert(firstVocabularySetMeta.levelLabel === "HSK 1", "vocabulary set icons should expose the HSK level");
assert(firstVocabularySetMeta.partLabel === "Part 1", "vocabulary set icons should expose the quiz part");
const vocabularySetPickerMarkup = buildVocabularySetPicker(firstVocabularySet.id);
assert(vocabularySetPickerMarkup.includes("quiz-set-card"), "vocabulary set picker should render icon buttons");
assert(vocabularySetPickerMarkup.includes("quiz-set-icon-level"), "vocabulary set picker should render level icons");
assert(vocabularySetPickerMarkup.includes('aria-pressed="true"'), "vocabulary set picker should mark the selected set");
assert(vocabularySetPickerMarkup.includes("HSK 3") && vocabularySetPickerMarkup.includes("Part 5"), "vocabulary set picker should include all five HSK 3 parts");
assert(!vocabularySetPickerMarkup.includes("Part 6"), "vocabulary set picker should stop at five parts");
assert(!vocabularySetPickerMarkup.includes("125 words"), "vocabulary set picker should not repeat the word count");
assert(buildVocabularyCurriculumSourceMarkup().includes("View source"), "vocabulary surfaces should link to the official syllabus source");
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
  items: [erhuaEntry],
  foundIds: new Set(),
  missedIds: new Set(),
  selectedVocabularyIndex: 0,
};
assert(findVocabularyGuessMatches("haowanr", erhuaPinyinSession).length === 1, "compact erhua pinyin should reveal 好玩儿");
assert(findVocabularyGuessMatches("haowaner", erhuaPinyinSession).length === 1, "expanded erhua pinyin should reveal 好玩儿");

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

const toneListeningPool = getToneListeningPool();
assert(TONE_LISTENING_SESSION_LENGTH === 15, "tone listening should use a focused 15-word session");
assert(toneListeningPool.length >= 700, "tone listening should draw from broad official HSK 1–3 coverage");
assert(
  toneListeningPool.every((item) => isReliableToneListeningItem(item)),
  "tone listening should exclude ambiguous readings and common tone-sandhi traps",
);
assert(
  !isReliableToneListeningItem({ zh: "你好", pinyin: "nǐ hǎo", numeric: "ni3 hao3", numericAlternates: [] }),
  "tone listening should exclude adjacent third tones whose heard form changes through tone sandhi",
);
assert(applyToneToPinyinSyllable("hao3", "4") === "hào", "tone choices should apply fourth-tone marks accurately");
assert(applyToneToPinyinSyllable("gui3", "1") === "guī", "tone choices should mark ui on its final vowel");
assert(applyToneToPinyinSyllable("liu2", "3") === "liǔ", "tone choices should mark iu on its final vowel");
assert(applyToneToPinyinSyllable("nv3", "4") === "nǜ", "tone choices should preserve umlaut vowels");
const loveToneChoices = buildToneChoiceSet(loveEntry, 0);
assert(loveToneChoices.length === 5, "tone listening should offer five tone-pattern choices");
assert(loveToneChoices.filter((choice) => choice.correct).length === 1, "tone listening should expose exactly one correct pattern");
assert(new Set(loveToneChoices.map((choice) => choice.tones.join("-"))).size === 5, "tone choices should not repeat a pattern");
assert(loveToneChoices.map((choice) => choice.shortcut).join("") === "12345", "tone choices should expose keyboard shortcuts one through five");
const correctLoveTone = loveToneChoices.find((choice) => choice.correct);
assert(getTonePattern(loveEntry).join("") === "4" && correctLoveTone.pinyin === "ài", "the correct tone choice should preserve the source pronunciation");
const toneChoiceMarkup = buildToneChoiceMarkup(loveToneChoices, {
  choiceId: correctLoveTone.id,
  correct: true,
});
assert(toneChoiceMarkup.includes("correct-celebration"), "correct tone choices should use the shared lightweight success animation");
assert(toneChoiceMarkup.includes("tone-four"), "tone choices should use Pleco tone colors");
assert(appSource.includes("tone-word-concealment") && appSource.includes("buildToneAnswerRevealMarkup"), "tone listening should hide the word until an answer is selected");
assert(stylesSource.includes(".tone-listening-layout") && stylesSource.includes(".tone-choice-option"), "tone listening should include responsive first-class styling");
assert(indexSource.includes("pronunciation-only pronunciation-speaking-only"), "speaking-only pinyin options should be scoped away from tone listening");
assert(stylesSource.includes('data-pronunciation-view="speaking"'), "pronunciation options should respond to the selected practice type");
assert(appSource.includes('state.pronunciationView = PRONUNCIATION_VIEWS.has(mode) ? mode : "speaking";'), "dashboard pronunciation actions should launch their intended practice type");

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
const missedToneAnswer = {
  item: loveEntry,
  itemIndex: 0,
  selectedPinyin: "ái",
  selectedTones: ["2"],
  correctTones: ["4"],
  selectedPattern: "2",
  correctPattern: "4",
  correct: false,
  score: 0,
};
const toneWeaknesses = getToneListeningWeaknessStats([missedToneAnswer]);
assert(toneWeaknesses.tones[0].label === "Tone 4", "tone listening should identify the tone the learner missed");
assert(toneWeaknesses.patterns[0].label === "4", "tone listening should identify difficult tone patterns");
const toneRecord = buildHistoryRecord({
  type: "tone",
  answers: [missedToneAnswer],
  elapsedSeconds: 9,
});
assert(toneRecord.type === "tone" && toneRecord.correct === 0, "tone listening should create a distinct history record");
assert(toneRecord.answers[0].selectedPattern === "2" && toneRecord.answers[0].correctPattern === "4", "tone history should retain the selected and expected patterns");
assert(buildHistoryRowMarkup(toneRecord).includes("Tone listening"), "History should label tone listening sessions clearly");
assert(buildHistorySessionMarkup(toneRecord).includes("expected 4"), "tone history should expose answer-level review");
assert(getHistorySkillStats([toneRecord]).find((skill) => skill.id === "tone").accuracy === 0, "Learning progress should track tone-listening accuracy separately");
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

function assertThrows(callback, message) {
  let threw = false;
  try {
    callback();
  } catch {
    threw = true;
  }
  assert(threw, message);
}

function assertPngDimensions(filePath, expectedWidth, expectedHeight, message) {
  const png = fs.readFileSync(filePath);
  const signature = png.subarray(0, 8).toString("hex");
  assert(signature === "89504e470d0a1a0a", `${message}: file is not a PNG`);
  assert(png.readUInt32BE(16) === expectedWidth && png.readUInt32BE(20) === expectedHeight, message);
}
