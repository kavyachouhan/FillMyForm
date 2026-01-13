import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, FormInput } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6">
            Generate Test Responses for{" "}
            <span className="text-blue-600">Google Forms</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 mb-8">
            FillMyForm helps researchers, students, and data analysts create
            realistic test data for Google Forms quickly and easily.
          </p>
          <p className="mx-auto max-w-2xl text-xs text-slate-500 mb-10 italic">
            Disclaimer: FillMyForm is intended for academic and testing purposes
            only. We do not promote or condone fraudulent activity. Users are
            solely responsible for ensuring their use complies with applicable
            policies and regulations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/fill"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 md:text-lg transition-colors"
            >
              Learn How It Works
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Test Analytics</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Validate dashboards and data visualization tools.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Verify Logic</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Test form branching and conditional questions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FormInput className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Research Data</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Create pilot datasets for academic projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}