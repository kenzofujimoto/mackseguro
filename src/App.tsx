import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { setSupabaseTokenGetter } from "./lib/supabaseConfig.ts";
import Navbar from "./components/layout/Navbar.tsx";
import Footer from "./components/layout/Footer.tsx";
import CourseAccessGate from "./components/auth/CourseAccessGate.tsx";
import ProtectedAdminRoute from "./components/auth/ProtectedAdminRoute.tsx";
import FontSizeControl from "./components/layout/FontSizeControl.tsx";
import { syncRemoteProgressToLocal } from "./lib/userData.ts";

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
const CertificadoValidacao = React.lazy(() => import("./pages/CertificadoValidacao.tsx"));
const AdminTrailsPage = React.lazy(() => import("./pages/admin/AdminTrailsPage.tsx"));
const CreateTrailPage = React.lazy(() => import("./pages/admin/CreateTrailPage.tsx"));
const EditTrailPage = React.lazy(() => import("./pages/admin/EditTrailPage.tsx"));
const TrailModulesPage = React.lazy(() => import("./pages/admin/TrailModulesPage.tsx"));
const EditModulePage = React.lazy(() => import("./pages/admin/EditModulePage.tsx"));
const ModuleContentPage = React.lazy(() => import("./pages/admin/ModuleContentPage.tsx"));
const ModuleQuizPage = React.lazy(() => import("./pages/admin/ModuleQuizPage.tsx"));
const EditQuizQuestionPage = React.lazy(() => import("./pages/admin/EditQuizQuestionPage.tsx"));

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
function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <FontSizeControl />
      <main className="page-shell flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

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
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/trilhas" element={<Trilhas />} />
            <Route path="/trilhas/:slug" element={<TrilhaDetalhe />} />
            <Route
              path="/trilhas/:slug/modulo/:moduloId"
              element={<CourseAccessGate><ModuloConteudo /></CourseAccessGate>}
            />
            <Route path="/materiais" element={<Materiais />} />
            <Route path="/pilulas" element={<Pilulas />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/perfil" element={<CourseAccessGate><Perfil /></CourseAccessGate>} />
            <Route path="/certificados/:certificateCode" element={<CertificadoValidacao />} />
            <Route path="/admin/trilhas" element={<ProtectedAdminRoute><AdminTrailsPage /></ProtectedAdminRoute>} />
            <Route path="/admin/trilhas/nova" element={<ProtectedAdminRoute><CreateTrailPage /></ProtectedAdminRoute>} />
            <Route path="/admin/trilhas/:id/editar" element={<ProtectedAdminRoute><EditTrailPage /></ProtectedAdminRoute>} />
            <Route path="/admin/trilhas/:id/modulos" element={<ProtectedAdminRoute><TrailModulesPage /></ProtectedAdminRoute>} />
            <Route path="/admin/modulos/:id/editar" element={<ProtectedAdminRoute><EditModulePage /></ProtectedAdminRoute>} />
            <Route path="/admin/modulos/:id/conteudo" element={<ProtectedAdminRoute><ModuleContentPage /></ProtectedAdminRoute>} />
            <Route path="/admin/modulos/:id/quiz" element={<ProtectedAdminRoute><ModuleQuizPage /></ProtectedAdminRoute>} />
            <Route path="/admin/quiz/:id/editar" element={<ProtectedAdminRoute><EditQuizQuestionPage /></ProtectedAdminRoute>} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </React.Suspense>
    </>
  );
}

export default App;
