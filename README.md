# Rhetoric

**A local-first writing studio for range, precision and structure.**

🌐 **Live site:** https://rhetoric.parsasam.ir/

Rhetoric is an installable web app (PWA) for the part of writing that happens after the first
draft: finding the precise word, catching the spelling slip, breaking the monotone sentence, and
giving the argument a shape a reader can follow.

> _Verba sunt vestis cogitationum._ — Words are the dress of thought.

---

## What is in here

| Area | What it does |
| --- | --- |
| **The studio** (`/write`) | A distraction-free editor with live word, sentence, paragraph, reading-time and clarity measures. It flags repetition, filler, vague words, possible passive voice, clichés, delayed subjects, adverb habits and long sentences — and lets you jump straight to the line. |
| **Words** | Select any word in the draft to see synonyms. The 175-entry curated wordbook is always available offline; Datamuse adds more synonyms, antonyms and definitions when the network is up. Click a suggestion to replace the selection. |
| **Spelling** | Offline Hunspell checking with suggestions, an ignore list for names and technical terms, and one-click replacement. |
| **Structure** | Nine blueprints — argument, compare & contrast, problem & solution, narrative, definition, cause & effect, description, rhetorical analysis and the paragraph. Each has a section-by-section checklist, a skeleton and tips; insert the skeleton into the draft in one click. |
| **The craft library** (`/structures`) | The full guides for every blueprint, plus the classical figures and appeals (anaphora, chiasmus, tricolon, ethos, pathos, logos and more) with definitions and examples. |
| **The wordbook** (`/wordbook`) | A browsable, searchable thesaurus arranged by need: replace the vague, sharper verbs, the writing desk, joining ideas, texture, movement and the orator’s kit. |
| **Practice** (`/practice`) | Eight-question drills on spelling, word choice, clarity and structure, with immediate explanations, a session score, a local practice record and a warm-up writing prompt. |
| **Account** (`/account`) | Optional email-link sign-in through Supabase. Save the studio and practice record to an account, then load that copy on another device. The app remains fully usable without an account. |
| **Installable PWA** | Works offline, has a manifest, install prompt and update prompt, and ships with GitHub Pages deployment. |

### The studio in detail

- **Clarity score** — a heuristic built from concision, range, clarity and polish. It is a prompt
  for revision, not a verdict.
- **Readability** — Flesch reading ease, Flesch–Kincaid grade and a sentence-length sparkline that
  makes rhythm visible.
- **Draft tools** — autosave to `localStorage`, copy, Markdown export, focus mode, a sample draft,
  and a writing prompt banner.
- **Structure checklist** — progress is saved per blueprint in the browser.

---

## Local-first by design

- No account is required, no analytics run, and nothing is uploaded by default.
- Drafts, title, theme, ignored words, structure checklists and the practice record live in this
  browser’s `localStorage`. Clearing browser data clears them, so export a Markdown copy if you
  need one.
- An optional account keeps a row-level-secured copy in Supabase. Saving is explicit; loading an
  account copy asks before it replaces the draft on the current device. The [account
  section](#accounts-and-progress-sync) has the setup steps.
- The wordbook, the spellchecker and the three typefaces are bundled with the app and work offline.
- Online word lookups send only the searched word to the free
  [Datamuse API](https://www.datamuse.com/api/); results are cached locally for 30 days and by the
  service worker. If the network is unavailable, the app falls back to the curated wordbook.

---

## Tech

- **React 19 + Vite 7** with React Router 7.
- **vite-plugin-pwa** — prompt-based updates, a precached shell (including the self-hosted fonts)
  and runtime caching for Datamuse.
- **nspell + dictionary-en** — the Hunspell dictionary is loaded lazily in a separate chunk, so the
  first paint is not blocked by the 550 kB dictionary.
- **Supabase** — email magic links and one JSON progress row per user, protected by row-level
  security. `@supabase/supabase-js` is loaded on demand, so local-only builds do not pay for it on
  first paint.
- **Instrument Serif, Newsreader and Space Grotesk**, self-hosted as WOFF2 under `public/fonts/`.
- No UI framework, no CSS-in-JS; the design is plain CSS with custom properties and a first-class
  dark theme.
- The **wordmark and app icon** are generated from Parisienne (`scripts/make-brand.mjs`): the
  header and footer use a vector “Rhetoric” wordmark, while the installable icon is the script R
  with a cobalt full stop.

### Design notes

The visual language is a deliberate bridge between the two sibling projects: Virgil contributes the
warm paper, ink and brass; Cadence contributes the dark, instrument-panel precision. Rhetoric takes
those materials somewhere more editorial: a single loud cobalt accent, oversized Instrument Serif
display type, Newsreader for running text, Space Grotesk for the working labels, thick rules, hard
offset shadows, a few anti-grid overlaps, and a calligraphic Parisienne wordmark with a script R
icon. The brief was a
2026 editorial studio rather than a generic dashboard: bold typography, one accent reserved for
action, visible structure, and dark mode designed alongside light mode.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, for account sync
npm run dev                  # http://localhost:5173
npm run build                # production build in dist/
npm run preview              # preview the production build
```

Without Supabase credentials the app builds and runs exactly as before; `/account` simply explains
that sync is off in that build.

### Useful maintenance scripts

```bash
npm run sync:dictionary   # copy dictionary-en's .aff/.dic into src/lib/dictionary
npm run icons             # regenerate the logo, favicon and PNG icons
```

The dictionary is committed to the repository so a fresh clone can build without extra steps. Run
`sync:dictionary` only when upgrading `dictionary-en`. `npm run icons` uses the committed
`scripts/fonts/Parisienne-Regular.ttf` and the dev-only `opentype.js` + `sharp` packages to
rebuild the brand files.

---

## Deployment

The workflow in `.github/workflows/deploy.yml` builds the site for GitHub Pages on every push to
`main`:

1. Push to `main`. The workflow enables Pages automatically on the first run
   (`configure-pages` with `enablement: true`), so no manual settings change is needed.
2. The site is published at **https://rhetoric.parsasam.ir/** from the repository root
   (`VITE_BASE=/`). `public/CNAME` pins the custom domain, and the GitHub Pages URL redirects there.

**Using a sub-path instead?** Set `VITE_BASE=/your-sub-path/` in the workflow and in
`package.json`'s `build:pages` script, then remove `public/CNAME`. The Vite config reads
`VITE_BASE` from the environment.

`scripts/postbuild.mjs` copies `index.html` to `404.html` so deep links boot the SPA on Pages, and
writes `.nojekyll`.

---

## Accounts and progress sync

The account at `/account` is optional. It connects an email address to a Supabase row so the
current draft and practice record can be carried between a phone and a computer. Every writing
tool stays local-first and offline-capable; the account is a deliberate save-and-fetch copy, not a
background upload.

Enable it once:

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql). It creates the
   `rhetoric_progress` and `rhetoric_llm_settings` tables with row-level security policies so each
   user can only read and write their own rows. Re-run it after upgrading to add the LLM table.
3. In **Authentication → URL Configuration**, set **Site URL** to
   `https://rhetoric.parsasam.ir/` and add these **Redirect URLs**:
   `https://rhetoric.parsasam.ir/account` and `http://localhost:5173/account`. The email link
   returns to the account page, where Supabase’s PKCE flow completes.
4. Copy the project URL and the **anon public** or **publishable** key from
   **Project Settings → API** into `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Use the project root URL (`https://<project-ref>.supabase.co`), not the `/rest/v1/` endpoint.

5. For GitHub Pages, add both names as repository **variables** under **Settings → Secrets and
   variables → Actions → Variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The deploy
   workflow passes them into the build.

Then open **Account**, enter an email, and follow the one-time link. There is no password to store.
The anon or publishable key is safe to ship in the bundle because row-level security restricts
every request to the signed-in user.

What the saved copy contains:

- **The studio** — draft text, title, chosen blueprint, ignored spellings and checklist ticks.
- **The practice record** — the last 50 session scores, used to show accuracy and the best set.
- **Not preferences** — theme and install-prompt state stay on each device.

The account page also stores an optional LLM connection: an OpenAI-compatible API URL, a model
name and an API key. It lives in `rhetoric_llm_settings` with the same row-level security, and the
key is never written to the browser’s local storage. This stores the connection; it does not send
drafts anywhere by itself.

Saving and loading are separate actions. **Save to account** overwrites the account copy with the
current local progress; **Load account copy** asks first, then replaces the draft, checklist and
practice record on this device. There is no silent last-writer-wins merge — safer for a text draft.
Signing out never removes the local copy.

Supabase’s built-in email sender is rate-limited and intended for testing. For real sign-ups,
configure SMTP under **Authentication → Emails** with any transactional provider.

---

## Project layout

```text
src/
  components/      layout, header/footer, logo, studio panels, PWA prompts
  data/            thesaurus, writing blueprints, practice exercises, prompts
  hooks/           localStorage, debounced values, PWA install
  lib/             text analysis, spellchecking, word lookup, dictionary files, Supabase account/progress
  pages/           Home, Write, Structures, Wordbook, Practice, Account, About, NotFound
  styles/          theme variables, base styles, page styles
public/
  fonts/           self-hosted Instrument Serif, Newsreader, Space Grotesk + OFL licences
  brand/           generated logo mark
  icons/           generated PWA icons
scripts/           postbuild, dictionary sync, brand generation (Parisienne source in scripts/fonts)
supabase/          schema.sql for the optional account table
```

---

## Known limits (deliberately)

- The clarity score is heuristic and can be wrong about a deliberate style. Read the draft aloud.
- Passive-voice detection is pattern-based; it flags possibilities, not certainties.
- The spellchecker skips capitalised names mid-sentence and acronyms, and it does not check grammar.
- Account sync is an explicit save-and-fetch copy, not live collaborative editing. Loading the
  account copy replaces the draft on that device after a confirmation.
- Datamuse returns all senses of a word. The curated entries are hand-checked; online-only words
  may include a synonym from a different sense.

---

## Credits

- Hunspell dictionary: [wooorm/dictionaries](https://github.com/wooorm/dictionaries) (MIT/BSD).
- Spellchecking: [wooorm/nspell](https://github.com/wooorm/nspell).
- Word data: [Datamuse API](https://www.datamuse.com/api/).
- The five canons of rhetoric, and the figures in the orator’s kit, after the classical tradition.
- Interface typefaces: [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif),
  [Newsreader](https://fonts.google.com/specimen/Newsreader) and
  [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), all under the SIL Open Font
  License. Licence texts are in `public/fonts/OFL-*`.
- Logo lettering: [Parisienne](https://fonts.google.com/specimen/Parisienne) by Brian J.
  Bonislawsky, also under the SIL Open Font License (`scripts/fonts/OFL-Parisienne.txt`). The
  wordmark and the R icon are vector drawings derived from that face; the cobalt full stop is
  original.
- Built with [React](https://react.dev/) and [Vite](https://vite.dev/).
