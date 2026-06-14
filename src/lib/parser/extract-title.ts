// ============================================================
// PARSER — Title extraction (3-strategy detection)
// ============================================================

import { ROLE_KEYWORDS } from '../skills';
import { capitalizeTitle } from './utils';

export function extractTitle(lines: string[], fullText: string): string {
  // Strategy 1: Role-like first line
  if (lines.length > 0) {
    const first = lines[0].replace(/[:\-–—]+$/, '').trim();
    if (first.length < 80) {
      const lower = first.toLowerCase();
      if (ROLE_KEYWORDS.some(k => lower.includes(k))) return first;
      if (first.length < 50 && !first.includes('.') && lines.length > 1) return first;
    }
  }

  // Strategy 2: Search for role pattern
  const rolePattern = /(?:looking for|seeking|hire|hiring)\s+(?:a|an)\s+(.+?)(?:\.|,|\n|$)/i;
  const match = fullText.match(rolePattern);
  if (match) {
    let candidate = match[1].trim();
    candidate = candidate.replace(/\s+(?:to|who|that|for)\b.*$/i, '').trim();
    if (candidate.length < 60) return capitalizeTitle(candidate);
  }

  // Strategy 3: Find a line with role keywords
  for (const line of lines.slice(0, 5)) {
    const lower = line.toLowerCase();
    if (ROLE_KEYWORDS.some(k => lower.includes(k)) && line.length < 70) {
      return line.replace(/[:\-–—]+$/, '').trim();
    }
  }

  return 'Untitled Role';
}
