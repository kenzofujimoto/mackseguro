-- =========== 0. LIMPEZA (OPCIONAL) ===========
-- Atenção: Isso apaga as tabelas caso já existam com um esquema antigo/incompleto.
-- Como estamos preparando para produção e o schema precisava da coluna user_id, 
-- é mais seguro recriá-las do zero.
DROP TABLE IF EXISTS forum_comment_likes CASCADE;
DROP TABLE IF EXISTS forum_comment_reports CASCADE;
DROP TABLE IF EXISTS forum_comments CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS trail_certificate_metadata CASCADE;
DROP TABLE IF EXISTS trail_module_requirements CASCADE;
DROP TABLE IF EXISTS module_progress CASCADE;

-- =========== 1. CRIAÇÃO DAS TABELAS ===========

-- 1. Cria a tabela de comentários do fórum
CREATE TABLE IF NOT EXISTS forum_comments (
  id text PRIMARY KEY,
  trail_slug text NOT NULL,
  module_id integer NOT NULL,
  parent_id text REFERENCES forum_comments(id) ON DELETE CASCADE,
  author_id text NOT NULL,
  author_name text NOT NULL,
  author_initials text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL,
  legacy_reply_count integer DEFAULT 0
);

-- 2. Cria a tabela de curtidas nos comentários
CREATE TABLE IF NOT EXISTS forum_comment_likes (
  comment_id text NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (comment_id, user_id)
);

-- 3. Cria a tabela de denúncias (Reports) de comentários
CREATE TABLE IF NOT EXISTS forum_comment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id text NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
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
  module_id integer NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  quiz_score integer DEFAULT 0,
  quiz_total integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, trail_slug, module_id)
);

-- 5. Cria a tabela de requisitos para emissão de certificados
CREATE TABLE IF NOT EXISTS trail_module_requirements (
  trail_slug text NOT NULL,
  module_id integer NOT NULL,
  PRIMARY KEY (trail_slug, module_id)
);

INSERT INTO trail_module_requirements (trail_slug, module_id)
VALUES
  ('seguranca-digital', 1),
  ('seguranca-digital', 2),
  ('seguranca-digital', 3),
  ('seguranca-digital', 4),
  ('seguranca-digital', 5),
  ('saude-digital', 1),
  ('saude-digital', 2),
  ('saude-digital', 3),
  ('saude-digital', 4)
ON CONFLICT DO NOTHING;

-- 6. Cria a tabela de metadados oficiais das trilhas certificáveis
CREATE TABLE IF NOT EXISTS trail_certificate_metadata (
  trail_slug text PRIMARY KEY,
  course_name text NOT NULL,
  total_hours text NOT NULL
);

INSERT INTO trail_certificate_metadata (trail_slug, course_name, total_hours)
VALUES
  ('seguranca-digital', 'Segurança Digital para Todos', '10 horas'),
  ('saude-digital', 'Saúde Digital e Bem-Estar', '10 horas')
ON CONFLICT (trail_slug) DO UPDATE
SET
  course_name = EXCLUDED.course_name,
  total_hours = EXCLUDED.total_hours;

-- 7. Cria a tabela de certificados emitidos
CREATE TABLE IF NOT EXISTS certificates (
  code text PRIMARY KEY,
  user_id text NOT NULL,
  trail_slug text NOT NULL,
  user_name text NOT NULL,
  course_name text NOT NULL,
  completion_date text NOT NULL,
  total_hours text NOT NULL,
  issued_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =========== 2. HABILITAR ROW LEVEL SECURITY (RLS) ===========

ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_module_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_certificate_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

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
WITH CHECK (requesting_user_id() = author_id);

-- Atualização/Exclusão: O usuário só pode alterar/excluir o próprio comentário
CREATE POLICY "Atualização/Exclusão do próprio comentário"
ON forum_comments FOR ALL
USING (requesting_user_id() = author_id);


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


-- Políticas para certificates
CREATE POLICY "Usuário pode visualizar próprios certificados"
ON certificates FOR SELECT
USING (requesting_user_id() = user_id);

CREATE OR REPLACE FUNCTION validate_certificate(certificate_code text)
RETURNS TABLE (
  code text,
  trail_slug text,
  user_name text,
  course_name text,
  completion_date text,
  total_hours text,
  issued_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    certificates.code,
    certificates.trail_slug,
    certificates.user_name,
    certificates.course_name,
    certificates.completion_date,
    certificates.total_hours,
    certificates.issued_at
  FROM certificates
  WHERE certificates.code = upper(trim(certificate_code))
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION validate_certificate(text) TO anon, authenticated;

DROP FUNCTION IF EXISTS issue_certificate(text, text, text, text, text, text);
DROP FUNCTION IF EXISTS issue_certificate(text, text);

CREATE OR REPLACE FUNCTION issue_certificate(
  certificate_code text,
  certificate_trail_slug text
)
RETURNS TABLE (
  code text,
  trail_slug text,
  user_name text,
  course_name text,
  completion_date text,
  total_hours text,
  issued_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester text := requesting_user_id();
  jwt_claims jsonb := coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb);
  normalized_code text := upper(trim(certificate_code));
  required_count integer;
  completed_count integer;
  derived_user_name text;
  derived_course_name text;
  derived_completion_date text;
  derived_total_hours text;
BEGIN
  IF requester IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  derived_user_name := nullif(trim(coalesce(
    nullif(jwt_claims->>'name', ''),
    nullif(jwt_claims->>'full_name', ''),
    nullif(concat_ws(
      ' ',
      nullif(jwt_claims->>'given_name', ''),
      nullif(jwt_claims->>'family_name', '')
    ), ''),
    nullif(jwt_claims->>'email', ''),
    requester
  )), '');

  IF normalized_code !~ '^CERT-[A-F0-9]{8,32}$' THEN
    RAISE EXCEPTION 'Código de certificado inválido';
  END IF;

  SELECT
    trail_certificate_metadata.course_name,
    trail_certificate_metadata.total_hours
  INTO
    derived_course_name,
    derived_total_hours
  FROM trail_certificate_metadata
  WHERE trail_certificate_metadata.trail_slug = certificate_trail_slug;

  IF derived_course_name IS NULL THEN
    RAISE EXCEPTION 'Trilha não encontrada';
  END IF;

  SELECT count(*)
  INTO required_count
  FROM trail_module_requirements
  WHERE trail_slug = certificate_trail_slug;

  IF required_count = 0 THEN
    RAISE EXCEPTION 'Trilha não encontrada';
  END IF;

  SELECT
    count(DISTINCT module_progress.module_id),
    to_char(
      max(coalesce(module_progress.completed_at, module_progress.updated_at, now()))
        AT TIME ZONE 'America/Sao_Paulo',
      'DD/MM/YYYY'
    )
  INTO
    completed_count,
    derived_completion_date
  FROM module_progress
  INNER JOIN trail_module_requirements
    ON trail_module_requirements.trail_slug = module_progress.trail_slug
    AND trail_module_requirements.module_id = module_progress.module_id
  WHERE module_progress.user_id = requester
    AND module_progress.trail_slug = certificate_trail_slug
    AND module_progress.completed = true;

  IF completed_count < required_count THEN
    RAISE EXCEPTION 'Trilha não concluída';
  END IF;

  RETURN QUERY
  WITH inserted AS (
    INSERT INTO certificates (
      code,
      user_id,
      trail_slug,
      user_name,
      course_name,
      completion_date,
      total_hours
    )
    VALUES (
      normalized_code,
      requester,
      certificate_trail_slug,
      derived_user_name,
      derived_course_name,
      derived_completion_date,
      derived_total_hours
    )
    RETURNING certificates.*
  )
  SELECT
    inserted.code,
    inserted.trail_slug,
    inserted.user_name,
    inserted.course_name,
    inserted.completion_date,
    inserted.total_hours,
    inserted.issued_at
  FROM inserted;
END;
$$;

GRANT EXECUTE ON FUNCTION issue_certificate(text, text) TO authenticated;
