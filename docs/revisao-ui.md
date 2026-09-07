# Revisão UI — setembro de 2026

## Âmbito aprovado

R1–R7 aprovadas pelo responsável do projeto. Preservar a identidade, imagens,
conteúdo factual, secções, rotas e os dois idiomas. Sem publicação ou deploy.
D1–D5 também aprovadas e implementadas. D6 fica adiada até às fotografias definitivas.

| Tarefa | Implementação | Critério de aceitação |
| --- | --- | --- |
| R1 — Calendário mobile | Texto com quebra e ícone sem encolhimento | Texto e ícone dentro do botão a 320 px, PT/EN |
| R2 — Contacto direto | Hero compacto e atalhos para mensagem/agendamento | Âncoras visíveis e destinos preservados na troca PT/EN |
| R3 — CTAs de serviços | Ação primária no hero de consultoria, mentorias e formações | Ação disponível antes da imagem, com destino de agendamento existente |
| R4 — Hierarquia da homepage | Acessos mais compactos; diferenciais sem caixas e alinhados à esquerda; acesso académico usa o título editorial Academia | Todas as secções e textos mantidos, menor percurso até aos serviços |
| R5 — Catálogo académico | Linhas compactas e tratamento distinto para a publicação com destaque editorial | Todos os registos ORCID, filtros, contagem e links preservados |
| R6 — Composição | Políticas Públicas 2×2; última linha de cinco serviços centrada (substituída pelo índice de D2); cronologia centrada | Grelhas equilibradas em desktop e coluna única em mobile |
| R7 — Erros compreensíveis | Nome do campo e ordenação visual no resumo | Mensagens identificáveis e ligação ao campo correspondente |

## Direção artística D1–D5 implementada

Objetivo: presença editorial, calorosa e com autoridade. Preservar vinho, marfim,
Playfair e a presença pessoal de Ana; criar personalidade através da composição.

- **D1 — Hero como abertura editorial:** título maior em desktop,
  largura mais controlada e retrato de maior presença. A assimetria permite
  distinguir a homepage das páginas interiores. Manter texto e ação em HTML.
- **D2 — Ritmos por tipo de conteúdo:** serviços como índice numerado, percurso
  como cronologia e prova académica como destaque editorial. Reservar cartões
  para conteúdos que beneficiam de agrupamento e interação.
- **D3 — Prova com presença:** publicação já existente elevada
  a um bloco visual forte, associado ao contexto em que sustenta a confiança.
  Não criar contagens, prémios, testemunhos ou alegações novas.
- **D4 — Assinatura gráfica:** linhas finas e interseções inspiradas na
  ligação entre Direito, ciência e territórios. Aplicação contida em divisores
  e numeração, com elementos decorativos fora da árvore de acessibilidade.
- **D5 — Movimento estável:** blur/desaparecimento durante a leitura substituídos
  por entrada curta e feedback de hover/foco. Respeitar movimento reduzido;
  conteúdo disponível sem JavaScript e sem animação.
- **D6 — Tratamento fotográfico por função (adiado):** retrato com presença na homepage,
  imagens de contexto nas páginas de serviço e fotografias documentais na
  academia. Enquadramento e ponto focal revistos com os originais definitivos.

R8 (simplificação geral das molduras) não foi aplicada. D1 altera apenas o
enquadramento do retrato da homepage; os originais continuam preservados.

## Verificação de R1–R7

- `pnpm exec astro check`: 112 ficheiros, sem erros, warnings ou hints.
- `pnpm test`: 54 testes aprovados.
- `pnpm build:local`: conflito com o Tina dev na porta 9000. Sincronização ORCID
  (sem alterações) e validação editorial passaram; as restantes etapas foram
  concluídas com `tinacms build --local --skip-cloud-checks --port 4002
  --datalayer-port 9001 -c 'astro build'` e o relatório de build: 28/28 rotas.
- Playwright sobre o artefacto compilado: 21 testes de contacto, navegação,
  preferências e acessibilidade aprovados. Inclui regressões para calendário a
  320 px em PT/EN, ordem/nome dos erros e foco do resumo e respetiva ligação.
- Inspeção visual em Chromium: homepage, contacto, publicações, Políticas
  Públicas e Sobre em 390/1440 px; calendário a 320 px; catálogo em tema escuro.
- Filtro de publicações por 2026: 5 resultados; limpar filtros: 28 resultados.
- CTAs no hero confirmados nas seis páginas abrangidas por R3.
- `git diff --check` aprovado.

O axe da suite exclui contraste devido à limitação já documentada nos testes.
Não substitui uma auditoria abrangente, leitores de ecrã ou validação de envios
reais. Não foi executado build Tina Cloud nem realizado deploy.

## Execução de D1–D5

| Tarefa | Alteração concreta | Critério de aceitação |
| --- | --- | --- |
| D1 | Título até 72 px, composição assimétrica e retrato vertical com canto arqueado; enquadramento horizontal em ecrãs estreitos | Texto, CTA e retrato legíveis em PT/EN e sem overflow |
| D2 | Cinco serviços como lista numerada, com separadores e destino em toda a linha | Mesmos textos e destinos, ordem semântica, foco visível e coluna única em mobile |
| D3 | Publicação com destaque existente colocada primeiro, em bloco vinho; restantes publicações em coluna lateral | Destaque e dados ORCID preservados, sem novas alegações |
| D4 | Motivo SVG de linhas e interseções no hero, serviços e destaque académico | Decoração não focável e excluída da árvore de acessibilidade |
| D5 | Entrada curta do retrato e feedback nos links; removidos blur, desaparecimento ao fazer scroll e rotação contínua das molduras | Conteúdo estável durante a leitura, disponível sem JavaScript e com movimento reduzido |

Esta direção é uma escolha estética aprovada para reforçar personalidade e
hierarquia; não constitui evidência medida de melhoria de conversão.

### Verificação final de D1–D5

- `pnpm exec astro check`: 113 ficheiros, zero erros, warnings e hints.
- `pnpm test`: 54 testes aprovados.
- Build local com as portas alternativas do Tina indicadas acima: 28/28 rotas.
- Playwright sobre o build final: 22 testes de contacto, navegação, preferências
  e acessibilidade aprovados. A regressão de scroll cobre movimento normal e
  reduzido. A execução inicial revelou que os erros do formulário podiam chegar
  após o pedido de foco; o efeito agora acompanha ambos os estados e a regressão
  de foco passou após reconstrução.
- Inspeção visual da homepage PT/EN em 320, 390, 768, 1024 e 1440 px; sem overflow
  horizontal. Hero, índice e destaque académico inspecionados em desktop/mobile,
  mais homepage em tema escuro.
- Galeria local com notas: `/tmp/ana-direction/comparacao.html`.
- Tina dev regenerado após o build; `http://localhost:4321` responde 200,
  apresenta os cinco serviços e não produz erros JavaScript na verificação.
- `git diff --check` aprovado. Sem build Tina Cloud ou deploy.

Mantém-se a exclusão de contraste no axe descrita acima. D6 aguarda os originais
fotográficos definitivos; não há decisões adicionais necessárias para D1–D5.
