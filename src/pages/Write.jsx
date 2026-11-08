import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import ScoreDial from '../components/ScoreDial.jsx'
import Toast from '../components/Toast.jsx'
import InsightsPanel from '../components/InsightsPanel.jsx'
import WordsPanel from '../components/WordsPanel.jsx'
import SpellingPanel from '../components/SpellingPanel.jsx'
import StructurePanel from '../components/StructurePanel.jsx'
import { analyzeText, scoreBand } from '../lib/analyze.js'
import { lookupWord } from '../lib/wordbook.js'
import { findStructure, structures } from '../data/structures.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { formatNumber, isSingleWord, matchCase } from '../lib/text.js'

const SAMPLE = `At the end of the day, there are a lot of things that are really important when you want to write good. A lot of people think that writing is just about using big words or following a formula, but the thing is that good writing is actually about making your ideas clear and making sure that the reader can follow what you are saying without having to go back and read the same sentence over and over again because it is too long and has too many ideas in it at once.

The first draft of this essay was rejected by the editor because the argument was not really clear. Basically, the main thing that was missing was a strong claim. The writer said that society has a problem but did not say who was affected, how often it happened, or what it cost. You cannot recieve a reader's trust if you do not seperate the evidence from the opinion. It is very important to acommodate the reader's need for a clear structure.

There is also the issue of word choice. Many writers use the same words again and again. The words become invisible, and the reader stops noticing them. At the end of the day, you should think outside the box and find different words. This is definately a thing that will make your writing more interesting and more good.

The final point is that a writer should read the draft out loud. This was occured to me after I had wrote the third draft. A separate reader will hear the rhythm differently. The best argument is the one that sounds inevitable when it is spoken, not the one that looks clever on the page.`

const TAB_IDS = ['insights', 'words', 'spelling', 'structure']

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'rhetoric-draft'
  )
}

export default function Write() {
  const [text, setText] = useLocalStorage('rhetoric:draft', '')
  const [title, setTitle] = useLocalStorage('rhetoric:title', 'Untitled draft')
  const [tab, setTab] = useState('insights')
  const [focusMode, setFocusMode] = useState(false)
  const [spelling, setSpelling] = useState([])
  const [spellStatus, setSpellStatus] = useState('idle')
  const [ignored, setIgnored] = useLocalStorage('rhetoric:ignored-words', [])
  const [blueprintId, setBlueprintId] = useLocalStorage('rhetoric:blueprint', 'argument')
  const [checklists, setChecklists] = useLocalStorage('rhetoric:checklists', {})
  const [query, setQuery] = useState('')
  const [lookup, setLookup] = useState(null)
  const [lookupState, setLookupState] = useState('idle')
  const [selection, setSelection] = useState({ start: 0, end: 0, text: '' })
  const [toast, setToast] = useState('')
  const [promptDismissed, setPromptDismissed] = useState(false)
  const textareaRef = useRef(null)
  const [searchParams] = useSearchParams()

  const debouncedText = useDebouncedValue(text, 280)
  const debouncedQuery = useDebouncedValue(query, 240)

  const blueprint = findStructure(blueprintId) || structures[0]
  const checked = checklists[blueprint.id] || []
  const checkedCount = checked.filter((name) =>
    blueprint.sections.some((section) => section.name === name),
  ).length
  const percent = blueprint.sections.length
    ? Math.round((checkedCount / blueprint.sections.length) * 100)
    : 0

  const promptText = searchParams.get('prompt') || ''
  const promptMode = searchParams.get('mode') || ''

  useEffect(() => {
    setPromptDismissed(false)
  }, [promptText])

  useEffect(() => {
    const requested = searchParams.get('structure')
    if (requested && findStructure(requested)) setBlueprintId(requested)

    const requestedTab = searchParams.get('tab')
    if (requestedTab && TAB_IDS.includes(requestedTab)) setTab(requestedTab)
  }, [searchParams, setBlueprintId])

  // Spellchecking lives in a separate chunk so the dictionary does not delay
  // the first paint. It runs on the debounced text and is cached by the SW.
  useEffect(() => {
    let cancelled = false
    if (!debouncedText.trim()) {
      setSpelling([])
      setSpellStatus('idle')
      return
    }

    setSpellStatus('loading')
    const timer = window.setTimeout(async () => {
      try {
        const { checkSpelling } = await import('../lib/spelling.js')
        if (cancelled) return
        setSpelling(checkSpelling(debouncedText, { ignored }))
        setSpellStatus('ready')
      } catch {
        if (!cancelled) {
          setSpelling([])
          setSpellStatus('error')
        }
      }
    }, 120)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [debouncedText, ignored])

  const analysis = useMemo(
    () => analyzeText(debouncedText, { spelling }),
    [debouncedText, spelling],
  )

  useEffect(() => {
    const term = debouncedQuery.trim()
    if (!term || !isSingleWord(term)) {
      setLookup(null)
      setLookupState('idle')
      return
    }

    const controller = new AbortController()
    setLookupState('loading')
    lookupWord(term, { signal: controller.signal })
      .then((data) => {
        setLookup(data)
        setLookupState('ready')
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return
        setLookup(null)
        setLookupState('error')
      })

    return () => controller.abort()
  }, [debouncedQuery])

  const syncSelection = useCallback(() => {
    const element = textareaRef.current
    if (!element) return
    const start = element.selectionStart ?? 0
    const end = element.selectionEnd ?? 0
    const selected = text.slice(start, end)
    setSelection({ start, end, text: selected })
    const trimmed = selected.trim()
    if (trimmed.length > 1 && isSingleWord(trimmed)) setQuery(trimmed)
  }, [text])

  const replaceRange = useCallback(
    (start, end, replacement) => {
      setText((previous) => previous.slice(0, start) + replacement + previous.slice(end))
      setSelection({ start, end: start + replacement.length, text: replacement })
      setQuery(replacement)
      setToast(`Replaced with “${replacement}”.`)
      window.requestAnimationFrame(() => {
        const element = textareaRef.current
        if (!element) return
        element.focus()
        element.setSelectionRange(start, start + replacement.length)
      })
    },
    [setText],
  )

  const selectRange = useCallback(
    (start, end) => {
      const selected = text.slice(start, end)
      setSelection({ start, end, text: selected })
      const trimmed = selected.trim()
      if (trimmed.length > 1 && isSingleWord(trimmed)) setQuery(trimmed)
      window.requestAnimationFrame(() => {
        const element = textareaRef.current
        if (!element) return
        element.focus()
        element.setSelectionRange(start, end)
      })
    },
    [text],
  )

  const focusWord = useCallback(
    (word) => {
      const clean = String(word).trim()
      if (!clean) return
      const pattern = new RegExp(`\\b${escapeRegExp(clean)}\\b`, 'i')
      const match = pattern.exec(text)
      setTab('words')
      if (match) {
        selectRange(match.index, match.index + match[0].length)
        setQuery(match[0])
      } else {
        setQuery(clean)
      }
    },
    [selectRange, text],
  )

  const copyText = useCallback(async (value, message) => {
    try {
      await navigator.clipboard.writeText(value)
      setToast(message)
    } catch {
      setToast('Could not access the clipboard.')
    }
  }, [])

  const applySynonym = useCallback(
    (suggestion) => {
      const selected = selection.text.trim()
      if (selected && isSingleWord(selected)) {
        replaceRange(selection.start, selection.end, matchCase(selected, suggestion))
      } else {
        copyText(
          suggestion,
          `Copied “${suggestion}”. Select a word in the draft to replace it.`,
        )
      }
    },
    [copyText, replaceRange, selection],
  )

  const changeBlueprint = (id) => {
    setBlueprintId(id)
  }

  const toggleCheck = (name) => {
    setChecklists((previous) => {
      const current = previous[blueprint.id] || []
      const next = current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
      return { ...previous, [blueprint.id]: next }
    })
  }

  const resetChecks = () => {
    setChecklists((previous) => ({ ...previous, [blueprint.id]: [] }))
  }

  const insertOutline = () => {
    if (text.trim() && !window.confirm('Add this outline below the current draft?')) return
    setText((previous) => `${previous.trimEnd()}${previous.trim() ? '\n\n' : ''}${blueprint.skeleton}`)
    setToast('Outline added to the draft.')
    setTab('insights')
  }

  const newDraft = () => {
    if (text.trim() && !window.confirm('Start a new draft? The current draft will be cleared.')) return
    setText('')
    setTitle('Untitled draft')
    setSpelling([])
    setSelection({ start: 0, end: 0, text: '' })
    setQuery('')
    setTab('insights')
    setToast('A new draft. Begin wherever you like.')
  }

  const loadSample = () => {
    if (text.trim() && !window.confirm('Replace the current draft with the sample?')) return
    setText(SAMPLE)
    setTitle('Why writing well is harder than it looks')
    setTab('insights')
    setToast('Sample loaded. The insights are live.')
  }

  const downloadDraft = () => {
    const body = `# ${title.trim() || 'Untitled draft'}\n\n${text}`
    const blob = new Blob([body], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${slugify(title)}.md`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    setToast('Draft downloaded as Markdown.')
  }

  const ignoreWord = (lower) => {
    setIgnored((previous) =>
      previous.includes(lower) ? previous : [...previous, lower].sort(),
    )
    setSpelling((previous) => previous.filter((entry) => entry.lower !== lower))
  }

  const clearIgnored = () => {
    setIgnored([])
    setToast('Ignored words restored.')
  }

  const replaceSpelling = (entry, replacement) => {
    replaceRange(entry.start, entry.end, replacement)
    setSpelling((previous) => previous.filter((item) => item.lower !== entry.lower))
  }

  const tabs = [
    {
      id: 'insights',
      label: 'Insights',
      count: analysis.insights.filter((insight) => insight.tone === 'warn').length || null,
    },
    { id: 'words', label: 'Words', count: analysis.repeated.length || null },
    { id: 'spelling', label: 'Spelling', count: analysis.spellingCount || null },
    { id: 'structure', label: 'Structure', count: percent ? `${percent}%` : null },
  ]

  const band = scoreBand(analysis.scores.overall)

  return (
    <>
      <section className="studio-head">
        <div className="container">
          <h1 className="visually-hidden">The studio</h1>
          <div className="studio-head__top">
            <div className="studio-head__title">
              <p className="eyebrow">The studio</p>
              <input
                className="draft-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-label="Draft title"
                placeholder="Untitled draft"
              />
            </div>
            <div className="studio-head__meta">
              <span className="save-dot" aria-hidden="true" />
              <span>Saved on this device</span>
            </div>
          </div>

          <div className="studio-toolbar">
            <button type="button" className="tool" onClick={newDraft}>
              <Icon name="trash" size={15} /> New
            </button>
            <button type="button" className="tool" onClick={loadSample}>
              <Icon name="book" size={15} /> Sample
            </button>
            <button
              type="button"
              className="tool"
              onClick={() => copyText(text, 'Draft copied to the clipboard.')}
              disabled={!text}
            >
              <Icon name="copy" size={15} /> Copy
            </button>
            <button type="button" className="tool" onClick={downloadDraft} disabled={!text}>
              <Icon name="download" size={15} /> Markdown
            </button>
            <span className="toolbar-divider" aria-hidden="true" />
            <button
              type="button"
              className={`tool ${focusMode ? 'is-active' : ''}`}
              onClick={() => setFocusMode((value) => !value)}
              aria-pressed={focusMode}
            >
              <Icon name="target" size={15} /> {focusMode ? 'Show feedback' : 'Focus mode'}
            </button>
          </div>

          {promptText && !promptDismissed && (
            <div className="prompt-banner">
              <span className="prompt-banner__icon">
                <Icon name="spark" size={17} />
              </span>
              <div>
                <p className="prompt-banner__label">
                  Writing prompt{promptMode ? ` · ${promptMode}` : ''}
                </p>
                <p className="prompt-banner__text">{promptText}</p>
              </div>
              <button
                type="button"
                className="prompt-banner__close"
                aria-label="Dismiss prompt"
                onClick={() => setPromptDismissed(true)}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}

          <div className="stat-row">
            <div className="stat">
              <span className="stat__value">{formatNumber(analysis.words)}</span>
              <span className="stat__label">words</span>
            </div>
            <div className="stat">
              <span className="stat__value">{formatNumber(analysis.sentences)}</span>
              <span className="stat__label">sentences</span>
            </div>
            <div className="stat">
              <span className="stat__value">{formatNumber(analysis.paragraphs)}</span>
              <span className="stat__label">paragraphs</span>
            </div>
            <div className="stat">
              <span className="stat__value">
                {analysis.words ? `${analysis.readingMinutes} min` : '0 min'}
              </span>
              <span className="stat__label">to read</span>
            </div>
            <div className="stat stat--score">
              <ScoreDial
                value={analysis.ready ? analysis.scores.overall : 0}
                label={analysis.ready ? band.label : 'Start'}
                size={70}
              />
            </div>
          </div>
        </div>
      </section>

      <div className={`container studio-grid ${focusMode ? 'studio-grid--focus' : ''}`}>
        <div className="editor-col">
          <div className="editor-card card">
            <textarea
              ref={textareaRef}
              className="editor-area"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onSelect={syncSelection}
              onKeyUp={syncSelection}
              onClick={syncSelection}
              placeholder="Begin with a sentence you believe. Select any word for synonyms, or open the insights to see what a careful reader would notice."
              aria-label="Draft"
              spellCheck="true"
            />
            <div className="editor-card__foot">
              <span>
                <Icon name="pen" size={13} /> Select a word for synonyms
              </span>
              <span>
                {analysis.flesch !== null
                  ? `Flesch ${analysis.flesch} · grade ${analysis.grade}`
                  : `${formatNumber(analysis.characters)} characters`}
              </span>
            </div>
          </div>

          <p className="studio-hint">
            <Icon name="info" size={14} /> The draft is stored in this browser only. Export a
            Markdown copy if you need one.
          </p>
        </div>

        {!focusMode && (
          <aside className="studio-aside" aria-label="Draft feedback">
            <div className="tabs" role="tablist" aria-label="Feedback">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={tab === item.id}
                  aria-controls={`panel-${item.id}`}
                  className="tab"
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                  {item.count !== null && <span className="tab__count">{item.count}</span>}
                </button>
              ))}
            </div>

            <div
              className="panel card"
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
            >
              {tab === 'insights' && (
                <InsightsPanel
                  analysis={analysis}
                  onSelectRange={selectRange}
                  onFocusWord={focusWord}
                />
              )}
              {tab === 'words' && (
                <WordsPanel
                  query={query}
                  setQuery={setQuery}
                  lookup={lookup}
                  lookupState={lookupState}
                  selection={selection}
                  onApply={applySynonym}
                  onFocusWord={focusWord}
                  repeated={analysis.repeated}
                  vague={analysis.vague}
                />
              )}
              {tab === 'spelling' && (
                <SpellingPanel
                  spelling={spelling}
                  status={spellStatus}
                  hasText={Boolean(debouncedText.trim())}
                  ignored={ignored}
                  onReplace={replaceSpelling}
                  onIgnore={ignoreWord}
                  onClearIgnored={clearIgnored}
                />
              )}
              {tab === 'structure' && (
                <StructurePanel
                  blueprints={structures}
                  blueprint={blueprint}
                  onSelect={changeBlueprint}
                  onInsert={insertOutline}
                  checked={checked}
                  onToggle={toggleCheck}
                  onReset={resetChecks}
                  percent={percent}
                />
              )}
            </div>

            <p className="aside-foot">
              <Link to="/about">How the feedback works</Link>
            </p>
          </aside>
        )}
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </>
  )
}
