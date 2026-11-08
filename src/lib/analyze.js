import {
  STOPWORDS,
  readingMinutes,
  splitSentences,
  tokenize,
} from './text.js'

const FILLERS = [
  'very',
  'really',
  'quite',
  'just',
  'actually',
  'basically',
  'literally',
  'simply',
  'totally',
  'definitely',
  'extremely',
  'incredibly',
  'somewhat',
  'rather',
  'pretty',
  'fairly',
  'a bit',
  'a little',
  'sort of',
  'kind of',
  'a lot',
  'a lot of',
  'lots of',
  'in order to',
  'due to the fact that',
  'for all intents and purposes',
  'needless to say',
  'it goes without saying',
]

const VAGUE = [
  'thing',
  'things',
  'stuff',
  'something',
  'anything',
  'everything',
  'nice',
  'good',
  'bad',
  'big',
  'small',
  'interesting',
  'important',
  'different',
  'various',
  'several',
  'many',
  'some',
  'people',
  'society',
]

const CLICHES = [
  'think outside the box',
  'at the end of the day',
  'in today’s world',
  'in today\'s world',
  'the fact of the matter is',
  'it is what it is',
  'last but not least',
  'first and foremost',
  'each and every',
  'few and far between',
  'in the nick of time',
  'when all is said and done',
  'a double-edged sword',
  'the tip of the iceberg',
  'a blessing in disguise',
  'avoid like the plague',
  'every cloud has a silver lining',
  'very unique',
  'completely unique',
  'in this day and age',
]

const LY_EXCEPTIONS = new Set([
  'only',
  'early',
  'family',
  'reply',
  'apply',
  'supply',
  'rely',
  'fly',
  'belly',
  'holy',
  'ugly',
  'silly',
  'friendly',
  'lovely',
  'lonely',
  'likely',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'ally',
  'jelly',
  'assembly',
  'anomaly',
  'monopoly',
])

const IRREGULAR_PARTICIPLES = new Set(
  `born known shown written given taken made done seen held found brought thought told left kept sent built
  spent understood won lost paid met read run begun chosen driven eaten fallen forgotten frozen hidden ridden
  risen spoken stolen sworn torn worn`
    .split(/\s+/)
    .filter(Boolean),
)

const PASSIVE_RE = new RegExp(
  `\\b(?:am|is|are|was|were|be|been|being|get|gets|got|gotten)\\b(?:\\s+\\w+ly)?\\s+\\b([A-Za-z]+(?:ed|en)|${[
    ...IRREGULAR_PARTICIPLES,
  ].join('|')})\\b`,
  'gi',
)

const EXCLETIVE_RE = /\b(?:there|it)\s+(?:is|are|was|were|will be|has been|have been)\b/gi

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findPhrases(text, phrases) {
  const hits = []
  for (const phrase of phrases) {
    const pattern = escapeRegExp(phrase).replace(/\\?\s+/g, '\\s+')
    const re = new RegExp(`\\b${pattern}\\b`, 'gi')
    let match
    while ((match = re.exec(text)) !== null) {
      hits.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
      })
      if (hits.length > 80) return hits.sort((a, b) => a.start - b.start)
      if (match[0].length === 0) re.lastIndex += 1
    }
  }
  return hits.sort((a, b) => a.start - b.start)
}

// Keep the longest match when two phrases overlap (e.g. “a lot” inside
// “a lot of”), so the same words are not reported twice.
function dedupePhrases(hits) {
  const sorted = [...hits].sort(
    (a, b) => a.start - b.start || b.end - b.start - (a.end - a.start),
  )
  const out = []
  for (const hit of sorted) {
    const previous = out[out.length - 1]
    if (previous && hit.start < previous.end) continue
    out.push(hit)
  }
  return out
}

function findExpletives(text) {
  const hits = []
  const re =
    /(?:^|[.!?…]\s+|\n+)((?:there|it)\s+(?:is|are|was|were|will be|has been|have been))\b/gi
  let match
  while ((match = re.exec(text)) !== null) {
    const lead = match[0].length - match[1].length
    const start = match.index + lead
    hits.push({
      text: match[1],
      start,
      end: start + match[1].length,
    })
    if (hits.length >= 12) break
  }
  return hits
}

function findPassive(text) {
  const hits = []
  PASSIVE_RE.lastIndex = 0
  let match
  while ((match = PASSIVE_RE.exec(text)) !== null) {
    hits.push({
      text: match[0],
      start: match.index,
      end: match.index + match[0].length,
    })
    if (hits.length >= 20) break
  }
  return hits
}

function countSyllables(word) {
  let value = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!value) return 0
  if (value.length <= 3) return 1
  value = value.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  value = value.replace(/^y/, '')
  const groups = value.match(/[aeiouy]{1,2}/g)
  return Math.max(1, groups ? groups.length : 1)
}

function standardDeviation(values) {
  if (values.length < 2) return 0
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)))
}

function density(count, total) {
  return total > 0 ? count / total : 0
}

export function analyzeText(text, { spelling = [] } = {}) {
  const trimmed = text.trim()
  const tokens = tokenize(text)
  const words = tokens.length
  const sentences = splitSentences(text)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean).length || (trimmed ? 1 : 0)

  const sentenceLengths = sentences.map(
    (sentence) => tokenize(sentence.text).length,
  )
  const avgSentence = sentences.length
    ? sentenceLengths.reduce((sum, value) => sum + value, 0) / sentences.length
    : 0
  const sentenceVariety = standardDeviation(sentenceLengths)
  const longSentences = sentences
    .map((sentence, index) => ({ ...sentence, words: sentenceLengths[index] }))
    .filter((sentence) => sentence.words >= 28)
    .sort((a, b) => b.words - a.words)
    .slice(0, 6)

  const syllables = tokens.reduce(
    (sum, token) => sum + countSyllables(token.word),
    0,
  )
  const syllablesPerWord = words ? syllables / words : 0
  const flesch =
    words && sentences.length
      ? 206.835 - 1.015 * (words / sentences.length) - 84.6 * syllablesPerWord
      : null
  const grade =
    words && sentences.length
      ? 0.39 * (words / sentences.length) + 11.8 * syllablesPerWord - 15.59
      : null

  const frequencies = new Map()
  const contentWords = []
  for (const token of tokens) {
    if (token.lower.length < 4) continue
    if (STOPWORDS.has(token.lower)) continue
    contentWords.push(token)
    const current = frequencies.get(token.lower) || { word: token.word, lower: token.lower, count: 0 }
    current.count += 1
    frequencies.set(token.lower, current)
  }

  const repeated = [...frequencies.values()]
    .filter((entry) => entry.count >= 3)
    .map((entry) => ({
      ...entry,
      density: density(entry.count, words),
    }))
    .sort((a, b) => b.count - a.count || b.density - a.density)
    .slice(0, 8)

  const startCounts = new Map()
  for (const sentence of sentences) {
    const first = tokenize(sentence.text)[0]
    if (!first) continue
    if (first.lower.length < 3) continue
    // Unlike the repetition list, the opening-word list deliberately includes
    // common words: three sentences that begin with “The” is exactly the kind
    // of monotony this check is meant to surface.
    const current = startCounts.get(first.lower) || { word: first.word, count: 0 }
    current.count += 1
    startCounts.set(first.lower, current)
  }
  const repeatedStarts = [...startCounts.values()]
    .filter((entry) => entry.count >= 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const fillers = dedupePhrases(findPhrases(text, FILLERS))
  const vague = dedupePhrases(findPhrases(text, VAGUE))
  const cliches = dedupePhrases(findPhrases(text, CLICHES))
  const passive = findPassive(text)
  const expletives = findExpletives(text)

  const adverbs = tokens.filter(
    (token) => token.lower.endsWith('ly') && !LY_EXCEPTIONS.has(token.lower),
  )
  const adverbDensity = density(adverbs.length, words)

  const unique = new Set(tokens.map((token) => token.lower)).size
  const longSentenceRatio = sentences.length
    ? longSentences.length / sentences.length
    : 0
  const passiveDensity = density(passive.length, sentences.length)
  const fillerDensity = density(fillers.length, words)
  const vagueDensity = density(vague.length, words)
  const readability = flesch === null ? null : Math.max(0, Math.min(100, flesch))

  const concision = clamp(
    100 -
      fillers.length * 3.5 -
      vague.length * 2.2 -
      cliches.length * 4 -
      passive.length * 2.5 -
      Math.max(0, adverbDensity * 260),
  )
  const variety = clamp(
    100 -
      repeated.reduce((sum, entry) => sum + Math.max(0, entry.count - 2) * 3, 0) -
      repeatedStarts.length * 6 -
      (sentences.length >= 4 && sentenceVariety < 3 ? 10 : 0),
  )
  const clarity = clamp(
    100 -
      longSentenceRatio * 55 -
      (grade === null ? 0 : Math.max(0, grade - 12) * 4) -
      (avgSentence > 30 ? 8 : 0) -
      (readability !== null && readability < 35 ? 8 : 0),
  )
  const polish = clamp(100 - spelling.length * 6 - cliches.length * 4)
  const overall = clamp(
    concision * 0.25 + variety * 0.25 + clarity * 0.3 + polish * 0.2,
  )

  const ready = words >= 20
  const insights = []

  if (!ready) {
    insights.push({
      id: 'start',
      tone: 'note',
      title: 'Keep writing',
      detail: 'A few sentences are enough to start. Feedback becomes more useful after about twenty words.',
      items: [],
    })
  }

  if (spelling.length) {
    insights.push({
      id: 'spelling',
      tone: 'warn',
      title: `${spelling.length} possible spelling ${spelling.length === 1 ? 'slip' : 'slips'}`,
      detail: 'Check the spelling panel for suggestions. Names and technical terms can be ignored.',
      items: spelling.slice(0, 5).map((entry) => ({
        label: entry.word,
        hint: entry.count > 1 ? `${entry.count}×` : undefined,
        start: entry.start,
        end: entry.end,
      })),
    })
  }

  if (repeated.length) {
    insights.push({
      id: 'repeated',
      tone: repeated.some((entry) => entry.density > 0.04) ? 'warn' : 'note',
      title: 'Words you lean on',
      detail: 'Repetition is not a fault in itself — but a synonym or a sharper noun can add range.',
      items: repeated.slice(0, 5).map((entry) => ({
        label: entry.word,
        hint: `${entry.count}×`,
      })),
    })
  }

  if (repeatedStarts.length) {
    insights.push({
      id: 'starts',
      tone: 'note',
      title: 'Sentences that open the same way',
      detail: 'Vary the first few words. Begin with a phrase, an image, or the object of the sentence.',
      items: repeatedStarts.map((entry) => ({
        label: entry.word,
        hint: `${entry.count} sentences`,
      })),
    })
  }

  if (fillers.length) {
    insights.push({
      id: 'fillers',
      tone: 'warn',
      title: 'Filler and hedging',
      detail: 'These words usually add length without adding meaning. Try cutting them first.',
      items: fillers.slice(0, 6).map((entry) => ({
        label: entry.text,
        start: entry.start,
        end: entry.end,
      })),
    })
  }

  if (vague.length) {
    insights.push({
      id: 'vague',
      tone: 'note',
      title: 'Vague words',
      detail: 'A precise noun or verb will do more work than a general one. Ask what exactly you mean.',
      items: vague.slice(0, 6).map((entry) => ({
        label: entry.text,
        start: entry.start,
        end: entry.end,
      })),
    })
  }

  if (passive.length) {
    insights.push({
      id: 'passive',
      tone: 'note',
      title: 'Possible passive voice',
      detail: 'Passive constructions are useful when the actor is unknown or unimportant. Otherwise, name the actor.',
      items: passive.slice(0, 5).map((entry) => ({
        label: entry.text,
        start: entry.start,
        end: entry.end,
      })),
    })
  }

  if (expletives.length >= 2) {
    insights.push({
      id: 'expletives',
      tone: 'note',
      title: 'Delayed subjects',
      detail: '“There is…” and “It was…” push the real subject to the end. Lead with the subject when you can.',
      items: expletives.slice(0, 4).map((entry) => ({
        label: entry.text,
        start: entry.start,
        end: entry.end,
      })),
    })
  }

  if (cliches.length) {
    insights.push({
      id: 'cliches',
      tone: 'warn',
      title: 'Familiar phrases',
      detail: 'A cliché arrives ready-made. Replace it with the particular thing you actually mean.',
      items: cliches.slice(0, 5).map((entry) => ({
        label: entry.text,
        start: entry.start,
        end: entry.end,
      })),
    })
  }

  if (longSentences.length) {
    insights.push({
      id: 'long',
      tone: 'note',
      title: 'Long sentences',
      detail: 'If a sentence runs past twenty-eight words, check whether it is carrying two ideas that could be split.',
      items: longSentences.slice(0, 4).map((sentence) => ({
        label: sentence.text,
        hint: `${sentence.words} words`,
        start: sentence.start,
        end: sentence.end,
      })),
    })
  }

  if (sentences.length >= 4 && sentenceVariety < 3) {
    insights.push({
      id: 'rhythm',
      tone: 'note',
      title: 'Even rhythm',
      detail: 'Your sentences are all a similar length. Try one short sentence for emphasis.',
      items: [],
    })
  }

  if (adverbDensity > 0.035 && adverbs.length >= 4) {
    insights.push({
      id: 'adverbs',
      tone: 'note',
      title: 'Adverb habit',
      detail: 'A stronger verb often makes the -ly word unnecessary.',
      items: adverbs.slice(0, 5).map((token) => ({
        label: token.word,
        start: token.start,
        end: token.end,
      })),
    })
  }

  if (ready && insights.length === 0) {
    insights.push({
      id: 'clean',
      tone: 'good',
      title: 'Clean draft',
      detail: 'No obvious repetition, filler or spelling problems. Read it aloud once more for rhythm.',
      items: [],
    })
  }

  return {
    words,
    unique,
    sentences: sentences.length,
    paragraphs,
    characters: text.length,
    readingMinutes: readingMinutes(words),
    avgSentence,
    sentenceVariety,
    sentenceLengths,
    longSentences,
    flesch: flesch === null ? null : Math.round(flesch),
    grade: grade === null ? null : Math.round(grade * 10) / 10,
    repeated,
    repeatedStarts,
    fillers,
    vague,
    cliches,
    passive,
    expletives,
    adverbs,
    spelling,
    spellingCount: spelling.length,
    scores: {
      overall,
      concision,
      variety,
      clarity,
      polish,
    },
    insights,
    ready,
  }
}

export const SCORE_BANDS = [
  { min: 85, label: 'Strong', tone: 'good' },
  { min: 70, label: 'Clear', tone: 'good' },
  { min: 55, label: 'Developing', tone: 'note' },
  { min: 0, label: 'Needs work', tone: 'warn' },
]

export function scoreBand(score) {
  return SCORE_BANDS.find((band) => score >= band.min) || SCORE_BANDS[SCORE_BANDS.length - 1]
}
