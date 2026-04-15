# MackSeguro

Plataforma educativa de segurança digital com integração completa entre Clerk (Autenticação) e Supabase (Banco de Dados).

## Opcionais vs Obrigatórios

O aplicativo está configurado para salvar o progresso dos usuários na aba `Trilhas` e as interações nos fóruns usando as chaves configuradas na build. 

**Integração do Supabase**
No aplicativo, a integração do Supabase é gerida pelas variáveis do ambiente. 

### Variáveis de Ambiente necessárias (`.env.local` e Vercel):
No momento de fazer o Deploy (na Vercel, Netlify, etc), as seguintes variáveis devem estar presentes no painel para que a integração com os serviços em nuvem ligue corretamente. Omissões nas variáveis farão com que a Vercel desligue silenciosamente o fluxo (fallback para false).

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... ou pk_live_...
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_... ou eyJ...
VITE_ENABLE_SUPABASE_SYNC=true
VITE_ENABLE_SUPABASE_READS=true
VITE_REQUIRE_AUTH_FOR_COURSE=true
```

## Como configurar o Clerk + Supabase
Para que o Supabase receba as chaves da conta criada no Clerk de forma segura utilizando as Row-Level Securities (RLS) aplicadas, o Setup abaixo é obrigatório em sua Platarfoma Web de configuração:

1. **No seu Clerk Dashboard**:
   - Vá para o menu lateral **JWT Templates**.
   - Crie um novo com o nome obrigatoriamente sendo `supabase` e certifique-se que você tenha o Token gerando as informações:
     ```json
     {
       "aud": "authenticated",
       "role": "authenticated"
     }
     ```
   - Desative a opção "Custom signing key". 
   - Copie o Domínio listado no capo Issuer (exemplo: `https://engaging-platypus-71.clerk.accounts.dev`).

2. **No seu Supabase Dashboard**:
   - Vá para **Settings > API**.
   - Na seção JWT Settings, adicione o provedor de autenticação de Terceiros e cole a URL copiada do Clerk em "Clerk Domain".

### Deploy e Sincronização em Produção
Sempre que alterar uma variável de ambiente, como ao colar as novas chaves para o site rodar num domínio oficial (Live / Produção), você precisará rodar um **Redeploy** na sua hospedagem. É isso que consolida os valores recém definidos no código da ferramenta! As chaves da configuração _dev_ no painel da web não funcionarão para _produção_ caso você migre as credenciais do Clerk. Mantenha os provedores conectados e emparelhados!
