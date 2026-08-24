# Fase 2 — manifesto do Grupo 5: Páginas legais

## Fronteira

Este grupo abrange Política de Privacidade, Termos de Utilização e Política de
Cookies. A referência Next.js é fonte histórica a contabilizar, mas não contém
texto jurídico migrável. Os componentes React não são copiados e não serão
inventadas cláusulas, bases legais, prazos de retenção ou garantias.

As três páginas permanecem em `draft`, com `approvalPending: true` e
`noindex: true`. A redação e aprovação jurídica final, consent management e
ativação de terceiros pertencem a trabalho posterior com revisão qualificada.

## Inventário textual

| Fonte | Conteúdo existente | Classificação | Tratamento |
| --- | --- | --- | --- |
| `_interface.json > legal` | `Política de Privacidade`, `Termos de Utilização`, `Política de Cookies` | 3 títulos | Preservados como títulos das rotas |
| `_interface.json > common.inicio` | `Início` | Interface partilhada | Já preservado na navegação Astro |
| `_interface.json > common.em_construcao` | `Página em construção — o conteúdo desta secção será adicionado em breve.` | Placeholder explícito | Contabilizado, mas não promovido a texto legal |
| `_interface.json > cta` | `Agendar primeiro contacto`, `Falar sobre o meu caso` | 2 CTAs partilhados | Destinos existentes; não constituem conteúdo legal |
| Três `page.tsx` | Sem metadata própria ou texto adicional | Estrutura | Substituída por templates Astro estáticos |

Total: **7 strings PT-PT distintas** e **15 ocorrências renderizadas** nas três
páginas Next.js. Não existe corpo legal, data de entrada em vigor, versão,
responsável pela revisão ou metadata específica para importar.

## Problemas herdados e lacunas

- As três rotas exibem o mesmo `PagePlaceholder`; não são documentos legais.
- O placeholder permite navegar para Contacto e Agendamento, mas pode dar a
  impressão de que o site está mais completo do que está.
- A Política de Privacidade não descreve formulário, Google Sheets, Resend,
  Turnstile, Calendly, hosting, destinatários, transferências ou retenção.
- A Política de Cookies não inventaria os serviços efetivamente carregados,
  fornecedores, finalidades, duração ou mecanismo de consentimento.
- Os Termos não definem finalidade informativa, ausência de aconselhamento
  automático, propriedade intelectual, ligações externas, responsabilidade ou
  jurisdição.
- Não existem `version`, `effectiveDate` ou `reviewedBy` aprovados.

Os temas acima vêm dos critérios técnicos do projeto e servem apenas como
requisitos de revisão. Não são texto jurídico nem afirmações publicáveis.

## Traduções

- Os três títulos legais em `src/messages/en/_interface.json` continuam em
  português. As páginas inglesas não são traduções válidas.
- O espanhol repete integralmente os títulos e o placeholder PT-PT e não é
  publicado em v1.
- Os documentos estruturais EN existentes no Astro permanecem draft/noindex,
  sem corpo legal nem fallback português visível.

## Modelos e templates implementados

- Modelo específico de Privacidade com secções editáveis e requisitos de
  cobertura, sem conteúdo jurídico predefinido.
- Modelo específico de Cookies com inventário futuro de tecnologias e secções
  editáveis, sem assumir que cookies não essenciais estão ativos.
- Modelo específico de Termos com secções editáveis e requisitos de cobertura,
  sem cláusulas inventadas.
- Três templates Astro estáticos que distinguem claramente requisitos internos
  de texto legal aprovado e nunca renderizam secções vazias como política real.

Não será criado page builder, renderer universal, banner de consentimento ou
carregamento de terceiros neste grupo.

## Critério de conclusão

As três rotas e todas as fontes acima devem ficar contabilizadas, ter modelos
e templates específicos em preview PT, não expor conteúdo jurídico inventado
nem português em EN e passar validação de conteúdo, testes unitários,
Playwright relevante, `astro check`, `build:local` e `git diff --check`.

Nenhuma página muda para `ready`, perde `noindex` ou recebe data/versão/revisor
sem texto integral e aprovação jurídica qualificada.

A representação estrutural destas lacunas foi confirmada pela Ana em 24 de
agosto de 2026. A confirmação encerra a migração do placeholder histórico, mas
não aprova nem substitui a redação e revisão jurídica ainda necessárias.
