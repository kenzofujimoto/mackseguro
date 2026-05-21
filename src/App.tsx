import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { setSupabaseTokenGetter } from "./lib/supabaseConfig.ts";
import Navbar from "./components/layout/Navbar.tsx";
import Footer from "./components/layout/Footer.tsx";
import CourseAccessGate from "./components/auth/CourseAccessGate.tsx";

const Home = React.lazy(() => import("./pages/Home.tsx"));
const Trilhas = React.lazy(() => import("./pages/Trilhas.tsx"));
const TrilhaDetalhe = React.lazy(() => import("./pages/TrilhaDetalhe.tsx"));
const Materiais = React.lazy(() => import("./pages/Materiais.tsx"));
const Pilulas = React.lazy(() => import("./pages/Pilulas.tsx"));
const Eventos = React.lazy(() => import("./pages/Eventos.tsx"));
const Sobre = React.lazy(() => import("./pages/Sobre.tsx"));
const ModuloConteudo = React.lazy(() => import("./pages/ModuloConteudo.tsx"));
const AuthSignIn = React.lazy(() => import("./pages/AuthSignIn.tsx"));
const AuthSignUp = React.lazy(() => import("./pages/AuthSignUp.tsx"));
const Perfil = React.lazy(() => import("./pages/Perfil.tsx"));

function NotFoundPage() {
  return (
    <section className="bg-[var(--color-bg-surface)] px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
        Página não encontrada
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        O endereço informado não existe no MackSeguro.
      </p>
      <div className="mt-6">
        <Link to="/" className="font-semibold text-[var(--color-mack)] hover:underline">
          Voltar para Home
        </Link>
      </div>
    </section>
  );
}

/** Layout for app pages (trilhas, materiais, etc.) — includes Navbar + Footer */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="page-shell flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import { syncRemoteProgressToLocal } from "./lib/userData.ts";

function ClerkSupabaseIntegration() {
  const { getToken, userId } = useAuth();
  React.useEffect(() => {
    setSupabaseTokenGetter(() => getToken({ template: "supabase" }));
    return () => {
      setSupabaseTokenGetter(null);
    };
  }, [getToken]);

  React.useEffect(() => {
    if (userId) {
      syncRemoteProgressToLocal(userId).catch(console.error);
    }
  }, [userId]);

  return null;
}

function App() {
  return (
    <>
      <ClerkSupabaseIntegration />
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="/auth/sign-in/*" element={<AuthSignIn />} />
          <Route path="/auth/sign-up/*" element={<AuthSignUp />} />

          {/* App pages — shared Navbar + Footer */}
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/trilhas" element={<AppLayout><Trilhas /></AppLayout>} />
          <Route path="/trilhas/:slug" element={<AppLayout><TrilhaDetalhe /></AppLayout>} />
          <Route
            path="/trilhas/:slug/modulo/:moduloId"
            element={<AppLayout><CourseAccessGate><ModuloConteudo /></CourseAccessGate></AppLayout>}
          />
          <Route path="/materiais" element={<AppLayout><Materiais /></AppLayout>} />
          <Route path="/pilulas" element={<AppLayout><Pilulas /></AppLayout>} />
          <Route path="/eventos" element={<AppLayout><Eventos /></AppLayout>} />
          <Route path="/sobre" element={<AppLayout><Sobre /></AppLayout>} />
          <Route path="/perfil" element={<AppLayout><CourseAccessGate><Perfil /></CourseAccessGate></AppLayout>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </React.Suspense>
    </>
  );
}

export default App;
