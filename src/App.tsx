import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.tsx";
import Footer from "./components/layout/Footer.tsx";

/* ===== Páginas (placeholders) ===== */
import Home from "./pages/Home.tsx";
import Trilhas from "./pages/Trilhas.tsx";
import TrilhaDetalhe from "./pages/TrilhaDetalhe.tsx";
import Materiais from "./pages/Materiais.tsx";
import Pilulas from "./pages/Pilulas.tsx";
import Eventos from "./pages/Eventos.tsx";
import Sobre from "./pages/Sobre.tsx";
import ModuloConteudo from "./pages/ModuloConteudo.tsx";

/** Layout for app pages (trilhas, materiais, etc.) — includes Navbar + Footer */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Landing page — full-screen, own nav/footer inside Home */}
      <Route path="/" element={<Home />} />

      {/* App pages — shared Navbar + Footer */}
      <Route path="/trilhas" element={<AppLayout><Trilhas /></AppLayout>} />
      <Route path="/trilhas/:slug" element={<AppLayout><TrilhaDetalhe /></AppLayout>} />
      <Route path="/trilhas/:slug/modulo/:moduloId" element={<AppLayout><ModuloConteudo /></AppLayout>} />
      <Route path="/materiais" element={<AppLayout><Materiais /></AppLayout>} />
      <Route path="/pilulas" element={<AppLayout><Pilulas /></AppLayout>} />
      <Route path="/eventos" element={<AppLayout><Eventos /></AppLayout>} />
      <Route path="/sobre" element={<AppLayout><Sobre /></AppLayout>} />
    </Routes>
  );
}

export default App;
