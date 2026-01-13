import Link from "next/link";
import { Home } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">

          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>

          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Page Not Found
          </h2>

          <p className="text-slate-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              Go to Homepage
            </Link>
            <Link
              href="/fill"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-white transition-colors"
            >
              Fill a Form
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}