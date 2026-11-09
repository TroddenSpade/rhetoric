// The local-first progress document and the small helpers that turn it into
// something the account page can read. The same shape is stored in Supabase.

export const PROGRESS_VERSION = 1

export const PROGRESS_KEYS = {
  draft: 'rhetoric:draft',
  title: 'rhetoric:title',
  ignored: 'rhetoric:ignored-words',
  blueprint: 'rhetoric:blueprint',
  checklists: 'rhetoric:checklists',
  practice: 'rhetoric:practice',
}

const MAX_IGNORED_WORDS = 500
const MAX_CHECKLIST_ITEMS = 200
const MAX_PRACTICE_SESSIONS = 50
const MAX_TITLE_LENGTH = 160

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function cleanString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function cleanStringList(value, limit) {
  if (!Array.isArray(value)) return []
  const seen = new Set()
  const result = []
  for (const item of value) {
    if (typeof item !== 'string') continue
    const text = item.trim()
    if (!text || seen.has(text)) continue
    seen.add(text)
    result.push(text)
    if (result.length >= limit) break
  }
  return result
}

function normalizeChecklists(value) {
  if (!isObject(value)) return {}
  const result = {}
  for (const [blueprint, items] of Object.entries(value)) {
    if (!blueprint || !Array.isArray(items)) continue
    const cleaned = cleanStringList(items, MAX_CHECKLIST_ITEMS)
    if (cleaned.length) result[blueprint.slice(0, 80)] = cleaned
  }
  return result
}

function normalizeSessions(value) {
  const list = Array.isArray(value) ? value : []
  return list
    .map((session) => {
      if (!isObject(session)) return null
      const total = Number(session.total)
      const score = Number(session.score)
      const at = Number(session.at)
      if (!Number.isInteger(total) || total <= 0 || !Number.isFinite(at)) return null
      return {
        at,
        type: cleanString(session.type, 'all').slice(0, 40) || 'all',
        score: Math.max(0, Math.min(total, Number.isFinite(score) ? Math.round(score) : 0)),
        total,
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.at - left.at)
    .slice(0, MAX_PRACTICE_SESSIONS)
}

export function normalizePractice(value) {
  if (Array.isArray(value)) return { sessions: normalizeSessions(value) }
  if (!isObject(value)) return { sessions: [] }
  return { sessions: normalizeSessions(value.sessions) }
}

/**
 * Accepts a stored document and returns a tidy copy. Bad or missing fields fall
 * back to the same defaults the studio uses, so an older or partial document
 * never leaves the editor with the wrong types.
 */
export function normalizeProgress(value) {
  const source = isObject(value) ? value : {}
  const studio = isObject(source.studio) ? source.studio : source
  const title = cleanString(studio.title, 'Untitled draft').slice(0, MAX_TITLE_LENGTH)

  return {
    version: PROGRESS_VERSION,
    studio: {
      draft: cleanString(studio.draft),
      title: title || 'Untitled draft',
      blueprint: cleanString(studio.blueprint, 'argument').slice(0, 80) || 'argument',
      ignored: cleanStringList(studio.ignored, MAX_IGNORED_WORDS),
      checklists: normalizeChecklists(studio.checklists),
    },
    practice: normalizePractice(source.practice),
  }
}

function readJson(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

/** Reads the studio and practice state that this device currently holds. */
export function readLocalProgress() {
  return normalizeProgress({
    studio: {
      draft: readJson(PROGRESS_KEYS.draft, ''),
      title: readJson(PROGRESS_KEYS.title, 'Untitled draft'),
      blueprint: readJson(PROGRESS_KEYS.blueprint, 'argument'),
      ignored: readJson(PROGRESS_KEYS.ignored, []),
      checklists: readJson(PROGRESS_KEYS.checklists, {}),
    },
    practice: readJson(PROGRESS_KEYS.practice, { sessions: [] }),
  })
}

function publish(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return false
  }
  // The mounted useLocalStorage hooks listen for this so an account fetch
  // updates the open editor and practice panel without a reload.
  try {
    window.dispatchEvent(new CustomEvent('rhetoric:storage', { detail: { key, value } }))
  } catch {
    /* older browsers can ignore the live update; storage is still written */
  }
  return true
}

/** Replaces the local progress with an account copy. */
export function applyLocalProgress(document) {
  const progress = normalizeProgress(document)
  if (typeof window === 'undefined') {
    return { ok: false, error: 'This device cannot store progress.' }
  }

  const writes = [
    [PROGRESS_KEYS.draft, progress.studio.draft],
    [PROGRESS_KEYS.title, progress.studio.title],
    [PROGRESS_KEYS.blueprint, progress.studio.blueprint],
    [PROGRESS_KEYS.ignored, progress.studio.ignored],
    [PROGRESS_KEYS.checklists, progress.studio.checklists],
    [PROGRESS_KEYS.practice, progress.practice],
  ]

  for (const [key, value] of writes) {
    if (!publish(key, value)) {
      return {
        ok: false,
        error: 'This device could not store the account copy. Its local storage may be full.',
      }
    }
  }

  return { ok: true, progress }
}

export function countWords(text) {
  if (typeof text !== 'string') return 0
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export function summarizePractice(practice) {
  const { sessions } = normalizePractice(practice)
  const answered = sessions.reduce((total, session) => total + session.total, 0)
  const correct = sessions.reduce((total, session) => total + session.score, 0)
  const best = sessions.reduce(
    (value, session) => Math.max(value, Math.round((session.score / session.total) * 100)),
    0,
  )

  return {
    sessions: sessions.length,
    answered,
    correct,
    accuracy: answered ? Math.round((correct / answered) * 100) : 0,
    best,
    lastAt: sessions[0]?.at ?? null,
  }
}

export function summarizeProgress(document) {
  const progress = normalizeProgress(document)
  const practice = summarizePractice(progress.practice)
  const checks = Object.values(progress.studio.checklists).reduce(
    (total, items) => total + items.length,
    0,
  )

  return {
    title: progress.studio.title,
    words: countWords(progress.studio.draft),
    characters: progress.studio.draft.length,
    blueprint: progress.studio.blueprint,
    checklists: checks,
    ...practice,
  }
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

/**
 * A stable comparison value for "does this device match the account copy?".
 * The save timestamp and device metadata are deliberately excluded.
 */
export function progressFingerprint(document) {
  const progress = normalizeProgress(document)
  return stableStringify({
    version: progress.version,
    studio: progress.studio,
    practice: progress.practice,
  })
}
