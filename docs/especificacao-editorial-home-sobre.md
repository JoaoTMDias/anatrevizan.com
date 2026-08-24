# Fase 2 — auditoria e manifesto editorial

> Grupo 1: Home e Sobre. Criado em 24 de agosto de 2026.

## Proveniência e regras

- Fonte oficial de implementação: repositório Astro `anatrevizan.com`, branch criada de `migration/astro`.
- Fonte editorial histórica: `versao-nextjs/src/messages`, páginas React e dados em `src/content`.
- O repositório de referência não contém metadados Git no caminho fornecido; não foi possível associar o inventário a um commit.
- Este documento não existia no filesystem no início da implementação, embora estivesse indicado como separador aberto no IDE.
- Todo o texto importado permanece em `draft`, com `approvalPending: true` e `noindex: true`. Importação não equivale a aprovação factual, profissional, académica, jurídica ou linguística.

## Auditoria das 19 páginas

| Grupo | Rotas canónicas | Fonte Next.js | Estado na auditoria |
|---|---|---|---|
| 1 | Home; Sobre | 33 + 57 strings de página, interface partilhada e três destaques ORCID | Migrado neste grupo; PT por aprovar; EN é cópia integral de PT e não é tradução válida |
| 2 | Consultoria; Migração e Mobilidade; Jurídica; Ambiental e ESG; Políticas Públicas; Pareceres | 187 strings de página e catálogo partilhado | Adiado para o grupo 2; conteúdo profissional por validar |
| 3 | Academia; Mentorias; Publicações; Eventos; Palestras; Formações | 97 strings de página, snapshot ORCID e coleções vazias | Adiado para o grupo 3; integração ORCID fica numa fase posterior |
| 4 | Contacto; Agendamento | 7 strings de página e interface partilhada | Adiado para o grupo 4; formulário e Calendly não são implementados nesta fase |
| 5 | Privacidade; Termos; Cookies | Apenas títulos e “Página em construção” | Placeholders contabilizados; não constituem conteúdo legal publicável |

Todos os 15 ficheiros de mensagens ingleses têm contagens e conteúdo iguais aos equivalentes PT-PT (274 strings de página no total). São fontes preservadas como tradução inválida, nunca fallback publicável.

## Manifesto do grupo 1

| Página/origem | Conteúdo contabilizado | Destino/estado |
|---|---|---|
| Home `messages/pt-pt/home.json` | Hero, 5 palavras de marca, 2 portas, 4 diferenciais, títulos de Consultoria e Academia, 5 credenciais e CTA final | Migrado integralmente para campos estruturados TinaCMS; draft por aprovação |
| Home `_interface.json` | Rótulos dos dois hubs, 5 resumos de serviços e CTAs visíveis | Migrado para o documento Home para preservar o texto efetivamente apresentado |
| Home `publicacoes-orcid.json` + `publicacoesMeta.ts` | Os três destaques selecionados pelo código Next.js e o selo “Citado pela OCDE” | Snapshot estático editorial; integração e sincronização ORCID adiadas |
| Home `messages/en/home.json` | 33 strings, todas iguais a PT | Preservado no repositório-fonte e contabilizado como tradução inválida; documento EN continua estrutural, sem fallback visível |
| Sobre `messages/pt-pt/sobre.json` | Hero, 2 parágrafos, 7 marcos, 2 áreas de atuação, 6 valores, 8 redes e CTA | Migrado integralmente para campos estruturados TinaCMS; draft por aprovação |
| Sobre `_interface.json` | CTAs “Ver kit de palestrante” e “Agendar primeiro contacto” | Migrado para o documento Sobre |
| Sobre `messages/en/sobre.json` | 57 strings, todas iguais a PT | Preservado no repositório-fonte e contabilizado como tradução inválida; documento EN continua estrutural, sem fallback visível |

## Pendências e conteúdo não publicável

- As afirmações sobre OAB, graus académicos, bolsas, vínculos, docência, certificação, idiomas, jurisdições e experiência permanecem por aprovação da Ana e revisão adequada.
- A Home referencia páginas ainda estruturais. Os destinos são rotas canónicas reais, sem `href="#"`, mas o conteúdo dessas páginas só será migrado nos grupos respetivos.
- Duas publicações do snapshot completo usam `href="#"`; não fazem parte dos três destaques migrados e ficam registadas para correção na fase ORCID.
- A referência contém 33 assets hero de zero bytes. Nenhum foi copiado ou publicado. A imagem válida `hero-home.webp` também não é importada neste grupo porque a licença e aprovação do asset ainda não estão registadas.
- O formulário `mailto:`, o embed Calendly, a sincronização ORCID, o kit de palestrante e os textos legais permanecem adiados.

## Critério de conclusão

O grupo está concluído quando os dois templates específicos funcionarem em preview, o manifesto e os testes cobrirem as fontes acima, e `astro check`, testes, build local e verificação do diff passarem. Nenhum documento muda para `ready` sem aprovação explícita.
