const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "_site");
const FILES = [
  "index.html",
  "app.js",
  "styles.css",
  "amap-config.js",
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
writeAmapConfig(path.join(OUT_DIR, "amap-config.js"));

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

function writeAmapConfig(target) {
  const gaodeMapKey = firstEnv([
    "GAODE_MAP_KEY",
    "AMAP_KEY",
    "AMAP_MAP_KEY",
    "VITE_GAODE_MAP_KEY",
    "VITE_AMAP_KEY",
  ]);
  const gaodeSecurityJsCode = firstEnv([
    "GAODE_SECURITY_JS_CODE",
    "GAODE_MAP_SECURITY_CODE",
    "GAODE_MAP_WEB_SECRET_KEY",
    "AMAP_SECURITY_JS_CODE",
    "AMAP_SECURITY_CODE",
    "VITE_GAODE_SECURITY_JS_CODE",
    "VITE_AMAP_SECURITY_JS_CODE",
  ]);
  const config = { gaodeMapKey, gaodeSecurityJsCode };

  fs.writeFileSync(
    target,
    `window.CHINESE_TRAINER_CONFIG = ${JSON.stringify(config)};\n`,
  );
}

function firstEnv(names) {
  return names.map((name) => process.env[name]).find(Boolean) || "";
}
