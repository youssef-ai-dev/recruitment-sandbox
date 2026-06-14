// ============================================================
// PARSER — Main entry point (orchestrates all extraction)
// ============================================================

import type { ParsedNotes } from './types';
import { extractTitle } from './extract-title';
import { extractExperience } from './extract-experience';
import { extractHardSkills, extractSoftSkills } from './extract-skills';
import { detectSections, extractResponsibilities, extractQualifications, extractNiceToHaves } from './extract-sections';
import { generateSummary } from './generate-summary';

// Re-export types and utilities for consumers
export type { ParsedNotes } from './types';
export { ensurePeriod, formatList, cleanLine, capitalizeTitle } from './utils';

export function parseNotes(text: string): ParsedNotes {
  const result: ParsedNotes = {
    title: '',
    summary: '',
    responsibilities: [],
    hardSkills: [],
    softSkills: [],
    qualifications: [],
    experienceLevel: '',
    niceToHaves: [],
    rawLines: []
  };

  const clean = text.replace(/\r\n/g, '\n').trim();
  const lines = clean.split('\n')
    .map(l => l.replace(/^[-•*◦▪]\s*/, '').replace(/^\d+[.)]\s*/, '').trim())
    .filter(l => l.length > 0);

  result.rawLines = lines;
  result.title = extractTitle(lines, clean);
  result.experienceLevel = extractExperience(clean);

  const sections = detectSections(lines);
  const lowerClean = clean.toLowerCase();
  result.hardSkills = extractHardSkills(lowerClean);
  result.softSkills = extractSoftSkills(lowerClean);
  result.responsibilities = extractResponsibilities(lines, sections);
  result.qualifications = extractQualifications(lines, sections);
  result.niceToHaves = extractNiceToHaves(lines, sections);
  result.summary = generateSummary(result);

  return result;
}
