import { CheckCircle2, RefreshCw, ShieldCheck, type LucideIcon } from "lucide-react";
import Reveal from "@/components/layout/Reveal";

interface TrustPointProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const trustPoints: TrustPointProps[] = [
  {
    icon: CheckCircle2,
    title: "Informations vérifiées",
    description:
      "Toutes nos données sont vérifiées et validées par des professionnels de santé",
  },
  {
    icon: RefreshCw,
    title: "Mise à jour régulière",
    description:
      "Notre base de données est actualisée quotidiennement pour vous garantir des informations précises.",
  },
  {
    icon: ShieldCheck,
    title: "Accés aux soins facilité",
    description:
      "Notre mission est de faciliter l'accès aux soins d'urgence à tous les Sénégalais.",
  },
];

function TrustPoint({ icon: Icon, title, description }: TrustPointProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Icon className="w-7 h-7 text-pharmaloc-teal flex-shrink-0" strokeWidth={2} />
        <h3 className="font-montserrat font-semibold text-pharmaloc-dark text-[22px] leading-snug">
          {title}
        </h3>
      </div>
      <p className="font-sora text-[#1e1e1e] text-[17px] leading-[28px] pl-10">
        {description}
      </p>
    </div>
  );
}

export default function TrustSection() {
  return (
    <section
      className="py-16 lg:py-20 bg-white"
      aria-labelledby="trust-heading"
    >
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
          {/* Doctor image */}
          <Reveal animation="fade-left" className="w-full md:w-[42%] flex-shrink-0">
            <img
              src="/images/doctor-patient.jpg"
              alt="Médecin avec un patient"
              className="w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[520px] object-cover rounded-[20px] shadow-lg"
            />
          </Reveal>

          {/* Trust points */}
          <div className="flex-1 flex flex-col gap-8">
            <Reveal animation="fade-up">
              <h2
                id="trust-heading"
                className="font-montserrat font-bold text-pharmaloc-dark text-2xl sm:text-3xl lg:text-[36px] leading-tight"
              >
                Une plateforme fiable et sécurisée
              </h2>
            </Reveal>
            <div className="flex flex-col gap-8">
              {trustPoints.map((point, i) => (
                <Reveal key={point.title} animation="fade-right" delay={i * 120}>
                  <TrustPoint {...point} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
