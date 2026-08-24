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
- `docs/styles.css` is one stylesheet, organized top-down in visual order (tokens → base → nav → hero → sections → responsive). Design tokens are CSS custom properties on `:root`. Add new tokens there, don't hardcode colors.
- `docs/app.js` is vanilla, no dependencies. It handles scroll-reveal (`IntersectionObserver` on `.reveal`), card tilt, the copyright year, and the mobile nav.
- **`app.js` must be loaded exactly once**, at the end of `<body>`. It was previously double-loaded, which double-bound every listener.
- Motion is gated on `prefers-reduced-motion`. Preserve that when adding animation.
- Breakpoints: 980px (grids collapse to one column) and 760px (mobile nav appears, type scales down).

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
| **AIAIO** | LLM prototyping platform, converts mockups + prompts into working React. **Best Overall, HackTX 2024**, $4,000 grand prize, 150+ teams. 4-person team, 24 hours. Next.js, TypeScript, React Flow, TLDRAW, Sandpack, Clerk, Vercel. | [Devpost](https://devpost.com/software/aiaio) · [GitHub](https://github.com/lryanle/AIAIO) |
| **HackKit** | Open-source hackathon platform, 1,200+ participants across 3 UTSA hackathons, ASU SunHacks, UTD WeHacks. Core contributor: auth, onboarding, event management. | [GitHub](https://github.com/acmutsa/HackKit) |
| **RowdyHacks X & XI** | Event platform for 500+ hackers. Frontend work via PRs; live production fixes during events. | [XI](https://github.com/acmutsa/RowdyHacksXI) · [X](https://github.com/acmutsa/RowdyHacksX) |
| **Recruiting automation** | 350+ job listings automated in Python + Power Automate, ~80% less manual posting time (Team Murph). | — |
| **carterlavigne.dev** | This site. | — |

### Experience

- **Web Developer (as needed)**, Alliance Builders — 08/2025–present. Building out the company website; ad-hoc technical support. **Nothing more than that.** Carter's master resume claims an "append-only access logging system," Zoho integrations, Python workflow automation, and internal tooling here — he has confirmed none of that is accurate. Do not reintroduce those claims from the resume.
- **Web & Automation Developer (freelance, as needed)**, Team Murph, San Antonio — 05/2023–present. Not a contract or retainer — they reach out when they want updates, and Carter does the work. Don't describe this as "contract."
- **Projects Junior Officer**, ACM UTSA — 10/2024–12/2025. Coordinated 3+ production platforms, roadmaps across 10+ devs/designers, 1,000+ active users per semester.
- **Technical Organizer**, RowdyHacks X & XI — 05/2024–12/2025. Took a lead role running RowdyHacks XI on the ground: judging setup, presentations, live technical ops.
- **Superintendent**, Construction Management and Development Inc., Austin — 05/2021–08/2022. $1.3M athletic facility renovation, 15 subcontractors.

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
