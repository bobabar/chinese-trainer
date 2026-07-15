const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const official = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "hsk-2025-vocabulary-1-3.json"), "utf8"));
const source = fs.readFileSync(path.join(ROOT, "vocab-data.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: "vocab-data.js" });

const curriculum = context.window.VOCABULARY_CURRICULUM;
const sets = context.window.VOCABULARY_QUIZ_SETS;
const errors = [];
const expectedParts = { 1: 3, 2: 2, 3: 5 };

if (!curriculum || curriculum.version !== official.version || curriculum.sourceUrl !== official.sourceUrl) {
  errors.push("Generated curriculum metadata must match the official source manifest.");
}
if (!Array.isArray(sets)) {
  errors.push("window.VOCABULARY_QUIZ_SETS must be an array.");
} else {
  validateSets(sets);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${official.words.length} official HSK 1–3 vocabulary entries across ${sets.length} quiz parts.`);

function validateSets(generatedSets) {
  const words = generatedSets.flatMap((set) => set.words || []);
  const byIndex = new Map(words.map((word) => [word.officialIndex, word]));
  const reviewKeys = new Set();

  if (words.length !== official.words.length) {
    errors.push(`Expected ${official.words.length} generated entries, found ${words.length}.`);
  }

  official.words.forEach((expected) => {
    const generated = byIndex.get(expected.index);
    if (!generated) {
      errors.push(`Official entry ${expected.index} (${expected.word}) is missing.`);
      return;
    }
    if (generated.zh !== expected.word || generated.officialLevel !== expected.level) {
      errors.push(`Official entry ${expected.index} does not match its generated word or level.`);
    }
    if (!generated.pinyin || !generated.numeric || !Array.isArray(generated.meanings) || !generated.meanings.length) {
      errors.push(`Official entry ${expected.index} is missing pinyin or meanings.`);
    }
    const reviewKey = generated.reviewKey || `${generated.zh}|${String(generated.numeric).replace(/[\s-]+/g, " ").trim()}`;
    if (reviewKeys.has(reviewKey)) errors.push(`Duplicate generated review key: ${reviewKey}`);
    reviewKeys.add(reviewKey);
  });

  Object.entries(expectedParts).forEach(([level, partCount]) => {
    const levelSets = generatedSets.filter((set) => Number(set.words?.[0]?.officialLevel) === Number(level));
    const levelWords = levelSets.flatMap((set) => set.words || []);
    const expectedCount = Number(official.levelCounts[level]);
    if (levelSets.length !== partCount) errors.push(`Expected ${partCount} HSK ${level} parts, found ${levelSets.length}.`);
    if (levelWords.length !== expectedCount) errors.push(`Expected ${expectedCount} HSK ${level} words, found ${levelWords.length}.`);
    if (levelSets.some((set, index) => set.id !== `new-hsk-2025-${level}-part-${index + 1}`)) {
      errors.push(`HSK ${level} set IDs must retain their versioned sequence.`);
    }
  });
}
