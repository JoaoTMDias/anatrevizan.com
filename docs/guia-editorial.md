# Guia editorial — traduções e publicação

## Criar um par de traduções

1. No TinaCMS, abrir a coleção adequada: páginas, serviços, eventos, palestras, formações ou mentorias.
2. Criar o documento PT-PT com um `translationGroup` estável, `locale` igual a `pt-PT` e estado `draft`.
3. Criar o documento inglês na mesma coleção, repetindo exatamente o `translationGroup`, com `locale` igual a `en` e slug localizado.
4. Preencher título, metadata, conteúdo e texto alternativo diretamente no respetivo idioma. Não copiar texto português para o documento inglês como fallback.
5. Manter `approvalPending` ativo enquanto faltar revisão editorial, profissional, linguística ou jurídica.
6. Depois das aprovações, desativar `approvalPending` e alterar o estado para `ready` em cada tradução aprovada.

O seletor de idioma, os alternates e o sitemap só anunciam uma tradução quando ela está `ready` e já não aguarda aprovação. Espanhol pode ser preparado como `es`, mas não é publicado na v1.

## Ambientes e previews editoriais

- `pnpm dev`: ambiente de desenvolvimento local do Astro/TinaCMS, com `import.meta.env.DEV` ativo. Páginas em `draft` podem ser vistas localmente para revisão, mas continuam marcadas com `noindex,nofollow`.
- `pnpm build:preview`: build local de produção em modo de preview editorial. Usa `EDITORIAL_PREVIEW=true` para gerar documentos `draft` em modo de revisão, sem publicar no sitemap e com meta robots `noindex,nofollow`.
- `pnpm build:local`: build local equivalente a produção, sem checks do Tina Cloud. Documentos `draft` e `approvalPending` continuam excluídos das páginas publicáveis e do sitemap.
- `pnpm build`: build de produção com checks do Tina Cloud quando a configuração remota estiver disponível. Só documentos `ready` e aprovados entram na publicação, e o sitemap contém apenas URLs publicáveis.

## Regras de nomes e rotas

- As páginas usam uma `routeKey` do mapa canónico e o slug localizado correspondente.
- Entidades repetíveis usam `parentRouteKey` para indicar a página onde serão apresentadas.
- Cada coleção está organizada em diretórios `pt-PT/` e `en/`; o nome do ficheiro é o `translationGroup`, por exemplo `about.json`.
- `pnpm validate:content` deteta pares ausentes, locales e estados inválidos, slugs duplicados e referências de rota desconhecidas.
