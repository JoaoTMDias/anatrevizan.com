# Fase 2 — manifesto do Grupo 2: Consultoria

## Fronteira

Este grupo migra o hub de Consultoria e cinco páginas de serviço da referência
Next.js. O conteúdo é preservado sem reescrita em modelos TinaCMS estruturados,
templates Astro próprios e estado `draft`, `approvalPending: true` e
`noindex: true`.

Não pertencem a este grupo o formulário, Calendly, integrações, publicação,
tradução EN, assets finais ou refinamento visual.

## Inventário de fontes

| Página | Fonte textual PT-PT | Strings | Estado de migração |
| --- | --- | ---: | --- |
| Hub Consultoria | `src/messages/pt-pt/consultoria-hub.json` + cartões usados de `src/messages/pt-pt/_interface.json` | 26 | A migrar integralmente como draft |
| Migração e Mobilidade | `src/messages/pt-pt/consultoria-migracao.json` | 39 | A migrar integralmente como draft |
| Consultoria Jurídica | `src/messages/pt-pt/consultoria-juridica.json` | 32 | A migrar integralmente como draft |
| Ambiental e ESG | `src/messages/pt-pt/consultoria-ambiental-esg.json` | 53 | A migrar integralmente como draft |
| Políticas Públicas e Governança | `src/messages/pt-pt/consultoria-politicas-publicas.json` | 30 | A migrar integralmente como draft |
| Pareceres e Notas Técnicas | `src/messages/pt-pt/consultoria-pareceres.json` | 23 | A migrar integralmente como draft |

Total: **203 strings PT-PT**.

Também são fontes estruturais os seis `page.tsx` em
`src/app/[locale]/consultoria/` e o mapa não traduzível
`src/content/consultoria.ts`. Servem para contabilizar ordem, relações,
destinos e tipos de secção; os componentes React não são copiados.

## Traduções e conteúdo inválido

Os seis JSON em `src/messages/en/consultoria-*.json` são byte a byte iguais às
fontes PT-PT. Não constituem tradução inglesa válida. Os documentos EN ficam
em draft estrutural, sem o conteúdo português e sem fallback visível.

Os JSON espanhóis são apenas referência histórica; espanhol não faz parte das
línguas publicadas em v1.

## Estrutura editorial contabilizada

- Hub: hero, introdução, três filtros, nota profissional e CTA.
- Migração: hero, introdução, seis serviços, quatro passos, crosslink, nota e CTA.
- Jurídica: hero, introdução, seis grupos de serviços com itens e CTA.
- Ambiental/ESG: hero, introdução, seis grupos de serviços, diferencial,
  credenciais, duas publicações relacionadas, nota e CTA.
- Políticas Públicas: hero, introdução, quatro grupos de serviços, nota e CTA.
- Pareceres: hero, introdução, seis tipos de trabalho, nota e CTA.

## Destinos e integrações adiados

- Os CTAs de contacto/agendamento ficam identificados editorialmente, mas a
  integração pertence ao Grupo 4/fase posterior.
- O crosslink entre Migração e Consultoria Jurídica usa a route key existente;
  não cria URL manual nem `href="#"`.
- As duas publicações da página Ambiental/ESG permanecem conteúdo estático do
  grupo; ORCID continua adiado.
- Filtros do hub serão apresentados como navegação estática acessível. Não se
  migra a implementação React nem se adiciona hidratação sem necessidade.

## Critério de conclusão

As seis páginas devem estar integralmente contabilizadas, renderizadas em
preview PT, ausentes do conteúdo visível EN, cobertas por testes e validadas
por `astro check`, testes unitários, Playwright relevante, `build:local` e
`git diff --check`. Nenhuma muda para `ready` sem revisão explícita.
