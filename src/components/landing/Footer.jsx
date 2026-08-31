import { useState } from "react";
import { ArrowUp, BadgeCheck, Droplet, Globe, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useAppState } from "../../context/useAppState";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Request Blood", href: "/login/staff" },
];

const serviceLinks = [
  { label: "Find Blood", href: "#services" },
  { label: "Become Donor", href: "/signup" },
  { label: "Blood Request", href: "/login/staff" },
  { label: "Hospital Portal", href: "/login/staff" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { newsletterSubscribers = [], setNewsletterSubscribers } = useAppState();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return;
    if (!newsletterSubscribers.some((x) => x.email === normalized)) setNewsletterSubscribers((current) => [...current, { id: `NEWS-${Date.now()}`, email: normalized, subscribedAt: new Date().toISOString(), source: "public-footer" }]);
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative bg-[#7A0916] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 lg:px-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Droplet className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold">UMULOPA SAFE TRANSFER</p>
                <p className="text-xs text-white/70">safe transfer</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Secure digital blood management for Copperbelt hospitals, donors, and patients across the ZNBTS network.
            </p>
            <div className="mt-6 flex gap-3">
              {[Globe, MessageCircle, Send, BadgeCheck].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
                  aria-label="Social media link"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm text-white/70 transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Services</h3>
            <ul className="space-y-3">
              {serviceLinks.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith("/") ? (
                    <Link to={href} className="text-sm text-white/70 transition hover:text-white">
                      {label}
                    </Link>
                  ) : (
                    <a href={href} className="text-sm text-white/70 transition hover:text-white">
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Newsletter</h3>
            <p className="text-sm text-white/70">Stay updated on blood drives, shortages, and platform news.</p>
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
              />
              <Button type="submit" variant="light" className="w-full py-2.5 text-sm">
                Subscribe
              </Button>
              {subscribed ? (
                <p className="text-xs text-green-300" role="status">
                  Subscribed successfully. You will receive ZNBTS updates.
                </p>
              ) : null}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 md:flex-row">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} ZNBTS. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
