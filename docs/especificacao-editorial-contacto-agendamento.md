# Fase 2 — manifesto do Grupo 4: Contacto e Agendamento

## Fronteira

Este grupo migra a estrutura editorial e o conteúdo histórico das páginas
Contacto e Agendamento da referência Next.js. Os componentes React não são
copiados. O conteúdo PT-PT foi aprovado pela Ana em 24 de agosto de 2026 e
mantém-se em `draft`, com `approvalPending: false` e `noindex: true`.

Não pertencem a este grupo o endpoint final do formulário, Google Sheets,
Resend, Turnstile, rate limiting, prevenção de duplicados, retenção de dados,
embed ou script Calendly, definição dos eventos Calendly, analytics, consent
management ou refinamento visual final.

## Inventário textual

| Página/fonte | Conteúdo contabilizado | Tratamento |
| --- | --- | --- |
| `src/messages/pt-pt/contacto.json` | 7 strings: título, etiqueta, subtítulo, formas alternativas, países, idiomas e CTA de agendamento | Migrar sem reescrita |
| `contacto/page.tsx` | 2 strings SEO; email `af.trevizan@gmail.com`; rótulos WhatsApp, LinkedIn, Instagram e ORCID | Preservar em draft; perfis sem URL não são publicados como links |
| `_interface.json > form` | 10 rótulos/mensagens e 5 opções de país | Preservar no modelo editorial para a futura integração; não ativar submissão nesta fase |
| `_interface.json > cta.enviar` | `Enviar` | Preservar como texto do futuro formulário, sem botão funcional |
| `_interface.json > agendar` | 7 strings: etiqueta, título, descrição, nota, validade, duração e fuso | Migrar sem reescrita |
| `agendar/page.tsx` | 2 strings SEO | Migrar sem reescrita |

Total: **39 ocorrências de strings editoriais PT-PT**, além de um endereço de email histórico.
Os nomes acessíveis das três redes são contabilizados, mas não promovidos a
links sem destinos reais.

## Formulário e dados pessoais

- `ContactForm.tsx` recolhe nome, WhatsApp, email, país, assunto e
  consentimento, mas apenas constrói um URL `mailto:` no browser.
- O mecanismo expõe os dados ao cliente de email e não oferece validação no
  servidor, proteção anti-spam, limites, estado de entrega ou prevenção de
  duplicados. Não será migrado como formulário funcional.
- O texto de consentimento e as mensagens de sucesso/erro são conteúdo
  histórico não revisto juridicamente. Ficam editáveis e em draft, sem serem
  apresentados como garantias de tratamento válido.
- A implementação final continua dependente das decisões sobre campos,
  retenção, destinatários, base legal, política de privacidade e integrações.

## Contactos, perfis e Calendly

- O email `af.trevizan@gmail.com` foi confirmado pela cliente em 24 de agosto
  de 2026 como contacto profissional público.
- O WhatsApp `+351 926 430 792` foi fornecido e confirmado na mesma revisão.
- LinkedIn, Instagram e ORCID usam `href="#"`; os nomes são preservados, mas
  os controlos falsos não são migrados.
- `NEXT_PUBLIC_CALENDLY_URL` tem o fallback
  `https://calendly.com/dratrevizan`. A referência chama-lhe link fornecido
  pela cliente e foi confirmado em 24 de agosto de 2026. Está configurado no
  campo global `contacts.calendlyUrl`, sem fallback no código.
- LinkedIn, Instagram e ORCID receberam destinos confirmados na revisão. Todos
  os contactos e perfis públicos ficam centralizados na configuração global do
  TinaCMS e são validados antes de renderizar.
- Se a configuração Calendly for removida ou inválida, a página mostra um
  estado editorial honesto e mantém a rota de Contacto como alternativa.
- O embed e o script global do Calendly não são migrados; v1 prevê somente um
  link externo configurável.

## Assets e traduções

- `hero-contacto.webp`, os dois vídeos de Contacto, `hero-agendar.webp` e os
  dois vídeos de Agendamento têm **zero bytes**. Não são copiados nem
  requisitados em runtime; os templates usam alternativa estática acessível.
- `src/messages/en/contacto.json` é igual ao português e não constitui uma
  tradução válida.
- O bloco EN de Agendamento contém tradução parcial, mas omite etiqueta,
  duração e fuso relativamente ao PT-PT. Permanece estrutural e não é tratado
  como página inglesa completa.
- O ficheiro espanhol de Contacto também reproduz o português e não é
  publicado em v1.

## Modelos e templates implementados

- Modelo específico de Contacto: hero, apresentação do formulário futuro,
  cópia dos campos, formas alternativas, âmbito geográfico/idiomas e CTA.
- Modelo específico de Agendamento: hero, estado da ligação externa, duração,
  aplicabilidade, fuso e alternativa de contacto.
- Templates Astro próprios, HTML estático e sem JavaScript de formulário,
  widget externo ou renderer universal.
- A configuração Calendly é validada antes de renderizar: apenas URLs HTTPS
  do domínio `calendly.com` são aceites.

## Critério de conclusão

As duas páginas e todas as fontes acima devem ficar contabilizadas, renderizar
em preview PT, não expor links falsos nem conteúdo português em EN e passar
validação de conteúdo, testes unitários, Playwright relevante, `astro check`,
`build:local` e `git diff --check`. Nenhuma página muda para `ready` sem revisão
explícita.

A revisão editorial foi concluída em 24 de agosto de 2026, incluindo o
formulário visualmente presente mas inativo e os destinos públicos confirmados.
As páginas mantêm-se em `draft` e `noindex` enquanto o formulário server-side e
as decisões de privacidade associadas permanecem para fases posteriores.
