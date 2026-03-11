import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Shield,
  Menu,
  X,
  Moon,
  Sun,
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
      {/* Faixa vermelha Mackenzie */}
      <div className="h-1 bg-[var(--color-mack)]" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 py-3"
          onClick={() => setMobileOpen(false)}
        >
          <Shield className="h-7 w-7 text-[var(--color-mack)]" strokeWidth={2.2} />
          <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">
            Mack<span className="text-[var(--color-mack)]">Seguro</span>
          </span>
        </NavLink>

        {/* Links desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-4 text-sm font-medium border-b-2 transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? "border-[var(--color-mack)] text-[var(--color-mack)]"
                      : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)] cursor-pointer"
            onClick={() => setDark((prev) => !prev)}
            aria-label={dark ? "Modo claro" : "Modo noturno"}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className="rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)] md:hidden cursor-pointer"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] md:hidden">
          <ul className="flex flex-col gap-0.5 px-3 py-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[var(--color-mack-bg)] text-[var(--color-mack)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]"
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
      )}
    </header>
  );
}
