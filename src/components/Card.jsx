import StatCard from "./ui/StatCard";
export default function Card({ title, value, subtitle, icon, color, onClick }) { return <StatCard label={title} value={value} description={subtitle} icon={icon} tone={color ? `${color} text-white` : undefined} onClick={onClick} />; }
