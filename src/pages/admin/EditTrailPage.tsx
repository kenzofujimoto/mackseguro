import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseConfig.ts";

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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function carregarTrilha() {
      if (!supabase) {
        setErro("Supabase não configurado.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("trails")
        .select(
          "title, slug, short_description, description, icon, theme_color, published"
        )
        .eq("id", id)
        .single();

      if (error) {
        setErro(error.message);
      } else {
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setShortDescription(data.short_description || "");
        setDescription(data.description || "");
        setIcon(data.icon || "");
        setThemeColor(data.theme_color || "");
        setPublished(data.published ?? true);
      }

      setLoading(false);
    }

    carregarTrilha();
  }, [id]);

  async function salvar(e: FormEvent) {
    e.preventDefault();

    setErro("");
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Título obrigatório.");
      return;
    }

    if (!slug.trim()) {
      setErrorMessage("Slug obrigatório.");
      return;
    }

    setSaving(true);

    if (!supabase) {
        setErro("Supabase não configurado.");
        setSaving(false);
        return;
    }

    const { data: existingSlug, error: slugError } = await supabase
      .from("trails")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (slugError) {
      setSaving(false);
      setErro(slugError.message);
      return;
    }

    if (existingSlug) {
      setSaving(false);
      setErrorMessage("Esse slug já existe.");
      return;
    }

    const { error } = await supabase
      .from("trails")
      .update({
        title,
        slug,
        short_description: shortDescription,
        description,
        icon,
        theme_color: themeColor,
        published,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setErro(error.message);
      return;
    }

    navigate("/admin/trilhas");
  }

  if (loading) return <h1>Carregando trilha...</h1>;

  return (
    <div style={{ padding: 40 }}>
      <Link to="/admin/trilhas">Voltar</Link>

      <h1>Editar Trilha</h1>

      <form
        onSubmit={salvar}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 500,
        }}
      >
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <textarea
          placeholder="Descrição curta"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />

        <div>
          <p>Descrição completa</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <p>Ícone</p>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="🚀"
          />
        </div>

        <div>
          <p>Cor do tema</p>
          <input
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            placeholder="#7c3aed"
          />
        </div>

        <label>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publicado
        </label>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}