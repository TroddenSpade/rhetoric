// A compact, curated wordbook. It is the offline backbone of the app: every
// entry is available without a network connection, and Datamuse adds further
// suggestions when the device is online.
//
// Row shape: [word, part of speech, gloss, synonyms, antonyms, example]

function build(category, rows) {
  return rows.map(([word, pos, gloss, synonyms, antonyms, example]) => ({
    word,
    pos,
    gloss,
    synonyms,
    antonyms,
    example,
    category,
  }))
}

const vague = build('Vague', [
  ['thing', 'noun', 'An unnamed object, fact or matter. Name the particular thing.', ['object', 'item', 'detail', 'element', 'matter', 'issue', 'factor'], [], 'The detail that changed my mind was the cost.'],
  ['stuff', 'noun', 'A loose collection of things or material.', ['material', 'belongings', 'contents', 'matter', 'equipment', 'work'], [], 'The equipment in the studio had not been touched.'],
  ['good', 'adjective', 'Pleasing or satisfactory, but too general to evaluate.', ['excellent', 'sound', 'effective', 'skilful', 'reliable', 'generous'], ['poor', 'weak', 'bad'], 'The argument is sound because every claim has evidence.'],
  ['bad', 'adjective', 'Unpleasant or unsatisfactory, with no reason given.', ['harmful', 'flawed', 'unwise', 'ineffective', 'damaging', 'poor'], ['good', 'sound', 'beneficial'], 'The policy was flawed in one decisive respect.'],
  ['nice', 'adjective', 'Agreeable, but so broad that it says almost nothing.', ['kind', 'pleasant', 'thoughtful', 'graceful', 'warm', 'considerate'], ['unkind', 'rude', 'harsh'], 'She was generous with her time and exact in her praise.'],
  ['big', 'adjective', 'Large in size, scope or importance.', ['substantial', 'vast', 'considerable', 'major', 'sweeping', 'significant'], ['small', 'minor', 'slight'], 'The proposal would require a substantial change in policy.'],
  ['small', 'adjective', 'Limited in size, amount or consequence.', ['slight', 'modest', 'minor', 'compact', 'narrow', 'faint'], ['large', 'major', 'vast'], 'A modest adjustment to the wording would resolve the ambiguity.'],
  ['important', 'adjective', 'Mattering a great deal, but without saying why.', ['decisive', 'essential', 'consequential', 'central', 'critical', 'weighty'], ['trivial', 'minor', 'peripheral'], 'The decisive question is who bears the cost.'],
  ['interesting', 'adjective', 'Holding attention; explain what holds it.', ['intriguing', 'revealing', 'provocative', 'striking', 'curious', 'absorbing'], ['dull', 'tedious', 'predictable'], 'The most revealing detail is what the report leaves out.'],
  ['difficult', 'adjective', 'Hard to do or understand.', ['demanding', 'arduous', 'taxing', 'intricate', 'strenuous', 'delicate'], ['easy', 'simple', 'effortless'], 'The negotiation was delicate because both sides had already committed publicly.'],
  ['easy', 'adjective', 'Requiring little effort or thought.', ['straightforward', 'effortless', 'simple', 'uncomplicated', 'manageable'], ['difficult', 'arduous', 'complex'], 'The fix is straightforward once the cause is known.'],
  ['different', 'adjective', 'Unlike something else; say how.', ['distinct', 'contrasting', 'unlike', 'divergent', 'alternative', 'separate'], ['similar', 'identical', 'alike'], 'The two accounts are distinct in both tone and evidence.'],
  ['many', 'adjective', 'A large but unspecified number.', ['numerous', 'countless', 'several', 'a majority of', 'a range of'], ['few', 'scarce'], 'Numerous studies reach the same conclusion.'],
  ['some', 'determiner', 'An unspecified amount or number.', ['several', 'a few', 'certain', 'a portion of'], ['all', 'none'], 'Several readers raised the same objection.'],
  ['people', 'noun', 'Human beings in general; name the group.', ['citizens', 'residents', 'readers', 'workers', 'participants', 'communities'], [], 'Residents of the district were never consulted.'],
  ['society', 'noun', 'A broad collective; specify which part and which relation.', ['communities', 'the public', 'institutions', 'a culture', 'civic life'], [], 'Public institutions absorbed most of the cost.'],
  ['problem', 'noun', 'A difficulty to be solved; name the mechanism.', ['obstacle', 'flaw', 'conflict', 'shortfall', 'failure', 'constraint', 'risk'], ['solution', 'remedy'], 'The shortfall arises from a delay in the supply chain.'],
  ['solution', 'noun', 'A means of resolving a problem.', ['remedy', 'fix', 'measure', 'response', 'approach', 'resolution'], ['problem', 'obstacle'], 'The most durable remedy is to publish the data.'],
  ['idea', 'noun', 'A thought or proposal; state the claim.', ['concept', 'proposal', 'insight', 'theory', 'principle', 'notion'], [], 'The proposal rests on a simple principle: make the cost visible.'],
  ['result', 'noun', 'An outcome; say what caused it and how it was measured.', ['outcome', 'effect', 'consequence', 'finding', 'yield'], ['cause', 'origin'], 'The measured outcome was a twelve per cent fall in delays.'],
  ['reason', 'noun', 'A cause or justification.', ['cause', 'motive', 'grounds', 'justification', 'explanation'], ['consequence', 'effect'], 'The grounds for the decision were never published.'],
  ['benefit', 'noun', 'An advantage or gain.', ['advantage', 'gain', 'dividend', 'improvement', 'strength'], ['drawback', 'cost', 'harm'], 'The clearest gain is a shorter waiting time.'],
  ['drawback', 'noun', 'A disadvantage or cost.', ['disadvantage', 'cost', 'limitation', 'weakness', 'risk'], ['benefit', 'advantage'], 'The principal limitation is the small sample.'],
  ['goal', 'noun', 'An intended result.', ['aim', 'objective', 'target', 'purpose', 'ambition'], [], 'The objective is to halve the error rate within a year.'],
  ['method', 'noun', 'A way of doing something.', ['approach', 'technique', 'procedure', 'system', 'practice'], [], 'The procedure can be repeated by any careful reader.'],
  ['situation', 'noun', 'A set of circumstances; describe the particulars.', ['circumstances', 'condition', 'predicament', 'context', 'state of affairs'], [], 'In these circumstances, delay is the safer choice.'],
  ['change', 'noun', 'An alteration; say what changed and by how much.', ['shift', 'revision', 'transformation', 'adjustment', 'turn'], ['continuity', 'stability'], 'The revision cut the waiting time by half.'],
  ['help', 'verb', 'To make something easier or better.', ['assist', 'support', 'enable', 'strengthen', 'relieve', 'guide'], ['hinder', 'obstruct'], 'The notes enable a new reader to follow the argument.'],
  ['use', 'verb', 'To employ something for a purpose.', ['employ', 'apply', 'draw on', 'adopt', 'exercise', 'wield'], ['discard', 'neglect'], 'The essay draws on three kinds of evidence.'],
  ['make', 'verb', 'To create, cause or force.', ['create', 'produce', 'build', 'shape', 'cause', 'compel'], ['destroy', 'undo'], 'The design shapes how readers move through the page.'],
  ['get', 'verb', 'To obtain, receive or become.', ['obtain', 'receive', 'acquire', 'gain', 'secure', 'become'], ['lose', 'give'], 'The committee obtained the records after a formal request.'],
  ['a lot', 'phrase', 'A large amount, used without a measure.', ['considerably', 'substantially', 'a great deal', 'much', 'frequently'], ['little', 'rarely'], 'The second draft is considerably shorter.'],
  ['very', 'adverb', 'An intensifier that usually weakens the word it modifies.', ['remarkably', 'especially', 'unusually', 'particularly'], ['slightly', 'barely'], 'The evidence is particularly strong on this point.'],
  ['really', 'adverb', 'An intensifier or hedge, rarely needed.', ['genuinely', 'truly', 'especially', 'in fact'], ['barely', 'hardly'], 'The claim is genuinely difficult to test.'],
])

const precision = build('Precision', [
  ['show', 'verb', 'To make something visible or evident.', ['demonstrate', 'reveal', 'illustrate', 'display', 'establish', 'indicate'], ['conceal', 'hide'], 'The chart demonstrates a steady decline.'],
  ['say', 'verb', 'To express in words.', ['state', 'argue', 'claim', 'observe', 'reply', 'insist', 'concede'], ['withhold'], 'The author claims that the policy failed.'],
  ['tell', 'verb', 'To inform or narrate.', ['inform', 'recount', 'narrate', 'report', 'explain'], ['withhold'], 'The report recounts three separate failures.'],
  ['think', 'verb', 'To hold an opinion or use the mind.', ['believe', 'consider', 'judge', 'suspect', 'reason', 'maintain'], ['doubt'], 'I suspect the sample is too small to settle the question.'],
  ['want', 'verb', 'To desire or require.', ['wish', 'seek', 'intend', 'aim', 'require', 'prefer'], ['reject', 'decline'], 'The committee seeks a clearer definition.'],
  ['need', 'verb', 'To require as necessary.', ['require', 'demand', 'depend on', 'call for', 'necessitate'], ['forgo'], 'The argument requires a stronger premise.'],
  ['look', 'verb', 'To direct the eyes or examine.', ['examine', 'inspect', 'survey', 'study', 'glance', 'regard'], ['ignore'], 'The chapter examines three competing explanations.'],
  ['walk', 'verb', 'To move on foot.', ['stride', 'stroll', 'amble', 'march', 'wander', 'pace'], ['run', 'stop'], 'She paced the corridor while the votes were counted.'],
  ['begin', 'verb', 'To start.', ['open', 'commence', 'launch', 'initiate', 'arise', 'originate'], ['end', 'conclude'], 'The essay opens with a concrete scene.'],
  ['end', 'verb', 'To bring or come to a close.', ['conclude', 'close', 'finish', 'culminate', 'cease'], ['begin', 'start'], 'The final paragraph returns to the opening image.'],
  ['grow', 'verb', 'To increase in size or degree.', ['expand', 'increase', 'develop', 'flourish', 'accumulate', 'intensify'], ['shrink', 'decline'], 'The movement grew as the cost of living rose.'],
  ['create', 'verb', 'To bring into existence.', ['produce', 'build', 'design', 'establish', 'generate', 'compose'], ['destroy', 'erase'], 'The reform generated a new set of obligations.'],
  ['improve', 'verb', 'To make or become better.', ['strengthen', 'refine', 'enhance', 'upgrade', 'advance', 'sharpen'], ['worsen', 'damage'], 'The revision sharpens the central claim.'],
  ['reduce', 'verb', 'To make smaller or less.', ['cut', 'lower', 'diminish', 'shrink', 'curb', 'ease'], ['increase', 'raise'], 'The measure cut waiting times by a third.'],
  ['increase', 'verb', 'To make or become larger.', ['raise', 'expand', 'grow', 'intensify', 'add to', 'amplify'], ['reduce', 'lower'], 'The tax would raise the cost of the cheapest homes.'],
  ['support', 'verb', 'To hold up or argue in favour of.', ['sustain', 'strengthen', 'corroborate', 'back', 'uphold', 'underpin'], ['undermine', 'oppose'], 'The data corroborate the authors’ conclusion.'],
  ['challenge', 'verb', 'To question or invite competition.', ['question', 'dispute', 'contest', 'test', 'confront', 'undermine'], ['accept', 'support'], 'The findings contest the standard account.'],
  ['explain', 'verb', 'To make clear by giving reasons.', ['account for', 'clarify', 'interpret', 'elucidate', 'justify', 'show why'], ['obscure', 'confuse'], 'The chapter accounts for the sudden reversal.'],
  ['describe', 'verb', 'To say what something is like.', ['portray', 'depict', 'characterise', 'outline', 'recount', 'sketch'], ['omit'], 'The opening paragraph sketches the city at dawn.'],
  ['compare', 'verb', 'To examine similarities and differences.', ['contrast', 'set beside', 'weigh', 'juxtapose', 'measure against'], ['separate'], 'The essay sets the two accounts beside each other.'],
  ['evaluate', 'verb', 'To judge value or quality.', ['assess', 'appraise', 'judge', 'weigh', 'measure', 'review'], ['ignore'], 'The report assesses the policy against its own aims.'],
  ['establish', 'verb', 'To show something to be true or secure.', ['demonstrate', 'prove', 'confirm', 'secure', 'found', 'substantiate'], ['disprove', 'undermine'], 'The study substantiates the link between the two.'],
  ['suggest', 'verb', 'To put forward tentatively.', ['propose', 'imply', 'indicate', 'recommend', 'hint', 'advance'], ['deny', 'reject'], 'The pattern suggests a deeper structural cause.'],
  ['emphasise', 'verb', 'To give special weight to.', ['stress', 'highlight', 'underscore', 'accent', 'foreground', 'insist on'], ['play down', 'soften'], 'The author underscores the human cost.'],
  ['consider', 'verb', 'To think about carefully.', ['examine', 'weigh', 'contemplate', 'review', 'take up', 'deliberate on'], ['dismiss', 'ignore'], 'The final section weighs the objections.'],
  ['argue', 'verb', 'To give reasons for a position.', ['contend', 'maintain', 'claim', 'assert', 'reason', 'press'], ['concede'], 'I contend that the distinction is unsustainable.'],
  ['claim', 'verb', 'To assert something as true.', ['assert', 'maintain', 'allege', 'contend', 'state'], ['deny', 'dispute'], 'The advertisement alleges that the product is safe.'],
  ['assert', 'verb', 'To state confidently.', ['declare', 'maintain', 'insist', 'affirm', 'contend'], ['deny', 'question'], 'She affirms that the right is not absolute.'],
  ['concede', 'verb', 'To admit a point, often reluctantly.', ['admit', 'acknowledge', 'grant', 'allow', 'yield'], ['deny', 'refute'], 'The author concedes that the evidence is uneven.'],
  ['refute', 'verb', 'To prove false or wrong.', ['disprove', 'rebut', 'confound', 'invalidate', 'counter'], ['prove', 'confirm'], 'The second experiment refutes the earlier explanation.'],
  ['persuade', 'verb', 'To move someone by argument.', ['convince', 'win over', 'sway', 'move', 'bring round'], ['dissuade', 'deter'], 'The speech won over the undecided members.'],
  ['appeal', 'verb', 'To make a serious or urgent request; to be attractive.', ['plead', 'call on', 'invoke', 'attract', 'resonate'], ['repel'], 'The closing paragraph appeals to a shared sense of duty.'],
  ['advocate', 'verb', 'To publicly support a cause or policy.', ['champion', 'support', 'promote', 'defend', 'urge', 'back'], ['oppose', 'denounce'], 'The report advocates a public register.'],
  ['denounce', 'verb', 'To condemn publicly.', ['condemn', 'criticise', 'attack', 'censure', 'decry'], ['praise', 'endorse'], 'The editorial condemns the secrecy of the process.'],
  ['defend', 'verb', 'To protect or argue in support of.', ['protect', 'uphold', 'justify', 'vindicate', 'maintain'], ['attack', 'abandon'], 'The chapter defends the decision on pragmatic grounds.'],
  ['illustrate', 'verb', 'To make clear with an example or picture.', ['demonstrate', 'exemplify', 'show', 'clarify', 'depict'], ['obscure'], 'The case exemplifies the wider pattern.'],
  ['summarise', 'verb', 'To state the main points briefly.', ['outline', 'recap', 'condense', 'synthesise', 'abstract'], ['elaborate'], 'The final paragraph condenses the argument into one sentence.'],
  ['analyse', 'verb', 'To break down and examine in detail.', ['examine', 'dissect', 'interpret', 'investigate', 'parse'], ['overlook'], 'The essay dissects the language of the advertisement.'],
  ['reveal', 'verb', 'To make known something previously hidden.', ['disclose', 'expose', 'uncover', 'show', 'divulge'], ['conceal', 'hide'], 'The letters disclose a long-standing disagreement.'],
  ['imply', 'verb', 'To suggest without stating directly.', ['suggest', 'hint', 'insinuate', 'intimate', 'signal'], ['state', 'declare'], 'The silence implies that the issue was settled elsewhere.'],
  ['observe', 'verb', 'To notice or remark.', ['notice', 'remark', 'note', 'perceive', 'comment'], ['ignore', 'overlook'], 'The author remarks that the pattern is not new.'],
  ['note', 'verb', 'To mention or take notice of.', ['remark', 'observe', 'mention', 'record', 'point out'], ['omit'], 'The preface notes two changes to the second edition.'],
  ['propose', 'verb', 'To put forward for consideration.', ['suggest', 'advance', 'recommend', 'put forward', 'nominate'], ['withdraw', 'oppose'], 'The paper proposes a simpler test.'],
  ['address', 'verb', 'To deal with or speak to.', ['tackle', 'confront', 'take up', 'handle', 'speak to'], ['avoid', 'evade'], 'The chapter takes up the hardest objection first.'],
])

const craft = build('Craft', [
  ['writing', 'noun', 'The activity or result of putting words together.', ['prose', 'composition', 'text', 'style', 'expression', 'language'], [], 'Her prose is plain and exact.'],
  ['prose', 'noun', 'Ordinary written language, as distinct from verse.', ['writing', 'text', 'composition', 'style', 'language'], ['verse', 'poetry'], 'The prose is clean, but the argument is thin.'],
  ['sentence', 'noun', 'A complete unit of thought in writing.', ['line', 'clause', 'construction', 'phrase', 'statement'], [], 'The final sentence lands like a door closing.'],
  ['paragraph', 'noun', 'A group of sentences developing one idea.', ['passage', 'section', 'block', 'unit'], [], 'The paragraph does one thing and does it well.'],
  ['essay', 'noun', 'A short piece of writing on a subject.', ['piece', 'article', 'paper', 'study', 'commentary'], [], 'The essay earns its conclusion.'],
  ['argument', 'noun', 'A connected set of reasons offered in support of a claim.', ['case', 'reasoning', 'thesis', 'contention', 'line of thought'], [], 'The argument is stronger for conceding the objection.'],
  ['evidence', 'noun', 'Material offered in support of a claim.', ['proof', 'data', 'testimony', 'grounds', 'support', 'documentation'], [], 'The evidence is suggestive, not conclusive.'],
  ['reader', 'noun', 'The person for whom a text is written.', ['audience', 'addressee', 'recipient', 'public'], [], 'The reader should never have to guess what a pronoun refers to.'],
  ['draft', 'noun', 'A preliminary version of a text.', ['version', 'manuscript', 'revision', 'sketch'], [], 'The second draft is where the argument appears.'],
  ['structure', 'noun', 'The arrangement of parts in a whole.', ['shape', 'arrangement', 'order', 'architecture', 'organisation', 'frame'], ['chaos', 'disorder'], 'The structure is invisible when it works.'],
  ['clarity', 'noun', 'The quality of being easy to understand.', ['lucidity', 'precision', 'transparency', 'plainness', 'coherence'], ['obscurity', 'confusion'], 'Clarity is a courtesy before it is a style.'],
  ['style', 'noun', 'The characteristic way a writer uses language.', ['voice', 'register', 'phrasing', 'manner', 'tone', 'expression'], [], 'The style is formal without being stiff.'],
  ['thesis', 'noun', 'The central claim of an argument.', ['claim', 'contention', 'proposition', 'position', 'argument'], [], 'A thesis should be specific enough to fail.'],
  ['revise', 'verb', 'To reconsider and improve a piece of writing.', ['edit', 'rework', 'refine', 'polish', 'tighten', 'recast'], [], 'Revise for one thing at a time.'],
  ['edit', 'verb', 'To prepare writing for publication by correcting and cutting.', ['revise', 'cut', 'tighten', 'polish', 'proofread', 'correct'], [], 'Edit for the reader, not for the word count.'],
  ['tone', 'noun', 'The attitude a text takes toward its subject or reader.', ['register', 'voice', 'mood', 'attitude', 'inflection'], [], 'The tone is wry without tipping into contempt.'],
  ['audience', 'noun', 'The people a text is meant to reach.', ['readers', 'listeners', 'public', 'addressees', 'community'], [], 'The audience is sceptical, so the claim must be earned.'],
])

const connections = build('Connections', [
  ['however', 'adverb', 'Marks a contrast with what came before.', ['nevertheless', 'yet', 'even so', 'by contrast', 'still'], [], 'The first study found no effect; the second, however, found a small one.'],
  ['therefore', 'adverb', 'Marks a conclusion drawn from what came before.', ['consequently', 'as a result', 'hence', 'accordingly', 'so'], [], 'The sample is small; therefore the result needs replication.'],
  ['moreover', 'adverb', 'Adds a further, often stronger point.', ['furthermore', 'in addition', 'what is more', 'besides', 'on top of that'], [], 'The plan is expensive; moreover, it is unlikely to work.'],
  ['furthermore', 'adverb', 'Adds another point to the argument.', ['moreover', 'in addition', 'also', 'additionally', 'besides'], [], 'The method is transparent; furthermore, it is cheap to repeat.'],
  ['consequently', 'adverb', 'Marks an effect or result.', ['as a result', 'therefore', 'accordingly', 'hence', 'so'], [], 'The deadline moved; consequently, the review was shortened.'],
  ['nevertheless', 'adverb', 'Concedes a point while maintaining the main claim.', ['nonetheless', 'even so', 'still', 'however', 'all the same'], [], 'The evidence is thin; nevertheless, the hypothesis is worth testing.'],
  ['similarly', 'adverb', 'Marks a parallel case.', ['likewise', 'in the same way', 'equally', 'by the same token'], ['conversely'], 'The second district responded similarly.'],
  ['conversely', 'adverb', 'Marks the reversed relation.', ['on the other hand', 'by contrast', 'inversely', 'whereas'], ['similarly'], 'Higher demand raises prices; conversely, lower demand tends to reduce them.'],
  ['meanwhile', 'adverb', 'Marks something happening at the same time.', ['at the same time', 'in the meantime', 'simultaneously'], [], 'The committee deliberated; meanwhile, the deadline passed.'],
  ['finally', 'adverb', 'Marks the last point in a sequence.', ['lastly', 'in the end', 'ultimately', 'to conclude'], ['firstly'], 'Finally, the report considers who will pay.'],
  ['first', 'adverb', 'Marks the first point in a sequence.', ['firstly', 'to begin with', 'in the first place'], ['finally'], 'First, define the terms.'],
  ['second', 'adverb', 'Marks the second point in a sequence.', ['secondly', 'next', 'then'], [], 'Second, test the definition against a hard case.'],
  ['for example', 'phrase', 'Introduces an illustration.', ['for instance', 'by way of illustration', 'as an example', 'such as'], [], 'Some costs are hidden; for example, the time spent waiting.'],
  ['in conclusion', 'phrase', 'Signals the end of an argument.', ['to conclude', 'in sum', 'ultimately', 'on balance'], [], 'In conclusion, the benefits are real but unevenly shared.'],
  ['in addition', 'phrase', 'Adds another point.', ['moreover', 'furthermore', 'also', 'besides', 'on top of that'], [], 'In addition, the scheme would require new staff.'],
  ['on the other hand', 'phrase', 'Introduces a contrasting view.', ['conversely', 'by contrast', 'however', 'alternatively'], [], 'On the other hand, the cost may fall over time.'],
  ['as a result', 'phrase', 'Marks a consequence.', ['consequently', 'therefore', 'accordingly', 'hence'], [], 'The bridge closed; as a result, the journey doubled in length.'],
  ['in contrast', 'phrase', 'Marks a clear difference.', ['by contrast', 'conversely', 'whereas', 'on the other hand'], ['similarly'], 'In contrast, the second proposal avoids new spending.'],
  ['specifically', 'adverb', 'Narrows a general statement to a particular case.', ['in particular', 'namely', 'that is', 'more precisely'], ['generally'], 'One group was excluded; specifically, those who had already applied.'],
  ['ultimately', 'adverb', 'Marks the final or deepest point.', ['in the end', 'finally', 'at bottom', 'on balance'], [], 'Ultimately, the decision belongs to the voters.'],
])

const texture = build('Texture', [
  ['beautiful', 'adjective', 'Pleasing to the senses or mind.', ['graceful', 'elegant', 'radiant', 'exquisite', 'striking', 'harmonious'], ['ugly', 'crude'], 'The bridge is elegant because every part carries a load.'],
  ['ugly', 'adjective', 'Unpleasant to look at or consider.', ['hideous', 'grim', 'unsightly', 'brutal', 'squalid'], ['beautiful', 'graceful'], 'The building is grim, but it is honest about its purpose.'],
  ['happy', 'adjective', 'Feeling or showing pleasure.', ['glad', 'delighted', 'content', 'cheerful', 'elated'], ['sad', 'miserable'], 'She was quietly content with the result.'],
  ['sad', 'adjective', 'Feeling or causing sorrow.', ['sorrowful', 'melancholy', 'wretched', 'mournful', 'poignant'], ['happy', 'joyful'], 'The letter is poignant precisely because it is so calm.'],
  ['angry', 'adjective', 'Feeling or showing strong displeasure.', ['furious', 'indignant', 'irate', 'resentful', 'incensed'], ['calm', 'pleased'], 'The tone is indignant rather than abusive.'],
  ['smart', 'adjective', 'Quick to learn or clever.', ['astute', 'sharp', 'inventive', 'perceptive', 'ingenious'], ['dull', 'foolish'], 'The solution is ingenious in its simplicity.'],
  ['strange', 'adjective', 'Unusual or hard to explain.', ['curious', 'peculiar', 'uncanny', 'bizarre', 'unsettling'], ['ordinary', 'familiar'], 'The detail is unsettling because it is never explained.'],
  ['obvious', 'adjective', 'Easy to see or understand.', ['evident', 'apparent', 'plain', 'unmistakable', 'patent'], ['hidden', 'subtle'], 'The contradiction is unmistakable once the dates are compared.'],
  ['significant', 'adjective', 'Large enough or important enough to matter.', ['substantial', 'considerable', 'meaningful', 'notable', 'consequential'], ['trivial', 'negligible'], 'The difference is small but consequential.'],
  ['crucial', 'adjective', 'Decisive at a particular point.', ['decisive', 'pivotal', 'critical', 'essential', 'indispensable'], ['secondary', 'minor'], 'The pivotal moment is the second vote.'],
  ['essential', 'adjective', 'Absolutely necessary.', ['necessary', 'vital', 'indispensable', 'fundamental', 'required'], ['optional', 'superfluous'], 'A shared definition is necessary before any comparison.'],
  ['abundant', 'adjective', 'Existing in large quantities.', ['plentiful', 'ample', 'copious', 'profuse', 'bountiful'], ['scarce', 'sparse'], 'The evidence is plentiful but uneven in quality.'],
  ['scarce', 'adjective', 'Available only in small quantities.', ['sparse', 'limited', 'rare', 'meagre', 'insufficient'], ['abundant', 'plentiful'], 'Reliable data are scarce.'],
  ['complex', 'adjective', 'Made of many connected parts; hard to reduce.', ['intricate', 'layered', 'multifaceted', 'involved', 'subtle'], ['simple', 'straightforward'], 'The causes are layered, but the argument need not be.'],
  ['simple', 'adjective', 'Easy to understand or do; not compound.', ['straightforward', 'plain', 'elegant', 'uncomplicated', 'direct'], ['complex', 'convoluted'], 'The rule is simple: publish the method with the result.'],
  ['effective', 'adjective', 'Producing the intended result.', ['successful', 'efficient', 'potent', 'workable', 'productive'], ['ineffective', 'useless'], 'The campaign was effective because it named a single ask.'],
  ['efficient', 'adjective', 'Achieving a result with little waste.', ['economical', 'streamlined', 'productive', 'lean', 'practical'], ['wasteful', 'inefficient'], 'The procedure is lean without being rushed.'],
  ['compelling', 'adjective', 'Commanding attention or belief.', ['persuasive', 'gripping', 'convincing', 'forceful', 'arresting'], ['weak', 'dull'], 'The case is compelling because it admits what it cannot prove.'],
  ['persuasive', 'adjective', 'Able to change a reader’s mind.', ['convincing', 'cogent', 'eloquent', 'forceful', 'credible'], ['unconvincing', 'weak'], 'The most persuasive passage is the concession.'],
  ['nuanced', 'adjective', 'Sensitive to fine distinctions.', ['subtle', 'discriminating', 'careful', 'layered', 'qualified'], ['crude', 'simplistic'], 'The account is nuanced without becoming evasive.'],
  ['vague', 'adjective', 'Unclear in meaning or outline.', ['imprecise', 'hazy', 'ambiguous', 'indistinct', 'loose'], ['precise', 'exact'], 'The promise is vague in exactly the place where detail matters.'],
  ['precise', 'adjective', 'Exact and carefully defined.', ['exact', 'specific', 'meticulous', 'rigorous', 'unambiguous'], ['vague', 'loose'], 'A precise claim can be tested; a vague one cannot.'],
  ['robust', 'adjective', 'Strong and resistant to failure; often overused in business prose.', ['resilient', 'durable', 'sturdy', 'reliable', 'hardy'], ['fragile', 'brittle'], 'The method is reliable under a wide range of conditions.'],
  ['myriad', 'adjective', 'Countless; often used where a number would be stronger.', ['countless', 'numerous', 'many', 'a great number of'], ['few', 'scarce'], 'The report lists forty-two separate objections.'],
  ['plethora', 'noun', 'An excess or large amount; usually best replaced by “many”.', ['excess', 'abundance', 'surfeit', 'glut', 'profusion'], ['shortage', 'scarcity'], 'The market offers an abundance of similar products.'],
])

const movement = build('Movement', [
  ['run', 'verb', 'To move quickly on foot; to operate or manage.', ['sprint', 'dash', 'race', 'operate', 'manage', 'direct'], ['walk', 'stop'], 'She directed the project for three years.'],
  ['take', 'verb', 'To get hold of, carry, or accept.', ['seize', 'carry', 'accept', 'capture', 'assume', 'remove'], ['give', 'release'], 'The study assumes that readers already know the terms.'],
  ['give', 'verb', 'To hand over, provide or cause.', ['offer', 'provide', 'grant', 'deliver', 'supply', 'yield'], ['take', 'withhold'], 'The data provide a partial answer.'],
  ['keep', 'verb', 'To retain or continue.', ['retain', 'preserve', 'maintain', 'hold', 'continue'], ['lose', 'discard'], 'The archive preserves the original order.'],
  ['put', 'verb', 'To place or express.', ['place', 'set', 'position', 'state', 'express', 'apply'], ['remove'], 'The preface states the problem plainly.'],
  ['hold', 'verb', 'To grasp, contain or maintain.', ['grasp', 'contain', 'carry', 'maintain', 'retain', 'support'], ['release', 'drop'], 'The argument holds only if the premise is granted.'],
  ['bring', 'verb', 'To carry or cause to come.', ['carry', 'convey', 'introduce', 'produce', 'prompt'], ['remove', 'take'], 'The comparison brings a hidden assumption into view.'],
  ['leave', 'verb', 'To go away from or allow to remain.', ['depart', 'abandon', 'exit', 'retain', 'reserve'], ['arrive', 'stay'], 'The report leaves the central question open.'],
  ['find', 'verb', 'To discover or recover.', ['discover', 'locate', 'identify', 'uncover', 'detect', 'recover'], ['lose', 'miss'], 'The survey identified three recurring complaints.'],
  ['lose', 'verb', 'To cease to have or fail to win.', ['forfeit', 'misplace', 'surrender', 'drop', 'shed'], ['find', 'gain'], 'The revision loses some of the original urgency.'],
  ['meet', 'verb', 'To come together with or satisfy.', ['encounter', 'satisfy', 'fulfil', 'confront', 'gather'], ['miss', 'avoid'], 'The design meets the stated requirement but not the spirit of it.'],
  ['speak', 'verb', 'To say words or address a group.', ['say', 'address', 'declare', 'remark', 'converse', 'testify'], ['listen', 'silence'], 'The witness testified for nearly an hour.'],
  ['write', 'verb', 'To set words down; also to compose.', ['compose', 'draft', 'pen', 'record', 'set down', 'author'], ['erase'], 'She drafted the opening three times.'],
  ['read', 'verb', 'To interpret written signs or a situation.', ['peruse', 'study', 'interpret', 'scan', 'construe'], ['misread'], 'The line can be read as an apology.'],
  ['listen', 'verb', 'To give attention to sound or speech.', ['attend', 'hear out', 'heed', 'pay attention'], ['ignore', 'speak'], 'The committee heard the residents out before voting.'],
])

const oratory = build('Oratory', [
  ['rhetoric', 'noun', 'The art of using language to persuade or move an audience.', ['oratory', 'eloquence', 'persuasion', 'discourse', 'argument'], [], 'Rhetoric is the study of how language does work in the world.'],
  ['ethos', 'noun', 'The character or credibility a speaker projects.', ['credibility', 'authority', 'character', 'standing', 'trust'], [], 'Her ethos rests on years of careful fieldwork.'],
  ['pathos', 'noun', 'The appeal to emotion.', ['emotion', 'feeling', 'sentiment', 'sympathy'], ['logos'], 'The closing image works through pathos, not proof.'],
  ['logos', 'noun', 'The appeal to reason and evidence.', ['reason', 'logic', 'evidence', 'argument'], ['pathos'], 'The argument turns on logos: the numbers do not add up.'],
  ['anaphora', 'noun', 'Repetition of a word or phrase at the start of successive clauses.', ['repetition', 'refrain'], [], 'We shall fight on the beaches, we shall fight on the landing grounds.'],
  ['antithesis', 'noun', 'The balancing of opposite ideas in a sentence.', ['contrast', 'opposition', 'juxtaposition'], [], 'Not because it is easy, but because it is hard.'],
  ['chiasmus', 'noun', 'A reversal of grammatical structure in successive clauses.', ['inversion', 'crossing'], [], 'Ask not what your country can do for you; ask what you can do for your country.'],
  ['tricolon', 'noun', 'A series of three parallel words or clauses.', ['triple', 'rule of three'], [], 'Government of the people, by the people, for the people.'],
  ['metaphor', 'noun', 'A figure that speaks of one thing as another.', ['image', 'figure', 'analogy'], ['simile'], 'The city is a body that never quite sleeps.'],
  ['simile', 'noun', 'A comparison introduced by like or as.', ['comparison', 'analogy'], ['metaphor'], 'The argument collapsed like a chair with one leg missing.'],
  ['metonymy', 'noun', 'Naming a thing by something associated with it.', ['substitution', 'association'], [], 'The crown decided; the palace said nothing.'],
  ['synecdoche', 'noun', 'Naming a whole by a part, or a part by a whole.', ['substitution', 'part for whole'], [], 'All hands on deck.'],
  ['litotes', 'noun', 'Understatement by denying the opposite.', ['understatement', 'meiosis'], ['hyperbole'], 'The result was not uninteresting.'],
  ['hyperbole', 'noun', 'Deliberate exaggeration for effect.', ['exaggeration', 'overstatement'], ['litotes', 'understatement'], 'I have told you a million times.'],
  ['parallelism', 'noun', 'Similar grammatical form in successive phrases.', ['balance', 'symmetry'], [], 'She came, she saw, she settled the matter.'],
  ['asyndeton', 'noun', 'Omission of conjunctions between clauses.', ['compression', 'clipping'], ['polysyndeton'], 'I came, I saw, I conquered.'],
  ['polysyndeton', 'noun', 'Repetition of conjunctions between clauses.', ['accumulation', 'linking'], ['asyndeton'], 'We have ships and men and money and time.'],
  ['zeugma', 'noun', 'One verb or adjective yoked to two disparate phrases.', ['yoking', 'ellipsis'], [], 'She opened the door and the question.'],
  ['rhetorical question', 'noun', 'A question asked for effect, not for an answer.', ['question', 'appeal'], [], 'Who could blame them for asking?'],
  ['understatement', 'noun', 'Deliberately representing something as less than it is.', ['litotes', 'restraint'], ['hyperbole'], 'Losing the archive was a setback.'],
])

export const entries = [
  ...vague,
  ...precision,
  ...craft,
  ...connections,
  ...texture,
  ...movement,
  ...oratory,
]

export const categories = [
  {
    id: 'Vague',
    label: 'Replace the vague',
    blurb: 'General words that hide the particular thing you mean.',
  },
  {
    id: 'Precision',
    label: 'Sharper verbs',
    blurb: 'Verbs that tell the reader exactly what is happening.',
  },
  {
    id: 'Craft',
    label: 'The writing desk',
    blurb: 'The words we use to talk about writing itself.',
  },
  {
    id: 'Connections',
    label: 'Joining ideas',
    blurb: 'Transitions that show the real relation between sentences.',
  },
  {
    id: 'Texture',
    label: 'Texture',
    blurb: 'Adjectives and nouns with more grain than “good” or “important”.',
  },
  {
    id: 'Movement',
    label: 'Movement',
    blurb: 'Everyday verbs with more direction and force.',
  },
  {
    id: 'Oratory',
    label: 'The orator’s kit',
    blurb: 'The classical figures and appeals, named and explained.',
  },
]

const index = new Map(entries.map((entry) => [entry.word.toLowerCase(), entry]))

export function findEntry(word) {
  return index.get(String(word).toLowerCase().trim()) || null
}

export function searchEntries(query) {
  const value = String(query).toLowerCase().trim()
  if (!value) return entries
  return entries.filter((entry) => {
    if (entry.word.includes(value)) return true
    if (entry.gloss.toLowerCase().includes(value)) return true
    return entry.synonyms.some((synonym) => synonym.toLowerCase().includes(value))
  })
}

// A stable “word of the day” that changes at local midnight.
export function wordOfTheDay(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const day = Math.floor((date - start) / 86400000)
  return entries[day % entries.length]
}
