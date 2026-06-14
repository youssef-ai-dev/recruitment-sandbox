// ============================================================
// GENERATORS — JD and Interview Guide builders
// ============================================================

import {
  SPECIFIC_QUESTIONS, GENERIC_HARD_TEMPLATES, GENERIC_SOFT_TEMPLATES,
  GENERIC_HARD_LISTEN, GENERIC_SOFT_LISTEN, FALLBACK_QUESTIONS, CONFIG
} from './skills';
import { ParsedNotes, ensurePeriod, formatList } from './parser';

// ---- Interview Guide Types ----
export interface GuideQuestion {
  number: number;
  skill: string;
  type: 'hard' | 'soft' | 'general';
  question: string;
  listenFor: string[];
}

export interface GuideData {
  questions: GuideQuestion[];
  hardCount: number;
  softCount: number;
  genCount: number;
  title: string;
}

// ---- Simple Hash ----
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ---- Job Description ----
export function generateJD(parsed: ParsedNotes): string {
  const title = parsed.title;
  const meta: string[] = ['Full-time'];
  if (parsed.experienceLevel) meta.push(parsed.experienceLevel);
  meta.push('Remote / Hybrid');

  const sections: { heading: string; content: string }[] = [];

  // About the Role
  sections.push({ heading: 'About the Role', content: `<p>${parsed.summary}</p>` });

  // What You'll Do
  if (parsed.responsibilities.length > 0) {
    const items = parsed.responsibilities.map(r => `<li>${ensurePeriod(r)}</li>`).join('');
    sections.push({ heading: "What You'll Do", content: `<ul>${items}</ul>` });
  } else {
    const generic = generateGenericResponsibilities(parsed);
    sections.push({ heading: "What You'll Do", content: `<ul>${generic.map(r => `<li>${r}</li>`).join('')}</ul>` });
  }

  // What You'll Bring
  const bringItems: string[] = [];
  if (parsed.qualifications.length > 0) bringItems.push(...parsed.qualifications.map(q => ensurePeriod(q)));
  if (parsed.hardSkills.length > 0) bringItems.push(`Proficiency in ${formatList(parsed.hardSkills.slice(0, 6))}.`);
  if (parsed.softSkills.length > 0) bringItems.push(`Strong ${formatList(parsed.softSkills.slice(0, 4))} skills.`);
  if (parsed.experienceLevel && parsed.experienceLevel.includes('years')) {
    bringItems.push(`${parsed.experienceLevel} of relevant professional experience.`);
  }
  if (bringItems.length === 0) {
    bringItems.push('Relevant professional experience in a similar role.');
    bringItems.push('Strong problem-solving and analytical abilities.');
    bringItems.push('Excellent communication and collaboration skills.');
  }
  sections.push({ heading: "What You'll Bring", content: `<ul>${bringItems.slice(0, 8).map(q => `<li>${q}</li>`).join('')}</ul>` });

  // Nice to Have
  if (parsed.niceToHaves.length > 0) {
    sections.push({ heading: 'Nice to Have', content: `<ul>${parsed.niceToHaves.map(n => `<li>${ensurePeriod(n)}</li>`).join('')}</ul>` });
  }

  // Key Skills
  const allSkills = [...new Set([...parsed.hardSkills, ...parsed.softSkills.map(s => s.toLowerCase())])];
  if (allSkills.length > 0) {
    sections.push({ heading: 'Key Skills', content: `<div class="skill-pills">${allSkills.slice(0, 15).map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>` });
  }

  // What We Offer
  sections.push({
    heading: 'What We Offer',
    content: `<ul>
      <li>Competitive compensation package with equity options.</li>
      <li>Comprehensive health, dental, and vision insurance.</li>
      <li>Flexible work arrangements — remote-friendly with optional in-office collaboration.</li>
      <li>Professional development budget and continuous learning opportunities.</li>
      <li>Generous PTO policy and company-wide wellness days.</li>
    </ul>`
  });

  const metaHTML = meta.map(m => `<span>${m}</span>`).join('');
  const sectionsHTML = sections.map(s => `
    <div class="jd-section">
      <h3>${s.heading}</h3>
      ${s.content}
    </div>
  `).join('');

  return `
    <div class="jd-doc">
      <h2 class="doc-title">${title}</h2>
      <div class="doc-meta">${metaHTML}</div>
      ${sectionsHTML}
      <div class="divider"></div>
      <p class="eoe">We are an equal opportunity employer and value diversity. We do not discriminate on the basis of race, religion, color, national origin, gender, sexual orientation, age, marital status, veteran status, or disability status.</p>
    </div>
  `;
}

function generateGenericResponsibilities(parsed: ParsedNotes): string[] {
  const resps = [
    'Define and drive the strategic vision and roadmap for your area of ownership.',
    'Collaborate cross-functionally with engineering, design, and business partners to deliver high-impact outcomes.',
    'Analyze data and metrics to identify opportunities, inform decisions, and measure success.',
    'Communicate progress, insights, and recommendations clearly to stakeholders at all levels.',
    'Foster a culture of continuous improvement, experimentation, and accountability within the team.'
  ];
  if (parsed.hardSkills.some(s => /sql|data|analyt/i.test(s))) {
    resps.push('Leverage data analysis tools and techniques to uncover actionable insights.');
  }
  if (parsed.softSkills.some(s => /lead|mentor/i.test(s))) {
    resps.push('Mentor and develop team members, fostering their professional growth.');
  }
  return resps.slice(0, 7);
}

// ---- Interview Guide ----
export function generateGuide(parsed: ParsedNotes): GuideData {
  const questions: GuideQuestion[] = [];
  const usedKeys = new Set<string>();
  const MAX = CONFIG.MAX_QUESTIONS;

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
    title: parsed.title
  };
}

export function renderGuide(guide: GuideData): string {
  const statsHTML: string[] = [];
  if (guide.hardCount > 0) statsHTML.push(`<span class="stat-badge hard">${guide.hardCount} technical</span>`);
  if (guide.softCount > 0) statsHTML.push(`<span class="stat-badge soft">${guide.softCount} soft skill</span>`);
  if (guide.genCount > 0) statsHTML.push(`<span class="stat-badge general" style="background:var(--accent-soft);color:var(--accent);border:1px solid rgba(200,155,60,0.2);">${guide.genCount} general</span>`);

  const questionsHTML = guide.questions.map(q => {
    const typeClass = q.type === 'hard' ? 'hard' : q.type === 'soft' ? 'soft' : 'general';
    const typeLabel = q.type === 'hard' ? 'Technical' : q.type === 'soft' ? 'Soft Skill' : 'General';
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
          <h4>What to listen for</h4>
          <ul>${listenHTML}</ul>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="guide-doc">
      <div class="guide-header">
        <h2>Interview Guide: ${guide.title}</h2>
        <p>${guide.questions.length} behavioral questions · STAR format recommended</p>
        ${statsHTML.length > 0 ? `<div class="guide-stats">${statsHTML.join('')}</div>` : ''}
      </div>
      ${questionsHTML}
    </div>
  `;
}

// ---- Plain Text for Copy ----
export function jdToPlainText(parsed: ParsedNotes): string {
  const lines: string[] = [];
  lines.push(parsed.title.toUpperCase());
  lines.push(`Full-time · ${parsed.experienceLevel || 'All levels'} · Remote / Hybrid`);
  lines.push('');
  lines.push('ABOUT THE ROLE');
  lines.push(parsed.summary);
  lines.push('');

  if (parsed.responsibilities.length > 0) {
    lines.push("WHAT YOU'LL DO");
    parsed.responsibilities.forEach(r => lines.push(`• ${ensurePeriod(r)}`));
    lines.push('');
  }

  lines.push("WHAT YOU'LL BRING");
  if (parsed.qualifications.length > 0) parsed.qualifications.forEach(q => lines.push(`• ${ensurePeriod(q)}`));
  if (parsed.hardSkills.length > 0) lines.push(`• Proficiency in ${formatList(parsed.hardSkills.slice(0, 6))}.`);
  if (parsed.softSkills.length > 0) lines.push(`• Strong ${formatList(parsed.softSkills.slice(0, 4))} skills.`);
  lines.push('');

  if (parsed.niceToHaves.length > 0) {
    lines.push('NICE TO HAVE');
    parsed.niceToHaves.forEach(n => lines.push(`• ${ensurePeriod(n)}`));
    lines.push('');
  }

  lines.push('We are an equal opportunity employer and value diversity.');
  return lines.join('\n');
}

export function guideToPlainText(guide: GuideData): string {
  const lines: string[] = [];
  lines.push(`INTERVIEW GUIDE: ${guide.title.toUpperCase()}`);
  lines.push(`${guide.questions.length} behavioral questions — STAR format recommended`);
  lines.push('');

  guide.questions.forEach(q => {
    const typeLabel = q.type === 'hard' ? 'Technical' : q.type === 'soft' ? 'Soft Skill' : 'General';
    lines.push(`${String(q.number).padStart(2, '0')}. [${typeLabel} · ${q.skill}]`);
    lines.push(`"${q.question}"`);
    lines.push('What to listen for:');
    q.listenFor.forEach(l => lines.push(`  → ${l}`));
    lines.push('');
  });

  return lines.join('\n');
}
