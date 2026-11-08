import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeText, scoreBand } from '../src/lib/analyze.js'
import { isSingleWord, matchCase, splitSentences, truncate } from '../src/lib/text.js'

test('splits sentences while keeping offsets usable', () => {
  const text = 'First sentence. Second sentence! Third?'
  const sentences = splitSentences(text)
  assert.equal(sentences.length, 3)
  assert.equal(sentences[0].text, 'First sentence.')
  assert.equal(text.slice(sentences[2].start, sentences[2].end), 'Third?')
})

test('finds filler, vague words, clichés and passive constructions', () => {
  const text =
    'There is a lot of stuff that is really important. At the end of the day, it is very good. The proposal was rejected by the committee.'
  const analysis = analyzeText(text)

  assert.ok(analysis.words > 0)
  assert.ok(analysis.sentences >= 3)
  assert.ok(analysis.fillers.some((entry) => entry.text.toLowerCase() === 'really'))
  assert.ok(analysis.fillers.some((entry) => entry.text.toLowerCase() === 'a lot of'))
  assert.ok(analysis.vague.some((entry) => entry.text.toLowerCase() === 'stuff'))
  assert.ok(analysis.cliches.some((entry) => entry.text.toLowerCase() === 'at the end of the day'))
  assert.ok(analysis.passive.some((entry) => entry.text.toLowerCase() === 'was rejected'))
  assert.equal(analysis.expletives.length, 1)
  assert.equal(analysis.expletives[0].text.toLowerCase(), 'there is')
})

test('does not double-report an overlapping filler phrase', () => {
  const analysis = analyzeText('There are a lot of things to do.')
  const fillers = analysis.fillers.map((entry) => entry.text.toLowerCase())
  assert.equal(fillers.filter((text) => text === 'a lot').length, 0)
  assert.equal(fillers.filter((text) => text === 'a lot of').length, 1)
})

test('flags a long sentence and scores within range', () => {
  const long = Array.from({ length: 32 }, (_, index) => `word${index}`).join(' ')
  const analysis = analyzeText(`${long}.`)
  assert.equal(analysis.longSentences.length, 1)
  for (const value of Object.values(analysis.scores)) {
    assert.ok(value >= 0 && value <= 100, `score out of range: ${value}`)
  }
})

test('handles empty and very short drafts', () => {
  const empty = analyzeText('')
  assert.equal(empty.words, 0)
  assert.equal(empty.sentences, 0)
  assert.equal(empty.ready, false)
  assert.equal(empty.insights[0].id, 'start')

  const short = analyzeText('A short note.')
  assert.equal(short.ready, false)
  assert.equal(short.insights[0].id, 'start')
})

test('scoreBand maps a score to a label', () => {
  assert.equal(scoreBand(95).label, 'Strong')
  assert.equal(scoreBand(60).label, 'Developing')
  assert.equal(scoreBand(10).label, 'Needs work')
})

test('text helpers handle case, single words and truncation', () => {
  assert.equal(matchCase('Writing', 'prose'), 'Prose')
  assert.equal(matchCase('WRITING', 'prose'), 'PROSE')
  assert.equal(matchCase('writing', 'prose'), 'prose')
  assert.equal(isSingleWord('word'), true)
  assert.equal(isSingleWord('two words'), false)
  assert.equal(truncate('abcdef', 4), 'abcd…')
})
