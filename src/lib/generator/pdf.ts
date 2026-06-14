// ============================================================
// GENERATOR — PDF Export
// ============================================================

import type { ParsedNotes } from '../parser';
import { ensurePeriod, formatList } from '../parser';
import { t, type Locale } from '../i18n';
import type { GuideData } from './types';

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
    addText(parsed.summary || generateJDSummary(parsed, locale), 10);

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

// Internal helper for PDF summary
function generateJDSummary(parsed: ParsedNotes, locale: Locale): string {
  const tr = t(locale);
  const parts: string[] = [];
  const title = parsed.title !== 'Untitled Role' ? parsed.title : 'this role';
  const exp = parsed.experienceLevel
    ? ` ${tr.withExperience} ${parsed.experienceLevel.includes('years') ? parsed.experienceLevel + ' ' + tr.relevantExperience : parsed.experienceLevel + ' ' + tr.relevantExperience}`
    : '';
  parts.push(`${tr.lookingFor} ${title}${exp} ${tr.toJoinOurTeam}`);
  if (parsed.responsibilities.length > 0) {
    const topResp = parsed.responsibilities.slice(0, 3).map(r => r.charAt(0).toLowerCase() + r.slice(1));
    parts.push(`${tr.inThisRole} ${topResp[0]}${topResp.length > 1 ? ', ' + topResp[1] : ''}${topResp.length > 2 ? ', and ' + topResp[2] : ''}.`);
  }
  if (parsed.hardSkills.length > 0 || parsed.softSkills.length > 0) {
    const allSkills = [...parsed.hardSkills.slice(0, 3), ...parsed.softSkills.slice(0, 2)];
    parts.push(`${tr.theIdealCandidate} ${allSkills.join(', ')} and thrives in a collaborative, fast-paced environment.`);
  }
  return parts.join(' ');
}
