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

export function ModernTemplate({ data }: { data: ResumeData }) {
  const view = visibleResume(data);
  const showPhoto = hasText(data.personal.photo);
  return (
    <article className="resume-paper flex min-h-0 bg-white leading-snug text-slate-800" style={paperStyle({
      ...data,
      customization: { ...data.customization, margins: "narrow" },
    })}>
      <aside className="w-[32%] px-5 py-8 text-white" style={{ background: "var(--resume-accent)" }}>
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.personal.photo} alt="" className="mb-4 h-36 w-36 object-contain" />
        ) : null}
        <h1 className="text-xl font-semibold">{data.personal.fullName || "Your Name"}</h1>
        {hasText(data.personal.title) ? (
          <p className="mt-2 text-sm text-white/80">{data.personal.title}</p>
        ) : null}
        {view.contacts.length ? (
          <section className="mt-8">
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-white/80`}>Contact</h3>
            <ul className="space-y-1.5 text-xs break-words">
              {view.contacts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {view.skills.length ? (
          <section className="mt-8">
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-white/80`}>Skills</h3>
            <ul className="space-y-1 text-xs">
              {view.skills.map((skill) => (
                <li key={skill.id}>
                  {skill.name}
                  {skill.level ? ` · ${skill.level}` : ""}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {view.languages.length ? (
          <section className="mt-8">
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2 text-white/80`}>Languages</h3>
            {view.languages.map((item) => (
              <p key={item.id} className="text-xs">
                {item.name}
                {item.proficiency ? ` · ${item.proficiency}` : ""}
              </p>
            ))}
          </section>
        ) : null}
      </aside>
      <div className="w-[68%] px-7 py-8">
        {hasText(data.summary) ? (
          <section className="resume-section">
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
              Profile
            </h3>
            <p className="text-sm">{data.summary}</p>
          </section>
        ) : null}
        {view.experience.length ? (
          <section className="resume-section">
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
              Experience
            </h3>
            <ExperienceBlock data={data} />
          </section>
        ) : null}
        {view.education.length ? (
          <section className="resume-section">
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
              Education
            </h3>
            <EducationBlock data={data} />
          </section>
        ) : null}
        {view.projects.length ? (
          <section className="resume-section">
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
              Projects
            </h3>
            <ProjectsBlock data={data} />
          </section>
        ) : null}
        {view.certs.length ? (
          <section className="resume-section">
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
              Certifications
            </h3>
            {view.certs.map((item) => (
              <p key={item.id}>
                {item.name}
                {item.issuer ? ` — ${item.issuer}` : ""}
              </p>
            ))}
          </section>
        ) : null}
        {view.awards.length ? (
          <section className="resume-section">
            <h3 className={`${headingClass(data.customization.headingStyle)} mb-2`} style={{ color: "var(--resume-accent)" }}>
              Awards
            </h3>
            {view.awards.map((item) => (
              <p key={item.id}>{item.title}</p>
            ))}
          </section>
        ) : null}
      </div>
    </article>
  );
}
