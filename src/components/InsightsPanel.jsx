import ScoreDial from './ScoreDial.jsx'
import Icon from './Icon.jsx'
import { scoreBand } from '../lib/analyze.js'
import { truncate } from '../lib/text.js'

function Meter({ label, value }) {
  return (
    <div className="meter">
      <div className="meter__head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="meter__bar">
        <div className="meter__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function insightItem(item, index, { onSelectRange, onFocusWord }) {
  const hasRange = Number.isFinite(item.start) && Number.isFinite(item.end)
  const canFocusWord = item.hint && !hasRange

  if (hasRange) {
    return (
      <li key={`${item.label}-${index}`}>
        <button
          type="button"
          className="insight-item"
          onClick={() => onSelectRange(item.start, item.end)}
          title="Select this in the draft"
        >
          <span className="insight-item__label">{truncate(item.label, 74)}</span>
          <span className="insight-item__meta">
            {item.hint && <span>{item.hint}</span>}
            <Icon name="arrow" size={12} />
          </span>
        </button>
      </li>
    )
  }

  if (canFocusWord) {
    return (
      <li key={`${item.label}-${index}`}>
        <button
          type="button"
          className="insight-item"
          onClick={() => onFocusWord(item.label)}
          title="Find synonyms"
        >
          <span className="insight-item__label">{item.label}</span>
          <span className="insight-item__meta">
            <span>{item.hint}</span>
            <Icon name="search" size={12} />
          </span>
        </button>
      </li>
    )
  }

  return (
    <li key={`${item.label}-${index}`} className="insight-item insight-item--static">
      <span className="insight-item__label">{item.label}</span>
      {item.hint && <span className="insight-item__meta">{item.hint}</span>}
    </li>
  )
}

export default function InsightsPanel({ analysis, onSelectRange, onFocusWord }) {
  const band = scoreBand(analysis.scores.overall)
  const displayBand = analysis.ready ? band.label : 'Getting started'
  const lengths = analysis.sentenceLengths.slice(0, 28)
  const maxLength = Math.max(...lengths, 1)
  const fleschLabel =
    analysis.flesch === null
      ? null
      : analysis.flesch >= 70
        ? 'Easy'
        : analysis.flesch >= 50
          ? 'Fairly difficult'
          : 'Difficult'

  return (
    <div className="panel-body">
      <div className="score-summary">
        <ScoreDial
          value={analysis.ready ? analysis.scores.overall : 0}
          label="Overall"
          size={88}
        />
        <div>
          <p className="score-summary__band">{displayBand}</p>
          <p className="small muted">
            {analysis.ready
              ? 'A guide to where to look next — not a verdict on the draft.'
              : 'Write about twenty words to make the feedback meaningful.'}
          </p>
        </div>
      </div>

      <div className="meters">
        <Meter label="Concision" value={analysis.scores.concision} />
        <Meter label="Range" value={analysis.scores.variety} />
        <Meter label="Clarity" value={analysis.scores.clarity} />
        <Meter label="Polish" value={analysis.scores.polish} />
      </div>

      <div className="insight-list">
        {analysis.insights.map((insight) => (
          <article key={insight.id} className={`insight insight--${insight.tone}`}>
            <div className="insight__head">
              <span className="insight__dot" aria-hidden="true" />
              <h3>{insight.title}</h3>
            </div>
            <p className="insight__detail">{insight.detail}</p>
            {insight.items.length > 0 && (
              <ul className="insight-items">
                {insight.items.map((item, index) =>
                  insightItem(item, index, { onSelectRange, onFocusWord }),
                )}
              </ul>
            )}
          </article>
        ))}
      </div>

      <div className="readability">
        <div className="readability__head">
          <h3>Rhythm &amp; readability</h3>
          <span className="small muted">
            {analysis.sentences} {analysis.sentences === 1 ? 'sentence' : 'sentences'}
          </span>
        </div>

        {lengths.length > 1 ? (
          <div className="sentence-bars" aria-label="Sentence lengths">
            {lengths.map((length, index) => (
              <span
                key={index}
                style={{ height: `${Math.max(10, (length / maxLength) * 100)}%` }}
                title={`Sentence ${index + 1}: ${length} words`}
                className={length >= 28 ? 'is-long' : ''}
              />
            ))}
          </div>
        ) : (
          <p className="small muted">A few more sentences will reveal your rhythm.</p>
        )}

        <div className="readability__stats">
          <span>
            <strong>{analysis.avgSentence ? analysis.avgSentence.toFixed(1) : '0'}</strong> avg.
            words
          </span>
          <span>
            <strong>
              {analysis.sentences > 1 ? analysis.sentenceVariety.toFixed(1) : '—'}
            </strong>{' '}
            variation
          </span>
          <span>
            <strong>{analysis.flesch ?? '—'}</strong> {fleschLabel ? `Flesch · ${fleschLabel}` : 'Flesch'}
          </span>
          <span>
            <strong>{analysis.grade ?? '—'}</strong> grade
          </span>
        </div>
      </div>
    </div>
  )
}
