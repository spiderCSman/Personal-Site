export default function PortfolioWebsite() {
  const projects = [
    {
      title: "RowdyHacks Platform",
      description:
        "Built and maintained hackathon web experiences used across major student events, focusing on frontend reliability, responsive design, and clear user flows.",
      stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Hackathon Operations Tools",
      description:
        "Helped create tools and workflows that improved organizer efficiency and supported smoother event operations for large student communities.",
      stack: ["JavaScript", "React", "PostgreSQL", "Clerk"],
    },
    {
      title: "AI-Assisted Product Prototypes",
      description:
        "Explored AI-powered interfaces and prototyping workflows to turn ideas into usable products quickly during hackathons and personal builds.",
      stack: ["OpenAI APIs", "React", "Node.js"],
    },
  ];

  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Node.js",
    "Git",
    "PostgreSQL",
    "AI-integrated workflows",
    "Frontend engineering",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 lg:px-12">
        <header className="sticky top-0 z-20 mb-10 rounded-2xl border border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Carter LaVigne</h1>
              <p className="mt-1 text-sm text-slate-300 md:text-base">
                Software Engineer • Frontend Developer • AI-Curious Builder
              </p>
            </div>
            <nav className="flex flex-wrap gap-3 text-sm text-slate-300">
              <a href="#about" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white">About</a>
              <a href="#projects" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white">Projects</a>
              <a href="#skills" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white">Skills</a>
              <a href="#contact" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white">Contact</a>
            </nav>
          </div>
        </header>

        <main className="space-y-8">
          <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20">
              <p className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
                Open to software roles
              </p>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
                I build clean, useful software with a focus on frontend experience and real-world impact.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                I’m a Computer Science graduate focused on software engineering, frontend development, and practical AI-assisted tools. I enjoy turning messy ideas into polished products that people can actually use.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Contact Me
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-purple-500/10 p-8 shadow-2xl shadow-black/20">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">Quick Snapshot</p>
              <div className="mt-6 space-y-5 text-sm text-slate-200">
                <div>
                  <p className="text-slate-400">Focus</p>
                  <p className="mt-1 text-base font-medium text-white">Frontend, full-stack projects, AI-enabled workflows</p>
                </div>
                <div>
                  <p className="text-slate-400">Background</p>
                  <p className="mt-1 text-base font-medium text-white">Computer Science graduate with hackathon and leadership experience</p>
                </div>
                <div>
                  <p className="text-slate-400">Strengths</p>
                  <p className="mt-1 text-base font-medium text-white">Shipping fast, learning quickly, building for real users</p>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-semibold">About Me</h3>
            <p className="mt-4 max-w-4xl text-slate-300 leading-7">
              I’m interested in software engineering roles where I can contribute to user-facing products, collaborate with strong teams, and keep growing across frontend, backend, and AI-powered systems. My experience includes student leadership, hackathon projects, and building production-facing tools for technical communities.
            </p>
          </section>

          <section id="projects" className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Featured Projects</h3>
                <p className="mt-2 text-slate-300">A few examples of the kind of work I like to build.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-white/20"
                >
                  <h4 className="text-lg font-semibold">{project.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="skills" className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-semibold">Skills</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section id="contact" className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-semibold">Contact</h3>
            <p className="mt-3 max-w-2xl text-slate-300 leading-7">
              Add your email, LinkedIn, GitHub, and resume link here so recruiters can reach you easily. Keep this section simple and easy to scan.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Email</p>
                <p className="mt-1 font-medium">carterlavigne3@gmail.com</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">LinkedIn</p>
                <p className="mt-1 font-medium">linkedin.com/in/carter-m-lavigne/</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">GitHub</p>
                <p className="mt-1 font-medium">https://github.com/spiderCSman</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
