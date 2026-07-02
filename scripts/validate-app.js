const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const indexSource = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const wordData = fs.readFileSync(path.join(ROOT, "word-data.js"), "utf8");
const vocabData = fs.readFileSync(path.join(ROOT, "vocab-data.js"), "utf8");
const chinaMapData = fs.readFileSync(path.join(ROOT, "china-map-data.js"), "utf8");
const appSource = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
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
  VOCABULARY_MODES,
  VOCABULARY_QUIZ_SETS,
  assessMapQuizSelection,
  assessVocabularyAnswer,
  assessPronunciationTranscript,
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  buildFeedbackMarkup,
  buildHistoryRecord,
  buildHighScoreCelebration,
  buildChinaMapMarkup,
  buildPronunciationSentenceMarkup,
  buildVocabularyChoiceMarkup,
  buildVocabularyQuizRows,
  buildVocabularySetPicker,
  buildVocabularyPromptMarkup,
  containsChinese,
  choosePreferredVoice,
  determineVocabularyTimeLimit,
  findVocabularyGuessMatches,
  formatVocabularyChoiceText,
  formatVocabularySetOption,
  getVocabularySetMeta,
  getCurrentVocabularyRowId,
  getSelectedVocabularyIndex,
  getVocabularyChoiceSet,
  getVocabularyHighScore,
  getVocabularyHighScoreRecords,
  getVocabularyPinyinAnsweredCount,
  getVocabularyResultStats,
  getMapQuizPool,
  getPronunciationWeaknessStats,
  formatTimer,
  getSelectedVocabularySet,
  isVocabularyRowAnswered,
  isVocabularyRowCorrect,
  dismissHighScoreCelebration,
  markVocabularyHighScoreResult,
  normalizeEnglish,
  normalizePinyinForCompare,
  parsePinyinSyllable,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  selectNextVocabularyRowAfter,
  sessionUsesAudioPrompt,
  speak,
  state,
  stopSpeech,
  trashIconMarkup,
  vocabularyItemId,
};`, context, { filename: "app.js" });

const {
  CHINA_CITIES,
  CHINA_MAP_ITEMS,
  CHINA_PROVINCES,
  VOCABULARY_MODES,
  VOCABULARY_QUIZ_SETS,
  assessMapQuizSelection,
  assessVocabularyAnswer,
  assessPronunciationTranscript,
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  buildFeedbackMarkup,
  buildHistoryRecord,
  buildHighScoreCelebration,
  buildChinaMapMarkup,
  buildPronunciationSentenceMarkup,
  buildVocabularyChoiceMarkup,
  buildVocabularyQuizRows,
  buildVocabularySetPicker,
  buildVocabularyPromptMarkup,
  containsChinese,
  choosePreferredVoice,
  determineVocabularyTimeLimit,
  findVocabularyGuessMatches,
  formatVocabularyChoiceText,
  formatVocabularySetOption,
  getVocabularySetMeta,
  getCurrentVocabularyRowId,
  getSelectedVocabularyIndex,
  getVocabularyChoiceSet,
  getVocabularyHighScore,
  getVocabularyHighScoreRecords,
  getVocabularyPinyinAnsweredCount,
  getVocabularyResultStats,
  getMapQuizPool,
  getPronunciationWeaknessStats,
  formatTimer,
  getSelectedVocabularySet,
  isVocabularyRowAnswered,
  isVocabularyRowCorrect,
  dismissHighScoreCelebration,
  markVocabularyHighScoreResult,
  normalizeEnglish,
  normalizePinyinForCompare,
  parsePinyinSyllable,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  selectNextVocabularyRowAfter,
  sessionUsesAudioPrompt,
  speak,
  state,
  stopSpeech,
  trashIconMarkup,
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
  toolNavOrder.join("|") === "vocabulary:Vocabulary Quiz|pronunciation:Pronunciation|map:Province & City Quiz|drill:Sentence Drills|history:History",
  "global nav should show Vocabulary Quiz, Pronunciation, Province & City Quiz, Sentence Drills, and History in order",
);
assert(
  toolNavButtons.every((match) => match[2].includes("tool-tab-icon")),
  "global nav tool buttons should include distinguishing icons",
);
assert(
  drillModeOrder.join("|") === "reading:Reading|writing:Writing|listening:Listening",
  "sentence drill modes should show Reading, Writing, then Listening",
);
assert(CHINA_PROVINCES.length === 34, "map quiz should include 34 province-level targets");
assert(CHINA_CITIES.length >= 30, "map quiz should include city pin targets");
assert(CHINA_MAP_ITEMS.length === CHINA_PROVINCES.length + CHINA_CITIES.length, "map quiz pool should combine provinces and cities");
assert(
  getMapQuizPool("province").length === CHINA_PROVINCES.length &&
    getMapQuizPool("province").every((item) => item.kind === "province"),
  "province map mode should only draw province-level quiz targets",
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
  "map quiz should use official Chinese province-level names",
);
const guangdongProvince = CHINA_PROVINCES.find((item) => item.name === "广东省");
const guangzhouCity = CHINA_CITIES.find((item) => item.name === "广州市");
assert(guangdongProvince, "map data should include 广东省");
assert(guangzhouCity, "map data should include 广州市");
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
assert(indexSource.includes("china-map-data.js"), "map quiz should load committed China map data before app startup");
assert(mapMarkup.includes("china-map-canvas"), "map quiz should render a local offline China map canvas");
assert(mapMarkup.includes("china-province-shape"), "map quiz should render local province boundary shapes");
assert(mapMarkup.includes("china-province-outline"), "province map mode should render a top outline layer for complete highlighted borders");
assert(!mapMarkup.includes("mapProvinceLift"), "map quiz should not use the province shadow filter that can render black selection artifacts");
assert(!indexSource.includes("amap-config.js"), "map quiz should not load map API config at runtime");
assert(!appSource.includes("webapi.amap.com"), "map quiz should not call the Gaode JavaScript API at runtime");
assert(!appSource.includes("List Quiz"), "map quiz should not render the removed List Quiz chip");
assert(!appSource.includes("Mode: China Map"), "map quiz should not render the removed Mode chip");
assert(appSource.includes("map-mode-header"), "map quiz should render province/city mode selection at the top");
assert(
  CHINA_CITIES.every((item) => Number.isFinite(item.lng) && Number.isFinite(item.lat)),
  "map quiz city targets should include longitude and latitude for local pins",
);
assert(!mapMarkup.includes("data-map-city-id"), "province map mode should not render city pins");
assert(cityMapMarkup.includes("data-map-city-id"), "city map mode should render city pins");
assert(!cityMapMarkup.includes("data-map-province-id"), "city map mode should not make province shapes selectable");
assert(!cityMapMarkup.includes("china-province-outline"), "city map mode should not render province highlight outlines");
assert(
  !/china-province-shape[^"]*is-(hint|correct|wrong)/.test(cityProvinceAssessmentMarkup),
  "city map mode should not apply answer highlights to province shapes",
);
assert(!mapMarkup.includes("map-info-bubble"), "map quiz should not render a map source info bubble");
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
assert(normalizePinyinForCompare("ài") === "ai4", "tone-mark pinyin should normalize to numeric tones");
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
highlightedRowSession.foundIds.add(vocabularyItemId(loveEntry, 0));
highlightedRowSession.lastCorrectItemIndex = 0;
assert(
  buildVocabularyQuizRows(highlightedRowSession).includes("correct-celebration"),
  "recently correct pinyin vocabulary rows should animate",
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
assert(audioRows.includes('<td class="muted-slot">Hidden</td>'), "audio row table should hide unanswered characters");
assert(!audioRows.includes('<td class="chinese-text">爱</td>'), "audio row table should not visibly expose unanswered characters");
assert(!audioRows.includes('<td class="pinyin-slot">ài</td>'), "audio row table should not visibly expose unanswered pinyin");
audioRowSession.answers.push({ item: loveEntry, itemIndex: 0, answer: "love", score: 1, correct: true });
const answeredAudioRows = buildVocabularyQuizRows(audioRowSession, { hideTranslation: true });
assert(answeredAudioRows.includes('<td class="chinese-text">爱</td>'), "audio row table should reveal answered characters");
assert(answeredAudioRows.includes('<td class="pinyin-slot">ài</td>'), "audio row table should reveal answered pinyin");

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
