import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getSupabaseErrorMessage,
  getUnknownErrorMessage,
  requireSupabaseClient,
} from "../../lib/adminSupabase.ts";

type ModuleContent = {
  id: number;
  module_id: number;
  video_url: string | null;
  texto: string | null;
};

function normalizeVideoUrl(url: string): string {
  const value = url.trim();

  if (!value || value.includes("youtube.com/embed/")) {
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

  const [contentId, setContentId] = useState<number | null>(null);
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

    if (!id) {
      setErro("ID do módulo não informado.");
      setLoading(false);
      return;
    }

    try {
      const supabase = await requireSupabaseClient();
      const { data, error } = await supabase
        .from("module_contents")
        .select("*")
        .eq("module_id", Number(id))
        .maybeSingle();

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        return;
      }

      if (data) {
        const content = data as ModuleContent;
        setContentId(content.id);
        setVideoUrl(content.video_url ?? "");
        setTexto(content.texto ?? "");
      }
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarConteudo();
  }, [id]);

  async function salvarConteudo(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErro("");
    setMensagem("");

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

    try {
      const supabase = await requireSupabaseClient();
      const payload = {
        module_id: Number(id),
        video_url: normalizeVideoUrl(videoUrl),
        texto: texto.trim(),
      };

      if (contentId) {
        const { error } = await supabase
          .from("module_contents")
          .update(payload)
          .eq("id", contentId);

        if (error) {
          setErro(getSupabaseErrorMessage(error));
          return;
        }

        setMensagem("Conteúdo atualizado com sucesso.");
        return;
      }

      const { data, error } = await supabase
        .from("module_contents")
        .insert(payload)
        .select()
        .single();

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        return;
      }

      setContentId((data as ModuleContent).id);
      setMensagem("Conteúdo criado com sucesso.");
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Carregando conteúdo...
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg-surface)] px-4 py-14">
      <div className="mx-auto max-w-3xl">
        <Link to="/admin/trilhas" className="text-sm font-medium text-[var(--color-mack)] hover:underline">
          Voltar para trilhas
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-[var(--color-text)]">
          Conteúdo do módulo
        </h1>

        {mensagem && (
          <p className="mt-5 rounded-md border border-[var(--color-emerald)]/30 bg-[var(--color-emerald-light)] px-3 py-2 text-sm text-[var(--color-emerald)]">
            {mensagem}
          </p>
        )}

        {erro && (
          <p role="alert" className="mt-5 rounded-md border border-[var(--color-rose)]/30 bg-[var(--color-rose-light)] px-3 py-2 text-sm text-[var(--color-rose)]">
            {erro}
          </p>
        )}

        <form onSubmit={salvarConteudo} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            URL do vídeo
            <input className="field-control mt-1" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} />
          </label>

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Texto teórico do módulo
            <textarea className="field-control mt-1" value={texto} onChange={(event) => setTexto(event.target.value)} rows={12} />
          </label>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Salvando..." : "Salvar conteúdo"}
          </button>
        </form>
      </div>
    </section>
  );
}
