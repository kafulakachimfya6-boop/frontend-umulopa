import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Section, { SectionHeader } from "./Section";

const faqs = [
  {
    question: "Who can donate blood?",
    answer: "Healthy adults aged 18–65 who weigh at least 50 kg and meet basic eligibility criteria can donate. A brief health screening is performed at every donation session.",
  },
  {
    question: "How often can I donate?",
    answer: "Whole blood donations can typically be made every 8–12 weeks. Platelet donations may be more frequent. Your eligibility is tracked automatically in the ZNBTS system.",
  },
  {
    question: "How do hospitals request blood?",
    answer: "Authorized hospital staff log in to the portal, submit a blood request with patient details and urgency level, and track approval and fulfillment in real time.",
  },
  {
    question: "Which hospitals are connected?",
    answer: "ZNBTS partners with 150+ hospitals and transfusion centers across Zambia, with ongoing expansion to regional facilities.",
  },
  {
    question: "What happens in an emergency?",
    answer: "Emergency requests are flagged as high priority and routed immediately to available stock. The 24/7 hotline coordinates critical transfusions across partner facilities.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Section id="faq" className="bg-[#FAFAFA]" ariaLabelledby="faq-heading">
      <SectionHeader
        id="faq-heading"
        eyebrow="Questions"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about donating, requesting blood, and using the platform."
      />

      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map(({ question, answer }, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={question} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-[#111827] transition-colors hover:text-[#7A0916]"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                {question}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#6B7280] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 leading-relaxed text-[#6B7280]">{answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
