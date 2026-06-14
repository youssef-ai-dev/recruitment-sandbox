// ============================================================
// GENERATOR — Shared types
// ============================================================

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
  locale: string;
}

export type OutputFormat = 'linkedin' | 'indeed' | 'glassdoor' | 'workable';
