import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Toast from '../components/Toast.jsx'
import { useAccount } from '../lib/account.jsx'
import { maskApiKey, validateLlmSettings } from '../lib/llm.js'
import {
  progressFingerprint,
  readLocalProgress,
  summarizeProgress,
} from '../lib/progress.js'

function formatDate(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function SummaryStats({ summary }) {
  return (
    <dl className="account-stats">
      <div>
        <dt>Words</dt>
        <dd>{summary.words.toLocaleString()}</dd>
      </div>
      <div>
        <dt>Checks</dt>
        <dd>{summary.checklists}</dd>
      </div>
      <div>
        <dt>Practice</dt>
        <dd>{summary.sessions}</dd>
      </div>
      <div>
        <dt>Accuracy</dt>
        <dd>{summary.accuracy}%</dd>
      </div>
    </dl>
  )
}

export default function Account() {
  const {
    configured,
    authState,
    email,
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
    saveLlm,
    deleteLlm,
    refreshLlm,
  } = useAccount()

  const [address, setAddress] = useState('')
  const [busy, setBusy] = useState(false)
  const [formNotice, setFormNotice] = useState(null)
  const [toast, setToast] = useState('')
  const [revision, setRevision] = useState(0)
  const [confirmFetch, setConfirmFetch] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [llmUrl, setLlmUrl] = useState('')
  const [llmModel, setLlmModel] = useState('')
  const [llmApiKey, setLlmApiKey] = useState('')
  const [llmNotice, setLlmNotice] = useState(null)
  const [confirmRemoveLlm, setConfirmRemoveLlm] = useState(false)

  const local = useMemo(() => readLocalProgress(), [revision])
  const localSummary = useMemo(() => summarizeProgress(local), [local])
  const remoteSummary = useMemo(
    () => (remote ? summarizeProgress(remote.progress) : null),
    [remote],
  )
  const inSync = Boolean(remote) && progressFingerprint(local) === progressFingerprint(remote.progress)
  const signedIn = authState === 'signed-in'
  const remoteDate = formatDate(remote?.updatedAt)
  const syncedDate = formatDate(lastSyncedAt)

  // A fetched account copy writes local storage directly; keep the summaries
  // fresh when that happens, or when another tab edits a draft.
  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1)
    const onStorage = (event) => {
      if (event.type === 'storage' || event.detail?.key?.startsWith('rhetoric:')) refresh()
    }
    window.addEventListener('rhetoric:storage', onStorage)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('rhetoric:storage', onStorage)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  // Keep the connection form in step with the account row without putting the
  // saved API key back into the DOM.
  useEffect(() => {
    setLlmUrl(llm?.url || '')
    setLlmModel(llm?.model || '')
    setLlmApiKey('')
  }, [llm])

  const status = (() => {
    if (!configured) return { tone: 'muted', label: 'Local only' }
    if (authState === 'loading') return { tone: 'busy', label: 'Checking session' }
    if (!signedIn) return { tone: 'muted', label: 'Local only' }
    if (operation === 'saving') return { tone: 'busy', label: 'Saving' }
    if (operation === 'fetching') return { tone: 'busy', label: 'Loading account copy' }
    if (operation === 'deleting') return { tone: 'busy', label: 'Deleting account copy' }
    if (error) return { tone: 'error', label: 'Connection issue' }
    if (remoteLoading) return { tone: 'busy', label: 'Checking account' }
    if (!remote) return { tone: 'warn', label: 'Not saved yet' }
    if (inSync) return { tone: 'ok', label: 'In sync' }
    return { tone: 'warn', label: 'Local changes' }
  })()

  const handleSignIn = async (event) => {
    event.preventDefault()
    if (!address.trim()) return
    setBusy(true)
    setFormNotice(null)
    const result = await signIn(address)
    setBusy(false)
    setFormNotice(
      result.ok
        ? {
            tone: 'ok',
            text: `Check ${address.trim()} for a sign-in link. It may take a minute to arrive.`,
          }
        : { tone: 'error', text: result.error || 'Could not send the sign-in link.' },
    )
  }

  const handleSave = async () => {
    const result = await saveProgress()
    if (result.ok) {
      setRevision((value) => value + 1)
      setToast('Progress saved to your account.')
    } else {
      setToast(result.error || 'Could not save to the account.')
    }
  }

  const handleFetch = async () => {
    const result = await fetchProgress()
    setConfirmFetch(false)
    if (result.ok) {
      setRevision((value) => value + 1)
      setToast('Account copy loaded onto this device.')
    } else {
      setToast(result.error || 'Could not load the account copy.')
    }
  }

  const handleDelete = async () => {
    const result = await deleteRemote()
    setConfirmDelete(false)
    if (result.ok) {
      setToast('Saved copy deleted. This device still has your progress.')
    } else {
      setToast(result.error || 'Could not delete the saved copy.')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setConfirmFetch(false)
    setConfirmDelete(false)
    setConfirmRemoveLlm(false)
    setLlmNotice(null)
    setToast('Signed out. Your progress stays on this device.')
  }

  const handleSaveLlm = async (event) => {
    event.preventDefault()
    setConfirmRemoveLlm(false)
    const validationError = validateLlmSettings({ url: llmUrl, model: llmModel })
    if (validationError) {
      setLlmNotice({ tone: 'error', text: validationError })
      return
    }

    const keepsSavedKey = !llmApiKey.trim() && Boolean(llm?.apiKey)
    const result = await saveLlm({ url: llmUrl, apiKey: llmApiKey, model: llmModel })
    if (result.ok) {
      setLlmApiKey('')
      setLlmNotice({
        tone: 'ok',
        text: keepsSavedKey
          ? 'Connection updated. Your saved API key was kept.'
          : 'Connection saved to your account.',
      })
      setToast('LLM connection saved to your account.')
    } else {
      setLlmNotice({ tone: 'error', text: result.error || 'Could not save the connection.' })
    }
  }

  const handleRemoveLlm = async () => {
    const result = await deleteLlm()
    setConfirmRemoveLlm(false)
    if (result.ok) {
      setLlmNotice({ tone: 'ok', text: 'LLM connection removed from your account.' })
      setToast('LLM connection removed.')
    } else {
      setLlmNotice({ tone: 'error', text: result.error || 'Could not remove the connection.' })
    }
  }

  const handleRetryLlm = async () => {
    setLlmNotice(null)
    await refreshLlm()
  }

  return (
    <>
      <section className="page-head account-head">
        <div className="container">
          <div className="page-head__row">
            <div>
              <p className="eyebrow">Account</p>
              <h1>Carry your progress</h1>
              <p className="lead page-head__lead">
                Rhetoric is local-first: the studio works without an account and without a
                network. Sign in with an email link to keep a copy of your draft and practice
                record, then fetch it on another device.
              </p>
            </div>
            <span className={`account-pill account-pill--${status.tone}`}>
              <span className="account-pill__dot" />
              {status.label}
            </span>
          </div>
        </div>
      </section>

      <div className="container account-layout section-tight">
        <div className="account-main">
          {!configured ? (
            <section className="account-panel card">
              <p className="eyebrow">Sync is off in this build</p>
              <h2>Local-first by default.</h2>
              <p>
                Your draft and practice record still live on this device, and every writing tool
                keeps working offline. To enable email sign-in, set{' '}
                <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> before
                building. The README has the exact Supabase setup steps.
              </p>
              <p className="small muted">
                Nothing is lost by waiting: local progress is already saved in this browser.
              </p>
            </section>
          ) : authState === 'loading' ? (
            <section className="account-panel card">
              <p className="eyebrow">Account</p>
              <h2>Checking your session…</h2>
              <p className="small muted">This will only take a moment.</p>
            </section>
          ) : !signedIn ? (
            <section className="account-panel card">
              <div className="account-panel__head">
                <div>
                  <p className="eyebrow">Email sign-in</p>
                  <h2>No password. Just a link.</h2>
                </div>
                <span className="account-panel__mark">
                  <Icon name="cloud" size={26} />
                </span>
              </div>
              <p>
                Enter the email you want to use. Supabase sends a one-time sign-in link; opening
                it brings you back here, signed in. There is no password to remember.
              </p>
              <form className="account-form" onSubmit={handleSignIn}>
                <div className="field">
                  <label htmlFor="account-email">Email address</label>
                  <input
                    id="account-email"
                    className="input"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                  />
                </div>
                <button className="btn btn--primary" type="submit" disabled={busy}>
                  <Icon name={busy ? 'refresh' : 'arrow'} size={15} />
                  {busy ? 'Sending…' : 'Email me a sign-in link'}
                </button>
              </form>
              {formNotice && (
                <p
                  className={`account-message account-message--${formNotice.tone}`}
                  role={formNotice.tone === 'error' ? 'alert' : 'status'}
                >
                  {formNotice.text}
                </p>
              )}
              <p className="account-note">
                <Icon name="info" size={14} /> The link returns to this site. If it does not
                arrive, check spam or ask for another one in a minute.
              </p>
            </section>
          ) : (
            <section className="account-panel card">
              <div className="account-identity">
                <span className="account-avatar">
                  <Icon name="user" size={22} />
                </span>
                <div>
                  <p className="eyebrow">Signed in</p>
                  <h2>{email}</h2>
                  <p className="small muted">
                    {syncedDate
                      ? `Last synced ${syncedDate}.`
                      : remoteDate
                        ? `Account copy last saved ${remoteDate}.`
                        : 'No copy saved to the account yet.'}
                  </p>
                </div>
                <span className={`account-pill account-pill--${status.tone}`}>
                  <span className="account-pill__dot" />
                  {status.label}
                </span>
              </div>

              <div className="account-actions">
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={handleSave}
                  disabled={operation === 'saving'}
                >
                  <Icon name="upload" size={15} />
                  {operation === 'saving' ? 'Saving…' : 'Save to account'}
                </button>
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => setConfirmFetch(true)}
                  disabled={!remote || inSync || operation === 'fetching'}
                >
                  <Icon name="download" size={15} />
                  Load account copy
                </button>
                <button className="btn btn--quiet" type="button" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>

              {confirmFetch && remote && (
                <div className="account-confirm" role="alert">
                  <p>
                    <strong>Replace this device’s progress?</strong> The draft, checklist and
                    practice record here will be overwritten by the account copy from{' '}
                    {remoteDate || 'your account'}.
                  </p>
                  <div className="account-actions">
                    <button
                      className="btn btn--primary btn--sm"
                      type="button"
                      onClick={handleFetch}
                      disabled={operation === 'fetching'}
                    >
                      {operation === 'fetching' ? 'Loading…' : 'Replace with account copy'}
                    </button>
                    <button
                      className="btn btn--quiet btn--sm"
                      type="button"
                      onClick={() => setConfirmFetch(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <p className="account-message account-message--error" role="alert">
                  {error}
                </p>
              )}
            </section>
          )}

          {signedIn && (
            <section className="account-panel account-llm card">
              <div className="account-panel__head">
                <div>
                  <p className="eyebrow">LLM connection</p>
                  <h2>Bring your own model</h2>
                </div>
                <span
                  className={`account-pill account-pill--${
                    llmLoading ? 'busy' : llm ? 'ok' : 'muted'
                  }`}
                >
                  <span className="account-pill__dot" />
                  {llmLoading ? 'Checking' : llm ? 'Saved' : 'Not set'}
                </span>
              </div>
              <p className="account-llm__intro">
                Save an OpenAI-compatible endpoint for LLM-assisted writing. The connection
                belongs to your account and is available on every device you sign in to.
              </p>

              <form className="account-llm__form" onSubmit={handleSaveLlm}>
                <div className="field field--wide">
                  <label htmlFor="llm-url">API URL</label>
                  <input
                    id="llm-url"
                    className="input"
                    type="url"
                    inputMode="url"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="https://api.openai.com/v1"
                    value={llmUrl}
                    onChange={(event) => setLlmUrl(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="llm-model">Model</label>
                  <input
                    id="llm-model"
                    className="input"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="gpt-4o-mini"
                    value={llmModel}
                    onChange={(event) => setLlmModel(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="llm-key">API key</label>
                  <input
                    id="llm-key"
                    className="input"
                    type="password"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder={
                      llm?.apiKey ? 'Leave blank to keep the saved key' : 'Optional for local endpoints'
                    }
                    value={llmApiKey}
                    onChange={(event) => setLlmApiKey(event.target.value)}
                  />
                  {llm?.apiKey && (
                    <p className="account-llm__hint">
                      Saved key {maskApiKey(llm.apiKey)}. Leave blank to keep it.
                    </p>
                  )}
                </div>
                <div className="account-llm__foot">
                  <button
                    className="btn btn--primary"
                    type="submit"
                    disabled={llmOperation === 'saving'}
                  >
                    <Icon name="upload" size={15} />
                    {llmOperation === 'saving' ? 'Saving…' : 'Save connection'}
                  </button>
                  {llm && !confirmRemoveLlm && (
                    <button
                      className="btn btn--quiet"
                      type="button"
                      onClick={() => setConfirmRemoveLlm(true)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </form>

              {confirmRemoveLlm && (
                <div className="account-confirm" role="alert">
                  <p>
                    <strong>Remove this LLM connection?</strong> The saved URL, model and API key
                    will be deleted from your account. Your writing progress is not affected.
                  </p>
                  <div className="account-actions">
                    <button
                      className="btn btn--danger btn--sm"
                      type="button"
                      onClick={handleRemoveLlm}
                      disabled={llmOperation === 'removing'}
                    >
                      {llmOperation === 'removing' ? 'Removing…' : 'Yes, remove it'}
                    </button>
                    <button
                      className="btn btn--quiet btn--sm"
                      type="button"
                      onClick={() => setConfirmRemoveLlm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {llmNotice && (
                <p
                  className={`account-message account-message--${llmNotice.tone}`}
                  role={llmNotice.tone === 'error' ? 'alert' : 'status'}
                >
                  {llmNotice.text}
                </p>
              )}

              {llmError && (
                <div className="account-llm__error" role="alert">
                  <p className="account-message account-message--error">{llmError}</p>
                  <button
                    className="btn btn--quiet btn--sm"
                    type="button"
                    onClick={handleRetryLlm}
                  >
                    Retry
                  </button>
                </div>
              )}

              <p className="account-note">
                <Icon name="info" size={14} /> The key is stored in your account, not in this
                device’s local draft. Use a key with only the permissions the connection needs.
              </p>
            </section>
          )}

          <div className="account-snapshots">
            <article className="account-snapshot card">
              <div className="account-snapshot__head">
                <div>
                  <p className="eyebrow">This device</p>
                  <h2 className="account-snapshot__title">{localSummary.title}</h2>
                </div>
                <span className="tag">Local</span>
              </div>
              <p className="account-snapshot__lede">
                {localSummary.words
                  ? `${localSummary.words.toLocaleString()} words in the current draft.`
                  : 'The studio is empty on this device.'}
              </p>
              <SummaryStats summary={localSummary} />
              <p className="account-snapshot__stamp">
                {localSummary.sessions
                  ? `Last practice ${formatDate(localSummary.lastAt) || 'recently'}.`
                  : 'No practice sessions yet.'}
              </p>
            </article>

            <article className="account-snapshot card">
              <div className="account-snapshot__head">
                <div>
                  <p className="eyebrow">Your account</p>
                  <h2 className="account-snapshot__title">
                    {remoteSummary ? remoteSummary.title : 'No saved copy'}
                  </h2>
                </div>
                <span className={`tag ${remote ? 'tag--gold' : ''}`}>
                  {remoteLoading ? 'Checking' : remote ? 'Saved' : 'Empty'}
                </span>
              </div>
              {remote && remoteSummary ? (
                <>
                  <p className="account-snapshot__lede">
                    {remoteSummary.words
                      ? `${remoteSummary.words.toLocaleString()} words in the saved draft.`
                      : 'The saved draft is empty.'}
                  </p>
                  <SummaryStats summary={remoteSummary} />
                  <p className="account-snapshot__stamp">
                    {remoteDate ? `Saved ${remoteDate}.` : 'Saved to the account.'}
                    {inSync ? ' This device matches it.' : ''}
                  </p>
                </>
              ) : (
                <div className="account-empty">
                  <span className="account-empty__mark">
                    <Icon name="cloud" size={22} />
                  </span>
                  <p>
                    {signedIn
                      ? 'Use “Save to account” to start a copy.'
                      : 'Sign in to see the copy saved to your account.'}
                  </p>
                  {!signedIn && (
                    <p className="small muted">
                      Your local draft is already here and keeps working without an account.
                    </p>
                  )}
                </div>
              )}
            </article>
          </div>

          {signedIn && remote && (
            <section className="account-danger card">
              <div>
                <p className="eyebrow">Saved copy</p>
                <h3>Delete the account copy</h3>
                <p className="small muted">
                  This removes the copy in Supabase. The draft and practice record on this device
                  stay exactly where they are.
                </p>
              </div>
              {confirmDelete ? (
                <div className="account-actions">
                  <button
                    className="btn btn--danger btn--sm"
                    type="button"
                    onClick={handleDelete}
                    disabled={operation === 'deleting'}
                  >
                    {operation === 'deleting' ? 'Deleting…' : 'Yes, delete it'}
                  </button>
                  <button
                    className="btn btn--quiet btn--sm"
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn--ghost btn--sm btn--danger"
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Icon name="trash" size={14} /> Delete saved copy
                </button>
              )}
            </section>
          )}

          <p className="account-back">
            <Link className="text-link" to="/write">
              Return to the studio <Icon name="arrow" size={14} />
            </Link>
          </p>
        </div>

        <aside className="account-aside">
          <article className="how-card card">
            <p className="eyebrow">What travels</p>
            <ul className="how-list">
              <li>
                <strong>The studio.</strong> Draft text, title, blueprint, ignored spellings and
                checklist ticks.
              </li>
              <li>
                <strong>The practice record.</strong> Session scores, accuracy and the best set.
              </li>
              <li>
                <strong>The LLM connection.</strong> Endpoint URL, model and API key stay with
                your account, not in local progress.
              </li>
              <li>
                <strong>Not your preferences.</strong> Theme and install settings stay on this
                device.
              </li>
            </ul>
          </article>

          <article className="how-card card">
            <p className="eyebrow">Local first</p>
            <p>
              The editor never waits for the network. Saving to your account is a deliberate
              copy, and loading the account copy asks before it replaces the draft on this
              device.
            </p>
            <p className="small muted account-privacy">
              <Icon name="info" size={14} /> The public Supabase key can only reach the signed-in
              user’s own row; row-level security protects both account tables.
            </p>
          </article>
        </aside>
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </>
  )
}
