import { Users, Sliders, Zap, Database, Lock, Send } from "lucide-react";

const features = [
  {
    name: "Realistic Data",
    description:
      "Generate authentic-looking responses with names, emails, demographics, and more using region-specific data.",
    icon: Users,
  },
  {
    name: "Custom Distributions",
    description:
      "Control response patterns with flexible distributions - random mix, balanced, or skewed to match your testing scenarios.",
    icon: Sliders,
  },
  {
    name: "Bulk Generation",
    description:
      "Create up to 100 responses instantly. Save hours of manual form filling for testing and research.",
    icon: Send,
  },
  {
    name: "Smart Question Support",
    description:
      "Handles multiple choice, checkboxes, dropdowns, linear scales, text fields, and more question types automatically.",
    icon: Database,
  },
  {
    name: "Instant Submission",
    description:
      "Responses are submitted directly to your Google Form, appearing in your response sheet immediately.",
    icon: Zap,
  },
  {
    name: "Secure & Private",
    description:
      "We prioritize your privacy. All operations occur securely.",
    icon: Lock,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-blue-600 uppercase tracking-wide">
            Features
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Everything you need for form testing
          </p>
          <p className="mt-4 text-xl text-slate-600">
            Powerful tools to generate realistic test data for academic
            research, form validation, and dashboard testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-lg mb-6">
                <feature.icon
                  className="h-6 w-6 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.name}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}