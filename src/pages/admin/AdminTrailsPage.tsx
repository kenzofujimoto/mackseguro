import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getSupabaseErrorMessage,
  getUnknownErrorMessage,
  requireSupabaseClient,
} from "../../lib/adminSupabase.ts";

type Trail = {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  published: boolean;
};

export function AdminTrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarTrilhas() {
    setLoading(true);
    setErro("");

    try {
      const supabase = await requireSupabaseClient();
      const { data, error } = await supabase
        .from("trails")
        .select("id, title, slug, short_description, published")
        .order("created_at", { ascending: false });

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        setTrails([]);
        return;
      }

      setTrails((data as Trail[]) ?? []);
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
      setTrails([]);
    } finally {
      setLoading(false);
    }
  }

  async function deletarTrilha(id: number) {
    const confirmar = confirm("Deseja deletar esta trilha?");

    if (!confirmar) {
      return;
    }

    setErro("");

    try {
      const supabase = await requireSupabaseClient();
      const { error } = await supabase.from("trails").delete().eq("id", id);

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        return;
      }

      await carregarTrilhas();
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
    }
  }

  useEffect(() => {
    void carregarTrilhas();
  }, []);

  if (loading) {
    return (
      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Carregando trilhas...
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg-surface)] px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/" className="text-sm font-medium text-[var(--color-mack)] hover:underline">
              Voltar para o site
            </Link>
            <h1 className="mt-3 text-2xl font-bold text-[var(--color-text)]">
              Admin - Trilhas
            </h1>
          </div>

          <Link to="/admin/trilhas/nova" className="btn-primary btn-sm">
            Nova trilha
          </Link>
        </div>

        {erro && (
          <p role="alert" className="mb-5 rounded-md border border-[var(--color-rose)]/30 bg-[var(--color-rose-light)] px-3 py-2 text-sm text-[var(--color-rose)]">
            {erro}
          </p>
        )}

        <div className="space-y-4">
          {trails.length === 0 && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Nenhuma trilha cadastrada.
            </p>
          )}

          {trails.map((trail) => (
            <article key={trail.id} className="card-mk p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">
                    {trail.title}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {trail.short_description}
                  </p>
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    Slug: {trail.slug}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Status: {trail.published ? "Publicado" : "Oculto"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/trilhas/${trail.id}/editar`} className="btn-neutral btn-sm">
                    Editar
                  </Link>
                  <Link to={`/admin/trilhas/${trail.id}/modulos`} className="btn-neutral btn-sm">
                    Módulos
                  </Link>
                  <button
                    type="button"
                    onClick={() => void deletarTrilha(trail.id)}
                    className="btn-outline btn-sm border-[var(--color-rose)] text-[var(--color-rose)]"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminTrailsPage;
