const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");
const vm = require("node:vm");
const zlib = require("node:zlib");

const ROOT = path.resolve(__dirname, "..");
const SENTENCE_DATA_PATH = path.join(ROOT, "sentence-data.js");
const WORD_DATA_PATH = path.join(ROOT, "word-data.js");
const CEDICT_URL = "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz";
const MAX_WORD_LENGTH = 8;
const HAN_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const rows = loadSentenceRows();
  const dictionaryText = process.env.CEDICT_PATH
    ? readCedictFile(process.env.CEDICT_PATH)
    : await downloadCedict();
  const dictionary = parseCedict(dictionaryText);
  const usedWords = collectUsedWords(rows, dictionary);
  const output = buildWordDataModule(usedWords, dictionary);

  fs.writeFileSync(WORD_DATA_PATH, output);
  console.log(`Built ${path.relative(ROOT, WORD_DATA_PATH)} with ${usedWords.size} CC-CEDICT entries.`);
}

function loadSentenceRows() {
  const source = fs.readFileSync(SENTENCE_DATA_PATH, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: SENTENCE_DATA_PATH });

  if (!Array.isArray(context.window.ADDITIONAL_SENTENCES)) {
    throw new Error("sentence-data.js did not expose window.ADDITIONAL_SENTENCES.");
  }

  return context.window.ADDITIONAL_SENTENCES;
}

async function downloadCedict() {
  const compressed = await new Promise((resolve, reject) => {
    const request = https
      .get(CEDICT_URL, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download CC-CEDICT: HTTP ${response.statusCode}`));
          response.resume();
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);

    request.setTimeout(180000, () => {
      request.destroy(new Error("Timed out while downloading CC-CEDICT."));
    });
  });

  return zlib.gunzipSync(compressed).toString("utf8");
}

function readCedictFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  return filePath.endsWith(".gz") ? zlib.gunzipSync(buffer).toString("utf8") : buffer.toString("utf8");
}

function parseCedict(source) {
  const entries = new Map();

  source.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith("#")) return;

    const match = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)]\s+\/(.+)\/$/);
    if (!match) return;

    const simplified = match[2];
    if (!containsHan(simplified)) return;

    const definitions = match[4]
      .split("/")
      .map(cleanDefinition)
      .filter(Boolean);
    if (!definitions.length) return;

    const candidate = {
      pinyin: convertPinyin(match[3]),
      gloss: pickGloss(definitions),
      rank: rankDefinitions(definitions),
    };
    const current = entries.get(simplified);
    if (!current || candidate.rank < current.rank) {
      entries.set(simplified, candidate);
    }
  });

  return entries;
}

function collectUsedWords(rows, dictionary) {
  const words = new Set();

  rows.forEach((row) => {
    let index = 0;
    while (index < row.zh.length) {
      if (!isHan(row.zh[index])) {
        index += 1;
        continue;
      }

      const word = findLongestWord(row.zh, index, dictionary);
      words.add(word);
      index += word.length;
    }
  });

  return words;
}

function findLongestWord(text, index, dictionary) {
  const maxLength = Math.min(MAX_WORD_LENGTH, text.length - index);

  for (let length = maxLength; length > 0; length -= 1) {
    const candidate = text.slice(index, index + length);
    if (isHanText(candidate) && dictionary.has(candidate)) {
      return candidate;
    }
  }

  return text[index];
}

function buildWordDataModule(words, dictionary) {
  const rows = [...words]
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
    .map((word) => {
      const entry = dictionary.get(word) || { pinyin: "", gloss: "" };
      return `    ${JSON.stringify(word)}: ${JSON.stringify({
        pinyin: entry.pinyin,
        gloss: entry.gloss,
      })}`;
    })
    .join(",\n");

  return `(() => {
  "use strict";

  // Compact pinyin and gloss data derived from CC-CEDICT for the local sentence bank.
  // Source: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
  // License: Creative Commons Attribution-ShareAlike 4.0 International.
  window.CHINESE_WORD_DATA = {
${rows}
  };
})();
`;
}

function cleanDefinition(value) {
  return value
    .replace(/\|/g, " or ")
    .replace(/\s+/g, " ")
    .replace(/^to be /, "")
    .trim();
}

function pickGloss(definitions) {
  const useful = definitions.filter(
    (definition) =>
      !/^CL:/.test(definition) &&
      !/^variant of /.test(definition) &&
      !/^old variant of /.test(definition) &&
      !/^surname /.test(definition),
  );
  return (useful.length ? useful : definitions).slice(0, 3).join("; ");
}

function rankDefinitions(definitions) {
  let rank = 0;
  if (definitions.every((definition) => /^surname /.test(definition))) rank += 4;
  if (definitions.every((definition) => /^variant of /.test(definition))) rank += 8;
  if (definitions.every((definition) => /^old variant of /.test(definition))) rank += 8;
  if (definitions.every((definition) => /^CL:/.test(definition))) rank += 12;
  return rank;
}

function convertPinyin(value) {
  return value
    .split(/\s+/)
    .map(convertPinyinSyllable)
    .join(" ");
}

function convertPinyinSyllable(value) {
  const match = value.match(/^(.+?)([1-5])$/);
  if (!match) return value.replace(/u:/g, "ü");

  const raw = match[1].replace(/u:/g, "v");
  const tone = Number(match[2]);
  const base = raw.replace(/v/g, "ü");
  if (tone === 5) return base;

  const toneMarks = {
    a: ["ā", "á", "ǎ", "à"],
    e: ["ē", "é", "ě", "è"],
    i: ["ī", "í", "ǐ", "ì"],
    o: ["ō", "ó", "ǒ", "ò"],
    u: ["ū", "ú", "ǔ", "ù"],
    ü: ["ǖ", "ǘ", "ǚ", "ǜ"],
  };
  const targetIndex = findToneTarget(base);
  if (targetIndex === -1) return base;

  const target = base[targetIndex];
  const marked = toneMarks[target.toLowerCase()]?.[tone - 1];
  if (!marked) return base;

  const casedMark = target === target.toUpperCase() ? marked.toUpperCase() : marked;
  return `${base.slice(0, targetIndex)}${casedMark}${base.slice(targetIndex + 1)}`;
}

function findToneTarget(value) {
  const lower = value.toLowerCase();
  const a = lower.indexOf("a");
  if (a !== -1) return a;

  const e = lower.indexOf("e");
  if (e !== -1) return e;

  const ou = lower.indexOf("ou");
  if (ou !== -1) return ou;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    if ("ioüu".includes(lower[index])) {
      return index;
    }
  }

  return -1;
}

function isHan(value) {
  return HAN_RE.test(value);
}

function isHanText(value) {
  return [...value].every(isHan);
}

function containsHan(value) {
  return [...value].some(isHan);
}
