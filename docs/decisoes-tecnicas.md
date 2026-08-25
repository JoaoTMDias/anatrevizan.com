# Decisões técnicas — anatrevizan.com

> Estado consolidado após a análise da versão Next.js e a atualização da fundação Astro/TinaCMS.
> Atualizado em agosto de 2026.

## Fundação técnica

- A implementação final será construída em **Astro + TinaCMS**.
- O projeto oficial permanece no repositório `anatrevizan.com`.
- O site continuará alojado no **Netlify**.
- O boilerplate antigo foi substituído pelo starter oficial atual do TinaCMS.
- A fundação atual utiliza Astro 7, TinaCMS 3, `@tinacms/astro` e `pnpm`.
- O starter atualizado concluiu o build local com sucesso.
- A versão Next.js não será promovida a produção.
- A versão Next.js será utilizada como especificação visual, funcional, editorial e de arquitetura de informação.

## Estratégia de migração

- Transpor integralmente para Astro a estrutura visual e funcional criada na versão Next.js.
- Importar para o modelo editorial Astro/TinaCMS todo o conteúdo existente na versão Next.js, preservando a sua origem e colocando-o em `draft` com aprovação pendente até revisão.
- A migração será rastreável e sem omissões silenciosas: conteúdo incompleto, placeholders, destinos em falta, assets vazios e texto português existente nos documentos ingleses serão preservados ou registados explicitamente como pendências, mas nunca publicados como conteúdo válido.
- Preservar as 19 rotas previstas.
- Não converter mecanicamente os componentes React.
- Reimplementar os componentes em Astro, usando JavaScript apenas onde seja necessário.
- Corrigir durante a transposição:
  - acessibilidade;
  - SEO;
  - internacionalização;
  - links provisórios;
  - formulários;
  - assets vazios;
  - dependências runtime desnecessárias;
  - comportamentos incompatíveis com movimento reduzido ou poupança de dados.

## Gestão de conteúdo

- A Ana deverá ficar autónoma na edição do conteúdo.
- Todo o conteúdo editorial será gerido no TinaCMS:
  - páginas;
  - navegação;
  - serviços;
  - eventos;
  - palestras;
  - formações;
  - mentorias;
  - imagens;
  - CTAs;
  - contactos;
  - SEO;
  - textos legais.
- Layouts, componentes, validações e integrações permanecem em código.
- O editor terá preview visual.
- O conteúdo será guardado no GitHub e cada publicação desencadeará um deploy Netlify.

## Idiomas

- Os idiomas de lançamento serão **PT-PT e inglês**.
- O lançamento aguardará pela tradução e revisão integral do inglês.
- Não haverá fallback visível de português dentro das páginas inglesas.
- Português será o idioma principal e não terá prefixo:
  - `/sobre`
  - `/consultoria`
- Inglês utilizará `/en` e slugs localizados:
  - `/en/about`
  - `/en/consulting`
- Espanhol ficará preparado no modelo editorial, mas não será publicado na v1.
- PT-BR não fará parte da primeira versão.

## Âmbito da primeira versão

- Manter a estrutura completa criada na versão Next.js.
- Preservar as 19 rotas previstas, sujeitas a:
  - conteúdo final;
  - revisão linguística;
  - validação das afirmações profissionais;
  - enquadramento jurídico;
  - assets finais;
  - aprovação da Ana.
- A primeira versão será um site público, sem:
  - contas;
  - pagamentos;
  - área reservada.

## Calendly

- O Calendly será apresentado como uma ligação externa.
- Não haverá embed ou script Calendly dentro do site na v1.
- A URL será configurável através do TinaCMS.
- O formulário de contacto será apresentado como alternativa.

## Publicações e ORCID

- O ORCID `0000-0003-4365-6053` é a fonte automática dos metadados bibliográficos.
- Um único sincronizador TypeScript validado tenta atualizar a coleção Markdown antes de cada build. Sem credenciais ou perante falha externa, o build mantém o snapshot versionado, avisa e continua.
- A execução estrita semanal e manual decorre no GitHub Actions e abre ou atualiza uma pull request dedicada; nunca faz commit direto na branch publicada.
- A atualização é integral e atómica: respostas vazias, malformadas ou com colisões não alteram ficheiros. Uma sincronização válida cria, atualiza e remove obras conforme o ORCID.
- A identidade estável usa DOI normalizado, depois identificador externo do grupo e, por último, `put-code`. Duplicados do mesmo grupo são resolvidos por `display-index` e `put-code`, sem preferência por fornecedor.
- A coleção aceita todos os tipos públicos devolvidos pelo ORCID. Título, revista, ano, tipo, DOI, URL, fonte e `put-code` são gerados e ocultos no TinaCMS.
- Idioma, temas, destaque e prioridade são um overlay editorial opcional preservado por `sourceId`.
- Publicações sem URL HTTPS válida permanecem visíveis, mas não geram ligações falsas.
- A página completa apresenta prioridades primeiro e depois ano decrescente. A Home apresenta a obra mais recente e as duas melhores prioridades, sem duplicados e com preenchimento cronológico.

## Formulário de contacto

- O formulário será processado por um endpoint server-side em Astro/Netlify.
- Os dados serão gravados através da Google Sheets API.
- A Ana receberá uma notificação através do Resend.
- A proteção anti-spam utilizará:
  - Cloudflare Turnstile;
  - honeypot;
  - validação server-side;
  - limites de tamanho;
  - prevenção de submissões duplicadas.
- Campos obrigatórios:
  - nome;
  - email;
  - tipo de pedido;
  - mensagem;
  - consentimento.
- Telefone/WhatsApp e país/jurisdição serão opcionais.
- Credenciais Google, Resend, Tina e Netlify serão guardadas exclusivamente como variáveis de ambiente.

## Media dos heroes

- A utilização de vídeo será seletiva.
- Imagens estáticas otimizadas serão o comportamento padrão.
- Um vídeo só será ativado quando:
  - acrescentar valor editorial;
  - existir em versão final;
  - tiver licença confirmada;
  - estiver comprimido;
  - possuir fallback estático;
  - respeitar `prefers-reduced-motion`;
  - respeitar preferências de poupança de dados.

## Ordem de execução atualizada

1. Auditar e limpar o novo starter, preservando o build válido como baseline.
2. Definir os modelos editoriais localizados no TinaCMS e o mapa das 19 rotas PT/EN.
3. Transpor o sistema visual e os componentes partilhados da versão Next.js.
4. Transpor as 19 rotas e ligá-las ao TinaCMS.
5. Rever conteúdo, traduções e enquadramento jurídico com a Ana.
6. Finalizar identidade e assets.
7. Implementar formulário, Google Sheets, Resend e proteção anti-spam.
8. Implementar ORCID, snapshot e atualização semanal por pull request. (Concluído em agosto de 2026.)
9. Finalizar SEO, acessibilidade, páginas legais, testes e CI.
10. Fazer QA em deploy preview e obter aprovação final da Ana.
11. Configurar monitorização, rollback e lançamento.
