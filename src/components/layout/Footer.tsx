import { Link } from "react-router-dom";

const LOGO_URL = "https://www.mackenzie.br/fileadmin/CONFIGURACOES/DEFAULT_21/Resources/Public/Template/img/logo/mackenzie_w.svg";
const LOGO_ALT = "[Instituto Presbiteriano Mackenzie]";

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
    <footer className="footer-text-white mt-16 bg-[var(--color-dark)] text-white">
      <div className="h-1 bg-[var(--color-mack)]" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="mb-4 inline-flex items-center">
              <img
                src={LOGO_URL}
                alt={LOGO_ALT}
                className="h-8 w-auto brightness-0 invert sm:h-9"
              />
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-white">
              Plataforma extensionista de educação em segurança digital com
              trilhas, materiais e comunidade para aprendizado contínuo.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-white transition-colors hover:text-white cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/25 pt-6 text-center text-xs text-white">
          <p>
            © {currentYear} MackSeguro · Projeto Extensionista do Instituto Presbiteriano Mackenzie
          </p>
        </div>
      </div>
    </footer>
  );
}
