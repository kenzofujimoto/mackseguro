import { FileText, BookOpen, Image, File, Download } from "lucide-react";
import { materiais, corMap } from "../data/mock.ts";
import type { Material, CorKey } from "../data/mock.ts";
import Seo from "../components/seo/Seo.tsx";

function tipoIcon(tipo: Material["tipo"]) {
  switch (tipo) {
    case "pdf":
      return <FileText className="h-5 w-5" />;
    case "ebook":
      return <BookOpen className="h-5 w-5" />;
    case "cartilha":
      return <File className="h-5 w-5" />;
    case "infografico":
      return <Image className="h-5 w-5" />;
  }
}

function tipoLabel(tipo: Material["tipo"]) {
  const labels: Record<Material["tipo"], string> = {
    pdf: "PDF",
    ebook: "E-book",
    cartilha: "Cartilha",
    infografico: "Infográfico",
  };
  return labels[tipo];
}

export default function Materiais() {
  return (
    <>
      <Seo
        title="Biblioteca de Materiais"
        description="Baixe materiais gratuitos do MackSeguro: cartilhas, e-books, PDFs e infográficos sobre segurança digital."
        canonicalPath="/materiais"
      />

      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Biblioteca de Materiais
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            PDFs, e-books e infográficos gratuitos para download
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {materiais.map((mat) => {
              const cores = corMap[mat.cor as CorKey];
              return (
                <article key={mat.id} className="card-mk flex flex-col p-5">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className={`rounded-lg p-2 ${cores.bg}`}>
                      <span className={cores.text}>{tipoIcon(mat.tipo)}</span>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${cores.bg} ${cores.text}`}
                    >
                      {tipoLabel(mat.tipo)}
                    </span>
                  </div>

                  <h2 className="mb-1.5 font-semibold text-[var(--color-text)]">
                    {mat.titulo}
                  </h2>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {mat.descricao}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {mat.tamanho}
                    </span>
                    <a
                      href={mat.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary btn-sm"
                    >
                      <Download className="h-4 w-4" />
                      Baixar
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
