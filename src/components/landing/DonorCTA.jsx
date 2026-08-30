import Button from "./Button";

export default function DonorCTA() {
  return (
    <section id="donor-cta" className="relative overflow-hidden bg-[#7A0916] py-24 text-white" aria-labelledby="cta-heading">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#C1121F]/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#E63946]/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
        <h2 id="cta-heading" className="text-3xl font-bold md:text-5xl">
          Become a Hero Today
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          Copperbelt hospitals depend on reliable donors. Join UMULOPA Safe Transfer and help ensure blood is available when urgent requests come in.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button to="/signup" variant="light">
            Become Donor
          </Button>
          <Button href="#services" variant="ghost">
            View Available Donors
          </Button>
        </div>
      </div>

      <div className="absolute inset-x-0 -bottom-px" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#FAFAFA" />
        </svg>
      </div>
    </section>
  );
}
