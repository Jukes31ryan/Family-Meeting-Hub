// Validates all decks, then inlines data + engine into src/shell.html → index.html,
// and stamps sw.js with a content hash so installed copies pick up the new build.
import fs from "fs"; import path from "path"; import crypto from "crypto";
import { loadAll, ROOT } from "./load.mjs";
import { validate, report } from "./validate.mjs";

const all = await loadAll();
const r = validate(all); report(r);
if (r.errors.length) { console.error("\nBuild aborted — fix errors above."); process.exit(1); }

const decks = all.decks.map(({ file, ...d }) => d);
const ex = all.extra;
const json = v => JSON.stringify(v).replace(/</g, "\\u003c"); // no "</script>" breakouts
const data = [
  `const DECKS=${json(decks)};`,
  `const GRAMMAR=${json(ex["spanish-grammar"]?.default || [])};`,
  `const VERBS=${json(ex["spanish-verbs"]?.default || [])};`,
  `const PERSONS=${json(ex["spanish-verbs"]?.PERSONS || [])};`,
  `const FIELD=${json(ex["field"]?.default || [])};`,
].join("\n");

const shell = fs.readFileSync(path.join(ROOT, "src/shell.html"), "utf8");
const engine = fs.readFileSync(path.join(ROOT, "src/engine.js"), "utf8");
const html = shell.replace("/*@DATA@*/", () => data).replace("/*@ENGINE@*/", () => engine);
fs.writeFileSync(path.join(ROOT, "index.html"), html);

const hash = crypto.createHash("sha256").update(html).digest("hex").slice(0, 10);
const sw = fs.readFileSync(path.join(ROOT, "src/sw.js"), "utf8").replace("@VERSION@", hash);
fs.writeFileSync(path.join(ROOT, "sw.js"), sw);
console.log(`\nWrote index.html (${(html.length / 1024).toFixed(0)} KB), sw.js (cache pk-${hash})`);
