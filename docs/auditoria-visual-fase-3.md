# Auditoria visual da fase 3

Estado: em curso. Este documento não certifica ainda a conclusão da fase 3.

## Método

- comparação renderizada entre a referência Next.js (`/pt-pt`) e o Astro;
- viewport desktop de 1270 × 900 CSS px e viewport mobile de 320 × 900 CSS px;
- captura de página completa, medição de altura, header, footer e overflow;
- verificação separada dos estados abertos da navegação desktop e mobile;
- diferenças editoriais ou funcionais deliberadas registadas separadamente das diferenças visuais.

## Problemas globais confirmados

- Os binários Inter e Playfair Display não eram os mesmos da referência, alterando métricas e quebras de linha.
- `text-wrap: balance` tinha sido aplicado globalmente aos títulos, embora não exista na referência.
- Classes personalizadas dos CTAs perdiam para as variantes Tailwind do componente `Button`.
- O footer colocava as ligações legais na coluna de contacto em vez da coluna institucional.
- O dropdown desktop tinha uma linha adicional, largura de 400 px e etiquetas em maiúsculas; a referência usa 320 px e não tem essa linha.
- O drawer mobile tinha altura zero porque `backdrop-filter` alterava o bloco de referência do elemento fixo.
- Faltava a barra CTA fixa em mobile.
- Os filtros de Consultoria eram botões `outline` independentes em vez de um controlo segmentado.
- O estado vazio de Eventos perdeu o ícone e o botão verde da referência.
- Contacto e Agendamento não tinham testes geométricos das duas colunas.

## Matriz das 19 rotas

| Rota Astro | Família | Estado da comparação | Diferenças ainda admitidas ou por rever |
| --- | --- | --- | --- |
| `/` | Home | correções aplicadas; recaptura pendente | identidade/CTA do header e barra legal do footer dependem de conteúdo aprovado |
| `/consultoria` | Consultoria hub | correções aplicadas; recaptura pendente | filtros, cartões e dropdown a revalidar após build |
| `/consultoria/migracao-e-mobilidade` | Serviço | correções aplicadas; recaptura pendente | destino/rótulo do cross-link editorial difere da referência |
| `/consultoria/juridica` | Serviço | recaptura pendente | media da referência é um ficheiro vazio; usa fallback estático |
| `/consultoria/ambiental-e-esg` | Serviço | recaptura pendente | media estática aprovada para a migração; vídeo ainda não ativado |
| `/consultoria/politicas-publicas` | Serviço | recaptura pendente | media da referência é um ficheiro vazio; usa fallback estático |
| `/consultoria/pareceres` | Serviço | recaptura pendente | media da referência é um ficheiro vazio; usa fallback estático |
| `/academia` | Academia hub | recaptura pendente | CTA/footer afetados pelas correções globais |
| `/academia/mentorias` | Serviço académico | recaptura pendente | conteúdo e estado editorial preservados |
| `/academia/publicacoes` | Publicações | recaptura pendente | registos e ordem do snapshot editorial preservados; sincronização ORCID adiada |
| `/academia/eventos` | Eventos | correções aplicadas; recaptura pendente | estado vazio honesto preservado |
| `/academia/palestras` | Palestras | recaptura pendente | kit/media final não aprovado não é publicado |
| `/academia/formacoes` | Formação | recaptura pendente | conteúdo e estado editorial preservados |
| `/sobre` | Institucional | recaptura pendente | identidade e credenciais não são inventadas nem reescritas |
| `/contacto` | Contacto | composição desktop corrigida | aviso e campos desativados mantidos porque o envio funcional está fora desta fase |
| `/agendar` | Agendamento | composição desktop corrigida | link externo Calendly substitui deliberadamente o embed da referência |
| `/politica-de-privacidade` | Legal | diferença editorial deliberada | referência contém apenas placeholder; texto final exige revisão jurídica |
| `/termos` | Legal | diferença editorial deliberada | referência contém apenas placeholder; texto final exige revisão jurídica |
| `/cookies` | Legal | diferença editorial deliberada | referência contém apenas placeholder; texto final exige revisão jurídica |

## Critério para encerrar uma linha

Uma rota só pode passar de “recaptura pendente” para validada depois de:

1. nova captura desktop e mobile feita sobre o build atualizado;
2. inspeção do header, conteúdo principal, CTA e footer;
3. ausência de overflow, erros de consola e assets em falta;
4. teste de teclado e foco nos controlos existentes;
5. registo explícito de qualquer diferença editorial ou funcional inevitável.
