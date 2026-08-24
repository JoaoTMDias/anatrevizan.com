# Fase 3 — auditoria visual e grupos de implementação

> Auditoria da referência Next.js concluída em 24 de agosto de 2026. A
> referência define a direção visual, não a arquitetura da implementação.

## Limite da fase

A fase 3 transpõe o sistema visual e os componentes partilhados para Astro e
Tailwind CSS 4. Não altera as 19 rotas, o modelo editorial, o conteúdo, os
estados de publicação ou a estratégia PT-PT/EN. Também não inclui formulário e
integrações, ORCID, texto legal final, traduções incompletas, analytics,
consentimento ou media ainda não aprovada.

## Auditoria da referência Next.js

### Tokens, tipografia e cor

- Títulos em Playfair Display e corpo/interface em Inter, ambos com `swap`.
- Cor primária vinho, construída como escala OKLCH em torno de `#722f37`.
- Verde como acento editorial, sobretudo para Ambiente e ESG, e não como uma
  segunda marca concorrente.
- Superfícies quentes branco/creme e texto cinzento quase neutro.
- A referência tem escalas de 50–950, mas os componentes usam sobretudo
  vinho 500–800, verde 100/400–600, fundo 50–300 e texto 500–900.
- O creme `#fff3dc` e o verde profundo `#12261a` aparecem nos heroes. Ficam
  reservados ao grupo de media/heroes, pois os assets ainda não estão aprovados.

### Espaçamento, contentores e forma

- Contentor global máximo de 1280 px, com 24 px laterais em mobile e 40 px a
  partir de tablet.
- Secções usam normalmente 64–80 px verticais; grelhas usam intervalos de 24 px.
- Botões usam 24 px horizontais e 12 px verticais; alvos devem manter pelo menos
  44 px de altura.
- Raios contidos: 6–8 px em botões, menus e cartões; pills apenas para tags.
- Cartões usam borda clara, superfície creme, padding de 24–32 px e sombra
  discreta. Menus flutuantes usam sombra mais marcada.

### Header e navegação

- Header fixo com 64 px em mobile e 80 px em desktop, assinatura tipográfica à
  esquerda, duas áreas com submenus, links institucionais, idioma e CTA.
- A versão de referência abre menus por hover/click mas não expõe corretamente
  o estado, não fecha todos os fluxos com Escape, não gere o foco do drawer e
  não impede interação com o fundo.
- A implementação Astro deve manter HTML estático e um script mínimo: estado
  expandido, fecho exterior/Escape, foco devolvido, contenção de foco e fundo
  inerte no drawer.
- A barra CTA fixa inferior da referência é omitida: pode tapar conteúdo e o
  CTA continua disponível no menu e nas secções editoriais.

### Footer

- Quatro colunas em desktop, duas em tablet e uma em mobile.
- Fundo creme suave, títulos em Playfair, links pequenos e discretos, seguido
  por uma barra vinho escura.
- Contactos e perfis devem vir exclusivamente da configuração TinaCMS; nenhum
  destino provisório ou `href="#"` pode ser recriado.

### Primitivos e estados

- Botão primário vinho, botão outline vinho, variantes de baixo destaque e
  links sublinhados. Estados hover não podem ser a única indicação.
- Cards, tags, filtros e notices partilham raio, borda, tipografia e ritmo.
- O notice editorial existente mantém texto e semântica; esta fase só o alinha
  visualmente com a fundação.
- Todo o foco visível usa um anel de alto contraste com offset. Em forced colors
  usa a cor de texto do sistema.

### Responsividade, movimento e dados

- Breakpoints dominantes: 640, 768 e 1024 px; layouts passam de uma para duas e
  três/quatro colunas progressivamente.
- O contentor usa padding fluido para garantir reflow a 320 px e a largura CSS
  equivalente a zoom de 400%.
- Transições globais são neutralizadas com `prefers-reduced-motion: reduce`.
- A referência ativa vídeo após interações genéricas, faz `HEAD` no cliente e
  carrega um shader por CDN. Esses comportamentos não serão migrados. O grupo
  de media terá imagem estática por defeito e só poderá carregar vídeo aprovado
  quando movimento reduzido e `navigator.connection.saveData` o permitirem.

## Divisão verificável da fase 3

1. **Fundação e shell global (este conjunto):** tokens, fontes, contentor,
   foco/movimento, header, menus, footer, botões, cards e notices.
2. **Estruturas editoriais comuns:** heroes estáticos, breadcrumbs, títulos de
   secção, grelhas, CTAs e estados vazios; sem media final.
3. **Família Consultoria:** aplicar as estruturas às seis páginas e validar o
   acento verde onde já está aprovado pela direção visual.
4. **Família Academia:** aplicar as estruturas às seis páginas, incluindo os
   estados visuais de listas e filtros sem implementar ORCID.
5. **Institucional e fecho visual:** Home, Sobre, Contacto, Agendamento e páginas
   legais; QA cruzado das 19 rotas e inventário de media pendente.

Cada grupo deve passar `astro check`, testes unitários relevantes, Playwright,
build local e `git diff --check`, além de verificação manual proporcional.

## Problemas herdados corrigidos neste conjunto

- tokens provisórios do starter não correspondiam à referência aprovada;
- fonte de títulos ausente;
- navegação móvel sem contenção/devolução de foco ou fundo inerte;
- estados expandidos não refletidos explicitamente em `aria-expanded`;
- contactos ainda não apareciam no footer partilhado;
- não existia uma regra global de movimento reduzido ou forced-colors.

## Decisões e diferimentos

Não é necessária uma nova decisão de produto para este conjunto: a direção já
está estabelecida. Identidade final, favicon, OG, fotografias, vídeos, shader,
CTA móvel persistente e acento visual específico dos templates ficam diferidos
para os grupos próprios e dependem dos assets/aprovações correspondentes.
