---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/destinos/[slug]/page.tsx"]
---

Scope: home da Rumo (/) e o caminho de navegação que sai dela (destino, pacote, reserva). Visitor mode: Persuade.

Audience: dono de agência avaliando se aquilo poderia ser o site dele; dentro da demo, o viajante brasileiro escolhendo destino nacional.
Action: escolher um destino e chegar às saídas com vaga; a busca de saídas (destino, mês, passageiros) funciona já abaixo da primeira dobra.
Proof: vagas, próxima saída e preço "a partir de" vêm da API real. Nada de depoimento, número de clientes ou selo.
Constraints: pagamento simulado e marca fictícia avisados; fotos Unsplash com crédito; prefers-reduced-motion desliga todo deslocamento.

## Direction contract

THESIS: o padrão da categoria executado sem atalho: a foto do destino é a tela, e os cards em fila são literalmente as próximas telas. Recusa o "hero com foto + grade de cards estática": aqui o card cresce e vira o fundo, e o mesmo card voa para dentro da página do destino.

OWN-WORLD: fotografia em tela cheia sob véu quente quase preto (#0E0C0A), display Barlow Condensed 700 em caixa alta, texto em Barlow, um único acento sol (#F2A900) para progresso, ação primária e vagas. Páginas internas em branco quente (#FAF9F6) com tinta #15130F, cards de foto com raio 14px, sem bordas, sombra com deslocamento e desfoque suave.

STORY: o visitante vê um destino brasileiro ocupando a tela, com a próxima saída e as vagas reais; avança pelos cards; abre o destino, escolhe o pacote, vê o roteiro e a linha de saídas, cota, reserva e recebe o código RSV; paga (simulado) e vê a reserva confirmada.

FIRST VIEWPORT: nav no topo (RUMO à esquerda; Destinos, Como funciona, Minha reserva à direita). Coluna esquerda (~42%): região/UF pequena, nome do destino em display até 6rem em duas linhas, duas linhas de descrição, ação primária "Ver pacotes" em sol + chip ao vivo "Próxima saída 14 nov · 7 vagas". Direita: fila de cards retrato 3:4 (~220px) sangrando pela borda direita, cada um com foto, UF, nome e vagas. Base: botões anterior/próximo, barra de progresso em sol, contador grande do slide.

FORM: canon, a escolha "o padrão da categoria" (fora da lista ordenada; o usuário escolheu a saída padrão), seed key e1798910. Interação assinatura: card → tela cheia via React ViewTransition (nome compartilhado card/fundo), o mesmo nome levando o card ao hero de /destinos/[slug]; troca de rota com deslize direcional e header ancorado.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Unresolved: painel administrativo (fase 2); gateway real (fase 3).
