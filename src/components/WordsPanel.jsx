import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { findEntry } from '../data/thesaurus.js'
import { isSingleWord, truncate } from '../lib/text.js'

function WordSkeleton() {
  return (
    <div className="word-skeleton" aria-hidden="true">
      <span style={{ width: '38%' }} />
      <span style={{ width: '82%' }} />
      <span style={{ width: '64%' }} />
      <div className="word-skeleton__chips">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

export default function WordsPanel({
  query,
  setQuery,
  lookup,
  lookupState,
  selection,
  onApply,
  onFocusWord,
  repeated,
  vague,
}) {
  const selectedWord = selection.text.trim()
  const hasSelection = selectedWord && isSingleWord(selectedWord)
  const queryIsWord = query.trim() && isSingleWord(query)
  // Show a curated entry immediately; online lookups only add to it. This
  // keeps the panel instant when the network is slow or unavailable.
  const local = queryIsWord ? findEntry(query) : null
  const shown =
    (lookupState === 'ready' ? lookup : null) ||
    (local ? { ...local, online: false } : null)
  const enriching = lookupState === 'loading' && Boolean(shown)

  return (
    <div className="panel-body words-panel">
      <div className="panel-intro">
        <h3>Find a better word</h3>
        <p>
          Select a word in the draft, then choose a replacement. Without a selection, a synonym is
          copied to the clipboard instead.
        </p>
      </div>

      <div className="search words-search">
        <span className="search__icon">
          <Icon name="search" size={17} />
        </span>
        <input
          className="input"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="A word to look up…"
          aria-label="Look up a word for synonyms"
        />
      </div>

      {hasSelection ? (
        <p className="selection-note">
          <Icon name="target" size={14} />
          <span>
            Selected: <strong>{selectedWord}</strong>
          </span>
        </p>
      ) : (
        <p className="selection-note selection-note--muted">
          <Icon name="info" size={14} />
          <span>No word selected — choosing a synonym will copy it.</span>
        </p>
      )}

      {queryIsWord && lookupState === 'loading' && !shown && <WordSkeleton />}

      {enriching && (
        <p className="inline-note">
          <Icon name="refresh" size={13} />
          <span>Looking for more synonyms…</span>
        </p>
      )}

      {shown && (
        <div className="word-card">
          <div className="word-card__head">
            <div>
              <h4>{shown.word}</h4>
              <p className="word-card__pos">
                {shown.pos || 'word'}
                {shown.category ? ` · ${shown.category}` : ''}
              </p>
            </div>
            {shown.online && (
              <span className="word-card__online" title="Enriched by Datamuse">
                <Icon name="check" size={12} /> online
              </span>
            )}
          </div>
          {shown.gloss && <p className="word-card__gloss">{shown.gloss}</p>}

          <p className="word-card__label">Synonyms</p>
          {shown.synonyms?.length ? (
            <div className="syn-chips">
              {shown.synonyms.map((synonym) => (
                <button
                  key={synonym}
                  type="button"
                  className="syn-chip"
                  onClick={() => onApply(synonym)}
                  title={
                    hasSelection
                      ? `Replace “${selectedWord}” with “${synonym}”`
                      : `Copy “${synonym}”`
                  }
                >
                  {synonym}
                  <Icon name={hasSelection ? 'pen' : 'copy'} size={11} />
                </button>
              ))}
            </div>
          ) : (
            <p className="small muted">No synonyms found for this word.</p>
          )}

          {shown.antonyms?.length > 0 && (
            <>
              <p className="word-card__label">Antonyms</p>
              <div className="chip-row chip-row--wrap">
                {shown.antonyms.map((antonym) => (
                  <span key={antonym} className="tag">
                    {antonym}
                  </span>
                ))}
              </div>
            </>
          )}

          {shown.unavailable && (
            <div className="inline-note">
              <Icon name="info" size={13} />
              <span>Network unavailable — showing the local wordbook.</span>
            </div>
          )}
        </div>
      )}

      {queryIsWord && lookupState === 'error' && (
        <div className="inline-note">
          <Icon name="info" size={14} />
          <span>Offline or unavailable. The local wordbook may still have an entry.</span>
        </div>
      )}

      {repeated.length > 0 && (
        <div className="panel-block">
          <p className="word-card__label">Words you lean on</p>
          <div className="chip-row chip-row--wrap">
            {repeated.map((entry) => (
              <button
                key={entry.word}
                type="button"
                className="chip chip--word"
                onClick={() => onFocusWord(entry.word)}
              >
                {entry.word} <span className="chip__count">{entry.count}×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {vague.length > 0 && (
        <div className="panel-block">
          <p className="word-card__label">Vague words to replace</p>
          <div className="chip-row chip-row--wrap">
            {[...new Set(vague.map((entry) => entry.text.toLowerCase()))].slice(0, 8).map((word) => (
              <button
                key={word}
                type="button"
                className="chip chip--word"
                onClick={() => {
                  setQuery(word)
                  onFocusWord(word)
                }}
              >
                {truncate(word, 20)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="panel-footer-link">
        <Link className="text-link" to={queryIsWord ? `/wordbook?word=${encodeURIComponent(query)}` : '/wordbook'}>
          Open the full wordbook <Icon name="arrow" size={13} />
        </Link>
      </div>
    </div>
  )
}
