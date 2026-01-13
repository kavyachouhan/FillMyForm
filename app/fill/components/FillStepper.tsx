"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormInput, Settings, Loader2, CircleCheck } from "lucide-react";

const steps = [
  { path: "/fill", label: "Paste URL", icon: FormInput },
  { path: "/fill/configure", label: "Configure", icon: Settings },
  { path: "/fill/progress", label: "Generate", icon: Loader2 },
  { path: "/fill/result", label: "Result", icon: CircleCheck },
];

export default function FillStepper() {
  const pathname = usePathname();

  const currentIndex = steps.findIndex((s) => s.path === pathname);

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.path === pathname;
          const isCompleted = currentIndex > index;
          const isClickable = isCompleted || isActive;

          return (
            <div key={step.path} className="flex items-center">
              {isClickable ? (
                <Link
                  href={step.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {step.label}
                  </span>
                </Link>
              ) : (
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {step.label}
                  </span>
                </div>
              )}

              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 mx-2 ${
                    currentIndex > index ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}