import { Activity, Cross, Heart, Shield } from "lucide-react";
import Button from "./Button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-white pt-28 pb-20 md:pt-32"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute -right-32 -top-20 h-[520px] w-[520px] rounded-full bg-[#7A0916]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#E63946]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-[40%] bg-[#C1121F]/5" />

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 md:px-8 lg:grid-cols-2 lg:px-16">
        <div className="animate-[fadeUp_0.8s_ease-out]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C1121F]/20 bg-[#C1121F]/5 px-4 py-2 text-sm font-semibold text-[#7A0916]">
            <Heart className="h-4 w-4 text-[#E63946]" aria-hidden="true" />
            Saving Lives Together
          </span>

          <h1 id="hero-heading" className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[#111827] md:text-5xl lg:text-6xl">
            Ndola <span className="text-[#C1121F]">hospitals</span>
            <br />
            need donors like you
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#6B7280]">
            The Zambia National Blood Transfusion Service (ZNBTS) helps Copperbelt hospitals request blood quickly, match it with available donors, and track every transfusion safely from donor registration to delivery.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button to="/signup">Join as Donor</Button>
            <Button to="/login/staff" variant="secondary">
              Hospital Portal
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[#6B7280]">
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#7A0916]" aria-hidden="true" />
              Secure records
            </span>
            <span className="inline-flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#7A0916]" aria-hidden="true" />
              Real-time availability
            </span>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg animate-[float_6s_ease-in-out_infinite]">
            <div className="absolute -left-6 top-8 rounded-2xl bg-white p-4 shadow-xl shadow-[#7A0916]/10 animate-[float_5s_ease-in-out_infinite_0.5s]">
              <Cross className="h-6 w-6 text-[#C1121F]" aria-hidden="true" />
            </div>
            <div className="absolute -right-4 top-1/3 rounded-2xl bg-white p-4 shadow-xl shadow-[#7A0916]/10 animate-[float_7s_ease-in-out_infinite_1s]">
              <Heart className="h-6 w-6 text-[#E63946]" aria-hidden="true" />
            </div>
            <div className="absolute bottom-8 left-0 rounded-2xl bg-white p-4 shadow-xl shadow-[#7A0916]/10 animate-[float_5.5s_ease-in-out_infinite]">
              <Activity className="h-6 w-6 text-[#7A0916]" aria-hidden="true" />
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-[#7A0916]/10 bg-gradient-to-br from-[#7A0916]/5 via-white to-[#E63946]/5 p-6 shadow-2xl shadow-[#7A0916]/10 sm:p-8">
              <img
                src="images\blood-illustration.jpg"
                alt="Blood donation illustration for Copperbelt hospitals"
                className="mx-auto w-full max-w-sm rounded-[1.5rem] border border-white/80 bg-white/70 p-3 shadow-inner"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
