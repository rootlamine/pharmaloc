import Reveal from "@/components/layout/Reveal";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  isActive?: boolean;
}

const steps: Omit<StepCardProps, "isActive">[] = [
  {
    step: 1,
    title: "Autorisez la localisation",
    description:
      "Activez votre géolocalisation pour que nous puissions identifier votre position actuelle.",
  },
  {
    step: 2,
    title: "Voir les pharmacies proches",
    description:
      "Consultez la liste et la carte des pharmacies de garde disponibles autour de vous.",
  },
  {
    step: 3,
    title: "Appelez ou obtenez l'itinéraire",
    description:
      "Contactez la pharmacie ou lancez la navigation pour vous y rendre.",
  },
];

function StepCard({ step, title, description, isActive = false }: StepCardProps) {
  return (
    <div
      className={`flex flex-col items-center text-center p-8 rounded-[20px] border-2 shadow-md transition-all duration-300 ${
        isActive
          ? "bg-pharmaloc-dark border-pharmaloc-dark"
          : "bg-white border-pharmaloc-teal/30 hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-pharmaloc-teal flex items-center justify-center mb-5 flex-shrink-0">
        <span className="font-montserrat font-semibold text-white text-[22px] leading-none">
          {step}
        </span>
      </div>
      <h3
        className={`font-montserrat font-semibold text-[22px] leading-snug mb-3 ${
          isActive ? "text-white" : "text-pharmaloc-dark"
        }`}
      >
        {title}
      </h3>
      <p
        className={`font-sora text-[17px] leading-[28px] ${
          isActive ? "text-white" : "text-[#1e1e1e]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section
      className="py-16 lg:py-20 bg-white"
      aria-labelledby="how-heading"
    >
      <div className="section-container">
        <Reveal animation="fade-up">
          <h2
            id="how-heading"
            className="font-montserrat font-bold text-pharmaloc-dark text-3xl lg:text-[40px] text-center mb-12"
          >
            Comment ça fonctionne ?
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.step} animation="fade-up" delay={i * 120}>
              <StepCard {...step} isActive={step.step === 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
