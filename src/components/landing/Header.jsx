import { useEffect, useState } from "react";
import { Droplet, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { defaultNavItems } from "./navConfig";
import Button from "./Button";

export default function Header({ navItems = defaultNavItems }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const headerClass = scrolled
    ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
    : "bg-transparent";

  const linkClass =
    "relative text-sm font-medium transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#C1121F] after:transition-all hover:after:w-full";

  const desktopLinkColor = scrolled ? "text-[#111827] hover:text-[#7A0916]" : "text-white/90 hover:text-white";
  const logoSubColor = scrolled ? "text-[#6B7280]" : "text-white/70";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${headerClass}`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8 lg:px-16">
        <a href="#home" className="flex items-center gap-3" aria-label="ZNBTS home">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7A0916] text-white shadow-lg shadow-[#7A0916]/30">
            <Droplet className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className={`text-lg font-bold leading-none ${scrolled ? "text-[#111827]" : "text-white"}`}>UMULOPA SAFE TRANSFER</p>
            <p className={`text-xs font-medium ${logoSubColor}`}>Safe Transfer</p>
          </div>
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-4 xl:gap-8 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const isRoute = item.href.startsWith("/");
            return isRoute ? (
              <Link key={item.label} to={item.href} className={`${linkClass} ${desktopLinkColor}`} onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className={`${linkClass} ${desktopLinkColor}`}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button to="/login" variant={scrolled ? "secondary" : "ghost"} className="px-5 py-2.5">
            Login
          </Button>
          <Button to="/signup" variant={scrolled ? "primary" : "light"} className="px-5 py-2.5">
            Donate Blood
          </Button>
        </div>

        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl lg:hidden ${scrolled ? "bg-[#FAFAFA] text-[#7A0916]" : "bg-white/15 text-white"}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-gray-100 bg-white/95 px-4 py-6 shadow-xl backdrop-blur lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-4" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const isRoute = item.href.startsWith("/");
              return isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-base font-medium text-[#111827] transition hover:text-[#7A0916]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-base font-medium text-[#111827] transition hover:text-[#7A0916]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
              <Button to="/login" variant="secondary" className="w-full">
                Login
              </Button>
              <Button to="/signup" variant="primary" className="w-full">
                Donate Blood
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
