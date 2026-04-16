import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Reveal from "@/components/layout/Reveal";

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section
      className="section-container py-10 lg:py-16"
      aria-label="Appel à l'action"
    >
      <Reveal animation="fade-up">
        <div className="bg-pharmaloc-dark rounded-[20px] px-8 sm:px-16 py-14 flex flex-col items-center text-center">
          <h2 className="font-montserrat font-bold text-white text-2xl sm:text-3xl lg:text-[40px] leading-tight mb-5 whitespace-nowrap">
            Besoin d'une pharmacie maintenant ?
          </h2>
          <p className="font-montserrat text-white text-base sm:text-lg lg:text-[22px] font-normal leading-[28px] mb-8 max-w-xl">
            Ne perdez plus de temps. Trouvez la pharmacie de garde la plus proche en quelques secondes.
          </p>
          <Button
            onClick={() => navigate("/pharmacie-de-garde")}
            className="bg-pharmaloc-teal hover:bg-pharmaloc-teal/90 text-white font-montserrat font-semibold text-base sm:text-lg px-8 py-3 h-auto rounded-lg shadow-md transition-all duration-200"
            aria-label="Localiser une pharmacie de garde"
          >
            Localiser une pharmacie
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
