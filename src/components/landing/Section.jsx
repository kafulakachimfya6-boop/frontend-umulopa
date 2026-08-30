export default function Section({ id, className = "", children, ariaLabelledby }) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`px-4 py-20 md:px-8 lg:px-16 xl:px-24 ${className}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, id, align = "center" }) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-14 max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#C1121F]">{eyebrow}</p>
      ) : null}
      {title ? (
        <h2 id={id} className="text-3xl font-bold tracking-tight text-[#111827] md:text-4xl lg:text-5xl">
          {title}
        </h2>
      ) : null}
      {subtitle ? <p className="mt-4 text-lg leading-relaxed text-[#6B7280]">{subtitle}</p> : null}
    </div>
  );
}
