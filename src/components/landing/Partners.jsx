import Section, { SectionHeader } from "./Section";

const partners = [
  "Ndola Teaching Hospital",
  "Kitwe Teaching Hospital",
  "Mufulira District Hospital",
  "Chingola District Hospital",
  "Luanshya District Hospital",
  "Masaiti District Hospital",
  "Mpongwe District Hospital",
  "Lufwanyama District Hospital",
  "Chililabombwe District Hospital",
];

export default function Partners() {
  return (
    <Section id="partners" ariaLabelledby="partners-heading">
      <SectionHeader
        id="partners-heading"
        eyebrow="Our network"
        title="Partner Hospitals"
        subtitle="Built for the Zambia National Blood Transfusion Service (ZNBTS) Copperbelt Province hospital network."
      />

      <div className="relative overflow-hidden">
        <div className="flex animate-[scroll_30s_linear_infinite] gap-8 whitespace-nowrap">
          {[...partners, ...partners].map((name, index) => (
            <div
              key={`${name}-${index}`}
              className="inline-flex shrink-0 items-center rounded-2xl border border-gray-200 bg-white px-8 py-5 text-sm font-semibold text-[#6B7280] shadow-sm transition-all duration-300 hover:border-[#7A0916]/30 hover:text-[#7A0916] hover:shadow-md"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
