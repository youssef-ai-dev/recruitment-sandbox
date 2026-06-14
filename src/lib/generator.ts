// ============================================================
// GENERATORS — JD and Interview Guide builders
// Supports: locale (en/ar/es/fr), maxQuestions (5/10/15),
//           outputFormat (linkedin/indeed/glassdoor/workable)
// ============================================================

import {
  SPECIFIC_QUESTIONS, GENERIC_HARD_TEMPLATES, GENERIC_SOFT_TEMPLATES,
  GENERIC_HARD_LISTEN, GENERIC_SOFT_LISTEN, FALLBACK_QUESTIONS
} from './skills';
import { ParsedNotes, ensurePeriod, formatList } from './parser';
import { t, type Locale } from './i18n';

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
  locale: Locale;
}

export type OutputFormat = 'linkedin' | 'indeed' | 'glassdoor' | 'workable';

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
export function generateJD(
  parsed: ParsedNotes,
  locale: Locale = 'en',
  format: OutputFormat = 'linkedin'
): string {
  const tr = t(locale);
  const title = parsed.title;
  const meta: string[] = [tr.fullTime];
  if (parsed.experienceLevel) meta.push(parsed.experienceLevel);
  meta.push(tr.remoteHybrid);

  const sections: { heading: string; content: string }[] = [];

  // About the Role
  sections.push({ heading: tr.aboutTheRole, content: `<p>${generateSummary(parsed, locale)}</p>` });

  // What You'll Do
  if (parsed.responsibilities.length > 0) {
    const items = parsed.responsibilities.map(r => `<li>${ensurePeriod(r)}</li>`).join('');
    sections.push({ heading: tr.whatYouWillDo, content: `<ul>${items}</ul>` });
  } else {
    const generic = generateGenericResponsibilities(parsed, locale);
    sections.push({ heading: tr.whatYouWillDo, content: `<ul>${generic.map(r => `<li>${r}</li>`).join('')}</ul>` });
  }

  // What You'll Bring
  const bringItems: string[] = [];
  if (parsed.qualifications.length > 0) bringItems.push(...parsed.qualifications.map(q => ensurePeriod(q)));
  if (parsed.hardSkills.length > 0) bringItems.push(`${tr.proficiencyIn} ${formatList(parsed.hardSkills.slice(0, 6))}.`);
  if (parsed.softSkills.length > 0) bringItems.push(`${locale === 'ar' ? '' : 'Strong '}${formatList(parsed.softSkills.slice(0, 4))} ${tr.strongSkills}`);
  if (parsed.experienceLevel && parsed.experienceLevel.includes('years')) {
    bringItems.push(`${parsed.experienceLevel} ${tr.yearsOfExperience}`);
  }
  if (bringItems.length === 0) {
    bringItems.push(tr.genericQual1);
    bringItems.push(tr.genericQual2);
    bringItems.push(tr.genericQual3);
  }
  sections.push({ heading: tr.whatYouWillBring, content: `<ul>${bringItems.slice(0, 8).map(q => `<li>${q}</li>`).join('')}</ul>` });

  // Nice to Have
  if (parsed.niceToHaves.length > 0) {
    sections.push({ heading: tr.niceToHave, content: `<ul>${parsed.niceToHaves.map(n => `<li>${ensurePeriod(n)}</li>`).join('')}</ul>` });
  }

  // Key Skills
  const allSkills = [...new Set([...parsed.hardSkills, ...parsed.softSkills.map(s => s.toLowerCase())])];
  if (allSkills.length > 0) {
    sections.push({ heading: tr.keySkills, content: `<div class="skill-pills">${allSkills.slice(0, 15).map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>` });
  }

  // What We Offer (skip for job board formats — they have their own benefits sections)
  if (format === 'linkedin' || format === 'workable') {
    sections.push({
      heading: tr.whatWeOffer,
      content: `<ul>
        <li>${tr.offer1}</li>
        <li>${tr.offer2}</li>
        <li>${tr.offer3}</li>
        <li>${tr.offer4}</li>
        <li>${tr.offer5}</li>
      </ul>`
    });
  }

  const metaHTML = meta.map(m => `<span>${m}</span>`).join('');
  const sectionsHTML = sections.map(s => `
    <div class="jd-section">
      <h3>${s.heading}</h3>
      ${s.content}
    </div>
  `).join('');

  // Format-specific wrapper
  const formatTag = format !== 'linkedin'
    ? `<div class="format-tag">${format}</div>`
    : '';

  return `
    <div class="jd-doc" dir="${locale === 'ar' ? 'rtl' : 'ltr'}">
      ${formatTag}
      <h2 class="doc-title">${title}</h2>
      <div class="doc-meta">${metaHTML}</div>
      ${sectionsHTML}
      <div class="divider"></div>
      <p class="eoe">${tr.eoe}</p>
    </div>
  `;
}

function generateSummary(parsed: ParsedNotes, locale: Locale = 'en'): string {
  const tr = t(locale);
  const parts: string[] = [];
  const title = parsed.title !== 'Untitled Role' ? parsed.title : 'this role';
  const exp = parsed.experienceLevel
    ? ` ${tr.withExperience} ${parsed.experienceLevel.includes('years') ? parsed.experienceLevel + ' ' + tr.relevantExperience : parsed.experienceLevel + ' ' + tr.relevantExperience}`
    : '';

  parts.push(`${tr.lookingFor} ${title}${exp} ${tr.toJoinOurTeam}`);

  if (parsed.responsibilities.length > 0) {
    const topResp = parsed.responsibilities.slice(0, 3).map(r =>
      r.charAt(0).toLowerCase() + r.slice(1)
    );
    parts.push(`${tr.inThisRole} ${topResp[0]}${topResp.length > 1 ? ', ' + topResp[1] : ''}${topResp.length > 2 ? ', ' + (locale === 'ar' ? 'و' : 'and') + ' ' + topResp[2] : ''}.`);
  }

  if (parsed.hardSkills.length > 0 || parsed.softSkills.length > 0) {
    const allSkills = [...parsed.hardSkills.slice(0, 3), ...parsed.softSkills.slice(0, 2)];
    parts.push(`${tr.theIdealCandidate} ${allSkills.join(', ')} ${locale === 'ar' ? '' : 'and thrives in a collaborative, fast-paced environment.'}`);
  }

  return parts.join(' ');
}

function generateGenericResponsibilities(parsed: ParsedNotes, locale: Locale = 'en'): string[] {
  const tr = t(locale);
  const resps = [
    tr.genericResp1,
    tr.genericResp2,
    tr.genericResp3,
    tr.genericResp4,
    tr.genericResp5,
  ];
  if (parsed.hardSkills.some(s => /sql|data|analyt/i.test(s))) {
    resps.push(tr.leverageData);
  }
  if (parsed.softSkills.some(s => /lead|mentor/i.test(s))) {
    resps.push(tr.mentorDevelop);
  }
  return resps.slice(0, 7);
}

// ---- Interview Guide ----
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
  const tr = t(guide.locale);
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

// ---- Plain Text for Copy ----
export function jdToPlainText(parsed: ParsedNotes, locale: Locale = 'en'): string {
  const tr = t(locale);
  const lines: string[] = [];
  lines.push(parsed.title.toUpperCase());
  lines.push(`${tr.fullTime} · ${parsed.experienceLevel || tr.allLevels} · ${tr.remoteHybrid}`);
  lines.push('');
  lines.push(tr.aboutTheRole.toUpperCase());
  lines.push(generateSummary(parsed, locale));
  lines.push('');

  if (parsed.responsibilities.length > 0) {
    lines.push(tr.whatYouWillDo.toUpperCase());
    parsed.responsibilities.forEach(r => lines.push(`• ${ensurePeriod(r)}`));
    lines.push('');
  }

  lines.push(tr.whatYouWillBring.toUpperCase());
  if (parsed.qualifications.length > 0) parsed.qualifications.forEach(q => lines.push(`• ${ensurePeriod(q)}`));
  if (parsed.hardSkills.length > 0) lines.push(`• ${tr.proficiencyIn} ${formatList(parsed.hardSkills.slice(0, 6))}.`);
  if (parsed.softSkills.length > 0) lines.push(`• ${formatList(parsed.softSkills.slice(0, 4))} ${tr.strongSkills}`);
  lines.push('');

  if (parsed.niceToHaves.length > 0) {
    lines.push(tr.niceToHave.toUpperCase());
    parsed.niceToHaves.forEach(n => lines.push(`• ${ensurePeriod(n)}`));
    lines.push('');
  }

  lines.push(tr.eoe);
  return lines.join('\n');
}

export function guideToPlainText(guide: GuideData): string {
  const tr = t(guide.locale);
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

// ---- PDF Export ----
export async function exportToPDF(
  parsed: ParsedNotes,
  guide: GuideData,
  activeTab: 'jd' | 'guide',
  locale: Locale = 'en'
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const tr = t(locale);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 25;

  const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [40, 40, 40]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      if (y > 270) { doc.addPage(); y = 25; }
      doc.text(line, margin, y);
      y += fontSize * 0.5;
    }
    y += 2;
  };

  const addDivider = () => {
    if (y > 270) { doc.addPage(); y = 25; }
    doc.setDrawColor(200, 155, 60);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  if (activeTab === 'jd') {
    // JD PDF
    addText(parsed.title, 22, 'bold', [200, 155, 60]);
    const metaLine = `${tr.fullTime} · ${parsed.experienceLevel || tr.allLevels} · ${tr.remoteHybrid}`;
    addText(metaLine, 9, 'normal', [120, 120, 120]);
    y += 4;
    addDivider();

    addText(tr.aboutTheRole, 14, 'bold', [200, 155, 60]);
    addText(generateSummary(parsed, locale), 10);

    if (parsed.responsibilities.length > 0) {
      addText(tr.whatYouWillDo, 14, 'bold', [200, 155, 60]);
      parsed.responsibilities.forEach(r => {
        addText(`• ${ensurePeriod(r)}`, 10);
      });
    }

    addText(tr.whatYouWillBring, 14, 'bold', [200, 155, 60]);
    if (parsed.qualifications.length > 0) {
      parsed.qualifications.forEach(q => addText(`• ${ensurePeriod(q)}`, 10));
    }
    if (parsed.hardSkills.length > 0) {
      addText(`• ${tr.proficiencyIn} ${formatList(parsed.hardSkills.slice(0, 6))}.`, 10);
    }
    if (parsed.softSkills.length > 0) {
      addText(`• ${formatList(parsed.softSkills.slice(0, 4))} ${tr.strongSkills}`, 10);
    }

    if (parsed.niceToHaves.length > 0) {
      addText(tr.niceToHave, 14, 'bold', [200, 155, 60]);
      parsed.niceToHaves.forEach(n => addText(`• ${ensurePeriod(n)}`, 10));
    }

    if (parsed.hardSkills.length > 0 || parsed.softSkills.length > 0) {
      addText(tr.keySkills, 14, 'bold', [200, 155, 60]);
      const allSkills = [...parsed.hardSkills, ...parsed.softSkills];
      addText(allSkills.slice(0, 15).join(' • '), 10);
    }

    y += 4;
    addDivider();
    addText(tr.eoe, 8, 'italic', [120, 120, 120]);

  } else {
    // Interview Guide PDF
    addText(`${tr.interviewGuide}: ${guide.title}`, 22, 'bold', [200, 155, 60]);
    const statsLine = `${guide.questions.length} ${tr.behavioralQuestions} — ${tr.starFormat}`;
    addText(statsLine, 9, 'normal', [120, 120, 120]);
    y += 4;
    addDivider();

    for (const q of guide.questions) {
      if (y > 230) { doc.addPage(); y = 25; }
      const typeLabel = q.type === 'hard' ? tr.technical : q.type === 'soft' ? tr.softSkill : tr.general;
      addText(`${String(q.number).padStart(2, '0')}. [${typeLabel} · ${q.skill}]`, 10, 'bold', [200, 155, 60]);
      addText(`"${q.question}"`, 10, 'italic');
      addText(tr.whatToListenFor + ':', 9, 'bold', [100, 100, 100]);
      q.listenFor.forEach(l => addText(`  → ${l}`, 9, 'normal', [80, 80, 80]));
      y += 3;
    }
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text('Recruitment Sandbox', margin, doc.internal.pageSize.getHeight() - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  }

  const fileName = activeTab === 'jd'
    ? `${parsed.title.replace(/[^a-zA-Z0-9]/g, '_')}_JD.pdf`
    : `${guide.title.replace(/[^a-zA-Z0-9]/g, '_')}_Interview_Guide.pdf`;

  doc.save(fileName);
}
