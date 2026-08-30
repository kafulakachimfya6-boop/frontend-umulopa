import { Bell, CheckCircle2, Clock, Hospital, Shield, Users } from "lucide-react";
import Section, { SectionHeader } from "./Section";

const features = [
  { title: "Real-Time Blood Availability", description: "Instant visibility into blood stock across all connected hospitals and transfusion centers." },
  { title: "Secure Records", description: "End-to-end encrypted donor and patient records with role-based access controls." },
  { title: "Hospital Integration", description: "Seamless integration with existing hospital workflows and blood bank operations." },
  { title: "Fast Blood Requests", description: "Submit and track urgent blood requests with automated priority routing." },
  { title: "Emergency Alerts", description: "Instant notifications for critical shortages and emergency transfusion needs." },
  { title: "Verified Donors", description: "Comprehensive donor verification with eligibility tracking and health screening." },
];

const icons = [Clock, Shield, Hospital, Bell, Users, CheckCircle2];

export default function Features() {
  return (
    <Section id="about" className="bg-[#FAFAFA]" ariaLabelledby="features-heading">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#7A0916]/10 to-[#E63946]/10 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border border-[#7A0916]/10 bg-white p-8 shadow-2xl">
            <img
              src="/images/blood-illustration.jpg"
              alt="Healthcare professionals managing blood donations"
              className="mx-auto w-full max-w-md"
              loading="lazy"
            />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#7A0916] p-4 text-center text-white">
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-xs opacity-80">Uptime reliability</p>
              </div>
              <div className="rounded-2xl bg-[#FAFAFA] p-4 text-center">
                <p className="text-2xl font-bold text-[#7A0916]">24/7</p>
                <p className="text-xs text-[#6B7280]">Emergency support</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <SectionHeader
            id="features-heading"
            align="left"
            eyebrow="Why UMULOPA Safe Transfer"
            title="Why Choose UMULOPA Safe Transfer"
            subtitle="Built for the realities of hospital blood management — secure, fast, and always available when lives are on the line."
          />

          <ul className="space-y-5">
            {features.map(({ title, description }, index) => {
              const Icon = icons[index];
              return (
                <li key={title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7A0916]/10 text-[#7A0916]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827]">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
