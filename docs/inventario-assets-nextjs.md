# Inventário de assets da referência Next.js

Auditoria realizada sobre `/home/joao/www/versao-nextjs/public` antes da cópia
para a implementação Astro.

## Assets válidos copiados

| Ficheiro | Tamanho | Validação |
| --- | ---: | --- |
| `hero-home.webp` | 83 708 bytes | WebP 1600 × 900 |
| `hero-ambiental.webp` | 284 580 bytes | WebP 1600 × 900 |
| `hero-consultoria.webp` | 111 500 bytes | WebP 1918 × 1078 |
| `hero-consultoria-desktop.mp4` | 7 411 011 bytes | MP4 válido |
| `hero-consultoria-mobile.mp4` | 586 784 bytes | MP4 válido |

Os cinco ficheiros foram copiados byte a byte para `public/`, mantendo os
nomes da referência. Os respetivos SHA-256 coincidem com os ficheiros de
origem.

## Placeholders vazios não copiados

Os 40 ficheiros seguintes têm 0 bytes na referência. Não constituem uma cópia
utilizável e não são adicionados ao Astro, em conformidade com a regra do
projeto que proíbe assets vazios:

- `hero-academia-desktop.mp4`, `hero-academia-mobile.mp4`, `hero-academia.webp`;
- `hero-agendar-desktop.mp4`, `hero-agendar-mobile.mp4`, `hero-agendar.webp`;
- `hero-contacto-desktop.mp4`, `hero-contacto-mobile.mp4`, `hero-contacto.webp`;
- `hero-eventos-desktop.mp4`, `hero-eventos-mobile.mp4`, `hero-eventos.webp`;
- `hero-formacoes-desktop.mp4`, `hero-formacoes-mobile.mp4`, `hero-formacoes.webp`;
- `hero-home-desktop.mp4`, `hero-home-mobile.mp4`;
- `hero-juridica-desktop.mp4`, `hero-juridica-mobile.mp4`, `hero-juridica.webp`;
- `hero-mentorias-desktop.mp4`, `hero-mentorias-mobile.mp4`, `hero-mentorias.webp`;
- `hero-migracao-desktop.mp4`, `hero-migracao-mobile.mp4`, `hero-migracao.webp`;
- `hero-palestras-desktop.mp4`, `hero-palestras-mobile.mp4`, `hero-palestras.webp`;
- `hero-pareceres-desktop.mp4`, `hero-pareceres-mobile.mp4`, `hero-pareceres.webp`;
- `hero-politicas-publicas-desktop.mp4`, `hero-politicas-publicas-mobile.mp4`,
  `hero-politicas-publicas.webp`;
- `hero-publicacoes-desktop.mp4`, `hero-publicacoes-mobile.mp4`,
  `hero-publicacoes.webp`;
- `hero-sobre-desktop.mp4`, `hero-sobre-mobile.mp4`, `hero-sobre.webp`.

## Utilização

Esta alteração conserva uma cópia local dos assets válidos. A integração dos
vídeos nos heroes deve ser feita separadamente, com poster estático, sem
autoplay obrigatório, e respeitando `prefers-reduced-motion` e Save-Data.
