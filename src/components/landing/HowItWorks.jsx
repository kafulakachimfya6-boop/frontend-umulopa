import { Droplet, Heart, UserPlus } from "lucide-react";
import Section, { SectionHeader } from "./Section";

const steps = [
  {
    step: "01",
    title: "Register",
    description: "Create a donor or staff profile linked to Copperbelt hospitals and the UMULOPA Safe Transfer system.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Donate Blood",
    description: "Visit a partner hospital or mobile drive in Ndola and donate safely under clinical supervision.",
    icon: Droplet,
  },
  {
    step: "03",
    title: "Save Lives",
    description: "Hospitals request blood through the platform and match it to available donors in real time.",
    icon: Heart,
  },
];

export default function HowItWorks() {
  return (
    <Section id="how-it-works" ariaLabelledby="how-heading">
      <SectionHeader
        id="how-heading"
        eyebrow="Simple process"
        title="How It Works"
        subtitle="Three straightforward steps to connect Copperbelt hospitals with donors and save lives faster."
      />

      <div className="relative grid gap-8 md:grid-cols-3">
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-16 hidden h-0.5 bg-gradient-to-r from-[#7A0916]/20 via-[#C1121F] to-[#E63946]/20 md:block" aria-hidden="true" />

        {steps.map(({ step, title, description, icon: Icon }) => (
          <article key={title} className="relative text-center">
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#7A0916] to-[#C1121F] text-white shadow-xl shadow-[#7A0916]/20">
              <Icon className="h-8 w-8" aria-hidden="true" />
              <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#7A0916] shadow-md">
                {step}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#111827]">{title}</h3>
            <p className="mx-auto mt-3 max-w-xs text-[#6B7280]">{description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
