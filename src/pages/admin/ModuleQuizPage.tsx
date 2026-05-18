import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseConfig.ts";

type QuizQuestion = {
  id: string;
  question: string;
  position: number;
  quiz_options: {
    id: string;
    option_text: string;
    is_correct: boolean;
  }[];
};

export default function ModuleQuizPage() {
  const { id } = useParams();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [question, setQuestion] = useState("");

  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");

  const [correctOption, setCorrectOption] = useState("A");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarQuiz() {
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
      .from("quiz_questions")
      .select(`
        id,
        question,
        position,
        quiz_options (
          id,
          option_text,
          is_correct
        )
      `)
      .eq("module_id", id)
      .order("position", { ascending: true });

    if (error) {
      setErro(error.message);
      setQuestions([]);
      setLoading(false);
      return;
    }

    setQuestions((data as QuizQuestion[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    carregarQuiz();
  }, [id]);

  async function criarPergunta(e: FormEvent) {
    e.preventDefault();

    setErro("");
    setMensagem("");

    if (!supabase) {
      setErro("Supabase não configurado.");
      return;
    }

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

    const correctFilled = filledOptions.some(
      (option) => option.label === correctOption,
    );

    if (!correctFilled) {
      setErro("A alternativa correta precisa estar preenchida.");
      return;
    }

    setSaving(true);

    const { data: questionData, error: questionError } = await supabase
      .from("quiz_questions")
      .insert({
        module_id: id,
        question: question.trim(),
        position: questions.length + 1,
      })
      .select()
      .single();

    if (questionError) {
      setErro(questionError.message);
      setSaving(false);
      return;
    }

    const optionsToInsert = filledOptions.map((option) => ({
      question_id: questionData.id,
      option_text: option.text.trim(),
      is_correct: option.label === correctOption,
    }));

    const { error: optionsError } = await supabase
      .from("quiz_options")
      .insert(optionsToInsert);

    setSaving(false);

    if (optionsError) {
      setErro(optionsError.message);
      return;
    }

    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectOption("A");

    setMensagem("Pergunta criada com sucesso.");

    carregarQuiz();
  }

  async function deletarPergunta(questionId: string) {
    const confirmar = confirm("Deseja deletar esta pergunta?");

    if (!confirmar) return;

    setErro("");
    setMensagem("");

    if (!supabase) {
      setErro("Supabase não configurado.");
      return;
    }

    const { error } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("id", questionId);

    if (error) {
      setErro(error.message);
      return;
    }

    setMensagem("Pergunta deletada com sucesso.");
    carregarQuiz();
  }

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Carregando quiz...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <Link to="/admin/trilhas">← Voltar para Trilhas</Link>

      <h1>Quiz do Módulo</h1>

      <form
        onSubmit={criarPergunta}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 700,
          marginBottom: 40,
          marginTop: 24,
        }}
      >
        <textarea
          placeholder="Pergunta"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
        />

        <input
          placeholder="Alternativa A"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
        />

        <input
          placeholder="Alternativa B"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
        />

        <input
          placeholder="Alternativa C"
          value={optionC}
          onChange={(e) => setOptionC(e.target.value)}
        />

        <input
          placeholder="Alternativa D"
          value={optionD}
          onChange={(e) => setOptionD(e.target.value)}
        />

        <label>
          Resposta correta:
          <select
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="A">Alternativa A</option>
            <option value="B">Alternativa B</option>
            <option value="C">Alternativa C</option>
            <option value="D">Alternativa D</option>
          </select>
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Criar pergunta"}
        </button>

        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>

      <h2>Perguntas cadastradas</h2>

      {questions.length === 0 && <p>Nenhuma pergunta cadastrada.</p>}

      {questions.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <h3>{item.question}</h3>

          <ul>
            {item.quiz_options.map((option) => (
              <li key={option.id}>
                {option.option_text}{" "}
                {option.is_correct && <strong>✅ correta</strong>}
              </li>
            ))}
          </ul>

          <Link to={`/admin/quiz/${item.id}/editar`}>
            <button>Editar pergunta</button>
          </Link>

          <button
            onClick={() => deletarPergunta(item.id)}
            style={{
              marginLeft: 8,
              background: "red",
              color: "white",
            }}
          >
            Deletar pergunta
          </button>
        </div>
      ))}
    </div>
  );
}