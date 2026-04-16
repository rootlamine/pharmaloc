import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ─── Contact Hero ─── */
function ContactHero() {
  return (
    <section className="bg-pharmaloc-dark py-14 lg:py-20 text-center">
      <div className="section-container max-w-3xl mx-auto">
        <div className="w-fit mx-auto text-center">
          <Reveal animation="fade-up">
            <h1 className="font-montserrat font-bold text-white text-3xl sm:text-[40px] lg:text-[48px] leading-tight mb-4">
              Contactez-nous
            </h1>
          </Reveal>
          <Reveal animation="fade-up" delay={120}>
            <p className="font-sora text-white text-sm sm:text-base lg:text-[20px] text-center">
              Une question, une suggestion ou besoin d'aide ? Notre équipe est à votre écoute.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact info cards ─── */
interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}

function ContactCard({ icon, title, value, href }: ContactCardProps) {
  const inner = (
    <div className="flex items-center gap-5 p-5 bg-white rounded-[16px] border-2 border-pharmaloc-teal/30 shadow-sm hover:shadow-md hover:border-pharmaloc-teal/60 transition-all duration-200">
      <div className="w-14 h-14 rounded-full bg-pharmaloc-teal flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-sora font-semibold text-[#1e1e1e] text-[18px] sm:text-[22px] leading-snug">{title}</p>
        <p className="font-sora text-[#1e1e1e] text-[14px] sm:text-[18px] mt-0.5 break-all">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

/* ─── WhatsApp icon SVG ─── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const contactItems: ContactCardProps[] = [
  {
    icon: <Mail className="w-6 h-6 text-white" strokeWidth={2} />,
    title: "Email",
    value: "pharmaloc.sn@gmail.com",
    href: "mailto:pharmaloc.sn@gmail.com",
  },
  {
    icon: <Phone className="w-6 h-6 text-white" strokeWidth={2} />,
    title: "Téléphone",
    value: "+221 77 887 32 88",
    href: "tel:+221778873288",
  },
  {
    icon: <WhatsAppIcon />,
    title: "WhatsApp",
    value: "+221 77 887 32 88",
    href: "https://wa.me/221778873288",
  },
  {
    icon: <MapPin className="w-6 h-6 text-white" strokeWidth={2} />,
    title: "Adresse",
    value: "Mermoz, Dakar, Sénégal",
  },
];

/* ─── Contact Form ─── */
interface FormState {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}

const inputClass =
  "w-full rounded-[9px] bg-[#f3f3f5] px-4 py-2.5 font-sora text-[15px] text-[#0a0a0a] border border-transparent focus:outline-none focus:border-pharmaloc-teal/50 transition-colors";

function ContactForm() {
  const [form, setForm] = useState<FormState>({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.sujet || !form.message) {
      setError("Veuillez remplir tous les champs obligatoires (*).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-[20px] border border-pharmaloc-teal shadow-[2px_10px_15px_3px_rgba(0,0,0,0.10)] p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-pharmaloc-teal flex items-center justify-center mb-6">
          <Mail className="w-7 h-7 text-white" />
        </div>
        <h3 className="font-montserrat font-bold text-pharmaloc-dark text-2xl mb-3">
          Message envoyé !
        </h3>
        <p className="font-sora text-[#1e1e1e] text-[17px]">
          Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ nom: "", email: "", telephone: "", sujet: "", message: "" }); }}
          className="mt-6 font-sora text-pharmaloc-teal underline text-[15px]"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-pharmaloc-teal shadow-[2px_10px_15px_3px_rgba(0,0,0,0.10)] p-8 lg:p-10 bg-white">
      <h2 className="font-montserrat font-bold text-pharmaloc-dark text-2xl lg:text-[36px] mb-8">
        Envoyez-nous un message
      </h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Nom complet */}
        <div className="flex flex-col gap-1">
          <label className="font-sora text-[15px] text-[#0a0a0a]">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Votre nom complet"
            className={inputClass}
            aria-required="true"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="font-sora text-[15px] text-[#0a0a0a]">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            className={inputClass}
            aria-required="true"
          />
        </div>

        {/* Téléphone */}
        <div className="flex flex-col gap-1">
          <label className="font-sora text-[15px] text-[#0a0a0a]">Téléphone</label>
          <input
            type="tel"
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            placeholder="+221 77 000 00 00"
            className={inputClass}
          />
        </div>

        {/* Sujet */}
        <div className="flex flex-col gap-1">
          <label className="font-sora text-[15px] text-[#0a0a0a]">
            Sujet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sujet"
            value={form.sujet}
            onChange={handleChange}
            placeholder="Objet de votre message"
            className={inputClass}
            aria-required="true"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <label className="font-sora text-[15px] text-[#0a0a0a]">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Votre message..."
            rows={4}
            className={`${inputClass} resize-none`}
            aria-required="true"
          />
        </div>

        {error && (
          <p className="font-sora text-[14px] text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-pharmaloc-teal hover:bg-pharmaloc-teal/90 text-white font-sora font-semibold text-[17px] py-3 h-auto rounded-lg transition-all duration-200"
        >
          Envoyer le message
        </Button>
      </form>
    </div>
  );
}

/* ─── Contact Info + Form (2-col) ─── */
function ContactSection() {
  return (
    <section className="py-14 lg:py-20">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left: Info */}
          <Reveal animation="fade-right" className="flex flex-col gap-6">
            <div>
              <h2 className="font-montserrat font-bold text-pharmaloc-dark text-2xl lg:text-[36px] mb-3">
                Informations de contact
              </h2>
              <p className="font-sora text-[#1e1e1e] text-[17px] leading-[28px]">
                N'hésitez pas à nous contacter par l'un des moyens suivants. Nous vous répondrons dans les plus brefs délais.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {contactItems.map((item) => (
                <ContactCard key={item.title} {...item} />
              ))}
            </div>
          </Reveal>

          {/* Right: Form */}
          <Reveal animation="fade-left">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Opening Hours ─── */
const hours = [
  { day: "Lundi - Vendredi", time: "8h-18h" },
  { day: "Samedi", time: "9h-14h" },
  { day: "Dimanche et jours fériés", time: "Fermé" },
];

function OpeningHours() {
  return (
    <section className="section-container pb-14 lg:pb-20">
      <Reveal animation="fade-up">
      <div className="bg-pharmaloc-dark rounded-[20px] shadow-md px-5 sm:px-10 lg:px-16 py-10 max-w-[1035px] mx-auto">
        <h2 className="font-montserrat font-bold text-white text-2xl sm:text-[36px] text-center mb-8">
          Horaires d'ouverture
        </h2>
        <div className="flex flex-col gap-4">
          {hours.map(({ day, time }) => (
            <div
              key={day}
              className="flex items-center justify-between border-b border-white/15 pb-4 last:border-0 last:pb-0"
            >
              <span className="font-sora font-semibold text-white text-[20px] sm:text-[24px]">
                {day}
              </span>
              <span className="font-sora font-semibold text-white text-[20px] sm:text-[24px]">
                {time}
              </span>
            </div>
          ))}
        </div>
      </div>
      </Reveal>
    </section>
  );
}

/* ─── Leaflet marker icon for Mermoz ─── */
const mermozIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:40px;height:40px;
      background:#0d5154;
      border:3px solid #01c2a7;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
    ">
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%) rotate(45deg);
        color:#73e39f;
        font-size:16px;line-height:1;
      ">📍</div>
    </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -44],
});

/* Mermoz, Dakar coordinates */
const MERMOZ: [number, number] = [14.706, -17.4748];

/* ─── Map ─── */
function MapSection() {
  return (
    <section className="section-container pb-14 lg:pb-20" aria-labelledby="map-heading">
      <Reveal animation="fade-up">
      <h2
        id="map-heading"
        className="font-montserrat font-bold text-pharmaloc-dark text-2xl sm:text-[36px] text-center mb-8"
      >
        Notre localisation
      </h2>
      </Reveal>
      <Reveal animation="fade-up" delay={100}>
      <div className="rounded-[20px] overflow-hidden shadow-[2px_10px_15px_1px_rgba(0,0,0,0.10)] h-[220px] sm:h-[280px] lg:h-[340px]">
        <MapContainer
          center={MERMOZ}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={false}
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={MERMOZ} icon={mermozIcon}>
            <Popup className="pharmaloc-popup">
              <div className="font-sora text-sm">
                <p className="font-semibold text-pharmaloc-dark text-[15px] mb-0.5">PharmaLoc</p>
                <p className="text-[#444]">Mermoz, Dakar, Sénégal</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      </Reveal>
    </section>
  );
}

/* ─── Contact Page ─── */
export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <ContactHero />
        <ContactSection />
        <OpeningHours />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
