import Link from "next/link";
import { TEMPLATES } from "@/components/builder/TemplatePicker";

const features = [
  {
    title: "Live preview",
    body: "Every field updates a full-page resume instantly, so you can see the result as you write.",
  },
  {
    title: "ATS-friendly templates",
    body: "Classic, Modern, Minimal, and Executive layouts with clear headings and no layout traps.",
  },
  {
    title: "AI that stays honest",
    body: "Improve wording and generate bullets from your facts. The AI will not invent jobs or skills.",
  },
  {
    title: "Job keyword match",
    body: "Paste a posting, see an estimated match score, and decide which keywords you actually have.",
  },
];

const steps = [
  { title: "Add your facts", body: "Enter experience, education, and skills. Nothing is saved to a server yet." },
  { title: "Use AI carefully", body: "Rewrite summaries and bullets, then accept only what is accurate." },
  { title: "Match the job", body: "Analyze a job description and tighten language without fabricating history." },
  { title: "Export", body: "Print or save a searchable PDF from the live preview." },
];

const faqs = [
  {
    q: "Does this guarantee I will pass an ATS?",
    a: "No. The ATS score is an estimate based on structure and keywords. Parsing still varies by employer.",
  },
  {
    q: "Will AI invent experience?",
    a: "No. Prompts and local fallbacks are written to keep your facts. If information is missing, you are asked to add it.",
  },
  {
    q: "Where is my resume stored?",
    a: "In this browser. You can add accounts later without rewriting the builder. Resume records already include an ownerId field.",
  },
  {
    q: "Do I need an OpenAI key?",
    a: "Optional. Set OPENAI_API_KEY in .env.local for a hosted model. Otherwise the app uses a local rewrite.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-full bg-[#f4f1ea] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-sm font-semibold tracking-tight">AI Resume Builder</p>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/resumes" className="text-slate-600 hover:text-slate-900">
              My Resumes
            </Link>
            <Link href="/builder" className="bg-slate-900 px-4 py-2 text-white">
              Create My Resume
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
          AI Resume Builder
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Build a Resume That Gets Noticed
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Write a professional, ATS-friendly resume with live preview and AI that
          improves your language without inventing your career.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/builder" className="bg-slate-900 px-5 py-3 text-sm font-medium text-white">
            Create My Resume
          </Link>
          <Link
            href="/builder"
            className="border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800"
          >
            Build From Scratch
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title}>
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <p className="text-xs text-slate-500">0{index + 1}</p>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold">Resume templates</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Switch templates in the builder. All four keep a simple heading structure for ATS tools.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((template) => (
              <article key={template.id} className="border border-slate-200 p-4">
                <div className="mb-4 h-36 bg-[#f4f1ea] p-3">
                  <div className="h-2 w-1/2 bg-slate-900" />
                  <div className="mt-3 h-1 w-full bg-slate-300" />
                  <div className="mt-2 h-1 w-5/6 bg-slate-300" />
                  <div className="mt-2 h-1 w-2/3 bg-slate-300" />
                </div>
                <h3 className="font-medium">{template.label}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-8 space-y-6">
          {faqs.map((item) => (
            <article key={item.q} className="border-b border-slate-200 pb-6">
              <h3 className="font-medium">{item.q}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-slate-600">
          <p>AI Resume Builder</p>
          <div className="flex gap-4">
            <Link href="/resumes">My Resumes</Link>
            <Link href="/builder">Create My Resume</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
