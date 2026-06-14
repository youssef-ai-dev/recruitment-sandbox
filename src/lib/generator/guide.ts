// ============================================================
// GENERATOR — Interview Guide builder
// ============================================================

import type { ParsedNotes } from '../parser';
import {
  SPECIFIC_QUESTIONS, GENERIC_HARD_TEMPLATES, GENERIC_SOFT_TEMPLATES,
  GENERIC_HARD_LISTEN, GENERIC_SOFT_LISTEN, FALLBACK_QUESTIONS
} from '../skills';
import { t, type Locale } from '../i18n';
import { simpleHash } from './utils';
import type { GuideData, GuideQuestion } from './types';

export function generateGuide(parsed: ParsedNotes, maxQuestions: number = 10, locale: Locale = 'en'): GuideData {
  const questions: GuideQuestion[] = [];
  const usedKeys = new Set<string>();
  const MAX = maxQuestions;

  // 1. Specific questions for detected hard skills
  for (const skill of parsed.hardSkills) {
    if (questions.length >= MAX) break;
    const key = skill.toLowerCase();
    if (SPECIFIC_QUESTIONS[key] && !usedKeys.has(key)) {
      questions.push({
        number: questions.length + 1,
        skill,
        type: 'hard',
        question: SPECIFIC_QUESTIONS[key].q,
        listenFor: SPECIFIC_QUESTIONS[key].listen
      });
      usedKeys.add(key);
    }
  }

  // 2. Specific questions for detected soft skills
  for (const skill of parsed.softSkills) {
    if (questions.length >= MAX) break;
    const key = skill.toLowerCase();
    if (SPECIFIC_QUESTIONS[key] && !usedKeys.has(key)) {
      questions.push({
        number: questions.length + 1,
        skill,
        type: 'soft',
        question: SPECIFIC_QUESTIONS[key].q,
        listenFor: SPECIFIC_QUESTIONS[key].listen
      });
      usedKeys.add(key);
    }
  }

  // 3. Generic questions for remaining hard skills
  for (const skill of parsed.hardSkills) {
    if (questions.length >= MAX) break;
    const key = skill.toLowerCase();
    if (!usedKeys.has(key)) {
      const hash = simpleHash(skill);
      const template = GENERIC_HARD_TEMPLATES[hash % GENERIC_HARD_TEMPLATES.length];
      questions.push({
        number: questions.length + 1,
        skill,
        type: 'hard',
        question: template(skill),
        listenFor: GENERIC_HARD_LISTEN(skill)
      });
      usedKeys.add(key);
    }
  }

  // 4. Generic questions for remaining soft skills
  for (const skill of parsed.softSkills) {
    if (questions.length >= MAX) break;
    const key = skill.toLowerCase();
    if (!usedKeys.has(key)) {
      const hash = simpleHash(skill);
      const template = GENERIC_SOFT_TEMPLATES[hash % GENERIC_SOFT_TEMPLATES.length];
      questions.push({
        number: questions.length + 1,
        skill,
        type: 'soft',
        question: template(skill),
        listenFor: GENERIC_SOFT_LISTEN(skill)
      });
      usedKeys.add(key);
    }
  }

  // 5. Fill remaining with fallback
  for (const fq of FALLBACK_QUESTIONS) {
    if (questions.length >= MAX) break;
    const key = fq.skill.toLowerCase();
    if (!usedKeys.has(key)) {
      questions.push({
        number: questions.length + 1,
        skill: fq.skill,
        type: fq.type,
        question: fq.q,
        listenFor: fq.listen
      });
      usedKeys.add(key);
    }
  }

  // Renumber
  questions.forEach((q, i) => q.number = i + 1);

  return {
    questions,
    hardCount: questions.filter(q => q.type === 'hard').length,
    softCount: questions.filter(q => q.type === 'soft').length,
    genCount: questions.filter(q => q.type === 'general').length,
    title: parsed.title,
    locale
  };
}

export function renderGuide(guide: GuideData): string {
  const tr = t(guide.locale as Locale);
  const dir = guide.locale === 'ar' ? 'rtl' : 'ltr';
  const statsHTML: string[] = [];
  if (guide.hardCount > 0) statsHTML.push(`<span class="stat-badge hard">${guide.hardCount} ${tr.technical.toLowerCase()}</span>`);
  if (guide.softCount > 0) statsHTML.push(`<span class="stat-badge soft">${guide.softCount} ${tr.softSkill.toLowerCase()}</span>`);
  if (guide.genCount > 0) statsHTML.push(`<span class="stat-badge general">${guide.genCount} ${tr.general.toLowerCase()}</span>`);

  const questionsHTML = guide.questions.map(q => {
    const typeClass = q.type === 'hard' ? 'hard' : q.type === 'soft' ? 'soft' : 'general';
    const typeLabel = q.type === 'hard' ? tr.technical : q.type === 'soft' ? tr.softSkill : tr.general;
    const listenHTML = q.listenFor.map(l => `<li>${l}</li>`).join('');

    return `
      <div class="question-card">
        <div class="question-top">
          <span class="q-number">${String(q.number).padStart(2, '0')}</span>
          <span class="q-skill-tag ${typeClass}">${q.skill}</span>
          <span class="q-skill-tag ${typeClass}" style="opacity:0.7">${typeLabel}</span>
        </div>
        <p class="question-text">"${q.question}"</p>
        <div class="listen-guide">
          <h4>${tr.whatToListenFor}</h4>
          <ul>${listenHTML}</ul>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="guide-doc" dir="${dir}">
      <div class="guide-header">
        <h2>${tr.interviewGuide}: ${guide.title}</h2>
        <p>${guide.questions.length} ${tr.behavioralQuestions} · ${tr.starFormat}</p>
        ${statsHTML.length > 0 ? `<div class="guide-stats">${statsHTML.join('')}</div>` : ''}
      </div>
      ${questionsHTML}
    </div>
  `;
}

export function guideToPlainText(guide: GuideData): string {
  const tr = t(guide.locale as Locale);
  const lines: string[] = [];
  lines.push(`${tr.interviewGuide.toUpperCase()}: ${guide.title.toUpperCase()}`);
  lines.push(`${guide.questions.length} ${tr.behavioralQuestions} — ${tr.starFormat}`);
  lines.push('');

  guide.questions.forEach(q => {
    const typeLabel = q.type === 'hard' ? tr.technical : q.type === 'soft' ? tr.softSkill : tr.general;
    lines.push(`${String(q.number).padStart(2, '0')}. [${typeLabel} · ${q.skill}]`);
    lines.push(`"${q.question}"`);
    lines.push(`${tr.whatToListenFor}:`);
    q.listenFor.forEach(l => lines.push(`  → ${l}`));
    lines.push('');
  });

  return lines.join('\n');
}
