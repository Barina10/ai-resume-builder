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

export function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const view = visibleResume(data);
  const showPhoto = hasText(data.personal.photo);
  return (
    <article className="resume-paper min-h-[1056px] bg-white leading-relaxed text-slate-800" style={paperStyle(data)}>
      <header className="mb-6 flex items-start justify-between gap-6 border-b-2 pb-4" style={{ borderColor: "var(--resume-accent)" }}>
        <div>
          <h1 className="text-3xl font-semibold">{data.personal.fullName || "Your Name"}</h1>
          {hasText(data.personal.title) ? (
            <p className="mt-1 text-sm tracking-wide" style={{ color: "var(--resume-accent)" }}>
              {data.personal.title}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-slate-600">{view.contacts.join("  ·  ")}</p>
        </div>
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.personal.photo} alt="" className="h-20 w-20 object-cover" />
        ) : null}
      </header>
      {hasText(data.summary) ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
            Executive summary
          </h3>
          <p>{data.summary}</p>
        </section>
      ) : null}
      {view.experience.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
            Leadership experience
          </h3>
          <ExperienceBlock data={data} />
        </section>
      ) : null}
      <div className="grid grid-cols-2 gap-6">
        {view.education.length ? (
          <section>
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
              Education
            </h3>
            <EducationBlock data={data} />
          </section>
        ) : null}
        {view.skills.length ? (
          <section>
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
              Core skills
            </h3>
            <p>{view.skills.map((skill) => skill.name).join(" · ")}</p>
          </section>
        ) : null}
      </div>
      {view.projects.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
            Selected work
          </h3>
          <ProjectsBlock data={data} />
        </section>
      ) : null}
      {view.certs.length || view.awards.length || view.languages.length ? (
        <section className="resume-section">
          <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
            Additional
          </h3>
          {view.certs.map((item) => (
            <p key={item.id}>{item.name}</p>
          ))}
          {view.awards.map((item) => (
            <p key={item.id}>{item.title}</p>
          ))}
          {view.languages.length ? (
            <p>{view.languages.map((item) => item.name).join(" · ")}</p>
          ) : null}
        </section>
      ) : null}
    </article>
  );
}
