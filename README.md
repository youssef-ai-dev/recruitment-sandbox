<div align="center">

# 🏗️ Recruitment Sandbox

### Turn messy role notes into polished hiring documents — instantly.

<br>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

<br>

Paste rough notes about any role. Get back a **LinkedIn-ready Job Description** and a **tailored Interview Guide** with 10 behavioral questions — all in seconds.

No sign-up. No API keys. No server. **All processing runs client-side.**

<br>

[Quick Start](#-quick-start) · [How It Works](#-how-it-works) · [Features](#-features) · [Architecture](#-architecture) · [Contributing](#-contributing)

</div>

---

## 📸 Preview

<div align="center">

| | Screenshot | |
|:---:|:---:|:---:|
| | *Dark editorial UI with gold accents* | |

</div>

---

## ⚡ Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git

### Clone & Run

```bash
git clone https://github.com/youssef-ai-dev/recruitment-sandbox.git
cd recruitment-sandbox
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel (One Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/youssef-ai-dev/recruitment-sandbox)

---

## 🔍 How It Works

```
┌──────────────────────────────────────────────────────┐
│                  YOUR RAW NOTES                       │
│                                                       │
│  "Looking for a senior PM to lead growth.            │
│   Needs SQL, A/B testing experience.                 │
│   Should be a strong communicator and                │
│   data-driven leader..."                              │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
         ┌──────────────────────────┐
         │      TEXT PARSER         │
         │                          │
         │  • Extract job title     │
         │  • Detect experience     │
         │  • Map 200+ hard skills  │
         │  • Identify soft skills  │
         │  • Parse sections        │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │   STRUCTURED DATA        │
         │                          │
         │  {                       │
         │    title: "..."          │
         │    hardSkills: [...]     │
         │    softSkills: [...]     │
         │    responsibilities:[…]  │
         │    qualifications: [...] │
         │  }                       │
         └─────┬──────────┬─────────┘
               │          │
               ▼          ▼
    ┌──────────────┐ ┌──────────────────┐
    │ JOB          │ │ INTERVIEW        │
    │ DESCRIPTION  │ │ GUIDE            │
    │              │ │                  │
    │ • About      │ │ • 10 Questions   │
    │ • Duties     │ │ • Skill-tagged   │
    │ • Skills     │ │ • Listen guides  │
    │ • Benefits   │ │ • STAR format    │
    └──────────────┘ └──────────────────┘
```

---

## ✨ Features

### 🧠 Smart Skill Detection

Recognizes 200+ technical skills across 14 domains:

| Domain | Examples |
|---|---|
| Software Engineering | Python, Java, TypeScript, Go, Rust |
| Data & Databases | SQL, PostgreSQL, MongoDB, Spark, Airflow |
| Cloud & DevOps | AWS, Docker, Kubernetes, Terraform, CI/CD |
| AI & Machine Learning | TensorFlow, PyTorch, NLP, LLMs |
| Product Management | Roadmap, A/B Testing, Agile, Scrum, Jira |
| Analytics & BI | Tableau, Power BI, Looker, Snowflake |
| Design | Figma, UX Design, Prototyping, Design Systems |
| Marketing | SEO, PPC, HubSpot, Growth Marketing |
| Sales | Salesforce, CRM, Pipeline Management |
| Finance | Financial Modeling, GAAP, Valuation |
| + 4 more domains | HR, Operations, Legal, Web Development |

Plus 50+ soft skills including leadership, communication, stakeholder management, and more.

### 📄 LinkedIn-Ready Job Descriptions

- Professional section formatting (About, Responsibilities, Requirements, Benefits)
- Experience level auto-detection (years of experience, seniority)
- Skill pills with visual tags
- Equal Opportunity Employer statement
- One-click copy as plain text for LinkedIn or ATS systems

### 🎯 Tailored Interview Guide

- 10 behavioral questions per role
- Questions matched specifically to detected skills when possible
- Each tagged as **Technical**, **Soft Skill**, or **General**
- "What to Listen For" guide with each question — 3 evaluation criteria
- Covers hard skills (SQL, Python, ML...) and soft skills (leadership, communication...)

### 🎨 Thoughtful Design

- Dark, editorial aesthetic with gold accents (`#c89b3c` on `#09090c`)
- Staggered `fadeUp` animations for smooth content reveal
- Responsive layout — 420px input panel + flexible output panel, stacking on mobile (<960px)
- Custom typography: Instrument Serif (headings), Source Serif 4 (body), JetBrains Mono (labels)
- SVG noise texture overlay for visual depth
- Animated tab UI with gold underline indicator
- Accessible color contrast and focus states

### ⚡ Client-Side Processing

- No backend — all parsing and generation happens in the browser
- No API calls, no data leaves your machine
- Instant results with zero network latency
- Privacy-first — your role notes never leave your device

---

## 📁 Project Architecture

```
recruitment-sandbox/
│
├── src/
│   │
│   ├── app/
│   │   ├── page.tsx              # Main page — input panel, output tabs, generate & copy
│   │   ├── layout.tsx            # Root layout with fonts & metadata
│   │   ├── globals.css           # Custom properties, noise texture, animations, components
│   │   └── api/
│   │       └── route.ts          # API route (reserved for future server features)
│   │
│   ├── lib/
│   │   ├── skills.ts             # Data layer — skill databases & question banks
│   │   │   ├── HARD_SKILLS       #   200+ technical skills across 14 categories
│   │   │   ├── SOFT_SKILLS       #   50+ interpersonal & professional skills
│   │   │   ├── ACTION_VERBS      #   Verb list for responsibility detection
│   │   │   ├── ROLE_KEYWORDS     #   Title detection keywords
│   │   │   ├── SECTION_HEADERS   #   Section boundary markers
│   │   │   ├── SPECIFIC_QUESTIONS#   Handcrafted Q&A for key skills (23 skills)
│   │   │   ├── GENERIC_*_TEMPLATES # Parametric templates for other skills
│   │   │   └── FALLBACK_QUESTIONS#   10 universal behavioral questions
│   │   │
│   │   ├── parser.ts             # Text analysis engine
│   │   │   ├── parseNotes()      #   Main entry — orchestrates all extraction
│   │   │   ├── extractTitle()    #   3-strategy title detection
│   │   │   ├── extractExperience()#  Seniority & years parsing
│   │   │   ├── detectSections()  #   Section boundary detection
│   │   │   ├── extractHardSkills()#  Regex matching against skill DB
│   │   │   ├── extractSoftSkills()#  Normalized soft skill detection
│   │   │   ├── extract*()        #   Responsibilities, qualifications, nice-to-haves
│   │   │   └── generateSummary() #   Auto-generated role summary
│   │   │
│   │   └── generator.ts          # Document builders
│   │       ├── generateJD()      #   Builds structured JD HTML
│   │       ├── generateGuide()   #   Builds 10-question interview guide
│   │       ├── renderGuide()     #   Converts guide data → styled HTML
│   │       └── *ToPlainText()    #   Copy-friendly plain text versions
│   │
│   ├── components/ui/            # shadcn/ui components (Radix + Tailwind)
│   └── hooks/                    # Custom React hooks
│
├── public/                       # Static assets (logo, robots.txt)
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies & scripts
```

### Data Flow

```
User Input (raw notes)
    │
    ▼
page.tsx :: handleGenerate()
    │
    ├──► parser.ts :: parseNotes()
    │         │
    │         ├── extractTitle()        ──► title string
    │         ├── extractExperience()   ──► experience level
    │         ├── extractHardSkills()   ──► skill[] from HARD_SKILLS
    │         ├── extractSoftSkills()   ──► skill[] from SOFT_SKILLS
    │         ├── extractResponsibilities()
    │         ├── extractQualifications()
    │         └── generateSummary()
    │
    ├──► generator.ts :: generateJD(parsed)
    │         └──► HTML string → DOM
    │
    └──► generator.ts :: generateGuide(parsed)
              ├── Match SPECIFIC_QUESTIONS by skill
              ├── Fill gaps with GENERIC templates
              ├── Fill remaining with FALLBACK
              └──► HTML string → DOM
```

---

## 🧪 Sample Input

<details>
<summary>Click to expand — Sample role notes</summary>

```
Senior Product Manager - Growth Team

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
```

</details>

<details>
<summary>Generated Job Description detects</summary>

- **Title:** Senior Product Manager
- **Experience:** 5+ years
- **Hard Skills:** SQL, A/B Testing, Tableau, Looker, Product Management, Agile, Product Analytics
- **Soft Skills:** Communication, Stakeholder Management, Data-Driven, Leadership, Mentoring

</details>

<details>
<summary>Generated Interview Guide includes questions targeting</summary>

SQL, A/B Testing, Product Management, Stakeholder Management, Communication, Leadership, Data-Driven, Mentoring, Strategic Thinking, Problem Solving

</details>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + CSS Custom Properties |
| UI Components | shadcn/ui (Radix primitives) |
| Runtime | Bun |
| Backend | None — client-side only |
| Fonts | Instrument Serif, Source Serif 4, JetBrains Mono |

---

## 🖥️ Browser Support

| Browser | Version | Status |
|---|---|---|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| Mobile Safari | 14+ | ✅ |
| Chrome Android | 90+ | ✅ |

---

## 🛣️ Roadmap

- [ ] **Export to PDF** — Generate downloadable PDF documents
- [ ] **Multiple output formats** — Job board variants (Indeed, Glassdoor, Workable)
- [ ] **Custom question count** — Slider to choose 5, 10, or 15 questions
- [ ] **Language support** — Arabic, Spanish, French job descriptions
- [ ] **Save history** — LocalStorage-based session persistence
- [ ] **Dark/Light theme toggle**
- [ ] **Bulk mode** — Process multiple roles at once
- [ ] **Scoring rubric generator** — Auto-create evaluation scorecards

---

## 🤝 Contributing

Contributions are welcome! Here's how:

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/recruitment-sandbox.git
cd recruitment-sandbox
bun install
bun dev
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

Edit the source files and visit `http://localhost:3000` to test.

### 4. Commit & Push

```bash
git add .
git commit -m "Add: brief description of your change"
git push origin feature/your-feature-name
```

### 5. Open a Pull Request

Describe what you changed and why.

### Areas Where Help Is Needed

| Area | Files | Difficulty |
|---|---|---|
| Add new skill mappings | `src/lib/skills.ts` | 🟢 Easy |
| Add new interview questions | `src/lib/skills.ts` | 🟢 Easy |
| Improve text parsing | `src/lib/parser.ts` | 🟡 Medium |
| Add PDF export | New module | 🔴 Advanced |
| Accessibility improvements | `src/app/globals.css` | 🟡 Medium |
| UI/UX enhancements | `src/app/page.tsx` | 🟡 Medium |

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with care using Next.js, TypeScript, and Tailwind CSS.**

If this project saves you time, give it a ⭐ on GitHub.

[Report Bug](https://github.com/youssef-ai-dev/recruitment-sandbox/issues) · [Request Feature](https://github.com/youssef-ai-dev/recruitment-sandbox/issues) · [Contribute](https://github.com/youssef-ai-dev/recruitment-sandbox/pulls)

</div>
