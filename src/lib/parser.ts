// ============================================================
// PARSER — Extracts structured data from raw notes
// ============================================================

import {
  HARD_SKILLS, SOFT_SKILLS, ACTION_VERBS, ROLE_KEYWORDS, SECTION_HEADERS
} from './skills';

export interface ParsedNotes {
  title: string;
  summary: string;
  responsibilities: string[];
  hardSkills: string[];
  softSkills: string[];
  qualifications: string[];
  experienceLevel: string;
  niceToHaves: string[];
  rawLines: string[];
}

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

function extractTitle(lines: string[], fullText: string): string {
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

function extractExperience(text: string): string {
  const yearMatch = text.match(/(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience|exp)/i);
  if (yearMatch) return `${yearMatch[1]}+ years`;
  if (/(?:senior|sr\.?|lead|principal|staff)\s/i.test(text)) return 'Senior-level';
  if (/(?:junior|jr\.?|entry.?level|associate)\s/i.test(text)) return 'Junior-level';
  if (/(?:mid.?level|mid.?senior)\s/i.test(text)) return 'Mid-level';
  return '';
}

function detectSections(lines: string[]): Record<string, number[]> {
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

function extractHardSkills(text: string): string[] {
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

function extractSoftSkills(text: string): string[] {
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

function extractResponsibilities(lines: string[], sections: Record<string, number[]>): string[] {
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

function extractQualifications(lines: string[], sections: Record<string, number[]>): string[] {
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

function extractNiceToHaves(lines: string[], sections: Record<string, number[]>): string[] {
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

function generateSummary(parsed: ParsedNotes): string {
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

export function cleanLine(line: string): string {
  return line.replace(/^[-•*◦▪]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/[:\-–—]+$/, '')
    .trim();
}

export function capitalizeTitle(str: string): string {
  const small = ['a','an','the','and','but','or','for','nor','in','on','at','to','of','by','with'];
  return str.split(' ').map((w, i) => {
    if (i === 0 || !small.includes(w.toLowerCase())) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }
    return w.toLowerCase();
  }).join(' ');
}

export function ensurePeriod(s: string): string {
  s = s.trim();
  if (!s.match(/[.!?]$/)) s += '.';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}
