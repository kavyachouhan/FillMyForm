import Link from "next/link";
import { FormInput, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              By accessing and using FillMyForm, you accept and agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              2. Intended Use
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              FillMyForm is designed and intended{" "}
              <strong>exclusively for:</strong>
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Academic research and educational purposes</li>
              <li>
                Testing and validating Google Form logic and functionality
              </li>
              <li>Generating pilot data for research proposals</li>
              <li>Dashboard and analytics testing</li>
              <li>Quality assurance and form development</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              3. Prohibited Uses
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              You agree <strong>NOT</strong> to use FillMyForm for:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>
                Fraudulent activities, including falsifying survey results or
                manipulating data
              </li>
              <li>
                Submitting responses to forms without explicit authorization
                from the form owner
              </li>
              <li>Violating any laws, regulations, or third-party rights</li>
              <li>
                Bypassing form security measures or authentication requirements
              </li>
              <li>
                Any activity that could harm, disable, or impair Google&apos;s
                services
              </li>
              <li>Generating spam or malicious content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              4. User Responsibilities
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              As a user of FillMyForm, you are solely responsible for:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>
                Ensuring you have proper authorization to generate responses for
                any form
              </li>
              <li>
                Compliance with all applicable laws, regulations, and
                institutional policies
              </li>
              <li>
                The accuracy and appropriateness of data generated using our
                tool
              </li>
              <li>Any consequences resulting from your use of FillMyForm</li>
              <li>
                Respecting intellectual property rights and terms of service of
                third-party platforms
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              5. Disclaimer of Warranties
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              FillMyForm is provided &quot;AS IS&quot; and &quot;AS
              AVAILABLE&quot; without warranties of any kind, either express or
              implied, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>
                Warranties of merchantability or fitness for a particular
                purpose
              </li>
              <li>
                Warranties regarding the accuracy, reliability, or availability
                of the service
              </li>
              <li>
                Warranties that the service will be uninterrupted or error-free
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To the fullest extent permitted by law, FillMyForm and its
              creators shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>
                Any direct, indirect, incidental, special, or consequential
                damages
              </li>
              <li>Loss of data, profits, or business opportunities</li>
              <li>
                Any harm resulting from misuse or unauthorized use of the
                service
              </li>
              <li>
                Actions taken by Google or other third parties in response to
                generated form submissions
              </li>
              <li>
                Any violations of terms of service, policies, or laws by users
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              7. Indemnification
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              You agree to indemnify and hold harmless FillMyForm, its creators,
              and affiliates from any claims, damages, losses, or expenses
              (including legal fees) arising from your use or misuse of the
              service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              8. Service Modifications
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>
                Modify, suspend, or discontinue the service at any time without
                notice
              </li>
              <li>Update these Terms of Service at our discretion</li>
              <li>
                Restrict access to the service for users who violate these terms
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              9. Third-Party Services
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              FillMyForm integrates with Google Forms. Your use of Google&apos;s
              services is subject to Google&apos;s Terms of Service and Privacy
              Policy. We are not responsible for Google&apos;s policies or
              actions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              10. Governing Law
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              These Terms of Service shall be governed by and construed in
              accordance with applicable laws, without regard to conflict of law
              principles.
            </p>
          </section>

          <section className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              Important Notice
            </h3>
            <p className="text-amber-800 leading-relaxed">
              By using FillMyForm, you acknowledge that you understand the
              limitations and intended purpose of this tool. You accept full
              responsibility for your actions and agree that the creators of
              FillMyForm bear no responsibility for any misuse, violations, or
              consequences resulting from your use of the service.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}