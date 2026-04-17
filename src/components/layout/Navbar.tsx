import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import {
  Menu,
  X,
  Home,
  BookOpen,
  FolderDown,
  Lightbulb,
  CalendarDays,
  Info,
} from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/trilhas", label: "Trilhas", icon: BookOpen },
  { to: "/materiais", label: "Materiais", icon: FolderDown },
  { to: "/pilulas", label: "Pílulas", icon: Lightbulb },
  { to: "/eventos", label: "Eventos", icon: CalendarDays },
  { to: "/sobre", label: "Sobre", icon: Info },
] as const;

const LOGO_URL = "/logo_FC_transparente.png";
const LOGO_ALT = "[Faculdade de Computação e Informática - Mackenzie]";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();
  const showAuthCtas = !isLoaded || !isSignedIn;

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <header className="header-text-white sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-dark)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink
          to="/"
          className="inline-flex items-center"
          onClick={() => setMobileOpen(false)}
        >
          <img
            src={LOGO_URL}
            alt={LOGO_ALT}
            className="h-8 w-auto brightness-0 invert sm:h-9"
          />
        </NavLink>

        <ul className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-[3px] px-3.5 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-mack)] text-white"
                      : "text-white hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {showAuthCtas ? (
            <>
              <NavLink
                to="/auth/sign-in"
                className="inline-flex rounded-[3px] border border-white/80 bg-transparent px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 sm:px-3 sm:py-2 sm:text-sm cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </NavLink>
              <NavLink
                to="/auth/sign-up"
                className="inline-flex rounded-[3px] border border-white bg-[var(--color-mack-dark)] px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#8F1413] sm:px-3 sm:py-2 sm:text-sm cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                Criar conta
              </NavLink>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <NavLink
                to="/perfil"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors cursor-pointer ${
                    isActive ? "text-white" : "text-white/80 hover:text-white"
                  }`
                }
              >
                Meu Perfil
              </NavLink>
              <UserButton />
            </div>
          )}

          <button
            type="button"
            className="rounded-[3px] p-2 text-white hover:bg-white/10 md:hidden cursor-pointer"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] md:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-[80vw] max-w-xs bg-[var(--color-dark)] shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col overflow-y-auto pb-6">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <span className="text-lg font-bold text-white">Menu</span>
              <button
                type="button"
                className="rounded-[3px] p-2 text-white hover:bg-white/10 cursor-pointer"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-4 py-6">
              {showAuthCtas ? (
                <div className="flex flex-col gap-3 mb-6">
                  <NavLink
                    to="/auth/sign-in"
                    className="inline-flex w-full justify-center rounded-[3px] border border-white/80 bg-transparent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Entrar na conta
                  </NavLink>
                  <NavLink
                    to="/auth/sign-up"
                    className="inline-flex w-full justify-center rounded-[3px] border border-white bg-[var(--color-mack-dark)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#8F1413] cursor-pointer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Criar conta
                  </NavLink>
                </div>
              ) : (
                <div className="flex flex-col items-center border-b border-white/10 pb-6 mb-6">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-16 h-16 mb-2",
                      },
                    }}
                  />
                  <NavLink
                    to="/perfil"
                    className="mt-3 text-sm font-medium text-white/80 hover:text-white underline underline-offset-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Ver Meu Perfil
                  </NavLink>
                </div>
              )}

              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-[3px] px-3 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                          isActive
                            ? "bg-[var(--color-mack-dark)] text-white"
                            : "text-white hover:bg-white/10 hover:text-white"
                        }`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
