const MAX_URL_LENGTH = 2048
const MAX_MODEL_LENGTH = 120
const MAX_KEY_LENGTH = 4096

/** A short, safe preview of a stored key. Never returns the whole key. */
export function maskApiKey(value) {
  const key = typeof value === 'string' ? value.trim() : ''
  if (!key) return ''
  if (key.length <= 4) return '••••'
  return `••••${key.slice(-4)}`
}

export function isValidLlmUrl(value) {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  if (!trimmed) return false
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Accepts either the Supabase row shape or the form shape and returns the
 * camel-cased settings the account provider works with.
 */
export function normalizeLlmSettings(value) {
  const source = value && typeof value === 'object' ? value : {}
  const url = source.api_url ?? source.url ?? ''
  const apiKey = source.api_key ?? source.apiKey ?? ''
  const model = source.model ?? ''

  return {
    url: String(url).trim().slice(0, MAX_URL_LENGTH),
    apiKey: String(apiKey).trim().slice(0, MAX_KEY_LENGTH),
    model: String(model).trim().slice(0, MAX_MODEL_LENGTH),
    updatedAt: source.updated_at ?? source.updatedAt ?? null,
  }
}

/** Returns a human-readable error, or null when the form is valid. */
export function validateLlmSettings({ url, model }) {
  if (!String(url ?? '').trim()) return 'Enter the API URL.'
  if (!isValidLlmUrl(url)) return 'Enter a valid http:// or https:// API URL.'
  if (!String(model ?? '').trim()) return 'Enter a model name.'
  if (String(model).trim().length > MAX_MODEL_LENGTH) return 'The model name is too long.'
  return null
}
