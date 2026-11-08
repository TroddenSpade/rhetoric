import nspell from 'nspell'
import aff from './dictionary/index.aff?raw'
import dic from './dictionary/index.dic?raw'
import { tokenize } from './text.js'

// Loaded lazily by the studio, so the 550 kB Hunspell dictionary stays out of
// the initial bundle and is precached by the service worker for offline use.
let spell = null

function getSpell() {
  if (!spell) spell = nspell(aff, dic)
  return spell
}

// Words the dictionary does not know but which are common in a modern draft.
// Proper nouns are skipped separately (see below).
const ALWAYS_IGNORE = new Set(
  `rhetoric rhetoric's pwa api css html js javascript react vite github online offline dropdown
  webfont workflow metadata hyperlink login logout username email emails url urls
  ok okay per cent percent smartphone smartphone apps internet web browser`
    .split(/\s+/)
    .filter(Boolean),
)

function sentenceStart(text, start) {
  const before = text.slice(0, start).replace(/\s+$/, '')
  if (!before) return true
  return /[.!?…][\"'”’)]*$/.test(before)
}

/**
 * Find likely spelling mistakes with up to five suggestions each.
 *
 * @param {string} text
 * @param {{ ignored?: string[] }} [options]
 * @returns {Array<{word: string, lower: string, start: number, end: number, suggestions: string[], count: number}>}
 */
export function checkSpelling(text, { ignored = [] } = {}) {
  const checker = getSpell()
  const ignore = new Set(
    [...ALWAYS_IGNORE, ...ignored].map((word) => String(word).toLowerCase().trim()).filter(Boolean),
  )

  const found = new Map()

  for (const token of tokenize(text)) {
    const { word, lower, start, end } = token
    if (word.length < 3) continue
    if (/\d/.test(word)) continue
    if (word.includes('-')) continue
    if (/[A-Z]{2,}/.test(word)) continue // acronyms: NASA, HTML
    if (ignore.has(lower)) continue

    // A capitalised word in the middle of a sentence is far more likely to be
    // a name than a misspelling, so leave those to the reader.
    if (!sentenceStart(text, start) && /^[A-Z]/.test(word)) continue

    const normalised = word.replace(/’/g, "'")
    if (checker.correct(normalised)) continue

    const suggestions = checker
      .suggest(normalised)
      .slice(0, 5)
      .map((suggestion) => suggestion.replace(/'/g, '’'))

    const existing = found.get(lower)
    if (existing) {
      existing.count += 1
      continue
    }

    found.set(lower, {
      word,
      lower,
      start,
      end,
      suggestions,
      count: 1,
    })
  }

  return [...found.values()].sort((a, b) => a.start - b.start)
}
