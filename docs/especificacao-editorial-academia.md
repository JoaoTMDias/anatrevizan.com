# Fase 2 — manifesto do Grupo 3: Academia

## Fronteira

Este grupo migra o hub Academia e as páginas Mentorias, Publicações, Eventos,
Palestras e Formações. A referência Next.js define conteúdo e intenção, mas os
componentes React não são copiados. O conteúdo PT-PT entra em `draft`, com
`approvalPending: true` e `noindex: true`.

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

- `src/content/publicacoes-orcid.json` contém 25 registos e 136 campos string.
- Sete valores são vazios e não são promovidos a conteúdo válido.
- Dois registos usam `link: "#"`: `Environmental Dumping and Sustainable
  Policies` e `Selo verde e sua importância para o Pantanal`. Serão preservados
  sem link clicável e marcados como placeholder herdado.
- `src/content/publicacoesMeta.ts` acrescenta metadados a seis DOI: seis
  idiomas, 15 etiquetas temáticas e o destaque `Citado pela OCDE`.
- O snapshot histórico será migrado como conteúdo estático editável neste
  grupo. A consulta automática ORCID, validação externa e fallback de build
  permanecem para a fase de integração.

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
- Repositório estático de Publicações com 25 registos, sem antecipar a
  integração ORCID; 23 ligações válidas e dois placeholders não clicáveis.
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
