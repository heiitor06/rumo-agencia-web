---
name: Rumo
description: Agência fictícia de viagens pelo Brasil em que a foto do destino é a tela e a vaga mostrada é vaga que existe.
colors:
  sol: "#f2a900"
  sol-forte: "#d99600"
  noite: "#0e0c0a"
  tinta: "#15130f"
  papel: "#faf9f6"
  areia: "#efebe3"
  pedra: "#645e55"
  linha: "#ddd7cc"
  nevoa: "rgb(250 249 246 / 0.82)"
  alerta: "#b42318"
  ok: "#1f7a4d"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.25rem, 9vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.88
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 0.92
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  campo: "8px"
  card: "14px"
  pilula: "9999px"
spacing:
  margem-celular: "20px"
  margem-tablet: "40px"
  margem-desktop: "56px"
  secao: "96px"
  secao-desktop: "128px"
components:
  botao-sol:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pilula}"
    padding: "0 28px"
    height: "48px"
  botao-sol-hover:
    backgroundColor: "{colors.sol-forte}"
  botao-contorno:
    textColor: "{colors.tinta}"
    rounded: "{rounded.pilula}"
    padding: "0 24px"
    height: "48px"
  botao-contorno-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
  botao-redondo:
    textColor: "{colors.papel}"
    rounded: "{rounded.pilula}"
    size: "44px"
  entrada:
    backgroundColor: "#ffffff"
    textColor: "{colors.tinta}"
    rounded: "{rounded.campo}"
    padding: "0 16px"
    height: "48px"
  card-destino:
    textColor: "{colors.papel}"
    rounded: "{rounded.card}"
    padding: "24px"
  painel-escuro:
    backgroundColor: "{colors.noite}"
    textColor: "{colors.papel}"
    rounded: "{rounded.card}"
---

# Design System: Rumo

## Overview

**Creative North Star: "A Janela do Destino"**

A Rumo executa o padrão da categoria de turismo sem atalho: a fotografia do destino ocupa a tela inteira sob um véu quente quase preto, e os cards em fila são literalmente as próximas telas. O card escolhido cresce até virar o fundo, e a mesma foto voa da home para a página do destino e daí para a faixa do pacote. O movimento conta para onde o visitante está indo; nunca decora.

Fora da foto, o mundo é papel quente com tinta quase preta, display condensado em caixa alta e um único acento, o sol, reservado para ação primária, progresso e vagas sobre fundo escuro. A densidade é editorial nas páginas internas (listas divididas por fios, sem caixas dentro de caixas) e cinematográfica nas aberturas. Tudo que parece dado é dado vivo da API; onde a demo simula, ela diz que simula.

**Key Characteristics:**
- Fotografia em tela cheia sob véu noite, nunca foto solta sem véu.
- Barlow Condensed 700 em caixa alta para tudo que é título, número ou rótulo de ação; Barlow para leitura.
- Um acento só (sol), usado com parcimônia.
- Cards de foto com raio de 14px, sem borda, sombra longa e suave.
- Continuidade espacial entre rotas: a foto compartilha nome de transição, a página desliza na direção da navegação, o cabeçalho não se mexe.

## Colors

Paleta quente e terrosa, quase monocromática, com um amarelo-sol que só aparece onde há decisão ou escassez.

### Primary
- **Sol** (#f2a900): ação primária (botões "Ver pacotes", "Ver saídas"), barra de progresso do hero, sublinhado ativo da navegação, sublinhado de links de texto, contorno de foco, seleção de texto, valor total cobrado sobre fundo escuro, e as vagas sobre fundo escuro.
- **Sol Forte** (#d99600): estado de hover do Sol e ícones de passeio sobre papel.

### Neutral
- **Noite** (#0e0c0a): fundo do hero, do rodapé, da seção de prova e dos painéis de resumo da reserva; base de todos os véus sobre foto; `theme-color` do navegador.
- **Tinta** (#15130f): texto principal sobre papel; fundo do segmento selecionado.
- **Papel** (#faf9f6): fundo das páginas internas; texto sobre noite e sobre foto.
- **Areia** (#efebe3): faixa alternada de seção ("quatro passos"), avisos neutros, skeletons, linha selecionada no cotador.
- **Pedra** (#645e55): texto secundário, legendas, rótulos de busca.
- **Linha** (#ddd7cc): fios divisórios, bordas de campo, trilho da barra de lotação.
- **Névoa** (papel a 82%): texto secundário sobre noite e sobre foto.

### Semânticas
- **Alerta** (#b42318): erros de campo, "Últimas N vagas" sobre papel, status cancelado/recusado.
- **Ok** (#1f7a4d): reserva confirmada, pagamento aprovado, desconto de grupo.

### Named Rules
**The Um Sol Rule.** Sol é o único acento. Ele marca ação primária, progresso, foco e vagas; nunca vira fundo de seção, gradiente ou decoração.

**The Vagas Em Sol Rule.** Sobre noite ou foto, a contagem de vagas é sempre Sol em semibold (chip "Próxima saída", cards da fila, mosaico, barra de lotação no tom escuro). Sobre papel, Sol não passa contraste de texto: lá a vaga fica em Tinta com a barra de lotação, e "Últimas N vagas" (5 ou menos) vira Alerta.

**The Demonstração Visível Rule.** O aviso de projeto de demonstração aparece logo abaixo da busca na home (Tinta em negrito + Pedra) e no rodapé, e o pagamento simulado se anuncia como simulado. Nenhuma superfície nova pode esconder ou suavizar esse aviso.

## Typography

**Display Font:** Barlow Condensed 700 (com Arial Narrow, sans-serif)
**Body Font:** Barlow 400/500/600 (com system-ui, sans-serif)

**Character:** Condensada, pesada e em caixa alta, como letreiro de rodoviária e placa de estrada; o texto corrido em Barlow larga mantém a leitura calma.

### Hierarchy
- **Display** (700, clamp(3.25rem, 9vw, 6rem), 0.88, caixa alta): nome do destino no hero da home, quebrado em linhas que sobem de trás de máscara em cascata. Na página do destino chega a clamp(3.5rem, 11vw, 7.5rem) com entrelinha 0.86.
- **Headline** (700, clamp(2.5rem, 6vw, 4.5rem), 0.92, caixa alta): títulos de seção. A seção de prova sobe para clamp(2.75rem, 7vw, 6rem).
- **Title** (700, 1.875rem a 2.25rem, 1, caixa alta): passos, nome de pacote em lista, legendas de fieldset, datas de saída (1.5rem).
- **Body** (400, 1.0625rem, ~1.5): texto corrido em até 60–62ch; resumos e introduções em 1.125rem com Pedra.
- **Label** (600, 0.75rem, 0.14em, caixa alta, Pedra): rótulos dos campos da busca e cabeçalho de coluna "Próximas saídas". Rótulos de formulário comuns ficam em 0.875rem 600, sem caixa alta.
- **Numerais**: contador do slide, total da cotação e dias do roteiro em display com `tabular-nums`.

### Named Rules
**The Título Sem Chapéu Rule.** Nenhum título leva eyebrow ou kicker acima. A informação de apoio (região · UF, cidade · região) vem abaixo do título, em display Névoa.

**The Caixa Alta É Display Rule.** Caixa alta só existe em Barlow Condensed (títulos, botões, datas, nav do menu móvel) ou no rótulo pequeno espaçado; texto corrido nunca é caixa alta.

## Layout

Contêiner de até 1600px com margens laterais de 20px no celular, 40px a partir de 640px e 56px a partir de 1024px. Seções respiram 96px no eixo vertical (128px no desktop). A home alterna papel, areia e noite em faixas de largura total; o conteúdo dentro delas segue o mesmo contêiner.

O hero da home ocupa `100svh` (mínimo 600px): coluna de texto à esquerda (5fr) e fila de cards retrato 3:4 sangrando pela borda direita (7fr), com controles, barra de progresso e contador grande na base. A busca de saídas sobe 32px sobre a borda inferior do hero. O hero do destino ocupa 82svh; a faixa do pacote, 44svh.

Páginas internas usam grade de duas colunas no desktop (conteúdo + painel lateral fixo de 360–440px com `sticky` a 112px do topo) e listas separadas por fios Linha em vez de cartões. No celular tudo empilha.

**The Véu Mais Denso No Celular Rule.** No desktop o véu do hero escurece da esquerda (80%) para a direita (8%), com reforço na base e no topo. Abaixo de 768px o texto ocupa a largura toda, então o véu vira vertical e cobre a foto inteira com no mínimo 68% na faixa do texto, para manter 4.5:1 mesmo sobre areia clara.

## Elevation & Depth

Híbrido. A profundidade principal vem da própria fotografia sob véu e do contraste entre faixas papel/areia/noite. A sombra existe só em superfícies que flutuam sobre outra: cards de foto, a barra de busca sobre o hero, o cotador e os painéis escuros de reserva.

### Shadow Vocabulary
- **Sombra de card** (`box-shadow: 0 28px 50px -28px rgb(14 12 10 / 0.6)`): longa, deslocada para baixo e com espalhamento negativo; nunca dura, nunca deslocada para o lado.

### Named Rules
**The Sombra Só Flutua Rule.** Listas, linhas de saída e seções não ganham sombra. Se não está sobreposto a outra camada, é plano e separado por fio.

## Shapes

Três raios. Cards, painéis, busca e avisos em bloco usam 14px; botões, controles redondos, chips de status e seletores segmentados são pílula; campos de formulário e alertas inline usam 8px. Cards de foto não têm borda; painéis brancos sobre papel usam anel de 1px Linha. O contorno de foco é sempre 2px Sol com 3px de afastamento.

Na expansão do hero, o raio do card anima de 14px para 0 enquanto ele cresce até cobrir a tela: o raio é parte do movimento.

## Components

### Buttons
- **Shape:** pílula, altura mínima 48px; texto em Barlow Condensed 700, 1.125rem, caixa alta, levemente espaçado.
- **Primary (Sol):** fundo Sol, texto Tinta, 28px laterais. Hover: Sol Forte e sobe 2px.
- **Contorno:** borda Tinta a 25%, sem fundo. Hover: preenche Tinta com texto Papel.
- **Redondo:** 44px, borda Papel a 40% sobre foto; hover preenche Papel com texto Tinta. Usado para anterior/próximo/pausa do hero.
- **Stepper:** 44px, borda Linha sobre papel; desabilitado a 35%.
- **Desabilitado:** 50% de opacidade, sem ponteiro.

### Cards / Containers
- **Card de destino (fila e mosaico):** raio 14px, foto `object-cover`, gradiente Noite de baixo para cima (90–95% na base), nome em display, UF/região em Névoa, vagas em Sol. Hover amplia a foto 4–5% em 700–900ms com a curva de saída.
- **Painel escuro:** fundo Noite, texto Papel, raio 14px, sombra de card; resumo da cotação e da reserva, com o valor em destaque em Sol.
- **Painel claro (cotador):** fundo branco, anel Linha, raio 14px, sombra de card, 24–32px de respiro; total separado por fio de 2px Tinta.
- **Aviso em bloco:** fundo Areia (neutro) ou Ok a 10% (confirmação), raio 14px, 20px × 16px.

### Inputs / Fields
- **Style:** fundo branco, borda 1px Linha, raio 8px, altura 48px, 16px laterais; placeholder Pedra. Hover escurece a borda para Pedra.
- **Focus:** contorno 2px Sol com afastamento.
- **Error:** borda Alerta via `aria-invalid`; mensagem em Alerta 0.875rem 500; alerta de envio em bloco Alerta a 10%, raio 8px.
- **Busca de saídas:** segmentos papel colados por 1px Linha num bloco de raio 14px com sombra de card; rótulo pequeno espaçado em Pedra acima de um seletor em display 1.5rem; botão de envio Sol ocupa o último segmento.
- **Segmentado (forma de pagamento):** pílula dividida por 1px Linha; opção marcada em Tinta com texto Papel.

### Navigation
- **Cabeçalho:** fixo, 64px (80px a partir de 640px), marca "RUMO" em display com 0.12em de espaçamento. Sobre página com hero de foto e antes de rolar 24px é transparente com texto Papel; depois vira Papel a 95% com desfoque leve e fio Linha.
- **Links:** Barlow 500 0.95rem; sublinhado Sol de 2px que cresce da esquerda no hover e fica fixo na página atual.
- **Celular:** botão de menu de 44px; o menu abre em Papel com links em display 1.5rem, alvos de 56px, separados por fios.
- **Âncora na transição:** o cabeçalho tem nome de transição próprio e animação nula, então fica parado enquanto a página desliza por baixo.

### Barra de lotação
Contagem em semibold tabular ("N vagas de M") sobre um trilho de 6px em pílula; a parte cheia é o que já foi vendido (Tinta sobre papel, Papel sobre noite). Cinco vagas ou menos viram "Últimas N vagas" em Alerta sobre papel e Sol sobre noite.

### Interação assinatura: a fila que vira tela
- **Card → tela cheia:** ao avançar, uma camada nasce exatamente sobre o card escolhido e cresce via Web Animations API até cobrir o hero (900ms, `cubic-bezier(0.7, 0, 0.18, 1)`, raio 14px → 0). Ao mesmo tempo a fila desliza para a esquerda um passo por card (85% da duração). Só ao fim a ordem gira, sem piscar. O texto do destino que sai sobe 12px e some em 300ms; o novo entra linha a linha de trás de máscara (700ms, atraso 120ms + 70ms por linha). O card que entra na fila chega da direita (48px, 600ms).
- **Morph entre rotas:** a foto do destino carrega o mesmo nome de transição (`destino-<slug>`, classe `morph`) no hero da home, no hero do destino e na faixa do pacote, via `<ViewTransition>` do React; ela voa entre os três em 650ms com a mesma curva e um desfoque de 2px no meio do trajeto.
- **Deslize direcional:** toda página está envolta em transição de entrada/saída por tipo. `nav-forward` empurra a página velha 64px para a esquerda e traz a nova da direita; `nav-back` faz o inverso. A saída some em 160ms, a entrada aparece em 240ms após 160ms, o deslize leva 420ms.
- **Autoplay:** troca a cada 7s, pausa com ponteiro ou foco dentro do hero, com aba oculta e pelo botão de pausa.
- **Movimento reduzido:** com `prefers-reduced-motion: reduce`, transições de rota ficam instantâneas, as entradas em cascata não rodam, a expansão vira troca direta, o autoplay e o botão de pausa somem.

## Do's and Don'ts

### Do:
- **Do** colocar toda foto de destino sob o véu Noite; abaixo de 768px, usar o véu vertical com pelo menos 68% na faixa do texto.
- **Do** usar Sol (#f2a900) só para ação primária, progresso, foco e vagas sobre fundo escuro.
- **Do** dar à foto de um destino o mesmo nome de transição (`destino-<slug>`) em toda superfície onde ela é protagonista.
- **Do** marcar cada link de navegação com `nav-forward` ou `nav-back` conforme o sentido da viagem.
- **Do** manter o aviso de projeto de demonstração visível na home e no rodapé, e anunciar o pagamento como simulado.
- **Do** desligar todo deslocamento e o autoplay sob `prefers-reduced-motion`.
- **Do** separar listas de saídas e pacotes com fios Linha, não com cards.

### Don't:
- **Don't** colocar eyebrow ou kicker acima de títulos; apoio vai abaixo.
- **Don't** escrever vagas em Sol sobre papel ou areia: não passa contraste; use Tinta e Alerta.
- **Don't** usar sombra dura, deslocada lateralmente, ou sombra em listas e seções planas.
- **Don't** adicionar um segundo acento de cor ou gradiente decorativo.
- **Don't** usar caixa alta em Barlow de texto corrido.
- **Don't** animar o cabeçalho na troca de rota.
