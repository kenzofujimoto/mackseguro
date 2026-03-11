import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const footerLinks = [
  {
    title: "Aprender",
    links: [
      { to: "/trilhas", label: "Trilhas" },
      { to: "/materiais", label: "Materiais" },
      { to: "/pilulas", label: "Pílulas" },
    ],
  },
  {
    title: "Comunidade",
    links: [
      { to: "/eventos", label: "Eventos" },
      { to: "/sobre", label: "Sobre" },
    ],
  },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-dark)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="mb-4 inline-flex items-center gap-2">
              <Shield className="h-6 w-6 text-[var(--color-mack)]" strokeWidth={2.2} />
              <span className="text-lg font-bold text-white">
                Mack<span className="text-[var(--color-mack)]">Seguro</span>
              </span>
            </Link>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/60 transition-colors hover:text-[var(--color-mack)] cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Créditos */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          <p>
            © {currentYear} MackSeguro — Projeto Extensionista · Instituto
            Presbiteriano Mackenzie
          </p>
        </div>
      </div>
    </footer>
  );
}
