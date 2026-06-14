// ============================================================
// PARSER — Skill detection (hard & soft skills)
// ============================================================

import { HARD_SKILLS, SOFT_SKILLS } from '../skills';

export function extractHardSkills(text: string): string[] {
  const found: string[] = [];
  for (const [, skills] of Object.entries(HARD_SKILLS)) {
    for (const skill of skills) {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(text)) found.push(skill);
    }
  }
  return [...new Set(found)];
}

export function extractSoftSkills(text: string): string[] {
  const found: string[] = [];
  for (const skill of SOFT_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      let normalized = skill.replace(/-/g, ' ');
      normalized = normalized.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      if (!found.some(f => f.toLowerCase() === normalized.toLowerCase())) {
        found.push(normalized);
      }
    }
  }
  return found;
}
