"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormContext } from "@/app/lib/form-context";
import {
  CircleCheck,
  XCircle,
  Clock,
  RotateCcw,
  Home,
  ExternalLink,
} from "lucide-react";

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

export default function ResultPage() {
  const router = useRouter();
  const { result, form, reset } = useFormContext();

  useEffect(() => {
    if (!result) {
      router.push("/fill");
    }
  }, [result, router]);

  if (!result) {
    return null;
  }

  const successRate =
    result.total > 0 ? Math.round((result.successful / result.total) * 100) : 0;

  const handleStartNew = () => {
    reset();
    router.push("/fill");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CircleCheck className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Generation Complete
        </h1>
        <p className="text-slate-600 mb-6">
          Your synthetic responses have been submitted to the Google Form.
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {result.total}
            </div>
            <div className="text-xs sm:text-sm text-slate-600">Total</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-green-700">
              {result.successful}
            </div>
            <div className="text-xs sm:text-sm text-green-600">Success</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3 sm:p-4">
            <div className="text-2xl sm:text-3xl font-bold text-red-700">
              {result.failed}
            </div>
            <div className="text-xs sm:text-sm text-red-600">Failed</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-blue-700">
                {formatDuration(result.duration)}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-blue-600">Time</div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Success Rate</span>
            <span className="font-medium text-slate-900">{successRate}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                successRate >= 80
                  ? "bg-green-500"
                  : successRate >= 50
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>

        {/* Form Info */}
        {form && (
          <div className="bg-slate-50 rounded-lg p-3 sm:p-4 mb-6 text-left">
            <h3 className="text-sm sm:text-base font-medium text-slate-900 mb-1 line-clamp-2">
              {form.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {form.questions.length} questions processed
            </p>
          </div>
        )}
      </div>

      {/* Errors Section */}
      {result.errors.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Errors ({result.errors.length})
            </h2>
          </div>
          <div className="bg-red-50 rounded-lg p-4 max-h-48 overflow-y-auto">
            {result.errors.map((error, i) => (
              <div key={i} className="text-sm text-red-700 py-1">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleStartNew}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
          Generate More Responses
        </button>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
      </div>

      {/* Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-2">What&apos;s Next?</h3>
        <p className="text-sm text-blue-800 mb-3">
          Your responses have been submitted to the Google Form. You can view
          the collected data in the form&apos;s response sheet.
        </p>
        <a
          href="https://docs.google.com/forms/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          Open Google Forms
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}