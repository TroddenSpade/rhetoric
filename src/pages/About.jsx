import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Logo from '../components/Logo.jsx'

const canons = [
  {
    num: 'I',
    latin: 'Inventio',
    name: 'Invention',
    body: 'Find something worth saying. Prompts, structures and the discipline of stating a claim before defending it.',
    link: { to: '/practice', label: 'Practise invention' },
  },
  {
    num: 'II',
    latin: 'Dispositio',
    name: 'Arrangement',
    body: 'Give the idea an order a reader can follow. Nine blueprints, from the paragraph to the argument and the close reading.',
    link: { to: '/structures', label: 'Browse the structures' },
  },
  {
    num: 'III',
    latin: 'Elocutio',
    name: 'Style',
    body: 'Choose the precise word, vary the sentence, cut the filler. The studio and the wordbook are the workbench.',
    link: { to: '/write', label: 'Open the studio' },
  },
  {
    num: 'IV',
    latin: 'Memoria',
    name: 'Memory',
    body: 'Keep the words you have learned within reach. The wordbook is a curated store of sharper alternatives, available offline.',
    link: { to: '/wordbook', label: 'Open the wordbook' },
  },
  {
    num: 'V',
    latin: 'Pronuntiatio',
    name: 'Delivery',
    body: 'Read it aloud. The final test is not the score but whether the sentence survives your own ear.',
    link: { to: '/write', label: 'Read a draft aloud' },
  },
]

export default function About() {
  return (
    <>
      <section className="page-head about-hero">
        <div className="container container-narrow">
          <span className="about-seal" aria-hidden="true">
            <Logo size={54} />
          </span>
          <p className="eyebrow">About the project</p>
          <h1>Rhetoric is the art of saying the right thing, well.</h1>
          <p className="lead">
            The classical tradition divided the work of persuasion into five canons. Rhetoric, the
            app, is a small attempt to put all five within reach of a working writer — without an
            account, an upload, or a machine writing over your shoulder.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container canon-grid">
          {canons.map((canon) => (
            <article key={canon.latin} className="canon card">
              <span className="canon__num" aria-hidden="true">
                {canon.num}
              </span>
              <p className="canon__latin">{canon.latin}</p>
              <h3>{canon.name}</h3>
              <p>{canon.body}</p>
              <Link className="text-link" to={canon.link.to}>
                {canon.link.label} <Icon name="arrow" size={13} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container container-narrow prose">
          <p className="eyebrow">Principles</p>
          <h2>What Rhetoric believes</h2>

          <h3>Revision is a set of small decisions.</h3>
          <p>
            Good prose rarely arrives whole. It is made by noticing one thing at a time: the word
            you have used four times, the sentence that carries two ideas, the claim that leans on
            an adjective instead of a reason. The studio is designed to make those decisions
            visible, not to make them for you.
          </p>

          <h3>A score is a prompt, not a verdict.</h3>
          <p>
            The clarity score is a heuristic. It counts filler, repetition, sentence length and
            spelling, and it can be wrong about a deliberate style. Use it to find a place to look,
            then use your ear. The best sentence in the draft may be the one the meter likes least.
          </p>

          <h3>Your draft is yours.</h3>
          <p>
            Everything you write is stored in this browser’s local storage. There is no account, no
            server, no analytics and no upload. The wordbook is bundled with the app; online lookups
            send only the word you search to Datamuse, and the results are cached locally. If you
            clear your browser data, clear the draft first.
          </p>

          <h3>Range is a practice, not a trick.</h3>
          <p>
            A synonym is not automatically an improvement. “Utilise” is not better than “use”; it is
            longer. The wordbook offers alternatives with their senses, so you can choose the one
            that means what you mean. When in doubt, keep the plainer word.
          </p>

          <hr className="rule" />

          <h2>What Rhetoric is not</h2>
          <ul className="principle-list">
            <li>
              <strong>Not a grammar checker.</strong> It catches some spelling slips and flags
              possible passive voice, but it does not parse every sentence. Read your work.
            </li>
            <li>
              <strong>Not a generator.</strong> There is no button that writes the paragraph for
              you. The thinking is the point.
            </li>
            <li>
              <strong>Not a cloud service.</strong> There is no sync between devices. Export a draft
              if you need to move it.
            </li>
          </ul>

          <h2>Under the hood</h2>
          <p>
            React 19 and Vite 7, with an installable PWA shell and an offline-first service worker.
            Spellchecking runs in the browser on the Hunspell dictionary from{' '}
            <a href="https://github.com/wooorm/dictionaries" target="_blank" rel="noreferrer">
              dictionary-en
            </a>{' '}
            through{' '}
            <a href="https://github.com/wooorm/nspell" target="_blank" rel="noreferrer">
              nspell
            </a>
            . Extra synonyms and definitions come from the free{' '}
            <a href="https://www.datamuse.com/api/" target="_blank" rel="noreferrer">
              Datamuse API
            </a>{' '}
            when the device is online. Type is set in Fraunces, Source Serif 4 and Inter.
          </p>

          <div className="about-actions">
            <Link className="btn btn--primary" to="/write">
              Open the studio <Icon name="arrow" size={16} />
            </Link>
            <Link className="btn btn--ghost" to="/structures">
              Read a structure
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
