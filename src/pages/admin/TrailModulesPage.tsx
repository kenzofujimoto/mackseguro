import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseConfig.ts";

type Module = {
  id: string;
  title: string;
  description: string | null;
  xp: number;
  duration_minutes: number;
  position: number;
};

export function TrailModulesPage() {
  const { id } = useParams();

  const [modules, setModules] = useState<Module[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [erro, setErro] = useState("");

  async function carregarModulos() {
    setErro("");

    if (!supabase) {
      setErro("Supabase não configurado.");
      setModules([]);
      setLoading(false);
      return;
    }

    if (!id) {
      setErro("ID da trilha não informado.");
      setModules([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("trail_id", id)
      .order("position", { ascending: true });

    if (error) {
      setErro(error.message);
      setModules([]);
      setLoading(false);
      return;
    }

    setModules(data || []);
    setLoading(false);
  }

  useEffect(() => {
    carregarModulos();
  }, [id]);

  async function criarModulo(e: FormEvent) {
    e.preventDefault();

    setErro("");

    if (!title.trim()) {
      setErro("Informe o título do módulo.");
      return;
    }

    if (!supabase) {
      setErro("Supabase não configurado.");
      return;
    }

    if (!id) {
      setErro("ID da trilha não informado.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("modules")
      .insert({
        trail_id: id,
        title: title.trim(),
        description: description.trim(),
        position: modules.length + 1,
        xp: 100,
        duration_minutes: 10,
      });

    setSaving(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setTitle("");
    setDescription("");

    carregarModulos();
  }

  async function deletarModulo(moduleId: string) {
    const confirmar = confirm("Deseja deletar este módulo?");

    if (!confirmar) return;

    setErro("");

    if (!supabase) {
      setErro("Supabase não configurado.");
      return;
    }

    const { error } = await supabase
      .from("modules")
      .delete()
      .eq("id", moduleId);

    if (error) {
      setErro(error.message);
      return;
    }

    carregarModulos();
  }

  if (loading) {
    return <h1>Carregando módulos...</h1>;
  }

  return (
    <div style={{ padding: 40 }}>
      <Link to="/admin/trilhas">Voltar para Trilhas</Link>

      <h1>Módulos da Trilha</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <form
        onSubmit={criarModulo}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 400,
          marginBottom: 40,
        }}
      >
        <input
          placeholder="Título do módulo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Criando..." : "Criar módulo"}
        </button>
      </form>

      {modules.length === 0 && <p>Nenhum módulo cadastrado.</p>}

      {modules.map((module) => (
        <div
          key={module.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <h2>{module.title}</h2>

          <p>{module.description}</p>

          <p>XP: {module.xp}</p>

          <p>Duração: {module.duration_minutes} min</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link to={`/admin/modulos/${module.id}/editar`}>
              <button>Editar módulo</button>
            </Link>

            <Link to={`/admin/modulos/${module.id}/conteudo`}>
              <button>Editar conteúdo</button>
            </Link>

            <Link to={`/admin/modulos/${module.id}/quiz`}>
              <button>Quiz</button>
            </Link>

            <button
              onClick={() => deletarModulo(module.id)}
              style={{
                background: "red",
                color: "white",
              }}
            >
              Deletar módulo
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrailModulesPage;