import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Reveal from "@/components/layout/Reveal";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="section-container py-10" aria-label="Accueil">
      <div className="relative rounded-[20px] overflow-hidden min-h-[360px] sm:min-h-[430px] lg:min-h-[578px]">
        {/* Background pharmacy image */}
        <img
          src="/images/hero-pharmacy.jpg"
          alt="Pharmacienne avec une tablette dans une pharmacie"
          className="absolute inset-0 w-full h-full object-cover object-[center_top]"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(13,81,84,1) 31.83%, rgba(16,102,106,0.78) 55.48%, rgba(29,179,186,0) 84.72%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full min-h-[360px] sm:min-h-[430px] lg:min-h-[578px] px-5 sm:px-10 lg:px-14 py-10 max-w-[640px]">
          <Reveal animation="fade-up" delay={0}>
            <h1 className="font-montserrat font-bold text-white text-3xl sm:text-4xl lg:text-[50px] leading-tight mb-6">
              Trouver une pharmacie de garde en quelques secondes
            </h1>
          </Reveal>
          <Reveal animation="fade-up" delay={120}>
            <p className="font-sora text-white text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-[540px]">
              PharmaLoc vous permet de localiser rapidement les pharmacies de garde les plus proches de vous au Sénégal, 24h/24 et 7j/7.
            </p>
          </Reveal>
          <Reveal animation="fade-up" delay={240}>
            <Button
              onClick={() => navigate("/pharmacie-de-garde")}
              className="w-full sm:w-fit bg-pharmaloc-teal hover:bg-pharmaloc-teal/90 text-white font-sora font-semibold text-sm sm:text-base lg:text-lg px-6 py-3 h-auto rounded-lg shadow-md transition-all duration-200"
              aria-label="Trouver une pharmacie de garde près de moi"
            >
              Trouver une pharmacie près de moi
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
