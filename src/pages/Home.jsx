import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { categories, wordOfTheDay } from '../data/thesaurus.js'
import { structures } from '../data/structures.js'
import { promptOfTheDay } from '../data/prompts.js'

const before = (
  <>
    There are <span className="mark mark--weak">a lot of things</span> that are{' '}
    <span className="mark mark--weak">really</span> important when you want to write{' '}
    <span className="mark mark--weak">good</span>. You should use{' '}
    <span className="mark mark--weak">different</span> words and make your sentences not all the
    same.
  </>
)

const after = (
  <>
    Strong writing rests on three habits: <span className="mark mark--strong">precise</span> words,{' '}
    <span className="mark mark--strong">varied</span> sentences, and a{' '}
    <span className="mark mark--strong">clear structure</span>.
  </>
)

export default function Home() {
  const [mode, setMode] = useState('after')
  const word = wordOfTheDay()
  const prompt = promptOfTheDay()
  const featured = structures.slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy rise">
            <p className="eyebrow">A studio for the working writer</p>
            <h1>
              Say the thing <span className="accent">better</span>.
            </h1>
            <p className="lead">
              Rhetoric is a local-first writing studio for the three things that make prose worth
              reading: the <strong>right word</strong>, the <strong>right spelling</strong>, and the{' '}
              <strong>right shape</strong>. Bring a draft and leave with a clearer one.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--primary" to="/write">
                Open the studio <Icon name="arrow" size={17} />
              </Link>
              <Link className="btn btn--ghost" to="/structures">
                Explore the structures
              </Link>
            </div>
            <ul className="hero__meta">
              <li>
                <strong>150+</strong> curated word entries
              </li>
              <li>
                <strong>9</strong> structures &amp; outlines
              </li>
              <li>works offline</li>
            </ul>
          </div>

          <div className="hero__aside rise-2">
            <article className="demo-card">
              <header className="demo-card__head">
                <span className="demo-card__label">
                  <span className="demo-dot" aria-hidden="true" /> Live revision
                </span>
                <div className="demo-toggle" role="group" aria-label="Revision example">
                  <button
                    type="button"
                    aria-pressed={mode === 'before'}
                    className={mode === 'before' ? 'is-active' : ''}
                    onClick={() => setMode('before')}
                  >
                    Before
                  </button>
                  <button
                    type="button"
                    aria-pressed={mode === 'after'}
                    className={mode === 'after' ? 'is-active' : ''}
                    onClick={() => setMode('after')}
                  >
                    After
                  </button>
                </div>
              </header>

              <p className="demo-text">{mode === 'before' ? before : after}</p>

              <div className="demo-stats">
                <span>
                  <strong>{mode === 'before' ? 29 : 14}</strong> words
                </span>
                <span>
                  <strong>{mode === 'before' ? 2 : 1}</strong>{' '}
                  {mode === 'before' ? 'sentences' : 'sentence'}
                </span>
                <span>
                  clarity <strong>{mode === 'before' ? 38 : 92}</strong>
                </span>
              </div>

              <p className="demo-note">
                {mode === 'before'
                  ? 'Filler, vague nouns, and an even rhythm. The idea is there; the words are hiding it.'
                  : 'The same idea, with the vague words removed and the sentence given a shape.'}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Three disciplines</p>
          <h2>What changes when you revise</h2>
          <div className="feature-grid">
            <article className="feature card">
              <span className="feature__num" aria-hidden="true">I</span>
              <h3>Range</h3>
              <p>
                A word you use five times becomes invisible. The wordbook offers sharper synonyms,
                and the studio shows the words you lean on before they become a tic.
              </p>
              <Link className="text-link" to="/wordbook">
                Open the wordbook <Icon name="arrow" size={14} />
              </Link>
            </article>
            <article className="feature card">
              <span className="feature__num" aria-hidden="true">II</span>
              <h3>Precision</h3>
              <p>
                Spelling, filler, vague nouns and passive constructions are surfaced as you write.
                Nothing is corrected behind your back; you decide what to keep.
              </p>
              <Link className="text-link" to="/write">
                Try the studio <Icon name="arrow" size={14} />
              </Link>
            </article>
            <article className="feature card">
              <span className="feature__num" aria-hidden="true">III</span>
              <h3>Structure</h3>
              <p>
                Nine shapes for nine kinds of thinking: argument, comparison, problem and solution,
                narrative, definition, cause and effect, description, rhetorical analysis, and the
                paragraph.
              </p>
              <Link className="text-link" to="/structures">
                Browse the structures <Icon name="arrow" size={14} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container split">
          <div className="split__body">
            <p className="eyebrow">A studio, not a scoreboard</p>
            <h2>Feedback you can argue with</h2>
            <p className="lead">
              Rhetoric does not rewrite for you. It shows you what a careful reader would notice:
              the repeated word, the sentence that runs long, the claim that arrives without
              evidence.
            </p>
            <ul className="checklist">
              <li>Live word, sentence and readability measures.</li>
              <li>Offline spellchecking with suggestions and an ignore list.</li>
              <li>Synonyms for the word under your cursor, not a generic list.</li>
              <li>Structure checklists you can tick as the draft takes shape.</li>
              <li>Everything saved on your device. No account, no upload.</li>
            </ul>
            <Link className="btn btn--primary" to="/write">
              Start with a blank page <Icon name="arrow" size={16} />
            </Link>
          </div>

          <aside className="mini-studio card" aria-label="Example feedback">
            <div className="mini-studio__bar">
              <span className="mini-dot" />
              <span className="mini-dot" />
              <span className="mini-dot" />
              <span className="mini-studio__file">draft.md</span>
            </div>
            <div className="mini-studio__body">
              <p className="mini-studio__text">
                The committee <span className="mark mark--weak">was really happy</span> with the{' '}
                <span className="mark mark--weak">thing</span> that the report{' '}
                <span className="mark mark--weak">said</span>.
              </p>
              <div className="mini-insight">
                <span className="mini-insight__tag">3 things to notice</span>
                <p>
                  <strong>really</strong> — filler. <strong>thing</strong> — name it.{' '}
                  <strong>said</strong> — try <em>argued</em>, <em>claimed</em> or <em>conceded</em>.
                </p>
              </div>
              <div className="mini-meters">
                <span style={{ '--w': '74%' }}>clarity</span>
                <span style={{ '--w': '58%' }}>range</span>
                <span style={{ '--w': '91%' }}>structure</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">The craft library</p>
              <h2>Start from a shape, not a blank page</h2>
            </div>
            <Link className="text-link" to="/structures">
              All nine structures <Icon name="arrow" size={14} />
            </Link>
          </div>
          <div className="craft-grid">
            {featured.map((structure) => (
              <Link
                key={structure.id}
                className="craft-card card"
                to={`/structures?blueprint=${structure.id}`}
              >
                <span className="craft-card__index">{structures.indexOf(structure) + 1}</span>
                <h3>{structure.name}</h3>
                <p>{structure.tagline}</p>
                <span className="craft-card__when">{structure.when}</span>
                <span className="text-link">
                  Read the shape <Icon name="arrow" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container daily-grid">
          <article className="word-day card">
            <p className="eyebrow">Word of the day</p>
            <div className="word-day__head">
              <h2>{word.word}</h2>
              <span className="tag tag--gold">{word.pos}</span>
            </div>
            <p>{word.gloss}</p>
            <p className="word-day__example">“{word.example}”</p>
            <div className="chip-row">
              {word.synonyms
                .filter((synonym) => !synonym.includes(' '))
                .slice(0, 5)
                .map((synonym) => (
                  <Link
                    key={synonym}
                    className="chip"
                    to={`/wordbook?word=${encodeURIComponent(synonym)}`}
                  >
                    {synonym}
                  </Link>
                ))}
            </div>
            <Link className="text-link" to={`/wordbook?word=${encodeURIComponent(word.word)}`}>
              More in the wordbook <Icon name="arrow" size={14} />
            </Link>
          </article>

          <article className="prompt-card card">
            <p className="eyebrow">Today’s prompt · {prompt.mode}</p>
            <h2>{prompt.title}</h2>
            <p>{prompt.prompt}</p>
            <p className="prompt-card__hint">
              <Icon name="spark" size={15} /> {prompt.hint}
            </p>
            <Link
              className="btn btn--ghost btn--sm"
              to={`/write?prompt=${encodeURIComponent(prompt.prompt)}&mode=${encodeURIComponent(prompt.mode)}`}
            >
              Write on this <Icon name="arrow" size={14} />
            </Link>
          </article>

          <article className="category-card card">
            <p className="eyebrow">Browse by need</p>
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/wordbook?category=${encodeURIComponent(category.id)}`}>
                    <span>{category.label}</span>
                    <Icon name="arrow" size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <p className="eyebrow">The next draft</p>
              <h2>Bring a draft. Leave with a better one.</h2>
              <p>
                No sign-up, no cloud, no blank-page guilt. The studio is ready when you are — and it
                keeps working when the connection does not.
              </p>
            </div>
            <div className="cta-band__actions">
              <Link className="btn btn--primary" to="/write">
                Open the studio <Icon name="arrow" size={16} />
              </Link>
              <Link className="btn btn--ghost" to="/practice">
                Try a five-minute drill
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
