import { Link as LinkIcon, Settings2, PlayCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Paste Your Form URL",
    description:
      "Copy the link to your Google Form and paste it. We'll automatically detect all questions and their types.",
    icon: LinkIcon,
  },
  {
    id: 2,
    title: "Configure Responses",
    description:
      "Choose how many responses to generate, select a region for names/data, and set distribution patterns for each question.",
    icon: Settings2,
  },
  {
    id: 3,
    title: "Generate & Submit",
    description:
      "Click generate and watch as realistic responses are created and submitted to your form in real-time.",
    icon: PlayCircle,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Three simple steps to generate test responses for your forms.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.id} className="relative bg-white pt-4 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white border-4 border-blue-50 mb-6">
                  <step.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}