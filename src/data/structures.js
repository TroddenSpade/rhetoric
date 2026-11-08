export const structures = [
  {
    id: 'argument',
    name: 'Argument',
    tagline: 'Make a claim, earn it with reasons, and answer the objection.',
    when: 'Essays, op-eds, debate cases, cover letters, proposals.',
    description:
      'An argument is not an opinion with volume. It is a claim that a sceptical reader could test, supported by reasons and evidence, and strengthened by an honest account of what might be wrong with it.',
    target: 700,
    sections: [
      { name: 'Hook', prompt: 'Open with a concrete scene, a surprising fact, or the stakes of the question.' },
      { name: 'Claim', prompt: 'State the thesis in one sentence. Make it specific enough to disagree with.' },
      { name: 'Reasons and evidence', prompt: 'Give two or three reasons. For each, name the evidence and explain why it supports the claim.' },
      { name: 'Counterargument', prompt: 'State the strongest objection fairly, in its own terms.' },
      { name: 'Rebuttal', prompt: 'Concede what is true, then show why the objection does not overturn the claim.' },
      { name: 'Conclusion', prompt: 'Return to the stakes. Say what follows if the reader accepts the claim.' },
    ],
    tips: [
      'A thesis you cannot imagine anyone denying is probably a description, not an argument.',
      'Evidence does not speak for itself: always add the sentence that says why it matters.',
      'Steel-man the objection. A weak counterargument makes the whole essay look weak.',
    ],
    skeleton: `# Title

[Hook: a scene, fact or question that makes the issue urgent.]

[Claim: in one or two sentences, state the thesis and why it matters.]

## First reason

[State the reason. Then give the evidence: a study, example, quotation or figure.]

[Explain the link: why does this evidence support the claim?]

## Second reason

[State the reason. Then give the evidence.]

[Explain the link.]

## The strongest objection

[State the objection fairly. Give it its best case.]

[Concede what is true. Then explain why the claim still holds.]

## Conclusion

[Return to the stakes. What should the reader now believe, or do?]`,
  },
  {
    id: 'compare',
    name: 'Compare & contrast',
    tagline: 'Hold two things beside each other until the difference becomes clear.',
    when: 'Reviews, literary analysis, policy options, product decisions.',
    description:
      'Comparison is only useful when both subjects are measured against the same criteria. Decide the basis of comparison before you describe either side, or the essay becomes two summaries in a trench coat.',
    target: 650,
    sections: [
      { name: 'Framing', prompt: 'Why compare these two? What decision or understanding depends on it?' },
      { name: 'Basis of comparison', prompt: 'Name the two or three criteria you will use for both subjects.' },
      { name: 'First subject', prompt: 'Describe subject A against each criterion. Keep the criteria in the same order.' },
      { name: 'Second subject', prompt: 'Describe subject B against the same criteria, in the same order.' },
      { name: 'The difference that matters', prompt: 'Go beyond listing differences. Say which one matters and why.' },
      { name: 'Synthesis', prompt: 'What should the reader conclude? Is there a third option or a trade-off to accept?' },
    ],
    tips: [
      'Alternate between subjects only after both have been introduced; otherwise the reader loses the thread.',
      'Use the same criteria for both sides. Changing the yardstick halfway is the most common cheat in comparison.',
      'End with a judgement, not a table of contents.',
    ],
    skeleton: `# Title

[Framing: why does this comparison matter?]

Both [A] and [B] will be judged on three criteria: [criterion 1], [criterion 2] and [criterion 3].

## [A]

[Describe A against criterion 1.]

[Describe A against criterion 2.]

[Describe A against criterion 3.]

## [B]

[Describe B against criterion 1.]

[Describe B against criterion 2.]

[Describe B against criterion 3.]

## The difference that matters

[Which difference is decisive? Why does it outweigh the others?]

## Conclusion

[State the judgement. Name the trade-off the reader must accept.]`,
  },
  {
    id: 'problem-solution',
    name: 'Problem & solution',
    tagline: 'Show that the problem is real, then make the remedy credible.',
    when: 'Policy writing, proposals, reports, persuasive emails.',
    description:
      'A solution is only as persuasive as the problem is concrete. Establish who is affected, what it costs, and why the obvious response has failed. Then make the proposal specific enough to imagine.',
    target: 650,
    sections: [
      { name: 'The problem', prompt: 'State the problem in concrete terms: who, where, and how often?' },
      { name: 'The cost', prompt: 'What does the problem cost — money, time, health, trust, opportunity?' },
      { name: 'Why it persists', prompt: 'Name the mechanism. Why has the obvious solution not worked?' },
      { name: 'The proposal', prompt: 'Describe the remedy in plain terms. Who does what, by when?' },
      { name: 'Feasibility', prompt: 'Answer the practical objections: cost, capacity, side effects.' },
      { name: 'The ask', prompt: 'End with a specific action the reader can take.' },
    ],
    tips: [
      'Quantify the problem if you can; a number makes the cost visible.',
      'A proposal without a mechanism is a wish. Say who does what.',
      'Answer the cost objection directly. Pretending it does not exist loses the reader.',
    ],
    skeleton: `# Title

## The problem

[Who is affected, where, and how often? Give a concrete example.]

## What it costs

[Quantify the cost: time, money, health, trust or opportunity.]

## Why it persists

[Name the mechanism. Why has the obvious response failed?]

## The proposal

[Describe the remedy. Who does what, by when, and with what resources?]

## Can it work?

[Answer the practical objections: cost, capacity, side effects, precedent.]

## The ask

[One specific action the reader can take now.]`,
  },
  {
    id: 'narrative',
    name: 'Narrative',
    tagline: 'Turn a sequence of events into a change the reader can feel.',
    when: 'Personal essays, profiles, openings, anecdotes, talks.',
    description:
      'A narrative is not a list of things that happened. It is a change: someone wants something, meets resistance, and is different at the end. The scene does the work that summary cannot.',
    target: 800,
    sections: [
      { name: 'Status quo', prompt: 'Show the world before the change. Give one concrete detail that will matter later.' },
      { name: 'Want', prompt: 'What does the central figure want, and what stands in the way?' },
      { name: 'Inciting incident', prompt: 'The moment the ordinary day stops being ordinary.' },
      { name: 'Rising action', prompt: 'Two or three attempts, each raising the cost of failure.' },
      { name: 'The turn', prompt: 'The moment of choice, discovery or reversal. Slow down here.' },
      { name: 'Resolution', prompt: 'Show the new state. Avoid explaining the moral.' },
      { name: 'Reflection', prompt: 'One short step back: what does the story mean now that it is over?' },
    ],
    tips: [
      'Summarise transitions and dramatise turns. Not every minute deserves a scene.',
      'Use sensory detail selectively; one precise smell beats five decorative adjectives.',
      'The meaning should be visible in the change, not announced in the last line.',
    ],
    skeleton: `# Title

[Status quo: a concrete scene. One detail that will return later.]

[Want: what does the central figure want? What is in the way?]

[Inciting incident: the moment the ordinary day stops being ordinary.]

[Rising action: attempt one. What does it cost?]

[Attempt two. Raise the stakes.]

[The turn: the choice, discovery or reversal. Slow down. Use detail.]

[Resolution: show the new state. Do not explain it yet.]

[Reflection: one short step back. What does the story mean now?]`,
  },
  {
    id: 'definition',
    name: 'Definition',
    tagline: 'Take a word people think they know and make it precise.',
    when: 'Conceptual essays, exam answers, policy definitions, philosophy.',
    description:
      'A definition essay earns its length by showing that the ordinary use of a word is unstable. You distinguish the term from its neighbours, set criteria, test borderline cases, and show why the distinction matters.',
    target: 600,
    sections: [
      { name: 'The term', prompt: 'Introduce the word and the confusion surrounding it.' },
      { name: 'Common view', prompt: 'State the ordinary or dictionary definition fairly.' },
      { name: 'The problem', prompt: 'Show a case where the common view breaks down.' },
      { name: 'Your distinction', prompt: 'Offer the criterion that separates the term from its neighbours.' },
      { name: 'Borderline cases', prompt: 'Test the definition against two hard cases.' },
      { name: 'Consequences', prompt: 'Why does this definition matter in practice?' },
    ],
    tips: [
      'Define by criteria, not by examples alone. Examples illustrate; criteria decide.',
      'A good definition rules something out. If it includes everything, it does no work.',
      'Test the definition against a case you wish were excluded.',
    ],
    skeleton: `# Title

[Introduce the term and the confusion around it.]

## The common view

[State the ordinary definition fairly.]

## Where it breaks down

[Give a case the common view cannot handle.]

## A better distinction

[Offer the criterion that separates the term from its neighbours.]

## Two hard cases

[Test case one. Does it fit? Why?]

[Test case two. Does it fit? Why?]

## Why it matters

[Show the practical consequence of the definition.]`,
  },
  {
    id: 'cause-effect',
    name: 'Cause & effect',
    tagline: 'Distinguish the trigger from the underlying cause.',
    when: 'History, analysis, explainers, post-mortems, science writing.',
    description:
      'The event just before an outcome is not always its cause. Separate the trigger from the underlying condition, look for mechanisms, and consider the causes that did not fire.',
    target: 650,
    sections: [
      { name: 'The effect', prompt: 'Describe the outcome precisely. When did it happen, and how do we know?' },
      { name: 'The trigger', prompt: 'What immediate event set it off?' },
      { name: 'Underlying causes', prompt: 'What conditions made the outcome possible or likely?' },
      { name: 'Mechanism', prompt: 'Explain the path from cause to effect. Do not rely on correlation.' },
      { name: 'Rival explanations', prompt: 'Consider at least one other cause and say why it is weaker.' },
      { name: 'Implication', prompt: 'What follows for prediction or policy?' },
    ],
    tips: [
      'Distinguish correlation from causation; the rooster does not cause the sunrise.',
      'Look for a mechanism. “Because of” is not an explanation.',
      'Ask what did not happen: the dog that did not bark is evidence too.',
    ],
    skeleton: `# Title

## The outcome

[Describe the effect precisely. When, where, and how was it measured?]

## The trigger

[What immediate event set it off?]

## The conditions beneath it

[What underlying conditions made the outcome possible?]

## How it happened

[Explain the mechanism, step by step.]

## Another explanation

[Consider a rival cause. Why is it weaker?]

## What follows

[What does this mean for prediction, policy or the next decision?]`,
  },
  {
    id: 'description',
    name: 'Description',
    tagline: 'Make the reader see the place before they interpret it.',
    when: 'Travel writing, fiction, memoir, scene-setting, product copy.',
    description:
      'Description is selection, not inventory. Choose the few details that reveal the place and the observer. Move the eye deliberately, and let one detail carry more weight than the rest.',
    target: 450,
    sections: [
      { name: 'Establishing shot', prompt: 'Set the whole scene in one or two sentences. Where are we, and when?' },
      { name: 'Selective detail', prompt: 'Choose three details that a camera would notice. Avoid a list.' },
      { name: 'Movement', prompt: 'Move the eye or the body through the space. Give the reader a path.' },
      { name: 'Sensory turn', prompt: 'Introduce one non-visual sense: sound, smell, texture, temperature.' },
      { name: 'The revealing detail', prompt: 'One detail that implies a story or a history.' },
      { name: 'Meaning', prompt: 'Let the description settle into a feeling or thought, without stating it outright.' },
    ],
    tips: [
      'Prefer verbs to adjectives. “The shutter knocked” beats “the old, noisy shutter”.',
      'One surprising detail is worth five expected ones.',
      'Let the observer’s attention reveal the observer.',
    ],
    skeleton: `# Title

[Establishing shot: where and when, in one or two sentences.]

[Three selected details. Choose what a camera would notice.]

[Move the eye or body through the space.]

[One non-visual sense: sound, smell, texture, temperature.]

[The revealing detail: the thing that implies a history.]

[Meaning: let the description settle into a feeling or thought.]`,
  },
  {
    id: 'rhetorical-analysis',
    name: 'Rhetorical analysis',
    tagline: 'Explain how a text persuades, not just what it says.',
    when: 'English essays, media criticism, speech analysis, close reading.',
    description:
      'A rhetorical analysis asks how a text works on its audience. Reconstruct the situation, identify the appeals and figures, and judge whether the choices are effective for that audience and purpose.',
    target: 750,
    sections: [
      { name: 'Occasion', prompt: 'What occasion prompted the text? What is at stake, and for whom?' },
      { name: 'Audience and purpose', prompt: 'Who is addressed? What does the speaker want them to think, feel or do?' },
      { name: 'Ethos', prompt: 'How does the speaker establish credibility? What is claimed, and what is left out?' },
      { name: 'Logos', prompt: 'What reasons and evidence are offered? Are the inferences sound?' },
      { name: 'Pathos', prompt: 'Which emotions are stirred, and by what means?' },
      { name: 'Style and figures', prompt: 'Name two or three figures or syntactic choices and explain their effect.' },
      { name: 'Judgement', prompt: 'Is the persuasion effective for this audience? At what cost?' },
    ],
    tips: [
      'Do not summarise the text. Assume the reader knows it; analyse the moves.',
      'Name the device, quote it, then explain its effect on this audience. Three steps, every time.',
      'Effectiveness is not the same as truth. A persuasive lie is still rhetorically effective.',
    ],
    skeleton: `# Title

## The occasion

[What prompted the text? What is at stake, and for whom?]

## Audience and purpose

[Who is addressed? What should they think, feel or do?]

## Ethos

[How is credibility built? Quote the move. What is omitted?]

## Logos

[What reasons and evidence are offered? Are the inferences sound?]

## Pathos

[Which emotions are stirred? Quote the language that stirs them.]

## Style

[Name two figures or syntactic choices. Quote them. Explain the effect on this audience.]

## Judgement

[Is the persuasion effective? At what cost?]`,
  },
  {
    id: 'paragraph',
    name: 'The paragraph',
    tagline: 'One idea, developed and linked. The unit of all good prose.',
    when: 'Any draft. Use this when a paragraph feels loose or overloaded.',
    description:
      'A paragraph is a promise: one idea, made in the first sentence, developed in the middle, and handed to the next paragraph at the end. If a paragraph contains two ideas, it is probably two paragraphs.',
    target: 180,
    sections: [
      { name: 'Topic sentence', prompt: 'State the one idea of the paragraph. Make it a claim, not a label.' },
      { name: 'Development', prompt: 'Explain the idea in your own words. Define any term the reader might resist.' },
      { name: 'Evidence', prompt: 'Give the example, quotation, figure or scene that earns the claim.' },
      { name: 'Interpretation', prompt: 'Say what the evidence shows. Do not leave the reader to infer it.' },
      { name: 'Link', prompt: 'Connect to the next paragraph, or return to the main argument.' },
    ],
    tips: [
      'If you can summarise the paragraph in a phrase, that phrase belongs in the topic sentence.',
      'Evidence without interpretation is decoration.',
      'A one-sentence paragraph can be a useful drumbeat — use it deliberately.',
    ],
    skeleton: `[Topic sentence: one claim, specific enough to argue with.]

[Development: explain the idea. Define the terms that matter.]

[Evidence: an example, quotation, figure or scene.]

[Interpretation: say what the evidence shows and why it supports the claim.]

[Link: connect to the next paragraph or back to the main argument.]`,
  },
]

export function findStructure(id) {
  return structures.find((structure) => structure.id === id) || null
}
