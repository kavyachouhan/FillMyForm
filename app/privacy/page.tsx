import Link from "next/link";
import { FormInput, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="w-full border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <FormInput className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl text-slate-900">
                FillMyForm
              </span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-slate-600 mb-8">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              FillMyForm (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we handle information when you use our web-based form response
              generation tool.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              2. Data Collection and Storage
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>
                We collect minimal data for service improvement and analytics.
              </strong>
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>
                All form parsing and response generation happens in your browser
                session
              </li>
              <li>
                Form URLs and questions are temporarily processed to extract
                structure
              </li>
              <li>
                Generated responses are submitted directly to Google Forms
                servers
              </li>
              <li>
                Usage Logs: We collect and store form URLs,
                form titles, question counts, timestamps, IP addresses, and user
                agent information for analytics and service improvement purposes
              </li>
              <li>
                We do not store the actual form responses or personal data
                submitted to forms
              </li>
              <li>
                We do not use cookies or third-party tracking technologies
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              3. Third-Party Services
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              FillMyForm interacts with the following third-party services:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>
                <strong>Google Forms:</strong> We fetch form structure from
                publicly accessible Google Forms and submit responses directly
                to Google&apos;s servers
              </li>
              <li>
                Your use of Google Forms is subject to Google&apos;s Privacy
                Policy and Terms of Service
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Since we do not store any data, there is no risk of data breach
              from our servers. However, please be aware:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>
                Form URLs you provide are temporarily used during your session
              </li>
              <li>
                Generated data is transmitted directly to Google Forms over
                HTTPS
              </li>
              <li>
                We recommend only using this tool with non-sensitive test forms
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              5. User Responsibilities
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Users are responsible for:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>
                Ensuring their use of FillMyForm complies with applicable laws
                and regulations
              </li>
              <li>
                Obtaining necessary permissions before generating responses for
                any form
              </li>
              <li>
                Using the tool only for academic, testing, or authorized
                purposes
              </li>
              <li>
                Not using FillMyForm for fraudulent or malicious activities
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              6. Changes to This Policy
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}