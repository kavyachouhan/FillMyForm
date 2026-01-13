"use client";

import Link from "next/link";
import { FormInput } from "lucide-react";
import { FormProvider } from "../lib/form-context";
import FillStepper from "./components/FillStepper";

export default function FillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormProvider>
      <div className="min-h-screen bg-slate-50">
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
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FillStepper />
          {children}
        </main>
      </div>
    </FormProvider>
  );
}