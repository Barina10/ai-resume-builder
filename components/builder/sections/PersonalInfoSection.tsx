import { Input } from "@/components/ui/Input";
import type { PersonalInfo } from "@/lib/types";

type PersonalInfoSectionProps = {
  value: PersonalInfo;
  nameError?: string;
  emailError?: string;
  onChange: (value: PersonalInfo) => void;
};

export function PersonalInfoSection({
  value,
  nameError,
  emailError,
  onChange,
}: PersonalInfoSectionProps) {
  function update<K extends keyof PersonalInfo>(key: K, next: PersonalInfo[K]) {
    onChange({ ...value, [key]: next });
  }

  function onPhoto(file: File | undefined) {
    if (!file) {
      update("photo", "");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("photo", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Input
            label="Full name"
            name="fullName"
            value={value.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            placeholder="Alex Rivera"
          />
          {nameError ? <p className="mt-1 text-xs text-red-700">{nameError}</p> : null}
        </div>
        <Input
          label="Professional title"
          name="title"
          value={value.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Product Designer"
        />
        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={value.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="alex@email.com"
          />
          {emailError ? <p className="mt-1 text-xs text-red-700">{emailError}</p> : null}
        </div>
        <Input
          label="Phone"
          name="phone"
          value={value.phone}
          onChange={(event) => update("phone", event.target.value)}
          placeholder="(555) 123-4567"
        />
        <Input
          label="Location"
          name="location"
          value={value.location}
          onChange={(event) => update("location", event.target.value)}
          placeholder="Austin, TX"
        />
        <Input
          label="Website"
          name="website"
          value={value.website}
          onChange={(event) => update("website", event.target.value)}
          placeholder="alexrivera.com"
        />
        <Input
          label="LinkedIn"
          name="linkedin"
          value={value.linkedin}
          onChange={(event) => update("linkedin", event.target.value)}
          placeholder="linkedin.com/in/alex"
        />
        <Input
          label="GitHub"
          name="github"
          value={value.github}
          onChange={(event) => update("github", event.target.value)}
          placeholder="github.com/alex"
        />
      </div>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Profile photo (optional)</span>
        <input
          type="file"
          accept="image/*"
          className="text-sm"
          onChange={(event) => onPhoto(event.target.files?.[0])}
        />
        <span className="text-xs text-slate-500">
          Photos are hidden on the Classic ATS template.
        </span>
      </label>
    </div>
  );
}
