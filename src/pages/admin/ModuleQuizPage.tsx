import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
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

type QuizQuestion = {
  id: number;
  question: string;
  position: number;
  quiz_options: QuizOption[];
};

const optionLabels = ["A", "B", "C", "D"] as const;

export default function ModuleQuizPage() {
  const { id } = useParams();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState<(typeof optionLabels)[number]>("A");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarQuiz() {
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
        .from("quiz_questions")
        .select(`
          id,
          question,
          position,
          quiz_options (
            id,
            option_text,
            is_correct,
            position
          )
        `)
        .eq("module_id", Number(id))
        .order("position", { ascending: true });

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        setQuestions([]);
        return;
      }

      setQuestions(((data as QuizQuestion[]) ?? []).map((item) => ({
        ...item,
        quiz_options: [...item.quiz_options].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0),
        ),
      })));
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarQuiz();
  }, [id]);

  async function criarPergunta(event: FormEvent) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (!id) {
      setErro("ID do módulo não informado.");
      return;
    }

    if (!question.trim()) {
      setErro("Digite a pergunta.");
      return;
    }

    const options = [
      { label: "A", text: optionA },
      { label: "B", text: optionB },
      { label: "C", text: optionC },
      { label: "D", text: optionD },
    ];
    const filledOptions = options.filter((option) => option.text.trim());

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
      const { data: questionData, error: questionError } = await supabase
        .from("quiz_questions")
        .insert({
          module_id: Number(id),
          question: question.trim(),
          position: questions.length + 1,
        })
        .select()
        .single();

      if (questionError) {
        setErro(getSupabaseErrorMessage(questionError));
        return;
      }

      const optionsToInsert = filledOptions.map((option, index) => ({
        question_id: (questionData as { id: number }).id,
        option_text: option.text.trim(),
        is_correct: option.label === correctOption,
        position: index + 1,
      }));

      const { error: optionsError } = await supabase.from("quiz_options").insert(optionsToInsert);

      if (optionsError) {
        setErro(getSupabaseErrorMessage(optionsError));
        return;
      }

      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectOption("A");
      setMensagem("Pergunta criada com sucesso.");
      await carregarQuiz();
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function deletarPergunta(questionId: number) {
    const confirmar = confirm("Deseja deletar esta pergunta?");

    if (!confirmar) {
      return;
    }

    setErro("");
    setMensagem("");

    try {
      const supabase = await requireSupabaseClient();
      const { error } = await supabase.from("quiz_questions").delete().eq("id", questionId);

      if (error) {
        setErro(getSupabaseErrorMessage(error));
        return;
      }

      setMensagem("Pergunta deletada com sucesso.");
      await carregarQuiz();
    } catch (error) {
      setErro(getUnknownErrorMessage(error));
    }
  }

  if (loading) {
    return (
      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Carregando quiz...
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
          Quiz do módulo
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

        <form onSubmit={criarPergunta} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Pergunta
            <textarea className="field-control mt-1" value={question} onChange={(event) => setQuestion(event.target.value)} rows={3} />
          </label>

          {[optionA, optionB, optionC, optionD].map((value, index) => {
            const label = optionLabels[index];
            const setters = [setOptionA, setOptionB, setOptionC, setOptionD];

            return (
              <label key={label} className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Alternativa {label}
                <input className="field-control mt-1" value={value} onChange={(event) => setters[index](event.target.value)} />
              </label>
            );
          })}

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
            {saving ? "Salvando..." : "Criar pergunta"}
          </button>
        </form>

        <h2 className="mt-10 text-xl font-bold text-[var(--color-text)]">
          Perguntas cadastradas
        </h2>

        <div className="mt-4 space-y-4">
          {questions.length === 0 && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Nenhuma pergunta cadastrada.
            </p>
          )}

          {questions.map((item) => (
            <article key={item.id} className="card-mk p-5">
              <h3 className="text-lg font-bold text-[var(--color-text)]">
                {item.question}
              </h3>

              <ul className="mt-3 space-y-1 text-sm text-[var(--color-text-secondary)]">
                {item.quiz_options.map((option) => (
                  <li key={option.id}>
                    {option.option_text}
                    {option.is_correct ? " (correta)" : ""}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/admin/quiz/${item.id}/editar`} className="btn-neutral btn-sm">
                  Editar pergunta
                </Link>

                <button
                  type="button"
                  onClick={() => void deletarPergunta(item.id)}
                  className="btn-outline btn-sm border-[var(--color-rose)] text-[var(--color-rose)]"
                >
                  Deletar pergunta
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
