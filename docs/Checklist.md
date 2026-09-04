# Checklist de lançamento

## Conteúdo e revisão

- [ ] Ana rever os 14 documentos no `/admin`, incluindo a nova Declaração de Acessibilidade e a Política de Privacidade revista.
- [x] Completar e rever humanamente todos os campos EN antes de publicar as rotas inglesas.
- [ ] Obter revisão qualificada das afirmações profissionais e dos serviços.
- [ ] Confirmar os dados pendentes e rever juridicamente a Política de Privacidade.
- [x] Retirar Termos de Utilização e a Política de Cookies autónoma do lançamento; manter a informação técnica de cookies/armazenamento na Política de Privacidade.
- [ ] Confirmar o processo e prazo de resposta na Declaração de Acessibilidade e realizar auditoria abrangente antes de atribuir um estado formal de conformidade.
- [ ] Substituir imagens temporárias e confirmar licenças e textos alternativos PT/EN.

## Funcionalidade

- [ ] Configurar credenciais ORCID no Netlify e GitHub e ativar sincronização remota.
- [x] Acrescentar aviso não bloqueante no admin para traduções parciais.
- [x] Confirmar preview PT online e restringir preview EN incompleto ao ambiente local.
- [ ] Configurar Turnstile, service account/folha Google, domínio Resend e respetivas variáveis no Netlify; testar um envio real em deploy preview.

## QA e lançamento

- [ ] Testar as 14 páginas no site e admin: teclado, foco, nomes acessíveis, contraste, 320 px, zoom 400%, movimento reduzido e Save-Data.
- [x] Testar edição PT/EN, rich text, listas, CTAs, configuração global, ORCID e media.
- [x] Testar variantes Sharp, sanitização SVG e downloads em desenvolvimento e produção.
- [x] Executar Playwright completo sem erros de consola, assets ausentes ou URLs locais.
- [ ] Executar `pnpm exec astro check`, `pnpm test`, `pnpm build:local`, `pnpm build` e `git diff --check`.
- [ ] Rever deploy preview com Ana antes de qualquer merge para `main`.
