import Reveal from "@/components/layout/Reveal";

export default function AboutSection() {
  return (
    <section
      id="apropos"
      className="py-16 lg:py-20 bg-white"
      aria-labelledby="about-heading"
    >
      <div className="section-container text-center max-w-4xl mx-auto">
        <Reveal animation="fade-up">
          <h2
            id="about-heading"
            className="font-montserrat font-bold text-pharmaloc-dark text-3xl lg:text-[40px] mb-8"
          >
            Qu'est-ce que PharmaLoc ?
          </h2>
        </Reveal>
        <Reveal animation="fade-up" delay={120}>
          <p className="font-sora text-[#1e1e1e] text-base sm:text-lg lg:text-[20px] leading-[28px] max-w-3xl mx-auto">
            PharmaLoc est une plateforme digitale innovante basée au Sénégal qui facilite l'accès aux soins en permettant aux utilisateurs de trouver rapidement les pharmacies de garde disponibles grâce à la géolocalisation. Une solution simple, rapide et fiable pour vos urgences médicales.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
