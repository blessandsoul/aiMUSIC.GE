# aiNOW.ge Blog Translation Brief

**Date:** 2026-06-23
**Owner:** Andrew Altair / aiNOW
**Work list (authoritative):** `_translation_gaps.csv` (this folder) - 1338 rows, one row per file to produce.

---

## 1. Context

ainow.ge runs on 7 locales: `ka` (Georgian, the original), `en`, `ru`, `de`, `tr`, `fa`, `zh`.
Each blog post is one `.mdx` file at `content/blog/<locale>/<slug>.mdx`. The URL is `https://ainow.ge/<locale>/blog/<slug>` (Georgian has no prefix: `https://ainow.ge/blog/<slug>`).

If a post is missing in the selected locale, the site shows the Georgian original with a yellow "not yet translated" banner. The goal of this job is to remove those fallbacks by filling the gaps.

### Current coverage (master = Georgian, 365 posts)

| locale | have | missing | this job |
|--------|------|---------|----------|
| ka | 365 | 0 | source, do not touch |
| ru | 351 | 14 | translate 14 |
| en | 301 | 64 | translate 64 |
| de | 50 | 315 | translate 315 |
| tr | 50 | 315 | translate 315 |
| fa | 50 | 315 | translate 315 |
| zh | 50 | 315 | translate 315 |

**Total: 1338 files.**

---

## 2. Source language and direction

- **English is the pivot.** Translate `de / tr / fa / zh / ru` FROM the English `.mdx` whenever it exists (column `source_file` in the CSV points to it).
- **English itself has a 64-post gap** (newest Georgian-only posts). Those must be produced FROM Georgian first (`source_lang = ka` in the CSV). Do EN first (Phase P1) so the pivot is complete before fanning out.
- Never translate machine-to-machine. If you post-edit a machine draft, the final text must read as written by a native speaker of the target language.

### Phase order (column `phase` in the CSV)

1. **P1** - EN, 64 posts (from Georgian). Completes the pivot.
2. **P2** - RU, 14 posts.
3. **P3-P6** - DE, TR, FA, ZH, 315 each.

Inside P3-P6, do **tier A first** (column `priority_tier` = A: posts already proven in both EN and RU, the high-value core), then **tier C** (Georgian-only long-tail).

You may take one full language at a time or one phase across languages. Confirm the slice before starting.

---

## 3. File format (do exactly this)

Each file is Markdown with a YAML frontmatter block on top:

```
---
title: '...'
excerpt: ...
date: 2026-06-16        <- KEEP unchanged
author: Andrew Altair   <- KEEP unchanged
tags:
  - ...
coverImage: ...         <- KEEP unchanged if present
---

<body markdown>
```

**Translate:** `title`, `excerpt`, the visible text of each `tags` entry, and the entire body.
**Keep byte-for-byte:** the filename/`slug`, `date`, `author`, `coverImage`, all URLs, all image paths, all code blocks, all HTML, all Markdown structure (headings `#`, lists, tables, links `[text](url)` - translate `text`, keep `url`).
**Output path:** exactly the `target_file` column. Same filename as the source. UTF-8, no BOM, LF line endings.

---

## 4. Hard rules (a file that breaks any of these is rejected)

1. **NO long dash and NO middle dash anywhere.** The em dash (Unicode U+2014) and the en dash (Unicode U+2013) are banned in every file. Use a comma, colon, period, parentheses, or rewrite. A normal hyphen `-` (U+002D) is fine.
2. **Slug / filename never changes.** It is the URL key and must match across all locales.
3. **Do-not-translate list (keep verbatim):** `aiNOW`, `AINOW.GE`, `Andrew Altair`, `BUBABU.GE`, product and company names, domain names, prices and currency (`₾`, `$`), numbers, dates, code, and any `class=`/HTML attributes.
4. **"AI"** -> use the natural local term, consistently within and across files: `de` KI (or AI if that is your house style, pick one), `ru` ИИ, `fa` هوش مصنوعی, `zh` 人工智能, `tr` yapay zeka.
5. **Keep the meaning, localize the market.** These are Georgia-market AI/marketing articles. Keep Georgian references (Tbilisi, BOG, TBC, jobs.ge, GEL) intact; do not swap them for the target country.
6. **No machine-translation tells.** Natural register, no literal calques, no robotic phrasing.

### Locale specifics
- **fa (Persian):** right-to-left; use Persian punctuation (`،` `؛`) and Persian/standard digits consistently; keep Latin brand names LTR.
- **zh (Chinese):** Simplified; full-width punctuation (`，` `。`); no spaces between Chinese characters.
- **de (German):** correct noun capitalization and compounding; formal "Sie".
- **tr (Turkish):** correct suffix vowel harmony; Turkish-specific characters (ı, ğ, ş, ç, ö, ü).
- **ru (Russian):** natural, not transliterated tech terms where a Russian term exists.

---

## 5. SEO (these fields are indexed)

- **title:** keep the meaning, aim for <= 52 characters (the site appends " | aiNOW"). If the natural translation is longer, keep the key term in the first 52 chars.
- **excerpt:** 1-2 sentences, contains the main keyword naturally.
- **tags:** translate the tag text; keep the set semantically equal to the source.
- These pages are indexed in Google for the target language, so quality and keyword naturalness matter.

---

## 6. Delivery and acceptance

- Deliver the `.mdx` files in the exact `target_file` paths (zip mirroring `content/blog/<locale>/...`, or a PR if you have repo access).
- **Per-file QA checklist:** frontmatter keys intact, slug unchanged, zero em/en dashes (U+2014 / U+2013), brand list verbatim, links/code/images intact, title <= 52 chars, body reads native.
- Acceptance is per phase: a 5-file sample is reviewed before the rest of a phase is accepted.

**Questions before you start:** confirm (a) which slice you are taking, (b) your native target language(s), (c) whether you read Georgian (needed only for the 64 EN-from-ka posts; otherwise we supply an English draft to post-edit).
