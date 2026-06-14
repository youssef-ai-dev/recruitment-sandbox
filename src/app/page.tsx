'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { parseNotes } from '@/lib/parser';
import {
  generateJD,
  generateGuide,
  renderGuide,
  jdToPlainText,
  guideToPlainText,
  exportToPDF,
} from '@/lib/generator';
import type { GuideData } from '@/lib/generator';
import type { OutputFormat } from '@/lib/generator';
import type { ParsedNotes } from '@/lib/parser';
import { CONFIG } from '@/lib/skills';
import { LOCALES, type Locale } from '@/lib/i18n';

// ─── Click-outside hook ──────────────────────────────────────────────────────

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// ─── Sample text ────────────────────────────────────────────────────────────

const SAMPLE_TEXT = `Senior Product Manager - Growth Team

Looking for a senior PM to own growth strategy for our B2B SaaS platform.

Responsibilities:
- Own the product roadmap for growth and activation features
- Design and run A/B experiments to improve conversion rates
- Partner with engineering, design, and data science teams
- Analyze user behavior data using SQL and analytics tools
- Define success metrics and track KPIs for the growth team
- Present findings and recommendations to executive leadership
- Mentor junior product managers on the team

Requirements:
- 5+ years of product management experience
- Strong analytical and data-driven mindset
- Proficiency in SQL and data analysis tools (Tableau, Looker)
- Excellent communication and stakeholder management skills
- Experience with B2B or SaaS products
- Track record of driving measurable business outcomes
- Ability to thrive in a fast-paced, ambiguous environment

Nice to have:
- MBA or advanced degree
- Experience with machine learning or AI products
- Background in growth hacking or marketing technology

We need someone who is a strong leader but also collaborative. They should be able to think strategically while being hands-on with data. Strong presentation skills are important since they'll be presenting to the C-suite regularly.`;

// ─── Types ──────────────────────────────────────────────────────────────────

type TabKey = 'jd' | 'guide';

const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'glassdoor', label: 'Glassdoor' },
  { value: 'workable', label: 'Workable' },
];

const QUESTION_OPTIONS = [5, 10, 15] as const;

// ─── Component ──────────────────────────────────────────────────────────────

export default function Home() {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('jd');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jdHtml, setJdHtml] = useState<string | null>(null);
  const [guideData, setGuideData] = useState<GuideData | null>(null);
  const [guideHtml, setGuideHtml] = useState<string | null>(null);
  const [parsedRef, setParsedRef] = useState<ParsedNotes | null>(null);
  const [copied, setCopied] = useState(false);
  const [genKey, setGenKey] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // ─── New feature states ───────────────────────────────────────────────
  const [locale, setLocale] = useState<Locale>('en');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('linkedin');
  const [questionCount, setQuestionCount] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [exporting, setExporting] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings dropdown on click outside
  useClickOutside(settingsRef, () => setShowSettings(false));

  // ─── Tab indicator animation ────────────────────────────────────────────

  const updateIndicator = useCallback(() => {
    const idx = activeTab === 'jd' ? 0 : 1;
    const btn = tabRefs.current[idx];
    if (btn) {
      setIndicatorStyle({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  // ─── Handlers ───────────────────────────────────────────────────────────

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (error) setError(null);
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TEXT);
    if (error) setError(null);
  };

  const handleGenerate = useCallback(() => {
    if (input.trim().length < CONFIG.MIN_INPUT) {
      setError(`Please enter at least a few sentences about the role. (${input.trim().length}/${CONFIG.MIN_INPUT} characters)`);
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const parsed = parseNotes(input);
        const jd = generateJD(parsed, locale, outputFormat);
        const guide = generateGuide(parsed, questionCount, locale);
        const guideRendered = renderGuide(guide);

        setParsedRef(parsed);
        setJdHtml(jd);
        setGuideData(guide);
        setGuideHtml(guideRendered);
        setGenKey(prev => prev + 1);
        setActiveTab('jd');
      } catch (err) {
        setError('Something went wrong during generation. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, CONFIG.GEN_DELAY);
  }, [input, error, locale, outputFormat, questionCount]);

  const handleCopy = useCallback(async () => {
    let text = '';
    if (activeTab === 'jd' && parsedRef) {
      text = jdToPlainText(parsedRef, locale);
    } else if (activeTab === 'guide' && guideData) {
      text = guideToPlainText(guideData);
    }
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }, [activeTab, parsedRef, guideData, locale]);

  const handleExportPDF = useCallback(async () => {
    if (!parsedRef || !guideData) return;
    setExporting(true);
    try {
      await exportToPDF(parsedRef, guideData, activeTab, locale);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [parsedRef, guideData, activeTab, locale]);

  const hasOutput = jdHtml !== null;

  return (
    <div className="rs-root">
      {/* Noise overlay */}
      <div className="rs-noise" aria-hidden="true" />

      <div className="rs-container">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="rs-header">
          <div className="rs-brand">
            <div className="rs-brand-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
              </svg>
            </div>
            <div>
              <h1 className="rs-brand-title">Recruitment Sandbox</h1>
              <p className="rs-tagline">raw notes <span>→</span> polished JD + interview guide</p>
            </div>
          </div>

          {/* ── Settings (Header) ────────────────────────────────────── */}
          <div className="rs-header-actions" ref={settingsRef}>
            <button
              type="button"
              className={`rs-header-settings-btn ${showSettings ? 'active' : ''}`}
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>

            {showSettings && (
              <div className="rs-settings-dropdown">
                <div className="rs-settings-dropdown-header">
                  <span>Settings</span>
                </div>

                {/* Language */}
                <div className="rs-setting-row">
                  <label className="rs-setting-label">Language</label>
                  <div className="rs-locale-pills">
                    {LOCALES.map(l => (
                      <button
                        key={l.code}
                        type="button"
                        className={`rs-locale-pill ${locale === l.code ? 'active' : ''}`}
                        onClick={() => setLocale(l.code)}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Format */}
                <div className="rs-setting-row">
                  <label className="rs-setting-label">JD Format</label>
                  <div className="rs-locale-pills">
                    {OUTPUT_FORMATS.map(f => (
                      <button
                        key={f.value}
                        type="button"
                        className={`rs-locale-pill ${outputFormat === f.value ? 'active' : ''}`}
                        onClick={() => setOutputFormat(f.value)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div className="rs-setting-row">
                  <label className="rs-setting-label">Questions</label>
                  <div className="rs-question-slider-wrap">
                    <input
                      type="range"
                      min={5}
                      max={15}
                      step={5}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="rs-question-slider"
                    />
                    <div className="rs-slider-labels">
                      {QUESTION_OPTIONS.map(n => (
                        <span
                          key={n}
                          className={`rs-slider-label ${questionCount === n ? 'active' : ''}`}
                          onClick={() => setQuestionCount(n)}
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ── Workspace ───────────────────────────────────────────────── */}
        <main className="rs-workspace">
          {/* ── Input Panel ──────────────────────────────────────────── */}
          <div className="rs-panel">
            <div className="rs-panel-header">
              <span className="rs-panel-label">Raw Notes</span>
              <span className="rs-panel-hint">paste anything</span>
            </div>

            <div className="rs-input-body">
              <div className="textarea-wrap">
                <textarea
                  className="rs-textarea"
                  value={input}
                  onChange={handleInputChange}
                  placeholder={`Drop your rough notes here...\n\ne.g. "Looking for a senior PM to lead growth. Needs SQL, A/B testing experience.\nShould be a strong communicator and data-driven leader..."`}
                  spellCheck={false}
                />
              </div>
              <div className="rs-input-footer">
                <span className="rs-char-count">{input.length} character{input.length !== 1 ? 's' : ''}</span>
                <button type="button" className="rs-sample-btn" onClick={handleLoadSample}>
                  Load sample
                </button>
              </div>

              {error && (
                <div className="rs-error" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div className="rs-input-actions">
              <button
                type="button"
                className="rs-generate-btn"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="rs-spinner" />
                    Generating…
                  </>
                ) : (
                  'Generate Documents'
                )}
              </button>
            </div>
          </div>

          {/* ── Output Panel ─────────────────────────────────────────── */}
          <div className="rs-panel rs-output-panel">
            {/* Tab bar */}
            <div className="rs-tab-bar">
              <div className="rs-tab-buttons" id="tabs">
                <button
                  ref={(el) => { tabRefs.current[0] = el; }}
                  type="button"
                  className={`rs-tab-btn ${activeTab === 'jd' ? 'active' : ''}`}
                  onClick={() => setActiveTab('jd')}
                >
                  Job Description
                </button>
                <button
                  ref={(el) => { tabRefs.current[1] = el; }}
                  type="button"
                  className={`rs-tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
                  onClick={() => setActiveTab('guide')}
                >
                  Interview Guide
                </button>
                <span
                  className="rs-tab-indicator"
                  style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                  }}
                />
              </div>

              {hasOutput && (
                <div className="rs-action-btns">
                  <button
                    type="button"
                    className="rs-action-btn"
                    onClick={handleExportPDF}
                    disabled={exporting}
                    title="Export as PDF"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>{exporting ? '…' : 'PDF'}</span>
                  </button>
                  <button
                    type="button"
                    className={`rs-action-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tab content */}
            <div className="rs-output-body-wrap">
              {/* JD Tab */}
              <div className={`rs-tab-content ${activeTab === 'jd' ? 'visible' : ''}`}>
                {jdHtml ? (
                  <div key={`jd-${genKey}`} dangerouslySetInnerHTML={{ __html: jdHtml }} />
                ) : (
                  <div className="rs-placeholder">
                    <div className="rs-placeholder-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M8 13h8" />
                        <path d="M8 17h5" />
                      </svg>
                    </div>
                    <p className="rs-placeholder-text">Job Description</p>
                    <p className="rs-placeholder-sub">Enter your raw role notes and click Generate to create a LinkedIn-ready job description.</p>
                  </div>
                )}
              </div>

              {/* Guide Tab */}
              <div className={`rs-tab-content ${activeTab === 'guide' ? 'visible' : ''}`}>
                {guideHtml ? (
                  <div key={`guide-${genKey}`} dangerouslySetInnerHTML={{ __html: guideHtml }} />
                ) : (
                  <div className="rs-placeholder">
                    <div className="rs-placeholder-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </div>
                    <p className="rs-placeholder-text">Interview Guide</p>
                    <p className="rs-placeholder-sub">Behavioral interview questions will appear here, tailored to the skills in your JD.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
