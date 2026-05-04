const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "sentence-data.js");
const EXPECTED_COUNTS = {
  beginner: 600,
  intermediate: 600,
  advanced: 600,
};

const forbiddenText = [
  /Cantonese/i,
  /Tatoeba/i,
  /\bsentence\b/i,
  /\bsentences\b/i,
  /\btranslation\b/i,
  /\btranslate\b/i,
  /\bTaiwan\b/i,
  /\bterritory\b/i,
];

const forbiddenChinese = [
  /\u7ca4\u8bed/,
  /\u7cb5\u8a9e/,
  /\u5e7f\u4e1c\u8bdd/,
  /\u5ee3\u6771\u8a71/,
  /\u53f0\u6e7e/,
  /\u81fa\u7063/,
  /\u53e5\u5b50/,
  /\u7ffb\u8bd1/,
  /\u7ffb\u8b6f/,
];

const quoteMarks = /["\u201c\u201d\u2018\u2019\u300c\u300d\u300e\u300f\u300a\u300b]/;
const nonMainlandVariants = /[\u5e7a\u59b3\u81fa\u88cf\u88e1]/;

const source = fs.readFileSync(DATA_PATH, "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: DATA_PATH });

const rows = context.window.ADDITIONAL_SENTENCES;
const errors = [];

if (!Array.isArray(rows)) {
  errors.push("window.ADDITIONAL_SENTENCES must be an array.");
} else {
  validateRows(rows);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${rows.length} sourced sentence pairs.`);

function validateRows(rows) {
  const ids = new Set();
  const chinese = new Set();
  const english = new Set();
  const counts = {};

  rows.forEach((row, index) => {
    const location = row?.id || `row ${index + 1}`;
    if (!row || typeof row !== "object") {
      errors.push(`${location} must be an object.`);
      return;
    }

    counts[row.level] = (counts[row.level] || 0) + 1;

    requireString(row.id, `${location}.id`);
    requireString(row.level, `${location}.level`);
    requireString(row.zh, `${location}.zh`);
    requireString(row.en, `${location}.en`);

    if (!Object.hasOwn(EXPECTED_COUNTS, row.level)) {
      errors.push(`${location} has an unknown level: ${row.level}`);
    }

    if (ids.has(row.id)) errors.push(`${location} has a duplicate id.`);
    ids.add(row.id);

    if (chinese.has(row.zh)) errors.push(`${location} has duplicate Chinese text.`);
    chinese.add(row.zh);

    const englishKey = row.en.toLowerCase();
    if (english.has(englishKey)) errors.push(`${location} has duplicate English text.`);
    english.add(englishKey);

    if (row.source !== "Tatoeba") {
      errors.push(`${location} must keep source set to Tatoeba.`);
    }

    if (!Number.isInteger(row.sourceId) || !Number.isInteger(row.translationId)) {
      errors.push(`${location} must keep integer Tatoeba source and translation IDs.`);
    }

    if (quoteMarks.test(row.zh) || quoteMarks.test(row.en)) {
      errors.push(`${location} contains quotation marks.`);
    }

    if (/[A-Za-z]/.test(row.zh)) {
      errors.push(`${location} contains Latin characters in Chinese text.`);
    }

    if (nonMainlandVariants.test(row.zh)) {
      errors.push(`${location} contains non-mainland simplified variants.`);
    }

    if (forbiddenText.some((pattern) => pattern.test(row.en))) {
      errors.push(`${location} contains disallowed English content.`);
    }

    if (forbiddenChinese.some((pattern) => pattern.test(row.zh))) {
      errors.push(`${location} contains disallowed Chinese content.`);
    }
  });

  const totalExpected = Object.values(EXPECTED_COUNTS).reduce((sum, count) => sum + count, 0);
  if (rows.length !== totalExpected) {
    errors.push(`Expected ${totalExpected} total rows, found ${rows.length}.`);
  }

  Object.entries(EXPECTED_COUNTS).forEach(([level, expected]) => {
    if ((counts[level] || 0) !== expected) {
      errors.push(`Expected ${expected} ${level} rows, found ${counts[level] || 0}.`);
    }
  });
}

function requireString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${label} must be a non-empty string.`);
  }
}
