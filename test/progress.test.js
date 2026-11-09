import test from 'node:test'
import assert from 'node:assert/strict'
import {
  applyLocalProgress,
  countWords,
  progressFingerprint,
  summarizePractice,
  summarizeProgress,
} from '../src/lib/progress.js'

test('normalizes a partial progress document into the studio defaults', () => {
  const progress = summarizeProgress({
    studio: {
      draft: 'One two three',
      title: '',
      blueprint: '',
      ignored: ['  name ', 'name', 42],
      checklists: { argument: ['Claim', 'Claim', ''], broken: 'nope' },
    },
  })

  assert.equal(progress.title, 'Untitled draft')
  assert.equal(progress.blueprint, 'argument')
  assert.equal(progress.words, 3)
  assert.equal(progress.checklists, 1)
})

test('summarizes practice accuracy and the best set', () => {
  const summary = summarizePractice({
    sessions: [
      { at: 3, type: 'clarity', score: 6, total: 8 },
      { at: 2, type: 'words', score: 8, total: 8 },
      { at: 1, type: 'all', score: 4, total: 8 },
      { at: 0, type: 'all', score: 12, total: 4 },
    ],
  })

  assert.equal(summary.sessions, 4)
  assert.equal(summary.answered, 28)
  assert.equal(summary.correct, 22)
  assert.equal(summary.accuracy, 79)
  assert.equal(summary.best, 100)
  assert.equal(summary.lastAt, 3)
})

test('fingerprints ignore timestamps but notice real changes', () => {
  const base = {
    studio: { draft: 'A draft', title: 'Title', blueprint: 'argument' },
    practice: { sessions: [] },
  }

  assert.equal(
    progressFingerprint({ ...base, savedAt: '2026-01-01T00:00:00.000Z' }),
    progressFingerprint({ ...base, savedAt: '2027-09-09T12:00:00.000Z' }),
  )
  assert.notEqual(
    progressFingerprint(base),
    progressFingerprint({ ...base, studio: { ...base.studio, draft: 'A longer draft' } }),
  )
})

test('applies an account copy to local storage and announces each key', () => {
  const store = new Map()
  const events = []
  const previousWindow = globalThis.window
  globalThis.window = {
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, value),
    },
    dispatchEvent: (event) => events.push(event),
  }

  try {
    const result = applyLocalProgress({
      studio: { draft: 'Synced words', title: 'Synced title', blueprint: 'narrative' },
      practice: { sessions: [{ at: 1, type: 'all', score: 8, total: 8 }] },
    })

    assert.equal(result.ok, true)
    assert.equal(JSON.parse(store.get('rhetoric:draft')), 'Synced words')
    assert.equal(JSON.parse(store.get('rhetoric:title')), 'Synced title')
    assert.equal(JSON.parse(store.get('rhetoric:blueprint')), 'narrative')
    assert.equal(JSON.parse(store.get('rhetoric:practice')).sessions.length, 1)
    assert.equal(events.length, 6)
  } finally {
    globalThis.window = previousWindow
  }
})

test('countWords handles whitespace and empty drafts', () => {
  assert.equal(countWords(''), 0)
  assert.equal(countWords('   '), 0)
  assert.equal(countWords('one two\nthree'), 3)
})
