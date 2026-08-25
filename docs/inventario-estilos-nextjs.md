# Inventário integral de estilos da referência Next.js

Este documento controla a cobertura visual da fase 3. A referência em
`/home/joao/www/versao-nextjs` define a aparência a migrar; Astro e Tailwind
CSS 4 continuam a definir a arquitetura da implementação.

## Critério de conclusão

Nenhum grupo pode ser considerado visualmente concluído apenas por usar os
tokens globais. Cada declaração visual da referência deve ficar coberta por
uma implementação Astro equivalente ou por um registo explícito numa das duas
exceções permitidas:

- asset final ainda não aprovado;
- comportamento que contradiz acessibilidade, privacidade, Save-Data ou
  `prefers-reduced-motion`, preservando-se nesse caso a aparência estática.

Redundância ou qualidade insuficiente do CSS original não constituem motivo
para omitir a aparência correspondente.

## Universo auditado

- 118 linhas em `src/app/globals.css`;
- tema completo em `tailwind.config.ts`;
- 650 ocorrências de classes, estilos inline, tokens e media queries;
- 21 templates de página;
- 12 componentes visuais partilhados;
- estados desktop, tablet, mobile, hover, focus, active, disabled e vazio.

## Cobertura

| Área da referência | Estado | Destino Astro |
| --- | --- | --- |
| Escalas primary, accent, secondary, background e foreground 50–950 | Migrado | `src/styles/global.css` |
| Inter, Playfair Display e alias de label | Migrado | `src/styles/global.css` |
| Contentor, botões, títulos, subtítulos e cartões base | Migrado | `src/styles/global.css`, `src/components/ui/` |
| Header desktop/mobile, dropdowns e estados ativos | Migrado e validado | `src/components/Header.astro` |
| Footer responsivo e barra inferior | Migrado e validado | `src/components/Footer.astro` |
| Hero interno, breadcrumb, tag e overlay estático | Migrado sem media final | `src/components/editorial/PageHero.astro` |
| Hero líquido Ambiental/ESG | Aparência estática migrada; shader e media diferidos | `PageHero.astro`, `global.css` |
| CTA partilhado | Migrado | `src/components/editorial/ContactCta.astro` |
| Hub e cinco serviços de Consultoria | Migrado e validado | `ConsultingHubPage.astro`, `ConsultingServicePage.astro` |
| Hub e páginas da Academia | Migrado e validado no grupo 4 | `src/components/editorial/Academic*.astro` e páginas dedicadas |
| Home e Sobre | Migrado e validado no grupo 5 | `HomePage.astro`, `AboutPage.astro` |
| Contacto e formulário visual | Migrado e validado; sem submissão funcional | `ContactPage.astro` |
| Agendamento e Calendly visual | Migrado e validado; sem embed | `BookingPage.astro` |
| Legais e placeholders | Migrado e validado como estado de revisão | componentes legais e estados vazios |
| Página 404 e OG visual | Migrado e validado com placeholder tipográfico | `src/pages/404.astro`, `BaseHead.astro`, `public/og-default.svg` |

## Elementos deliberadamente não copiados como implementação

- carregamento de vídeo após interação genérica;
- pedidos `HEAD` no cliente para detetar assets vazios;
- shader Three.js por CDN;
- embed Calendly e formulário funcional antes das fases próprias;
- navegação hover-only e drawer sem gestão de foco;
- links falsos, downloads inexistentes e media vazia.

A aparência estática associada a estes elementos continua dentro da cobertura;
apenas os mecanismos problemáticos ficam excluídos.
