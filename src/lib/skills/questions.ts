// ============================================================
// QUESTION BANK — Specific matches, generic templates, fallbacks
// ============================================================

interface SpecificQuestion {
  q: string;
  listen: string[];
}

export const SPECIFIC_QUESTIONS: Record<string, SpecificQuestion> = {
  'sql': {
    q: 'Describe a time when your SQL and data analysis skills helped uncover a critical insight that changed the direction of a project or business decision.',
    listen: [
      'Ability to write complex queries and work with large datasets',
      'Translation of raw data into actionable business recommendations',
      'Measurable impact on outcomes driven by their analysis'
    ]
  },
  'python': {
    q: 'Walk me through a complex problem you solved using Python where you had to balance code quality, performance, and delivery timelines.',
    listen: [
      'Structured problem-solving approach and technical depth',
      'Awareness of code quality, testing, and maintainability',
      'Ability to handle ambiguity and make pragmatic trade-offs'
    ]
  },
  'leadership': {
    q: 'Tell me about a time you led a team through a significant change or challenge. How did you maintain morale and keep the team focused on results?',
    listen: [
      'Concrete leadership actions — not just holding the title',
      'Ability to communicate vision and handle resistance empathetically',
      'Measurable outcome that shows their leadership made a difference'
    ]
  },
  'communication': {
    q: 'Give an example of when you had to convey a complex or unpopular message to a diverse audience. How did you tailor your approach?',
    listen: [
      'Adaptability in communication style based on the audience',
      'Active listening and checking for understanding',
      'Positive outcome or successful alignment that resulted'
    ]
  },
  'product management': {
    q: 'Tell me about a product decision you made that involved significant trade-offs. How did you evaluate options and communicate your rationale to stakeholders?',
    listen: [
      'Framework for decision-making (data, user research, business goals)',
      'Ability to say no and manage stakeholder expectations',
      'Outcome of the decision and lessons learned'
    ]
  },
  'agile': {
    q: 'Describe a situation where an Agile process you were part of broke down. What went wrong, and what did you do to get things back on track?',
    listen: [
      'Deep understanding of Agile principles, not just ceremonies',
      'Proactive problem-solving and team facilitation skills',
      'Continuous improvement mindset and concrete changes implemented'
    ]
  },
  'machine learning': {
    q: "Tell me about a machine learning project where the initial approach didn't work. How did you diagnose the problem and iterate toward a solution?",
    listen: [
      'Methodical experimentation and debugging approach',
      'Ability to communicate technical challenges to non-technical stakeholders',
      'Persistence and creativity in finding alternative approaches'
    ]
  },
  'financial analysis': {
    q: 'Describe a time your financial analysis directly influenced a major business decision. How did you present your findings to ensure they were acted upon?',
    listen: [
      'Analytical rigor and attention to detail in the analysis',
      'Storytelling ability — turning numbers into a compelling narrative',
      'Tangible business impact from their recommendation'
    ]
  },
  'stakeholder management': {
    q: 'Tell me about a time you had to manage conflicting priorities or expectations from multiple stakeholders. How did you find alignment?',
    listen: [
      "Structured approach to understanding each stakeholder's needs",
      'Negotiation and prioritization skills',
      'Win-win outcome or clear rationale for the final decision'
    ]
  },
  'problem-solving': {
    q: "Walk me through the most complex problem you've faced in the last year. What was your systematic approach to solving it?",
    listen: [
      'Clear, structured thinking process — not just jumping to solutions',
      'Ability to break down complexity into manageable parts',
      'Quality and impact of the solution they arrived at'
    ]
  },
  'data-driven': {
    q: 'Give an example of a time when data contradicted your intuition or a popular opinion. What did you do?',
    listen: [
      'Intellectual honesty and willingness to change course',
      'Ability to interrogate data quality and methodology',
      'How they communicated the counterintuitive finding to others'
    ]
  },
  'collaboration': {
    q: 'Describe a cross-functional project where you had to work closely with people from very different disciplines. What made the collaboration successful?',
    listen: [
      'Genuine respect for other disciplines and willingness to learn',
      'Clear communication across functional boundaries',
      'Shared ownership and how they navigated disagreements'
    ]
  },
  'time management': {
    q: 'Tell me about a period when you had multiple high-priority deadlines competing for your time. How did you decide what to focus on first?',
    listen: [
      'Prioritization framework (impact, urgency, dependencies)',
      'Proactive communication about trade-offs and expectations',
      'Outcome — did they meet the deadlines, and at what quality?'
    ]
  },
  'a/b testing': {
    q: 'Describe an A/B test you designed that yielded surprising or inconclusive results. What did you do next?',
    listen: [
      'Understanding of experimental design and statistical significance',
      "Intellectual curiosity — not just accepting results at face value",
      'Follow-through: how they used the learning to inform next steps'
    ]
  },
  'creativity': {
    q: 'Tell me about a time you proposed a creative or unconventional solution to a problem. How did you get buy-in for your idea?',
    listen: [
      'Genuine originality in their thinking, not just incremental improvement',
      'Courage to challenge the status quo with evidence',
      'Ability to prototype or validate ideas before committing resources'
    ]
  },
  'adaptability': {
    q: 'Describe a situation where your priorities or scope changed significantly mid-project. How did you adapt without losing momentum?',
    listen: [
      'Emotional resilience — frustration is fine, but they should recover',
      'Speed and effectiveness of their pivot',
      'How they helped others on the team adjust as well'
    ]
  },
  'mentoring': {
    q: 'Tell me about someone you mentored or developed. What was your approach, and how did that person grow as a result?',
    listen: [
      "Genuine investment in the other person's growth, not just delegation",
      "Tailored approach based on the mentee's needs and learning style",
      "Concrete evidence of the mentee's progress or promotion"
    ]
  },
  'negotiation': {
    q: 'Describe a negotiation you led where the stakes were high. How did you prepare, and what was the outcome?',
    listen: [
      "Thorough preparation and understanding of the other party's needs",
      'Creative deal-making — looking for value beyond just price',
      'Ability to maintain the relationship while advocating firmly'
    ]
  },
  'attention to detail': {
    q: 'Tell me about a time when your attention to detail caught something critical that others had missed. What was the impact?',
    listen: [
      'Systematic quality-checking habits, not just luck',
      'Clear articulation of the risk or consequence if it had been missed',
      'How they communicated the finding without alienating colleagues'
    ]
  },
  'strategic thinking': {
    q: 'Give an example of when you stepped back from day-to-day work to identify a longer-term strategic opportunity. What did you do about it?',
    listen: [
      'Ability to zoom out and see the bigger picture',
      'Data or insight that informed their strategic perspective',
      'Concrete actions taken to turn strategy into execution'
    ]
  },
  'resilience': {
    q: 'Tell me about a significant professional setback or failure. How did you handle it, and what did you learn?',
    listen: [
      'Honesty and self-awareness about what went wrong',
      'Constructive response — learning, adapting, not just recovering',
      'Growth demonstrated in subsequent work'
    ]
  },
  'innovation': {
    q: 'Describe a time you introduced a new process, tool, or idea that meaningfully improved how your team worked.',
    listen: [
      'Proactive identification of the opportunity for improvement',
      'Evidence of testing and iterating before full rollout',
      'Measurable improvement in efficiency, quality, or outcomes'
    ]
  },
  'customer-centric': {
    q: 'Tell me about a time you advocated for the customer or user when it was difficult or unpopular to do so.',
    listen: [
      'Deep understanding of customer needs backed by evidence',
      'Courage to push back internally on behalf of the customer',
      'Positive outcome for both the customer and the business'
    ]
  }
};

// ============================================================
// GENERIC QUESTION TEMPLATES
// ============================================================

export const GENERIC_HARD_TEMPLATES: ((s: string) => string)[] = [
  (s) => `Describe a project where your expertise in ${s} was critical to delivering a successful outcome. What was the challenge and how did you approach it?`,
  (s) => `Tell me about a time you had to quickly deepen your knowledge of ${s} to meet a project need. How did you manage the learning curve while delivering results?`,
  (s) => `Walk me through a situation where your ${s} skills helped you solve a problem that would have been significantly harder otherwise. What made the difference?`,
  (s) => `Can you share an example of how you've used ${s} to drive a measurable impact on a team or business outcome?`
];

export const GENERIC_SOFT_TEMPLATES: ((s: string) => string)[] = [
  (s) => `Tell me about a time your ${s} was tested in a high-pressure situation. How did you handle it and what was the outcome?`,
  (s) => `Describe a situation where your ability to demonstrate ${s} directly contributed to the success of a project or team.`,
  (s) => `Give an example of when you had to use strong ${s} to navigate a challenging interpersonal or organizational dynamic.`,
  (s) => `Can you share a time when you intentionally worked to improve your ${s}? What steps did you take and what changed?`
];

export const GENERIC_HARD_LISTEN = (s: string): string[] => [
  `Specific, demonstrated experience with ${s} — not just theoretical knowledge`,
  `Clear articulation of the problem-solving process and their specific contribution`,
  `Tangible results or impact from applying ${s}`
];

export const GENERIC_SOFT_LISTEN = (s: string): string[] => [
  `Self-awareness and intentionality in how they apply ${s}`,
  `Specific examples with concrete details rather than vague generalizations`,
  `Evidence of growth or learning from the experience`
];

// ============================================================
// FALLBACK QUESTIONS — 10 universal behavioral questions
// ============================================================

interface FallbackQuestion {
  skill: string;
  type: 'general';
  q: string;
  listen: string[];
}

export const FALLBACK_QUESTIONS: FallbackQuestion[] = [
  {
    skill: 'Problem Solving',
    type: 'general',
    q: "Walk me through the most complex problem you've faced professionally in the last year. What was your systematic approach to solving it?",
    listen: [
      'Structured thinking — breaking complex problems into parts',
      'Ability to identify root causes vs. symptoms',
      'Quality and creativity of the solution'
    ]
  },
  {
    skill: 'Leadership',
    type: 'general',
    q: 'Tell me about a time you took ownership of something outside your defined responsibilities. What motivated you, and what happened?',
    listen: [
      'Proactive initiative and sense of ownership',
      'Ability to influence without formal authority',
      'Positive impact on the team or project'
    ]
  },
  {
    skill: 'Collaboration',
    type: 'general',
    q: 'Describe a situation where you had to work with someone whose working style was very different from yours. How did you make it work?',
    listen: [
      'Empathy and adaptability in working with different styles',
      'Focus on shared goals rather than personal preferences',
      'Successful outcome from the collaboration'
    ]
  },
  {
    skill: 'Communication',
    type: 'general',
    q: 'Give an example of a time you had to persuade a skeptical audience to support your idea or proposal. How did you build your case?',
    listen: [
      "Preparation and understanding of the audience's concerns",
      'Use of data, logic, and storytelling',
      'Ability to handle objections gracefully'
    ]
  },
  {
    skill: 'Adaptability',
    type: 'general',
    q: 'Tell me about a time when something you were working on changed dramatically mid-course — a pivot, a reorg, a shift in strategy. How did you handle it?',
    listen: [
      'Resilience and ability to stay productive during uncertainty',
      'Speed of adaptation and proactive communication',
      'Positive framing of the change and lessons learned'
    ]
  },
  {
    skill: 'Decision Making',
    type: 'general',
    q: 'Describe a difficult decision you made with incomplete information. What was your framework and how did it play out?',
    listen: [
      'Clear decision-making framework, even under ambiguity',
      'Willingness to make a call and take responsibility',
      'Honest reflection on what they would do differently'
    ]
  },
  {
    skill: 'Impact',
    type: 'general',
    q: 'What accomplishment in your career are you most proud of, and why? Walk me through what made it significant.',
    listen: [
      'Connection between their work and meaningful outcomes',
      'Evidence of going beyond expectations',
      'Passion and self-awareness about what drives them'
    ]
  },
  {
    skill: 'Growth',
    type: 'general',
    q: 'Tell me about a piece of critical feedback you received that was hard to hear. How did you respond to it?',
    listen: [
      'Genuine openness to feedback — not defensive',
      'Concrete changes in behavior or approach after the feedback',
      'Self-awareness about areas for improvement'
    ]
  },
  {
    skill: 'Prioritization',
    type: 'general',
    q: 'How do you decide what to say no to? Give me a specific example of a time you declined or deprioritized a request and why.',
    listen: [
      'Clear prioritization criteria (impact, alignment, capacity)',
      'Courage and tact in communicating the no',
      'Positive outcome from maintaining focus'
    ]
  },
  {
    skill: 'Teamwork',
    type: 'general',
    q: 'Describe a team you were part of that was exceptionally high-performing. What do you think made it work, and what was your specific role in that?',
    listen: [
      'Attribution of success to team dynamics, not just individual brilliance',
      'Self-awareness about their role and contribution',
      'Insight into what makes teams function well'
    ]
  }
];
