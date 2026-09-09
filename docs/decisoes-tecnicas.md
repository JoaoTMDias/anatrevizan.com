# Decisões técnicas — anatrevizan.com

Atualizado em setembro de 2026. Este documento é a fonte normativa principal.

## Arquitetura

- Astro é a única fonte visual, funcional e editorial. Stack: Astro 7, TinaCMS 3, TypeScript, Tailwind CSS 4 e pnpm; deploy Netlify.
- As 16 rotas canónicas estão em `src/lib/routing.ts`. PT-PT não tem prefixo e EN usa `/en` com slugs localizados. O lançamento exclui Termos de Utilização e uma Política de Cookies autónoma; inclui a Declaração de Acessibilidade.
- A estrutura visual e as secções pertencem ao código; não existe criação de páginas ou alteração de URLs no CMS.

## Conteúdo bilingue

- `src/content/pages` contém 16 JSON: um documento por página, PT e EN na mesma estrutura.
- Listas, media e destinos são partilhados. Folhas localizadas usam `{ pt, en }`, apresentadas consecutivamente no Tina.
- PT é a fonte aprovada. EN é tradução humana, sem fallback. Traduções parciais podem ser guardadas; só ficam públicas quando todos os campos localizados usados têm EN.
- Hero e resumo servem de default SEO; overrides são opcionais. CTAs pertencem à página. Ligações internas usam destinos semânticos.
- Tina expõe apenas Páginas, configuração global simplificada, Publicações ORCID e Media. ORCID só permite editar idioma, temas, destaque e prioridade.
- A configuração global inclui um glossário bilingue de siglas. Ocorrências exatas no conteúdo editorial são renderizadas como abreviaturas com Tooltip ARIA APG; uma expansão EN ausente nunca recorre a PT.

## Media e datas

- Formatos: JPG, PNG, WebP, AVIF, SVG, PDF, MP3 e MP4. PDF/MP3/MP4 são apenas downloads.
- Originais permanecem no Git. O pipeline Astro/Sharp cria variantes em `_media`; SVG é sanitizado no output. Netlify Image CDN não é usado para garantir paridade local.
- Imagens laterais são opcionais e exigem alt PT/EN quando não decorativas. O fundo do hero e as proporções ficam no layout.
- Apenas páginas legais têm data editorial de entrada em vigor. A última alteração é derivada do Git e alimenta páginas legais, SEO e sitemap.

## Configuração e publicação

- Edição local grava ficheiros. Tina Cloud grava diretamente em `main`; Git fornece histórico/rollback e Netlify publica commits.
- Preview PT é online. EN incompleto é apenas preview local. Preview não usa edição por clique.
- Identidade, domínio canónico, routing, labels funcionais, erros, validação e integrações permanecem em código.
- Contactos, perfis, regiões, idiomas, tipos de pedido, labels da navegação, rodapé e SEO global são editoriais.

## Integrações e qualidade

- ORCID sincroniza em build com validação e snapshot resiliente. Calendly é link HTTPS sem embed.
- Os textos funcionais e a validação do formulário pertencem ao código; os tipos de pedido permanecem editáveis na configuração global.
- O contacto usa uma ilha React pequena com React Hook Form e Zod. Email é validado numa Netlify Function, protegido por Turnstile, guardado no Google Sheets e notificado por Resend; WhatsApp abre uma mensagem preenchida e não é guardado automaticamente.
- A confirmação de contacto PT/EN usa React Email (`src/emails/ContactConfirmation.tsx`), renderizado no servidor e enviado por Resend com alternativa em texto simples. Falhas de renderização e envio são isoladas por destinatário.
- O email usa o logo PNG em `public/emails/logo.png`, derivado de `public/logo.svg` com Sharp a 480 px e apresentado a 240 px. O preview serve o mesmo ficheiro através de `src/emails/static`; a versão enviada usa o URL HTTPS do domínio canónico. O fecho usa `public/signature.png`, com cópia no preview, e a confirmação fala na primeira pessoa em PT/EN.
- Preview local de email: `pnpm email:dev` abre React Email em `http://localhost:3001`, com atualização automática e exemplos fictícios PT/EN em `src/emails`. Não requer credenciais Resend.
- A folha Google é a fonte durável dos pedidos enviados pelo site. Falhas de email após a gravação não transformam um pedido recebido em erro para o visitante.
- Acessibilidade, segurança, privacidade, SEO localizado, canonicals, alternates e testes são bloqueantes para lançamento.
- A suite de resiliência valida o artefacto compilado: Vitest fica reservado a contratos com lógica e fronteiras externas; Playwright Chromium cobre jornadas, rotas, DOM final, navegação e axe sem retries nem snapshots visuais.
- O sitemap e `published-en.json` formam o contrato de publicação. O CI constrói uma vez, serve exatamente esse artefacto e guarda trace, screenshot e relatório HTML apenas em falhas.
- Deploy previews usam um build próprio com `X-Robots-Tag: noindex`; o smoke real do formulário e desse cabeçalho continua a ser uma decisão manual pré-produção.
- O site público não usa analytics nem pixels. A preferência de tema usa `localStorage`; o Turnstile é carregado apenas no contacto como controlo de segurança. Não existe banner nem página autónoma de Cookies; a informação fica na Política de Privacidade. O `/admin` é um ambiente Tina separado desta conclusão.
- A Política de Privacidade e a Declaração de Acessibilidade mantêm pendências factuais/jurídicas explícitas. A avaliação de acessibilidade de 4 de setembro de 2026 é uma revisão técnica limitada, não uma declaração de conformidade WCAG.

## Revisão territorial de setembro de 2026

- Atuação separa advocacia e consultoria em Direito brasileiro (OAB/SP n.º 330.386) de apoio administrativo e técnico não jurídico em Portugal. A página portuguesa é única; Migração e Pareceres apresentam escolha explícita de país sem seleção inicial.
- A arquitetura passa a 16 páginas fixas. Civil, Trabalho e Direitos Humanos ficam agrupados na página brasileira. Não há redirecionamentos de migração, por confirmação de que o site ainda não foi lançado.
- Nesta revisão, o responsável autorizou tradução assistida PT→EN e propostas para lacunas do documento; ambas aguardam revisão humana antes de produção. Ver `docs/revisao-brasil-portugal.md`.
- O formulário transmite âmbito profissional independente da residência, IDs estáveis de pedido e validação territorial no servidor. A coluna M do Google Sheets guarda o âmbito, mantendo A:L. Previews exigem destinos de teste explícitos e encaminham ambos os emails para o destinatário de teste.
