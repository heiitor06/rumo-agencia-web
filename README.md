# Rumo · front de uma agência de turismo

Site de uma agência de turismo **fictícia** (projeto de portfólio) que vende pacotes para destinos brasileiros. Ele é o front da [api-reservas-turismo](https://github.com/heiitor06/api-reservas-turismo): toda vaga, data, preço e reserva que aparece na tela vem dessa API, não de dados fixos.

> Projeto de demonstração. Nenhuma viagem é vendida e nenhum pagamento é cobrado: o pagamento é simulado e o site avisa isso.

## O que tem de interessante

- **Slider em que o card vira a tela.** Na home, o primeiro card da fila cresce até ocupar o fundo inteiro, a fila desliza e o texto entra em cascata. A expansão é uma camada animada com a Web Animations API, que parte do retângulo do card e vai até a tela cheia.
- **A foto acompanha a navegação.** Da home para o destino e do destino para o pacote, a foto do destino "voa" entre as páginas com o `<ViewTransition>` do React 19.3, que o Next 16 integra à navegação. As outras trocas de página deslizam para a esquerda ao avançar e para a direita ao voltar, com o cabeçalho parado.
- **Vaga que aparece é vaga que existe.** Próxima saída, vagas restantes e preço "a partir de" chegam em streaming da API em cada página. A cotação recalcula na hora (desconto de grupo, parcelas no cartão), e a reserva ocupa a vaga de verdade.
- **Fluxo completo:** destino → pacote (roteiro dia a dia) → saída → cotação → dados do cliente → reserva com código `RSV-XXXXXX` → pagamento em partes (sinal + saldo) → aprovação simulada → reserva confirmada. A reserva pode ser consultada depois pelo código.
- **Acessível e responsivo:** de 360 a 1920 px, navegação por teclado, contraste AA. Com `prefers-reduced-motion`, nada desliza e o autoplay do slider desliga.

## Stack

Next.js 16 (App Router, Cache Components / pré-render parcial) · React 19.3 · TypeScript estrito · Tailwind CSS 4 · lucide-react. Sem biblioteca de animação.

## Como a integração com a API funciona

- O navegador nunca chama a API direto. As leituras acontecem em componentes de servidor (`src/lib/api.ts`, `src/lib/catalogo.ts`) e as gravações em Server Actions (`src/app/actions.ts`). Por isso a API não precisa de CORS e o endereço dela não vai para o cliente.
- Dados que mudam a cada reserva (vagas, saídas) são lidos sem cache, dentro de `<Suspense>`: o resto da página sai estático e instantâneo.
- Os erros da API (`application/problem+json`, RFC 9457) viram mensagens em português, por exemplo "As vagas dessa saída acabaram enquanto você preenchia".
- As fotos dos destinos ficam no front (`src/content/destinos.ts`), ligadas pelo nome do destino cadastrado na API.

## Como rodar

Pré-requisitos: Node 20+ e Docker.

```bash
# 1. API (no repositório api-reservas-turismo)
docker compose up -d --build          # API em http://localhost:8080

# 2. Este front
npm install
node scripts/seed-demo.mjs            # cadastra destinos, pacotes e saídas de demonstração (uma vez)
npm run dev                           # http://localhost:3000
```

Variáveis de ambiente (ver `.env.example`):

| Variável | Para quê | Padrão |
|---|---|---|
| `API_URL` | Endereço da API, lido só no servidor | `http://localhost:8080` |
| `NEXT_PUBLIC_SITE_URL` | Endereço público do site (metadados, sitemap) | `http://localhost:3000` |

Verificações: `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Estrutura

```
src/app/            rotas: home, destinos/[slug], destinos/[slug]/pacotes/[id],
                    reservar/[saidaId], reserva/[codigo], minha-reserva, como-funciona
src/components/     home (slider, busca, mosaico), destino, pacote (cotador), reserva
src/lib/            cliente da API, tipos dos DTOs, catálogo, formatação, CPF
src/content/        conteúdo local dos destinos (texto, foto, crédito)
scripts/            seed de demonstração
docs/arquitetura.md decisões de arquitetura
DESIGN.md           sistema visual (tokens, tipografia, movimento)
```

## Créditos

- Fotos: [Unsplash](https://unsplash.com/license), de Léo Castro, Luiza Braun, Allan Rodrigues, Azzedine Rouichi, Charles Betito Filho e Edson Junior (links em `src/content/destinos.ts`).
- Fontes: Barlow e Barlow Condensed (Google Fonts, OFL).
- Os preços, datas e roteiros do seed são inventados para a demonstração.
