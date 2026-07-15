const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT_PATH = path.join(ROOT, "vocab-data.js");
const OFFICIAL_PATH = path.join(ROOT, "data", "hsk-2025-vocabulary-1-3.json");
const DICTIONARY_URL = "https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.min.json";
const LEVELS = [
  { level: 1, label: "New HSK 1", maxParts: 3 },
  { level: 2, label: "New HSK 2", maxParts: 2 },
  { level: 3, label: "New HSK 3", maxParts: 5 },
];
const FALLBACK_DATA = {
  "没事": { pinyin: "méi shì", meanings: ["it's not important", "it's nothing", "never mind"] },
  "哪个": { pinyin: "nǎ ge", meanings: ["which one", "which"] },
  "那个": { pinyin: "nà ge", meanings: ["that one", "that"] },
  "你好": { pinyin: "nǐ hǎo", meanings: ["hello", "hi"] },
  "玩": { pinyin: "wán", meanings: ["to play", "to have fun"] },
  "一下": { pinyin: "yí xià", meanings: ["a little", "for a moment", "once"] },
  "这个": { pinyin: "zhè ge", meanings: ["this", "this one"] },
  "没意思": { pinyin: "méi yì si", meanings: ["boring", "uninteresting", "meaningless"] },
  "冰激凌": { pinyin: "bīng jī líng", meanings: ["ice cream"] },
  "电子书": { pinyin: "diàn zǐ shū", meanings: ["e-book", "electronic book"] },
  "过节": { pinyin: "guò jié", meanings: ["to celebrate a festival", "to spend a holiday"] },
  "红绿灯": { pinyin: "hóng lǜ dēng", meanings: ["traffic light", "traffic signal"] },
  "检票": { pinyin: "jiǎn piào", meanings: ["to check tickets"] },
  "勺子": { pinyin: "sháo zi", meanings: ["spoon", "ladle"] },
  "数学": { pinyin: "shù xué", meanings: ["mathematics", "math"] },
  "四季": { pinyin: "sì jì", meanings: ["the four seasons"] },
  "小区": { pinyin: "xiǎo qū", meanings: ["residential community", "neighborhood"] },
};
const OFFICIAL_SENSE_DATA = {
  33: ["o'clock", "point", "small amount"],
  82: ["can", "to know how to", "to be able to"],
  336: ["to order", "to select", "to light", "to click"],
  350: ["to go over", "to pass", "away"],
  357: ["flower", "blossom"],
  358: ["to spend money or time"],
  486: ["station", "stop"],
  660: ["the past", "former times"],
  683: ["meeting", "to meet", "to gather"],
  966: ["to stand", "to be on one's feet"],
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const official = JSON.parse(fs.readFileSync(OFFICIAL_PATH, "utf8"));
  const dictionary = await loadDictionary();
  const entries = buildEntries(official.words, dictionary);
  const sets = buildSets(entries);
  validateOutput(official, entries, sets);
  const curriculum = {
    version: official.version,
    effective: official.effective,
    sourceLabel: official.sourceLabel,
    sourceUrl: official.sourceUrl,
    levelCounts: official.levelCounts,
  };
  const output = `// Official membership and levels: 2025 HSK syllabus. Definitions: complete-hsk-vocabulary. See NOTICE.md.
(function () {
  window.VOCABULARY_CURRICULUM = ${JSON.stringify(curriculum, null, 2)};
  window.VOCABULARY_QUIZ_SETS = ${JSON.stringify(sets, null, 2)};
})();
`;

  fs.writeFileSync(OUT_PATH, output);
  console.log(`Built ${path.relative(ROOT, OUT_PATH)} with ${sets.length} sets and ${entries.length} official words.`);
}

async function loadDictionary() {
  const sourcePath = process.env.HSK_DICTIONARY_PATH || process.env.HSK_VOCAB_PATH;
  if (sourcePath) {
    return JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  }

  const sourceDirectory = process.env.HSK_DICTIONARY_DIR;
  if (sourceDirectory) {
    return fs
      .readdirSync(sourceDirectory)
      .filter((name) => /^new-[1-6]\.min\.json$/.test(name))
      .sort()
      .flatMap((name) => JSON.parse(fs.readFileSync(path.join(sourceDirectory, name), "utf8")));
  }

  return downloadJson(DICTIONARY_URL);
}

function buildEntries(officialWords, dictionary) {
  const dictionaryByWord = new Map();
  dictionary.forEach((row) => {
    if (!dictionaryByWord.has(row.s)) dictionaryByWord.set(row.s, []);
    dictionaryByWord.get(row.s).push(row);
  });
  const seenReviewKeys = new Set();

  return officialWords.map((official) => {
    const candidates = dictionaryByWord.get(official.word) || [];
    const officialPinyinKey = normalizeMarkedPinyin(official.pinyin);
    const forms = candidates.flatMap((row) => Array.isArray(row.f) ? row.f : []);
    const matchedForms = forms.filter((form) => normalizeMarkedPinyin(form.i?.y) === officialPinyinKey);
    const matchedForm = matchedForms[0];
    const fallback = FALLBACK_DATA[official.word];
    const primaryPinyin = String(matchedForm?.i?.y || fallback?.pinyin || official.pinyin).toLowerCase();
    const primaryNumeric = String(matchedForm?.i?.n || markedPinyinToNumeric(primaryPinyin)).toLowerCase();
    const matchingMeanings = sortMeanings(uniqueStrings(matchedForms.flatMap((form) => (form.m || []).flatMap(splitMeaning))));
    const allMeanings = sortMeanings(uniqueStrings(forms.flatMap((form) => (form.m || []).flatMap(splitMeaning))));
    const meanings = OFFICIAL_SENSE_DATA[official.index] ||
      (matchingMeanings.length ? matchingMeanings : allMeanings.length ? allMeanings : fallback?.meanings || []);
    const pinyinValues = uniqueStrings(forms.map((form) => String(form.i?.y || "").toLowerCase()));
    const numericValues = uniqueStrings(forms.map((form) => String(form.i?.n || "").toLowerCase()));
    const reviewBase = `${official.word}|${primaryNumeric.replace(/[\s-]+/g, " ").trim()}`;
    const entry = {
      zh: official.word,
      pinyin: primaryPinyin,
      numeric: primaryNumeric,
      pinyinAlternates: pinyinValues.filter((value) => value !== primaryPinyin),
      numericAlternates: numericValues.filter((value) => value !== primaryNumeric),
      meanings,
      officialIndex: official.index,
      officialLevel: official.level,
    };

    if (official.sense) entry.officialSense = official.sense;
    if (seenReviewKeys.has(reviewBase)) entry.reviewKey = `${reviewBase}#official-${official.index}`;
    seenReviewKeys.add(reviewBase);
    return entry;
  });
}

function buildSets(entries) {
  return LEVELS.flatMap((level) => {
    const levelEntries = entries.filter((entry) => entry.officialLevel === level.level);
    return splitIntoParts(levelEntries, level.maxParts).map((words, index) => ({
      id: `new-hsk-2025-${level.level}-part-${index + 1}`,
      label: `${level.label} · Part ${index + 1}`,
      shortLabel: `${level.label} · Part ${index + 1}`,
      level: level.label,
      curriculumVersion: "2025-11",
      words,
    }));
  });
}

function validateOutput(official, entries, sets) {
  if (entries.length !== official.words.length) {
    throw new Error(`Expected ${official.words.length} official entries; built ${entries.length}.`);
  }

  LEVELS.forEach((level) => {
    const expected = Number(official.levelCounts[level.level]);
    const found = entries.filter((entry) => entry.officialLevel === level.level).length;
    const levelSets = sets.filter((set) => set.level === level.label);
    if (found !== expected) throw new Error(`Expected ${expected} HSK ${level.level} entries; found ${found}.`);
    if (levelSets.length !== level.maxParts) throw new Error(`Expected ${level.maxParts} HSK ${level.level} parts.`);
  });

  const incomplete = entries.filter((entry) => !entry.zh || !entry.pinyin || !entry.numeric || !entry.meanings.length);
  if (incomplete.length) {
    throw new Error(`Incomplete generated entries: ${incomplete.map((entry) => entry.officialIndex).join(", ")}`);
  }
}

function splitIntoParts(items, maxParts) {
  const partCount = Math.min(Math.max(1, maxParts), items.length);
  const baseSize = Math.floor(items.length / partCount);
  const remainder = items.length % partCount;
  const parts = [];
  let start = 0;

  for (let partIndex = 0; partIndex < partCount; partIndex += 1) {
    const size = baseSize + (partIndex < remainder ? 1 : 0);
    parts.push(items.slice(start, start + size));
    start += size;
  }
  return parts;
}

function normalizeMarkedPinyin(value) {
  return String(value || "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/u:/g, "ü")
    .replace(/[\s\-'’`]/g, "");
}

function markedPinyinToNumeric(value) {
  return String(value || "")
    .normalize("NFC")
    .split(/([\s-]+)/)
    .map((part) => /^[\s-]+$/.test(part) ? " " : convertPinyinToken(part))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function convertPinyinToken(value) {
  const marks = {
    ā: ["a", "1"], á: ["a", "2"], ǎ: ["a", "3"], à: ["a", "4"],
    ē: ["e", "1"], é: ["e", "2"], ě: ["e", "3"], è: ["e", "4"],
    ī: ["i", "1"], í: ["i", "2"], ǐ: ["i", "3"], ì: ["i", "4"],
    ō: ["o", "1"], ó: ["o", "2"], ǒ: ["o", "3"], ò: ["o", "4"],
    ū: ["u", "1"], ú: ["u", "2"], ǔ: ["u", "3"], ù: ["u", "4"],
    ǖ: ["v", "1"], ǘ: ["v", "2"], ǚ: ["v", "3"], ǜ: ["v", "4"], ü: ["v", ""],
    ń: ["n", "2"], ň: ["n", "3"], ǹ: ["n", "4"], ḿ: ["m", "2"],
  };
  let base = "";
  let tone = "";
  Array.from(String(value || "").toLowerCase()).forEach((character) => {
    if (marks[character]) {
      base += marks[character][0];
      tone = marks[character][1] || tone;
    } else if (/[a-zv]/.test(character)) {
      base += character;
    }
  });
  return `${base}${tone}`;
}

function splitMeaning(value) {
  return String(value || "").split(/\s*;\s*/);
}

function sortMeanings(meanings) {
  return meanings
    .map((meaning, index) => ({ meaning, index, rank: getMeaningRank(meaning) }))
    .sort((left, right) => left.rank - right.rank || left.index - right.index)
    .map((item) => item.meaning);
}

function getMeaningRank(meaning) {
  const normalized = String(meaning || "").toLowerCase();
  if (/^surname\b/.test(normalized)) return 20;
  if (/\bdynasty\b|^abbr\. for a surname/.test(normalized)) return 10;
  if (/^prefix used before the surname/.test(normalized)) return 3;
  return 0;
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

async function downloadJson(url) {
  const text = await new Promise((resolve, reject) => {
    const request = https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download vocabulary dictionary: HTTP ${response.statusCode}`));
          response.resume();
          return;
        }
        const chunks = [];
        response.setEncoding("utf8");
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(chunks.join("")));
      })
      .on("error", reject);
    request.setTimeout(180000, () => request.destroy(new Error("Timed out while downloading vocabulary dictionary.")));
  });
  return JSON.parse(text);
}
