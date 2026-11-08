export const STOPWORDS = new Set(
  `a about above after again against all also am an and any are aren't as at be because been before being
  below between both but by can cannot can't could couldn't did didn't do does doesn't doing don't down during
  each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers
  herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself just let's me
  more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own
  same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them
  themselves then there there's these they they'd they'll they're they've this those through to too under
  until up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which
  while who who's whom why why's will with won't would wouldn't you you'd you'll you're you've your yours
  yourself yourselves`
    .split(/\s+/)
    .filter(Boolean),
)

const WORD_RE = /[A-Za-z][A-Za-z'’\-]*/g

export function tokenize(text) {
  const tokens = []
  let match
  WORD_RE.lastIndex = 0
  while ((match = WORD_RE.exec(text)) !== null) {
    const word = match[0]
    tokens.push({
      word,
      lower: word.toLowerCase().replace(/’/g, "'"),
      start: match.index,
      end: match.index + word.length,
    })
  }
  return tokens
}

// Split into sentences while keeping the offsets needed to select one in the
// editor. Intl.Segmenter handles abbreviations and ellipses better; the regex
// fallback keeps the app working in older browsers.
export function splitSentences(text) {
  const trimmed = text.trim()
  if (!trimmed) return []

  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    try {
      const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' })
      const sentences = []
      for (const part of segmenter.segment(text)) {
        const raw = part.segment
        const lead = raw.length - raw.trimStart().length
        const body = raw.trim()
        if (!body) continue
        const start = part.index + lead
        sentences.push({ text: body, start, end: start + body.length })
      }
      return sentences
    } catch {
      /* fall through to the regex */
    }
  }

  const sentences = []
  const re = /[^.!?]+(?:[.!?]+["'”’)]*|$)/g
  let match
  while ((match = re.exec(text)) !== null) {
    const raw = match[0]
    const body = raw.trim()
    if (!body) continue
    const lead = raw.length - raw.trimStart().length
    const start = match.index + lead
    sentences.push({ text: body, start, end: start + body.length })
  }
  return sentences
}

export function countWords(text) {
  return tokenize(text).length
}

// Preserve the reader's capitalisation when swapping one word for another.
export function matchCase(original, replacement) {
  if (!original) return replacement
  if (original === original.toUpperCase() && original.length > 1) {
    return replacement.toUpperCase()
  }
  if (original[0] === original[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }
  return replacement.toLowerCase()
}

export function isSingleWord(value) {
  return /^[A-Za-z][A-Za-z'’-]*$/.test(value.trim())
}

export function truncate(value, max = 100) {
  const text = String(value).trim()
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}…`
}

export function uniq(values) {
  const seen = new Set()
  const out = []
  for (const value of values) {
    const key = String(value).toLowerCase().trim()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(String(value).trim())
  }
  return out
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en').format(value)
}

export function readingMinutes(words) {
  return Math.max(1, Math.round(words / 220))
}
