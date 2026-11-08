export const exerciseTypes = [
  { id: 'spelling', label: 'Spelling', blurb: 'The right letters, in the right order.' },
  { id: 'word-choice', label: 'Word choice', blurb: 'The precise word rather than the approximate one.' },
  { id: 'clarity', label: 'Clarity', blurb: 'Sentences that say one thing, plainly.' },
  { id: 'structure', label: 'Structure', blurb: 'The shape that makes an argument readable.' },
]

export const exercises = [
  // ---------- Spelling ----------
  {
    id: 'sp-1',
    type: 'spelling',
    prompt: 'Which spelling is correct?',
    options: ['accommodate', 'acommodate', 'accomodate', 'acommadate'],
    answer: 0,
    explanation: 'Accommodate has two c’s and two m’s: ac-com-mo-date.',
  },
  {
    id: 'sp-2',
    type: 'spelling',
    prompt: 'Which spelling is correct?',
    options: ['seperate', 'separate', 'seperete', 'sepatate'],
    answer: 1,
    explanation: 'There is “a rat” in the middle: sep-a-rate.',
  },
  {
    id: 'sp-3',
    type: 'spelling',
    prompt: 'Which spelling is correct?',
    options: ['recieve', 'receive', 'receeve', 'reciive'],
    answer: 1,
    explanation: 'Use the rule “i before e, except after c”: receive.',
  },
  {
    id: 'sp-4',
    type: 'spelling',
    prompt: 'Which spelling is correct?',
    options: ['definate', 'definite', 'defenite', 'definit'],
    answer: 1,
    explanation: 'Definite ends in -ite, like infinite and finite.',
  },
  {
    id: 'sp-5',
    type: 'spelling',
    prompt: 'Which spelling is correct?',
    options: ['occurence', 'occurrence', 'ocurrence', 'occurrance'],
    answer: 1,
    explanation: 'Occurrence keeps the double r of occur and adds -ence.',
  },
  {
    id: 'sp-6',
    type: 'spelling',
    prompt: 'Which spelling is correct?',
    options: ['priviledge', 'privilege', 'privilige', 'privelege'],
    answer: 1,
    explanation: 'Privilege has no d: priv-i-lege.',
  },
  {
    id: 'sp-7',
    type: 'spelling',
    prompt: 'Which spelling is correct?',
    options: ['conscientious', 'consciencious', 'concientious', 'conscientous'],
    answer: 0,
    explanation: 'Conscientious contains the word “science” in the middle: con-sci-en-tious.',
  },
  {
    id: 'sp-8',
    type: 'spelling',
    prompt: 'Which spelling is correct?',
    options: ['embarass', 'embarrass', 'embarras', 'embarres'],
    answer: 1,
    explanation: 'Embarrass has two r’s and two s’s.',
  },

  // ---------- Word choice ----------
  {
    id: 'wc-1',
    type: 'word-choice',
    prompt: 'Which word best replaces “showed clearly” in an academic sentence?',
    passage: 'The experiment _____ that the treatment reduced recovery time.',
    options: ['demonstrated', 'talked about', 'did', 'was about'],
    answer: 0,
    explanation: '“Demonstrated” names the act of showing with evidence. The others are vague or ungrammatical here.',
  },
  {
    id: 'wc-2',
    type: 'word-choice',
    prompt: 'Which replacement makes “very important” more precise?',
    passage: 'The second vote was very important to the outcome.',
    options: ['decisive', 'big', 'really important', 'good'],
    answer: 0,
    explanation: '“Decisive” says exactly how it mattered: it determined the outcome.',
  },
  {
    id: 'wc-3',
    type: 'word-choice',
    prompt: 'Which verb best fits the sentence?',
    passage: 'The new evidence _____ the authors’ conclusion.',
    options: ['corroborates', 'says', 'talks to', 'makes'],
    answer: 0,
    explanation: '“Corroborates” means confirms with additional evidence — precisely the relation described.',
  },
  {
    id: 'wc-4',
    type: 'word-choice',
    prompt: 'The writer admits a weakness in her own argument. Which verb is most precise?',
    passage: 'The author _____ that the sample is too small to settle the question.',
    options: ['concedes', 'denies', 'shouts', 'forgets'],
    answer: 0,
    explanation: 'To concede is to admit a point, often reluctantly — exactly what the sentence describes.',
  },
  {
    id: 'wc-5',
    type: 'word-choice',
    prompt: 'Which word is the most precise replacement for “a lot of” in this sentence?',
    passage: '_____ studies reach the same conclusion.',
    options: ['Numerous', 'Many many', 'A lot of', 'Some'],
    answer: 0,
    explanation: '“Numerous” is concise and formal. “Some” weakens the claim; the others are redundant.',
  },
  {
    id: 'wc-6',
    type: 'word-choice',
    prompt: 'Which verb makes the sentence more exact?',
    passage: 'The essay _____ the language of the advertisement.',
    options: ['analyses', 'looks at', 'goes into', 'does'],
    answer: 0,
    explanation: '“Analyses” names the method: breaking the language down to examine how it works.',
  },
  {
    id: 'wc-7',
    type: 'word-choice',
    prompt: 'Which word best replaces “bad effect”?',
    passage: 'The policy had a bad effect on the poorest households.',
    options: ['harmful', 'negative-ish', 'not good', 'unfortunate'],
    answer: 0,
    explanation: '“Harmful” states the kind of damage; “unfortunate” merely expresses sympathy.',
  },
  {
    id: 'wc-8',
    type: 'word-choice',
    prompt: 'Which verb is strongest in a rhetorical analysis?',
    passage: 'The closing image _____ a sense of unresolved guilt.',
    options: ['evokes', 'makes', 'does', 'has'],
    answer: 0,
    explanation: '“Evokes” describes how language calls a feeling into being.',
  },

  // ---------- Clarity ----------
  {
    id: 'cl-1',
    type: 'clarity',
    prompt: 'Which sentence is clearer?',
    options: [
      'The committee rejected the proposal.',
      'The proposal was rejected by the committee.',
      'There was a rejection of the proposal by the committee.',
      'A rejection happened to the proposal.',
    ],
    answer: 0,
    explanation: 'The active sentence names the actor first and uses fewer words.',
  },
  {
    id: 'cl-2',
    type: 'clarity',
    prompt: 'Which version is the most concise?',
    options: [
      'Because the train was late, we missed the meeting.',
      'Due to the fact that the train was late, we missed the meeting.',
      'Owing to the circumstance of the train being late, we missed the meeting.',
      'The train was late, and this had the effect that we missed the meeting.',
    ],
    answer: 0,
    explanation: '“Because” does the same work as “due to the fact that” in one word.',
  },
  {
    id: 'cl-3',
    type: 'clarity',
    prompt: 'Which sentence avoids a delayed subject?',
    options: [
      'Three reasons explain the delay.',
      'There are three reasons that explain the delay.',
      'It is three reasons that explain the delay.',
      'What explains the delay is that there are three reasons.',
    ],
    answer: 0,
    explanation: '“Three reasons explain” puts the real subject at the front.',
  },
  {
    id: 'cl-4',
    type: 'clarity',
    prompt: 'Which sentence is free of filler?',
    options: [
      'The evidence is thin.',
      'The evidence is really quite thin.',
      'Basically, the evidence is kind of thin.',
      'The evidence is actually pretty thin, sort of.',
    ],
    answer: 0,
    explanation: 'The qualifiers add hesitation rather than meaning. If the evidence is thin, say so.',
  },
  {
    id: 'cl-5',
    type: 'clarity',
    prompt: 'Which sentence uses parallel structure?',
    options: [
      'She likes reading, writing and painting.',
      'She likes reading, writing and to paint.',
      'She likes to read, writing and paint.',
      'She likes reading, to write and painting.',
    ],
    answer: 0,
    explanation: 'All three items are gerunds: reading, writing, painting.',
  },
  {
    id: 'cl-6',
    type: 'clarity',
    prompt: 'Which sentence avoids a dangling modifier?',
    options: [
      'Walking to work, I was soaked by the rain.',
      'Walking to work, the rain soaked me.',
      'Walking to work, the rain was soaking.',
      'Walking to work, it rained on me.',
    ],
    answer: 0,
    explanation: 'The person walking must be the subject of the main clause: I was soaked.',
  },
  {
    id: 'cl-7',
    type: 'clarity',
    prompt: 'Which version removes the ambiguous pronoun?',
    options: [
      'When the manager met the intern, the intern was nervous.',
      'When the manager met the intern, she was nervous.',
      'When the manager met the intern, they were nervous.',
      'When the manager met the intern, it was nervous.',
    ],
    answer: 0,
    explanation: 'Naming the person removes the question of who “she” refers to.',
  },
  {
    id: 'cl-8',
    type: 'clarity',
    prompt: 'Which sentence is a complete sentence, not a comma splice?',
    options: [
      'The results were inconclusive; the sample was too small.',
      'The results were inconclusive, the sample was too small.',
      'The results were inconclusive, because the sample was too small, however.',
      'The results were inconclusive, the sample being too small, and.',
    ],
    answer: 0,
    explanation: 'A semicolon can join two independent clauses; a comma alone cannot.',
  },

  // ---------- Structure ----------
  {
    id: 'st-1',
    type: 'structure',
    prompt: 'Which sentence is a thesis rather than a topic?',
    options: [
      'This essay will discuss the costs of remote work.',
      'Remote work has quietly shifted the cost of office space onto employees.',
      'Remote work is a topic of growing interest.',
      'There are many opinions about remote work.',
    ],
    answer: 1,
    explanation: 'A thesis makes a specific claim that someone could dispute. The others announce a topic.',
  },
  {
    id: 'st-2',
    type: 'structure',
    prompt: 'Which is the strongest topic sentence for a paragraph about evidence?',
    options: [
      'Evidence is important.',
      'The study’s sample was too small to justify its sweeping conclusion.',
      'In this paragraph I will talk about the study.',
      'Many studies exist on this subject.',
    ],
    answer: 1,
    explanation: 'It makes one arguable claim that the rest of the paragraph can develop.',
  },
  {
    id: 'st-3',
    type: 'structure',
    prompt: 'Which sentence states a counterargument fairly?',
    options: [
      'Some people wrongly think the policy will fail.',
      'Critics argue that the policy will raise costs for the poorest households.',
      'The policy is obviously correct.',
      'There is no serious opposition to the policy.',
    ],
    answer: 1,
    explanation: 'It gives the objection its own terms and its strongest form, without belittling it.',
  },
  {
    id: 'st-4',
    type: 'structure',
    prompt: 'Which conclusion does the most work?',
    options: [
      'In conclusion, this essay has discussed the topic.',
      'The policy is therefore worth its cost — but only if the rebate reaches the households it promises to protect.',
      'Thank you for reading my essay.',
      'There are many sides to this issue.',
    ],
    answer: 1,
    explanation: 'It returns to the claim, accepts a condition, and gives the reader something to act on.',
  },
  {
    id: 'st-5',
    type: 'structure',
    prompt: 'You are comparing two policies. What should come before the descriptions?',
    options: [
      'A conclusion',
      'A shared set of comparison criteria',
      'A long quotation',
      'A paragraph about your own experience',
    ],
    answer: 1,
    explanation: 'Without shared criteria, the comparison becomes two unrelated summaries.',
  },
  {
    id: 'st-6',
    type: 'structure',
    prompt: 'Which claim confuses correlation with causation?',
    options: [
      'Ice-cream sales and drowning deaths both rise in summer.',
      'Ice-cream sales cause drowning deaths.',
      'Summer weather raises both ice-cream sales and swimming.',
      'The two trends are correlated but not causal.',
    ],
    answer: 1,
    explanation: 'The correlation is real, but the causal claim is unsupported: a third factor explains both.',
  },
  {
    id: 'st-7',
    type: 'structure',
    prompt: 'A definition essay should do which of the following?',
    options: [
      'Give examples only',
      'Set criteria and test a borderline case',
      'Copy a dictionary entry',
      'Avoid ruling anything out',
    ],
    answer: 1,
    explanation: 'A definition earns its keep by ruling cases in and out. Examples alone cannot do that.',
  },
  {
    id: 'st-8',
    type: 'structure',
    prompt: 'Which order best builds a problem–solution paragraph?',
    options: [
      'Solution, problem, cost, ask',
      'Problem, cost, cause, proposal, feasibility, ask',
      'Ask, proposal, problem, cost',
      'Cause, ask, problem, solution',
    ],
    answer: 1,
    explanation: 'Establish the problem and its cost before asking the reader to accept a remedy.',
  },
]

export function exercisesByType(type) {
  return exercises.filter((exercise) => exercise.type === type)
}

export function pickSession(count = 6) {
  const byType = new Map()
  for (const type of exerciseTypes) byType.set(type.id, [])
  for (const exercise of exercises) byType.get(exercise.type)?.push(exercise)

  const pools = [...byType.values()].map((pool) => [...pool])
  const session = []
  let index = 0
  while (session.length < count && pools.some((pool) => pool.length)) {
    const pool = pools[index % pools.length]
    if (pool.length) {
      const pick = Math.floor(Math.random() * pool.length)
      session.push(pool.splice(pick, 1)[0])
    }
    index += 1
  }
  return session
}
