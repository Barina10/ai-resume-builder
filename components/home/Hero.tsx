import Link from "next/link";

const features = [
  {
    title: "Live preview",
    body: "See your resume update as you type, side by side on desktop.",
  },
  {
    title: "Two templates",
    body: "Switch between a classic Professional layout and a Modern sidebar design.",
  },
  {
    title: "AI Improve",
    body: "Polish your professional summary with one click.",
  },
  {
    title: "PDF download",
    body: "Print or save a clean one-page resume from the preview.",
  },
];

export function Hero() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center sm:py-28">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
        AI Resume Builder
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        Create a professional resume in minutes
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
        Enter your experience, choose a template, and download a polished resume.
        No account required.
      </p>
      <Link
        href="/builder"
        className="mt-8 inline-flex rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Create My Resume
      </Link>
      <div className="mt-16 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm"
          >
            <h2 className="font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
