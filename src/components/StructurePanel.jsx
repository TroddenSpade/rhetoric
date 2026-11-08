import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function StructurePanel({
  blueprints,
  blueprint,
  onSelect,
  onInsert,
  checked,
  onToggle,
  onReset,
  percent,
}) {
  return (
    <div className="panel-body structure-panel">
      <div className="panel-intro">
        <h3>Give the draft a shape</h3>
        <p>
          Choose a blueprint, then tick the parts as they arrive. The checklist is saved with this
          browser.
        </p>
      </div>

      <label className="field">
        <span className="field__label">Blueprint</span>
        <select
          className="select"
          value={blueprint.id}
          onChange={(event) => onSelect(event.target.value)}
        >
          {blueprints.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <div className="structure-meta">
        <p>{blueprint.tagline}</p>
        <span className="tag tag--gold">~{blueprint.target} words</span>
      </div>

      <div className="checklist-head">
        <span className="small muted">The parts</span>
        <span className="small muted">{percent}%</span>
      </div>
      <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>

      <ul className="structure-checks">
        {blueprint.sections.map((section, index) => (
          <li key={section.name}>
            <label className={`check ${checked.includes(section.name) ? 'is-checked' : ''}`}>
              <input
                type="checkbox"
                checked={checked.includes(section.name)}
                onChange={() => onToggle(section.name)}
              />
              <span className="check__box" aria-hidden="true">
                <Icon name="check" size={11} />
              </span>
              <span className="check__body">
                <span className="check__name">
                  <span className="check__num">{index + 1}</span> {section.name}
                </span>
                <span className="check__prompt">{section.prompt}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div className="structure-actions">
        <button type="button" className="btn btn--primary btn--sm" onClick={onInsert}>
          <Icon name="list" size={14} /> Insert outline
        </button>
        <button type="button" className="btn btn--quiet btn--sm" onClick={onReset}>
          Reset checks
        </button>
      </div>

      <ul className="mini-tips">
        {blueprint.tips.slice(0, 2).map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>

      <div className="panel-footer-link">
        <Link className="text-link" to={`/structures?blueprint=${blueprint.id}`}>
          Read the full guide <Icon name="arrow" size={13} />
        </Link>
      </div>
    </div>
  )
}
