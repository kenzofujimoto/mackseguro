import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ModuloConteudo from "./ModuloConteudo.tsx";

const clerkState = vi.hoisted<{
  isLoaded: boolean;
  isSignedIn: boolean;
  user: {
    id: string;
    fullName: string;
    username: string;
    primaryEmailAddress: {
      emailAddress: string;
    };
  } | null;
}>(() => ({
  isLoaded: true,
  isSignedIn: true,
  user: {
    id: "user_test",
    fullName: "Aluno Teste",
    username: "aluno.teste",
    primaryEmailAddress: {
      emailAddress: "aluno.teste@mackseguro.local",
    },
  },
}));

vi.mock("@clerk/react", () => ({
  useUser: () => clerkState,
  SignInButton: ({ children }: { children: unknown }) => <>{children}</>,
}));

function setAuthSignedIn() {
  clerkState.isLoaded = true;
  clerkState.isSignedIn = true;
  clerkState.user = {
    id: "user_test",
    fullName: "Aluno Teste",
    username: "aluno.teste",
    primaryEmailAddress: {
      emailAddress: "aluno.teste@mackseguro.local",
    },
  };
}

function setAuthSignedOut() {
  clerkState.isLoaded = true;
  clerkState.isSignedIn = false;
  clerkState.user = null;
}

function renderModulo() {
  return render(
    <MemoryRouter initialEntries={["/trilhas/seguranca-digital/modulo/1"]}>
      <Routes>
        <Route path="/trilhas/:slug/modulo/:moduloId" element={<ModuloConteudo />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ModuloConteudo", () => {
  beforeEach(() => {
    setAuthSignedIn();
  });

  it("exibe player de video funcional no modulo", () => {
    renderModulo();

    expect(screen.getByTitle(/video do modulo/i)).toBeInTheDocument();
  });

  it("publica uma nova mensagem no forum", async () => {
    renderModulo();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText(/faça uma pergunta ou compartilhe uma dúvida/i),
      "Conteudo util para evitar golpes.",
    );
    await user.click(screen.getByRole("button", { name: /publicar/i }));

    expect(await screen.findByText(/conteudo util para evitar golpes/i)).toBeInTheDocument();
  });

  it("exige autenticação para escrever comentários", () => {
    setAuthSignedOut();
    renderModulo();

    expect(screen.getByText(/entre com sua conta para comentar/i)).toBeInTheDocument();
  });

  it("permite responder, curtir e denunciar comentários", async () => {
    // Adiciona um comentário primeiro para poder interagir
    localStorage.setItem(
      "mackseguro:user-data",
      JSON.stringify({
        moduleProgress: {},
        forumPosts: {},
        forumComments: {
          "seguranca-digital:1": [
            {
              id: "comment-123",
              parentId: null,
              authorId: "user_test",
              authorName: "Aluno Teste",
              authorInitials: "AT",
              createdAt: new Date().toISOString(),
              content: "Comentário inicial para teste",
              likeUserIds: [],
              reports: [],
              legacyReplyCount: 0,
            }
          ]
        }
      })
    );

    renderModulo();
    const user = userEvent.setup();

    await user.click((await screen.findAllByRole("button", { name: /responder/i }))[0]);
    await user.type(screen.getByPlaceholderText(/escreva sua resposta/i), "Resposta de teste para o comentário.");
    await user.click(screen.getByRole("button", { name: /enviar resposta/i }));

    expect(await screen.findByText(/resposta de teste para o comentário/i)).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /curtir/i })[0]);
    await user.click(screen.getAllByRole("button", { name: /denunciar/i })[0]);
    await user.selectOptions(screen.getByLabelText(/motivo da denúncia/i), "spam");
    await user.click(screen.getByRole("button", { name: /confirmar denúncia/i }));

    expect(await screen.findByText(/comentário denunciado para moderação/i)).toBeInTheDocument();
  }, 10000);
});
