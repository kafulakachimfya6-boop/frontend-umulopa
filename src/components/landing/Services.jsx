import { Building2, Droplets, Heart, Hospital, Search, Siren } from "lucide-react";
import Section, { SectionHeader } from "./Section";

const services = [
  {
    title: "Find Blood",
    description: "Check blood availability and donor readiness across Ndola partner hospitals in minutes.",
    icon: Search,
    gradient: "from-[#7A0916] to-[#C1121F]",
  },
  {
    title: "Blood Donation",
    description: "Register as a donor in Ndola and receive alerts when your blood group is needed for urgent requests.",
    icon: Heart,
    gradient: "from-[#C1121F] to-[#E63946]",
  },
  {
    title: "Blood Requests",
    description: "Hospitals in Ndola can submit urgent requests and match them to available donors and blood stock instantly.",
    icon: Droplets,
    gradient: "from-[#7A0916] to-[#E63946]",
  },
  {
    title: "Emergency Support",
    description: "Coordinate rapid transfusion support and trauma response for critical care across Ndola facilities.",
    icon: Siren,
    gradient: "from-[#C1121F] to-[#7A0916]",
  },
  {
    title: "Hospital Management",
    description: "Support Ndola hospital staff with role-based access, request tracking, and transfer coordination.",
    icon: Hospital,
    gradient: "from-[#7A0916] to-[#C1121F]",
  },
  {
    title: "Blood Inventory",
    description: "Monitor stock levels, expiry dates, and low-stock alerts in real time for Copperbelt hospitals.",
    icon: Building2,
    gradient: "from-[#E63946] to-[#C1121F]",
  },
];

export default function Services() {
  return (
    <Section id="services" className="bg-[#FAFAFA]" ariaLabelledby="services-heading">
      <SectionHeader
        id="services-heading"
        eyebrow="What we offer"
        title="Our Services"
        subtitle="A Ndola-focused platform for hospitals, donors, and staff to coordinate blood requests and safe transfusions."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map(({ title, description, icon: Icon, gradient }) => (
          <article
            key={title}
            className="group relative flex h-full min-h-[270px] flex-col overflow-hidden rounded-[24px] border border-gray-200/80 bg-gradient-to-br from-white via-[#fffdfd] to-[#fff7f8] p-7 shadow-[0_16px_40px_-24px_rgba(17,24,39,0.25)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_-20px_rgba(122,9,22,0.28)]"
          >
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${gradient}`} />
            <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">{title}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-[#6B7280]">{description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
