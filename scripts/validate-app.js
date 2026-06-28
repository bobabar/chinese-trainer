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
    getItem: () => "{}",
    setItem() {},
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
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  containsChinese,
  getSelectedVocabularySet,
  normalizeEnglish,
  normalizePinyinForCompare,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  speak,
  state,
  stopSpeech,
};`, context, { filename: "app.js" });

const {
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  containsChinese,
  getSelectedVocabularySet,
  normalizeEnglish,
  normalizePinyinForCompare,
  scoreEnglish,
  scorePinyin,
  scoreVocabularyMeaning,
  speak,
  state,
  stopSpeech,
} =
  context.window.__tests;
const annotated = buildAnswerBoxText("我爱你。");
const wordMarkup = buildAnnotatedChineseMarkup("我爱你。");
const firstVocabularySet = getSelectedVocabularySet();
const loveEntry = firstVocabularySet.words.find((item) => item.zh === "爱");

assert(containsChinese("Reference: 我爱你。"), "Chinese detection should find Han characters inside mixed text");
assert(annotated.includes("annotated-chinese"), "Chinese answer boxes should use annotated markup");
assert(annotated.includes("chinese-text"), "annotated Chinese should use the shared Chinese text styling");
assert(wordMarkup.includes("annotated-hanzi-line"), "annotated Chinese should include a separate Hanzi line");
assert(wordMarkup.includes("annotated-pinyin-line"), "annotated Chinese should include a separate pinyin line");
assert(wordMarkup.includes("data-gloss="), "annotated Chinese words should include gloss hover text");
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
assert(firstVocabularySet.words.length === 50, "vocabulary quiz sets should contain 50 words");
assert(normalizePinyinForCompare("ài") === "ai4", "tone-mark pinyin should normalize to numeric tones");
assert(scorePinyin("ai4", loveEntry) >= 0.99, "numeric pinyin should be accepted");
assert(scorePinyin("ài", loveEntry) >= 0.99, "tone-mark pinyin should be accepted");
assert(scorePinyin("ai", loveEntry) >= 0.7, "tone-free pinyin should receive partial credit");
assert(scoreVocabularyMeaning("love", loveEntry) >= 0.99, "vocabulary meanings should match accepted meanings");

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

  stopSpeech();
  assert(speechCalls.cancel === 3, "stopping playback should cancel speech synthesis");
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
