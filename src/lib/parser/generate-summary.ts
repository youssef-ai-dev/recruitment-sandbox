// ============================================================
// PARSER — Auto-generated role summary
// ============================================================

import type { ParsedNotes } from './types';

export function generateSummary(parsed: ParsedNotes): string {
  const parts: string[] = [];
  const title = parsed.title !== 'Untitled Role' ? parsed.title : 'this role';
  const exp = parsed.experienceLevel
    ? ` with ${parsed.experienceLevel.includes('years') ? parsed.experienceLevel + ' of experience' : parsed.experienceLevel + ' experience'}`
    : '';

  parts.push(`We're looking for a ${title}${exp} to join our team and make an immediate impact.`);

  if (parsed.responsibilities.length > 0) {
    const topResp = parsed.responsibilities.slice(0, 3).map(r =>
      r.charAt(0).toLowerCase() + r.slice(1)
    );
    parts.push(`In this role, you'll be responsible for ${topResp[0]}${topResp.length > 1 ? ', ' + topResp[1] : ''}${topResp.length > 2 ? ', and ' + topResp[2] : ''}.`);
  }

  if (parsed.hardSkills.length > 0 || parsed.softSkills.length > 0) {
    const allSkills = [...parsed.hardSkills.slice(0, 3), ...parsed.softSkills.slice(0, 2)];
    parts.push(`The ideal candidate brings expertise in ${allSkills.join(', ')} and thrives in a collaborative, fast-paced environment.`);
  }

  return parts.join(' ');
}
