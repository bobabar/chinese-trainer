const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const wordData = fs.readFileSync(path.join(ROOT, "word-data.js"), "utf8");
const appSource = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

const context = {
  window: {
    ADDITIONAL_SENTENCES: [],
    addEventListener() {},
    speechSynthesis: {
      cancel() {},
      getVoices: () => [],
      speak() {},
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
vm.runInContext(`${appSource}
window.__tests = {
  buildAnswerBoxText,
  buildAnnotatedChineseMarkup,
  containsChinese,
  scoreEnglish,
};`, context, { filename: "app.js" });

const { buildAnswerBoxText, buildAnnotatedChineseMarkup, containsChinese, scoreEnglish } = context.window.__tests;
const annotated = buildAnswerBoxText("我爱你。");
const wordMarkup = buildAnnotatedChineseMarkup("我爱你。");

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

console.log("Validated app annotation and scoring helpers.");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
