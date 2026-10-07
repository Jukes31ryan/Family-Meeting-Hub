// Schema + integrity checks for every deck. Run directly, or via build.mjs (build fails on errors).
import fs from "fs"; import path from "path";
import { loadAll, ROOT } from "./load.mjs";

const TYPES = ["flip", "mc", "order", "scenario"];
const LANGS = [null, undefined, "es-MX", "fr-CA"];
const CARD_KEYS = new Set(["id","type","cat","group","front","back","note","q","setup","choices","answer","explain","steps","why","source","flag","binding","speak","lang","case","cite","year","tags"]);
const isStr = v => typeof v === "string" && v.trim().length > 0;

// Generic OPSEC patterns (warnings). Site-specific terms go in tools/opsec-terms.local.txt,
// which is git-ignored so the list itself never lands in the public repo (errors).
const OPSEC_WARN = [/\bAOR\b/, /\bsensor/i, /\bcall ?sign/i, /\b[A-Z][a-z]+ (Station|Sector)\b/];
function localTerms() {
  const f = path.join(ROOT, "tools", "opsec-terms.local.txt");
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, "utf8").split("\n").map(s => s.trim()).filter(s => s && !s.startsWith("#"));
}

export function validate({ decks, extra }) {
  const errors = [], warnings = [], rows = [];
  const ids = new Map();
  const terms = localTerms();
  const scan = (where, text) => {
    for (const t of terms) if (text.toLowerCase().includes(t.toLowerCase())) errors.push(`${where}: OPSEC term "${t}"`);
    for (const re of OPSEC_WARN) if (re.test(text)) warnings.push(`${where}: check OPSEC — matches ${re}`);
  };
  const deckIds = new Set();
  for (const d of decks) {
    const m = d.meta, W = d.file;
    if (!isStr(m.id) || !isStr(m.name) || !/^#[0-9a-f]{6}$/i.test(m.color || "") || typeof m.order !== "number") errors.push(`${W}: meta needs id, name, color (#rrggbb), order`);
    if (!LANGS.includes(m.lang)) errors.push(`${W}: meta.lang must be es-MX, fr-CA or absent`);
    if (deckIds.has(m.id)) errors.push(`${W}: duplicate deck id ${m.id}`); deckIds.add(m.id);
    scan(`${W} meta`, JSON.stringify(m));
    const cats = d.categories || {};
    for (const [k, c] of Object.entries(cats)) scan(`${W} category ${k}`, JSON.stringify(c));
    const count = { flip: 0, mc: 0, order: 0, scenario: 0 };
    let defaulted = 0;
    for (const c of d.cards || []) {
      const at = `${W} ${c.id || "(no id)"}`;
      if (!isStr(c.id) || !/^[a-z0-9]+(-[a-z0-9]+)+$/.test(c.id)) errors.push(`${at}: id must be lowercase "prefix-slug"`);
      if (ids.has(c.id)) errors.push(`${at}: duplicate id (also in ${ids.get(c.id)})`); ids.set(c.id, W);
      if (!TYPES.includes(c.type)) { errors.push(`${at}: unknown type ${c.type}`); continue; }
      count[c.type]++;
      for (const k of Object.keys(c)) if (!CARD_KEYS.has(k)) warnings.push(`${at}: unknown field "${k}"`);
      if (!isStr(c.cat)) errors.push(`${at}: missing cat`);
      else if (d.categories && !cats[c.cat]) errors.push(`${at}: cat "${c.cat}" not declared in categories`);
      const cat = cats[c.cat] || {};
      const why = c.why || cat.why || m.why, src = c.source || cat.source || m.source;
      if (!isStr(why)) errors.push(`${at}: no "why it matters" line (card, category or deck)`);
      if (!isStr(src)) errors.push(`${at}: no source (card, category or deck)`);
      if (!c.source) defaulted++;
      if (c.type === "flip") { if (!isStr(c.front) || !isStr(c.back)) errors.push(`${at}: flip needs front and back`); }
      if (c.type === "mc" || c.type === "scenario") {
        if (!isStr(c.q)) errors.push(`${at}: needs q`);
        if (c.type === "scenario" && !isStr(c.setup)) errors.push(`${at}: scenario needs setup`);
        if (!Array.isArray(c.choices) || c.choices.length < 2 || c.choices.length > 6 || !c.choices.every(isStr)) errors.push(`${at}: choices must be 2–6 strings`);
        else {
          if (new Set(c.choices).size !== c.choices.length) errors.push(`${at}: duplicate choices`);
          if (!Number.isInteger(c.answer) || c.answer < 0 || c.answer >= c.choices.length) errors.push(`${at}: answer index ${c.answer} out of range 0–${c.choices.length - 1}`);
        }
        if (!isStr(c.explain)) warnings.push(`${at}: no explain line`);
      }
      if (c.type === "order") {
        if (!isStr(c.q)) errors.push(`${at}: needs q`);
        if (!Array.isArray(c.steps) || c.steps.length < 3 || !c.steps.every(isStr)) errors.push(`${at}: order needs ≥3 string steps`);
        else if (new Set(c.steps).size !== c.steps.length) errors.push(`${at}: duplicate steps`);
      }
      if (c.binding !== undefined && !/^(SCOTUS|2d Cir\.|persuasive \(.+\)|statute|regulation|policy)$/.test(c.binding)) errors.push(`${at}: binding "${c.binding}" not a recognised label`);
      scan(at, JSON.stringify(c));
    }
    rows.push({ deck: m.id, file: W, total: (d.cards || []).length, ...count, sourceFromDefault: defaulted });
  }
  // sub-mode data
  const g = extra["spanish-grammar"]?.default;
  if (g) g.forEach(L => L.quiz.forEach((q, i) => {
    if (!Number.isInteger(q.a) || q.a < 0 || q.a >= q.opts.length) errors.push(`spanish-grammar ${L.id} q${i + 1}: answer index out of range`);
  }));
  const v = extra["spanish-verbs"]?.default;
  if (v) v.forEach(x => { if (x.pres.length !== 5 || x.pret.length !== 5 || !isStr(x.cmd)) errors.push(`spanish-verbs ${x.inf}: needs 5 pres, 5 pret, cmd`); });
  if (g) scan("spanish-grammar", JSON.stringify(g));
  return { errors, warnings, rows, subModes: { grammarLessons: g?.length || 0, grammarQuizQs: g ? g.reduce((n, L) => n + L.quiz.length, 0) : 0, verbs: v?.length || 0 } };
}

export function report(r) {
  const pad = (s, n) => String(s).padEnd(n);
  console.log("\n" + ["deck", "total", "flip", "mc", "order", "scen.", "deck-level src"].map((h, i) => pad(h, i ? 8 : 14)).join(""));
  for (const x of r.rows) console.log([x.deck, x.total, x.flip, x.mc, x.order, x.scenario, x.sourceFromDefault].map((h, i) => pad(h, i ? 8 : 14)).join(""));
  console.log(pad("ALL", 14) + pad(r.rows.reduce((n, x) => n + x.total, 0), 8));
  console.log(`sub-modes: ${r.subModes.grammarLessons} lessons / ${r.subModes.grammarQuizQs} quiz Qs, ${r.subModes.verbs} verbs`);
  if (r.warnings.length) { console.log(`\n${r.warnings.length} warning(s):`); r.warnings.forEach(w => console.log("  ! " + w)); }
  if (r.errors.length) { console.log(`\n${r.errors.length} ERROR(S):`); r.errors.forEach(e => console.log("  ✗ " + e)); }
  else console.log("\n✓ 0 errors");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = validate(await loadAll()); report(r); process.exit(r.errors.length ? 1 : 0);
}
