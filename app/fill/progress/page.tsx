"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/app/lib/form-context";
import { Loader2, CircleCheck, XCircle, AlertCircle } from "lucide-react";

export default function ProgressPage() {
  const router = useRouter();
  const {
    form,
    distributions,
    responseCount,
    locale,
    updateProgress,
    progress,
    setResult,
  } = useFormContext();
  const [logs, setLogs] = useState<
    { index: number; status: "success" | "error"; message: string }[]
  >([]);
  const startedRef = useRef(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!form) {
      router.push("/fill");
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    const startSubmission = async () => {
      const startTime = Date.now();
      let completed = 0;
      let failed = 0;
      const errors: string[] = [];

      updateProgress({
        total: responseCount,
        completed: 0,
        failed: 0,
        status: "running",
        errors: [],
      });

      for (let i = 0; i < responseCount; i++) {
        updateProgress({ currentResponse: i + 1 });

        try {
          const response = await fetch("/api/submit-response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              formId: form.formId,
              questions: form.questions,
              distributions,
              responseIndex: i,
              isPublishedForm: form.isPublishedForm,
              locale,
            }),
          });

          const data = await response.json();

          if (data.success) {
            completed++;
            setLogs((prev) => [
              ...prev,
              {
                index: i + 1,
                status: "success",
                message: `Response ${i + 1} submitted (HTTP ${data.status})`,
              },
            ]);
          } else {
            failed++;
            const errorMsg = data.error || `HTTP ${data.status}`;
            errors.push(`Response ${i + 1}: ${errorMsg}`);
            setLogs((prev) => [
              ...prev,
              {
                index: i + 1,
                status: "error",
                message: `Response ${i + 1} failed: ${errorMsg}`,
              },
            ]);
          }
        } catch (err) {
          failed++;
          const errorMsg = err instanceof Error ? err.message : "Network error";
          errors.push(`Response ${i + 1}: ${errorMsg}`);
          setLogs((prev) => [
            ...prev,
            {
              index: i + 1,
              status: "error",
              message: `Response ${i + 1} failed: ${errorMsg}`,
            },
          ]);
        }

        updateProgress({ completed, failed, errors });

        // Random delay between 1-3 seconds to mimic human behavior
        if (i < responseCount - 1) {
          const delay = 1000 + Math.random() * 2000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      const duration = Date.now() - startTime;

      setResult({
        total: responseCount,
        successful: completed,
        failed,
        duration,
        errors,
      });

      updateProgress({ status: "completed" });

      // Redirect to result page after short delay
      setTimeout(() => {
        router.push("/fill/result");
      }, 1500);
    };

    startSubmission();
  }, [form, distributions, responseCount, updateProgress, setResult, router]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!form) {
    return null;
  }

  const percentage =
    progress.total > 0
      ? Math.round(
          ((progress.completed + progress.failed) / progress.total) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          {progress.status === "running" ? (
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          ) : progress.status === "completed" ? (
            <CircleCheck className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-slate-400" />
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {progress.status === "running"
              ? "Generating Responses..."
              : progress.status === "completed"
              ? "Generation Complete!"
              : "Preparing..."}
          </h1>
        </div>

        <p className="text-sm sm:text-base text-slate-600 mb-6">
          {progress.status === "running"
            ? `Submitting response ${progress.currentResponse || 0} of ${
                progress.total
              }`
            : progress.status === "completed"
            ? "All responses have been processed. Redirecting to results..."
            : "Initializing submission process..."}
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium text-slate-900">{percentage}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {progress.total}
            </div>
            <div className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">
              Total
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-700">
              {progress.completed}
            </div>
            <div className="text-xs sm:text-sm text-green-600 whitespace-nowrap">
              Successful
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-700">
              {progress.failed}
            </div>
            <div className="text-xs sm:text-sm text-red-600 whitespace-nowrap">
              Failed
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Activity Log
        </h2>
        <div className="bg-slate-900 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-slate-400">Waiting for submissions...</div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 py-1 ${
                  log.status === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {log.status === "success" ? (
                  <CircleCheck className="h-4 w-4 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{log.message}</span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>

      {progress.status === "running" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Please keep this page open</p>
              <p className="text-amber-700">
                Responses are being submitted sequentially with realistic
                delays. Closing this page will stop the generation process.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}