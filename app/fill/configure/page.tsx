"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/app/lib/form-context";
import {
  QuestionDistribution,
  DistributionType,
  LOCALE_OPTIONS,
  FakerLocale,
} from "@/app/lib/types";
import QuestionTypeBadge from "../components/QuestionTypeBadge";
import DistributionSelector from "../components/DistributionSelector";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Globe,
  Upload,
  ShieldCheck,
} from "lucide-react";
import { ValidationType } from "@/app/lib/types";

// Helper to format validation type for display
function formatValidationType(type: ValidationType): string {
  const labels: Record<ValidationType, string> = {
    number: "Number",
    greater_than: "Greater than",
    greater_equal: "At least",
    less_than: "Less than",
    less_equal: "At most",
    equal: "Equal to",
    not_equal: "Not equal to",
    between: "Between",
    not_between: "Not between",
    is_number: "Must be a number",
    whole_number: "Whole number",
    length_max: "Max length",
    length_min: "Min length",
    length_equal: "Exact length",
    contains: "Must contain",
    not_contains: "Must not contain",
    email: "Valid email",
    url: "Valid URL",
    regex: "Pattern match",
    checkbox_min: "Min selections",
    checkbox_max: "Max selections",
    checkbox_exact: "Exact selections",
  };
  return labels[type] || type;
}

export default function ConfigurePage() {
  const router = useRouter();
  const {
    form,
    distributions,
    setDistributions,
    responseCount,
    setResponseCount,
    locale,
    setLocale,
    skipOptionalQuestions,
    setSkipOptionalQuestions,
  } = useFormContext();
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [localDistributions, setLocalDistributions] = useState<
    Record<string, DistributionType>
  >({});

  // Redirect if no form is loaded
  useEffect(() => {
    if (!form) {
      router.push("/fill");
    }
  }, [form, router]);

  // Initialize local distributions when form loads
  useEffect(() => {
    if (form && Object.keys(localDistributions).length === 0) {
      const initial: Record<string, DistributionType> = {};
      form.questions.forEach((q) => {
        initial[q.id] = "uniform";
      });
      setLocalDistributions(initial);
    }
  }, [form, localDistributions]);

  if (!form) {
    return null;
  }

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const updateDistribution = (
    questionId: string,
    distType: DistributionType
  ) => {
    setLocalDistributions((prev) => ({
      ...prev,
      [questionId]: distType,
    }));
  };

  const handleContinue = () => {
    // Prepare distributions based on local state
    const distributionsArray: QuestionDistribution[] = form.questions.map(
      (q) => ({
        questionId: q.id,
        distributionType: localDistributions[q.id] || "uniform",
      })
    );

    setDistributions(distributionsArray);
    router.push("/fill/progress");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Configure Responses
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mb-4">
          Review the detected questions and customize how responses should be
          distributed.
        </p>

        <div className="bg-slate-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                {form.title}
              </h2>
              {form.description && (
                <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">
                  {form.description}
                </p>
              )}
            </div>
            <span className="text-xs sm:text-sm text-slate-500 shrink-0">
              {form.questions.length} questions
            </span>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="response-count"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Number of Responses to Generate
          </label>
          <div className="flex items-center gap-3 sm:gap-4">
            <input
              id="response-count"
              type="range"
              min="1"
              max="100"
              value={responseCount}
              onChange={(e) => setResponseCount(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <input
              type="number"
              min="1"
              max="100"
              value={responseCount}
              onChange={(e) =>
                setResponseCount(
                  Math.min(100, Math.max(1, Number(e.target.value)))
                )
              }
              className="w-16 sm:w-20 px-2 sm:px-3 py-2 border border-slate-300 rounded-lg text-center text-sm sm:text-base text-slate-900"
            />
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="locale"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Region for Names & Data
            </div>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Choose a region to generate culturally appropriate names, addresses,
            and other demographic data
          </p>
          <select
            id="locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value as FakerLocale)}
            className="w-full sm:w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm sm:text-base text-slate-900 bg-white"
          >
            {LOCALE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={skipOptionalQuestions}
              onChange={(e) => setSkipOptionalQuestions(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <div>
              <span className="text-sm font-medium text-slate-700">
                Skip optional questions
              </span>
              <p className="text-xs text-slate-500">
                Leave non-required questions blank in generated responses
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Warnings for skipped questions */}
      {form.skippedQuestions && form.skippedQuestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <Upload className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-medium text-sm sm:text-base text-amber-800">
                {form.skippedQuestions.length} question(s) will be skipped
              </p>
              <p className="text-xs sm:text-sm text-amber-700 mt-1">
                File upload questions cannot be filled automatically. If they
                are marked as required, the form submission may fail. Consider
                making them optional in your Google Form settings.
              </p>
              <ul className="mt-2 text-xs sm:text-sm text-amber-700 list-disc list-inside space-y-1">
                {form.skippedQuestions.map((q, i) => (
                  <li key={i} className="break-words">
                    {q.title}{" "}
                    {q.required && (
                      <span className="text-red-600">
                        (Required - may cause errors)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warning for sign-in required forms */}
      {form.requiresSignIn && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-medium text-sm sm:text-base text-red-800">
                This form requires Google sign-in
              </p>
              <p className="text-xs sm:text-sm text-red-700 mt-1">
                Response generation will fail with 401 errors. To use this tool,
                please go to your Google Form settings and disable &quot;Require
                sign in&quot; option.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Questions & Distributions
        </h2>

        {form.questions.map((question, index) => {
          const isExpanded = expandedQuestions.has(question.id);

          return (
            <div
              key={question.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleQuestion(question.id)}
                className="w-full px-3 sm:px-6 py-3 sm:py-4 flex items-start gap-3 sm:gap-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-medium rounded-lg text-xs sm:text-sm">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm sm:text-base text-slate-900 break-words">
                      {question.title}
                    </h3>
                    {question.required && (
                      <span className="text-red-500 text-sm">*</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <QuestionTypeBadge type={question.type} />
                    {question.validation && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        <ShieldCheck className="h-3 w-3" />
                        {formatValidationType(question.validation.type)}
                        {question.validation.value !== undefined && (
                          <span>
                            {" "}
                            {question.validation.value}
                            {question.validation.value2 !== undefined && (
                              <span> - {question.validation.value2}</span>
                            )}
                          </span>
                        )}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 truncate">
                      {question.entryId}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-slate-400">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-slate-100">
                  {question.options && question.options.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">
                        Options
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((opt, i) => (
                          <span
                            key={i}
                            className="px-2 sm:px-3 py-1 bg-slate-100 text-slate-700 text-xs sm:text-sm rounded-full break-words"
                          >
                            {opt.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.scale && (
                    <div className="mb-4">
                      <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">
                        Scale
                      </p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <span className="truncate">
                          {question.scale.minLabel || question.scale.min}
                        </span>
                        <div className="flex-1 h-0.5 bg-slate-200" />
                        <span className="truncate">
                          {question.scale.maxLabel || question.scale.max}
                        </span>
                      </div>
                    </div>
                  )}

                  {question.validation && (
                    <div className="mb-4">
                      <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">
                        Validation
                      </p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700 bg-green-50 rounded-lg p-2">
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        <span>
                          {formatValidationType(question.validation.type)}
                          {question.validation.value !== undefined && (
                            <span className="font-medium">
                              {" "}
                              {question.validation.value}
                              {question.validation.value2 !== undefined && (
                                <span> - {question.validation.value2}</span>
                              )}
                            </span>
                          )}
                          {question.validation.errorMessage && (
                            <span className="block text-slate-500 mt-1">
                              Error: {question.validation.errorMessage}
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Generated values will respect this validation rule
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">
                      Distribution
                    </p>
                    <DistributionSelector
                      value={localDistributions[question.id] || "uniform"}
                      onChange={(dist) => updateDistribution(question.id, dist)}
                      questionType={question.type}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pb-4">
        <button
          onClick={() => router.push("/fill")}
          className="flex-1 px-4 sm:px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 px-4 sm:px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Generate {responseCount} Responses
        </button>
      </div>
    </div>
  );
}