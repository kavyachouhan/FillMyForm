import Link from "next/link";
import { FormInput } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold text-white mb-4 block flex items-center gap-2">
              <FormInput className="h-6 w-6 text-blue-600" />
              FillMyForm
            </span>
            <p className="max-w-sm text-slate-400">
              The easiest way to generate realistic test data for your Google
              Forms. Built for researchers, students, and data analysts.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="hover:text-blue-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-blue-400 transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/fill"
                  className="hover:text-blue-400 transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} FillMyForm. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p>Designed for academic and testing purposes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}