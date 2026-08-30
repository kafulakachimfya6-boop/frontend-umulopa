import { Building2, Droplets, HeartHandshake, Users } from "lucide-react";
import Section from "./Section";

const stats = [
  { label: "Registered Donors", value: "15,000+", icon: Users },
  { label: "Blood Units Collected", value: "10,000+", icon: Droplets },
  { label: "Patients Helped", value: "6,000+", icon: HeartHandshake },
  { label: "Hospitals Connected", value: "150+", icon: Building2 },
];

export default function Stats() {
  return (
    <Section className="-mt-16 pb-8 pt-0">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7A0916]/10"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A0916] to-[#C1121F] text-white transition-transform duration-300 group-hover:scale-110">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold text-[#111827]">{value}</p>
            <p className="mt-2 text-sm text-[#6B7280]">{label}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
