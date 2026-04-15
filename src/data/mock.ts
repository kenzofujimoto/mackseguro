/* ===== Tipos ===== */

export interface Modulo {
  id: number;
  titulo: string;
  descricao: string;
  duracao: string;
  xp: number;
}

export interface Trilha {
  id: number;
  slug: string;
  titulo: string;
  descricaoCurta: string;
  descricaoLonga: string;
  icone: string;
  cor: string;        // cor tema do card
  totalXp: number;
  modulos: Modulo[];
}

export interface Material {
  id: number;
  titulo: string;
  tipo: "pdf" | "ebook" | "cartilha" | "infografico";
  descricao: string;
  tamanho: string;
  url: string;
  cor: string;
}

export interface Pilula {
  id: number;
  titulo: string;
  conteudo: string;
  categoria: string;
  data: string;
  cor: string;
}

export interface Evento {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  local: string;
  tipo: "palestra" | "workshop" | "mesa-redonda";
}

export interface Estatistica {
  label: string;
  valor: string;
  icone: string;
  cor: string;
}

export interface Questao {
  id: number;
  pergunta: string;
  opcoes: string[];
  respostaCorreta: number;
}

export interface PostForum {
  id: number;
  autor: string;
  iniciais: string;
  data: string;
  conteudo: string;
  respostas: number;
}

export interface ConteudoModulo {
  trilhaSlug: string;
  moduloId: number;
  videoTitulo: string;
  videoDuracao: string;
  videoUrl?: string;
  conteudo: string[];
  questoes: Questao[];
  forum: PostForum[];
}

/* ===== Dados mockados ===== */

export const estatisticas: Estatistica[] = [
  { label: "Módulos disponíveis", valor: "9", icone: "BookOpen", cor: "blue" },
  { label: "Minutos de conteúdo", valor: "155", icone: "Clock", cor: "green" },
  { label: "Materiais gratuitos", valor: "4", icone: "Download", cor: "orange" },
  { label: "Eventos agendados", valor: "3", icone: "Calendar", cor: "purple" },
];

export const trilhas: Trilha[] = [
  {
    id: 1,
    slug: "seguranca-digital",
    titulo: "Segurança Digital para Todos",
    descricaoCurta:
      "Aprenda a proteger seus dados e sua privacidade no dia a dia digital.",
    descricaoLonga:
      "Nesta trilha você vai entender como funcionam as principais ameaças digitais — de golpes por e-mail a vazamentos de dados — e aprender práticas simples para se proteger.",
    icone: "ShieldCheck",
    cor: "blue",
    totalXp: 500,
    modulos: [
      {
        id: 1,
        titulo: "O que é Segurança Digital?",
        descricao:
          "Conceitos básicos sobre segurança da informação e por que ela importa para todos.",
        duracao: "15 min",
        xp: 100,
      },
      {
        id: 2,
        titulo: "Senhas Fortes e Autenticação",
        descricao:
          "Como criar senhas seguras, usar gerenciadores de senha e ativar 2FA.",
        duracao: "20 min",
        xp: 100,
      },
      {
        id: 3,
        titulo: "Golpes e Phishing",
        descricao:
          "Identifique e-mails e mensagens fraudulentas antes de cair em armadilhas.",
        duracao: "20 min",
        xp: 100,
      },
      {
        id: 4,
        titulo: "Privacidade nas Redes Sociais",
        descricao:
          "Configurações de privacidade e boas práticas para compartilhar informações online.",
        duracao: "15 min",
        xp: 100,
      },
      {
        id: 5,
        titulo: "Segurança em Wi-Fi e Dispositivos",
        descricao:
          "Cuidados ao usar redes públicas e manter celulares e computadores protegidos.",
        duracao: "15 min",
        xp: 100,
      },
    ],
  },
  {
    id: 2,
    slug: "saude-digital",
    titulo: "Saúde Digital e Bem-Estar",
    descricaoCurta:
      "Entenda como a tecnologia impacta sua saúde e crie hábitos digitais saudáveis.",
    descricaoLonga:
      "A tecnologia faz parte da nossa rotina, mas o uso excessivo pode prejudicar a saúde mental, o sono e as relações. Aprenda a equilibrar vida digital e bem-estar.",
    icone: "Heart",
    cor: "green",
    totalXp: 400,
    modulos: [
      {
        id: 1,
        titulo: "Tempo de Tela e Saúde Mental",
        descricao:
          "Os efeitos do uso prolongado de telas e como identificar sinais de alerta.",
        duracao: "15 min",
        xp: 100,
      },
      {
        id: 2,
        titulo: "Cyberbullying e Assédio Online",
        descricao:
          "Como reconhecer, prevenir e denunciar situações de violência digital.",
        duracao: "20 min",
        xp: 100,
      },
      {
        id: 3,
        titulo: "Desinformação e Fake News",
        descricao:
          "Ferramentas e técnicas para verificar informações antes de compartilhar.",
        duracao: "15 min",
        xp: 100,
      },
      {
        id: 4,
        titulo: "Equilíbrio Digital",
        descricao:
          "Estratégias práticas para reduzir o uso excessivo de redes sociais e aplicativos.",
        duracao: "15 min",
        xp: 100,
      },
    ],
  },
];

export const materiais: Material[] = [
  {
    id: 1,
    titulo: "Cartilha de Segurança para Internet",
    tipo: "cartilha",
    descricao:
      "Guia prático com dicas essenciais de segurança para usuários de todas as idades.",
    tamanho: "2.4 MB",
    url: "/materiais/cartilha-seguranca-internet.txt",
    cor: "green",
  },
  {
    id: 2,
    titulo: "E-book: Proteja sua Vida Digital",
    tipo: "ebook",
    descricao:
      "Material completo sobre proteção de dados pessoais e privacidade online.",
    tamanho: "5.1 MB",
    url: "/materiais/ebook-proteja-vida-digital.txt",
    cor: "blue",
  },
  {
    id: 3,
    titulo: "Infográfico: Anatomia de um Golpe",
    tipo: "infografico",
    descricao:
      "Visualize passo a passo como funcionam os golpes digitais mais comuns.",
    tamanho: "1.2 MB",
    url: "/materiais/infografico-anatomia-golpe.svg",
    cor: "orange",
  },
  {
    id: 4,
    titulo: "Guia de Configuração de Privacidade",
    tipo: "pdf",
    descricao:
      "Passo a passo para configurar privacidade no WhatsApp, Instagram e Facebook.",
    tamanho: "3.8 MB",
    url: "/materiais/guia-privacidade-redes.txt",
    cor: "purple",
  },
];

export const pilulas: Pilula[] = [
  {
    id: 1,
    titulo: "Nunca repita senhas",
    conteudo:
      "Usar a mesma senha em vários sites é um dos erros mais comuns. Se um serviço for invadido, todas as suas contas ficam vulneráveis. Use um gerenciador de senhas!",
    categoria: "Senhas",
    data: "2026-03-10",
    cor: "blue",
  },
  {
    id: 2,
    titulo: "Cuidado com links encurtados",
    conteudo:
      "Links encurtados podem esconder destinos maliciosos. Antes de clicar, use ferramentas como CheckShortURL para revelar o endereço real.",
    categoria: "Phishing",
    data: "2026-03-08",
    cor: "red",
  },
  {
    id: 3,
    titulo: "Atualize seus aplicativos",
    conteudo:
      "Atualizações de software corrigem falhas de segurança. Manter apps e sistema operacional atualizados é uma das formas mais simples de se proteger.",
    categoria: "Dispositivos",
    data: "2026-03-05",
    cor: "green",
  },
  {
    id: 4,
    titulo: "Desconfie de ofertas boas demais",
    conteudo:
      "Promoções absurdas em redes sociais ou WhatsApp geralmente são golpes. Sempre verifique no site oficial da loja antes de clicar.",
    categoria: "Golpes",
    data: "2026-03-03",
    cor: "orange",
  },
];

export const eventos: Evento[] = [
  {
    id: 1,
    titulo: "Palestra: Segurança Digital na Terceira Idade",
    descricao:
      "Como idosos podem se proteger de golpes digitais e usar a internet com segurança.",
    data: "2026-04-15",
    horario: "14:00 – 16:00",
    local: "Auditório Principal — Mackenzie",
    tipo: "palestra",
  },
  {
    id: 2,
    titulo: "Workshop: Criando Senhas Seguras",
    descricao:
      "Atividade prática para aprender a criar e gerenciar senhas fortes.",
    data: "2026-04-22",
    horario: "10:00 – 12:00",
    local: "Laboratório de Informática — Bloco 3",
    tipo: "workshop",
  },
  {
    id: 3,
    titulo: "Mesa-Redonda: Saúde Mental e Tecnologia",
    descricao:
      "Debate sobre os impactos do uso excessivo de tecnologia na saúde mental dos jovens.",
    data: "2026-05-10",
    horario: "19:00 – 21:00",
    local: "Sala de Conferências — Mackenzie",
    tipo: "mesa-redonda",
  },
];

/* ===== Conteúdo dos módulos ===== */

export const conteudosModulos: ConteudoModulo[] = [
  // ===== TRILHA: Segurança Digital para Todos =====
  {
    trilhaSlug: "seguranca-digital",
    moduloId: 1,
    videoTitulo: "Introdução à Segurança Digital",
    videoDuracao: "12:34",
    videoUrl: "https://www.youtube.com/embed/bPVaOlJ6ln0",
    conteudo: [
      "Segurança digital, também conhecida como segurança da informação, é o conjunto de práticas, processos e tecnologias projetados para proteger dados, dispositivos e redes contra acessos não autorizados, ataques e danos. Em um mundo cada vez mais conectado, entender esses conceitos é fundamental para todos — não apenas para profissionais de tecnologia.",
      "Os três pilares fundamentais da segurança da informação são conhecidos como a Tríade CIA: Confidencialidade (garantir que apenas pessoas autorizadas acessem a informação), Integridade (assegurar que os dados não sejam alterados indevidamente) e Disponibilidade (manter os sistemas e dados acessíveis quando necessário).",
      "No Brasil, a Lei Geral de Proteção de Dados (LGPD) estabelece regras sobre coleta, armazenamento e compartilhamento de dados pessoais. Isso significa que empresas e organizações têm responsabilidade legal sobre seus dados, mas você também precisa fazer sua parte para proteger suas informações pessoais.",
      "Alguns exemplos de ameaças digitais comuns incluem: phishing (golpes por e-mail ou mensagem), malware (software malicioso), ransomware (sequestro de dados), vazamento de dados pessoais e engenharia social (manipulação psicológica para obter informações). Ao longo desta trilha, vamos aprender a reconhecer e nos proteger dessas ameaças.",
    ],
    questoes: [
      {
        id: 1,
        pergunta: "O que significa a sigla CIA na segurança da informação?",
        opcoes: [
          "Central Intelligence Agency",
          "Confidencialidade, Integridade e Disponibilidade",
          "Controle, Informação e Acesso",
          "Comunicação, Internet e Aplicativos",
        ],
        respostaCorreta: 1,
      },
      {
        id: 2,
        pergunta:
          "Qual é a principal lei brasileira que trata da proteção de dados pessoais?",
        opcoes: [
          "Lei Carolina Dieckmann",
          "Marco Civil da Internet",
          "Lei Geral de Proteção de Dados (LGPD)",
          "Código de Defesa do Consumidor",
        ],
        respostaCorreta: 2,
      },
      {
        id: 3,
        pergunta: "O que é engenharia social?",
        opcoes: [
          "Um tipo de formação em engenharia",
          "Uma técnica de manipulação psicológica para obter informações",
          "Um software de proteção contra vírus",
          "Uma rede social para engenheiros",
        ],
        respostaCorreta: 1,
      },
      {
        id: 4,
        pergunta:
          "Qual dos seguintes NÃO é um pilar da segurança da informação?",
        opcoes: [
          "Confidencialidade",
          "Velocidade",
          "Integridade",
          "Disponibilidade",
        ],
        respostaCorreta: 1,
      },
    ],
    forum: [
      {
        id: 1,
        autor: "Maria Santos",
        iniciais: "MS",
        data: "2026-03-08",
        conteudo:
          "Achei muito interessante a parte sobre a Tríade CIA. Na empresa onde trabalho, nunca explicaram isso de forma tão clara. Alguém sabe como posso aplicar esses conceitos no dia a dia do escritório?",
        respostas: 3,
      },
      {
        id: 2,
        autor: "João Oliveira",
        iniciais: "JO",
        data: "2026-03-07",
        conteudo:
          "Sobre a LGPD, eu tenho uma dúvida: se uma empresa vazar meus dados, quais são meus direitos? Alguém já passou por essa situação?",
        respostas: 5,
      },
      {
        id: 3,
        autor: "Ana Costa",
        iniciais: "AC",
        data: "2026-03-06",
        conteudo:
          "Minha avó quase caiu em um golpe de phishing ontem! Recebi esse curso na hora certa. Vou compartilhar o conteúdo com ela.",
        respostas: 2,
      },
    ],
  },
  {
    trilhaSlug: "seguranca-digital",
    moduloId: 2,
    videoTitulo: "Como Criar Senhas Realmente Seguras",
    videoDuracao: "15:22",
    videoUrl: "https://www.youtube.com/embed/3NjQ9b3pgIg",
    conteudo: [
      "Uma senha forte é sua primeira linha de defesa no mundo digital. Infelizmente, as senhas mais usadas no Brasil ainda são '123456', 'senha' e 'brasil'. Essas senhas podem ser quebradas por programas automatizados em menos de um segundo.",
      "Para criar uma senha segura, use pelo menos 12 caracteres combinando letras maiúsculas, minúsculas, números e símbolos. Uma técnica eficiente é criar uma frase-senha: por exemplo, 'MeuCaféDas7h@Mackenzie!' é fácil de lembrar mas muito difícil de adivinhar.",
      "Gerenciadores de senha como Bitwarden (gratuito e open source), 1Password ou LastPass armazenam todas as suas senhas de forma criptografada. Você só precisa memorizar uma senha mestra forte. Eles também geram senhas aleatórias e únicas para cada serviço.",
      "A Autenticação em Dois Fatores (2FA) adiciona uma camada extra de segurança. Mesmo que alguém descubra sua senha, precisará de um segundo fator — como um código no celular ou uma chave de segurança — para acessar sua conta. Ative o 2FA em todos os serviços que oferecem essa opção, especialmente e-mail, banco e redes sociais.",
    ],
    questoes: [
      {
        id: 1,
        pergunta: "Qual característica torna uma senha mais segura?",
        opcoes: [
          "Usar apenas números",
          "Ter pelo menos 12 caracteres com letras, números e símbolos",
          "Usar o nome de um familiar",
          "Usar a mesma senha em todos os sites",
        ],
        respostaCorreta: 1,
      },
      {
        id: 2,
        pergunta: "O que é Autenticação em Dois Fatores (2FA)?",
        opcoes: [
          "Digitar a senha duas vezes",
          "Ter duas senhas diferentes",
          "Uma camada extra de verificação além da senha",
          "Usar dois computadores diferentes",
        ],
        respostaCorreta: 2,
      },
      {
        id: 3,
        pergunta:
          "Qual é a função principal de um gerenciador de senhas?",
        opcoes: [
          "Hackear contas de outras pessoas",
          "Armazenar senhas de forma criptografada e gerar senhas fortes",
          "Enviar senhas por e-mail",
          "Remover vírus do computador",
        ],
        respostaCorreta: 1,
      },
      {
        id: 4,
        pergunta: "Qual das seguintes é a melhor prática para senhas?",
        opcoes: [
          "Anotar todas as senhas em um papel na mesa",
          "Usar a mesma senha forte em todos os sites",
          "Criar senhas únicas para cada serviço",
          "Compartilhar senhas com amigos de confiança",
        ],
        respostaCorreta: 2,
      },
    ],
    forum: [
      {
        id: 1,
        autor: "Pedro Lima",
        iniciais: "PL",
        data: "2026-03-09",
        conteudo:
          "Comecei a usar o Bitwarden depois desse módulo e estou impressionado! Já cadastrei mais de 40 senhas diferentes. Recomendo para quem ainda não usa gerenciador de senhas.",
        respostas: 7,
      },
      {
        id: 2,
        autor: "Carla Mendes",
        iniciais: "CM",
        data: "2026-03-08",
        conteudo:
          "Dúvida: se o gerenciador de senhas for hackeado, não perco todas as minhas senhas de uma vez?",
        respostas: 4,
      },
      {
        id: 3,
        autor: "Lucas Ferreira",
        iniciais: "LF",
        data: "2026-03-07",
        conteudo:
          "Ativei o 2FA no WhatsApp e no Gmail. O processo é bem simples! Vale muito a pena pela segurança extra.",
        respostas: 2,
      },
    ],
  },
  {
    trilhaSlug: "seguranca-digital",
    moduloId: 3,
    videoTitulo: "Identificando Golpes Digitais",
    videoDuracao: "18:45",
    videoUrl: "https://www.youtube.com/embed/5f2R9Q8YdXA",
    conteudo: [
      "Phishing é uma das formas mais comuns de golpe digital. O criminoso se passa por uma empresa ou pessoa conhecida para enganar a vítima e roubar dados pessoais, senhas ou dinheiro. O nome vem de 'fishing' (pescar), pois o golpista 'joga a isca' esperando que alguém morda.",
      "Os principais canais de phishing são: e-mails falsos imitando bancos ou empresas, mensagens de SMS com links suspeitos (smishing), ligações telefônicas fraudulentas (vishing), e mensagens em redes sociais ou WhatsApp com ofertas falsas ou pedidos urgentes.",
      "Para identificar um golpe, observe: erros de português ou formatação estranha, senso de urgência ('sua conta será bloqueada!'), links suspeitos (passe o mouse sobre o link para ver o URL real), remetentes desconhecidos ou com domínios estranhos, e pedidos de informações pessoais ou financeiras.",
      "Se receber uma mensagem suspeita: não clique em links, não baixe anexos, não forneça dados pessoais. Em caso de dúvida, entre em contato diretamente com a empresa pelo site oficial ou telefone que você já conhece.",
    ],
    questoes: [
      {
        id: 1,
        pergunta: "O que é phishing?",
        opcoes: [
          "Um tipo de vírus de computador",
          "Uma técnica de golpe que tenta enganar pessoas para obter dados",
          "Um programa de proteção antivírus",
          "Uma rede social segura",
        ],
        respostaCorreta: 1,
      },
      {
        id: 2,
        pergunta: "Qual é um sinal comum de e-mail de phishing?",
        opcoes: [
          "O e-mail vem do endereço oficial da empresa",
          "O e-mail contém erros de português e senso de urgência",
          "O e-mail foi enviado no horário comercial",
          "O e-mail contém apenas texto, sem links",
        ],
        respostaCorreta: 1,
      },
      {
        id: 3,
        pergunta:
          "O que fazer ao receber uma mensagem suspeita do banco?",
        opcoes: [
          "Clicar no link e verificar sua conta",
          "Responder com seus dados para confirmar",
          "Ligar para o número oficial do banco para verificar",
          "Encaminhar para amigos perguntando se é verdade",
        ],
        respostaCorreta: 2,
      },
    ],
    forum: [
      {
        id: 1,
        autor: "Roberto Alves",
        iniciais: "RA",
        data: "2026-03-09",
        conteudo:
          "Recebi um e-mail do 'Banco do Brasil' pedindo atualização cadastral. Quase cliquei, mas notei que o remetente era banco.brasil@gmail.com — claramente falso! Obrigado pelo módulo!",
        respostas: 6,
      },
      {
        id: 2,
        autor: "Fernanda Silva",
        iniciais: "FS",
        data: "2026-03-08",
        conteudo:
          "Minha mãe recebeu uma ligação de alguém se passando pelo suporte da Apple dizendo que o iPhone dela estava hackeado. Consegui orientá-la a desligar graças ao que aprendi aqui.",
        respostas: 4,
      },
    ],
  },
  {
    trilhaSlug: "seguranca-digital",
    moduloId: 4,
    videoTitulo: "Configurando sua Privacidade Online",
    videoDuracao: "14:10",
    videoUrl: "https://www.youtube.com/embed/9e2NfYb8kVc",
    conteudo: [
      "Redes sociais são parte importante da nossa vida, mas compartilhar informações em excesso pode colocar sua segurança em risco. Criminosos podem usar dados públicos como localização, rotina, nome de familiares e data de nascimento para aplicar golpes ou até planejar crimes.",
      "No Instagram, ative o perfil privado em Configurações > Privacidade > Conta privada. No Facebook, revise quem pode ver suas publicações em Configurações > Privacidade. No WhatsApp, configure quem pode ver sua foto de perfil, status e 'visto por último' em Configurações > Privacidade.",
      "Evite compartilhar: localização em tempo real, fotos de documentos, rotina detalhada (horários de saída e chegada), viagens enquanto ainda está fora de casa, e informações financeiras. Lembre-se: uma vez publicado na internet, é muito difícil remover completamente.",
      "Revise periodicamente as permissões dos aplicativos no seu celular. Muitos apps pedem acesso a câmera, microfone, contatos e localização sem necessidade real. No Android, vá em Configurações > Apps > Permissões. No iPhone, em Ajustes > Privacidade.",
    ],
    questoes: [
      {
        id: 1,
        pergunta:
          "Por que é arriscado compartilhar sua localização em tempo real?",
        opcoes: [
          "Consome muita bateria do celular",
          "Criminosos podem monitorar sua rotina e localização",
          "Deixa o celular mais lento",
          "Não há risco nenhum",
        ],
        respostaCorreta: 1,
      },
      {
        id: 2,
        pergunta:
          "O que é recomendado fazer periodicamente com os aplicativos do celular?",
        opcoes: [
          "Desinstalar todos os aplicativos",
          "Revisar as permissões de acesso (câmera, microfone, localização)",
          "Compartilhar senhas dos apps com familiares",
          "Usar apenas aplicativos pagos",
        ],
        respostaCorreta: 1,
      },
      {
        id: 3,
        pergunta:
          "Qual informação você deve evitar compartilhar nas redes sociais?",
        opcoes: [
          "Suas opiniões sobre filmes",
          "Fotos de viagem enquanto ainda está viajando",
          "Receitas culinárias que você experimentou",
          "Recomendações de livros",
        ],
        respostaCorreta: 1,
      },
    ],
    forum: [
      {
        id: 1,
        autor: "Juliana Rocha",
        iniciais: "JR",
        data: "2026-03-09",
        conteudo:
          "Fiz uma limpeza nas permissões dos apps e fiquei chocada! Um app de lanterna tinha acesso aos meus contatos e microfone. Já removi.",
        respostas: 8,
      },
      {
        id: 2,
        autor: "Marcos Teixeira",
        iniciais: "MT",
        data: "2026-03-08",
        conteudo:
          "Dica: no Instagram Stories, dá pra restringir quem vê seus stories em 'Melhores Amigos'. Uso para compartilhar coisas pessoais só com pessoas próximas.",
        respostas: 3,
      },
    ],
  },
  {
    trilhaSlug: "seguranca-digital",
    moduloId: 5,
    videoTitulo: "Protegendo seus Dispositivos e Conexões",
    videoDuracao: "16:28",
    videoUrl: "https://www.youtube.com/embed/VNw2f8Y3R3E",
    conteudo: [
      "Redes Wi-Fi públicas (em cafés, aeroportos, shoppings) são convenientes, mas podem ser perigosas. Criminosos podem criar redes falsas com nomes similares a redes legítimas ou interceptar dados transmitidos em redes sem criptografia adequada.",
      "Para se proteger em redes públicas: evite acessar bancos ou fazer compras online, use uma VPN (Virtual Private Network) para criptografar sua conexão, verifique se os sites acessados usam HTTPS (cadeado no navegador) e desative o Wi-Fi automático no celular.",
      "Mantenha seus dispositivos protegidos: atualize o sistema operacional e aplicativos regularmente (as atualizações corrigem falhas de segurança), use antivírus atualizado, ative a criptografia de disco (BitLocker no Windows, FileVault no Mac) e configure bloqueio de tela com PIN ou biometria.",
      "Em caso de perda ou roubo do celular: tenha o recurso 'Encontrar Meu Dispositivo' ativado previamente (Find My iPhone ou Encontrar Meu Dispositivo do Google), anote o IMEI do aparelho (digite *#06# para descobrir) e faça backups regulares dos seus dados na nuvem ou em dispositivo externo.",
    ],
    questoes: [
      {
        id: 1,
        pergunta: "Por que redes Wi-Fi públicas podem ser perigosas?",
        opcoes: [
          "Porque são mais lentas",
          "Porque criminosos podem interceptar dados ou criar redes falsas",
          "Porque gastam mais bateria",
          "Porque exigem cadastro",
        ],
        respostaCorreta: 1,
      },
      {
        id: 2,
        pergunta: "O que é uma VPN?",
        opcoes: [
          "Um tipo de vírus",
          "Uma rede virtual que criptografa sua conexão de internet",
          "Um aplicativo de mensagens seguras",
          "Um navegador de internet",
        ],
        respostaCorreta: 1,
      },
      {
        id: 3,
        pergunta:
          "O que você deve fazer imediatamente ao perder o celular?",
        opcoes: [
          "Esperar para ver se alguém devolve",
          "Usar o recurso 'Encontrar Meu Dispositivo' e bloquear remotamente",
          "Comprar um celular novo",
          "Avisar nas redes sociais",
        ],
        respostaCorreta: 1,
      },
    ],
    forum: [
      {
        id: 1,
        autor: "Paula Nascimento",
        iniciais: "PN",
        data: "2026-03-09",
        conteudo:
          "Comecei a usar VPN no celular quando estou na faculdade e percebi que vários sites bloqueiam. Alguém tem recomendação de VPN gratuita e confiável?",
        respostas: 5,
      },
      {
        id: 2,
        autor: "Eduardo Martins",
        iniciais: "EM",
        data: "2026-03-07",
        conteudo:
          "Dica importante: salvem o IMEI do celular em algum lugar seguro ANTES de precisar. Quando roubam, já é tarde para descobrir.",
        respostas: 3,
      },
    ],
  },

  // ===== TRILHA: Saúde Digital e Bem-Estar =====
  {
    trilhaSlug: "saude-digital",
    moduloId: 1,
    videoTitulo: "Impactos do Tempo de Tela na Saúde",
    videoDuracao: "13:15",
    videoUrl: "https://www.youtube.com/embed/2fLz2bNn9bI",
    conteudo: [
      "Brasileiros passam em média mais de 9 horas por dia conectados à internet — um dos maiores índices do mundo. O uso excessivo de telas está associado a problemas como insônia, ansiedade, depressão, dores de cabeça e problemas posturais.",
      "A luz azul emitida por telas pode interferir na produção de melatonina, o hormônio do sono. Especialistas recomendam evitar telas pelo menos 1 hora antes de dormir. Ative o filtro de luz azul (modo noturno) no celular e computador para reduzir esse impacto.",
      "As redes sociais são projetadas para maximizar o tempo de uso. Recursos como scroll infinito, notificações push e likes ativam o sistema de recompensa do cérebro, criando hábitos compulsivos. Reconhecer esses mecanismos é o primeiro passo para um uso mais consciente.",
      "Sinais de alerta para o uso excessivo incluem: verificar o celular compulsivamente, sentir ansiedade ao ficar sem internet, negligenciar atividades presenciais, dificuldade de concentração em tarefas offline e alterações no sono. Se você se identificou, não se preocupe — nos próximos módulos veremos estratégias práticas.",
    ],
    questoes: [
      {
        id: 1,
        pergunta: "Como a luz azul das telas afeta o sono?",
        opcoes: [
          "Ajuda a dormir mais rápido",
          "Interfere na produção de melatonina",
          "Não tem nenhum efeito no sono",
          "Aumenta a produção de serotonina",
        ],
        respostaCorreta: 1,
      },
      {
        id: 2,
        pergunta: "Qual é a recomendação sobre telas antes de dormir?",
        opcoes: [
          "Usar normalmente até adormecer",
          "Evitar telas pelo menos 1 hora antes de dormir",
          "Usar apenas o celular, não o computador",
          "Aumentar o brilho para cansar os olhos mais rápido",
        ],
        respostaCorreta: 1,
      },
      {
        id: 3,
        pergunta: "O que é scroll infinito e por que é preocupante?",
        opcoes: [
          "Um recurso que melhora a velocidade da internet",
          "Um design que mantém o usuário rolando sem fim, maximizando tempo de uso",
          "Uma proteção contra vírus",
          "Um tipo de jogo online",
        ],
        respostaCorreta: 1,
      },
    ],
    forum: [
      {
        id: 1,
        autor: "Beatriz Souza",
        iniciais: "BS",
        data: "2026-03-09",
        conteudo:
          "Instalei o app 'Bem-Estar Digital' no Android e levei um susto: estava usando o celular 6 horas por dia! Agora coloquei limites de tempo nos apps de redes sociais.",
        respostas: 4,
      },
      {
        id: 2,
        autor: "Rafael Gomes",
        iniciais: "RG",
        data: "2026-03-08",
        conteudo:
          "Comecei a carregar o celular fora do quarto para não ficar mexendo antes de dormir. Meu sono melhorou muito em apenas uma semana!",
        respostas: 6,
      },
    ],
  },
  {
    trilhaSlug: "saude-digital",
    moduloId: 2,
    videoTitulo: "Combatendo o Cyberbullying",
    videoDuracao: "17:30",
    videoUrl: "https://www.youtube.com/embed/pk2Va1T7b3Q",
    conteudo: [
      "Cyberbullying é o uso de tecnologia para intimidar, humilhar ou ameaçar alguém de forma repetida. Diferente do bullying presencial, o cyberbullying pode acontecer 24 horas por dia e alcançar um público muito maior. As vítimas frequentemente sentem que não há escapatória.",
      "As formas mais comuns incluem: mensagens ofensivas ou ameaçadoras, divulgação de fotos ou vídeos sem consentimento, criação de perfis falsos para difamar, exclusão intencional de grupos online e compartilhamento de rumores ou informações privadas.",
      "Se você for vítima: não responda às provocações, salve todas as evidências (prints de tela), bloqueie e denuncie o agressor na plataforma, converse com alguém de confiança (familiar, amigo, professor) e, em casos graves, registre um Boletim de Ocorrência. O cyberbullying é crime previsto no Código Penal brasileiro.",
      "Para ajudar a combater o cyberbullying: não compartilhe conteúdo que humilhe outras pessoas, apoie quem está sendo atacado, denuncie comportamentos abusivos nas plataformas e converse com crianças e adolescentes sobre o tema.",
    ],
    questoes: [
      {
        id: 1,
        pergunta:
          "O que diferencia o cyberbullying do bullying presencial?",
        opcoes: [
          "O cyberbullying é menos grave",
          "O cyberbullying pode acontecer 24h e alcançar um público maior",
          "O cyberbullying só acontece entre adultos",
          "Não há diferença entre os dois",
        ],
        respostaCorreta: 1,
      },
      {
        id: 2,
        pergunta: "O que fazer ao ser vítima de cyberbullying?",
        opcoes: [
          "Responder com mensagens ofensivas",
          "Salvar evidências, bloquear, denunciar e buscar apoio",
          "Deletar todas as mensagens e ignorar",
          "Criar um perfil falso para se vingar",
        ],
        respostaCorreta: 1,
      },
      {
        id: 3,
        pergunta: "Cyberbullying é crime no Brasil?",
        opcoes: [
          "Não, é apenas uma brincadeira",
          "Só é crime se envolver dinheiro",
          "Sim, é previsto no Código Penal",
          "Só é crime contra menores de idade",
        ],
        respostaCorreta: 2,
      },
    ],
    forum: [
      {
        id: 1,
        autor: "Camila Araújo",
        iniciais: "CA",
        data: "2026-03-09",
        conteudo:
          "Esse módulo deveria ser obrigatório nas escolas! Quando eu tinha 14 anos sofri cyberbullying e não sabia que podia denunciar. Hoje as informações estão mais acessíveis.",
        respostas: 9,
      },
      {
        id: 2,
        autor: "Felipe Santos",
        iniciais: "FS",
        data: "2026-03-07",
        conteudo:
          "Sou professor e vou usar esse conteúdo nas minhas aulas. Muito bem organizado e com informações práticas. Obrigado!",
        respostas: 3,
      },
    ],
  },
  {
    trilhaSlug: "saude-digital",
    moduloId: 3,
    videoTitulo: "Como Verificar Informações Online",
    videoDuracao: "14:55",
    videoUrl: "https://www.youtube.com/embed/sJ6P6A5A8hE",
    conteudo: [
      "Desinformação é a disseminação intencional de informações falsas ou enganosas. As fake news se espalham rapidamente porque apelam para emoções fortes como medo, raiva e indignação. Estudos mostram que notícias falsas se espalham até 6 vezes mais rápido que as verdadeiras nas redes sociais.",
      "Para verificar uma informação antes de compartilhar, use a técnica SIFT: Stop (pare antes de reagir), Investigate the source (investigue a fonte), Find better coverage (busque cobertura em outras fontes confiáveis) e Trace claims (rastreie a origem da informação).",
      "Ferramentas úteis para checagem de fatos: Agência Lupa, Aos Fatos, Boatos.org, e o recurso de busca reversa de imagens do Google (para verificar se uma foto é real ou manipulada). Sempre desconfie de informações que causam uma reação emocional muito forte.",
      "Dicas práticas: verifique a data da publicação (pode ser antiga sendo compartilhada como nova), leia além do título (manchetes sensacionalistas nem sempre refletem o conteúdo), confirme em pelo menos duas fontes confiáveis e desconfie de sites que não identificam seus autores ou fontes.",
    ],
    questoes: [
      {
        id: 1,
        pergunta: "Por que fake news se espalham tão rápido?",
        opcoes: [
          "Porque são bem escritas",
          "Porque apelam para emoções fortes como medo e raiva",
          "Porque são verdadeiras",
          "Porque são compartilhadas por jornalistas",
        ],
        respostaCorreta: 1,
      },
      {
        id: 2,
        pergunta: "O que significa o 'S' na técnica SIFT?",
        opcoes: [
          "Share (compartilhar)",
          "Stop (parar antes de reagir)",
          "Search (pesquisar)",
          "Send (enviar)",
        ],
        respostaCorreta: 1,
      },
      {
        id: 3,
        pergunta:
          "Qual ferramenta pode ser usada para verificar se uma foto é verdadeira?",
        opcoes: [
          "WhatsApp",
          "Busca reversa de imagens do Google",
          "Instagram",
          "Paint",
        ],
        respostaCorreta: 1,
      },
    ],
    forum: [
      {
        id: 1,
        autor: "Lúcia Pereira",
        iniciais: "LP",
        data: "2026-03-09",
        conteudo:
          "A técnica SIFT é incrível! Já usei duas vezes essa semana para não compartilhar fake news no grupo da família no WhatsApp.",
        respostas: 5,
      },
      {
        id: 2,
        autor: "Diego Correia",
        iniciais: "DC",
        data: "2026-03-08",
        conteudo:
          "Não conhecia o Agência Lupa. Virou meu site favorito para verificar informações antes de passar adiante. Valeu pela dica!",
        respostas: 2,
      },
    ],
  },
  {
    trilhaSlug: "saude-digital",
    moduloId: 4,
    videoTitulo: "Criando Hábitos Digitais Saudáveis",
    videoDuracao: "11:40",
    videoUrl: "https://www.youtube.com/embed/7M2B2LQf9nU",
    conteudo: [
      "O equilíbrio digital não significa abandonar a tecnologia, mas sim usá-la de forma intencional e consciente. O objetivo é que a tecnologia trabalhe a seu favor, não contra sua saúde e bem-estar.",
      "Dicas práticas para reduzir o uso excessivo: ative os relatórios de tempo de tela (Bem-Estar Digital no Android, Tempo de Uso no iPhone), defina limites diários para apps de redes sociais, desative notificações não essenciais, remova apps das telas iniciais e estabeleça 'zonas livres de tela' (como na mesa de jantar).",
      "A técnica Pomodoro pode ajudar: trabalhe focado por 25 minutos sem verificar o celular, depois faça uma pausa de 5 minutos. A cada 4 ciclos, faça uma pausa mais longa de 15-30 minutos. Isso melhora a produtividade e reduz o uso compulsivo do celular.",
      "Substitua hábitos digitais por atividades offline: em vez de rolar redes sociais antes de dormir, leia um livro; em vez de comer olhando o celular, pratique atenção plena; em vez de enviar mensagem, ligue ou encontre a pessoa pessoalmente. Pequenas mudanças fazem grande diferença ao longo do tempo.",
    ],
    questoes: [
      {
        id: 1,
        pergunta: "O que é equilíbrio digital?",
        opcoes: [
          "Não usar tecnologia nunca",
          "Usar tecnologia de forma intencional e consciente",
          "Usar o celular poucas vezes por semana",
          "Ter somente um dispositivo eletrônico",
        ],
        respostaCorreta: 1,
      },
      {
        id: 2,
        pergunta: "O que é a técnica Pomodoro?",
        opcoes: [
          "Uma dieta digital",
          "Trabalhar focado por 25 min e pausar 5 min, em ciclos",
          "Um app de meditação",
          "Uma técnica para usar menos o celular à noite",
        ],
        respostaCorreta: 1,
      },
      {
        id: 3,
        pergunta: "Qual é uma 'zona livre de tela' recomendada?",
        opcoes: [
          "O escritório",
          "A mesa de jantar",
          "O ônibus",
          "A sala de espera",
        ],
        respostaCorreta: 1,
      },
    ],
    forum: [
      {
        id: 1,
        autor: "Isabela Nunes",
        iniciais: "IN",
        data: "2026-03-09",
        conteudo:
          "Implementei a 'zona livre de tela' na hora do jantar com a família. No começo foi difícil, mas agora as conversas são muito melhores! Alguém mais experimentou?",
        respostas: 7,
      },
      {
        id: 2,
        autor: "Thiago Barros",
        iniciais: "TB",
        data: "2026-03-08",
        conteudo:
          "A técnica Pomodoro mudou minha vida na faculdade. Minha produtividade aumentou muito e diminuí o tempo no celular durante os estudos.",
        respostas: 4,
      },
    ],
  },
];

/* ===== Helpers de cor por tema ===== */
export const corMap = {
  blue: {
    bg: "bg-[var(--color-mack-bg)]",
    text: "text-[var(--color-mack)]",
    border: "border-[var(--color-mack)]",
    fill: "bg-[var(--color-mack)]",
  },
  green: {
    bg: "bg-[var(--color-mack-bg)]",
    text: "text-[var(--color-mack)]",
    border: "border-[var(--color-mack)]",
    fill: "bg-[var(--color-mack)]",
  },
  orange: {
    bg: "bg-[var(--color-mack-bg)]",
    text: "text-[var(--color-mack)]",
    border: "border-[var(--color-mack)]",
    fill: "bg-[var(--color-mack)]",
  },
  red: {
    bg: "bg-[var(--color-mack-bg)]",
    text: "text-[var(--color-mack)]",
    border: "border-[var(--color-mack)]",
    fill: "bg-[var(--color-mack)]",
  },
  purple: {
    bg: "bg-[var(--color-mack-bg)]",
    text: "text-[var(--color-mack)]",
    border: "border-[var(--color-mack)]",
    fill: "bg-[var(--color-mack)]",
  },
} as const;

export type CorKey = keyof typeof corMap;
