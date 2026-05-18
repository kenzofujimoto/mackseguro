import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseConfig.ts";

export function CreateTrailPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function criarTrilha(e: FormEvent) {
    e.preventDefault();

    setErro("");

    if (!title.trim()) {
      setErro("Informe o título da trilha.");
      return;
    }

    if (!slug.trim()) {
      setErro("Informe o slug da trilha.");
      return;
    }

    if (!supabase) {
      setErro("Supabase não configurado.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("trails")
      .insert({
        title,
        slug,
        short_description: shortDescription,
        published: true,
      });

    setLoading(false);

    if (error) {
      setErro(error.message);
      return;
    }

    navigate("/admin/trilhas");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Criar Nova Trilha</h1>

      <form
        onSubmit={criarTrilha}
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

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Criar trilha"}
        </button>

        {erro && (
          <p style={{ color: "red" }}>
            {erro}
          </p>
        )}
      </form>
    </div>
  );
}