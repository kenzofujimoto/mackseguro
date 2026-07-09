import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getSupabaseErrorMessage,
  getUnknownErrorMessage,
  requireSupabaseClient,
} from "../../lib/adminSupabase.ts";

type ModuleRecord = {
  title: string | null;
  description: string | null;
  xp: number | null;
  duration_minutes: number | null;
  position: number | null;
};

export function EditModulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xp, setXp] = useState(100);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [position, setPosition] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarModulo() {
      setLoading(true);
      setErro("");

      if (!id) {
        setErro("ID do módulo não informado.");
        setLoading(false);
        return;
      }

      try {
        const supabase = await requireSupabaseClient();
        const { data, error } = await supabase
          .from("modules")
          .select("title, description, xp, duration_minutes, position")
          .eq("id", Number(id))
          .single();

        if (error) {
          setErro(getSupabaseErrorMessage(error));
          return;
        }

        const module = data as ModuleRecord;
        setTitle(module.title ?? "");
        setDescription(module.description ?? "");
        setXp(module.xp ?? 0);
        setDurationMinutes(module.duration_minutes ?? 0);
        setPosition(module.position ?? 1);
      } catch (error) {
        setErro(getUnknownErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    void carregarModulo();
  }, [id]);

  async function salvar(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErro("");

    if (!id) {
      setErro("ID do módulo não informado.");
      setSaving(false);
      return;
    }

    try {
      const supabase = await requireSupabaseClient();
      const { error } = await supabase
        .from("modules")
        .update({
          title: title.trim(),
          description: description.trim(),
          xp,
          duration_minutes: durationMinutes,
          position,
        })
        .eq("id", Number(id));

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        return;
      }

      navigate(-1);
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Carregando módulo...
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg-surface)] px-4 py-14">
      <div className="mx-auto max-w-2xl">
        <Link to="/admin/trilhas" className="text-sm font-medium text-[var(--color-mack)] hover:underline">
          Voltar
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-[var(--color-text)]">
          Editar módulo
        </h1>

        {erro && (
          <p role="alert" className="mt-5 rounded-md border border-[var(--color-rose)]/30 bg-[var(--color-rose-light)] px-3 py-2 text-sm text-[var(--color-rose)]">
            {erro}
          </p>
        )}

        <form onSubmit={salvar} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Título
            <input className="field-control mt-1" value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Descrição
            <textarea className="field-control mt-1" value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              XP
              <input className="field-control mt-1" type="number" value={xp} onChange={(event) => setXp(Number(event.target.value))} />
            </label>

            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Duração
              <input className="field-control mt-1" type="number" value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} />
            </label>

            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Ordem
              <input className="field-control mt-1" type="number" value={position} onChange={(event) => setPosition(Number(event.target.value))} />
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Salvando..." : "Salvar módulo"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default EditModulePage;
