# Auditoria visual da fase 3

Estado: concluída. A matriz das 19 rotas, os componentes globais e as diferenças deliberadamente adiadas foram validados no encerramento da fase 3.

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
- O drawer mobile não apresentava identidade nem um controlo explícito para fechar.
- Os cartões de Publicações usavam botões menores, entrelinha e margens diferentes da referência.

## Última matriz renderizada

Executada sobre o build de preview atualizado, nas 19 rotas, a 1270 px e 320 px:

- 76 navegações (Next e Astro) sem erros de consola;
- nenhuma das 38 renderizações Astro apresenta overflow horizontal;
- a referência Next mantém overflow próprio a 320 px em Contacto (348 px) e Agendamento (344 px), problema que não foi reproduzido;
- Home: 4071/4118 px em desktop e 7682/7686 px em mobile (Next/Astro);
- Publicações: 6421/6319 px em desktop; a soma dos 25 cartões é 4114/4016 px após a correção tipográfica;
- as diferenças grandes restantes em Contacto, Agendamento e páginas legais correspondem aos limites funcionais/editoriais documentados abaixo.

## Matriz das 19 rotas

| Rota Astro | Família | Estado da comparação | Diferenças ainda admitidas ou por rever |
| --- | --- | --- | --- |
| `/` | Home | validada em desktop e mobile | identidade, CTAs globais e barra legal do footer alinhados com a decisão aprovada |
| `/consultoria` | Consultoria hub | validada em desktop e mobile | sem diferença estrutural pendente |
| `/consultoria/migracao-e-mobilidade` | Serviço | validada visualmente | cross-link “Conhecer o percurso” alinhado com a referência por decisão do utilizador |
| `/consultoria/juridica` | Serviço | validada em desktop e mobile | media da referência é um ficheiro vazio; usa fallback estático |
| `/consultoria/ambiental-e-esg` | Serviço | validada após correção dedicada | media estática aprovada para a migração; vídeo copiado mas não ativado |
| `/consultoria/politicas-publicas` | Serviço | validada em desktop e mobile | media da referência é um ficheiro vazio; usa fallback estático |
| `/consultoria/pareceres` | Serviço | validada em desktop e mobile | media da referência é um ficheiro vazio; usa fallback estático |
| `/academia` | Academia hub | validada em desktop e mobile | sem diferença estrutural pendente |
| `/academia/mentorias` | Serviço académico | validada em desktop e mobile | conteúdo e estado editorial preservados |
| `/academia/publicacoes` | Publicações | validada em desktop e mobile | prioridade editorial do snapshot modelada; sincronização ORCID adiada |
| `/academia/eventos` | Eventos | validada após correção do estado vazio | estado vazio honesto preservado |
| `/academia/palestras` | Palestras | validada em desktop e mobile | kit/media final não aprovado não é publicado |
| `/academia/formacoes` | Formação | validada em desktop e mobile | conteúdo e estado editorial preservados |
| `/sobre` | Institucional | validada em desktop e mobile | identidade e credenciais não são inventadas nem reescritas |
| `/contacto` | Contacto | composição e responsividade validadas | aviso e campos desativados mantidos porque o envio funcional está fora desta fase |
| `/agendar` | Agendamento | composição e responsividade validadas | link externo Calendly substitui deliberadamente o embed da referência |
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

## Encerramento

Problemas herdados corrigidos: identidade e CTAs globais divergentes, rodapé incompleto, ligações sociais com destino falso, contactos sem apresentação acessível, ordenação visual de publicações não determinística e exposição do tipo técnico nos cartões.

Decisões aprovadas e aplicadas: identidade “Dra. Ana Trevizan”, etiquetas dos CTAs, três blocos editoriais inferiores do rodapé, regiões e idiomas editáveis, prioridade numérica opcional para publicações, ocultação do seletor EN e preservação do tipo técnico apenas nos dados.

Problemas deliberadamente adiados: sincronização ORCID remota, formulário funcional e respetivas integrações, traduções inglesas incompletas, texto legal definitivo, consentimento/analytics e media ainda não aprovada. A ausência de lógica específica de `Save-Data` nesta fase é intencional: nenhuma experiência migrada ativa vídeo ou outro media pesado; o vídeo copiado permanece inativo.

O lock do Tina foi regenerado e formatado. Além dos campos deste encerramento, o diff incorpora as definições das três páginas legais que já existiam no schema mas ainda não tinham sido refletidas no lock versionado; não contém truncamento nem alterações não semânticas.
