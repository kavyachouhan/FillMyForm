"use client";

import { DistributionType } from "@/app/lib/types";

interface DistributionSelectorProps {
  value: DistributionType;
  onChange: (value: DistributionType) => void;
  questionType: string;
}

const distributions: {
  value: DistributionType;
  label: string;
  description: string;
}[] = [
  {
    value: "uniform",
    label: "Random Mix",
    description: "All options equally likely",
  },
  {
    value: "normal",
    label: "Balanced",
    description: "Most pick middle options",
  },
  {
    value: "skewed_left",
    label: "Prefer Lower",
    description: "More responses for first options",
  },
  {
    value: "skewed_right",
    label: "Prefer Higher",
    description: "More responses for last options",
  },
];

export default function DistributionSelector({
  value,
  onChange,
  questionType,
}: DistributionSelectorProps) {
  // Handle question types that don't need distribution selection
  if (questionType === "short_text" || questionType === "paragraph") {
    return (
      <div className="text-sm text-slate-500">
        Auto-generated based on question context
      </div>
    );
  }

  if (questionType === "date" || questionType === "time") {
    return (
      <div className="text-sm text-slate-500">
        Random values will be generated
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {distributions.map((dist) => (
        <button
          key={dist.value}
          type="button"
          onClick={() => onChange(dist.value)}
          className={`p-3 rounded-lg border text-left transition-all ${
            value === dist.value
              ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div
            className={`text-sm font-medium ${
              value === dist.value ? "text-blue-700" : "text-slate-900"
            }`}
          >
            {dist.label}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 hidden sm:block">
            {dist.description}
          </div>
        </button>
      ))}
    </div>
  );
}