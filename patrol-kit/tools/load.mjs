// Loads every file in decks/. A file whose default export has .meta is a card deck;
// anything else is sub-mode data, keyed by file name (e.g. "spanish-grammar").
import fs from "fs"; import path from "path"; import { pathToFileURL } from "url";
export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
export async function loadAll() {
  const dir = path.join(ROOT, "decks");
  const decks = [], extra = {};
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".js")).sort()) {
    const mod = await import(pathToFileURL(path.join(dir, f)).href + "?t=" + Date.now());
    const name = f.replace(/\.js$/, "");
    if (mod.default && mod.default.meta) decks.push({ file: f, ...mod.default });
    else extra[name] = mod;
  }
  return { decks, extra };
}
