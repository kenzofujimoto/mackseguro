import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getSupabaseErrorMessage,
  getUnknownErrorMessage,
  requireSupabaseClient,
} from "../../lib/adminSupabase.ts";

export function CreateTrailPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function criarTrilha(event: FormEvent) {
    event.preventDefault();
    setErro("");

    const normalizedTitle = title.trim();
    const normalizedSlug = slug.trim();

    if (!normalizedTitle) {
      setErro("Informe o título da trilha.");
      return;
    }

    if (!normalizedSlug) {
      setErro("Informe o slug da trilha.");
      return;
    }

    setLoading(true);

    try {
      const supabase = await requireSupabaseClient();
      const { error } = await supabase.from("trails").insert({
        title: normalizedTitle,
        slug: normalizedSlug,
        short_description: shortDescription.trim(),
        published: true,
      });

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        return;
      }

      navigate("/admin/trilhas");
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[var(--color-bg-surface)] px-4 py-14">
      <div className="mx-auto max-w-2xl">
        <Link to="/admin/trilhas" className="text-sm font-medium text-[var(--color-mack)] hover:underline">
          Voltar para trilhas
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-[var(--color-text)]">
          Criar nova trilha
        </h1>

        {erro && (
          <p role="alert" className="mt-5 rounded-md border border-[var(--color-rose)]/30 bg-[var(--color-rose-light)] px-3 py-2 text-sm text-[var(--color-rose)]">
            {erro}
          </p>
        )}

        <form onSubmit={criarTrilha} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Título
            <input
              className="field-control mt-1"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Slug
            <input
              className="field-control mt-1"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Descrição curta
            <textarea
              className="field-control mt-1"
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
            />
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Salvando..." : "Criar trilha"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateTrailPage;
