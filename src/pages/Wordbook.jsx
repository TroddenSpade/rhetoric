import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Toast from '../components/Toast.jsx'
import { categories, entries, findEntry, searchEntries, wordOfTheDay } from '../data/thesaurus.js'
import { lookupWord } from '../lib/wordbook.js'

export default function Wordbook() {
  const [params, setParams] = useSearchParams()
  const wordParam = params.get('word') || ''
  const categoryParam = params.get('category') || 'All'

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(
    categories.some((item) => item.id === categoryParam) ? categoryParam : 'All',
  )
  const [lookupQuery, setLookupQuery] = useState(wordParam)
  const [detail, setDetail] = useState(null)
  const [status, setStatus] = useState(wordParam ? 'loading' : 'idle')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!wordParam) return
    // The list should keep browsing intact when a word is opened from a link
    // or from the list itself; only the detail pane follows the word.
    setLookupQuery(wordParam)
  }, [wordParam])

  useEffect(() => {
    const term = lookupQuery.trim()
    if (!term) {
      setDetail(null)
      setStatus('idle')
      return
    }

    const controller = new AbortController()
    const local = findEntry(term)
    setDetail(local ? { ...local, online: false } : null)
    setStatus('loading')
    lookupWord(term, { signal: controller.signal })
      .then((data) => {
        setDetail(data)
        setStatus('ready')
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return
        setDetail(findEntry(term) ? { ...findEntry(term), notFound: false } : null)
        setStatus('error')
      })

    return () => controller.abort()
  }, [lookupQuery])

  const results = useMemo(() => {
    const base = search.trim() ? searchEntries(search) : entries
    return category === 'All' ? base : base.filter((entry) => entry.category === category)
  }, [search, category])

  const today = wordOfTheDay()
  const shown = detail || findEntry(lookupQuery)

  const updateParams = (next) => {
    const updated = new URLSearchParams(params)
    for (const [key, value] of Object.entries(next)) {
      if (value) updated.set(key, value)
      else updated.delete(key)
    }
    setParams(updated)
  }

  const runLookup = (value) => {
    const term = value.trim()
    if (!term) return
    setLookupQuery(term)
    updateParams({ word: term, category: '' })
  }

  const selectWord = (word) => {
    setLookupQuery(word)
    updateParams({ word, category: '' })
  }

  const selectCategory = (id) => {
    setCategory(id)
    updateParams({ category: id === 'All' ? '' : id, word: '' })
    setLookupQuery('')
    setSearch('')
  }

  const copy = async (value, message) => {
    try {
      await navigator.clipboard.writeText(value)
      setToast(message)
    } catch {
      setToast('Could not access the clipboard.')
    }
  }

  const surprise = () => {
    const pick = entries[Math.floor(Math.random() * entries.length)]
    setSearch('')
    setCategory('All')
    selectWord(pick.word)
  }

  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="page-head__row">
            <div>
              <p className="eyebrow">The wordbook</p>
              <h1>Find the word you mean</h1>
              <p className="lead page-head__lead">
                A curated thesaurus for the words that do the most work — plus live synonyms for
                anything else. Select a word in the studio, or look one up here.
              </p>
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={surprise}>
              <Icon name="spark" size={15} /> Surprise me
            </button>
          </div>

          <form
            className="search wordbook-search"
            onSubmit={(event) => {
              event.preventDefault()
              runLookup(search)
            }}
          >
            <span className="search__icon">
              <Icon name="search" size={18} />
            </span>
            <input
              className="input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Look up a word — precise, persuade, litotes…"
              aria-label="Look up a word"
            />
            <button type="submit" className="btn btn--primary btn--sm">
              Look up
            </button>
          </form>
          <p className="small muted wordbook-hint">
            {search.trim()
              ? `${results.length} local ${results.length === 1 ? 'entry' : 'entries'} match “${search.trim()}”.`
              : `${entries.length} curated entries, available offline. Online lookups add more synonyms.`}
          </p>
        </div>
      </section>

      <div className="container wordbook-layout section-tight">
        <aside className="wordbook-side">
          <div className="wordbook-side__block">
            <p className="wordbook-side__label">Browse by need</p>
            <div className="category-chips">
              <button
                type="button"
                className={`chip ${category === 'All' ? 'is-active' : ''}`}
                onClick={() => selectCategory('All')}
              >
                All
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip ${category === item.id ? 'is-active' : ''}`}
                  onClick={() => selectCategory(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {category !== 'All' && (
              <p className="small muted">
                {categories.find((item) => item.id === category)?.blurb}
              </p>
            )}
          </div>

          <div className="wordbook-side__block">
            <p className="wordbook-side__label">Words</p>
            <ul className="word-list">
              {results.map((entry) => (
                <li key={entry.word}>
                  <button
                    type="button"
                    className={`word-list__item ${lookupQuery === entry.word ? 'is-active' : ''}`}
                    onClick={() => selectWord(entry.word)}
                  >
                    <span>{entry.word}</span>
                    <span className="word-list__pos">{entry.pos}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="empty-state">
                  No local entry. Press <strong>Look up</strong> to search online.
                </li>
              )}
            </ul>
          </div>

          <div className="wordbook-side__block wordbook-side__day">
            <p className="wordbook-side__label">Word of the day</p>
            <button type="button" className="word-day-link" onClick={() => selectWord(today.word)}>
              <strong>{today.word}</strong>
              <span>{today.gloss}</span>
            </button>
          </div>
        </aside>

        <article className="word-detail card">
          {status === 'loading' && !shown && (
            <div className="empty-state">
              <span className="empty-state__mark">
                <Icon name="search" size={18} />
              </span>
              Looking up “{lookupQuery}”…
            </div>
          )}

          {status === 'loading' && shown && (
            <p className="small muted word-detail__status">Looking for more synonyms…</p>
          )}

          {shown ? (
            <>
              <header className="word-detail__head">
                <div>
                  <div className="word-detail__title">
                    <h2>{shown.word}</h2>
                    <span className="tag tag--gold">{shown.pos || 'word'}</span>
                    {shown.category && <span className="tag">{shown.category}</span>}
                  </div>
                  <p className="word-detail__gloss">
                    {shown.gloss || 'No definition found for this word yet.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn--quiet btn--sm"
                  onClick={() => copy(shown.word, `Copied “${shown.word}”.`)}
                >
                  <Icon name="copy" size={14} /> Copy
                </button>
              </header>

              {shown.example && <p className="word-detail__example">“{shown.example}”</p>}

              <div className="word-detail__section">
                <div className="word-detail__section-head">
                  <h3>Synonyms</h3>
                  {shown.synonyms?.length > 0 && (
                    <button
                      type="button"
                      className="text-link as-button"
                      onClick={() =>
                        copy(shown.synonyms.join(', '), 'Synonyms copied to the clipboard.')
                      }
                    >
                      <Icon name="copy" size={13} /> Copy all
                    </button>
                  )}
                </div>
                {shown.synonyms?.length ? (
                  <div className="chip-row chip-row--wrap">
                    {shown.synonyms.map((synonym) => (
                      <button
                        key={synonym}
                        type="button"
                        className="chip chip--word"
                        onClick={() =>
                          copy(synonym, `Copied “${synonym}”. Select a word in the studio to swap it in.`)
                        }
                        title={`Copy ${synonym}`}
                      >
                        {synonym}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="muted small">No synonyms found.</p>
                )}
              </div>

              {shown.antonyms?.length > 0 && (
                <div className="word-detail__section">
                  <h3>Antonyms</h3>
                  <div className="chip-row chip-row--wrap">
                    {shown.antonyms.map((antonym) => (
                      <span key={antonym} className="tag">
                        {antonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="word-detail__meta">
                <span>
                  {shown.online ? (
                    <>
                      <Icon name="check" size={13} /> Enriched by Datamuse
                    </>
                  ) : (
                    <>
                      <Icon name="book" size={13} /> From the local wordbook
                    </>
                  )}
                </span>
                {shown.unavailable && <span>Network unavailable — offline entries still work.</span>}
              </div>

              <div className="word-detail__actions">
                <Link className="btn btn--primary btn--sm" to="/write">
                  Open the studio <Icon name="arrow" size={14} />
                </Link>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => copy(shown.synonyms?.join(', ') || shown.word, 'Copied.')}
                >
                  <Icon name="copy" size={14} /> Copy the list
                </button>
              </div>
            </>
          ) : (
            status !== 'loading' && (
              <div className="empty-state">
                <span className="empty-state__mark">
                  <Icon name="book" size={18} />
                </span>
                <p>
                  {lookupQuery
                    ? `No entry for “${lookupQuery}” yet. Try another spelling, or a broader word.`
                    : 'Choose a word from the list, or search for one above.'}
                </p>
                <Link className="text-link" to="/write?tab=words">
                  Or find a synonym from your draft <Icon name="arrow" size={14} />
                </Link>
              </div>
            )
          )}
        </article>
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </>
  )
}
