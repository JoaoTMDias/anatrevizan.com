# Checklist de lançamento

## Conteúdo e revisão

- [ ] Ana rever os 19 documentos no `/admin`, incluindo ordem das listas, CTAs e media.
- [ ] Completar e rever humanamente todos os campos EN antes de publicar as rotas inglesas.
- [ ] Obter revisão qualificada das afirmações profissionais e dos serviços.
- [ ] Redigir e rever juridicamente Privacidade, Termos e Cookies, incluindo datas de entrada em vigor.
- [ ] Substituir imagens temporárias e confirmar licenças e textos alternativos PT/EN.

## Funcionalidade

- [ ] Configurar credenciais ORCID no Netlify e GitHub e ativar sincronização remota.
- [x] Acrescentar aviso não bloqueante no admin para traduções parciais.
- [ ] Confirmar preview PT online e restringir preview EN incompleto ao ambiente local.

## QA e lançamento

- [ ] Testar as 19 páginas no site e admin: teclado, foco, nomes acessíveis, contraste, 320 px, zoom 400%, movimento reduzido e Save-Data.
- [ ] Testar edição PT/EN, rich text, listas, CTAs, configuração global, ORCID e media.
- [ ] Testar variantes Sharp, sanitização SVG e downloads em desenvolvimento e produção.
- [ ] Executar Playwright completo sem erros de consola, assets ausentes ou URLs locais.
- [ ] Executar `pnpm exec astro check`, `pnpm test`, `pnpm build:local`, `pnpm build` e `git diff --check`.
- [ ] Rever deploy preview com Ana antes de qualquer merge para `main`.
