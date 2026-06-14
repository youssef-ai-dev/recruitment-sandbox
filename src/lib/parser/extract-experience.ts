// ============================================================
// PARSER — Experience level extraction (seniority & years)
// ============================================================

export function extractExperience(text: string): string {
  const yearMatch = text.match(/(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience|exp)/i);
  if (yearMatch) return `${yearMatch[1]}+ years`;
  if (/(?:senior|sr\.?|lead|principal|staff)\s/i.test(text)) return 'Senior-level';
  if (/(?:junior|jr\.?|entry.?level|associate)\s/i.test(text)) return 'Junior-level';
  if (/(?:mid.?level|mid.?senior)\s/i.test(text)) return 'Mid-level';
  return '';
}
