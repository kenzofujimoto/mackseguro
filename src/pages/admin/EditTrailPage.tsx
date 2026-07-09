import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getSupabaseErrorMessage,
  getUnknownErrorMessage,
  requireSupabaseClient,
} from "../../lib/adminSupabase.ts";

type TrailRecord = {
  title: string | null;
  slug: string | null;
  short_description: string | null;
  description: string | null;
  icon: string | null;
  theme_color: string | null;
  published: boolean | null;
};

export function EditTrailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [themeColor, setThemeColor] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    async function carregarTrilha() {
      setLoading(true);
      setErro("");

      if (!id) {
        setErro("ID da trilha não informado.");
        setLoading(false);
        return;
      }

      try {
        const supabase = await requireSupabaseClient();
        const { data, error } = await supabase
          .from("trails")
          .select("title, slug, short_description, description, icon, theme_color, published")
          .eq("id", Number(id))
          .single();

        if (error) {
          setErro(getSupabaseErrorMessage(error));
          return;
        }

        const trail = data as TrailRecord;
        setTitle(trail.title ?? "");
        setSlug(trail.slug ?? "");
        setShortDescription(trail.short_description ?? "");
        setDescription(trail.description ?? "");
        setIcon(trail.icon ?? "");
        setThemeColor(trail.theme_color ?? "");
        setPublished(trail.published ?? true);
      } catch (error) {
        setErro(getUnknownErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    void carregarTrilha();
  }, [id]);

  async function salvar(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setValidationError("");

    const normalizedTitle = title.trim();
    const normalizedSlug = slug.trim();

    if (!normalizedTitle) {
      setValidationError("Título obrigatório.");
      return;
    }

    if (!normalizedSlug) {
      setValidationError("Slug obrigatório.");
      return;
    }

    if (!id) {
      setErro("ID da trilha não informado.");
      return;
    }

    setSaving(true);

    try {
      const supabase = await requireSupabaseClient();
      const { data: existingSlug, error: slugError } = await supabase
        .from("trails")
        .select("id")
        .eq("slug", normalizedSlug)
        .neq("id", Number(id))
        .maybeSingle();

      if (slugError) {
        setErro(getSupabaseErrorMessage(slugError));
        return;
      }

      if (existingSlug) {
        setValidationError("Esse slug já existe.");
        return;
      }

      const { error } = await supabase
        .from("trails")
        .update({
          title: normalizedTitle,
          slug: normalizedSlug,
          short_description: shortDescription.trim(),
          description: description.trim(),
          icon: icon.trim(),
          theme_color: themeColor.trim(),
          published,
        })
        .eq("id", Number(id));

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        return;
      }

      navigate("/admin/trilhas");
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
            Carregando trilha...
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
          Editar trilha
        </h1>

        {(erro || validationError) && (
          <p role="alert" className="mt-5 rounded-md border border-[var(--color-rose)]/30 bg-[var(--color-rose-light)] px-3 py-2 text-sm text-[var(--color-rose)]">
            {erro || validationError}
          </p>
        )}

        <form onSubmit={salvar} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Título
            <input className="field-control mt-1" value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Slug
            <input className="field-control mt-1" value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Descrição curta
            <textarea className="field-control mt-1" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Descrição completa
            <textarea className="field-control mt-1" rows={6} value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Ícone
            <input className="field-control mt-1" value={icon} onChange={(event) => setIcon(event.target.value)} placeholder="ShieldCheck" />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Cor do tema
            <input className="field-control mt-1" value={themeColor} onChange={(event) => setThemeColor(event.target.value)} placeholder="red" />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="h-4 w-4 accent-[var(--color-mack)]"
            />
            Publicado
          </label>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default EditTrailPage;
