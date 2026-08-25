# Fase 2 — manifesto do Grupo 3: Academia

## Fronteira

Este grupo migra o hub Academia e as páginas Mentorias, Publicações, Eventos,
Palestras e Formações. A referência Next.js define conteúdo e intenção, mas os
componentes React não são copiados. O conteúdo PT-PT foi importado em `draft` e
`noindex: true`; a revisão editorial das seis páginas foi aprovada pela Ana em
24 de agosto de 2026, pelo que `approvalPending` passou para `false`.

Não pertencem ao grupo a integração ORCID em build, o kit descarregável final,
assets fotográficos finais, formulário, agendamento, tradução EN ou
refinamento visual.

## Inventário textual

| Página | Fonte principal PT-PT | Strings da página | Conteúdo adicional usado |
| --- | --- | ---: | --- |
| Hub Academia | `src/messages/pt-pt/academia-hub.json` | 10 | 5 títulos de `areas.academia` + CTA `Aceder` |
| Mentorias | `src/messages/pt-pt/academia-mentorias.json` | 21 | — |
| Publicações | `src/messages/pt-pt/academia-publicacoes.json` | 15 | snapshot e metadados descritos abaixo |
| Eventos | `src/messages/pt-pt/academia-eventos.json` | 7 | CTA `Ver kit de palestrante`; journal tem 0 entradas |
| Palestras | `src/messages/pt-pt/academia-palestras.json` | 22 | CTAs `Descarregar kit de palestrante` e `Convidar para palestrar` |
| Formações | `src/messages/pt-pt/academia-formacoes.json` | 22 | — |

Total da interface/páginas: **106 strings PT-PT**. Os seis `page.tsx` acrescentam
12 strings SEO (título e descrição por página), também contabilizadas para
migração sem reescrita.

As descrições curtas `areas.academia.*.descNav` já estão preservadas na
navegação TinaCMS criada na fase 1 e não são duplicadas nos modelos de página.

## Publicações e ORCID

A fase 4 substituiu o snapshot histórico de 25 registos pela coleção Markdown
gerada a partir do ORCID. Os metadados bibliográficos vêm exclusivamente do
ORCID; idioma, temas, destaque e prioridade constituem um overlay editorial
opcional preservado pelo identificador estável da obra. Obras sem URL HTTPS
continuam visíveis sem ligação clicável e nunca geram `href="#"`.

## Eventos, recomendações e placeholders

- `src/content/eventos.ts` define o modelo, mas contém zero participações reais.
  A página preserva o estado vazio; não são inventados eventos.
- `src/content/recomendacoes.ts` contém zero recomendações. O bloco não é
  publicado e não são inventados depoimentos.
- A página Palestras apresenta uma fotografia placeholder sem asset real.
  Regista-se a lacuna e usa-se alternativa estática acessível, sem fingir que
  existe uma fotografia aprovada.
- O botão de download do kit usa `href="#"`. O texto e a intenção são
  preservados, mas não se publica um controlo sem destino. O contacto continua
  disponível pela route key existente.
- Os assets hero vazios já inventariados no Grupo 1 não são copiados.

## Traduções

Os seis ficheiros `src/messages/en/academia-*.json` são byte a byte iguais aos
PT-PT. Não constituem tradução EN válida. Os documentos ingleses permanecem
estruturais, draft/noindex e sem fallback português visível. Espanhol não é
publicado em v1.

## Modelos e templates implementados

- Hub académico com cinco destinos explícitos.
- Template de serviço académico partilhado apenas por Mentorias e Formações.
- Repositório de Publicações alimentado pela coleção Markdown ORCID partilhada.
- Página de Eventos com estado vazio editorial honesto.
- Página de Palestras com biografia, temas, conteúdo previsto do kit e CTA de
  contacto, mas sem download ou imagem falsos.

Não foi criado page builder, renderer universal ou migração mecânica dos
componentes Next.js.

## Critério de conclusão

As seis páginas e todas as fontes acima devem estar contabilizadas, renderizar
em preview PT, não expor o conteúdo português em EN e passar validação de
conteúdo, testes unitários, Playwright relevante, `astro check`, `build:local`
e `git diff --check`. Nenhuma página muda para `ready` sem revisão explícita.

A revisão editorial foi concluída em 24 de agosto de 2026. As páginas mantêm-se
em `draft` e `noindex`; a integração ORCID foi posteriormente executada na fase
4 sem alterar o estado editorial das páginas.
