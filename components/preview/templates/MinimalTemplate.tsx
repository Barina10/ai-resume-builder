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

export function MinimalTemplate({ data }: { data: ResumeData }) {
  const view = visibleResume(data);
  return (
    <article className="resume-paper min-h-[1056px] bg-white leading-7 text-slate-800" style={paperStyle(data)}>
      <header className="mb-8">
        <h1 className="text-4xl font-medium tracking-tight">{data.personal.fullName || "Your Name"}</h1>
        {hasText(data.personal.title) ? <p className="mt-1 text-slate-500">{data.personal.title}</p> : null}
        <p className="mt-3 text-xs text-slate-500">{view.contacts.join("  /  ")}</p>
      </header>
      {hasText(data.summary) ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-slate-500`}>Summary</h3>
          <p>{data.summary}</p>
        </section>
      ) : null}
      {view.experience.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-slate-500`}>Experience</h3>
          <ExperienceBlock data={data} />
        </section>
      ) : null}
      {view.education.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-slate-500`}>Education</h3>
          <EducationBlock data={data} />
        </section>
      ) : null}
      {view.skills.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-slate-500`}>Skills</h3>
          <p>{view.skills.map((skill) => skill.name).join(", ")}</p>
        </section>
      ) : null}
      {view.projects.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-slate-500`}>Projects</h3>
          <ProjectsBlock data={data} />
        </section>
      ) : null}
      {view.certs.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-slate-500`}>Certifications</h3>
          {view.certs.map((item) => (
            <p key={item.id}>{item.name}</p>
          ))}
        </section>
      ) : null}
      {view.languages.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-slate-500`}>Languages</h3>
          <p>{view.languages.map((item) => item.name).join(", ")}</p>
        </section>
      ) : null}
      {view.awards.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-slate-500`}>Awards</h3>
          {view.awards.map((item) => (
            <p key={item.id}>{item.title}</p>
          ))}
        </section>
      ) : null}
    </article>
  );
}
