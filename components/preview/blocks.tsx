import type { CSSProperties } from "react";
import { formatDateRange, hasText, splitLines } from "@/lib/empty-resume";
import type { ResumeData } from "@/lib/types";

export function visibleResume(data: ResumeData) {
  return {
    skills: data.skills.filter((item) => hasText(item.name)),
    education: data.education.filter((item) => hasText(item.school) || hasText(item.degree)),
    experience: data.experience.filter((item) => hasText(item.company) || hasText(item.role)),
    projects: data.projects.filter((item) => hasText(item.name) || hasText(item.description)),
    certs: data.certifications.filter((item) => hasText(item.name) || hasText(item.issuer)),
    languages: data.languages.filter((item) => hasText(item.name)),
    awards: data.awards.filter((item) => hasText(item.title)),
    contacts: [
      data.personal.email,
      data.personal.phone,
      data.personal.location,
      data.personal.website,
      data.personal.linkedin,
      data.personal.github,
    ].filter(hasText),
  };
}

export function ExperienceBlock({ data }: { data: ResumeData }) {
  const items = visibleResume(data).experience;
  if (!items.length) return null;
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="resume-block">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold">
              {item.role || "Role"}
              {item.company ? ` · ${item.company}` : ""}
            </p>
            <p className="shrink-0 text-[11px] text-slate-500">
              {formatDateRange(item.startDate, item.endDate, item.current)}
            </p>
          </div>
          {hasText(item.location) ? <p className="text-[12px] text-slate-500">{item.location}</p> : null}
          {hasText(item.description) ? <p>{item.description}</p> : null}
          <ul className="mt-1 list-disc pl-5">
            {splitLines(item.bullets).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function EducationBlock({ data }: { data: ResumeData }) {
  const items = visibleResume(data).education;
  if (!items.length) return null;
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="resume-block">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold">
              {item.degree}
              {item.school ? ` · ${item.school}` : ""}
            </p>
            <p className="shrink-0 text-[11px] text-slate-500">
              {formatDateRange(item.startDate, item.endDate)}
            </p>
          </div>
          {hasText(item.location) ? <p className="text-[12px] text-slate-500">{item.location}</p> : null}
          {hasText(item.details) ? <p>{item.details}</p> : null}
        </div>
      ))}
    </>
  );
}

export function ProjectsBlock({ data }: { data: ResumeData }) {
  const items = visibleResume(data).projects;
  if (!items.length) return null;
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="resume-block">
          <p className="font-semibold">
            {item.name}
            {item.link ? <span className="font-normal text-slate-500"> · {item.link}</span> : null}
          </p>
          {hasText(item.technologies) ? (
            <p className="text-[12px] text-slate-500">{item.technologies}</p>
          ) : null}
          {hasText(item.description) ? <p>{item.description}</p> : null}
          <ul className="mt-1 list-disc pl-5">
            {splitLines(item.highlights).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function headingClass(style: ResumeData["customization"]["headingStyle"]) {
  if (style === "uppercase") return "text-[11px] font-semibold uppercase tracking-[0.16em]";
  if (style === "title") return "text-[13px] font-semibold";
  return "text-[13px] font-medium";
}

export function paperStyle(data: ResumeData): CSSProperties {
  const { customization } = data;
  const size = customization.fontSize === "sm" ? "12px" : customization.fontSize === "lg" ? "14.5px" : "13px";
  const pad = customization.margins === "narrow" ? "28px" : customization.margins === "wide" ? "52px" : "40px";
  const gap = customization.spacing === "compact" ? "0.7rem" : customization.spacing === "relaxed" ? "1.35rem" : "1rem";
  return {
    ["--resume-accent" as string]: customization.accentColor,
    ["--resume-gap" as string]: gap,
    fontFamily:
      customization.font === "serif"
        ? 'Georgia, "Times New Roman", serif'
        : "var(--font-geist-sans), Arial, sans-serif",
    fontSize: size,
    padding: pad,
  };
}
