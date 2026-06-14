// ============================================================
// GENERATOR — Job Description builder
// ============================================================

import type { ParsedNotes } from '../parser';
import { ensurePeriod, formatList } from '../parser';
import { t, type Locale } from '../i18n';
import type { OutputFormat } from './types';

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

// ---- Internal helpers ----

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
