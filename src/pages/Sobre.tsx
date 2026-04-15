import Seo from "../components/seo/Seo.tsx";

export default function Sobre() {
  return (
    <>
      <Seo
        title="Sobre o Projeto"
        description="Conheça a missão, atuação e equipe do MackSeguro, projeto extensionista do Instituto Presbiteriano Mackenzie."
        canonicalPath="/sobre"
      />

      <section className="bg-[var(--color-bg-surface)] px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Sobre o Projeto
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Conheça o MackSeguro e nossa missão
          </p>

          <div className="mt-8 space-y-6">
            <div className="card-mk p-6">
              <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">
                Nossa Missão
              </h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Promover a conscientização em segurança digital e saúde online para
                diferentes públicos, por meio de trilhas educativas, materiais
                gratuitos e eventos presenciais e online. Acreditamos que a educação
                é a melhor ferramenta de proteção no mundo digital.
              </p>
            </div>

            <div className="card-mk p-6">
              <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">
                O que fazemos
              </h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                O MackSeguro oferece trilhas de aprendizado interativas com vídeos, questionários
                e fórum de discussão, além de materiais para download e eventos presenciais. O conteúdo
                é pensado para todos os públicos — idosos, jovens, trabalhadores e educadores — e
                aborda desde senhas seguras até saúde digital e prevenção de golpes.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Como projeto extensionista, levamos o conhecimento acadêmico da universidade
                para a comunidade, gerando impacto social concreto na área de segurança da informação.
                Todos os materiais são gratuitos e atualizados para acompanhar as novas ameaças.
              </p>
            </div>

            <div className="card-mk p-6">
              <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">
                Equipe
              </h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Este projeto é desenvolvido por estudantes e professores do
                Instituto Presbiteriano Mackenzie como parte das Atividades de
                Extensão curricular, unindo conhecimento acadêmico e impacto social
                na área de segurança da informação.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
