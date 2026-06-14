// ============================================================
// PARSER — Shared types
// ============================================================

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
