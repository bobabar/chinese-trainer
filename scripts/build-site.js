const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "_site");
const FILES = [
  "index.html",
  "app.js",
  "styles.css",
  "sentence-data.js",
  "word-data.js",
  "vocab-data.js",
  "CNAME",
  "NOTICE.md",
  ".nojekyll",
];

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

FILES.forEach((file) => {
  fs.copyFileSync(path.join(ROOT, file), path.join(OUT_DIR, file));
});

copyDirectory(path.join(ROOT, "assets"), path.join(OUT_DIR, "assets"));

console.log(`Built static site in ${path.relative(ROOT, OUT_DIR)}/`);

function copyDirectory(from, to) {
  fs.mkdirSync(to, { recursive: true });

  fs.readdirSync(from, { withFileTypes: true }).forEach((entry) => {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(source, target);
      return;
    }

    if (entry.isFile()) {
      fs.copyFileSync(source, target);
    }
  });
}
