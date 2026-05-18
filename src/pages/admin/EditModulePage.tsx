import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseConfig.ts";

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
        if (!supabase) {
            setErro("Supabase não configurado.");
            setLoading(false);
            return;
        }
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setErro(error.message);
      } else {
        setTitle(data.title || "");
        setDescription(data.description || "");

        setXp(data.xp || 0);
        setDurationMinutes(data.duration_minutes || 0);
        setPosition(data.position || 1);
      }

      setLoading(false);
    }

    carregarModulo();
  }, [id]);

  async function salvar(e: FormEvent) {
    e.preventDefault();

    setSaving(true);
    setErro("");

    if (!supabase) {
        setErro("Supabase não configurado.");
        setSaving(false);
        return;
    }

    const { error } = await supabase
      .from("modules")
      .update({
        title,
        description,
        xp,
        duration_minutes: durationMinutes,
        position,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setErro(error.message);
      return;
    }

    navigate(-1);
  }

  if (loading) {
    return <h1>Carregando módulo...</h1>;
  }

  return (
    <div style={{ padding: 40 }}>
      <Link to="/admin/trilhas">
        Voltar
      </Link>

      <h1>Editar Módulo</h1>

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

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="XP"
          value={xp}
          onChange={(e) => setXp(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Duração"
          value={durationMinutes}
          onChange={(e) =>
            setDurationMinutes(Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Ordem"
          value={position}
          onChange={(e) =>
            setPosition(Number(e.target.value))
          }
        />

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar módulo"}
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