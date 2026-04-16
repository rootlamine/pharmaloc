import { MapPin, Clock, Phone, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/layout/Reveal";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: FeatureCardProps[] = [
  {
    icon: MapPin,
    title: "Géolocalisation",
    description:
      "Trouvez instantanément les pharmacies de garde les plus proches de votre position.",
  },
  {
    icon: Clock,
    title: "Horaire de garde",
    description:
      "Consultez les horaires d'ouverture et de garde de chaque pharmacie en temps réel.",
  },
  {
    icon: Phone,
    title: "Appel direct",
    description:
      "Appelez directement la pharmacie en un clic pour vérifier la disponibilité.",
  },
  {
    icon: Send,
    title: "Itinéraire",
    description:
      "Obtenez l'itinéraire le plus rapide vers la pharmacie de votre choix.",
  },
];

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 pt-8 bg-white rounded-[20px] border-2 border-pharmaloc-teal/30 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-16 h-16 rounded-full bg-pharmaloc-teal flex items-center justify-center mb-5 flex-shrink-0">
        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
      </div>
      <h3 className="font-montserrat font-semibold text-pharmaloc-dark text-[22px] leading-snug mb-3">
        {title}
      </h3>
      <p className="font-sora text-[#1e1e1e] text-[17px] leading-[28px]">
        {description}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      className="py-16 lg:py-20 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="section-container">
        <Reveal animation="fade-up">
          <h2
            id="features-heading"
            className="font-montserrat font-bold text-pharmaloc-dark text-3xl lg:text-[40px] text-center mb-12"
          >
            Fonctionnalités principales
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Reveal key={feature.title} animation="fade-up" delay={i * 100}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
