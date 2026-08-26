# Checklist para lançamento do anatrevizan.com

> Lista originalmente baseada na implementação Next.js e atualizada após as
> decisões técnicas de agosto de 2026. A versão Next.js permanece como
> especificação; a implementação final será feita em Astro + TinaCMS.
>
> As decisões concluídas estão registadas em `Decisões técnicas.md`.

## Estado da fase — fundação editorial, i18n e routing (agosto de 2026)

- [x] Fundação Astro 7 + TinaCMS 3 + TypeScript + Tailwind CSS 4 + pnpm confirmada; adapter host-neutral e deploy Netlify preservados.
- [x] Conteúdo demonstrativo do starter removido; React mantido apenas como dependência do admin TinaCMS.
- [x] Mapa canónico tipado das 19 rotas PT-PT/EN centralizado e reutilizado por routing, navegação, seletor/alternates, canonicals e sitemap.
- [x] PT-PT configurado sem prefixo, inglês sob `/en` com slugs localizados; espanhol preparado apenas no modelo e PT-BR excluído.
- [x] Modelo TinaCMS localizado para identidade, contactos, navegação, páginas e coleções repetíveis de serviços, eventos, palestras, formações e mentorias, além de CTAs, SEO, legal e media.
- [x] Traduções modeladas como documentos separados com `translationGroup`, `locale`, `routeKey`, `slug`, `status` e metadata localizada.
- [x] Conteúdo estrutural PT/EN criado como `draft`, explicitamente por aprovar e `noindex`.
- [x] Preview visual validado manualmente no admin TinaCMS para a Home e para uma entidade de Mentoring, em PT-PT e EN; idioma, rota e organização por pasta confirmados.
- [x] Testes automatizados para pares PT/EN, slugs duplicados, locales inválidos, traduções ausentes e estados editoriais.
- [x] Validação editorial integrada como precondição de `pnpm build` e `pnpm build:local`.
- [x] `pnpm build:local` concluído após as alterações finais desta fase.
- [ ] `pnpm build` validado no Tina Cloud após publicação da branch; localmente, a verificação chega ao serviço e fica bloqueada apenas porque o schema remoto de `main` ainda não inclui o schema desta branch.
- [ ] Conteúdo PT-PT e EN revisto pela Ana e por revisores adequados; todos os documentos permanecem em draft até essa aprovação.

## Estado da fase 2 — migração editorial por grupos (agosto de 2026)

- [x] As 19 páginas da referência Next.js foram auditadas e divididas em cinco grupos verificáveis; manifesto em `docs/especificacao-editorial-home-sobre.md`.
- [x] Grupo 1: conteúdo PT-PT da Home e Sobre importado integralmente para modelos TinaCMS e templates Astro específicos.
- [x] Cópias inglesas em português, placeholders, links falsos, assets vazios e integrações futuras foram contabilizados sem os publicar como conteúdo válido.
- [x] Conteúdo profissional e académico PT-PT da Home e Sobre revisto e aprovado pela Ana em 24 de agosto de 2026; as duas páginas permanecem em `draft` e `noindex` até os destinos dependentes estarem prontos.
- [x] Grupos 2–5 migrados e contabilizados nos respetivos manifestos; a fase 2 editorial das 19 páginas está estruturalmente concluída.

## Estado da fase 3 — sistema visual e componentes partilhados (agosto de 2026)

- [x] Sistema visual da referência Next.js auditado e dividido em cinco grupos verificáveis; manifesto em `docs/auditoria-visual-fase-3.md`.
- [x] Universo integral de 650 ocorrências visuais registado em `docs/inventario-estilos-nextjs.md`; nenhum estilo pode ser omitido apenas por redundância ou baixa qualidade da referência.
- [x] Limite inicial confirmado: fundação visual, shell global e primitivos partilhados, sem alterar conteúdo, rotas, modelos ou estados editoriais.
- [x] Grupo 1 — fontes, tokens, header, dropdowns, drawer mobile, footer, botões, foco e preferências do utilizador corrigidos e revalidados no browser.
- [x] Grupo 2 — heroes, grelhas, CTAs e ritmos comparados novamente com a referência renderizada em desktop e mobile.
- [x] Grupo 3 — família Consultoria revalidada página a página; o cross-link editorial de Migração requer uma decisão de conteúdo, sem impedir a validação visual.
- [x] Grupo 4 — família Academia revalidada página a página; prioridade editorial do snapshot modelada e testada, mantendo a sincronização ORCID para uma fase posterior.
- [x] Grupo 5 — matriz renderizada das 19 rotas concluída sem erros de consola ou overflow Astro; decisões editoriais globais aplicadas e handoff de encerramento executado.
- [x] Heroes editoriais preparados no TinaCMS com fundo e imagem lateral independentes, proporção 1:1/4:3, alt validado e layout responsivo empilhado/duas colunas; placeholder temporário bloqueado em publicação.

## Estado da fase 4 — sincronização ORCID (agosto de 2026)

- [x] ORCID `0000-0003-4365-6053` estabelecido como fonte de verdade bibliográfica e snapshot inicial de 28 obras públicas validado.
- [x] Coleção Markdown partilhada criada no Astro e TinaCMS; campos ORCID ocultos e overlay editorial opcional preservado por `sourceId`.
- [x] Sincronizador TypeScript único implementado em modo build resiliente, modo estrito e execução manual, com validação integral e atualização atómica.
- [x] Página de Publicações e Home desligadas das cópias JSON e ligadas exclusivamente à coleção, sem expor tipo técnico nem criar ligações falsas.
- [x] Workflow semanal/manual preparado para abrir ou atualizar uma pull request com contagens, sem commits diretos na branch publicada.
- [x] Testes unitários, validação editorial 38/38, Tina schema/lock, Astro check, build editorial e 49 testes Playwright concluídos.
- [ ] Credenciais `ORCID_CLIENT_ID` e `ORCID_CLIENT_SECRET` configuradas nos ambientes Netlify e GitHub antes de ativar a automação remota.

## Segurança do build editorial (agosto de 2026)

- [x] Builds de preview e produção apresentam um resumo e escrevem um manifesto com documentos e rotas geradas.
- [x] Builds de produção falham quando não existem documentos publicáveis, a Home PT-PT não está publicável ou falta HTML editorial esperado.
- [x] Preview editorial mantém os 38 documentos PT-PT/EN disponíveis com `noindex`, sem os incluir no sitemap público.

### Grupo 2 — Consultoria

- [x] Hub de Consultoria e cinco serviços auditados; 203 strings PT-PT contabilizadas no manifesto `docs/especificacao-editorial-consultoria.md`.
- [x] Conteúdo PT-PT importado para modelos TinaCMS e templates Astro específicos, mantendo `draft`, `approvalPending` e `noindex`.
- [x] Cópias EN idênticas ao português mantidas fora dos modelos renderizados e registadas como tradução inválida.
- [x] Conteúdo profissional e jurídico PT-PT das seis páginas revisto e aprovado pela Ana em 24 de agosto de 2026; revisão qualificada adicional mantém-se pendente quando aplicável.

### Grupo 3 — Academia

- [x] Hub Academia e cinco páginas académicas auditados; 106 strings PT-PT, 12 strings SEO e 25 publicações contabilizados no manifesto `docs/especificacao-editorial-academia.md`.
- [x] Conteúdo PT-PT importado para modelos TinaCMS e templates Astro específicos; permanece em `draft` e `noindex` após a revisão explícita.
- [x] Cópias EN idênticas ao português mantidas fora dos modelos renderizados e registadas como tradução inválida.
- [x] Dois links de publicações com `href="#"`, o download falso do kit, a fotografia placeholder e as coleções vazias de eventos e recomendações foram registados sem os publicar como conteúdo válido.
- [x] Conteúdo profissional e académico PT-PT das seis páginas revisto e aprovado pela Ana em 24 de agosto de 2026; revisão qualificada adicional mantém-se pendente quando aplicável.
- [x] Integração ORCID em build, validação dos dados atuais e snapshot de fallback implementados na fase 4.

### Grupo 4 — Contacto e Agendamento

- [x] Contacto e Agendamento auditados; 39 ocorrências de strings PT-PT, contactos originalmente sem destino, fallback Calendly e seis assets vazios contabilizados no manifesto `docs/especificacao-editorial-contacto-agendamento.md`.
- [x] Conteúdo PT-PT importado para modelos TinaCMS e templates Astro específicos, mantendo `draft`, `approvalPending` e `noindex` até revisão explícita.
- [x] Formulário `mailto:` e perfis com `href="#"` não foram promovidos; email, WhatsApp, LinkedIn, Instagram, ORCID e Calendly foram posteriormente confirmados e centralizados na configuração global do TinaCMS.
- [x] A ligação Calendly aceita apenas URLs HTTPS do domínio Calendly; na ausência de configuração, apresenta a rota Contacto como alternativa, sem embed ou script externo.
- [x] Conteúdo PT-PT das duas páginas, formulário inativo e destinos públicos revistos e aprovados pela Ana em 24 de agosto de 2026.
- [ ] Formulário server-side, proteção anti-spam, retenção, integrações de entrega e configuração final do Calendly implementados nas fases próprias.

### Grupo 5 — Páginas legais

- [x] Privacidade, Termos e Cookies auditados; sete strings PT-PT distintas e ausência total de corpo legal contabilizadas no manifesto `docs/especificacao-editorial-paginas-legais.md`.
- [x] Três modelos TinaCMS e três templates Astro específicos implementados, mantendo `draft`, `approvalPending` e `noindex`.
- [x] Placeholder comum, títulos EN em português e lacunas de privacidade/consentimento registados sem inventar cláusulas ou apresentar requisitos internos como texto legal.
- [x] Representação estrutural das lacunas nas três páginas confirmada pela Ana em 24 de agosto de 2026; esta confirmação não constitui aprovação jurídica do conteúdo ainda inexistente.
- [ ] Redação integral e revisão jurídica qualificada das três páginas, incluindo versão, data de entrada em vigor e responsável pela revisão.
- [ ] Consentimento de cookies e bloqueio de terceiros implementados caso os serviços finais o exijam.

## 1. Decisões de produto e arquitetura

- **P0 — Decidir a fundação técnica final**
    - Continuar com Next.js.
    - Ou reconstruir em Astro, aproveitando o design e conteúdo da versão Next.js.
    - Registar brevemente os motivos da decisão.
- **P0 — Decidir como o conteúdo será gerido**
    - Confirmar se a Ana precisa de editar páginas sem alterar código.
    - Definir se será utilizado TinaCMS.
    - Identificar quais campos e páginas serão editáveis.
    - Definir preview editorial e publicação.
- **P0 — Confirmar idiomas de lançamento**
    - Recomenda-se lançar inicialmente apenas em PT-PT.
    - Se inglês fizer parte do lançamento, terminar e rever 100% da tradução.
    - Não publicar espanhol enquanto estiver incompleto.
    - Decidir se haverá PT-BR separado de PT-PT.
- **P0 — Confirmar o âmbito da primeira versão**
    - Páginas indispensáveis.
    - Serviços efetivamente disponíveis.
    - Formas de contacto.
    - Agendamento.
    - Publicações.
    - Palestras, mentorias, cursos e eventos.
- **P1 — Definir objetivos mensuráveis**
    - Contactos recebidos.
    - Agendamentos concluídos.
    - Visitas às páginas de serviços.
    - Acessos a publicações.
    - Convites para palestras ou formações.

---

## 2. Conteúdo e revisão editorial

- **P0 — Rever todo o conteúdo PT-PT**
    - Ortografia.
    - Pontuação.
    - Consistência terminológica.
    - Adequação ao português europeu.
    - Remover expressões ou construções brasileiras quando não forem intencionais.
    - Uniformizar primeira e terceira pessoa.
    - Uniformizar “Dra. Ana Trevizan”, “Ana Trevizan” e “Ana Flávia Trevizan”.
- **P0 — Validar todas as afirmações profissionais**
    - Títulos académicos.
    - Cargos.
    - Datas.
    - Universidades.
    - Centros de investigação.
    - Certificações.
    - Associações profissionais.
    - Experiência em Portugal e no Brasil.
- **P0 — Validar a descrição dos serviços**
    - Confirmar quais serviços podem ser anunciados em Portugal.
    - Confirmar quais serviços podem ser anunciados no Brasil.
    - Evitar promessas de resultados.
    - Distinguir advocacia, consultoria, investigação, formação e mentoria.
    - Explicar claramente quem pode contratar cada serviço.
- **P0 — Rever regras profissionais aplicáveis**
    - Regras da Ordem dos Advogados portuguesa.
    - Regras da OAB.
    - Publicidade profissional.
    - Uso de títulos profissionais.
    - Limites geográficos da prestação de serviços.
    - Avisos legais necessários.
- **P0 — Finalizar a página “Sobre”**
    - Criar uma versão curta e escaneável.
    - Organizar o percurso por etapas.
    - Evitar uma parede extensa de texto.
    - Distinguir formação, experiência, investigação e redes.
    - Adicionar fotografia profissional.
    - Adicionar CV ou perfil académico, caso seja adequado.
- **P0 — Finalizar cada página de serviço**
    - Título claro.
    - Problema que o serviço resolve.
    - Público-alvo.
    - Âmbito do serviço.
    - O que está incluído.
    - O que não está incluído.
    - Países aplicáveis.
    - Processo de trabalho.
    - CTA apropriado.
    - Nota legal quando necessária.
- **P0 — Remover conteúdo placeholder**
    - “Página em construção”.
    - Textos demonstrativos.
    - Referências temporárias.
    - Botões sem destino.
    - Imagens ou vídeos vazios.
- **P1 — Rever CTAs**
    - Usar uma ação concreta por secção.
    - Uniformizar “Agendar”, “Contactar”, “Falar” e “Pedir informação”.
    - Evitar CTAs que levem todos ao mesmo destino sem contexto.
    - Confirmar que o CTA corresponde ao serviço apresentado.
- **P1 — Definir conteúdo social**
    - LinkedIn.
    - Instagram, caso seja utilizado profissionalmente.
    - ORCID.
    - Google Scholar.
    - Lattes.
    - Outros perfis académicos relevantes.
- **P1 — Preparar páginas para conteúdos futuros**
    - Eventos.
    - Cursos.
    - Formações.
    - Palestras.
    - Publicações.
    - Notícias ou artigos, se houver blog.
- **P2 — Criar guia de tom de voz**
    - Formalidade.
    - Terminologia jurídica.
    - Uso da primeira pessoa.
    - Diferenças entre público académico e clientes.
    - Regras para PT-PT, PT-BR e inglês.

---

## 3. Traduções e internacionalização

- **P0 — Definir os idiomas realmente publicados**
- **P0 — Ocultar idiomas incompletos**
- **P0 — Completar 100% do inglês se for publicado**
    - Interface.
    - Homepage.
    - Consultoria.
    - Páginas de serviços.
    - Academia.
    - Sobre.
    - Contacto.
    - Agendamento.
    - Páginas legais.
    - Metadata.
    - Mensagens de erro.
- **P0 — Fazer revisão humana das traduções**
    - Correção linguística.
    - Terminologia jurídica.
    - Terminologia académica.
    - Terminologia ambiental e ESG.
- **P1 — Corrigir o validador de traduções**
    - Fazer CI falhar quando um idioma publicado estiver incompleto.
    - Definir percentagem mínima por idioma.
    - Detetar chaves ausentes.
    - Detetar chaves adicionais não utilizadas.
    - Detetar valores ainda iguais ao idioma-base.
- **P1 — Testar troca de idioma**
    - Manter a página equivalente ao trocar o idioma.
    - Preservar query parameters relevantes.
    - Confirmar comportamento em páginas inexistentes.
    - Confirmar que não existem ciclos de redirect.
- **P1 — Validar URLs localizadas**
    - Slugs PT-PT.
    - Slugs ingleses.
    - Canonicals.
    - `hreflang`.
    - `x-default`.
    - Sitemap.
- **P2 — Preparar expansão futura**
    - Espanhol.
    - PT-BR.
    - Processo editorial por idioma.
    - Responsável pela revisão de cada idioma.

---

## 4. Design e sistema visual

- **P0 — Aprovar a direção visual**
    - Paleta principal.
    - Uso do verde na área ambiental.
    - Tipografia.
    - Estilo fotográfico.
    - Ícones.
    - Tom visual entre advocacia e academia.
- **P0 — Criar ou finalizar a identidade**
    - Logótipo ou assinatura tipográfica final.
    - Favicon.
    - Apple touch icon.
    - Imagem Open Graph.
    - Avatar ou fotografia para perfis.
- **P0 — Substituir todos os assets vazios**
    - Homepage.
    - Consultoria.
    - Academia.
    - Sobre.
    - Contacto.
    - Agendamento.
    - Cada página de serviço.
    - Cada página académica.
- **P0 — Decidir se os vídeos hero são necessários**
    - Comparar valor visual com custo de performance.
    - Produzir versões mobile e desktop finais.
    - Criar posters estáticos.
    - Comprimir vídeos.
    - Remover áudio.
    - Confirmar direitos de utilização.
- **P1 — Consolidar componentes visuais**
    - Botões.
    - Cards.
    - Badges.
    - Breadcrumbs.
    - Formulários.
    - Estados de foco.
    - Estados de erro.
    - Estados vazios.
- **P1 — Testar responsividade**
    - 320 px.
    - 375 px.
    - 390 px.
    - 768 px.
    - 1024 px.
    - 1280 px.
    - 1440 px ou superior.
- **P1 — Testar zoom**
    - 200%.
    - 400%.
    - Evitar conteúdo cortado ou sobreposto.
- **P2 — Rever microinterações**
    - Hover.
    - Focus.
    - Abertura de menus.
    - Mudança de idioma.
    - Feedback de submissão.
    - Animações reduzidas.

---

## 5. Navegação e acessibilidade

- **P0 — Corrigir o menu desktop**
    - Adicionar `aria-expanded`.
    - Adicionar `aria-controls`.
    - Permitir abertura e navegação por teclado.
    - Fechar com Escape.
    - Gerir foco corretamente.
    - Evitar comportamento exclusivamente dependente de hover.
- **P0 — Corrigir o menu móvel**
    - Anunciar estado aberto/fechado.
    - Mover foco para o drawer ao abrir.
    - Conter foco dentro do drawer.
    - Fechar com Escape.
    - Repor foco no botão ao fechar.
    - Impedir interação com o fundo.
    - Bloquear scroll da página.
- **P0 — Remover todos os `href="#"`**
- **P0 — Garantir navegação integral por teclado**
- **P0 — Garantir labels e nomes acessíveis**
    - Botões.
    - Links de ícones.
    - Seletores.
    - Campos de formulário.
    - Controlos de filtros.
- **P0 — Verificar contraste**
    - Header transparente.
    - Texto sobre imagens.
    - Texto secundário.
    - Botões.
    - Estados disabled.
    - Estados de foco.
- **P1 — Adicionar skip link**
    - “Saltar para o conteúdo”.
- **P1 — Rever estrutura semântica**
    - Um `h1` por página.
    - Hierarquia correta de headings.
    - Uso correto de `nav`, `main`, `section`, `article` e `footer`.
    - Breadcrumbs com label acessível.
- **P1 — Respeitar preferências do utilizador**
    - `prefers-reduced-motion`.
    - `Save-Data`.
    - Contraste elevado quando possível.
- **P1 — Rever a barra CTA móvel**
    - Garantir que não tapa conteúdo.
    - Garantir que não tapa o footer.
    - Garantir safe areas em iOS.
- **P1 — Testar com leitores de ecrã**
    - VoiceOver.
    - NVDA ou equivalente.
- **P1 — Executar auditoria automatizada**
    - axe.
    - Lighthouse.
    - Accessibility Insights.
- **P2 — Elaborar declaração de acessibilidade**, se aplicável.

---

## 6. Contacto e conversão

- **P0 — Substituir o formulário `mailto:`**
    - Criar endpoint seguro ou Server Action.
    - Escolher fornecedor de email.
    - Validar dados no servidor.
    - Normalizar e sanitizar inputs.
    - Implementar proteção contra spam.
    - Implementar rate limiting.
    - Criar estado de submissão.
    - Criar mensagem de sucesso.
    - Criar mensagem de erro.
    - Evitar submissões duplicadas.
- **P0 — Definir destinatários**
    - Email principal.
    - Reply-to do utilizador.
    - Assunto padronizado.
    - Cópia ou arquivo, se necessário.
- **P0 — Definir retenção e tratamento de dados**
    - Que dados são guardados.
    - Durante quanto tempo.
    - Quem tem acesso.
    - Como podem ser eliminados.
- **P0 — Validar o consentimento**
    - Texto juridicamente adequado.
    - Ligação para a política de privacidade.
    - Consentimento não pré-selecionado.
- **P1 — Melhorar os campos**
    - Tornar WhatsApp opcional se não for estritamente necessário.
    - Adicionar tipo de pedido.
    - Adicionar país/jurisdição.
    - Definir limites de tamanho.
    - Autocomplete apropriado.
- **P1 — Definir email automático de confirmação**
- **P1 — Testar entregabilidade**
    - SPF.
    - DKIM.
    - DMARC.
    - Spam.
- **P2 — Integrar CRM**, caso exista necessidade real.

---

## 7. Calendly e agendamento

- **P0 — Confirmar a URL final do Calendly**
- **P0 — Remover fallback que esconda configuração incorreta**
- **P0 — Configurar eventos disponíveis**
    - Duração.
    - Disponibilidade.
    - Fuso horário.
    - Perguntas prévias.
    - Confirmações.
    - Cancelamentos e reagendamentos.
- **P0 — Confirmar o papel da primeira conversa**
    - Gratuita ou paga.
    - Consulta ou chamada de enquadramento.
    - Limites do aconselhamento prestado.
    - Aviso de que o agendamento não cria automaticamente relação cliente-advogada.
- **P0 — Incluir Calendly na documentação de privacidade/cookies**
- **P1 — Criar fallback**
    - Link direto para o Calendly.
    - Alternativa por email.
    - Mensagem se o script falhar.
- **P1 — Testar em mobile**
- **P1 — Testar bloqueadores de tracking**
- **P1 — Testar navegação por teclado**
- **P2 — Medir conversão do agendamento**, com consentimento adequado.

---

## 8. Publicações e ORCID

- [x] **P0 — Confirmar o ORCID correto**
- [x] **P0 — Importar e validar tecnicamente todas as publicações públicas atuais**
    - Títulos.
    - Datas.
    - Revista ou publicação.
    - DOI.
    - Links.
    - Tipo de publicação.
- [x] **P0 — Garantir que nenhuma publicação usa `href="#"`**
- [x] **P0 — Validar dados ORCID no sincronizador de build**
    - Criar schema para a resposta externa.
    - Rejeitar estruturas inválidas.
    - Tratar valores inesperados.
- [x] **P1 — Eliminar `any` do parser**
- [x] **P1 — Unificar toda a lógica num único módulo TypeScript**
- [x] **P1 — Tornar a identificação de idioma um overlay editorial opcional**
    - Definir idioma manualmente no overlay quando necessário.
    - Não depender apenas da heurística do título.
- [x] **P1 — Registar falhas de sincronização**
    - ORCID indisponível.
    - Resposta inválida.
    - Snapshot utilizado.
    - Publicações sem URL.
- **P1 — Mostrar data de atualização**, se for útil.
- [x] **P1 — Automatizar atualização do snapshot**
    - Workflow agendado.
    - Validação antes de commit/deploy.
- [x] **P1 — Rever filtros**
    - Ano.
    - Tema.
    - Idioma.
    - Estado vazio.
    - Persistência na URL, caso seja relevante.
- **P2 — Adicionar dados estruturados de publicações**, quando aplicável.

---

## 9. SEO técnico

- **P0 — Corrigir `metadataBase`**
    - Eliminar fallback para `http://localhost:3000`.
    - Confirmar metadata em todas as rotas especiais.
- **P0 — Criar metadata localizada**
    - Título.
    - Descrição.
    - Open Graph.
    - Twitter.
    - Imagem.
- **P0 — Adicionar canonical por página**
- **P0 — Adicionar alternates por página**
    - PT-PT.
    - Inglês, se publicado.
    - `x-default`.
- **P0 — Não indexar conteúdo incompleto**
    - Idiomas incompletos.
    - Páginas em construção.
    - Páginas legais vazias.
- **P0 — Rever sitemap**
    - Incluir apenas páginas publicadas.
    - Corrigir `lastModified`.
    - Confirmar prioridades.
    - Confirmar alternates.
- **P0 — Rever robots**
    - Produção.
    - Preview.
    - Staging.
- **P0 — Criar favicon e ícones finais**
- **P1 — Rever JSON-LD**
    - `Person`.
    - `LegalService`.
    - `sameAs`.
    - Países servidos.
    - Idiomas.
    - Credenciais verificáveis.
- **P1 — Rever breadcrumbs estruturados**
- **P1 — Criar OG image final**
    - PT-PT.
    - Inglês, se publicado.
    - Validar dimensões.
    - Validar legibilidade.
- **P1 — Validar previews sociais**
    - LinkedIn.
    - Facebook.
    - WhatsApp.
    - X/Twitter.
- **P1 — Validar com ferramentas**
    - Google Search Console.
    - Bing Webmaster Tools.
    - Rich Results Test.
    - Schema Validator.
- **P2 — Definir estratégia de conteúdos e keywords**
    - Pesquisa jurídica.
    - Consultoria ambiental.
    - ESG.
    - Direito migratório.
    - Portugal/Brasil.

---

## 10. Privacidade, cookies e termos

- **P0 — Criar política de privacidade**
    - Responsável pelo tratamento.
    - Dados recolhidos.
    - Finalidades.
    - Base legal.
    - Retenção.
    - Destinatários.
    - Transferências internacionais.
    - Direitos do titular.
    - Contacto.
    - Formulário.
    - Calendly.
    - Hosting.
    - Analytics, se utilizado.
- **P0 — Criar política de cookies**
    - Cookies essenciais.
    - Calendly.
    - Analytics.
    - Redes sociais.
    - Duração e fornecedores.
- **P0 — Criar termos de utilização**
    - Finalidade informativa do site.
    - Ausência de aconselhamento jurídico automático.
    - Propriedade intelectual.
    - Ligações externas.
    - Limitação de responsabilidade.
    - Jurisdição aplicável.
- **P0 — Implementar consentimento de cookies**, se existirem cookies não essenciais.
- **P0 — Bloquear terceiros antes do consentimento**, quando legalmente necessário.
- **P1 — Permitir retirar ou alterar consentimento**
- **P1 — Guardar versão e data dos textos legais**
- **P1 — Rever tudo com profissional qualificado**

---

## 11. Performance e assets

- **P0 — Remover ficheiros de zero bytes**
- **P0 — Comprimir imagens**
    - WebP ou AVIF.
    - Dimensões adequadas.
    - Qualidade visual.
    - Evitar ficheiros excessivamente grandes.
- **P0 — Comprimir vídeos**
    - Desktop.
    - Mobile.
    - Poster.
    - Codec compatível.
    - Fallback.
- **P1 — Simplificar `InteractiveHero`**
    - Remover pedidos `HEAD`.
    - Não ativar vídeo com mero `mousemove`.
    - Respeitar redução de movimento.
    - Respeitar poupança de dados.
    - Evitar downloads desnecessários.
- **P1 — Substituir Remix Icons via CDN**
    - Ícones locais.
    - SVGs próprios.
    - Biblioteca com imports seletivos.
- **P1 — Remover configuração não utilizada**
    - `readdy.ai`.
    - Mocks obsoletos.
    - Componentes sem utilização.
- **P1 — Medir Core Web Vitals**
    - LCP.
    - CLS.
    - INP.
    - TTFB.
- **P1 — Testar em ligação lenta**
    - Fast 3G.
    - Slow 4G.
    - CPU móvel limitada.
- **P2 — Definir performance budget**
    - JavaScript inicial.
    - Peso das imagens.
    - Peso dos vídeos.
    - Número de pedidos externos.

---

## 12. Robustez e tratamento de erros

- **P0 — Criar `error.tsx`**
- **P0 — Criar `global-error.tsx`**
- **P1 — Criar loading states quando necessários**
- **P1 — Criar fallback para ORCID**
    - Indicar dados temporariamente indisponíveis quando não houver snapshot.
- **P1 — Criar fallback para Calendly**
- **P1 — Tratar erros do formulário**
- **P1 — Validar variáveis de ambiente**
    - Falhar cedo quando configuração obrigatória estiver ausente.
    - Não usar defaults de produção silenciosos.
- **P1 — Adicionar logging**
    - Falhas do formulário.
    - Falhas ORCID.
    - Falhas de integração.
    - Erros inesperados.
- **P2 — Adicionar monitorização de erros**
- **P2 — Criar página de estado ou processo interno de incidentes**, se necessário.

---

## 13. Segurança

- **P0 — Confirmar que `.env.local` não está versionado**
- **P0 — Rodar qualquer segredo que possa ter sido exposto**
- **P0 — Separar variáveis públicas e privadas**
- **P0 — Validar dados do formulário no servidor**
- **P0 — Implementar rate limiting**
- **P0 — Implementar proteção contra spam**
- **P1 — Definir headers de segurança**
    - Content Security Policy.
    - `X-Content-Type-Options`.
    - `Referrer-Policy`.
    - `Permissions-Policy`.
    - Proteção de framing.
- **P1 — Restringir origens externas**
    - Calendly.
    - CDN.
    - Imagens remotas.
- **P1 — Auditar dependências**
- **P1 — Configurar atualizações automáticas de segurança**
- **P1 — Verificar exposição de emails e risco de scraping**
- **P2 — Documentar resposta a incidentes**

---

## 14. Testes automatizados

- **P0 — Corrigir o comando de lint**
    - Migrar de `next lint` para ESLint CLI.
    - Fazer warnings relevantes falharem em CI.
- **P0 — Adicionar validações de CI**
    - TypeScript.
    - ESLint.
    - Build.
    - Traduções.
    - Assets vazios.
    - Links internos.
- **P1 — Testar lógica ORCID**
    - Resposta válida.
    - Resposta vazia.
    - Resposta inválida.
    - Publicação com DOI.
    - Publicação sem DOI.
    - Ordenação.
    - Overlay editorial.
    - Snapshot fallback.
- **P1 — Testar routing**
    - Redirect da raiz.
    - PT-PT.
    - Inglês.
    - Troca de idioma.
    - Slugs localizados.

- **P1 — Criar testes end-to-end**
    - Homepage → serviço → contacto.
    - Homepage → agendamento.
    - Academia → publicação externa.
    - Troca de idioma.
    - Menu móvel.
    - Formulário válido.
    - Formulário inválido.
- **P1 — Criar testes de acessibilidade**
    - Homepage.
    - Página de serviço.
    - Contacto.
    - Agendamento.
    - Menu aberto.
- **P2 — Adicionar regressão visual**
    - Desktop.
    - Mobile.
    - PT-PT.
    - Inglês.

---

## 15. Analytics e monitorização

- **P0 — Decidir se analytics é realmente necessário**
- **P0 — Escolher solução compatível com privacidade**
- **P0 — Implementar apenas após definir consentimento**
- **P1 — Definir eventos úteis**
    - Clique em agendar.
    - Agendamento concluído.
    - Formulário enviado.
    - Clique em email.
    - Clique em publicação.
    - Mudança de idioma.
- **P1 — Evitar recolha de dados pessoais desnecessários**
- **P1 — Configurar monitorização de disponibilidade**
- **P1 — Configurar alertas de erro**
- **P2 — Criar dashboard mínimo**
    - Tráfego.
    - Conversão.
    - Páginas principais.
    - Erros.
    - Core Web Vitals.

---

## 16. Deployment e ambientes

- **P0 — Escolher plataforma de hosting**
- **P0 — Criar ambiente de preview/staging**
- **P0 — Configurar variáveis por ambiente**
    - Local.
    - Preview.
    - Produção.
- **P0 — Garantir que preview não é indexado**
- **P0 — Configurar domínio**
    - `anatrevizan.com`.
    - `www.anatrevizan.com`.
    - Redirect para domínio canónico.
    - HTTPS.
- **P0 — Configurar DNS**
- **P0 — Configurar emails do domínio**
    - Endereço profissional.
    - SPF.
    - DKIM.
    - DMARC.
- **P1 — Configurar cache**
- **P1 — Definir estratégia de rollback**
- **P1 — Confirmar logs de build e runtime**
- **P1 — Documentar processo de deployment**
- **P1 — Documentar processo de edição/publicação**
- **P2 — Automatizar deploys a partir da branch principal**

---

## 17. QA manual antes do lançamento

- **P0 — Testar todos os links internos**
- **P0 — Testar todos os links externos**
- **P0 — Confirmar que nenhum link usa `#`**
- **P0 — Testar todos os CTAs**
- **P0 — Testar formulário real**
- **P0 — Testar Calendly**
- **P0 — Testar troca de idioma**
- **P0 — Testar 404**
- **P0 — Testar páginas legais**
- **P0 — Testar sem JavaScript**, quando aplicável.
- **P0 — Testar browsers**
    - Chrome.
    - Safari.
    - Firefox.
    - Edge.
    - Safari iOS.
    - Chrome Android.
- **P0 — Testar dispositivos**
    - Telemóvel pequeno.
    - Telemóvel moderno.
    - Tablet.
    - Portátil.
    - Monitor largo.
- **P1 — Rever consola do browser**
    - Sem erros.
    - Sem 404.
    - Sem hydration warnings.
    - Sem falhas de assets.
- **P1 — Rever Network**
    - Sem pedidos desnecessários.
    - Sem assets vazios.
    - Sem URLs de desenvolvimento.
    - Sem downloads excessivos.
- **P1 — Fazer revisão final pela Ana**
    - Conteúdo.
    - Serviços.
    - Contactos.
    - Credenciais.
    - Fotografias.
    - Tom de voz.
- **P1 — Fazer revisão jurídica externa**, quando apropriado.

---

## 18. Checklist final de lançamento

- Código na branch de produção.
- TypeScript passa.
- ESLint passa.
- Testes passam.
- Build passa.
- Traduções publicadas estão completas.
- Não existem páginas placeholder.
- Não existem assets vazios.
- Não existem links `#`.
- Formulário envia e confirma corretamente.
- Calendly funciona.
- Páginas legais estão publicadas.
- Consentimento de cookies está correto.
- Sitemap contém apenas páginas publicadas.
- Canonicals e `hreflang` estão corretos.
- Preview e staging têm `noindex`.
- Metadata não contém `localhost`.
- Favicon e Open Graph estão finais.
- Domínio e HTTPS funcionam.
- Email profissional funciona.
- Analytics respeita consentimento.
- Monitorização está ativa.
- Existe backup ou histórico do conteúdo.
- Existe processo de rollback.
- Existe responsável por conteúdo e manutenção.
- Aprovação final da Ana registada.

## Ordem recomendada de execução

1. Decidir Next.js versus Astro/TinaCMS.
2. Fechar páginas, idiomas e funcionalidades do lançamento.
3. Rever conteúdo e enquadramento jurídico.
4. Finalizar identidade, imagens e vídeos.
5. Implementar CMS/modelo editorial.
6. Terminar contacto, Calendly e páginas legais.
7. Corrigir internacionalização e SEO.
8. Corrigir acessibilidade.
9. Simplificar e estabilizar integrações.
10. Adicionar lint, testes e CI.
11. Fazer QA completo em staging.
12. Configurar domínio, monitorização e lançamento.
