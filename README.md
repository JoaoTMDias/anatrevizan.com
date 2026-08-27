# anatrevizan.com

Site oficial de Ana Trevizan, construído em Astro 7 com TinaCMS 3 e publicado no Netlify.

## Desenvolvimento

Requer Node 22.22+ e pnpm.

```sh
pnpm install
pnpm dev
pnpm exec astro check
pnpm test
pnpm build:local
pnpm preview
```

`pnpm build:local` usa conteúdo local e ignora a verificação cloud. `pnpm build` valida o schema no Tina Cloud e requer `PUBLIC_TINA_CLIENT_ID` e `TINA_TOKEN`. A sincronização ORCID usa as credenciais descritas em `.env.example` quando disponíveis e preserva o snapshot em caso de falha.

## Edição e publicação

As 19 páginas vivem em `src/content/pages`: um JSON por página, com PT-PT e EN no mesmo documento. Estrutura, listas, imagens e destinos são únicos; cada texto apresenta os valores PT e EN consecutivamente. O inglês só entra no site público quando a tradução usada está completa e nunca recebe fallback português.

Em desenvolvimento, abrir `/admin` através de `pnpm dev`; as alterações são gravadas localmente. No Tina Cloud, `/admin` grava na branch configurada (`main` no fluxo editorial online). Cada commit inicia o deploy Netlify. O preview serve para confirmação visual.

O Tina contém apenas Páginas, Configuração global simplificada, Publicações ORCID e Media. URLs, routing, identidade, layout e configuração técnica permanecem em código.

## Media

São aceites JPG, PNG, WebP, AVIF, SVG, PDF, MP3 e MP4. Astro/Sharp gera variantes raster equivalentes em desenvolvimento e produção; os originais ficam no Git. SVG é sanitizado antes de chegar ao output. PDF, MP3 e MP4 são downloads, não media incorporado. Recomendações: 1 MB por imagem, 3 MB por PDF e 15 MB por MP3/MP4.

## Referência

- `docs/decisoes-tecnicas.md` — arquitetura consolidada;
- `docs/Checklist.md` — pendências reais de lançamento;
- `docs/guia-editorial.md` — guia curto para edição;
- `docs/proveniencia-conteudo.md` — origem, aprovações e lacunas.
