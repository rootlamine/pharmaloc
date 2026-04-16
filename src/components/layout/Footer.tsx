import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "Pharmacie de garde", to: "/pharmacie-de-garde" },
  { label: "À propos", to: "/a-propos" },
  { label: "Contact", to: "/contact" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/pharmaloc.sn?igsh=eXN4M2dzaDBscXcw&utm_source=qr",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61569104332678&mibextid=wwXIfr&mibextid=wwXIfr",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@pharmaloc.sn?_r=1&_t=ZS-95Zb77bfXLG",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34v-7a8.28 8.28 0 0 0 4.84 1.55V6.41a4.85 4.85 0 0 1-1.07-.28z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/pharmaloc-sn/",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-pharmaloc-dark text-white">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/">
              <img
                src="/logo.png"
                alt="PharmaLoc"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="font-sora text-[15px] text-white leading-relaxed max-w-[280px]">
              Trouvez rapidement une pharmacie de garde près de chez vous au Sénégal.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-montserrat font-semibold text-[20px] mb-5">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sora text-[16px] text-white hover:text-pharmaloc-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-montserrat font-semibold text-[20px] mb-5">Contact</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="mailto:pharmaloc.sn@gmail.com"
                  className="flex items-center gap-3 font-sora text-[15px] text-white hover:text-pharmaloc-accent transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={15} className="text-pharmaloc-teal" />
                  </span>
                  pharmaloc.sn@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+221778873288"
                  className="flex items-center gap-3 font-sora text-[15px] text-white hover:text-pharmaloc-accent transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={15} className="text-pharmaloc-teal" />
                  </span>
                  +221 77 887 32 88
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-montserrat font-semibold text-[20px] mb-5">Suivez-nous</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-pharmaloc-teal transition-colors"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-5 flex flex-col items-center gap-1 text-center">
          <p className="font-sora text-[14px] text-white">
            © 2026 PharmaLoc. Tous droits réservés.
          </p>
          <p className="font-sora text-[13px] text-white">
            Mentions légales • Politique de confidentialité • Conditions d'utilisation
          </p>
        </div>
      </div>
    </footer>
  );
}
