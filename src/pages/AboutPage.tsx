import { useEffect, useRef, useState } from "react";
import { Target, Heart, Users, Clock, Shield, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";

/* ─── Shared card types ─── */
interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive?: boolean;
}

/* ─── Hero Banner ─── */
function AboutHero() {
  return (
    <section className="bg-pharmaloc-dark py-14 lg:py-20 text-center" aria-labelledby="about-hero-heading">
      <div className="section-container max-w-3xl mx-auto">
        <Reveal animation="fade-up">
          <h1
            id="about-hero-heading"
            className="font-montserrat font-bold text-white text-3xl sm:text-[40px] leading-tight mb-5"
          >
            À propos de PharmaLoc
          </h1>
        </Reveal>
        <Reveal animation="fade-up" delay={120}>
          <p className="font-sora text-white text-base sm:text-[20px] leading-relaxed max-w-2xl mx-auto">
            Notre mission est de faciliter l'accès aux soins de santé au Sénégal en connectant les patients aux pharmacies de garde.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Qui sommes-nous ─── */
function WhoWeAre() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="who-heading">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text content on the left */}
          <Reveal animation="fade-right" className="flex-1 flex flex-col gap-6">
            <h2
              id="who-heading"
              className="font-montserrat font-bold text-pharmaloc-dark text-2xl sm:text-[32px] leading-tight"
            >
              Qui sommes-nous ?
            </h2>
            <p className="font-sora text-[#1e1e1e] text-[17px] leading-[28px]">
              PharmaLoc est une plateforme digitale innovante née d'un constat simple : en situation d'urgence, il est souvent difficile de savoir quelle pharmacie est de garde et où elle se trouve.
            </p>
            <p className="font-sora text-[#1e1e1e] text-[17px] leading-[28px]">
              Face à ce problème du quotidien, PharmaLoc propose une solution pratique et accessible, permettant aux utilisateurs de localiser rapidement les pharmacies de garde en fonction de leur position.
            </p>
            <p className="font-sora text-[#1e1e1e] text-[17px] leading-[28px]">
              Notre objectif est de faciliter l'accès à l'information, de faire gagner du temps et d'améliorer la prise en charge des situations urgentes, en offrant une expérience simple, fiable et intuitive.
            </p>
          </Reveal>

          {/* Doctor image on the right */}
          <Reveal animation="fade-left" className="w-full lg:w-[52%] flex-shrink-0">
            <img
              src="/images/doctor-tablet.jpg"
              alt="Médecin consultant une tablette dans un centre médical"
              className="w-full aspect-[4/3] sm:aspect-auto sm:h-[320px] md:h-[380px] lg:h-[500px] object-cover object-[center_top] rounded-[20px] shadow-lg"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Mission / Vision / Values ─── */
const mvvCards = [
  {
    icon: Target,
    title: "Notre mission",
    description:
      "Faciliter l'accès aux soins d'urgence en permettant à chaque Sénégalais de trouver rapidement une pharmacie de garde, où qu'il soit et à tout moment.",
  },
  {
    icon: Heart,
    title: "Notre vision",
    description:
      "Devenir la plateforme de référence en Afrique de l'Ouest pour la localisation des services de santé d'urgence et contribuer à sauver des vies.",
  },
  {
    icon: Users,
    title: "Nos valeurs",
    description:
      "Accessibilité, fiabilité, innovation et engagement envers la santé publique. Nous plaçons l'utilisateur au cœur de nos priorités.",
  },
];

function MVVCard({ icon: Icon, title, description }: Omit<InfoCardProps, "isActive">) {
  return (
    <div className="flex flex-col items-center text-center p-6 pt-8 bg-white rounded-[20px] border-2 border-pharmaloc-teal/30 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 rounded-full bg-pharmaloc-teal flex items-center justify-center mb-5 flex-shrink-0">
        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
      </div>
      <h3 className="font-montserrat font-semibold text-pharmaloc-dark text-[22px] leading-snug mb-3">
        {title}
      </h3>
      <p className="font-sora text-[#1e1e1e] text-[16px] leading-[26px]">{description}</p>
    </div>
  );
}

function MissionVisionValues() {
  return (
    <section className="pb-16 lg:pb-20">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mvvCards.map((card, i) => (
            <Reveal key={card.title} animation="fade-up" delay={i * 120}>
              <MVVCard {...card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pourquoi crucial ─── */
const crucialCards = [
  {
    icon: Clock,
    title: "Urgences médicales",
    description:
      "Chaque minute compte en cas d'urgence. Trouver rapidement une pharmacie ouverte peut être vital.",
    isActive: false,
  },
  {
    icon: Shield,
    title: "Santé publique",
    description:
      "Un accès facilité aux médicaments contribue à améliorer la santé publique et le bien-être de tous.",
    isActive: true,
  },
  {
    icon: MapPin,
    title: "Proximité",
    description:
      "Localiser la pharmacie la plus proche permet d'économiser du temps et de réduire le stress.",
    isActive: false,
  },
];

function CrucialCard({ icon: Icon, title, description, isActive = false }: InfoCardProps) {
  return (
    <div
      className={`flex flex-col items-center text-center p-8 rounded-[20px] border-2 shadow-md transition-all duration-300 ${
        isActive
          ? "bg-pharmaloc-dark border-pharmaloc-dark"
          : "bg-white border-pharmaloc-teal/30 hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      <div className="w-14 h-14 rounded-full bg-pharmaloc-teal flex items-center justify-center mb-5 flex-shrink-0">
        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
      </div>
      <h3
        className={`font-montserrat font-semibold text-[22px] leading-snug mb-3 ${
          isActive ? "text-white" : "text-pharmaloc-dark"
        }`}
      >
        {title}
      </h3>
      <p
        className={`font-sora text-[16px] leading-[26px] ${
          isActive ? "text-white/85" : "text-[#1e1e1e]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function WhyCrucial() {
  return (
    <section className="py-16 lg:py-20" aria-labelledby="crucial-heading">
      <div className="section-container">
        <Reveal animation="fade-up">
          <h2
            id="crucial-heading"
            className="font-montserrat font-bold text-pharmaloc-dark text-2xl sm:text-3xl lg:text-[38px] mb-12"
          >
            Pourquoi l'accès aux pharmacies de garde est crucial ?
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {crucialCards.map((card, i) => (
            <Reveal key={card.title} animation="fade-up" delay={i * 120}>
              <CrucialCard {...card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ─── */
interface StatItem {
  numericValue: number;
  prefix: string;
  suffix: string;
  label: string;
  duration?: number;
}

const stats: StatItem[] = [
  { numericValue: 50, prefix: "+", suffix: "", label: "Pharmacies référencées", duration: 2000 },
  { numericValue: 24, prefix: "", suffix: "/7", label: "Service disponible 24h/24, 7j/7", duration: 1400 },
  { numericValue: 100, prefix: "", suffix: "%", label: "Gratuit pour les utilisateurs", duration: 1800 },
];

function AnimatedStat({ numericValue, prefix, suffix, label, duration = 2000 }: StatItem) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(numericValue, duration, started);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <span className="font-montserrat font-bold text-pharmaloc-teal text-6xl sm:text-7xl lg:text-[80px] leading-none tabular-nums">
        {prefix}{count}{suffix}
      </span>
      <p className="font-montserrat font-semibold text-white text-[16px] sm:text-[18px]">
        {label}
      </p>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="bg-pharmaloc-dark py-14 lg:py-20" aria-label="Statistiques">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Join Mission CTA ─── */
function JoinMission() {
  return (
    <section className="py-16 lg:py-24 text-center" aria-labelledby="join-heading">
      <div className="section-container">
        <div className="w-fit mx-auto flex flex-col items-center">
          <Reveal animation="fade-up">
            <h2
              id="join-heading"
              className="font-montserrat font-bold text-pharmaloc-dark text-2xl sm:text-3xl lg:text-[40px] leading-tight mb-5"
            >
              Rejoignez-nous dans notre mission
            </h2>
          </Reveal>
          <Reveal animation="fade-up" delay={120}>
            <p className="font-montserrat font-medium text-[#1e1e1e] text-base sm:text-[18px] lg:text-[20px] mb-8">
              Ensemble, améliorons l'accès aux soins de santé au Sénégal.
            </p>
          </Reveal>
          <Reveal animation="fade-up" delay={240}>
            <Button
              className="bg-pharmaloc-teal hover:bg-pharmaloc-teal/90 text-white font-montserrat font-semibold text-base sm:text-lg px-8 py-3 h-auto rounded-full shadow-md transition-all duration-200"
              aria-label="Nous contacter"
            >
              Contactez-nous
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── About Page ─── */
export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <WhoWeAre />
        <MissionVisionValues />
        <WhyCrucial />
        <StatsSection />
        <JoinMission />
      </main>
      <Footer />
    </div>
  );
}
