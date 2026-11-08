import Icon from './Icon.jsx'
import { matchCase } from '../lib/text.js'

export default function SpellingPanel({
  spelling,
  status,
  hasText,
  ignored,
  onReplace,
  onIgnore,
  onClearIgnored,
}) {
  return (
    <div className="panel-body spelling-panel">
      <div className="panel-intro">
        <h3>Spelling</h3>
        <p>
          Checked against a bundled English dictionary. Names, acronyms and words you ignore are
          left alone.
        </p>
      </div>

      {status === 'loading' && (
        <div className="inline-note">
          <Icon name="refresh" size={14} />
          <span>Checking the draft…</span>
        </div>
      )}

      {status === 'error' && (
        <div className="inline-note">
          <Icon name="info" size={14} />
          <span>The spellchecker could not load. Reload the page to try again.</span>
        </div>
      )}

      {!hasText && status !== 'loading' && (
        <div className="empty-state">
          <span className="empty-state__mark">
            <Icon name="pen" size={18} />
          </span>
          <strong>Nothing to check yet.</strong>
          <p>The spellchecker runs as soon as the draft has a few words.</p>
        </div>
      )}

      {hasText && status !== 'loading' && status !== 'error' && spelling.length === 0 && (
        <div className="empty-state empty-state--good">
          <span className="empty-state__mark">
            <Icon name="check" size={18} />
          </span>
          <strong>No spelling slips found.</strong>
          <p>That is not a guarantee, but nothing obvious is asking for attention.</p>
        </div>
      )}

      {spelling.length > 0 && (
        <ul className="spell-list">
          {spelling.map((entry) => (
            <li key={entry.lower} className="spell-item">
              <div className="spell-item__head">
                <span className="spell-item__word">{entry.word}</span>
                {entry.count > 1 && <span className="chip__count">{entry.count}×</span>}
                <button
                  type="button"
                  className="spell-item__ignore"
                  onClick={() => onIgnore(entry.lower)}
                  title={`Ignore “${entry.lower}” from now on`}
                >
                  Ignore
                </button>
              </div>

              {entry.suggestions.length > 0 ? (
                <div className="spell-suggestions">
                  {entry.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="spell-chip"
                      onClick={() => onReplace(entry, matchCase(entry.word, suggestion))}
                      title={`Replace “${entry.word}” with “${suggestion}”`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="small muted">No suggestions. Check the word by hand.</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {ignored.length > 0 && (
        <div className="ignored-note">
          <p className="small muted">
            {ignored.length} {ignored.length === 1 ? 'word is' : 'words are'} ignored in this
            browser.{' '}
            <button type="button" className="text-link as-button" onClick={onClearIgnored}>
              Restore all
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
