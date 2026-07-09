import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getSupabaseErrorMessage,
  getUnknownErrorMessage,
  requireSupabaseClient,
} from "../../lib/adminSupabase.ts";

type QuizOption = {
  id: number;
  option_text: string;
  is_correct: boolean;
  position: number | null;
};

type QuizQuestionRecord = {
  id: number;
  module_id: number;
  question: string;
  quiz_options: QuizOption[];
};

const optionLabels = ["A", "B", "C", "D"] as const;

export default function EditQuizQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [moduleId, setModuleId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState<(typeof optionLabels)[number]>("A");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPergunta() {
      setLoading(true);
      setErro("");

      if (!id) {
        setErro("ID da pergunta não informado.");
        setLoading(false);
        return;
      }

      try {
        const supabase = await requireSupabaseClient();
        const { data, error } = await supabase
          .from("quiz_questions")
          .select(`
            id,
            module_id,
            question,
            quiz_options (
              id,
              option_text,
              is_correct,
              position
            )
          `)
          .eq("id", Number(id))
          .single();

        if (error) {
          setErro(getSupabaseErrorMessage(error));
          return;
        }

        const record = data as QuizQuestionRecord;
        const orderedOptions = [...record.quiz_options].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0),
        );
        const nextOptions = ["", "", "", ""];

        orderedOptions.slice(0, optionLabels.length).forEach((option, index) => {
          nextOptions[index] = option.option_text;
          if (option.is_correct) {
            setCorrectOption(optionLabels[index]);
          }
        });

        setModuleId(record.module_id);
        setQuestion(record.question);
        setOptions(nextOptions);
      } catch (error) {
        setErro(getUnknownErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    void carregarPergunta();
  }, [id]);

  function updateOption(index: number, value: string) {
    setOptions((current) => current.map((option, optionIndex) =>
      optionIndex === index ? value : option,
    ));
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();
    setErro("");

    if (!id) {
      setErro("ID da pergunta não informado.");
      return;
    }

    if (!question.trim()) {
      setErro("Digite a pergunta.");
      return;
    }

    const filledOptions = options
      .map((option, index) => ({ label: optionLabels[index], text: option.trim(), index }))
      .filter((option) => option.text.length > 0);

    if (filledOptions.length < 2) {
      setErro("Cadastre pelo menos duas alternativas.");
      return;
    }

    if (!filledOptions.some((option) => option.label === correctOption)) {
      setErro("A alternativa correta precisa estar preenchida.");
      return;
    }

    setSaving(true);

    try {
      const supabase = await requireSupabaseClient();
      const { error: questionError } = await supabase
        .from("quiz_questions")
        .update({ question: question.trim() })
        .eq("id", Number(id));

      if (questionError) {
        setErro(getSupabaseErrorMessage(questionError));
        return;
      }

      const { error: deleteError } = await supabase
        .from("quiz_options")
        .delete()
        .eq("question_id", Number(id));

      if (deleteError) {
        setErro(getSupabaseErrorMessage(deleteError));
        return;
      }

      const { error: insertError } = await supabase.from("quiz_options").insert(
        filledOptions.map((option, index) => ({
          question_id: Number(id),
          option_text: option.text,
          is_correct: option.label === correctOption,
          position: index + 1,
        })),
      );

      if (insertError) {
        setErro(getSupabaseErrorMessage(insertError));
        return;
      }

      navigate(moduleId ? `/admin/modulos/${moduleId}/quiz` : "/admin/trilhas");
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
            Carregando pergunta...
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-bg-surface)] px-4 py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          to={moduleId ? `/admin/modulos/${moduleId}/quiz` : "/admin/trilhas"}
          className="text-sm font-medium text-[var(--color-mack)] hover:underline"
        >
          Voltar
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-[var(--color-text)]">
          Editar pergunta
        </h1>

        {erro && (
          <p role="alert" className="mt-5 rounded-md border border-[var(--color-rose)]/30 bg-[var(--color-rose-light)] px-3 py-2 text-sm text-[var(--color-rose)]">
            {erro}
          </p>
        )}

        <form onSubmit={salvar} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Pergunta
            <textarea className="field-control mt-1" value={question} onChange={(event) => setQuestion(event.target.value)} rows={3} />
          </label>

          {options.map((value, index) => (
            <label key={optionLabels[index]} className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Alternativa {optionLabels[index]}
              <input className="field-control mt-1" value={value} onChange={(event) => updateOption(index, event.target.value)} />
            </label>
          ))}

          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Resposta correta
            <select className="field-control mt-1" value={correctOption} onChange={(event) => setCorrectOption(event.target.value as (typeof optionLabels)[number])}>
              {optionLabels.map((label) => (
                <option key={label} value={label}>
                  Alternativa {label}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Salvando..." : "Salvar pergunta"}
          </button>
        </form>
      </div>
    </section>
  );
}
