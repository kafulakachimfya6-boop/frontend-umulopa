import { Quote, Star } from "lucide-react";
import Section, { SectionHeader } from "./Section";

const testimonials = [
  {
    name: "Mary Chanda",
    role: "Patient",
    quote: "When I needed an emergency transfusion, ZNBTS connected me to available blood within hours. It truly saved my life.",
    initials: "MC",
  },
  {
    name: "Dr. Joseph Banda",
    role: "Haematologist",
    quote: "The platform has transformed how we manage blood requests. Real-time inventory visibility means faster decisions in critical moments.",
    initials: "JB",
  },
  {
    name: "Grace Phiri",
    role: "Blood Donor",
    quote: "I receive alerts when my blood type is urgently needed. Donating feels meaningful when you know exactly who you're helping.",
    initials: "GP",
  },
];

export default function Testimonials() {
  return (
    <Section id="testimonials" className="bg-[#FAFAFA]" ariaLabelledby="testimonials-heading">
      <SectionHeader
        id="testimonials-heading"
        eyebrow="Stories"
        title="What People Say"
        subtitle="Real experiences from patients, clinicians, and donors using ZNBTS."
      />

      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map(({ name, role, quote, initials }) => (
          <article
            key={name}
            className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Quote className="h-8 w-8 text-[#C1121F]/30" aria-hidden="true" />
            <p className="mt-4 leading-relaxed text-[#6B7280]">&ldquo;{quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-1 text-[#E63946]" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#7A0916] to-[#C1121F] text-sm font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-[#111827]">{name}</p>
                <p className="text-sm text-[#6B7280]">{role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
