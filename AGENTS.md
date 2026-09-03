# AGENTS.md

## Fontes normativas

Astro é a única fonte visual, funcional e editorial deste projeto. Consultar, por ordem: `docs/decisoes-tecnicas.md`, o pedido atual e `docs/Checklist.md`. Não existe implementação externa de referência.

## Fundação

- Node 22.22+, pnpm, Astro 7, TinaCMS 3, TypeScript e Tailwind CSS 4; produção no Netlify.
- Usar `pnpm dev`, `pnpm exec astro check`, `pnpm test`, `pnpm build:local` e, com Tina Cloud disponível, `pnpm build`.
- Preferir HTML estático e componentes `.astro`; JavaScript cliente apenas para interação real.

## Modelo editorial

- Existem exatamente 17 documentos JSON em `src/content/pages`, um por rota. Cada campo localizado apresenta PT-PT e EN consecutivamente; estrutura, listas, media e destinos são partilhados.
- A estrutura, os nomes dos ficheiros, o routing, os slugs e os destinos do menu pertencem ao código. O Tina não permite criar, apagar ou renomear páginas.
- PT-PT é primário e não tem prefixo; EN usa `/en` e slugs localizados. Nunca usar PT como fallback em EN.
- Traduções são humanas. Podem ser guardadas parcialmente com aviso; EN publica automaticamente apenas com todos os valores usados completos. Uma tradução publicada não pode tornar-se incompleta num deploy.
- Rich text admite headings internos, parágrafos, negrito, itálico, listas e links. Cartões têm título e resumo localizado; as listas existentes podem ser ordenadas e editadas, mas secções não podem ser ocultadas.
- Ana edita páginas, labels de navegação, CTAs por página, contactos/perfis/regiões/idiomas, tipos de pedido, rodapé, defaults SEO, media e overlays ORCID. Layout, identidade, URLs, domínio, validação, mensagens funcionais e configuração técnica ficam no código.
- Edição local grava ficheiros; `/admin` com Tina Cloud grava diretamente em `main` e desencadeia Netlify. Preview é confirmação visual, sem edição por clique. Preview PT funciona online; EN incompleto só localmente.

## Media e datas

- Uploads: JPG, PNG, WebP, AVIF, SVG, PDF, MP3 e MP4. Imagens são renderizadas; PDF/MP3/MP4 são downloads.
- Recomendar, sem bloquear: 1 MB imagem, 3 MB PDF, 15 MB áudio/vídeo. Preservar nomes e originais no Git.
- O pipeline próprio Astro/Sharp gera variantes raster; SVG é sanitizado antes do output. Não usar Netlify Image CDN.
- Imagens são opcionais; quando presentes exigem alt PT/EN e expõem apenas ponto focal. Proporções pertencem ao layout.
- Páginas normais não guardam datas manuais. Legais guardam apenas data de entrada em vigor. Última alteração deriva do Git, aparece só nas legais e alimenta metadata/`lastmod`.

## Conteúdo, integrações e qualidade

- Não inventar conteúdo factual, legal, académico ou profissional. Português editorial é PT-PT.
- ORCID é a fonte bibliográfica; no Tina só são editáveis destaque, prioridade, idioma e temas. Falhas externas preservam o snapshot.
- URLs externas têm de ser HTTPS; rejeitar vazio, `#` e protocolos inseguros. Calendly é link configurável, nunca embed.
- Segredos ficam em variáveis de ambiente. Validar input no servidor; preservar privacidade, consentimento, acessibilidade e segurança.
- Para cada alteração executar pelo menos `pnpm exec astro check` e `git diff --check`, mais testes/build proporcionais. Bugs devem ter regressão quando praticável.
- Preservar alterações alheias e evitar refactors não relacionados. Atualizar decisões e checklist apenas quando o estado real mudar.

No handoff listar alterações, verificações, decisões pedidas, riscos e trabalho deliberadamente adiado.
