import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadSupabase, supabaseConfigured } from './supabase.js'
import {
  applyLocalProgress,
  normalizeProgress,
  readLocalProgress,
} from './progress.js'
import { normalizeLlmSettings, validateLlmSettings } from './llm.js'

const AccountContext = createContext(null)
const TABLE = 'rhetoric_progress'
const LLM_TABLE = 'rhetoric_llm_settings'

function accountRedirectUrl() {
  if (typeof window === 'undefined') return undefined
  return `${window.location.origin}${import.meta.env.BASE_URL}account`
}

function readableError(error) {
  const message = error?.message || String(error || '')
  if (/Could not find the table|relation .* does not exist|PGRST205/i.test(message)) {
    return 'Sync storage is not set up yet. Run supabase/schema.sql in the Supabase SQL editor, then try again.'
  }
  if (/Failed to fetch|NetworkError|Load failed|fetch failed|network/i.test(message)) {
    return 'Could not reach the sync server. Your work is still safe on this device; check your connection and try again.'
  }
  if (/Expected 3 parts in JWT|Invalid JWT|JWT expired|invalid claim/i.test(message)) {
    return 'The sign-in session has expired. Sign out, then request a new email link.'
  }
  if (/rate limit|too many requests/i.test(message)) {
    return 'Too many sign-in attempts. Wait a minute, then ask for another link.'
  }
  return message || 'Something went wrong. Your work is still safe on this device.'
}

function offline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

export function AccountProvider({ children }) {
  const [client, setClient] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(supabaseConfigured)
  const [operation, setOperation] = useState('idle')
  const [error, setError] = useState(null)
  const [remote, setRemote] = useState(null)
  const [remoteLoading, setRemoteLoading] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState(null)
  const [llm, setLlm] = useState(null)
  const [llmLoading, setLlmLoading] = useState(false)
  const [llmOperation, setLlmOperation] = useState('idle')
  const [llmError, setLlmError] = useState(null)

  // Sync is optional. Load the client only when this build has credentials.
  useEffect(() => {
    let active = true
    let subscription = null

    async function start() {
      if (!supabaseConfigured) {
        setLoading(false)
        return
      }

      const loaded = await loadSupabase()
      if (!active) return

      if (!loaded) {
        setLoading(false)
        setError('Cross-device sync could not start in this browser.')
        return
      }

      setClient(loaded)

      const { data: listener } = loaded.auth.onAuthStateChange((_event, next) => {
        if (!active) return
        setSession(next)
        setLoading(false)
        setError(null)
        if (!next) {
          setRemote(null)
          setLastSyncedAt(null)
          setLlm(null)
          setLlmError(null)
          setLlmOperation('idle')
        }
      })
      subscription = listener?.subscription ?? null

      try {
        const { data } = await loaded.auth.getSession()
        if (!active) return
        setSession(data.session ?? null)
      } catch {
        if (active) setError('Could not check the saved sign-in session.')
      } finally {
        if (active) setLoading(false)
      }
    }

    start()

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  const refreshRemote = useCallback(async () => {
    if (!client || !session?.user) {
      setRemote(null)
      return null
    }

    setRemoteLoading(true)
    try {
      const { data, error: selectError } = await client
        .from(TABLE)
        .select('data, updated_at')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (selectError) throw selectError
      if (!data) {
        setRemote(null)
        return null
      }

      const record = {
        progress: normalizeProgress(data.data),
        updatedAt: data.updated_at || new Date().toISOString(),
      }
      setRemote(record)
      setError(null)
      return record
    } catch (caught) {
      setError(readableError(caught))
      return null
    } finally {
      setRemoteLoading(false)
    }
  }, [client, session])

  const refreshLlm = useCallback(async () => {
    if (!client || !session?.user) {
      setLlm(null)
      return null
    }

    setLlmLoading(true)
    try {
      const { data, error: selectError } = await client
        .from(LLM_TABLE)
        .select('api_url, api_key, model, updated_at')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (selectError) throw selectError
      const settings = data ? normalizeLlmSettings(data) : null
      setLlm(settings)
      setLlmError(null)
      return settings
    } catch (caught) {
      setLlmError(readableError(caught))
      return null
    } finally {
      setLlmLoading(false)
    }
  }, [client, session])

  useEffect(() => {
    if (!session) {
      setRemote(null)
      setLlm(null)
      setLlmError(null)
      return
    }
    void refreshRemote()
    void refreshLlm()
  }, [session, refreshRemote, refreshLlm])

  const signIn = useCallback(
    async (email) => {
      if (!supabaseConfigured) {
        return { ok: false, error: 'Cross-device sync is not configured in this build.' }
      }
      const address = email?.trim()
      if (!address) return { ok: false, error: 'Enter an email address first.' }
      if (offline()) {
        return { ok: false, error: 'Connect to the internet to request a sign-in link.' }
      }

      const activeClient = client || (await loadSupabase())
      if (!activeClient) {
        return { ok: false, error: 'Cross-device sync could not start in this browser.' }
      }

      setError(null)
      try {
        const { error: authError } = await activeClient.auth.signInWithOtp({
          email: address,
          options: {
            emailRedirectTo: accountRedirectUrl(),
            shouldCreateUser: true,
          },
        })
        if (authError) throw authError
        return { ok: true }
      } catch (caught) {
        return { ok: false, error: readableError(caught) }
      }
    },
    [client],
  )

  const signOut = useCallback(async () => {
    const activeClient = client || (await loadSupabase())
    if (activeClient) {
      await activeClient.auth.signOut().catch(() => {})
    }
    setSession(null)
    setRemote(null)
    setLastSyncedAt(null)
    setLlm(null)
    setLlmError(null)
    setLlmOperation('idle')
    setError(null)
    setOperation('idle')
  }, [client])

  const saveProgress = useCallback(async () => {
    if (!client || !session?.user) {
      return { ok: false, error: 'Sign in before saving to your account.' }
    }
    if (offline()) {
      return {
        ok: false,
        error: 'You are offline. This draft stays on the device and can be saved when you reconnect.',
      }
    }

    setOperation('saving')
    setError(null)
    const savedAt = new Date().toISOString()
    const progress = normalizeProgress(readLocalProgress())
    const document = { ...progress, savedAt }

    try {
      const { error: saveError } = await client.from(TABLE).upsert(
        {
          user_id: session.user.id,
          data: document,
          updated_at: savedAt,
        },
        { onConflict: 'user_id' },
      )
      if (saveError) throw saveError

      setRemote({ progress, updatedAt: savedAt })
      setLastSyncedAt(savedAt)
      setOperation('idle')
      return { ok: true, savedAt }
    } catch (caught) {
      const message = readableError(caught)
      setError(message)
      setOperation('idle')
      return { ok: false, error: message }
    }
  }, [client, session])

  const fetchProgress = useCallback(async () => {
    if (!client || !session?.user) {
      return { ok: false, error: 'Sign in before loading an account copy.' }
    }
    if (offline()) {
      return { ok: false, error: 'You are offline. Reconnect, then load the account copy.' }
    }

    setOperation('fetching')
    setError(null)

    try {
      const { data, error: selectError } = await client
        .from(TABLE)
        .select('data, updated_at')
        .eq('user_id', session.user.id)
        .maybeSingle()
      if (selectError) throw selectError
      if (!data) {
        setOperation('idle')
        return { ok: false, error: 'There is no account copy yet. Save this device first.' }
      }

      const applied = applyLocalProgress(data.data)
      if (!applied.ok) {
        setOperation('idle')
        setError(applied.error)
        return { ok: false, error: applied.error }
      }

      const updatedAt = data.updated_at || new Date().toISOString()
      setRemote({ progress: applied.progress, updatedAt })
      setLastSyncedAt(new Date().toISOString())
      setOperation('idle')
      return { ok: true, progress: applied.progress, updatedAt }
    } catch (caught) {
      const message = readableError(caught)
      setError(message)
      setOperation('idle')
      return { ok: false, error: message }
    }
  }, [client, session])

  const deleteRemote = useCallback(async () => {
    if (!client || !session?.user) {
      return { ok: false, error: 'Sign in first.' }
    }
    if (offline()) {
      return { ok: false, error: 'You are offline. Reconnect to delete the saved copy.' }
    }

    setOperation('deleting')
    setError(null)
    try {
      const { error: deleteError } = await client
        .from(TABLE)
        .delete()
        .eq('user_id', session.user.id)
      if (deleteError) throw deleteError
      setRemote(null)
      setLastSyncedAt(null)
      setOperation('idle')
      return { ok: true }
    } catch (caught) {
      const message = readableError(caught)
      setError(message)
      setOperation('idle')
      return { ok: false, error: message }
    }
  }, [client, session])

  const saveLlm = useCallback(
    async ({ url, apiKey, model }) => {
      if (!client || !session?.user) {
        return { ok: false, error: 'Sign in before saving an LLM connection.' }
      }
      if (offline()) {
        return { ok: false, error: 'You are offline. Reconnect to save the connection.' }
      }

      const settings = normalizeLlmSettings({
        url,
        apiKey: apiKey?.trim() ? apiKey : llm?.apiKey || '',
        model,
      })
      const validationError = validateLlmSettings(settings)
      if (validationError) return { ok: false, error: validationError }

      setLlmOperation('saving')
      setLlmError(null)
      const savedAt = new Date().toISOString()

      try {
        const { error: saveError } = await client.from(LLM_TABLE).upsert(
          {
            user_id: session.user.id,
            api_url: settings.url,
            api_key: settings.apiKey,
            model: settings.model,
            updated_at: savedAt,
          },
          { onConflict: 'user_id' },
        )
        if (saveError) throw saveError

        setLlm({ ...settings, updatedAt: savedAt })
        setLlmOperation('idle')
        return { ok: true, settings }
      } catch (caught) {
        const message = readableError(caught)
        setLlmError(message)
        setLlmOperation('idle')
        return { ok: false, error: message }
      }
    },
    [client, session, llm],
  )

  const deleteLlm = useCallback(async () => {
    if (!client || !session?.user) {
      return { ok: false, error: 'Sign in first.' }
    }
    if (offline()) {
      return { ok: false, error: 'You are offline. Reconnect to remove the connection.' }
    }

    setLlmOperation('removing')
    setLlmError(null)
    try {
      const { error: deleteError } = await client
        .from(LLM_TABLE)
        .delete()
        .eq('user_id', session.user.id)
      if (deleteError) throw deleteError
      setLlm(null)
      setLlmOperation('idle')
      return { ok: true }
    } catch (caught) {
      const message = readableError(caught)
      setLlmError(message)
      setLlmOperation('idle')
      return { ok: false, error: message }
    }
  }, [client, session])

  const value = useMemo(
    () => ({
      configured: supabaseConfigured,
      authState: !supabaseConfigured
        ? 'disabled'
        : loading
          ? 'loading'
          : session
            ? 'signed-in'
            : 'signed-out',
      email: session?.user?.email ?? null,
      error,
      operation,
      remote,
      remoteLoading,
      lastSyncedAt,
      llm,
      llmLoading,
      llmOperation,
      llmError,
      signIn,
      signOut,
      saveProgress,
      fetchProgress,
      deleteRemote,
      refreshRemote,
      saveLlm,
      deleteLlm,
      refreshLlm,
    }),
    [
      loading,
      session,
      error,
      operation,
      remote,
      remoteLoading,
      lastSyncedAt,
      llm,
      llmLoading,
      llmOperation,
      llmError,
      signIn,
      signOut,
      saveProgress,
      fetchProgress,
      deleteRemote,
      refreshRemote,
      saveLlm,
      deleteLlm,
      refreshLlm,
    ],
  )

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const value = useContext(AccountContext)
  if (!value) throw new Error('useAccount must be used inside AccountProvider')
  return value
}
