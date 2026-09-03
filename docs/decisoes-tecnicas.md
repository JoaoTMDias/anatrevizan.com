# Decisões técnicas — anatrevizan.com

Atualizado em agosto de 2026. Este documento é a fonte normativa principal.

## Arquitetura

- Astro é a única fonte visual, funcional e editorial. Stack: Astro 7, TinaCMS 3, TypeScript, Tailwind CSS 4 e pnpm; deploy Netlify.
- As 17 rotas canónicas estão em `src/lib/routing.ts`. PT-PT não tem prefixo e EN usa `/en` com slugs localizados.
- A estrutura visual e as secções pertencem ao código; não existe criação de páginas ou alteração de URLs no CMS.

## Conteúdo bilingue

- `src/content/pages` contém 17 JSON: um documento por página, PT e EN na mesma estrutura.
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
- Acessibilidade, segurança, privacidade, SEO localizado, canonicals, alternates e testes são bloqueantes para lançamento.
