-- =========== 0. LIMPEZA (OPCIONAL) ===========
-- Atenção: Isso apaga as tabelas caso já existam com um esquema antigo/incompleto.
-- Como estamos preparando para produção e o schema precisava da coluna user_id, 
-- é mais seguro recriá-las do zero.
DROP TABLE IF EXISTS forum_comment_likes CASCADE;
DROP TABLE IF EXISTS forum_comment_reports CASCADE;
DROP TABLE IF EXISTS forum_comments CASCADE;
DROP TABLE IF EXISTS module_progress CASCADE;

-- =========== 1. CRIAÇÃO DAS TABELAS ===========

-- 1. Cria a tabela de comentários do fórum
CREATE TABLE IF NOT EXISTS forum_comments (
  comment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id text NOT NULL,
  trail_slug text NOT NULL,
  user_id text NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Cria a tabela de curtidas nos comentários
CREATE TABLE IF NOT EXISTS forum_comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES forum_comments(comment_id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- 3. Cria a tabela de denúncias (Reports) de comentários
CREATE TABLE IF NOT EXISTS forum_comment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES forum_comments(comment_id) ON DELETE CASCADE,
  user_id text NOT NULL,
  reason text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- 4. Cria a tabela de progresso dos módulos
CREATE TABLE IF NOT EXISTS module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  trail_slug text NOT NULL,
  module_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  quiz_score integer DEFAULT 0,
  quiz_total integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, trail_slug, module_id)
);


-- =========== 2. HABILITAR ROW LEVEL SECURITY (RLS) ===========

ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comment_reports ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para validar o token JWT gerado pelo Clerk
-- O Clerk envia o sub (user_id) no token e nós o acessamos usando auth.jwt()
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;

-- Políticas para forum_comments
-- Leitura: Todos os usuários autenticados podem ler os comentários
CREATE POLICY "Leitura autenticada para comentários"
ON forum_comments FOR SELECT
USING (auth.role() = 'authenticated');

-- Inserção: O usuário só pode inserir um comentário no nome dele
CREATE POLICY "Inserção para o próprio usuário"
ON forum_comments FOR INSERT
WITH CHECK (requesting_user_id() = user_id);

-- Atualização/Exclusão: O usuário só pode alterar/excluir o próprio comentário
CREATE POLICY "Atualização/Exclusão do próprio comentário"
ON forum_comments FOR ALL
USING (requesting_user_id() = user_id);


-- Políticas para forum_comment_likes
CREATE POLICY "Leitura de curtidas para todos autenticados"
ON forum_comment_likes FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Gerenciar (Insert/Delete) as próprias curtidas"
ON forum_comment_likes FOR ALL
USING (requesting_user_id() = user_id);


-- Políticas para forum_comment_reports
CREATE POLICY "Usuário pode visualizar suas próprias denúncias"
ON forum_comment_reports FOR SELECT
USING (requesting_user_id() = user_id);

CREATE POLICY "Usuário pode inserir suas denúncias"
ON forum_comment_reports FOR INSERT
WITH CHECK (requesting_user_id() = user_id);


-- Políticas para module_progress
CREATE POLICY "Usuário pode visualizar próprio progresso"
ON module_progress FOR SELECT
USING (requesting_user_id() = user_id);

CREATE POLICY "Usuário pode atualizar/inserir próprio progresso"
ON module_progress FOR ALL
USING (requesting_user_id() = user_id);
