import { findEntry } from '../data/thesaurus.js'
import { uniq } from './text.js'

const CACHE_KEY = 'rhetoric:wordcache:v1'
const CACHE_TTL = 1000 * 60 * 60 * 24 * 30 // 30 days
const DATAMUSE = 'https://api.datamuse.com/words'

const POS_NAMES = {
  n: 'noun',
  v: 'verb',
  adj: 'adjective',
  adv: 'adverb',
  u: 'word',
}

function readCache() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeCache(cache) {
  if (typeof window === 'undefined') return
  try {
    // Keep the cache small: drop the oldest entries if it grows too large.
    const entries = Object.entries(cache)
    if (entries.length > 220) {
      entries.sort((a, b) => (b[1].at || 0) - (a[1].at || 0))
      cache = Object.fromEntries(entries.slice(0, 180))
    }
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    /* storage may be full or unavailable */
  }
}

function cacheGet(word) {
  const cache = readCache()
  const hit = cache[word]
  if (!hit) return null
  if (Date.now() - (hit.at || 0) > CACHE_TTL) return null
  return hit.data
}

function cacheSet(word, data) {
  const cache = readCache()
  cache[word] = { at: Date.now(), data }
  writeCache(cache)
}

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Datamuse ${response.status}`)
  return response.json()
}

function timeoutSignal(ms) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms)
  }
  const controller = new AbortController()
  window.setTimeout(() => controller.abort(), ms)
  return controller.signal
}

function combineSignals(signal, timeout) {
  if (!signal) return timeout
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
    return AbortSignal.any([signal, timeout])
  }
  return signal
}

function parseDefinition(results) {
  const first = results?.[0]
  if (!first) return { gloss: null, pos: null }
  const def = first.defs?.[0] || ''
  const [tag, ...rest] = def.split('\t')
  return {
    gloss: rest.join(' ').trim() || null,
    pos: POS_NAMES[tag] || null,
  }
}

/**
 * Look up a word. The curated wordbook is always used as the offline base;
 * Datamuse adds synonyms, antonyms and a definition when the network is up.
 */
export async function lookupWord(rawWord, { signal } = {}) {
  const word = String(rawWord || '').trim().toLowerCase()
  if (!word) {
    return { word: '', synonyms: [], antonyms: [], notFound: true }
  }

  const curated = findEntry(word)
  const cached = cacheGet(word)
  if (cached) {
    return { ...curated, ...cached, word, category: curated?.category || cached.category }
  }

  const base = {
    word,
    synonyms: curated?.synonyms || [],
    antonyms: curated?.antonyms || [],
    gloss: curated?.gloss || null,
    pos: curated?.pos || null,
    example: curated?.example || null,
    category: curated?.category || null,
  }

  if (!/^[a-z][a-z'’-]*$/.test(word)) {
    return { ...base, notFound: !curated, online: false }
  }

  const q = encodeURIComponent(word)
  const requestSignal = combineSignals(signal, timeoutSignal(4500))
  try {
    // Use allSettled: if one endpoint is blocked, the others can still enrich
    // the entry. Only a total failure falls back to the local wordbook.
    const [synonymResult, antonymResult, definitionResult] = await Promise.allSettled([
      fetchJson(`${DATAMUSE}?rel_syn=${q}&max=18`, requestSignal),
      fetchJson(`${DATAMUSE}?rel_ant=${q}&max=10`, requestSignal),
      fetchJson(`${DATAMUSE}?sp=${q}&md=dp&max=1`, requestSignal),
    ])

    if (
      synonymResult.status !== 'fulfilled' &&
      antonymResult.status !== 'fulfilled' &&
      definitionResult.status !== 'fulfilled'
    ) {
      throw new Error('Datamuse unavailable')
    }

    const synonyms = synonymResult.status === 'fulfilled' ? synonymResult.value : []
    const antonyms = antonymResult.status === 'fulfilled' ? antonymResult.value : []
    const definitions = definitionResult.status === 'fulfilled' ? definitionResult.value : []

    const definition = parseDefinition(definitions)
    const data = {
      // Curated entries are hand-checked and sense-specific. Only reach for
      // the API's broader (and noisier) synonym list when we have little or
      // nothing local to offer.
      synonyms: uniq([
        ...base.synonyms,
        ...(base.synonyms.length < 3 ? synonyms.map((item) => item.word) : []),
      ])
        .filter((item) => item.toLowerCase() !== word)
        .slice(0, 18),
      antonyms: uniq([
        ...base.antonyms,
        ...antonyms.map((item) => item.word),
      ])
        .filter((item) => item.toLowerCase() !== word)
        .slice(0, 10),
      gloss: base.gloss || definition.gloss,
      pos: base.pos || definition.pos,
      example: base.example,
      category: base.category,
      online: true,
    }

    cacheSet(word, data)
    return { ...base, ...data, word }
  } catch (error) {
    // A caller abort means the component moved on; a timeout or network error
    // simply means we keep the local entry.
    if (signal?.aborted) {
      const abortError = new Error('Aborted')
      abortError.name = 'AbortError'
      throw abortError
    }
    return { ...base, notFound: !curated, online: false, unavailable: true }
  }
}

export function clearWordCache() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CACHE_KEY)
  } catch {
    /* ignore */
  }
}
