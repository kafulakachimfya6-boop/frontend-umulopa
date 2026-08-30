import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import Services from "../components/landing/Services";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import DonorCTA from "../components/landing/DonorCTA";
import Testimonials from "../components/landing/Testimonials";
import Partners from "../components/landing/Partners";
import FAQ from "../components/landing/FAQ";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#111827]">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <HowItWorks />
        <Features />
        <DonorCTA />
        <Testimonials />
        <Partners />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
