import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getSupabaseErrorMessage,
  getUnknownErrorMessage,
  requireSupabaseClient,
} from "../../lib/adminSupabase.ts";

type TrailModule = {
  id: number;
  title: string;
  description: string | null;
  xp: number;
  duration_minutes: number;
  position: number;
};

export function TrailModulesPage() {
  const { id } = useParams();

  const [modules, setModules] = useState<TrailModule[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarModulos() {
    setLoading(true);
    setErro("");

    if (!id) {
      setErro("ID da trilha não informado.");
      setModules([]);
      setLoading(false);
      return;
    }

    try {
      const supabase = await requireSupabaseClient();
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("trail_id", Number(id))
        .order("position", { ascending: true });

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        setModules([]);
        return;
      }

      setModules((data as TrailModule[]) ?? []);
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
      setModules([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarModulos();
  }, [id]);

  async function criarModulo(event: FormEvent) {
    event.preventDefault();
    setErro("");

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErro("Informe o título do módulo.");
      return;
    }

    if (!id) {
      setErro("ID da trilha não informado.");
      return;
    }

    setSaving(true);

    try {
      const supabase = await requireSupabaseClient();
      const { error } = await supabase.from("modules").insert({
        trail_id: Number(id),
        title: normalizedTitle,
        description: description.trim(),
        position: modules.length + 1,
        xp: 100,
        duration_minutes: 10,
      });

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        return;
      }

      setTitle("");
      setDescription("");
      await carregarModulos();
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function deletarModulo(moduleId: number) {
    const confirmar = confirm("Deseja deletar este módulo?");

    if (!confirmar) {
      return;
    }

    setErro("");

    try {
      const supabase = await requireSupabaseClient();
      const { error } = await supabase.from("modules").delete().eq("id", moduleId);

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        return;
      }

      await carregarModulos();
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
    }
  }

  if (loading) {
    return (
      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Carregando módulos...
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg-surface)] px-4 py-14">
      <div className="mx-auto max-w-4xl">
        <Link to="/admin/trilhas" className="text-sm font-medium text-[var(--color-mack)] hover:underline">
          Voltar para trilhas
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-[var(--color-text)]">
          Módulos da trilha
        </h1>

        {erro && (
          <p role="alert" className="mt-5 rounded-md border border-[var(--color-rose)]/30 bg-[var(--color-rose-light)] px-3 py-2 text-sm text-[var(--color-rose)]">
            {erro}
          </p>
        )}

        <form onSubmit={criarModulo} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Título do módulo
            <input className="field-control mt-1" value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Descrição
            <textarea className="field-control mt-1" value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Criando..." : "Criar módulo"}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          {modules.length === 0 && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Nenhum módulo cadastrado.
            </p>
          )}

          {modules.map((module) => (
            <article key={module.id} className="card-mk p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">
                    {module.title}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {module.description}
                  </p>
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    XP: {module.xp} · Duração: {module.duration_minutes} min · Ordem: {module.position}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/modulos/${module.id}/editar`} className="btn-neutral btn-sm">
                    Editar módulo
                  </Link>
                  <Link to={`/admin/modulos/${module.id}/conteudo`} className="btn-neutral btn-sm">
                    Conteúdo
                  </Link>
                  <Link to={`/admin/modulos/${module.id}/quiz`} className="btn-neutral btn-sm">
                    Quiz
                  </Link>
                  <button
                    type="button"
                    onClick={() => void deletarModulo(module.id)}
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

export default TrailModulesPage;
