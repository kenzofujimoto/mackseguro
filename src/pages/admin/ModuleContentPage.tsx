import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseConfig.ts";

type ModuleContent = {
  id: string;
  module_id: string;
  video_url: string | null;
  texto: string | null;
};

function normalizeVideoUrl(url: string): string {
  const value = url.trim();

  if (!value) return "";

  if (value.includes("youtube.com/embed/")) {
    return value;
  }

  const watchMatch = value.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortMatch = value.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  return value;
}

export default function ModuleContentPage() {
  const { id } = useParams();

  const [contentId, setContentId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [texto, setTexto] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarConteudo() {
    setLoading(true);
    setErro("");
    setMensagem("");

    if (!supabase) {
      setErro("Supabase não configurado.");
      setLoading(false);
      return;
    }

    if (!id) {
      setErro("ID do módulo não informado.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("module_contents")
      .select("*")
      .eq("module_id", id)
      .maybeSingle();

    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      const content = data as ModuleContent;

      setContentId(content.id);
      setVideoUrl(content.video_url || "");
      setTexto(content.texto || "");
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarConteudo();
  }, [id]);

  async function salvarConteudo(e: FormEvent) {
    e.preventDefault();

    setSaving(true);
    setErro("");
    setMensagem("");

    if (!supabase) {
      setErro("Supabase não configurado.");
      setSaving(false);
      return;
    }

    if (!id) {
      setErro("ID do módulo não informado.");
      setSaving(false);
      return;
    }

    if (!videoUrl.trim() && !texto.trim()) {
      setErro("Informe pelo menos uma URL de vídeo ou um texto teórico.");
      setSaving(false);
      return;
    }

    if (contentId) {
      const { error } = await supabase
        .from("module_contents")
        .update({
          video_url: normalizeVideoUrl(videoUrl),
          texto: texto.trim(),
        })
        .eq("id", contentId);

      setSaving(false);

      if (error) {
        setErro(error.message);
        return;
      }

      setMensagem("Conteúdo atualizado com sucesso.");
      return;
    }

    const { data, error } = await supabase
      .from("module_contents")
      .insert({
        module_id: id,
        video_url: videoUrl.trim(),
        texto: texto.trim(),
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setContentId(data.id);
    setMensagem("Conteúdo criado com sucesso.");
  }

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Carregando conteúdo...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <Link to="/admin/trilhas">← Voltar para Trilhas</Link>

      <h1>Conteúdo do Módulo</h1>

      {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <form
        onSubmit={salvarConteudo}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 700,
          marginTop: 24,
        }}
      >
        <input
          placeholder="URL do vídeo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <textarea
          placeholder="Texto teórico do módulo"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={12}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar conteúdo"}
        </button>
      </form>
    </div>
  );
}