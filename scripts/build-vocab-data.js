const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT_PATH = path.join(ROOT, "vocab-data.js");
const SOURCE_URL = "https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.min.json";
const QUIZ_SET_COUNT = 8;
const LEVELS = [
  { id: "n1", label: "New HSK 1" },
  { id: "n2", label: "New HSK 2" },
];

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const source = process.env.HSK_VOCAB_PATH
    ? JSON.parse(fs.readFileSync(process.env.HSK_VOCAB_PATH, "utf8"))
    : await downloadJson(SOURCE_URL);
  const sets = buildSets(source);
  const output = `// Generated from complete-hsk-vocabulary New HSK wordlists. See NOTICE.md for attribution.
(function () {
  window.VOCABULARY_QUIZ_SETS = ${JSON.stringify(sets, null, 2)};
})();
`;

  fs.writeFileSync(OUT_PATH, output);
  console.log(`Built ${path.relative(ROOT, OUT_PATH)} with ${sets.length} sets and ${sets.reduce((sum, set) => sum + set.words.length, 0)} words.`);
}

function buildSets(source) {
  const levelIds = LEVELS.map((level) => level.id);
  const entries = source
    .filter((row) => Array.isArray(row.l) && row.l.some((levelId) => levelIds.includes(levelId)))
    .map(toEntry)
    .filter((entry) => entry.zh && entry.pinyin && entry.numeric && entry.meanings.length);
  const partSize = Math.floor(entries.length / QUIZ_SET_COUNT);
  const comparableEntries = entries.slice(0, partSize * QUIZ_SET_COUNT);

  return chunk(comparableEntries, partSize).map((words, index) => ({
    id: `new-hsk-1-2-part-${index + 1}`,
    label: `New HSK 1 + 2 · Part ${index + 1}`,
    shortLabel: `New HSK 1 + 2 · Part ${index + 1}`,
    level: "New HSK 1 + 2",
    words,
  }));
}

function toEntry(row) {
  const forms = Array.isArray(row.f) ? row.f : [];
  const primary = forms[0] || {};
  const primaryInfo = primary.i || {};
  const primaryPinyin = String(primaryInfo.y || "").toLowerCase();
  const primaryNumeric = String(primaryInfo.n || "").toLowerCase();
  const pinyinValues = uniqueStrings(forms.map((form) => form.i?.y?.toLowerCase()));
  const numericValues = uniqueStrings(forms.map((form) => form.i?.n?.toLowerCase()));
  const meanings = uniqueStrings(
    forms
      .flatMap((form) => form.m || [])
      .flatMap((meaning) => String(meaning).split(/\s*;\s*/)),
  );

  return {
    zh: row.s,
    pinyin: primaryPinyin,
    numeric: primaryNumeric,
    pinyinAlternates: pinyinValues.filter((value) => value !== primaryPinyin),
    numericAlternates: numericValues.filter((value) => value !== primaryNumeric),
    meanings,
  };
}

function chunk(items, size) {
  const parts = [];
  for (let index = 0; index < items.length; index += size) {
    parts.push(items.slice(index, index + size));
  }
  return parts;
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function downloadJson(url) {
  const text = await new Promise((resolve, reject) => {
    const request = https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download vocabulary source: HTTP ${response.statusCode}`));
          response.resume();
          return;
        }

        const chunks = [];
        response.setEncoding("utf8");
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(chunks.join("")));
      })
      .on("error", reject);

    request.setTimeout(180000, () => {
      request.destroy(new Error("Timed out while downloading vocabulary source."));
    });
  });

  return JSON.parse(text);
}
