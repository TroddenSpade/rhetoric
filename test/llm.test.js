import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isValidLlmUrl,
  maskApiKey,
  normalizeLlmSettings,
  validateLlmSettings,
} from '../src/lib/llm.js'

test('masks stored API keys without exposing them', () => {
  assert.equal(maskApiKey(''), '')
  assert.equal(maskApiKey('abcd'), '••••')
  assert.equal(maskApiKey('sk-1234567890'), '••••7890')
  assert.equal(maskApiKey('  sk-abcdef  '), '••••cdef')
})

test('normalizes Supabase rows and form-shaped settings', () => {
  const row = normalizeLlmSettings({
    api_url: ' https://api.example.com/v1 ',
    api_key: ' sk-secret ',
    model: ' model-name ',
    updated_at: '2026-01-01T00:00:00.000Z',
  })

  assert.deepEqual(row, {
    url: 'https://api.example.com/v1',
    apiKey: 'sk-secret',
    model: 'model-name',
    updatedAt: '2026-01-01T00:00:00.000Z',
  })

  assert.deepEqual(normalizeLlmSettings({ url: '  ', model: 'gpt' }), {
    url: '',
    apiKey: '',
    model: 'gpt',
    updatedAt: null,
  })
})

test('accepts only http and https LLM URLs', () => {
  assert.equal(isValidLlmUrl('https://api.openai.com/v1'), true)
  assert.equal(isValidLlmUrl('http://localhost:11434/v1'), true)
  assert.equal(isValidLlmUrl('javascript:alert(1)'), false)
  assert.equal(isValidLlmUrl('not a url'), false)
  assert.equal(isValidLlmUrl(''), false)
})

test('validates the required connection fields', () => {
  assert.equal(validateLlmSettings({ url: '', model: '' }), 'Enter the API URL.')
  assert.equal(
    validateLlmSettings({ url: 'ftp://example.com', model: 'gpt' }),
    'Enter a valid http:// or https:// API URL.',
  )
  assert.equal(
    validateLlmSettings({ url: 'https://api.example.com/v1', model: ' ' }),
    'Enter a model name.',
  )
  assert.equal(
    validateLlmSettings({ url: 'https://api.example.com/v1', model: 'gpt-4o-mini' }),
    null,
  )
})
