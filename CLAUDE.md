# carterlavigne.dev — project context

Personal portfolio site for Carter LaVigne. Read this before making changes.

## Stack & deployment

- **Plain static site.** Hand-written HTML/CSS/JS. No framework, no bundler, no build step. Keep it that way unless Carter says otherwise — the "built from scratch" angle is part of what the site is demonstrating.
- **Served from `docs/`** via GitHub Pages. Anything outside `docs/` is not published.
- **Repo:** `github.com/spiderCSman/spidercsman.github.io` (the local folder is named `Personal-Site` — they do not match).
- **Domain:** `carterlavigne.dev`, set by `docs/CNAME`. The root-level `CNAME` is redundant for a `/docs` build.
- **Local dev:** `pnpm dev` → `live-server docs --port=3000`.

## Conventions

- Content lives directly in `docs/index.html`. There is no CMS or data file — static HTML is deliberate here, since it keeps the page crawlable and avoids a loading flash on a site whose whole job is to be read by recruiters.

### Design system (rebuilt Aug 2026)

The site is an **editorial/Swiss layout**, not the old dark-glassmorphism template. Hold the line on this:

- **Type is the design.** `Instrument Serif` for display and headings, `Inter` for text, `JetBrains Mono` for metadata, labels, and nav. Loaded from Google Fonts with real fallback stacks. Never introduce a fourth family.
- **Structure is hairline rules and a strict grid**, not cards and shadows. Sections carry numbers (`01`–`05`) in mono. Rows are `6rem` index column + content + aside. Radii are 2–3px; there are no pills, no glass, no glow, no tilt.
- **Warm neutrals, never pure black or white.** Paper `#fbfaf7` / ink `#14130f` in light; `#0e0d0c` / `#f6f3ed` in dark. One accent: violet (`#5b34e8` light, `#b39bff` dark).
- **Dark mode is a full peer, not an inversion.** Every colour is defined on bare `:root`; the `@media (prefers-color-scheme: dark)` block (guarded `:root:not([data-theme="light"])`) and the `:root[data-theme="dark"]` block only *redefine* those same names. Add new colours as tokens in all three places or dark mode silently breaks.
- **Theme toggle**: an inline script in `<head>` applies the stored preference before first paint (prevents flash); `app.js` handles toggling and persists to `localStorage` under `clv.theme`. Every read/write is in try/catch.
- `docs/app.js` is vanilla, no dependencies: theme toggle, mobile nav, staggered scroll-reveal (`IntersectionObserver` on `.reveal`), footer year.
- **`app.js` must be loaded exactly once**, at the end of `<body>`. It was previously double-loaded, which double-bound every listener.
- Motion is gated on `prefers-reduced-motion`. Preserve that when adding animation.
- Breakpoints: **900px** (grids collapse to one column) and **700px** (mobile nav appears).
- The todo demo at `docs/projects/todo/` inherits the root stylesheet and its tokens, then layers `projects/todo/styles.css`. **If you change the design system, that page changes too — always re-check it.**

## Gotchas

- `.gitignore` previously contained a bare `image/`, which silently matched `docs/image/` at any depth. It is now scoped to `/image/`. Do not un-scope it.
- The device bridge cannot delete files on Carter's machine or write to `.git/index.lock`. **Claude cannot run git writes here** — Carter commits and pushes himself.
- `_to_delete/` holds files Claude couldn't remove. It's gitignored; Carter clears it manually.
- `express` is still in `dependencies` but nothing uses it — the site is fully static. `.env` has `PORT`/`DATABASE_URL`, suggesting a backend was once considered.
- `docs/projects/todo/` is three **empty** files committed as "feat: add todo project." Nothing links to it. Either build it or delete it.

## Carter — background

Source of truth is his master resume. Facts below are already reflected on the site; keep them in sync if either changes.

- **Austin, TX.** BS Computer Science (Software Engineering), UTSA, Aug 2021 – Dec 2025. GPA 3.72, Honors Graduate, Dean's List **8 of 9 semesters** (never "all eight" — that falsely implies every semester he attended).

> **Accuracy rule — read this before writing any copy.** Carter's master resume overstates several things. He has personally corrected: Alliance Builders (see below), the Team Murph "contract" framing, Dean's List, and his level of contribution to AIAIO. **Treat the resume as a draft, not as verified fact.** When a claim can't be traced to something Carter said directly in conversation or to a public artifact, ask him before putting it on the site.
- Contact on site: `carterlavigne.jobs@gmail.com` (distinct from his personal `carterlavigne3@gmail.com` — use the jobs address on the site).
- GitHub `spiderCSman` · LinkedIn `carter-m-lavigne`.

### Projects on the site

| Project | What | Links |
|---|---|---|
| **AIAIO** | LLM prototyping platform, converts mockups + prompts into working React. **Best Overall, HackTX 2024**, $4,000 grand prize, 150+ teams. 4-person team, 24 hours. **Carter was one of four and has said he did not contribute much — it was his first hackathon.** Write it as team credit ("part of the four-person team behind…"), never as though he built the LLM pipelines himself. Next.js, TypeScript, React Flow, TLDRAW, Sandpack, Clerk, Vercel. | [Devpost](https://devpost.com/software/aiaio) · [GitHub](https://github.com/lryanle/AIAIO) |
| **HackKit** | Open-source hackathon platform, 1,200+ participants across 3 UTSA hackathons, ASU SunHacks, UTD WeHacks. Core contributor: auth, onboarding, event management. | [GitHub](https://github.com/acmutsa/HackKit) |
| **Astronomix** | HackTX 2025. Full-stack AI app: Gemini-generated tarot/astrology readings + a stock-portfolio tracker. Team project, **Carter was lead**. React 19/Vite/Router/Tailwind/Framer Motion/Recharts; Node + Express 5; Turso (libSQL/SQLite) with `users` and `user_stocks`; Google Gemini with structured JSON schema; Twelve Data API. 7 client routes, 6 REST endpoints, parameterized queries. **Did not place** — never imply it won. **Never call it secure:** passwords are compared in plaintext and the Gemini key is exposed client-side via `VITE_GEMINI_API_KEY`. | [GitHub](https://github.com/spiderCSman/HackTX2025) |
| **RowdyHacks X & XI** | Event platform for 500+ hackers. Frontend work via PRs; live production fixes during events. | [xi.rowdyhacks.org](https://xi.rowdyhacks.org/) · [x.rowdyhacks.org](https://x.rowdyhacks.org/) · [code](https://github.com/acmutsa/RowdyHacksXI) |
| **Recruiting automation** | 350+ job listings automated in Python + Power Automate, ~80% less manual posting time (Team Murph). | — |
| **carterlavigne.dev** | This site. | — |

### Experience

- **Web Developer**, Alliance Builders — 05/2026–present. Leading a ground-up WordPress rebuild of the company site as sole developer. **That is the whole role on the site — one bullet, by Carter's explicit instruction.** Do NOT add day-to-day technical support, software configuration, email setup, or Zoho, even though his resume lists them; he asked for all of it removed.
- **Superintendent (part-time)**, Alliance Builders — 08/2025–present. Construction supervision, not software. Lives in the site's "Before software" card, not the main timeline. Carter's master resume claims an "append-only access logging system," Zoho integrations, Python workflow automation, and internal tooling here — he has confirmed none of that is accurate. Do not reintroduce those claims from the resume.
- **Web & Automation Developer (freelance, as needed)**, Team Murph, San Antonio — 05/2023–present. Not a contract or retainer — they reach out when they want updates, and Carter does the work. Don't describe this as "contract."
- **Projects Junior Officer**, ACM UTSA — 10/2024–12/2025. Coordinated 3+ production platforms, roadmaps across 10+ devs/designers, 1,000+ active users per semester.
- **Technical Organizer**, RowdyHacks X & XI — 05/2024–12/2025. Took a lead role running RowdyHacks XI on the ground: judging setup, presentations, live technical ops.
- **Superintendent**, Construction Management and Development Inc., Austin — 05/2021–08/2022. $1.3M athletic facility renovation, 15 subcontractors. Also in the "Before software" card.

**Non-technical roles rule:** the site is a software portfolio, so engineering work leads. The two construction superintendent roles are kept — compressed — in a `.prior-card` below the timeline, because a $1.3M project with 15 subcontractors at nineteen is a real differentiator. Topgolf and Domino's are on the resume but deliberately NOT on the site; they compete with AIAIO and HackKit for a recruiter's 30 seconds and lose. Don't add them back.

### Skills

TypeScript, JavaScript, Python, Java, C, SQL, HTML, CSS, Bash · React, Next.js, React Native, React Flow, Tailwind · PostgreSQL, REST, Clerk, OAuth · Git/PRs/code review, Vercel, Sandpack, Trello, Notion, Agile, Android Studio, Power Automate · LLM integration, prompt engineering, code generation, multimodal input

## Writing the copy

Carter's real work is specific and quantified — lean on that. Name the project, name the number, name the stack. Earlier versions of this site described real work in category language ("Operations Tooling," "AI Product Work") that read as generic and buried a $4,000 grand prize. Prefer "AIAIO — Best Overall at HackTX 2024" over "AI Product Work."

## Known open items

- Root `CNAME` is redundant.
- `express` dependency is unused.
- `docs/projects/todo/` is an empty stub.
- No resume link or download on the site (a resume button was removed in an earlier commit).
- No `robots.txt` or `sitemap.xml`.
- The hero side panel (`.hero-panel`, `0.5fr` column) is narrow and its text wraps tightly at desktop widths.
