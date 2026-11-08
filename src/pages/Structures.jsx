import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Toast from '../components/Toast.jsx'
import { findStructure, structures } from '../data/structures.js'
import { entries } from '../data/thesaurus.js'

const appeals = new Set(['rhetoric', 'ethos', 'pathos', 'logos'])

export default function Structures() {
  const [params, setParams] = useSearchParams()
  const [toast, setToast] = useState('')
  const tab = params.get('tab') === 'devices' ? 'devices' : 'blueprints'
  const active = findStructure(params.get('blueprint')) || structures[0]
  const devices = entries.filter((entry) => entry.category === 'Oratory')

  const selectTab = (next) => {
    const updated = new URLSearchParams(params)
    updated.set('tab', next)
    setParams(updated)
  }

  const selectBlueprint = (id) => {
    const updated = new URLSearchParams(params)
    updated.set('blueprint', id)
    updated.delete('tab')
    setParams(updated)
  }

  const copyOutline = async () => {
    try {
      await navigator.clipboard.writeText(active.skeleton)
      setToast('Outline copied to the clipboard.')
    } catch {
      setToast('Could not access the clipboard.')
    }
  }

  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">The craft library</p>
          <h1>Shapes for thinking</h1>
          <p className="lead page-head__lead">
            Structure is not a cage. It is the order that lets a reader follow you. Choose a shape,
            read what each part must do, and start writing with the skeleton in place.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="segmented" role="tablist" aria-label="Craft library">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'blueprints'}
            className={tab === 'blueprints' ? 'is-active' : ''}
            onClick={() => selectTab('blueprints')}
          >
            Blueprints <span className="segmented__count">{structures.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'devices'}
            className={tab === 'devices' ? 'is-active' : ''}
            onClick={() => selectTab('devices')}
          >
            The orator’s kit <span className="segmented__count">{devices.length}</span>
          </button>
        </div>

        {tab === 'blueprints' ? (
          <div className="blueprints-layout section-tight">
            <nav className="blueprint-list" aria-label="Writing blueprints">
              {structures.map((structure, index) => (
                <button
                  key={structure.id}
                  type="button"
                  className={`blueprint-list__item ${structure.id === active.id ? 'is-active' : ''}`}
                  onClick={() => selectBlueprint(structure.id)}
                  aria-current={structure.id === active.id ? 'true' : undefined}
                >
                  <span className="blueprint-list__num">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="blueprint-list__name">{structure.name}</span>
                    <span className="blueprint-list__tag">{structure.tagline}</span>
                  </span>
                </button>
              ))}
            </nav>

            <article className="blueprint-detail card">
              <header className="blueprint-detail__head">
                <div>
                  <p className="eyebrow">
                    Shape {String(structures.indexOf(active) + 1).padStart(2, '0')}
                  </p>
                  <h2>{active.name}</h2>
                  <p className="lead">{active.tagline}</p>
                </div>
                <span className="tag tag--gold">~{active.target} words</span>
              </header>

              <p>{active.description}</p>
              <p className="blueprint-detail__when">
                <strong>Use it for:</strong> {active.when}
              </p>

              <h3 className="blueprint-detail__subhead">The parts</h3>
              <ol className="section-list">
                {active.sections.map((section, index) => (
                  <li key={section.name} className="section-item">
                    <span className="section-item__num">{index + 1}</span>
                    <div>
                      <h4>{section.name}</h4>
                      <p>{section.prompt}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="skeleton-head">
                <h3 className="blueprint-detail__subhead">A skeleton to start from</h3>
                <button type="button" className="btn btn--quiet btn--sm" onClick={copyOutline}>
                  <Icon name="copy" size={14} /> Copy outline
                </button>
              </div>
              <pre className="skeleton-box">{active.skeleton}</pre>

              <h3 className="blueprint-detail__subhead">Three things to remember</h3>
              <ul className="tips-list">
                {active.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>

              <div className="blueprint-detail__actions">
                <Link className="btn btn--primary" to={`/write?structure=${active.id}`}>
                  Open this shape in the studio <Icon name="arrow" size={16} />
                </Link>
                <Link className="btn btn--ghost" to="/practice">
                  Practise structure
                </Link>
              </div>
            </article>
          </div>
        ) : (
          <div className="section-tight">
            <div className="device-intro">
              <p className="lead">
                The classical figures are not decorations. Each one is a way of making an idea
                memorable, a contrast visible, or a claim feel inevitable. Name the move; then
                explain its effect.
              </p>
            </div>
            <div className="device-grid">
              {devices.map((device) => (
                <article key={device.word} className="device-card card">
                  <div className="device-card__head">
                    <h3>{device.word}</h3>
                    <span className="tag tag--sage">
                      {appeals.has(device.word) ? 'concept' : 'figure'}
                    </span>
                  </div>
                  <p className="device-card__gloss">{device.gloss}</p>
                  <p className="device-card__example">“{device.example}”</p>
                  <Link
                    className="text-link"
                    to={`/wordbook?word=${encodeURIComponent(device.word)}`}
                  >
                    Look it up <Icon name="arrow" size={13} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </>
  )
}
