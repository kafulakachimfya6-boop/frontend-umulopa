import Badge from "./ui/Badge";
export default function StatusBadge({ status = "neutral", children }) { return <Badge tone={status}>{children}</Badge>; }
