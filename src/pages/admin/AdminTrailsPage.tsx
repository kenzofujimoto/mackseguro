import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseConfig.ts";

type Trail = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  published: boolean;
  created_at?: string;
};

export function AdminTrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarTrilhas() {
    setLoading(true);
    setErro("");

    if (!supabase) {
      setErro("Supabase não configurado.");
      setTrails([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("trails")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErro(error.message);
      setTrails([]);
      setLoading(false);
      return;
    }

    setTrails(data || []);
    setLoading(false);
  }

  async function deletarTrilha(id: string) {
    const confirmar = confirm("Deseja deletar esta trilha?");

    if (!confirmar) return;

    if (!supabase) {
      setErro("Supabase não configurado.");
      return;
    }

    const { error } = await supabase.from("trails").delete().eq("id", id);

    if (error) {
      setErro(error.message);
      return;
    }

    carregarTrilhas();
  }

  useEffect(() => {
    carregarTrilhas();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Carregando trilhas...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <Link to="/">← Voltar para o site</Link>

      <h1>Admin — Trilhas</h1>

      {erro && (
        <div
          style={{
            marginTop: 16,
            marginBottom: 16,
            padding: 12,
            border: "1px solid #fecaca",
            borderRadius: 8,
            background: "#fef2f2",
            color: "#991b1b",
          }}
        >
          {erro}
        </div>
      )}

      <Link to="/admin/trilhas/nova">
        <button>+ Nova trilha</button>
      </Link>

      <div style={{ marginTop: 24 }}>
        {trails.length === 0 && <p>Nenhuma trilha cadastrada.</p>}

        {trails.map((trail) => (
          <div
            key={trail.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <h2>{trail.title}</h2>

            <p>{trail.short_description}</p>

            <p>
              <strong>Slug:</strong> {trail.slug}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {trail.published ? "Publicado" : "Oculto"}
            </p>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              <Link to={`/admin/trilhas/${trail.id}/editar`}>
                <button>Editar trilha</button>
              </Link>

              <Link to={`/admin/trilhas/${trail.id}/modulos`}>
                <button>Módulos</button>
              </Link>

              <button
                onClick={() => deletarTrilha(trail.id)}
                style={{
                  background: "red",
                  color: "white",
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTrailsPage;