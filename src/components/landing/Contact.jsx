import { useState } from "react";
import { Mail, MapPin, Phone, Siren } from "lucide-react";
import Section, { SectionHeader } from "./Section";
import Button from "./Button";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+260 973067687" },
  { icon: Mail, label: "Email", value: "support@umulopasafetransfer.org" },
  { icon: MapPin, label: "Address", value: "Northrise, Ndola, Zambia" },
  { icon: Siren, label: "Emergency Hotline", value: "+260 973067687", highlight: true },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <Section id="contact" ariaLabelledby="contact-heading">
      <SectionHeader
        id="contact-heading"
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle="Reach our team for support, partnerships, or emergency coordination."
      />

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          {contactInfo.map(({ icon: Icon, label, value, highlight }) => (
            <div
              key={label}
              className={`flex items-start gap-4 rounded-2xl border p-6 ${highlight ? "border-[#C1121F]/30 bg-[#C1121F]/5" : "border-gray-100 bg-white"}`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${highlight ? "bg-[#C1121F] text-white" : "bg-[#7A0916]/10 text-[#7A0916]"}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6B7280]">{label}</p>
                <p className={`mt-1 font-semibold ${highlight ? "text-[#C1121F]" : "text-[#111827]"}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
          <div className="grid gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#111827]">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-[#111827] outline-none transition focus:border-[#7A0916] focus:ring-2 focus:ring-[#7A0916]/20"
                placeholder="Your full name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#111827]">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-[#111827] outline-none transition focus:border-[#7A0916] focus:ring-2 focus:ring-[#7A0916]/20"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#111827]">Subject</span>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-[#111827] outline-none transition focus:border-[#7A0916] focus:ring-2 focus:ring-[#7A0916]/20"
                placeholder="How can we help?"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#111827]">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-[#111827] outline-none transition focus:border-[#7A0916] focus:ring-2 focus:ring-[#7A0916]/20"
                placeholder="Tell us more about your inquiry..."
              />
            </label>
          </div>

          {submitted ? (
            <p className="mt-4 text-sm font-medium text-green-700" role="status">
              Thank you! Your message has been received. Our team will respond shortly.
            </p>
          ) : null}

          <Button type="submit" className="mt-6 w-full">
            Send Message
          </Button>
        </form>
      </div>
    </Section>
  );
}
