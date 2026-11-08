import test from 'node:test'
import assert from 'node:assert/strict'
import { categories, entries, findEntry, searchEntries, wordOfTheDay } from '../src/data/thesaurus.js'
import { findStructure, structures } from '../src/data/structures.js'
import { exercises, exerciseTypes } from '../src/data/exercises.js'
import { prompts, promptOfTheDay } from '../src/data/prompts.js'

test('the wordbook has unique, complete entries in every category', () => {
  assert.ok(entries.length >= 150)
  const seen = new Set()
  for (const entry of entries) {
    assert.ok(entry.word, 'entry has a word')
    assert.ok(!seen.has(entry.word), `duplicate headword: ${entry.word}`)
    seen.add(entry.word)
    assert.ok(entry.pos, `${entry.word} has a part of speech`)
    assert.ok(entry.gloss, `${entry.word} has a gloss`)
    assert.ok(entry.example, `${entry.word} has an example`)
    assert.ok(Array.isArray(entry.synonyms) && entry.synonyms.length > 0, `${entry.word} has synonyms`)
  }
  const categoryIds = new Set(categories.map((category) => category.id))
  for (const entry of entries) assert.ok(categoryIds.has(entry.category), `${entry.word} has a category`)
})

test('wordbook lookup and search are case-insensitive', () => {
  assert.equal(findEntry('WRITING')?.word, 'writing')
  assert.equal(findEntry('missing-word'), null)
  assert.ok(searchEntries('persuade').length > 0)
  assert.ok(wordOfTheDay(new Date(2026, 0, 1)))
})

test('every structure is complete and has a unique id', () => {
  assert.equal(structures.length, 9)
  const ids = new Set()
  for (const structure of structures) {
    assert.ok(!ids.has(structure.id), `duplicate structure id: ${structure.id}`)
    ids.add(structure.id)
    assert.ok(structure.sections.length >= 5, `${structure.id} has sections`)
    assert.ok(structure.skeleton.includes('['), `${structure.id} has placeholders`)
    assert.ok(structure.tips.length >= 3, `${structure.id} has tips`)
  }
  assert.equal(findStructure('argument')?.name, 'Argument')
  assert.equal(findStructure('missing'), null)
})

test('every exercise has a valid answer and unique options', () => {
  assert.ok(exercises.length >= 24)
  const types = new Set(exerciseTypes.map((type) => type.id))
  for (const exercise of exercises) {
    assert.ok(types.has(exercise.type), `${exercise.id} has a known type`)
    assert.ok(exercise.options.length >= 3, `${exercise.id} has options`)
    assert.equal(new Set(exercise.options).size, exercise.options.length, `${exercise.id} has unique options`)
    assert.ok(
      Number.isInteger(exercise.answer) &&
        exercise.answer >= 0 &&
        exercise.answer < exercise.options.length,
      `${exercise.id} has a valid answer`,
    )
    assert.ok(exercise.explanation, `${exercise.id} has an explanation`)
  }
})

test('prompts are available and rotate by day', () => {
  assert.ok(prompts.length >= 18)
  assert.ok(promptOfTheDay(new Date(2026, 0, 1)).prompt)
  for (const prompt of prompts) {
    assert.ok(prompt.mode && prompt.title && prompt.prompt && prompt.hint)
  }
})
