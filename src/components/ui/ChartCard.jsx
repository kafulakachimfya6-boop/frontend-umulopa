import SectionHeader from "./SectionHeader";
export default function ChartCard({ title, description, action, children, className = "" }) { return <section className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,.06)] ${className}`}><SectionHeader title={title} description={description} action={action} /><div className="mt-5">{children}</div></section>; }
