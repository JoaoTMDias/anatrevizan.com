# Relatório técnico — versão Next.js

> **Estado do documento:** auditoria histórica da implementação Next.js.
> A fundação final foi posteriormente definida como Astro + TinaCMS. A versão
> Next.js permanece como referência visual, funcional e editorial, não como
> código destinado a produção. Consultar `Decisões técnicas.md`.

## Resumo executivo

A implementação Next.js está acima do nível de um protótipo descartável: compila, tem TypeScript válido, uma arquitetura reconhecível e várias decisões tecnicamente sensatas. Contudo, ainda não apresenta o acabamento, consistência e validação necessários para produção.

A impressão geral é a de um projeto construído rapidamente, muito provavelmente com forte assistência de IA, e revisto apenas parcialmente por uma pessoa com pouca experiência. Não há evidência suficiente para afirmar quanto foi gerado por IA, mas existem vários padrões compatíveis com esse processo.

### Avaliação geral

|Área|Avaliação|
|---|---|
|Arquitetura técnica|7/10|
|Organização de ficheiros|7/10|
|Legibilidade|7/10|
|TypeScript|7/10|
|Next.js/App Router|7/10|
|Reutilização de componentes|7/10|
|Internacionalização|4/10|
|SEO|6/10|
|Acessibilidade|4/10|
|Performance|6/10|
|Robustez funcional|4/10|
|Testes e garantia de qualidade|2/10|
|Manutenção editorial|3/10|
|Prontidão para produção|4/10|

Conclusão curta: é uma boa prova de conceito e uma boa referência visual/editorial, mas não é ainda uma implementação madura.

---

## 1. Arquitetura geral

O projeto utiliza:

- Next.js 15 com App Router;
- React 19;
- TypeScript em modo estrito;
- Tailwind CSS;
- `next-intl`;
- Server Components por defeito;
- Client Components apenas onde existe interatividade;
- geração estática das páginas;
- ORCID como fonte externa;
- Calendly;
- JSON-LD, sitemap, robots e Open Graph.

A estrutura principal é convencional:

```
src/
├── app/          Rotas e páginas
├── components/   Componentes partilhados
├── content/      Dados editoriais em TypeScript/JSON
├── i18n/         Routing e carregamento de traduções
├── lib/          Integrações e utilitários
├── messages/     Conteúdo localizado
└── mocks/        Dados auxiliares
```

Esta organização é fácil de compreender e não apresenta fragmentação excessiva.

### Aspetos positivos

- As rotas seguem corretamente o App Router.
- O segmento `[locale]` centraliza a internacionalização.
- `generateStaticParams()` gera as páginas dos idiomas publicados.
- A maioria das páginas permanece como Server Component.
- Os componentes interativos estão explicitamente marcados com `"use client"`.
- Não encontrei fronteiras Server/Client inválidas.
- Não existem erros TypeScript.
- O build de produção gera corretamente 44 páginas.

### Limitações

A arquitetura parece mais desenhada para demonstrar o site do que para o manter ao longo do tempo:

- não existe CMS;
- muito conteúdo está diretamente acoplado aos ficheiros de tradução;
- metadata editorial está escrita dentro das páginas;
- não existe um modelo de conteúdo central;
- vários conceitos aparecem em componentes, mensagens e arrays TypeScript diferentes;
- não há uma estratégia clara para previews editoriais;
- atualizações exigem intervenção de um programador.

---

## 2. Qualidade do código

A qualidade média é razoável. O código é legível, os componentes têm nomes claros e as responsabilidades estão geralmente identificáveis.

### Pontos fortes

- `strict: true` está ativo no TypeScript.
- Os tipos de rotas e locales são reutilizados.
- Existem interfaces para dados relevantes.
- Há boa utilização de `next/image`, `next/font` e Metadata API.
- O código evita dependências desnecessárias.
- A lógica de ORCID está relativamente isolada.
- Os componentes partilhados evitam duplicação substancial entre páginas de serviço.
- A nomenclatura é semanticamente útil: `ServicePage`, `ContactCta`, `PublicacoesList`, `ConsultoriaHub`.

### Pontos fracos

Existem várias soluções provisórias que foram incorporadas como se fossem arquitetura final:

- pedidos `HEAD` no cliente para verificar se vídeos placeholder têm conteúdo;
- formulário implementado com `mailto:`;
- links sociais com `href="#"`;
- ficheiros de assets vazios;
- páginas legais com conteúdo “em construção”;
- traduções incompletas escondidas por fallback;
- strings e URLs pessoais repetidas em vários ficheiros;
- configuração de imagens para `readdy.ai` sem uso identificado;
- Remix Icons carregados externamente por CDN.

Há também alguns sinais de falta de refinamento:

- `any` na normalização dos resultados ORCID;
- ausência de validação runtime dos dados externos;
- ausência de logs ou observabilidade para falhas do ORCID;
- erros do ORCID são silenciosamente convertidos em fallback;
- algumas chaves de listas usam texto humano como identificador;
- falta de constantes centrais para email, redes sociais e identidade;
- comentários descrevem comportamentos provisórios, mas não há tarefas ou tracking formal para os substituir.

---

## 3. Implementação do Next.js

A utilização do App Router é, no geral, correta.

### Bem implementado

- `params` é tratado como `Promise`, conforme o modelo do Next.js 15.
- As chamadas de internacionalização são feitas no servidor.
- As páginas são pré-renderizadas.
- A integração ORCID usa revalidação diária.
- Não existe uma API interna desnecessária para consultar o ORCID.
- O layout usa `next/font`.
- A homepage usa `next/image` corretamente.
- Sitemap, robots e OG image usam convenções nativas do framework.
- O build não revelou erros de Server Components ou hidratação.

### A melhorar

Não existem:

- `error.tsx`;
- `global-error.tsx`;
- `loading.tsx`;
- boundaries para integrações externas;
- tratamento explícito de falhas de Calendly;
- validação de configuração obrigatória;
- testes às rotas localizadas;
- páginas ou componentes de fallback para conteúdo inválido.

A homepage consulta o ORCID durante a geração/revalidação. Existe snapshot de fallback, o que é positivo, mas a dependência externa passa a fazer parte do processo de atualização da página.

---

## 4. Internacionalização

A arquitetura de internacionalização é uma das partes conceptualmente mais interessantes, mas a execução está muito incompleta.

O routing em [routing.ts](/home/joao/www/versao-nextjs/src/i18n/routing.ts) suporta:

- PT-PT e inglês;
- prefixo obrigatório de idioma;
- slugs localizados;
- tipagem dos caminhos;
- futura expansão para espanhol.

O carregamento em [request.ts](/home/joao/www/versao-nextjs/src/i18n/request.ts) faz deep merge sobre PT-PT. Isto permite que traduções incompletas continuem a funcionar.

Esse fallback é conveniente durante desenvolvimento, mas perigoso em produção: uma página inglesa pode apresentar uma combinação de inglês e português sem gerar qualquer erro.

### Estado confirmado

- Inglês: 8% dos textos traduzidos.
- Espanhol: 0%.
- Quase todas as páginas inglesas continuam em português.
- Vária metadata inglesa também aparece em português.

O script de validação apenas falha para JSON inválido. Traduções ausentes ou a 0% continuam a produzir exit code `0`, pelo que não serve como quality gate.

### Recomendação

Separar:

1. validação de sintaxe;
2. relatório de progresso;
3. validação de publicação.

O build de produção deveria falhar quando um locale publicado não atingir 100%, ou deveria existir uma allowlist explícita para conteúdo em fallback.

---

## 5. Integração ORCID

A implementação em [orcid.ts](/home/joao/www/versao-nextjs/src/lib/orcid.ts) é uma das melhores partes do projeto.

### Pontos positivos

- O identificador ORCID está centralizado.
- Apenas tipos de publicação relevantes são aceites.
- Os dados externos são normalizados.
- DOI tem prioridade na criação de links e IDs.
- Existe snapshot local como fallback.
- O fetch usa revalidação de 24 horas.
- Existe uma camada editorial separada para temas, idioma e destaques.
- A ordenação permite prioridade manual.

### Problemas

- A resposta externa é tratada como `any`.
- Não existe validação com Zod ou equivalente.
- Só é usado o primeiro `work-summary` de cada grupo.
- A deteção de idioma pelo título é muito rudimentar.
- Um título espanhol pode ser classificado como inglês ou português.
- Publicações sem DOI ou URL recebem `href="#"`.
- O fallback é completamente silencioso.
- Não há registo de quando o snapshot foi atualizado.
- Script e runtime repetem algumas regras e constantes.
- O código assume que o ORCID é a fonte integral da produção, o que deve ser confirmado editorialmente.

A arquitetura é boa, mas precisa de validação de dados e observabilidade.

---

## 6. Componentes e reutilização

A abstração [ServicePage.tsx](/home/joao/www/versao-nextjs/src/components/ServicePage.tsx) reduz repetição entre páginas e é uma decisão adequada.

Também são úteis:

- `ContactCta`;
- `PublicacoesList`;
- `ConsultoriaHub`;
- `InteractiveHero`;
- `JsonLd`.

Porém, parte da reutilização é superficial: várias páginas continuam responsáveis por montar manualmente grandes objetos a partir de traduções. O resultado reduz repetição visual, mas não cria um verdadeiro modelo editorial.

### `InteractiveHero`

É um componente visualmente ambicioso, mas tecnicamente excessivo:

- escuta sete tipos de eventos globais;
- ativa vídeo com um simples movimento do rato;
- faz um pedido `HEAD`;
- consulta media query apenas no momento da ativação;
- mantém múltiplos estados para fallback;
- inicia reprodução programaticamente e por `autoPlay`;
- não respeita redução de movimento;
- não respeita preferência de poupança de dados;
- não reage adequadamente a resize ou mudança de orientação;
- usa background CSS em vez de `next/image` para a fotografia.

Esta complexidade existe sobretudo porque os assets estão incompletos. Com assets finais, o componente deveria ser consideravelmente simplificado.

---

## 7. Formulários e integrações

O componente [ContactForm.tsx](/home/joao/www/versao-nextjs/src/components/ContactForm.tsx) não envia informação ao servidor. Abre o cliente de email do utilizador.

Isto é aceitável como protótipo, mas não como formulário final:

- depende de uma aplicação de email local;
- não oferece confirmação;
- não permite tracking;
- não tem rate limiting;
- não tem proteção contra bots;
- não tem tratamento de erros;
- não preserva o texto se a aplicação externa falhar.

O Calendly está corretamente carregado através de `next/script`, mas:

- não existe fallback visível;
- a URL tem um valor predefinido que pode esconder configuração ausente;
- falta confirmar consentimento/cookies;
- falta integrar esta dependência na política de privacidade.

---

## 8. SEO

A fundação de SEO é razoável:

- sitemap;
- robots;
- Open Graph image;
- metadata;
- JSON-LD;
- URLs localizadas;
- `hreflang` no sitemap;
- títulos e descrições por várias páginas.

### Problemas confirmados

O build produziu avisos de `metadataBase` ausente em alguns contextos e usou `http://localhost:3000` como fallback.

Além disso:

- metadata das páginas está escrita em português;
- páginas inglesas recebem títulos portugueses;
- falta canonical localizado em cada página;
- `openGraph.url` global aponta para a raiz;
- faltam alternates na metadata HTML;
- a OG image contém texto apenas em português;
- `lastModified` no sitemap é sempre a data do build;
- páginas placeholder são indexáveis;
- conteúdo inglês incompleto é indexável;
- não há ícones finais visíveis no projeto.

A intenção de SEO é boa, mas falta consistência entre locale, rota e metadata.

---

## 9. Acessibilidade

Esta é uma das áreas mais frágeis.

O header tem menus interativos, dropdowns e drawer móvel, mas falta:

- `aria-expanded`;
- `aria-controls`;
- identificação semântica dos menus;
- Escape para fechar;
- gestão de foco;
- focus trap no menu móvel;
- devolução de foco ao botão;
- bloqueio do conteúdo de fundo;
- indicação acessível do idioma de destino;
- revisão do contraste da navbar transparente sobre diferentes heroes.

Os vídeos não consideram `prefers-reduced-motion`.

O uso extensivo de `<i>` com classes externas exige verificar quais ícones são decorativos e aplicar `aria-hidden` consistentemente.

A barra CTA fixa em mobile deve ser testada para garantir que não tapa:

- conteúdo;
- links legais;
- botões;
- controlos do Calendly.

---

## 10. Performance

O build reporta:

- aproximadamente 102 kB de JavaScript partilhado;
- páginas interativas geralmente entre 109 e 131 kB;
- middleware com cerca de 52,7 kB;
- páginas pré-renderizadas com sucesso.

Não são números desastrosos, mas são elevados para um site essencialmente institucional.

As principais fontes de custo são:

- React e hidratação;
- `next-intl` no cliente;
- header interativo global;
- biblioteca externa de ícones;
- heroes em vídeo;
- Calendly;
- componentes client-side para filtros.

Uma versão Astro poderia entregar grande parte destas páginas com praticamente zero JavaScript, hidratando apenas menu, filtros, formulário e agenda.

---

## 11. Testes e ferramentas de qualidade

O projeto não contém testes automatizados.

Não encontrei:

- Vitest/Jest;
- React Testing Library;
- Playwright/Cypress;
- axe;
- testes de integração;
- testes de routing;
- testes do parser ORCID;
- testes das traduções;
- validação de links;
- validação dos ficheiros hero.

Resultados técnicos:

- TypeScript: passou;
- build: passou;
- 44 páginas geradas;
- ESLint durante o build: três warnings menores;
- `npm run lint`: usa `next lint`, já obsoleto;
- traduções: executam, mas não falham quando incompletas.

Os três warnings de lint são apenas relativos a default exports anónimos nos índices de mensagens. Não representam um problema funcional importante.

---

## 12. Sinais de utilização intensiva de IA

Não é possível determinar autoria apenas pelo código. Ainda assim, existem sinais compatíveis com desenvolvimento fortemente assistido por IA:

- comentários muito explicativos em código simples;
- comentários que descrevem intenções futuras sem implementação associada;
- arquitetura relativamente sofisticada combinada com lacunas básicas;
- implementação extensa de SEO antes de completar links e conteúdo legal;
- ficheiros placeholder criados em massa;
- tradução replicada estruturalmente, mas sem conteúdo traduzido;
- abstrações cuidadas ao lado de `href="#"`;
- um componente hero excessivamente complexo para contornar assets vazios;
- configuração de `readdy.ai`, possivelmente deixada por uma ferramenta de geração;
- design system consistente, mas validação funcional reduzida;
- páginas numerosas criadas antes da finalização dos fluxos essenciais;
- documentação e comentários com mais maturidade aparente do que algumas decisões runtime.

O padrão mais provável é:

1. definição de arquitetura e páginas por prompts;
2. geração de componentes e conteúdo em grandes blocos;
3. integração incremental;
4. correções suficientes para o TypeScript e build passarem;
5. pouca validação manual de acessibilidade, conteúdo, links e experiência real.

Isto não invalida o trabalho. O problema não é ter usado IA; é não existir uma fase de revisão técnica e editorial proporcional à quantidade de código gerado.

---

## 13. Dívida técnica por prioridade

### Crítica antes de produção

- Terminar ou remover inglês.
- Não publicar espanhol enquanto estiver vazio.
- Substituir o formulário `mailto:`.
- Criar privacidade, cookies e termos reais.
- Corrigir links `#`.
- Substituir assets vazios.
- Rever consentimento do Calendly.
- Corrigir metadata localizada e canonical.
- Rever acessibilidade do header e drawer.
- Impedir indexação de páginas incompletas.

### Importante

- Migrar `next lint` para ESLint CLI.
- Adicionar testes ao parser ORCID.
- Validar respostas ORCID em runtime.
- Centralizar dados de contacto e redes sociais.
- Simplificar `InteractiveHero`.
- Respeitar `prefers-reduced-motion`.
- Remover dependência CDN dos ícones.
- Criar error boundaries.
- Adicionar validação automatizada de links e assets.
- Tornar traduções incompletas uma falha de CI.

### Evolução estrutural

- Definir CMS e modelo editorial.
- Separar conteúdo de interface e conteúdo de páginas.
- Criar previews.
- Introduzir analytics com consentimento adequado.
- Definir política de observabilidade.
- Automatizar sincronização ORCID.
- Adicionar testes end-to-end dos principais percursos.

---

## Conclusão

O código não é de baixa qualidade no sentido de estar desorganizado ou tecnicamente quebrado. Compila, está tipado e possui uma arquitetura coerente. A maior fragilidade está na diferença entre a aparência de completude e a completude real.

A implementação resolve bem:

- a visão do produto;
- a arquitetura de informação;
- a identidade visual;
- a navegação;
- os modelos das páginas;
- a demonstração das funcionalidades futuras.

Resolve de forma insuficiente:

- manutenção editorial;
- acessibilidade;
- traduções;
- formulários;
- conformidade;
- testes;
- assets;
- validação de integrações;
- preparação operacional.

A minha recomendação mantém-se: tratar esta versão como uma especificação funcional e visual bastante valiosa. A arquitetura de conteúdo e o design podem ser transportados para Astro/TinaCMS, mas o código Next.js não deve ser migrado mecanicamente nem considerado pronto para lançamento.
