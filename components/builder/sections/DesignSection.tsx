import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { defaultCustomization } from "@/lib/empty-resume";
import type {
  Customization,
  FontFamily,
  FontSize,
  HeadingStyle,
  MarginScale,
  SpacingScale,
} from "@/lib/types";

type DesignSectionProps = {
  value: Customization;
  onChange: (value: Customization) => void;
};

export function DesignSection({ value, onChange }: DesignSectionProps) {
  function update<K extends keyof Customization>(key: K, next: Customization[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          label="Font"
          value={value.font}
          onChange={(event) => update("font", event.target.value as FontFamily)}
        >
          <option value="sans">Sans</option>
          <option value="serif">Serif</option>
        </Select>
        <Select
          label="Font size"
          value={value.fontSize}
          onChange={(event) => update("fontSize", event.target.value as FontSize)}
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </Select>
        <Select
          label="Heading style"
          value={value.headingStyle}
          onChange={(event) => update("headingStyle", event.target.value as HeadingStyle)}
        >
          <option value="uppercase">Uppercase</option>
          <option value="title">Title case</option>
          <option value="plain">Plain</option>
        </Select>
        <Select
          label="Spacing"
          value={value.spacing}
          onChange={(event) => update("spacing", event.target.value as SpacingScale)}
        >
          <option value="compact">Compact</option>
          <option value="normal">Normal</option>
          <option value="relaxed">Relaxed</option>
        </Select>
        <Select
          label="Margins"
          value={value.margins}
          onChange={(event) => update("margins", event.target.value as MarginScale)}
        >
          <option value="narrow">Narrow</option>
          <option value="normal">Normal</option>
          <option value="wide">Wide</option>
        </Select>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Accent color</span>
          <input
            type="color"
            value={value.accentColor}
            onChange={(event) => update("accentColor", event.target.value)}
            className="h-10 w-full cursor-pointer border border-slate-300 bg-white"
          />
        </label>
      </div>
      <Button variant="secondary" onClick={() => onChange({ ...defaultCustomization })}>
        Reset design
      </Button>
    </div>
  );
}
