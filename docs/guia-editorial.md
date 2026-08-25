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

- `pnpm dev` ou `pnpm dev:preview`: ambiente de desenvolvimento local do Astro/TinaCMS, com `import.meta.env.DEV` ativo. Páginas em `draft` podem ser vistas localmente para revisão, mas continuam marcadas com `noindex,nofollow`.
- `pnpm build:preview`: build local de produção em modo de preview editorial. Usa `EDITORIAL_PREVIEW=true` para gerar documentos `draft` em modo de revisão, sem publicar no sitemap e com meta robots `noindex,nofollow`.
- `pnpm preview:editorial`: cria o build editorial completo e abre o preview local correspondente em `http://127.0.0.1:4322`, sem colidir com o servidor de desenvolvimento na porta 4321. O servidor usa diretamente o entrypoint standalone gerado pelo adapter Node; `pnpm preview` volta a servir o build existente sem o reconstruir.
- `pnpm build:local`: build local equivalente a produção, sem checks do Tina Cloud. Documentos `draft` e `approvalPending` continuam excluídos das páginas publicáveis e do sitemap. O comando falha deliberadamente se não existir nenhum documento publicável, se a Home PT-PT não estiver publicável ou se algum HTML esperado estiver vazio/em falta.
- `pnpm build`: build de produção com checks do Tina Cloud quando a configuração remota estiver disponível. Aplica as mesmas guardas de publicação do build local.

Cada build escreve `dist/editorial-build-manifest.json` e apresenta um resumo com o modo, documentos publicáveis, drafts excluídos e rotas editoriais geradas. O ficheiro fica fora de `dist/client`, portanto não é publicado como asset do site.

## Publicações e sincronização ORCID

- A coleção **Publications (ORCID)** mostra apenas os quatro campos editoriais opcionais: idioma, temas, destaque e prioridade. Um campo vazio não aparece no site.
- Título, revista, ano, tipo, DOI, URL, fonte e `put-code` são sincronizados e não devem ser alterados manualmente. O corpo Markdown permanece vazio.
- Uma prioridade mais baixa coloca a obra mais cedo na página completa. Na Home, a obra mais recente ocupa sempre a primeira vaga; as duas seguintes respeitam as melhores prioridades disponíveis, sem duplicados.
- `pnpm sync:orcid` é o modo resiliente usado pelos builds. Sem `ORCID_CLIENT_ID` e `ORCID_CLIENT_SECRET`, mantém o snapshot local e termina com aviso.
- `pnpm sync:orcid:strict` exige essas credenciais e falha perante indisponibilidade, resposta vazia, dados inválidos ou colisões. É o modo usado pelo workflow semanal e pela execução manual controlada.
- O workflow `ORCID publication sync` abre ou atualiza uma pull request com adições, alterações, remoções e obras sem URL. O diff deve ser revisto antes do merge, sobretudo quando houver remoções.
- Durante a migração, o workflow pode ser executado manualmente contra a branch que contém esta configuração. O agendamento semanal só fica ativo quando o ficheiro chegar à branch predefinida do repositório.

## Regras de nomes e rotas

- As páginas usam uma `routeKey` do mapa canónico e o slug localizado correspondente.
- Entidades repetíveis usam `parentRouteKey` para indicar a página onde serão apresentadas.
- Cada coleção está organizada em diretórios `pt-PT/` e `en/`; o nome do ficheiro é o `translationGroup`, por exemplo `about.json`.
- `pnpm validate:content` deteta pares ausentes, locales e estados inválidos, slugs duplicados e referências de rota desconhecidas.
