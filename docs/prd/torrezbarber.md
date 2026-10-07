# PRD — Torrezbarber

> Tipo: PRD inicial · Data: 2026-09-30
> **Status:** Aguardando implementação
>
> <!-- Valores possíveis: "Aguardando implementação" | "Implementada". Atualize para "Implementada" quando todas as specs estiverem concluídas. -->

## 1. Visão geral

O Torrezbarber é o site e sistema de uma barbearia local em Valentina, João Pessoa — PB (1 barbeiro). O produto permite que o visitante conheça a barbearia (apresentação, portfólio, serviços/preços e catálogo de produtos), entre em contato pelo WhatsApp e agende horários com disponibilidade real, baseada na duração dos serviços e em blocos de 30 minutos. O cliente precisa de conta. O dono acessa um painel único para gerenciar agenda, funcionamento, portfólio, serviços e produtos. Pedido de produtos via WhatsApp exige login e mensagem com dados do cliente; dúvidas pelo WhatsApp não exigem conta.

## 2. Problema que resolve

Hoje informações e atendimento ficam dispersos (Instagram, WhatsApp manual). O cliente não sabe com clareza se um horário cabe no tempo do serviço escolhido. O barbeiro não tem uma visão centralizada de quem ocupa cada horário. O site centraliza apresentação, conversão, reserva automática de agenda e gestão básica do dono.

## 3. Público-alvo

- **Cliente final:** homens e demais interessados em serviços de barbearia em João Pessoa/Valentina que querem ver serviços, preços, trabalhos e marcar horário pelo site.
- **Dono/barbeiro:** único administrador da barbearia, que gerencia horários, conteúdo e agenda.

Não é “para todo mundo”: o recorte é barbearia local com um profissional e clientes que agendam online.

## 4. Objetivo do recorte atual

Entregar o V1 completo: site público + conta do cliente + motor de disponibilidade/agendamento (incluindo cancelar/remarcar) + painel do dono (agenda, cancelamento administrativo, bloqueio de horários, CMS de funcionamento/serviços/produtos/portfólio) + WhatsApp para contato e interesse em produtos. Sem compra online, sem recorrência/fidelidade e sem lembrete de aniversário (a conta existe para viabilizar isso depois).

## 5. Funcionalidades

**Essenciais:**

- Site público: apresentação, portfólio, serviços/preços, catálogo de produtos, localização/funcionamento, contato.
- WhatsApp de **dúvidas/contato** (visitante não precisa estar logado).
- Pedido de **produto via WhatsApp** (cliente logado; mensagem com produto, preço, nome, e-mail e telefone do cliente).
- Conta do cliente (cadastro/login): nome, telefone, e-mail, senha.
- Agendamento no site com disponibilidade real (blocos de 30 min; duração = soma dos serviços; reserva automática).
- Um único agendamento futuro por cliente.
- Cliente cancela ou remarca até 2 horas antes; horário libera imediatamente.
- Painel do dono (1 usuário): ver agenda livre/ocupada; ver detalhes do ocupado; cancelar agendamento; bloquear horário; gerenciar funcionamento/pausa, portfólio, serviços e produtos.
- Conteúdo inicial pode ser de exemplo; o dono ajusta no painel.

**Desejáveis:**

- Não há desejáveis neste recorte — o que não for essencial está fora do escopo para não inflar o V1.

## 6. Fora do escopo

- Compra/pagamento online, carrinho e estoque.
- Programa de fidelidade (ex.: 8º corte grátis) e lembrete de aniversário.
- Coleta de data de nascimento neste recorte.
- Vários barbeiros / múltiplas cadeiras.
- Notificações por SMS ou e-mail (incluindo lembretes de horário).
- Mensagem automática de agendamento no WhatsApp (agendamento é só no site).
- Remarcação feita pelo dono no lugar do cliente.
- Área do cliente com histórico longo de benefícios/recorrência.
- App mobile nativo.
- Integração avançada de WhatsApp (API oficial além de link `wa.me` com texto).

## 7. Regras de negócio

- Regra 1: Existe um único barbeiro/profissional e um único usuário dono no painel.
- Regra 2: Funcionamento padrão de referência: terça a domingo, 09:00–18:00; segunda fechado. O dono pode alterar dias, horários e pausa (ex.: almoço).
- Regra 3: A grade de disponibilidade usa blocos de 30 minutos.
- Regra 4: A duração e o valor de um agendamento são a **soma** dos serviços escolhidos.
- Regra 5: Um serviço de N minutos a partir do horário H ocupa os blocos de início que cobrem esse intervalo. Ex.: 60 min às 09:00 ocupa 09:00 e 09:30; o próximo início livre possível é 10:00.
- Regra 6: Ao confirmar o agendamento, a reserva é **automática** e os blocos ocupados ficam indisponíveis imediatamente.
- Regra 7: O cliente precisa estar autenticado para agendar, cancelar ou remarcar.
- Regra 8: O cliente pode ter **apenas um agendamento futuro** por vez (status ativo/confirmado). Só pode criar outro após concluir, cancelar ou remarcar o atual.
- Regra 9: É permitido agendar para o **mesmo dia**, desde que o intervalo completo caiba no expediente (respeitando pausas) e ainda não tenha começado.
- Regra 10: Cancelamento e remarcação pelo **cliente** só até **2 horas antes** do início. Após isso, o sistema impede.
- Regra 11: Ao cancelar ou remarcar, os blocos do horário antigo **liberam imediatamente**.
- Regra 12: Remarcação = escolher nova data/horário válidos para os mesmos (ou novos) serviços, respeitando as mesmas regras de disponibilidade; o agendamento anterior deixa de ocupar a agenda.
- Regra 13: O **dono** pode **cancelar** um agendamento e **bloquear** horários (sem cliente). O dono **não** remarca pelo cliente.
- Regra 14: Dados do horário ocupado visíveis ao dono: nome, telefone, e-mail, serviços, duração total e valor total.
- Regra 15: Compra/pedido de produto neste recorte = redirecionar ao WhatsApp **somente com cliente autenticado**; mensagem pré-preenchida com **nome do produto, preço do produto, nome do cliente, e-mail do cliente e telefone/contato do cliente**; não há checkout no site.
- Regra 16: Agendamento **não** dispara WhatsApp automático **para o cliente**; ao confirmar, cancelar ou remarcar, o **barbeiro recebe notificação** (visível no painel/agenda — não exige SMS/e-mail neste recorte).
- Regra 17: O ícone/link de WhatsApp genérico (dúvidas, contato, header/footer/localização) **não exige login**.
- Regra 18: O CTA de **pedir/comprar produto** via WhatsApp **exige login**; se não autenticado, o sistema direciona para login/cadastro e só então abre o WhatsApp com a mensagem completa.
- Regra 19: Serviços e produtos podem começar com dados de exemplo; preços/durações definitivos são responsabilidade do dono no painel.
- Regra 20: Não inventar preços, serviços ou produtos comerciais não confirmados no conteúdo público final; exemplos devem ser claramente gerenciáveis/substituíveis pelo dono.
- Regra 21: Dados pessoais do cliente não são públicos; só o dono autenticado vê detalhes de agendamentos.
- Regra 22: Conta do cliente armazena no mínimo: nome, telefone, e-mail e senha (credencial).
- Regra 23: O cliente não pode marcar horário anterior ao horário atual; horários que antecedem a hora atual ficam bloqueados no sistema (inclusive no dia de hoje).

## 8. Fluxos principais

### Fluxo 1 — Visitar o site e conhecer a barbearia

1. Visitante acessa o site.
2. Vê apresentação, portfólio, serviços/preços, produtos, funcionamento e localização.
3. Pode abrir WhatsApp de contato ou seguir para agendar / ver produto.
4. Pode fazer tudo isso sem o login, mas se o visitante for fazer um agendamento é obrigatório ter o login no sistema

### Fluxo 2a — Dúvidas via WhatsApp (sem login)

1. Visitante acessa o site (logado ou não).
2. Clica no **símbolo/CTA de WhatsApp** de contato ou dúvidas (header, localização, footer, etc.).
3. O sistema abre o WhatsApp com mensagem genérica de contato (sem exigir conta).
4. A conversa continua fora do site.

### Fluxo 2b — Pedido de produto via WhatsApp (com login)

1. Usuário escolhe um produto no catálogo.
2. Clica para **pedir/comprar via WhatsApp** (CTA do produto).
3. Se **não** estiver logado → redireciona para login/cadastro; após autenticar, retoma a intenção de pedido.
4. Se estiver logado → abre WhatsApp com mensagem pré-preenchida contendo: **nome do produto, preço, nome do cliente, e-mail e telefone/contato**.
5. A venda continua fora do site (sem pagamento no site).

**Exemplo de mensagem (pedido de produto — texto pode ser ajustado na implementação, campos obrigatórios):**

```text
Olá! Gostaria de pedir um produto na Torrezbarber.

Produto: [nome]
Preço: [preço formatado]
Cliente: [nome]
E-mail: [e-mail]
Telefone: [telefone]
```

### Fluxo 3 — Criar conta e entrar

1. Cliente acessa cadastro.
2. Informa nome, telefone, e-mail e senha.
3. Sistema valida e cria a conta.
4. Cliente faz login e fica autenticado.

### Fluxo 4 — Agendar horário

1. Cliente autenticado inicia agendamento.
2. Seleciona um ou mais serviços.
3. Sistema calcula duração total e valor total.
4. Cliente escolhe data; sistema mostra horários de início disponíveis para aquela duração.
5. Cliente escolhe horário, revisa resumo e confirma.
6. Sistema reserva automaticamente e mostra confirmação e envia para o barbeiro o horário preenchido.
7. Se já existir outro agendamento futuro, o sistema impede novo agendamento.

### Fluxo 5 — Cancelar ou remarcar (cliente)

1. Cliente autenticado abre seu agendamento futuro.
2. Se faltar mais de 2 horas para o início, pode cancelar ou remarcar.
3. Cancelar: confirma → horário libera → fica sem agendamento futuro e envia notificação para o barbeiro.
4. Remarcar: escolhe nova data/horário (e pode ajustar serviços conforme regras) → antigo libera → novo ocupa e quando finalizar envia notificação para o barbeiro.

### Fluxo 6 — Dono gerencia a agenda

1. Dono faz login no painel.
2. Vê grade com livres, ocupados e bloqueados.
3. Em ocupado, abre detalhes (nome, contato, e-mail, tempo, valor).
4. Pode cancelar o agendamento (libera horário) ou bloquear faixas sem cliente.

### Fluxo 7 — Dono gerencia conteúdo operacional

1. Dono ajusta dias/horários de funcionamento e pausas.
2. Gerencia serviços (nome, preço, duração, ativo/inativo).
3. Gerencia produtos do catálogo (nome, preço, foto, etc.).
4. Gerencia fotos do portfólio.
5. Site público e disponibilidade passam a refletir essas alterações.

## 9. Critérios de aceite

- O visitante consegue ver portfólio, serviços/preços, produtos e informações de contato/localização.
- O visitante consegue abrir WhatsApp de dúvidas/contato **sem** login.
- Visitante **não** logado que tenta pedir produto via WhatsApp é direcionado ao login antes de abrir a mensagem.
- Cliente logado consegue pedir produto via WhatsApp com mensagem contendo produto, preço, nome, e-mail e telefone.
- O cliente consegue criar conta e entrar com nome, telefone, e-mail e senha.
- O cliente autenticado consegue agendar um ou mais serviços e ver apenas horários que cabem na duração total.
- Ao confirmar, os blocos ocupados ficam indisponíveis para outros.
- O cliente não consegue ter dois agendamentos futuros ao mesmo tempo.
- O cliente consegue cancelar ou remarcar somente até 2 horas antes; o horário antigo libera na hora.
- O dono vê quem ocupa cada horário e os detalhes (nome, telefone, e-mail, duração, valor).
- O dono consegue cancelar agendamento e bloquear horário; não remarca pelo cliente.
- O dono consegue alterar funcionamento, portfólio, serviços e produtos.
- O sistema não processa pagamento de produtos no site.
- Agendamento não envia WhatsApp automático ao cliente; barbeiro recebe notificação no painel ao confirmar, cancelar ou remarcar.
- No mesmo dia, horários já passados não aparecem como disponíveis.

## 10. Referência de UI e design

A implementação visual do site público e do fluxo de agendamento **deve seguir** o design system e os layouts aprovados em `docs/DESIGN/`. Em caso de conflito entre mock e regra de negócio deste PRD, **prevalece o PRD** (comportamento); o layout/visual continua sendo a referência estética.

### 10.1. Fonte da verdade visual

- **Design system (tokens, tipografia, componentes, elevação, breakpoints):** [`docs/DESIGN/DESIGN.md`](../DESIGN/DESIGN.md)
- **Direção:** Dark Luxury Minimalism — fundo obsidiana/carbono, ouro antigo como acento (`#C5A059` / `#D4AF37`), tipografia Playfair Display (hero/editorial) + Plus Jakarta Sans (UI), cards com borda sutil e radius baixo (soft architectural).

### 10.2. Layouts de referência (mocks)

| Arquivo | Uso |
| --- | --- |
| [`docs/DESIGN/decktop.png`](../DESIGN/decktop.png) | Home / landing **desktop**: header, hero full-bleed, serviços, produtos, vantagens, “Vamos cortar?”, localização, footer |
| [`docs/DESIGN/tablet.png`](../DESIGN/tablet.png) | Home **tablet**: mesmas seções, adaptação de grid |
| [`docs/DESIGN/mobile.png`](../DESIGN/mobile.png) | Home **mobile**: hero, serviços em carrossel/cards, produtos, vantagens, agendamento, localização, footer |
| [`docs/DESIGN/menu.png`](../DESIGN/menu.png) | Menu mobile (drawer lateral): item ativo em ouro, demais em branco |
| [`docs/DESIGN/Frame 3.png`](../DESIGN/Frame%203.png) | Agendamento **etapa 1/5** — Escolha seu serviço (lista, seleção, resumo quantidade/valor, CONTINUAR) |
| [`docs/DESIGN/Frame 3-1.png`](../DESIGN/Frame%203-1.png) | Agendamento **etapa 2/5** — Escolha a data (calendário, dias disponíveis/indisponíveis, VOLTAR / CONTINUAR) |
| [`docs/DESIGN/Frame 3-2.png`](../DESIGN/Frame%203-2.png) | Agendamento **etapa 3/5** — Escolha o horário (grade 30 min, slot selecionado, nota de barbeiro único) |
| [`docs/DESIGN/Frame 3-3.png`](../DESIGN/Frame%203-3.png) | Agendamento **etapa 4/5** — Seus dados (coleta/confirmação dos dados do cliente no fluxo) |
| [`docs/DESIGN/Frame 3-4.png`](../DESIGN/Frame%203-4.png) | Agendamento **etapa 5/5** — Confira seu agendamento (resumo + CONFIRMAR AGENDAMENTO) |
| [`docs/DESIGN/torrezbarber-logo.png`](../DESIGN/torrezbarber-logo.png) | **Logo oficial** — monograma TB (fundo transparente ou claro para favicon/header sobre escuro) |
| [`docs/DESIGN/hero-desktop.jpg`](../DESIGN/hero-desktop.jpg) | **Fotografia hero desktop** — fachada/vitrine Torrez Barber, identidade ouro sobre vidro escuro |
| [`docs/DESIGN/hero-mobile.jpg`](../DESIGN/hero-mobile.jpg) | **Fotografia hero mobile** — mesma linha visual, enquadramento vertical para hero mobile |

> **Assets de marca:** se os três arquivos acima ainda não existirem em `docs/DESIGN/`, copie para esses caminhos a logo (PNG fundo removido) e as fotos hero desktop/mobile aprovadas — o PRD trata esses nomes como referência fixa para implementação.

### 10.3. Identidade da logo (Torrez Barber)

A marca visual da barbearia deve ser respeitada em header, footer, favicon e materiais do site:

- **Monograma:** letras **TB** em serif clássico, bold, levemente sobrepostas (T à esquerda/mais alta, B à direita).
- **Ícones superiores/inferiores:** **coroa** centrada acima do TB; **bigode** estilizado abaixo do TB (versão vitrine completa); versão compacta para header pode usar só TB + coroa + ornamento inferior.
- **Wordmark:** **TORREZ BARBER** em caps, serif elegante; subtítulo **— BARBEARIA —** em sans menor, entre linhas horizontais finas.
- **Acabamento:** textura **ouro metálico / bronze** (`#C5A059`, `#D4AF37`, sombras para relevo 3D) sobre fundo **preto/obsidiana**; em fundos claros usar arquivo com fundo removido (`torrezbarber-logo.png`) mantendo o ouro.
- **Ornamentos:** flourish simétrico abaixo do monograma; linhas horizontais finas enquadrando TB (como na vitrine).
- **Uso digital:** header = monograma ou TB reduzido; hero pode sobrepor headline sobre foto da fachada (`hero-desktop.jpg` / `hero-mobile.jpg`); não distorcer proporções; área de respiro mínima ao redor do símbolo.
- **Consistência:** ouro da logo alinha ao **primary/surface-tint** do `DESIGN.md`; não substituir por outro amarelo genérico.

### 10.4. Hero (fotografia de referência)

Além do layout wireframe em `decktop.png` / `mobile.png`, a **imagem de fundo do hero** segue as fotos reais:

- **Desktop (`hero-desktop.jpg`):** vitrine escura com logo dourada grande, faixa/reflexo de rua; composição wide para full-bleed atrás do headline e CTA **AGENDAR**.
- **Mobile (`hero-mobile.jpg`):** mesma identidade (logo na vitrine, ambiente premium); crop vertical; headline e CTA legíveis sobre overlay escuro se necessário para contraste.
- **Comportamento:** imagem otimizada (lazy load abaixo da dobra se aplicável); fallback cor sólida `#131313` se a foto falhar; texto hero com destaque em ouro conforme mocks.

### 10.5. Estrutura esperada do site público (a partir dos mocks)

Ordem de seções da landing (desktop/tablet/mobile):

1. Header: logo TB, navegação (Início, Serviços, Preço, Galeria, Quem somos, Localização), CTA **AGENDAR**; no mobile, hamburger → drawer (`menu.png`).
2. Hero full-bleed com **`hero-desktop.jpg` / `hero-mobile.jpg`**, headline com destaque em ouro, CTA principal de agendar; logo no header conforme seção 10.3.
3. Faixa de benefícios (ícones + textos curtos).
4. **Nosso serviço** — cards com foto, nome, descrição curta e preço em ouro.
5. **Veja nossos produtos** — cards com imagem, nome, preço e CTA de interesse (no produto: WhatsApp, não checkout).
6. **Por que cortar na Torrez Barber?** — blocos numerados 01/02/03.
7. **Vamos cortar?** — passos explicativos + CTA AGENDAR (copy dos passos deve refletir agendamento **no site**, não “confirmar via WhatsApp”).
8. **Estamos no Valentina** — endereço, WhatsApp, horários, mapa, Instagram.
9. Footer com logo, links, contato e funcionamento.

### 10.6. Fluxo visual de agendamento (5 etapas)

O modal/fluxo de agendamento segue o padrão dos Frames 3*:

1. **Serviço(s)** — seleção com preço visível; barra de resumo (quantidade + total).
2. **Data** — calendário; dias fechados/indisponíveis esmaecidos; texto de funcionamento dinâmico (vindo do painel), não hardcoded do mock.
3. **Horário** — grade de inícios em blocos de 30 min; apenas slots válidos para a duração total; aviso de barbeiro único.
4. **Seus dados** — com conta obrigatória: preferir dados da conta logada (nome, telefone, e-mail); se o mock pedir campos, alinhar aos campos do cadastro (sem inventar campos fora do PRD).
5. **Confirmação** — resumo (serviço(s), data, horário, cliente, telefone, valor em ouro) e botão **CONFIRMAR AGENDAMENTO** (reserva no site; **não** redireciona para WhatsApp).

Padrão de chrome do modal: indicador `AGENDAMENTO - ETAPA X DE 5` em ouro, fechar (X), títulos brancos, subtítulo cinza, primário ouro sólido, secundário outline `VOLTAR`.

### 10.7. Conflitos mock × PRD (resolver assim)

- Copy “Confirme via WhatsApp” na seção “Vamos cortar?” dos mocks → no produto: passo de **confirmação no site**.
- Rodapé do calendário nos mocks (“domingo fechado / seg–sáb”) → usar **funcionamento real** do painel (padrão de negócio: terça–domingo 09:00–18:00, segunda fechada, alterável pelo dono).
- Botão de produto “ADICIONAR” / aparência de carrinho → comportamento = **pedido via WhatsApp com login** e mensagem completa (Regras 15 e 18; sem carrinho/pagamento).
- Etapa de dados mostrando só WhatsApp → incluir/alinhar aos dados da conta: nome, telefone, e-mail.
- Preços, telefones e textos de exemplo nos PNGs são **placeholder visual**; conteúdo comercial vem do painel / dados confirmados do negócio.

### 10.8. O que os mocks não cobrem

Não há mock aprovado neste pacote para: telas de login/cadastro do cliente, painel do dono, agenda administrativa, cancelar/remarcar. Nessas telas, **reutilizar o mesmo design system** (`DESIGN.md`: cores, tipografia, botões, inputs, elevação) sem inventar outra identidade visual.

## 11. Stack

Em alto nível (projeto já iniciado em Next.js):

- **Frontend / app:** Next.js + TypeScript + Tailwind + componentes Shadcn/Radix (já no repositório).
- **Auth + banco + storage:** Supabase (autenticação de cliente e dono, persistência de agenda/conteúdo, arquivos de imagens do portfólio/produtos).
- **WhatsApp:** link com mensagem pré-preenchida (sem API de mensagens neste recorte).
- **UI:** seguir `docs/DESIGN/DESIGN.md` + mocks listados na seção 10.

## 12. Justificativa da stack

O repositório já usa Next.js 16, React, TypeScript, Tailwind e Shadcn — manter evita reinvenção. Auth, banco e storage prontos no Supabase cobrem conta do cliente, painel do dono, agenda e mídia sem montar backend completo do zero. WhatsApp por link é proporcional ao objetivo de conversão local sem checkout. O pacote em `docs/DESIGN` já define a identidade visual aprovada.

## 13. Fases de construção

### Fase 1 — Base do site público e conteúdo

Objetivo: site institucional utilizável com conteúdo gerenciável (mesmo que inicialmente com exemplos).
Specs:

- Spec 01 — Site público institucional
- Spec 02 — Catálogo de produtos com WhatsApp
- Spec 03 — Gestão de conteúdo pelo dono (funcionamento, serviços, produtos, portfólio)

### Fase 2 — Contas e acesso

Objetivo: identidade do cliente e acesso único do dono.
Specs:

- Spec 04 — Conta e autenticação do cliente
- Spec 05 — Login do painel do dono

### Fase 3 — Motor de agenda e agendamento do cliente

Objetivo: disponibilidade real, reserva automática e ciclo do cliente.
Specs:

- Spec 06 — Motor de disponibilidade e ocupação de blocos
- Spec 07 — Agendamento pelo cliente
- Spec 08 — Cancelar e remarcar pelo cliente

### Fase 4 — Agenda operacional do dono

Objetivo: visão e controle operacional da grade.
Specs:

- Spec 09 — Painel de agenda do dono (visão, detalhes, cancelar, bloquear)

## 14. Specs funcionais detalhadas

> Cada spec deve ser autossuficiente: um agente de codificação vai ler SÓ esta spec (mais as dependências) para montar o plano técnico e implementar. Preencha todos os campos; se um não se aplica, escreva "Não se aplica" e o porquê.

### Spec 01 — Site público institucional

- **Fase:** Fase 1 — Base do site público e conteúdo
- **Objetivo (o quê):** Entregar as páginas/seções públicas de apresentação da Torrezbarber: hero/apresentação, serviços e preços, portfólio, funcionamento, localização e contato.
- **Intenção (por quê):** Converter visitante em interesse (agendar ou falar no WhatsApp) com clareza local e profissionalismo, sem depender de Instagram.
- **Contexto:** Barbearia em Valentina, João Pessoa — PB; 1 barbeiro; WhatsApp e Instagram já conhecidos no contexto do negócio. **UI obrigatória:** seção 10 (logo 10.3, hero 10.4, mocks `decktop.png`, `tablet.png`, `mobile.png`, `menu.png`, `torrezbarber-logo.png`, `hero-desktop.jpg`, `hero-mobile.jpg`) + `docs/DESIGN/DESIGN.md`. Copy “Vamos cortar?” = confirmação no site (não WhatsApp).
- **Atores:** Visitante (não autenticado) e cliente autenticado navegando o site público.
- **Descrição do comportamento:** O site exibe informações da barbearia na estrutura das landings de referência (header com logo oficial, hero com fotos de referência, benefícios, serviços, produtos, vantagens, como agendar, localização, footer), lista serviços com preços (dados iniciais podem ser exemplos), mostra galeria de trabalhos, informa endereço e horários vigentes. CTAs: agendar (exige login no fluxo), WhatsApp de **dúvidas** (sem login). Navegação geral **sem login** (Fluxo 1). Conteúdo reflete cadastro do dono quando existir; até lá, exemplos substituíveis.
- **Entradas e saídas:** Entrada: acesso às rotas públicas. Saída: páginas renderizadas com conteúdo; links para WhatsApp de contato e para fluxo de agendamento.
- **Dados/entidades envolvidos (conceitual):** Serviço (nome, descrição curta, preço, duração, ativo); item de portfólio (imagem, legenda opcional); informações de funcionamento (dias, abertura, fechamento, pausas); dados de contato/localização.
- **Estados e transições:** Não se aplica como máquina de estados de negócio; estados de UI: carregando, com conteúdo, vazio (sem serviços/fotos).
- **Regras de negócio:** Não inventar preços/serviços comerciais definitivos além do que estiver configurado; segunda fechada é o padrão de referência até o dono alterar; mobile first.
- **Validações:** Não se aplica a formulário nesta spec.
- **Fluxo do usuário (passo a passo):**
  1. Acessa o site.
  2. Navega seções.
  3. Clica em agendar ou WhatsApp conforme interesse.
- **Casos de borda e erros:** Sem serviços ativos → seção vazia com mensagem clara. Sem fotos → galeria vazia sem quebrar layout. Conteúdo longo em mobile → legível e tocável.
- **Impacto no existente:** Substitui a home placeholder do Next.js pelo produto Torrezbarber.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um visitante na home, Quando a página carrega, Então ele vê apresentação, serviços, portfólio, funcionamento, localização e contato.
  - Dado um serviço ativo cadastrado, Quando o visitante abre a seção de serviços, Então nome e preço aparecem.
  - Dado o CTA de WhatsApp de dúvidas/contato, Quando um visitante não logado clica, Então abre conversa sem exigir login.
  - Dado o hero desktop/mobile, Quando a home carrega, Então usa as fotos de referência da seção 10.4 com logo conforme 10.3.
  - Dado viewport mobile, Quando o visitante abre o menu, Então o drawer segue o padrão de `menu.png` (item ativo em ouro).
- **Definição de pronto:** Site público navegável em desktop, tablet e mobile alinhado aos mocks da seção 10, com seções e CTAs funcionando.
- **Dependências:** Nenhuma para uma primeira versão com conteúdo de exemplo; idealmente alinha com Spec 03 para conteúdo dinâmico. Referência visual: seção 10.
- **Fora do escopo desta spec:** Agendamento, login, painel, catálogo detalhado de compra (Spec 02), motor de horários.

### Spec 02 — Catálogo de produtos com WhatsApp

- **Fase:** Fase 1 — Base do site público e conteúdo
- **Objetivo (o quê):** Exibir produtos e permitir **pedido via WhatsApp** apenas para cliente autenticado, com mensagem completa de interesse de compra.
- **Intenção (por quê):** Monetizar produtos sem checkout; identificar quem pede; dúvidas gerais continuam abertas sem login.
- **Contexto:** Compra online fica para o futuro. **UI:** seção de produtos dos mocks; CTA “comprar/adicionar” = pedido WhatsApp (Regras 15, 17, 18). **Depende de Spec 04** para login no pedido.
- **Atores:** Visitante (só visualiza catálogo); cliente autenticado (pede via WhatsApp).
- **Descrição do comportamento:** Lista produtos ativos (nome, preço, imagem, descrição opcional). **Pedido via WhatsApp:** exige login; monta mensagem com **nome do produto, preço do produto, nome do cliente, e-mail e telefone/contato** (dados da conta). Abre deep link WhatsApp. **WhatsApp de dúvidas** (ícone global) permanece acessível sem login (Spec 01). Sem carrinho/pagamento.
- **Entradas e saídas:** Entrada: clique no CTA de pedido do produto + sessão autenticada. Saída: WhatsApp com texto estruturado ou redirecionamento para login.
- **Dados/entidades envolvidos (conceitual):** Produto; Cliente (nome, e-mail, telefone).
- **Estados e transições:** Anônimo vê catálogo → login → pedido WhatsApp.
- **Regras de negócio:** Regras 15, 17, 18; produtos inativos ocultos; preço na mensagem = preço vigente do catálogo.
- **Validações:** Produto ativo com nome e preço; cliente autenticado com nome, e-mail e telefone preenchidos na conta.
- **Fluxo do usuário (passo a passo):**
  1. Abre catálogo (com ou sem login).
  2. Escolhe produto.
  3. Clica pedir via WhatsApp.
  4. Se não logado → login/cadastro → retoma.
  5. WhatsApp abre com mensagem completa.
- **Casos de borda e erros:** Sem produtos → vazio. Não logado → não abre mensagem de pedido até autenticar. Falha ao abrir WhatsApp → contato alternativo na página.
- **Impacto no existente:** Nova seção/fluxo no site público.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado visitante não logado, Quando clica pedir produto via WhatsApp, Então é direcionado ao login e não envia mensagem de pedido antes disso.
  - Dado cliente logado e produto “Pomada X” a R$ 30, Quando confirma pedido WhatsApp, Então a mensagem contém nome do produto, preço, nome, e-mail e telefone do cliente.
  - Dado ícone WhatsApp de dúvidas, Quando visitante não logado clica, Então abre WhatsApp sem exigir conta.
- **Definição de pronto:** Catálogo + distinção clara pedido (login) vs dúvidas (sem login) + mensagem de pedido completa.
- **Dependências:** Spec 01; Spec 04 (login para pedido); Spec 03 para catálogo dinâmico.
- **Fora do escopo desta spec:** Estoque, carrinho, pagamento, registro de venda no banco.

### Spec 03 — Gestão de conteúdo pelo dono (funcionamento, serviços, produtos, portfólio)

- **Fase:** Fase 1 — Base do site público e conteúdo
- **Objetivo (o quê):** Permitir que o dono altere horários de funcionamento e pausas, serviços (preço, duração, ativo), produtos e fotos do portfólio.
- **Intenção (por quê):** O negócio muda preços/durações/fotos sem depender de desenvolvedor; o V1 começa com exemplos e o dono completa.
- **Contexto:** Painel autenticado do dono (Spec 05). Site público e motor de agenda consomem esses dados.
- **Atores:** Dono.
- **Descrição do comportamento:** No painel, o dono cria/edita/desativa serviços e produtos, define duração em minutos (múltiplos de 30 ou valores que o motor consiga mapear para blocos de 30), define preço, envia/remove imagens de portfólio e produtos, e configura dias de funcionamento, abertura, fechamento e intervalos de pausa. Alterações passam a valer para o site e para o cálculo de disponibilidade.
- **Entradas e saídas:** Entradas: formulários de CRUD de conteúdo e funcionamento. Saídas: conteúdo atualizado no site; parâmetros usados pela agenda.
- **Dados/entidades envolvidos (conceitual):** Funcionamento (por dia: aberto/fechado, início, fim, pausas); Serviço; Produto; Item de portfólio.
- **Estados e transições:** Serviço/produto ativo ↔ inativo. Dia aberto ↔ fechado.
- **Regras de negócio:** Apenas o dono autentificado gerencia; inativos não aparecem para agendar/comprar; funcionamento inválido (fim antes do início, pausa fora do expediente) não pode ser salvo.
- **Validações:** Campos obrigatórios (nome, preço ≥ 0, duração > 0 para serviço); imagens em formatos aceitos; horários coerentes.
- **Fluxo do usuário (passo a passo):**
  1. Dono entra no painel.
  2. Edita funcionamento / serviços / produtos / portfólio.
  3. Salva.
  4. Site e agenda refletem a mudança.
- **Casos de borda e erros:** Tentar salvar horário inválido → erro claro. Remover serviço já usado em agendamentos passados → serviço pode ficar inativo sem apagar histórico (não quebrar agendamentos existentes).
- **Impacto no existente:** Torna o conteúdo do site dinâmico.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado o dono autenticado, Quando altera o preço de um serviço e salva, Então o site público exibe o novo preço.
  - Dado o dono, Quando define uma pausa no meio do dia, Então a disponibilidade futura respeita essa pausa (após Spec 06).
  - Dado o dono, Quando desativa um produto, Então ele some do catálogo público.
- **Definição de pronto:** CRUD utilizável das quatro áreas com efeito no site público.
- **Dependências:** Spec 05 (login do dono). Pode ser implementada em paralelo controlado com Spec 01/02 usando dados seed.
- **Fora do escopo desta spec:** Agenda do dia (Spec 09), agendamento do cliente, fidelidade.

### Spec 04 — Conta e autenticação do cliente

- **Fase:** Fase 2 — Contas e acesso
- **Objetivo (o quê):** Permitir cadastro e login do cliente com nome, telefone, e-mail e senha.
- **Intenção (por quê):** Identificar quem agenda (necessário para “um agendamento futuro por vez” e para evolução futura de fidelidade/aniversário, sem implementar esses benefícios agora).
- **Contexto:** Agendamento, cancelamento, remarcação e **pedido de produto via WhatsApp** exigem cliente autenticado. **UI:** sem mock dedicado — aplicar `docs/DESIGN/DESIGN.md` (seção 10.8).
- **Atores:** Cliente.
- **Descrição do comportamento:** Cadastro cria conta com os quatro campos. Login autentica. Logout encerra sessão. Recuperação de senha: se a stack de auth oferecer fluxo padrão, pode ser incluído; caso contrário, documentar como mínimo login/cadastro e tratar recuperação como melhoria só se couber sem expandir escopo — neste PRD o mínimo obrigatório é cadastro + login + logout.
- **Entradas e saídas:** Entradas: dados de cadastro/login. Saídas: sessão autenticada ou erros de validação.
- **Dados/entidades envolvidos (conceitual):** Cliente (nome, telefone, e-mail, credencial de senha).
- **Estados e transições:** Anônimo → autenticado → anônimo (logout).
- **Regras de negócio:** E-mail único; telefone em formato brasileiro válido; senha com requisito mínimo de segurança razoável; sem data de nascimento neste recorte.
- **Validações:** Nome não vazio; e-mail válido; telefone válido; senha atendendo política mínima; e-mail/telefone já usados → erro.
- **Fluxo do usuário (passo a passo):**
  1. Acessa cadastro.
  2. Preenche dados e confirma.
  3. Entra na conta.
  4. Pode sair.
- **Casos de borda e erros:** Credenciais inválidas → mensagem genérica segura. Tentativa de agendar sem login → redireciona/pede autenticação.
- **Impacto no existente:** Novas telas de auth no produto.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um visitante, Quando conclui cadastro válido, Então passa a conseguir fazer login.
  - Dado e-mail já cadastrado, Quando tenta cadastrar de novo, Então o sistema impede e informa.
  - Dado cliente autenticado, Quando faz logout, Então perde acesso às ações que exigem conta.
- **Definição de pronto:** Cadastro, login e logout funcionando com os campos definidos.
- **Dependências:** Nenhuma de negócio além da base do app.
- **Fora do escopo desta spec:** Perfil avançado, histórico de fidelidade, data de nascimento, login social.

### Spec 05 — Login do painel do dono

- **Fase:** Fase 2 — Contas e acesso
- **Objetivo (o quê):** Restringir o painel administrativo a um único usuário dono autenticado.
- **Intenção (por quê):** Proteger agenda e dados de clientes; separar claramente área pública da operacional.
- **Contexto:** Há apenas um barbeiro/dono. Clientes não acessam o painel. **UI:** sem mock dedicado — aplicar `docs/DESIGN/DESIGN.md` (seção 10.8).
- **Atores:** Dono.
- **Descrição do comportamento:** Tela de login do painel. Após autenticar como dono, acessa funcionalidades administrativas (conteúdo e agenda). Usuário sem papel de dono não entra no painel. Sessão protegida em todas as ações administrativas.
- **Entradas e saídas:** Entradas: credenciais do dono. Saídas: sessão administrativa ou negação de acesso.
- **Dados/entidades envolvidos (conceitual):** Conta do dono (credenciais + papel/admin).
- **Estados e transições:** Não autenticado → autenticado como dono → logout.
- **Regras de negócio:** Somente o dono; clientes não têm acesso ao painel mesmo autenticados como clientes.
- **Validações:** Credenciais válidas; autorização de papel dono.
- **Fluxo do usuário (passo a passo):**
  1. Acessa URL/área do painel.
  2. Faz login.
  3. Navega funções admin.
  4. Logout.
- **Casos de borda e erros:** Cliente tenta URL do painel → bloqueado. Sessão expirada → pede login de novo.
- **Impacto no existente:** Área administrativa nova.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado o dono com credenciais corretas, Quando faz login, Então acessa o painel.
  - Dado um cliente autenticado, Quando tenta acessar o painel, Então é impedido.
- **Definição de pronto:** Login/logout do dono e bloqueio de não-donos.
- **Dependências:** Nenhuma além da base de auth.
- **Fora do escopo desta spec:** Múltiplos funcionários, permissões granulares, convite de usuários.

### Spec 06 — Motor de disponibilidade e ocupação de blocos

- **Fase:** Fase 3 — Motor de agenda e agendamento do cliente
- **Objetivo (o quê):** Calcular horários de início disponíveis em uma data com base no funcionamento, pausas, bloqueios, agendamentos existentes e duração total solicitada, usando blocos de 30 minutos.
- **Intenção (por quê):** Evitar overbooking e materializar a regra “duração ocupa os blocos necessários”.
- **Contexto:** Núcleo compartilhado por agendamento do cliente, remarcação e visão do dono.
- **Atores:** Sistema (usado por cliente e dono indiretamente).
- **Descrição do comportamento:** Para uma data e uma duração total D (minutos), o motor gera possíveis horários de início a cada 30 min dentro do expediente, excluindo pausas. Um início H só é válido se todos os blocos de 30 min necessários para cobrir D a partir de H estiverem livres (sem agendamento ativo e sem bloqueio) e inteiramente dentro do expediente/fora de pausas. Exemplo confirmado: D=60, H=09:00 → ocupa 09:00 e 09:30; 10:00 pode ser início de outro atendimento se livre.
- **Entradas e saídas:** Entradas: data, duração total, (opcional) agendamento a ignorar na remarcação. Saídas: lista de horários de início disponíveis; ou indicação de ocupação por bloco.
- **Dados/entidades envolvidos (conceitual):** Funcionamento do dia; pausa; agendamento ativo (início, duração); bloqueio (início, duração ou faixa).
- **Estados e transições:** Bloco livre ↔ ocupado por agendamento ↔ bloqueado pelo dono.
- **Regras de negócio:** Grade 30 min; soma de durações; não atravessar pausa/fechamento; segunda ou dia fechado → sem horários; reserva automática implica exclusão imediata dos blocos; **Regra 23:** inícios no passado (hoje) não são oferecidos.
- **Validações:** Data válida; duração > 0; duração que não cabe no dia → lista vazia.
- **Fluxo do usuário (passo a passo):**
  1. Usuário escolhe data (e serviços → duração).
  2. Sistema consulta o motor.
  3. Exibe só inícios possíveis.
- **Casos de borda e erros:** Dois clientes tentam o mesmo horário ao mesmo tempo → apenas um confirma; o outro recebe indisponibilidade. Remarcação deve ignorar a própria reserva antiga ao recalcular. Dia só com pausa cobrindo tudo → nenhum horário.
- **Impacto no existente:** Base para Specs 07–09.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um agendamento de 60 min às 09:00, Quando outro cliente pede inícios no mesmo dia, Então 09:00 e 09:30 não aparecem; 10:00 pode aparecer se couber.
  - Dado uma pausa 12:00–13:00, Quando a duração atravessaria a pausa, Então esse início não é oferecido.
  - Dado um bloqueio do dono, Quando o cliente consulta, Então os blocos bloqueados não estão disponíveis.
  - Dado o dia de hoje às 14:00, Quando o cliente consulta horários, Então inícios antes de 14:00 não aparecem.
- **Definição de pronto:** Regras de ocupação cobertas por cenários verificáveis (incluindo concorrência básica).
- **Dependências:** Spec 03 (funcionamento/serviços) para dados reais; pode usar fixtures enquanto isso.
- **Fora do escopo desta spec:** UI completa de agendamento, pagamentos, fila de espera.

### Spec 07 — Agendamento pelo cliente

- **Fase:** Fase 3 — Motor de agenda e agendamento do cliente
- **Objetivo (o quê):** Permitir que o cliente autenticado escolha um ou mais serviços, veja duração/valor totais, escolha data/horário disponível e confirme a reserva automática.
- **Intenção (por quê):** Converter interesse em horário reservado de verdade, sem depender de confirmação manual no WhatsApp.
- **Contexto:** Usa Spec 04 e Spec 06. Agendamento é só no site (sem WhatsApp automático). **UI obrigatória:** fluxo em 5 etapas dos Frames `Frame 3.png` → `Frame 3-1.png` → `Frame 3-2.png` → `Frame 3-3.png` → `Frame 3-4.png` (seção 10.4), com tokens de `DESIGN.md`.
- **Atores:** Cliente autenticado.
- **Descrição do comportamento:** Fluxo visual em 5 etapas: (1) selecionar serviços (1..N) com resumo quantidade/valor; (2) escolher data no calendário (incluindo hoje, se couber; dias indisponíveis esmaecidos; funcionamento dinâmico); (3) escolher início disponível na grade de 30 min (**sem horários já passados no dia atual**); (4) confirmar/exibir dados da conta (nome, telefone, e-mail); (5) revisar resumo e confirmar no site. Sistema cria agendamento ativo, ocupa blocos e **notifica o barbeiro no painel** (Regra 16). Se o cliente já tem agendamento futuro ativo, bloqueia novo. Não envia WhatsApp ao cliente.
- **Entradas e saídas:** Entradas: serviços, data, horário. Saídas: agendamento confirmado ou erros.
- **Dados/entidades envolvidos (conceitual):** Agendamento (cliente, serviços, início, duração total, valor total, status ativo); Cliente.
- **Estados e transições:** Rascunho na UI → ativo/confirmado. (Cancelado/remarcado tratados na Spec 08.)
- **Regras de negócio:** Login obrigatório; um futuro por vez; soma duração/valor; mesmo dia permitido se o intervalo ainda não começou e cabe; reserva automática.
- **Validações:** Pelo menos um serviço ativo; horário ainda disponível no momento da confirmação; sem outro futuro ativo.
- **Fluxo do usuário (passo a passo):**
  1. Login (se preciso).
  2. Etapa 1 — escolhe serviço(s) e vê total.
  3. Etapa 2 — escolhe data.
  4. Etapa 3 — escolhe horário disponível.
  5. Etapa 4 — confere dados da conta.
  6. Etapa 5 — revisa resumo e confirma no site.
  7. Vê comprovação do agendamento.
- **Casos de borda e erros:** Horário pegou entre a escolha e a confirmação → erro e atualiza lista. Já tem futuro → mensagem orientando cancelar/remarcar o atual. Sem horários no dia → estado vazio. Fechar (X) no meio do fluxo → abandona sem reservar.
- **Impacto no existente:** Principal conversão do produto.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado cliente autenticado sem agendamento futuro, Quando confirma um horário livre na etapa 5, Então o agendamento fica ativo e os blocos somem para outros.
  - Dado cliente com agendamento futuro, Quando tenta criar outro, Então o sistema impede.
  - Dado seleção de dois serviços, Quando revisa na etapa 5, Então duração e valor são a soma.
  - Dado agendamento confirmado, Quando o fluxo termina, Então o barbeiro recebe notificação no painel e o cliente não recebe WhatsApp automático.
  - Dado o fluxo aberto, Quando o usuário navega as etapas, Então a UI segue o padrão dos Frames 3* (indicador de etapa, VOLTAR/CONTINUAR, resumo final com valor em ouro).
- **Definição de pronto:** Fluxo ponta a ponta com ocupação real, regra de unicidade e UI alinhada aos Frames da seção 10.
- **Dependências:** Spec 04, Spec 06; serviços da Spec 03; referência visual seção 10.
- **Fora do escopo desta spec:** Cancelar/remarcar (Spec 08), painel do dono, WhatsApp de agendamento.

### Spec 08 — Cancelar e remarcar pelo cliente

- **Fase:** Fase 3 — Motor de agenda e agendamento do cliente
- **Objetivo (o quê):** Permitir que o cliente cancele ou remarque seu agendamento futuro até 2 horas antes do início, liberando a grade imediatamente.
- **Intenção (por quê):** Dar autonomia ao cliente e manter a agenda limpa sem intervenção manual constante.
- **Contexto:** Apenas o cliente remarca. O dono cancela/bloqueia em outra spec, mas não remarca.
- **Atores:** Cliente autenticado dono do agendamento.
- **Descrição do comportamento:** Cliente vê seu agendamento futuro. Se `agora <= início - 2h`, pode cancelar (status cancelado, blocos liberados, **notificação ao barbeiro**) ou remarcar (nova data/horário/serviços conforme regras, libera antigo, ocupa novo, **notificação ao barbeiro**). Dentro da janela de 2h, ações bloqueadas com mensagem clara.
- **Entradas e saídas:** Entradas: confirmação de cancelamento ou novos dados de remarcação. Saídas: agenda atualizada; feedback de sucesso/erro.
- **Dados/entidades envolvidos (conceitual):** Agendamento (status: ativo, cancelado; vínculo com novo ao remarcar, se houver rastreio).
- **Estados e transições:** Ativo → cancelado; ativo → substituído por novo ativo (remarcação) com liberação do anterior.
- **Regras de negócio:** Só o cliente titular; limite 2h; liberação imediata; após cancelar, pode criar novo (porque não há mais futuro ativo); remarcação respeita motor de disponibilidade e um-por-vez (o novo substitui o antigo na mesma operação).
- **Validações:** Janela de 2h; horário novo ainda livre; pertencimento do agendamento ao cliente.
- **Fluxo do usuário (passo a passo):**
  1. Abre “meu agendamento”.
  2. Escolhe cancelar ou remarcar.
  3. Confirma / escolhe novo horário.
  4. Vê resultado; grade pública atualiza.
- **Casos de borda e erros:** Faltam 1h59 → não permite. Remarcação para horário que não cabe → erro. Tentar cancelar agendamento de outro cliente → negado.
- **Impacto no existente:** Completa o ciclo de vida do agendamento do lado do cliente.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado agendamento em 3 horas, Quando o cliente cancela, Então os blocos ficam livres na hora.
  - Dado agendamento em 1 hora, Quando o cliente tenta cancelar ou remarcar, Então o sistema impede.
  - Dado remarcação válida, Quando confirma novo horário, Então o antigo libera e o novo ocupa.
- **Definição de pronto:** Cancelar e remarcar com janela de 2h e liberação imediata verificáveis.
- **Dependências:** Spec 07, Spec 06.
- **Fora do escopo desta spec:** Remarcação pelo dono, multa, reembolso, SMS/e-mail ao barbeiro (notificação = painel neste recorte).

### Spec 09 — Painel de agenda do dono (visão, detalhes, cancelar, bloquear)

- **Fase:** Fase 4 — Agenda operacional do dono
- **Objetivo (o quê):** Dar ao dono a visão da grade (livre/ocupado/bloqueado), detalhes do ocupado, cancelamento administrativo e bloqueio de horários sem cliente.
- **Intenção (por quê):** Operar o dia a dia (faltas, pedidos por telefone, folgas) sem depender só do cancelamento do cliente.
- **Contexto:** Complementa a regra de que o cliente cancela/remarca; o dono não remarca no lugar do cliente.
- **Atores:** Dono.
- **Descrição do comportamento:** Agenda por dia/semana (forma visual a critério de UX, desde que clara). Ocupado mostra ação para ver: nome, telefone, e-mail, serviços, duração total, valor total. Dono pode cancelar agendamento (libera blocos). Dono pode criar bloqueios (faixa ou blocos) sem cliente. Dono não inicia fluxo de remarcação pelo cliente.
- **Entradas e saídas:** Entradas: seleção de dia, abrir detalhes, cancelar, criar/remover bloqueio. Saídas: grade atualizada; detalhes do cliente no contexto admin.
- **Dados/entidades envolvidos (conceitual):** Agendamento; Bloqueio; Cliente (dados de contato).
- **Estados e transições:** Livre → ocupado/bloqueado; ocupado → livre (cancelamento do dono); bloqueado → livre (remover bloqueio).
- **Regras de negócio:** Só dono; cancelamento do dono libera na hora; bloqueios removem disponibilidade; dados sensíveis só no painel; sem remarcar pelo dono.
- **Validações:** Bloqueio dentro de lógica de horário; não expor dados a não-donos.
- **Fluxo do usuário (passo a passo):**
  1. Dono abre agenda.
  2. Identifica livres/ocupados/bloqueados.
  3. Abre detalhes de um ocupado.
  4. Cancela ou cria bloqueio conforme necessidade.
- **Casos de borda e erros:** Cancelar já cancelado → idempotente/mensagem. Bloquear horário já ocupado → impedir ou exigir cancelar antes (comportamento deve ser explícito na implementação: **impedir bloqueio sobre ocupado** e orientar a cancelar primeiro).
- **Impacto no existente:** Fecha o controle operacional da Spec 06/07.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um horário ocupado, Quando o dono abre detalhes, Então vê nome, telefone, e-mail, duração e valor total.
  - Dado um agendamento ativo, Quando o dono cancela, Então o horário fica livre para novos clientes.
  - Dado um bloqueio criado, Quando um cliente consulta disponibilidade, Então aquele intervalo não aparece.
  - Dado o painel, Quando o dono busca remarcar pelo cliente, Então essa ação não existe.
- **Definição de pronto:** Grade utilizável no dia a dia com detalhes, cancelar e bloquear.
- **Dependências:** Spec 05, Spec 06, Spec 07.
- **Fora do escopo desta spec:** Relatórios financeiros, comissão, múltiplos profissionais, remarcação pelo dono.

## 15. Ordem recomendada de implementação

1. Spec 01 — Site público institucional
2. Spec 02 — Catálogo de produtos com WhatsApp
3. Spec 05 — Login do painel do dono
4. Spec 03 — Gestão de conteúdo pelo dono
5. Spec 04 — Conta e autenticação do cliente
6. Spec 06 — Motor de disponibilidade e ocupação de blocos
7. Spec 07 — Agendamento pelo cliente
8. Spec 08 — Cancelar e remarcar pelo cliente
9. Spec 09 — Painel de agenda do dono

Seguir essa ordem evita construir agenda sem conteúdo/funcionamento, e evita UI de agendamento sem o motor e sem auth. O painel de agenda do dono vem por último porque depende de reservas reais existirem para validar o fluxo operacional.
