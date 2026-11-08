import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import {
  exerciseTypes,
  exercisesByType,
  pickSession,
} from '../data/exercises.js'
import { prompts, promptOfTheDay } from '../data/prompts.js'

function buildSession(type = 'all') {
  if (type === 'all') return pickSession(8)
  const pool = [...exercisesByType(type)]
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[pool[index], pool[swap]] = [pool[swap], pool[index]]
  }
  return pool.slice(0, Math.min(8, pool.length))
}

function typeLabel(id) {
  return exerciseTypes.find((type) => type.id === id)?.label || id
}

export default function Practice() {
  const [type, setType] = useState('all')
  const [session, setSession] = useState(() => buildSession('all'))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [prompt, setPrompt] = useState(() => promptOfTheDay())

  const current = session[index]
  const answered = current ? answers[current.id] : undefined
  const isAnswered = answered !== undefined
  const isLast = index === session.length - 1
  const score = session.reduce(
    (total, question) => total + (answers[question.id] === question.answer ? 1 : 0),
    0,
  )

  const byType = useMemo(() => {
    const map = new Map()
    for (const question of session) {
      const entry = map.get(question.type) || { correct: 0, total: 0 }
      entry.total += 1
      if (answers[question.id] === question.answer) entry.correct += 1
      map.set(question.type, entry)
    }
    return [...map.entries()]
  }, [session, answers])

  const restart = (nextType = type) => {
    setType(nextType)
    setSession(buildSession(nextType))
    setIndex(0)
    setAnswers({})
    setFinished(false)
  }

  const choose = (optionIndex) => {
    if (isAnswered) return
    setAnswers((previous) => ({ ...previous, [current.id]: optionIndex }))
  }

  const next = () => {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
  }

  const anotherPrompt = () => {
    const currentIndex = prompts.indexOf(prompt)
    const offset = 1 + Math.floor(Math.random() * (prompts.length - 1))
    setPrompt(prompts[(currentIndex + offset) % prompts.length])
  }

  const percent = session.length ? Math.round((index / session.length) * 100) : 0

  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">Practice</p>
          <h1>Practise the moves</h1>
          <p className="lead page-head__lead">
            Eight questions on spelling, word choice, clarity and structure. Immediate feedback,
            short explanations, no timer. A five-minute warm-up for the next draft.
          </p>
        </div>
      </section>

      <div className="container practice-layout section-tight">
        <div className="practice-main">
          <div className="practice-toolbar">
            <div className="chip-row">
              <button
                type="button"
                className={`chip ${type === 'all' ? 'is-active' : ''}`}
                onClick={() => restart('all')}
              >
                Mixed
              </button>
              {exerciseTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip ${type === item.id ? 'is-active' : ''}`}
                  onClick={() => restart(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn--quiet btn--sm" onClick={() => restart(type)}>
              <Icon name="refresh" size={14} /> New set
            </button>
          </div>

          {finished ? (
            <section className="practice-result card" aria-live="polite">
              <p className="eyebrow">Session complete</p>
              <div className="practice-result__score">
                <strong>{score}</strong>
                <span>of {session.length}</span>
              </div>
              <h2>
                {score === session.length
                  ? 'A clean sweep.'
                  : score >= session.length - 2
                    ? 'A strong session.'
                    : 'A useful session.'}
              </h2>
              <p className="lead">
                {score === session.length
                  ? 'You know these moves. Take one of them into the studio and test it on a real draft.'
                  : 'Mistakes are the point of practice. Read the explanations below, then try the set again.'}
              </p>

              <div className="result-breakdown">
                {byType.map(([kind, result]) => (
                  <div key={kind} className="result-breakdown__item">
                    <span>{typeLabel(kind)}</span>
                    <strong>
                      {result.correct}/{result.total}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="review-list">
                {session.map((question) => {
                  const correct = answers[question.id] === question.answer
                  return (
                    <article
                      key={question.id}
                      className={`review-item ${correct ? 'is-correct' : 'is-wrong'}`}
                    >
                      <div className="review-item__head">
                        <span className="review-item__mark">
                          <Icon name={correct ? 'check' : 'close'} size={14} />
                        </span>
                        <span>{question.prompt}</span>
                      </div>
                      <p className="review-item__answer">
                        <strong>{question.options[question.answer]}</strong>
                      </p>
                      <p className="review-item__explanation">{question.explanation}</p>
                    </article>
                  )
                })}
              </div>

              <div className="practice-result__actions">
                <button type="button" className="btn btn--primary" onClick={() => restart(type)}>
                  <Icon name="refresh" size={15} /> Another set
                </button>
                <Link className="btn btn--ghost" to="/write">
                  Take it to the studio <Icon name="arrow" size={15} />
                </Link>
              </div>
            </section>
          ) : (
            <section className="practice-card card">
              <div className="practice-progress">
                <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                  <div className="progress__fill" style={{ width: `${percent}%` }} />
                </div>
                <div className="practice-progress__meta">
                  <span>
                    Question {index + 1} of {session.length}
                  </span>
                  <span className="tag tag--sage">{typeLabel(current.type)}</span>
                </div>
              </div>

              <div className="practice-card__body">
                <h2 className="practice-question">{current.prompt}</h2>
                {current.passage && <p className="practice-passage">{current.passage}</p>}

                <div className="option-list" role="group" aria-label="Answer options">
                  {current.options.map((option, optionIndex) => {
                    const isCorrect = optionIndex === current.answer
                    const isChosen = optionIndex === answered
                    let className = 'option'
                    if (isAnswered && isCorrect) className += ' is-correct'
                    else if (isAnswered && isChosen) className += ' is-wrong'
                    else if (isAnswered) className += ' is-muted'

                    return (
                      <button
                        key={option}
                        type="button"
                        className={className}
                        onClick={() => choose(optionIndex)}
                        disabled={isAnswered}
                      >
                        <span className="option__letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span>{option}</span>
                        {isAnswered && isCorrect && (
                          <span className="option__icon">
                            <Icon name="check" size={16} />
                          </span>
                        )}
                        {isAnswered && isChosen && !isCorrect && (
                          <span className="option__icon">
                            <Icon name="close" size={16} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`explanation ${answered === current.answer ? 'is-correct' : 'is-wrong'}`}
                    role="status"
                  >
                    <p className="explanation__title">
                      {answered === current.answer ? 'Correct.' : 'Not quite.'}
                    </p>
                    <p>{current.explanation}</p>
                  </div>
                )}
              </div>

              <div className="practice-card__foot">
                <span className="small muted">
                  {isAnswered
                    ? 'Read the explanation, then continue.'
                    : 'Choose the answer you would defend.'}
                </span>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={next}
                  disabled={!isAnswered}
                >
                  {isLast ? 'See results' : 'Next question'} <Icon name="arrow" size={14} />
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="practice-aside">
          <article className="prompt-card card">
            <p className="eyebrow">Warm-up · {prompt.mode}</p>
            <h2>{prompt.title}</h2>
            <p>{prompt.prompt}</p>
            <p className="prompt-card__hint">
              <Icon name="spark" size={15} /> {prompt.hint}
            </p>
            <div className="prompt-card__actions">
              <Link
                className="btn btn--primary btn--sm"
                to={`/write?prompt=${encodeURIComponent(prompt.prompt)}&mode=${encodeURIComponent(prompt.mode)}`}
              >
                Write on this <Icon name="arrow" size={14} />
              </Link>
              <button type="button" className="btn btn--quiet btn--sm" onClick={anotherPrompt}>
                Another
              </button>
            </div>
          </article>

          <article className="how-card card">
            <p className="eyebrow">How to use this</p>
            <ul className="how-list">
              <li>
                <strong>Answer before you look.</strong> Choosing is more useful than recognising.
              </li>
              <li>
                <strong>Read the explanation.</strong> The reason is the lesson, not the letter.
              </li>
              <li>
                <strong>Use one move.</strong> Carry a single habit into the studio and revise for
                it.
              </li>
            </ul>
            <Link className="text-link" to="/structures">
              Browse the structures <Icon name="arrow" size={14} />
            </Link>
          </article>
        </aside>
      </div>
    </>
  )
}
