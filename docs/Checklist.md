# Checklist para lançamento do anatrevizan.com

> Lista originalmente baseada na implementação Next.js e atualizada após as
> decisões técnicas de agosto de 2026. A versão Next.js permanece como
> especificação; a implementação final será feita em Astro + TinaCMS.
>
> As decisões concluídas estão registadas em `Decisões técnicas.md`.

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

- **P0 — Confirmar o ORCID correto**
- **P0 — Rever todas as publicações importadas**
    - Títulos.
    - Datas.
    - Revista ou publicação.
    - DOI.
    - Links.
    - Tipo de publicação.
- **P0 — Garantir que nenhuma publicação usa `href="#"`**
- **P0 — Validar dados ORCID em runtime**
    - Criar schema para a resposta externa.
    - Rejeitar estruturas inválidas.
    - Tratar valores inesperados.
- **P1 — Eliminar `any` do parser**
- **P1 — Unificar lógica entre runtime e `sync-orcid.mjs`**
- **P1 — Rever identificação de idioma**
    - Definir idioma manualmente no overlay quando necessário.
    - Não depender apenas da heurística do título.
- **P1 — Registar falhas de sincronização**
    - ORCID indisponível.
    - Resposta inválida.
    - Snapshot utilizado.
    - Publicações sem URL.
- **P1 — Mostrar data de atualização**, se for útil.
- **P1 — Automatizar atualização do snapshot**
    - Workflow agendado.
    - Validação antes de commit/deploy.
- **P1 — Rever filtros**
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
