import {
  EducationBlock,
  ExperienceBlock,
  ProjectsBlock,
  headingClass,
  paperStyle,
  visibleResume,
} from "@/components/preview/blocks";
import { hasText } from "@/lib/empty-resume";
import type { ResumeData } from "@/lib/types";

function Title({ data, children }: { data: ResumeData; children: string }) {
  return (
    <h3
      className={`${headingClass(data.customization.headingStyle)} mb-2 border-b pb-1`}
      style={{ borderColor: "var(--resume-accent)", color: "var(--resume-accent)" }}
    >
      {children}
    </h3>
  );
}

export function ClassicTemplate({ data }: { data: ResumeData }) {
  const view = visibleResume(data);
  return (
    <article className="resume-paper min-h-[1056px] bg-white leading-relaxed text-slate-800" style={paperStyle(data)}>
      <header className="mb-5 text-center">
        <h1 className="text-3xl font-semibold tracking-wide text-slate-900">
          {data.personal.fullName || "Your Name"}
        </h1>
        {hasText(data.personal.title) ? (
          <p className="mt-1 text-sm" style={{ color: "var(--resume-accent)" }}>
            {data.personal.title}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-slate-600">{view.contacts.join("  ·  ")}</p>
      </header>
      {hasText(data.summary) ? (
        <section className="resume-section">
          <Title data={data}>Summary</Title>
          <p>{data.summary}</p>
        </section>
      ) : null}
      {view.experience.length ? (
        <section className="resume-section">
          <Title data={data}>Experience</Title>
          <ExperienceBlock data={data} />
        </section>
      ) : null}
      {view.education.length ? (
        <section className="resume-section">
          <Title data={data}>Education</Title>
          <EducationBlock data={data} />
        </section>
      ) : null}
      {view.skills.length ? (
        <section className="resume-section">
          <Title data={data}>Skills</Title>
          <p>{view.skills.map((skill) => skill.name).join(" · ")}</p>
        </section>
      ) : null}
      {view.projects.length ? (
        <section className="resume-section">
          <Title data={data}>Projects</Title>
          <ProjectsBlock data={data} />
        </section>
      ) : null}
      {view.certs.length ? (
        <section className="resume-section">
          <Title data={data}>Certifications</Title>
          {view.certs.map((item) => (
            <p key={item.id}>
              {item.name}
              {item.issuer ? ` — ${item.issuer}` : ""}
              {item.year ? ` (${item.year})` : ""}
            </p>
          ))}
        </section>
      ) : null}
      {view.languages.length ? (
        <section className="resume-section">
          <Title data={data}>Languages</Title>
          <p>
            {view.languages
              .map((item) => (item.proficiency ? `${item.name} (${item.proficiency})` : item.name))
              .join(" · ")}
          </p>
        </section>
      ) : null}
      {view.awards.length ? (
        <section className="resume-section">
          <Title data={data}>Awards</Title>
          {view.awards.map((item) => (
            <p key={item.id}>
              {item.title}
              {item.organization ? ` — ${item.organization}` : ""}
              {item.date ? ` (${item.date})` : ""}
            </p>
          ))}
        </section>
      ) : null}
    </article>
  );
}
