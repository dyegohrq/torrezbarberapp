# Documento de contexto do projeto — Torrezbarber

> Status: documento base para desenvolvimento e decisão da IA  
> Objetivo: servir como fonte de verdade para o produto, o conteúdo, o design, o SEO e a evolução do projeto.  
> Regra principal: a IA deve respeitar as informações abaixo e não inventar dados, regras de negócio, preços, horários, produtos ou funcionalidades que não estejam confirmados.

---

## 1. Resumo executivo para IA

O Torrezbarber é uma barbearia localizada em Valentina, João Pessoa — PB. O projeto atual é um site institucional/landing page voltado para conversão, com foco em apresentar a barbearia, divulgar serviços e preços, mostrar o portfólio, facilitar o contato pelo WhatsApp e incentivar o agendamento.

A prioridade é o site público. Funcionalidades avançadas como autenticação, painel administrativo, banco de dados, agenda e gestão são evoluções futuras e só devem entrar quando o negócio for definido.

O produto deve priorizar:

- conversão;
- clareza;
- simplicidade;
- SEO local;
- performance;
- acessibilidade;
- experiência mobile.

Nenhuma informação comercial, funcional ou operacional deve ser assumida sem confirmação.

---

## 2. Identidade do projeto

### Nome

Torrezbarber

### Tipo de produto

Landing page / site institucional para barbearia local, com possibilidade de evolução para agendamento e gestão.

### Negócio

Barbearia localizada em Valentina, João Pessoa — Paraíba, Brasil.

### Localização

Rua José de Oliveira Batista, 116 - Valentina, João Pessoa

### Contato

- WhatsApp: (83) 98785-0386
- Instagram: https://www.instagram.com/torrezbarber/

### Funcionamento

- Terça a domingo: 09:00 às 18:00
- Segunda: fechado
- Quantidade de barbeiros: 1

---

## 3. Objetivo do produto

O site deve funcionar como canal principal de apresentação, informação e conversão para uma barbearia local. Ele precisa:

1. apresentar a barbearia e o trabalho;
2. expor serviços e preços;
3. mostrar o portfólio real do barbeiro;
4. facilitar contato por WhatsApp;
5. facilitar o agendamento;
6. informar endereço, horários e contato;
7. divulgar produtos disponíveis;
8. aparecer para pessoas que buscam barbearia e serviços masculinos em João Pessoa;
9. transmitir profissionalismo, confiança e qualidade;
10. funcionar bem em mobile e com carregamento rápido.

### Problema que resolve

Atualmente, clientes encontram a barbearia em canais dispersos, como Instagram e WhatsApp. O site centraliza as informações principais e reduz o atrito entre descoberta, interesse, escolha do serviço e contato/agendamento.

---

## 4. Escopo atual e futuro

### 4.1. Escopo atual — obrigatório

O site público é a prioridade atual e deve conter:

- home;
- apresentação da barbearia;
- serviços;
- preços;
- galeria/trabalhos;
- informações de funcionamento;
- localização;
- contato;
- WhatsApp;
- Instagram;
- fluxo de agendamento.

### 4.2. Evolução futura — opcional e condicionada

As funcionalidades abaixo podem existir no futuro, mas não devem ser assumidas como parte do escopo atual:

- autenticação;
- cadastro de usuários;
- banco de dados;
- agenda;
- disponibilidade de horários;
- gerenciamento de clientes;
- lembretes;
- painel administrativo;
- cadastro de produtos e compras online.

> Regra: não implementar essas funcionalidades só porque “faz sentido” ou está na lista de desejos. Apenas adicionar quando o requisito de negócio for definido.

---

## 5. Público-alvo e SEO local

### Público principal

- pessoas procurando barbearia em João Pessoa/PB;
- clientes da região do Valentina;
- homens em busca de corte masculino e barba;
- pessoas pesquisando no Google antes de escolher uma barbearia;
- clientes que preferem agendar ou confirmar atendimento pelo WhatsApp.

### Busca local esperada

Termos relevantes para SEO local:

- barbearia em João Pessoa;
- barbearia no Valentina;
- barbearia Valentina João Pessoa;
- corte masculino João Pessoa;
- corte degradê João Pessoa;
- barba João Pessoa;
- barbearia masculina João Pessoa;
- barbearia perto de mim.

### Diretriz de SEO

- palavras-chave devem aparecer de forma natural;
- não usar keyword stuffing;
- priorizar conteúdo útil para pessoas reais;
- manter endereço, telefone e horários consistentes;
- evitar conteúdo artificial para manipular busca.

---

## 6. Serviços e preços confirmados

### Serviços atuais

- Corte Degradê — R$ 20,00
- Corte Social — R$ 17,00
- Barba — R$ 15,00
- Cavanhaque — R$ 10,00
- Infantil — R$ 20,00
- Pigmentação + Corte — R$ 35,00
- Luzes + Corte — R$ 70,00
- Nevou + Corte — R$ 90,00
- Perfil / Pezinho — R$ 10,00
- Freestyle — R$ 5,00
- Sobrancelha — preço ainda não definido

### Regra obrigatória

- nunca inventar o preço da sobrancelha;
- se o valor não estiver definido, o serviço deve aparecer como pendente, ser solicitado ao responsável ou não ser exibido até a confirmação.

---

## 7. Fluxo de agendamento

### Regras do fluxo atual

- o cliente agenda sem criar conta;
- a solicitação vai para o WhatsApp do barbeiro;
- a confirmação é feita manualmente;
- cancelamento e remarcação pelo site ficam para versões futuras.

### Fluxo previsto

1. cliente acessa o site;
2. visualiza serviços;
3. escolhe serviço, data e horário;
4. informa nome e telefone;
5. revisa o resumo;
6. envia solicitação;
7. mensagem chega ao WhatsApp do barbeiro;
8. barbeiro confirma manualmente.

### Dados obrigatórios do agendamento

- serviço;
- data;
- horário;
- nome do cliente;
- telefone do cliente;
- resumo da escolha.

### Duração dos serviços

A duração exata ainda não foi definida. Como referência inicial, pode-se considerar aproximadamente 30 minutos por atendimento, mas isso não deve ser tratado como regra definitiva.

### Exemplo de resumo

```text
Serviço: Corte Degradê
Data: 25/09/2026
Horário: 14:00
Nome: João
Telefone: (83) 99999-9999
```

---

## 8. WhatsApp e conversão

O WhatsApp é o principal canal de conversão do projeto. O site deve permitir contato e agendamento com o menor número possível de passos.

### Uso estratégico

- agendamento;
- confirmação;
- dúvidas;
- contato geral;
- cancelamento;
- remarcação;
- venda de produtos, quando definida.

### Mensagem pré-preenchida

O sistema pode montar uma mensagem com dados do agendamento, por exemplo:

```text
Olá! Gostaria de agendar um horário na Torrezbarber.

Serviço: Corte Degradê
Data: 25/09/2026
Horário: 14:00
Nome: João
Telefone: (83) 99999-9999
```

> A mensagem final deve seguir a regra de negócio definida posteriormente. Não assumir uma integração complexa sem confirmação.

---

## 9. UX, UI e estrutura do site

### Estrutura sugerida

- Header com logo, navegação e CTA de agendamento;
- Hero com apresentação da barbearia e CTA principal;
- Serviços com cards, nome, descrição curta e preço;
- Galeria com fotos reais do trabalho;
- Sobre a barbearia;
- Agendamento;
- Localização com endereço, mapa e botão de rota;
- Contato com WhatsApp, Instagram, horário e endereço;
- Footer com identidade, links e redes sociais.

### Diretrizes visuais

A interface deve ser:

- moderna;
- premium;
- limpa;
- profissional;
- responsiva;
- rápida;
- simples;
- orientada à conversão;
- adequada ao contexto de uma barbearia local.

### Mobile first

Grande parte dos acessos vai acontecer por celular. Por isso:

- botões devem ser fáceis de tocar;
- texto deve ser legível;
- WhatsApp deve estar sempre acessível;
- cards não devem ficar excessivamente carregados;
- formulário deve ser simples;
- imagens devem ser otimizadas;
- navegação deve ser clara.

---

## 10. Requisitos não funcionais

### Responsividade

O site deve funcionar em:

- smartphones;
- tablets;
- notebooks;
- desktops;
- telas grandes.

### Performance

Priorizar:

- imagens otimizadas;
- carregamento rápido;
- lazy loading quando apropriado;
- redução de JavaScript desnecessário;
- componentes eficientes.

### Acessibilidade

Considerar:

- contraste adequado;
- HTML semântico;
- navegação por teclado;
- labels nos formulários;
- textos alternativos;
- foco visual;
- mensagens de erro úteis e compreensíveis.

### SEO técnico

Considerar:

- title;
- meta description;
- headings;
- URLs amigáveis;
- sitemap;
- robots.txt;
- canonical quando necessário;
- Open Graph;
- dados estruturados quando apropriado.

---

## 11. Validação e estados de interface

Todos os formulários devem validar entradas e demonstrar feedback claro.

### Regras gerais

- nome obrigatório e sem espaço vazio;
- e-mail válido quando utilizado;
- telefone compatível com o padrão brasileiro;
- serviço, data e horário obrigatórios no agendamento;
- estados de carregamento, sucesso, erro e campo inválido devem existir.

### Estados que a interface precisa considerar

- inicial;
- carregando;
- sucesso;
- erro;
- campo inválido;
- formulário incompleto;
- operação cancelada;
- ausência de dados.

> Evitar interfaces em que o usuário clica e não recebe nenhum retorno.

---

## 12. Segurança, privacidade e dados

O projeto pode lidar com dados pessoais como:

- nome;
- telefone;
- e-mail;
- histórico de agendamentos.

### Regras

- não coletar ou armazenar informações sem necessidade;
- não expor dados pessoais publicamente;
- não inserir credenciais em código-fonte ou frontend;
- futuras autenticação e banco de dados devem considerar princípios de LGPD.

---

## 13. Rastreamento e métricas

O projeto deve permitir monitoramento de ações importantes, sem prejudicar privacidade ou performance.

Eventos úteis:

- clique no WhatsApp;
- clique em Instagram;
- clique em “Agendar”;
- envio do formulário;
- início do agendamento;
- conclusão do agendamento;
- clique em rota/localização;
- visualização de serviços.

---

## 14. Regras de conteúdo para IA

### Pode

- melhorar textos;
- criar descrições de serviços;
- estruturar títulos;
- criar CTAs;
- adaptar texto para SEO local;
- melhorar clareza e legibilidade;
- ajustar conteúdo para mobile.

### Não pode

- inventar avaliações;
- inventar clientes;
- inventar preços;
- inventar serviços;
- inventar horários;
- inventar promoções;
- inventar formas de pagamento;
- inventar produtos;
- inventar certificações;
- inventar número de barbeiros;
- inventar informações sobre a empresa.

Se algo não estiver disponível, marcar como pendente ou pedir confirmação.

---

## 15. O que NÃO deve ser assumido

Os seguintes itens ainda precisam ser definidos antes de implementar evoluções mais avançadas:

- duração de cada serviço;
- política de atraso;
- política de cancelamento;
- antecedência mínima para agendamento;
- limite de agendamentos por cliente;
- confirmação manual ou automática;
- reserva real de horário antes da confirmação;
- formas de pagamento;
- produtos vendidos;
- preços dos produtos;
- preço da sobrancelha;
- necessidade de criação de conta;
- login obrigatório;
- tecnologia de autenticação;
- banco de dados;
- sistema de notificações;
- lembretes;
- política de privacidade;
- termos de uso;
- identidade visual final;
- logo e materiais visuais;
- stack tecnológica do projeto.

---

## 16. Prioridades de desenvolvimento

### Fase 1 — site público

- estrutura da landing page;
- header;
- hero;
- serviços;
- preços;
- galeria;
- sobre a barbearia;
- localização;
- horário;
- WhatsApp;
- Instagram;
- footer;
- responsividade;
- SEO básico;
- performance.

### Fase 2 — agendamento

- formulário;
- serviço;
- data;
- horário;
- nome;
- telefone;
- resumo;
- validação;
- integração com WhatsApp;
- confirmação.

### Fase 3 — sistema futuro

- autenticação;
- cadastro;
- banco de dados;
- agenda;
- disponibilidade;
- gestão de clientes;
- lembretes;
- painel administrativo.

### Fase 4 — produtos futuros

- cadastro de produtos;
- catálogo;
- preços;
- disponibilidade;
- contato/compra via WhatsApp.

---

## 17. Regras obrigatórias para a IA

Ao desenvolver qualquer parte do projeto, a IA deve:

1. entender primeiro o objetivo da funcionalidade;
2. não criar regras de negócio que não existem;
3. respeitar o escopo atual e distinguir o que é obrigatório do que é futuro;
4. reutilizar componentes quando fizer sentido;
5. evitar duplicação;
6. priorizar código legível e sustentável;
7. validar entradas do usuário;
8. tratar estados de erro e carregamento;
9. pensar primeiro em mobile;
10. preservar SEO e acessibilidade;
11. não quebrar o que já funciona;
12. não substituir bibliotecas ou tecnologias sem necessidade;
13. explicar mudanças importantes antes de alterar arquitetura;
14. solicitar confirmação quando uma decisão de negócio for necessária;
15. não assumir que uma funcionalidade desejável já faz parte do escopo obrigatório.

---

## 18. Critérios de sucesso

O projeto será bem-sucedido quando:

- o visitante entender rapidamente o que é a barbearia;
- encontrar serviços e preços sem esforço;
- visualizar o trabalho do barbeiro;
- localizar endereço e horário facilmente;
- conseguir iniciar um agendamento rápido;
- entrar em contato pelo WhatsApp sem fricção;
- usar o site com facilidade no celular;
- ter boa presença local em busca orgânica;
- transmitir profissionalismo e confiança;
- permitir evolução futura sem refazer toda a aplicação.

---

## 19. Perguntas pendentes para fechar o contexto

Essas respostas devem ser obtidas antes da implementação de funcionalidades mais avançadas.

### Agendamento

1. O cliente pode escolher qualquer horário ou o barbeiro precisa aprovar cada solicitação?
2. Qual é a duração de cada serviço?
3. Existe intervalo entre atendimentos?
4. Existe almoço/pausa no horário da barbearia?
5. Com quanto tempo de antecedência o cliente pode agendar?
6. O cliente pode agendar para o mesmo dia?
7. Quantos agendamentos um cliente pode fazer?
8. O cliente pode cancelar pelo site?
9. Até quando antes do horário ele pode cancelar?
10. O cliente pode remarcar?
11. O agendamento será confirmado automaticamente ou manualmente?

### Conta do cliente

12. O cliente precisa criar conta para agendar?
13. O agendamento pode ser feito sem login?
14. Para que o login seria usado?
15. O cliente terá uma área para ver seus agendamentos?

### Administração

16. O barbeiro terá painel administrativo?
17. Quem poderá acessar esse painel?
18. O barbeiro poderá bloquear horários?
19. O barbeiro poderá criar agendamentos manualmente?
20. O barbeiro poderá editar ou excluir serviços?
21. O barbeiro poderá alterar preços?
22. O barbeiro poderá cadastrar produtos?

### Produtos

23. Quais produtos serão vendidos?
24. O site será só catálogo ou haverá compra online?
25. O pagamento será feito pelo site ou pelo WhatsApp?
26. Haverá estoque?
27. O cliente poderá adicionar produtos ao carrinho?

### Identidade visual e materiais

28. Quais cores devem ser usadas?
29. Existe logo em alta resolução?
30. Existem fotos profissionais da barbearia?
31. Existe padrão visual no Instagram?
32. Há referências de sites que sejam visualmente interessantes?

### Tecnologia

33. Qual stack será utilizada?
34. O projeto será somente frontend inicialmente?
35. Será usado Next.js?
36. Qual banco de dados será usado?
37. Qual solução de autenticação será usada?
38. Onde o projeto será hospedado?
39. O WhatsApp será apenas um link com mensagem pré-preenchida ou haverá integração mais avançada?

---

## 20. Regra final para futuras IAs

> Este documento é a fonte de verdade do projeto Torrezbarber.
>
> Antes de desenvolver qualquer funcionalidade, a IA deve verificar se ela está dentro do escopo definido.
>
> Se houver decisão ainda não definida, a IA deve identificar a pendência e solicitar confirmação antes de criar regras de negócio.
>
> A IA deve priorizar: conversão → experiência do usuário → simplicidade → SEO local → performance → acessibilidade → manutenção do código.
>
> Nenhuma informação comercial deve ser inventada.

---

## 21. Prompt base para IA

Use este bloco como contexto rápido em ferramentas de IA ou desenvolvimento assistido:

```text
Você é assistente de desenvolvimento para o projeto Torrezbarber.

Contexto:
- Nome: Torrezbarber
- Tipo: landing page/site institucional para barbearia local
- Localização: Valentina, João Pessoa - PB
- Endereço: Rua José de Oliveira Batista, 116 - Valentina, João Pessoa
- Contato: WhatsApp (83) 98785-0386; Instagram @torrezbarber
- Funcionamento: terça a domingo, 09:00 às 18:00; segunda fechado
- Quantidade de barbeiros: 1

Objetivo principal:
- aumentar visibilidade e converter visitantes em clientes e agendamentos

Escopo atual:
- site público: home, serviços, preços, galeria, funcionamento, localização, WhatsApp, Instagram, agendamento
- autenticação, banco de dados, agenda, painel e gestão são evoluções futuras

Serviços confirmados:
- Corte Degradê: R$ 20,00
- Corte Social: R$ 17,00
- Barba: R$ 15,00
- Cavanhaque: R$ 10,00
- Infantil: R$ 20,00
- Pigmentação + Corte: R$ 35,00
- Luzes + Corte: R$ 70,00
- Nevou + Corte: R$ 90,00
- Perfil / Pezinho: R$ 10,00
- Freestyle: R$ 5,00
- Sobrancelha: preço pendente

Regras obrigatórias:
- não inventar preços, serviços, horários, regras ou informações comerciais
- não assumir que autenticação, banco ou agenda fazem parte do escopo atual
- agendamento sem login, enviado ao WhatsApp do barbeiro para confirmação manual
- priorizar mobile, conversão, SEO local e acessibilidade
- manter dados consistentes com endereço, WhatsApp, funcionamento e localização

Se alguma decisão de negócio não estiver definida, identifique a pendência e peça confirmação antes de implementar.
```
