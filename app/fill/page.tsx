"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "../lib/form-context";
import { logFormUrl } from "../lib/form-logger";
import { Link2, Loader2, AlertCircle, Info } from "lucide-react";

export default function FillPage() {
  const router = useRouter();
  const { setForm, reset } = useFormContext();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a Google Form URL");
      return;
    }

    // Basic validation for Google Forms URL
    if (!url.includes("google.com/forms") && !url.includes("forms.gle")) {
      setError("Please enter a valid Google Forms URL");
      return;
    }

    setLoading(true);
    reset();

    try {
      const response = await fetch("/api/parse-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to parse form");
        return;
      }

      // Log the form URL access
      logFormUrl(url, data.form?.title, data.form?.questions?.length);

      setForm(data.form);
      router.push("/fill/configure");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Paste Your Google Form URL
        </h1>
        <p className="text-slate-600 mb-6">
          Enter the link to your Google Form. We&apos;ll analyze its structure
          and prepare it for response generation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="form-url"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Form URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="form-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://forms.gle/... or https://docs.google.com/forms/d/e/..."
                className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing Form...
              </>
            ) : (
              "Analyze Form"
            )}
          </button>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-blue-800">
            <p className="font-medium">Important Notes</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Forms requiring Google sign-in are not supported</li>
              <li>
                File upload questions will be skipped (make them optional)
              </li>
              <li>
                This tool is designed for academic and testing purposes only
              </li>
              <li>Maximum 100 responses per generation session</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}