// ============================================================
// PARSER — Shared utility functions
// ============================================================

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
