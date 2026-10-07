# Patrol Kit

Border Patrol study cards: one spaced-repetition engine, many decks. Mobile-first PWA, works offline, progress stays in the browser (localStorage). Public-source material only.

## Editing content

Each deck is one file in `decks/`. To add cards, edit that file, then build:

```
node tools/build.mjs      # validates, then writes index.html + sw.js
node tools/validate.mjs   # validation only
```

The build fails on any validation error: bad schema, duplicate IDs, an MC answer index out of range, or a card with no source or "why it matters" line.

## Card schema

```js
{ id:"cl-terry-01",            // deck prefix + slug, lowercase; never reuse an id
  type:"flip"|"mc"|"order"|"scenario",
  cat:"Category",              // must be declared in the deck's `categories`, if it has one
  why:"Why it matters",        // falls back to category, then deck
  source:"392 U.S. 1 (1968)",  // falls back to category, then deck
  flag:"Where this differs from common doctrine",   // optional, shown as a warning
  binding:"SCOTUS"|"2d Cir."|"persuasive (9th Cir.)"|"statute"|"regulation"|"policy", // optional
  speak:"text for audio",      // optional; uses the deck's lang (es-MX / fr-CA)

  // flip
  front, back, note,
  // mc / scenario (scenario also needs `setup`)
  q, choices:[...], answer:0, explain,
  // order — list steps in the CORRECT order; the app shuffles them
  q, steps:[...], explain }
```

Deck files export `{ meta:{id,name,short,color,lang,order,blurb,source,subModes}, categories:{...}, cards:[...] }`.
Files without `meta` (`spanish-grammar.js`, `spanish-verbs.js`) are sub-mode data.

## Legal decks

Decks with `requireVerified:true` in `meta` (Case Law, Statutes, Use of Force) need, on every card, its own `source` and a `verified` URL for the page it was checked against. The build writes these to `VERIFICATION.md`. Anything that couldn't be verified goes in `UNVERIFIED.md` instead of on a card. Case cards also need `cite`, `year`, `binding`, `rule` and `field`.

## OPSEC

The build scans every card. Generic patterns (named stations/sectors, AOR, sensors, call signs) produce warnings. Site-specific terms go in `tools/opsec-terms.local.txt`, one per line, and any match fails the build. That file is git-ignored so the list itself never becomes public.

## Progress storage

Keys use the `pk_` prefix. On first load, Patrol Español v1 progress (`pe_*`) is copied over once, with card IDs mapped `p12` → `es-p12`; the `pe_*` keys are left in place. iOS gives each home-screen app separate storage, so **Backup & reset** on the home screen exports and imports progress as text, and accepts a v1 export too.
