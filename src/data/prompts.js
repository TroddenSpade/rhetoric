export const prompts = [
  {
    mode: 'Argument',
    title: 'The useful objection',
    prompt:
      'Take a belief you hold firmly. Write the strongest possible case against it, then explain why you still hold it.',
    hint: 'Steel-man the objection. Concede one real point before you rebut it.',
  },
  {
    mode: 'Argument',
    title: 'One small policy',
    prompt:
      'Propose one change your school, workplace or city could make this year. Argue for it with a cost, a benefit and a reply to the obvious objection.',
    hint: 'Name who does what, by when, and with what resources.',
  },
  {
    mode: 'Argument',
    title: 'Against the obvious',
    prompt:
      'Choose a piece of advice everyone repeats — “follow your passion”, “never give up”, “be yourself” — and argue that it is misleading.',
    hint: 'Distinguish the grain of truth from the part that does harm.',
  },
  {
    mode: 'Argument',
    title: 'The price of convenience',
    prompt:
      'Describe something convenient you use every day. Argue that its convenience hides a cost that someone else pays.',
    hint: 'Make the hidden cost concrete: time, money, attention or labour.',
  },
  {
    mode: 'Narrative',
    title: 'The room you remember',
    prompt:
      'Write about a room you knew as a child. Do not describe everything — choose the three details that bring it back.',
    hint: 'Include one sound and one smell. Let one detail carry a story.',
  },
  {
    mode: 'Narrative',
    title: 'A conversation that changed',
    prompt:
      'Reconstruct a conversation after which you saw something differently. Stay in the scene; do not explain the moral until the final line.',
    hint: 'Use what people say and do, not what they feel.',
  },
  {
    mode: 'Narrative',
    title: 'The almost',
    prompt:
      'Write about a moment you almost did something — and did not. Make the reader feel the fork in the road.',
    hint: 'Slow down at the moment of choice. One sentence can hold a whole paragraph.',
  },
  {
    mode: 'Narrative',
    title: 'An object and its history',
    prompt:
      'Tell the story of an ordinary object you own, from the perspective of the object. Keep it under 500 words.',
    hint: 'The object cannot know everything. Its limits are the story.',
  },
  {
    mode: 'Description',
    title: 'The station at 6 a.m.',
    prompt:
      'Describe a station, airport or bus stop in the early morning. Move the eye through the space; do not list.',
    hint: 'Use one detail a camera would miss and one sound a microphone would catch.',
  },
  {
    mode: 'Description',
    title: 'Weather as a character',
    prompt:
      'Write a page in which the weather does something to the people in the scene. Do not name the emotion you want the reader to feel.',
    hint: 'Verbs first, adjectives second. Make the weather act.',
  },
  {
    mode: 'Description',
    title: 'The meal',
    prompt:
      'Describe a meal without using the words delicious, tasty, good or nice. Make the reader hungry.',
    hint: 'Texture, temperature, sound, smell. Let the senses do the judging.',
  },
  {
    mode: 'Reflection',
    title: 'The advice I ignored',
    prompt:
      'Write about advice you were given and ignored. What did you learn — and what would you tell the person who gave it?',
    hint: 'Avoid the tidy resolution. The interesting part is usually the ambivalence.',
  },
  {
    mode: 'Reflection',
    title: 'A habit and its origin',
    prompt:
      'Trace one ordinary habit back to its origin. What need did it once meet, and what need does it meet now?',
    hint: 'The origin is a scene, not a summary. Show the first time.',
  },
  {
    mode: 'Reflection',
    title: 'The thing I changed my mind about',
    prompt:
      'Describe a belief you once held and no longer hold. What would it take to change your mind again?',
    hint: 'Be fair to your former self. The change should feel earned, not performed.',
  },
  {
    mode: 'Analysis',
    title: 'Read the advertisement',
    prompt:
      'Choose an advertisement and analyse how it works: audience, promise, image, omission. Quote the language precisely.',
    hint: 'Name the device, quote it, explain its effect in three steps.',
  },
  {
    mode: 'Analysis',
    title: 'A speech in the room',
    prompt:
      'Take a speech you admire. Explain how it builds credibility, reason and feeling — and where it asks you not to look.',
    hint: 'Effectiveness is not truth. Judge the rhetoric, not the cause.',
  },
  {
    mode: 'Analysis',
    title: 'Two headlines, one event',
    prompt:
      'Find two headlines about the same event from different outlets. Compare the verbs and nouns they choose, and what each choice asks the reader to assume.',
    hint: 'Compare the same three things: verb, agent, omission.',
  },
  {
    mode: 'Analysis',
    title: 'The definition on trial',
    prompt:
      'Take a contested word — success, justice, loyalty, art, intelligence. Define it, test it against a hard case, and show why the definition matters.',
    hint: 'A good definition rules something out.',
  },
]

export function promptOfTheDay(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const day = Math.floor((date - start) / 86400000)
  return prompts[day % prompts.length]
}
