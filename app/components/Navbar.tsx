import Link from "next/link";
import { FormInput } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <FormInput className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-slate-900">FillMyForm</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              How it Works
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/fill"
              className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}