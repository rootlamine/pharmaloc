import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "Pharmacie de garde", to: "/pharmacie-de-garde" },
  { label: "À propos", to: "/a-propos" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-[9999] bg-pharmaloc-dark shadow-lg">
      <div className="section-container flex items-center justify-between h-[90px]">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center">
          <img
            src="/logo.png"
            alt="PharmaLoc – La pharmacie de garde en un clic"
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`font-montserrat font-medium text-[18px] transition-colors hover:text-pharmaloc-accent ${
                isActive(link.to) ? "text-pharmaloc-accent" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          aria-label="Ouvrir le menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="md:hidden bg-pharmaloc-dark border-t border-white/10 px-6 py-4 flex flex-col gap-4"
          aria-label="Navigation mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`font-montserrat font-medium text-[17px] transition-colors hover:text-pharmaloc-accent ${
                isActive(link.to) ? "text-pharmaloc-accent" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
