// ============================================================
// PARSER — Section detection & content extraction
// ============================================================

import { SECTION_HEADERS, ACTION_VERBS } from '../skills';
import { cleanLine } from './utils';

export function detectSections(lines: string[]): Record<string, number[]> {
  const sections: Record<string, number[]> = {};
  let currentSection = 'top';

  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase().replace(/[:\-–—]+$/, '').trim();
    if (SECTION_HEADERS.some(h => lower.startsWith(h) || lower === h) && lines[i].length < 60) {
      currentSection = lower;
      sections[currentSection] = [];
    } else {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(i);
    }
  }

  return sections;
}

export function extractResponsibilities(lines: string[], sections: Record<string, number[]>): string[] {
  const resps: string[] = [];
  for (const [section, indices] of Object.entries(sections)) {
    if (section.includes('responsib') || section.includes('duties') ||
        section.includes('what you') || section.includes('you will') ||
        section.includes("you'll")) {
      for (const idx of indices) {
        if (lines[idx].length > 10) resps.push(cleanLine(lines[idx]));
      }
    }
  }
  if (resps.length === 0) {
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (ACTION_VERBS.some(v => lower.startsWith(v) || lower.match(new RegExp(`\\b${v}\\b`)))) {
        if (line.length > 15 && line.length < 250) resps.push(cleanLine(line));
      }
    }
  }
  return [...new Set(resps)].slice(0, 12);
}

export function extractQualifications(lines: string[], sections: Record<string, number[]>): string[] {
  const quals: string[] = [];
  for (const [section, indices] of Object.entries(sections)) {
    if (section.includes('require') || section.includes('qualif') ||
        section.includes('must have') || section.includes('experience')) {
      for (const idx of indices) {
        if (lines[idx].length > 10) quals.push(cleanLine(lines[idx]));
      }
    }
  }
  return [...new Set(quals)].slice(0, 10);
}

export function extractNiceToHaves(lines: string[], sections: Record<string, number[]>): string[] {
  const nths: string[] = [];
  for (const [section, indices] of Object.entries(sections)) {
    if (section.includes('nice') || section.includes('preferred') ||
        section.includes('bonus') || section.includes('plus') ||
        section.includes('good to')) {
      for (const idx of indices) {
        if (lines[idx].length > 10) nths.push(cleanLine(lines[idx]));
      }
    }
  }
  return [...new Set(nths)].slice(0, 6);
}
