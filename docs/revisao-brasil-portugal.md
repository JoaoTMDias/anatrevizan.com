# Revisão editorial Brasil–Portugal

Fonte: [documento aprovado](https://docs.google.com/document/d/11mM7Wvfj6iV0PoR5A28En6ghGc5uZD8HVX43DwFKeEU/edit), modificado em 7 de setembro de 2026. A cópia textual está em `fonte-editorial-brasil-portugal.txt`.

## Decisões confirmadas nesta revisão

- Branch `editorial/separacao-brasil-portugal`, na pasta original do projeto, conforme correção do responsável. Sem publicação em produção.
- 16 páginas fixas PT/EN: acrescentar Atuação e Apoio administrativo em Portugal; agrupar Civil, Trabalho e Direitos Humanos na página brasileira.
- As rotas profissionais passam para `/atuacao` e `/en/practice`. Não criar redirecionamentos de migração: o responsável confirmou que o site ainda não foi lançado. Preservar apenas o anterior `/home → /`.
- Tradução PT→EN autorizada para esta revisão, com revisão humana posterior. Nenhuma tradução foi apresentada como já aprovada.
- Propostas de texto para as lacunas editoriais autorizadas para revisão na preview.

## Proveniência e revisão editorial

Os textos PT explicitamente fornecidos para o hero inicial, Atuação, Migração, Apoio administrativo, Civil, Trabalho, Contacto e aviso global foram transpostos literalmente. O teste `territorial-content.test.ts` compara os excertos centrais com a fonte. Sobre preserva a narrativa e substitui a oferta portuguesa pelo texto aprovado, acrescentando a delimitação profissional aprovada.

Requerem aprovação editorial: textos propostos em Ambiental/Administrativo/Urbanismo, ESG/Políticas Públicas/Sustentabilidade, Direitos Humanos e Pareceres/Notas Técnicas; títulos e descrições SEO novos; frases de ligação da homepage; rótulos funcionais e confirmações territoriais; toda a tradução EN desta revisão. As propostas baseiam-se nas instruções do documento, sem acrescentar qualificações, resultados, contactos ou serviços factuais.

A nota da fonte que associa texto laboral à antiga página Ambiental foi tratada como erro de associação: Trabalho está numa secção da página brasileira, separada da página Ambiental, conforme o agrupamento aprovado pelo responsável.

Continuam pendentes as verificações factuais/jurídicas já assinaladas na Política de Privacidade, Declaração de Acessibilidade e checklist. Não foram resolvidas por suposição.

## Formulário e dados

- `scope`: `BR_LEGAL`, `PT_ADMIN`, `ACADEMIC` ou `OTHER`, obrigatório e independente de `country` (residência).
- Tipos de pedido usam IDs estáveis; o servidor valida a compatibilidade do ID e âmbito. A escolha territorial explícita num CTA pode preencher o âmbito; a entrada direta permanece vazia.
- Google Sheets mantém A:L e acrescenta M, «Âmbito». Os estados de email continuam em K:L; o histórico não é reordenado.
- Emails e WhatsApp transportam o âmbito. A gravação durável continua a definir o sucesso, mesmo que o email falhe.
- Nas URLs de preview Netlify, o envio fica indisponível por defeito. Para um smoke autorizado configurar `CONTACT_PREVIEW_SEND_ENABLED=true`, `CONTACT_PREVIEW_SHEET_ID`, `CONTACT_PREVIEW_SHEET_TAB` e `CONTACT_PREVIEW_EMAIL_TO`. Ambos os emails são encaminhados exclusivamente para esse destinatário de teste. A folha deve conter a coluna M «Âmbito». Não existe fallback para a folha ou destinatário interno de produção.
- As verificações automáticas usam respostas simuladas e dados fictícios; não autorizam envios reais.

## Verificações

Resultados finais e URL de preview serão registados após a conclusão das verificações. Os relatórios não equivalem a auditoria formal de conformidade WCAG.
