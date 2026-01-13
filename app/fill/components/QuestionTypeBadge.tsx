"use client";

import { QuestionType } from "@/app/lib/types";
import {
  CircleDot,
  CheckSquare,
  ChevronDown,
  Sliders,
  Type,
  AlignLeft,
  Grid3X3,
  Calendar,
  Clock,
  HelpCircle,
} from "lucide-react";

const typeInfo: Record<
  QuestionType,
  { label: string; icon: React.ElementType }
> = {
  multiple_choice: { label: "Multiple Choice", icon: CircleDot },
  checkbox: { label: "Checkboxes", icon: CheckSquare },
  dropdown: { label: "Dropdown", icon: ChevronDown },
  linear_scale: { label: "Linear Scale", icon: Sliders },
  short_text: { label: "Short Text", icon: Type },
  paragraph: { label: "Paragraph", icon: AlignLeft },
  multiple_choice_grid: { label: "Multiple Choice Grid", icon: Grid3X3 },
  checkbox_grid: { label: "Checkbox Grid", icon: Grid3X3 },
  date: { label: "Date", icon: Calendar },
  time: { label: "Time", icon: Clock },
  file_upload: { label: "File Upload", icon: HelpCircle },
  unknown: { label: "Unknown", icon: HelpCircle },
};

interface QuestionTypeBadgeProps {
  type: QuestionType;
}

export default function QuestionTypeBadge({ type }: QuestionTypeBadgeProps) {
  const info = typeInfo[type] || typeInfo.unknown;
  const Icon = info.icon;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
      <Icon className="h-3 w-3" />
      {info.label}
    </span>
  );
}