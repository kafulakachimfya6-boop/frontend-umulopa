import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-[#7A0916] text-white shadow-md shadow-[#7A0916]/20 hover:bg-[#5a0610] hover:shadow-lg hover:shadow-[#7A0916]/25",
  secondary:
    "border-2 border-[#7A0916] bg-white text-[#7A0916] hover:bg-[#FAFAFA] hover:shadow-md",
  ghost:
    "border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
  light:
    "bg-white text-[#7A0916] shadow-md hover:bg-[#FAFAFA] hover:shadow-lg",
};

export default function Button({
  children,
  variant = "primary",
  to,
  href,
  onClick,
  type = "button",
  className = "",
  ariaLabel,
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1121F]";

  const classes = `${base} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
