# Guia editorial — traduções e publicação

## Criar um par de traduções

1. No TinaCMS, abrir a coleção adequada: páginas, serviços, eventos, palestras, formações ou mentorias.
2. Criar o documento PT-PT com um `translationGroup` estável, `locale` igual a `pt-PT` e estado `draft`.
3. Criar o documento inglês na mesma coleção, repetindo exatamente o `translationGroup`, com `locale` igual a `en` e slug localizado.
4. Preencher título, metadata, conteúdo e texto alternativo diretamente no respetivo idioma. Não copiar texto português para o documento inglês como fallback.
5. Manter `approvalPending` ativo enquanto faltar revisão editorial, profissional, linguística ou jurídica.
6. Depois das aprovações, desativar `approvalPending` e alterar o estado para `ready` em cada tradução aprovada.

O seletor de idioma, os alternates e o sitemap só anunciam uma tradução quando ela está `ready` e já não aguarda aprovação. Espanhol pode ser preparado como `es`, mas não é publicado na v1.

## Regras de nomes e rotas

- As páginas usam uma `routeKey` do mapa canónico e o slug localizado correspondente.
- Entidades repetíveis usam `parentRouteKey` para indicar a página onde serão apresentadas.
- Cada coleção está organizada em diretórios `pt-PT/` e `en/`; o nome do ficheiro é o `translationGroup`, por exemplo `about.json`.
- `pnpm validate:content` deteta pares ausentes, locales e estados inválidos, slugs duplicados e referências de rota desconhecidas.
