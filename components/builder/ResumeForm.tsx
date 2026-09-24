"use client";

import { Accordion } from "@/components/ui/Accordion";
import { EmptyState } from "@/components/ui/EmptyState";
import { AwardsSection } from "@/components/builder/sections/AwardsSection";
import { CertificationsSection } from "@/components/builder/sections/CertificationsSection";
import { DesignSection } from "@/components/builder/sections/DesignSection";
import { EducationSection } from "@/components/builder/sections/EducationSection";
import { ExperienceSection } from "@/components/builder/sections/ExperienceSection";
import { JobTargetSection } from "@/components/builder/sections/JobTargetSection";
import { LanguagesSection } from "@/components/builder/sections/LanguagesSection";
import { PersonalInfoSection } from "@/components/builder/sections/PersonalInfoSection";
import { ProjectsSection } from "@/components/builder/sections/ProjectsSection";
import { SkillsSection } from "@/components/builder/sections/SkillsSection";
import { SummarySection } from "@/components/builder/sections/SummarySection";
import { errorFor, type FieldError } from "@/lib/validate";
import type { ResumeData } from "@/lib/types";

type ResumeFormProps = {
  data: ResumeData;
  errors: FieldError[];
  onChange: (data: ResumeData) => void;
};

export function ResumeForm({ data, errors, onChange }: ResumeFormProps) {
  const isEmpty =
    !data.personal.fullName && !data.summary && !data.experience.some((item) => item.role);

  return (
    <div>
      {isEmpty ? (
        <div className="mb-6">
          <EmptyState
            title="Let's build your resume"
            body="Start with your personal information, or let AI help you write each section. Nothing is invented — AI only rewrites facts you provide."
          />
        </div>
      ) : null}
      <Accordion title="Personal information">
        <PersonalInfoSection
          value={data.personal}
          nameError={errorFor(errors, "personal.fullName")}
          emailError={errorFor(errors, "personal.email")}
          onChange={(personal) => onChange({ ...data, personal })}
        />
      </Accordion>
      <Accordion title="Professional summary">
        <SummarySection data={data} onChange={(summary) => onChange({ ...data, summary })} />
      </Accordion>
      <Accordion title="Work experience">
        <ExperienceSection
          data={data}
          errors={errors}
          onChange={(experience) => onChange({ ...data, experience })}
        />
      </Accordion>
      <Accordion title="Education">
        <EducationSection
          items={data.education}
          onChange={(education) => onChange({ ...data, education })}
        />
      </Accordion>
      <Accordion title="Skills">
        <SkillsSection
          data={data}
          errors={errors}
          onChange={(skills) => onChange({ ...data, skills })}
        />
      </Accordion>
      <Accordion title="Projects">
        <ProjectsSection
          data={data}
          onChange={(projects) => onChange({ ...data, projects })}
        />
      </Accordion>
      <Accordion title="Certifications">
        <CertificationsSection
          items={data.certifications}
          onChange={(certifications) => onChange({ ...data, certifications })}
        />
      </Accordion>
      <Accordion title="Languages" defaultOpen={false}>
        <LanguagesSection
          items={data.languages}
          onChange={(languages) => onChange({ ...data, languages })}
        />
      </Accordion>
      <Accordion title="Achievements / awards" defaultOpen={false}>
        <AwardsSection items={data.awards} onChange={(awards) => onChange({ ...data, awards })} />
      </Accordion>
      <Accordion title="Target job">
        <JobTargetSection data={data} onChange={onChange} />
      </Accordion>
      <Accordion title="Design" defaultOpen={false}>
        <DesignSection
          value={data.customization}
          onChange={(customization) => onChange({ ...data, customization })}
        />
      </Accordion>
    </div>
  );
}
