const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "_site");
const FILES = [
  "index.html",
  "app-config.js",
  "account.js",
  "app.js",
  "styles.css",
  "china-map-data.js",
  "sentence-data.js",
  "word-data.js",
  "vocab-data.js",
  "grammar-data.js",
  "exam-data.js",
  "reader-data.js",
  "manifest.webmanifest",
  "service-worker.js",
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
cacheBustIndexAssets();
stampServiceWorker();

console.log(`Built static site in ${path.relative(ROOT, OUT_DIR)}/`);

function cacheBustIndexAssets() {
  const indexPath = path.join(OUT_DIR, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  ["styles.css", "app-config.js", "account.js", "vocab-data.js", "grammar-data.js", "china-map-data.js", "exam-data.js", "reader-data.js", "app.js", "manifest.webmanifest"].forEach((file) => {
    const hash = hashFile(path.join(OUT_DIR, file));
    html = html.replaceAll(`./${file}`, `./${file}?v=${hash}`);
  });
  fs.writeFileSync(indexPath, html);
}

function stampServiceWorker() {
  const serviceWorkerPath = path.join(OUT_DIR, "service-worker.js");
  const buildHash = crypto.createHash("sha256");
  listFiles(OUT_DIR).forEach((filePath) => {
    buildHash.update(path.relative(OUT_DIR, filePath));
    buildHash.update(fs.readFileSync(filePath));
  });
  const version = buildHash.digest("hex").slice(0, 12);
  const source = fs.readFileSync(serviceWorkerPath, "utf8");
  if (!source.includes("__BUILD_HASH__")) {
    throw new Error("Service worker build hash placeholder is missing.");
  }
  fs.writeFileSync(serviceWorkerPath, source.replaceAll("__BUILD_HASH__", version));
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const filePath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(filePath) : entry.isFile() ? [filePath] : [];
    })
    .sort();
}

function hashFile(filePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex")
    .slice(0, 10);
}

function copyDirectory(from, to) {
  fs.mkdirSync(to, { recursive: true });

  fs.readdirSync(from, { withFileTypes: true }).forEach((entry) => {
    if (entry.name === ".DS_Store") {
      return;
    }
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
