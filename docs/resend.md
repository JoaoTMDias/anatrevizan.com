# Configurar Resend para o contacto

## Estado e contrato

A integração está implementada em `netlify/functions/contact.ts`. A configuração externa e o envio real ainda precisam de confirmação. Nunca copiar API keys, tokens ou capturas com segredos para o chat, Git ou relatórios.

A função grava primeiro no Sheets e só depois tenta a notificação e a confirmação, independentemente. K é o estado da notificação; L é o da confirmação: `sent` (API aceitou), `failed` (pedido de envio falhou) ou `not-configured` (falta pelo menos uma das três variáveis). `sent` não comprova entrega na caixa de entrada: não existem webhooks de entrega/bounce. Se a atualização K:L falhar, a linha pode conservar `pending`; o visitante continua a receber sucesso e é registado `contact-email-status-update-failed`. Não repetir a submissão para resolver emails: o mesmo requestId não volta a enviar.

## 1. Domínio e DNS

1. Entrar/criar conta no Resend e abrir Domains → Add domain.
2. Para usar o endereço já existente no conteúdo, `contato@anatrevizan.com`, adicionar `anatrevizan.com`. Um subdomínio dedicado é alternativa, mas exige escolher explicitamente outro remetente; este guia não presume um endereço novo.
3. No fornecedor que gere os nameservers autoritativos, copiar os registos apresentados pelo Resend, com tipo, nome, valor e prioridade exatos: DKIM e os registos SPF/return-path (TXT e MX conforme o painel). Os valores dependem do domínio e região; não usar valores genéricos.
4. Preservar MX da caixa de correio existente. O MX de envio/return-path deve ficar no hostname indicado pelo Resend. Não ativar receção de email no Resend para este formulário. Evitar duplicar o domínio quando o editor DNS já acrescenta a zona e não criar dois SPF no mesmo hostname.
5. Rever o DMARC existente; se ausente, definir uma política deliberada conforme a documentação, sem inventar destinatários de relatórios nem substituir uma política existente.
6. Selecionar Verify no Resend, aguardar propagação e confirmar o estado Verified antes de ativar produção.

Fonte: [domínios Resend](https://resend.com/docs/dashboard/domains/introduction).

## 2. API key

1. Abrir API Keys → Create API key.
2. Usar um nome que identifique este site e Production.
3. Selecionar Sending access (`sending_access`) e restringir ao domínio de envio verificado. Não é necessário Full access.
4. Guardar a chave num gestor de palavras-passe e colá-la diretamente no campo secreto da Netlify. Não a enviar pelo chat nem usar comandos que a deixem no histórico. O valor só é apresentado na criação.

Fontes: [gestão de chaves](https://resend.com/docs/dashboard/api-keys/introduction), [permissões e domínio](https://resend.com/docs/api-reference/api-keys/create-api-key).

## 3. Netlify

No projeto correto, abrir Project configuration → Environment variables → Add a variable. Criar individualmente:

| Nome | Valor Production |
| --- | --- |
| `RESEND_API_KEY` | Colar diretamente a chave restrita criada acima |
| `CONTACT_EMAIL_FROM` | `Ana Trevizan <contato@anatrevizan.com>`, após verificar `anatrevizan.com` |
| `CONTACT_EMAIL_TO` | `contato@anatrevizan.com`, após confirmar que a caixa existe e é acompanhada |

O endereço vem de `src/content/config/site.json`; a existência operacional da caixa não foi verificada. FROM identifica o remetente das duas mensagens; TO recebe a notificação e é Reply-To da confirmação. A confirmação vai sempre para o email preenchido no formulário.

Escolher scope **Functions** (se o plano só permitir All scopes, manter os nomes sem prefixos PUBLIC_/VITE_). Marcar a chave como **Contains secret values**, quando disponível. Escolher valores por contexto, com valor apenas em **Production**; deixar **Branch deploys**, **Deploy Previews** e desenvolvimento local sem estas credenciais. Não escolher um valor partilhado por todos os contextos, nem herdar uma chave global. Não colocar estes valores em netlify.toml: não fornece variáveis runtime às Functions.

Guardar e criar um novo deploy do contexto afetado para aplicar as variáveis. Não é necessário alterar o código para ativar o envio. Não executar env:list/env:get com valores em relatórios ou no chat.

Fontes: [variáveis e contextos](https://docs.netlify.com/build/environment-variables/overview/), [variáveis nas Functions e novo deploy](https://docs.netlify.com/build/functions/environment-variables/).

## 4. Testes seguros

Por omissão, previews e branches ficam sem Resend: validar sucesso e `not-configured` nas duas colunas, usando uma folha Google de testes e conteúdo sintético. Os testes Vitest simulam todas as fronteiras externas e não enviam emails.

Para testar a API real, usar um ambiente isolado e com acesso restrito, uma chave de testes separada (Sending access e domínio restrito), FROM verificado, TO `delivered@resend.dev` e também `delivered@resend.dev` no campo email do formulário. Este é um destinatário oficial de testes, não um contacto inventado. Usar apenas dados sintéticos. Confirmar duas chamadas aceites no Resend e `sent`/`sent` no Sheets.

Não ativar credenciais em todos os previews públicos: TO de testes protege só a notificação; qualquer visitante ainda poderia provocar confirmação para um endereço real. Se não existir controlo de acesso ao ambiente de teste, manter Resend desligado e testar localmente com credenciais isoladas. Uma chave separada e domínio restrito não restringem destinatários.

Para testar receção em caixa real, substituir ambos os destinatários apenas por caixas controladas pela equipa num ambiente restrito. Confirmar notificação, confirmação, Reply-To e spam. Depois remover as credenciais de teste e fazer novo deploy; revogar a chave de teste para que deploys antigos também deixem de enviar.

Não usar bounces de teste para esperar `failed` na folha: bounces acontecem depois da aceitação pela API. Falhas HTTP e de rede são cobertas nos testes de regressão.

Fonte: [destinatários oficiais de testes Resend](https://resend.com/docs/dashboard/emails/send-test-emails).

## Pendências

- Confirmar caixa `contato@anatrevizan.com` e escolha do domínio/remetente.
- Criar/verificar os registos DNS concretos fornecidos pelo painel e rever DMARC.
- Criar chave e variáveis Production diretamente nos painéis; fazer novo deploy.
- Escolher ambiente restrito e destinatários controlados para smoke real.
- Acompanhamento de entrega por webhooks e reconciliação de estados `pending` ficam fora desta configuração.
