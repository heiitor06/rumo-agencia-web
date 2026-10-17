# Arquitetura: Rumo (front da api_agencia)

## Stack

- Next.js 16.4 (App Router, `cacheComponents` e `partialPrefetching` ligados pelo scaffold), React 19.3, TypeScript estrito, Tailwind CSS 4.
- Fontes via `next/font/google`: Barlow Condensed (display) e Barlow (texto).
- **Sem biblioteca de animação.** O card que vira tela cheia e as transições entre páginas usam o `<ViewTransition>` do React 19.3, que o Next 16 já integra à navegação. Motion/GSAP ficaram de fora porque não resolveriam nada que esse mecanismo não resolva, e somariam peso.
- shadcn/ui ficou de fora: o site tem poucos controles (busca, stepper, select, formulário) e todos precisam do visual próprio; os componentes saem do zero, com HTML nativo.

## Dados

- **Conteúdo do front** (`src/content/destinos.ts`): slug, nome (igual ao cadastrado na API), UF, região, descrição curta, foto local e crédito. Isso deixa o hero e o nome de cada destino no shell estático: a página renderiza na hora e o card consegue fazer o morph para a página seguinte, mesmo com a API fora do ar.
- **Dados vivos da API** (`src/lib/api.ts`): pacotes, saídas, vagas, cotação, reservas e pagamentos. Lidos no servidor (`API_URL`, padrão `http://localhost:8080`), sempre dentro de `<Suspense>`, sem cache, porque vaga muda a cada reserva.
- **Ligação destino ↔ API:** pelo nome do destino (`destinoNome` dos pacotes).
- **Escritas** (cotação, cliente, reserva, pagamento, aprovação): Server Actions em `src/app/actions.ts`, chamando a API pelo servidor. O navegador nunca fala direto com a API (a API não tem CORS).
- **Erros** da API (`application/problem+json`) viram mensagens em português na interface.

## Rotas

| Rota | O que é | Dados |
|---|---|---|
| `/` | Hero com slider de destinos (card → tela cheia), busca de saídas, destaques, como funciona | conteúdo local + próxima saída/vagas em streaming |
| `/destinos/[slug]` | Hero do destino (morph do card) + pacotes do destino, com filtro por mês e passageiros | estático + pacotes/saídas em streaming |
| `/destinos/[slug]/pacotes/[id]` | Pacote: roteiro dia a dia, linha do tempo de saídas, cotação ao vivo, botão reservar | estático (foto) + API |
| `/reservar/[saidaId]` | Formulário: passageiros, pagamento, dados do cliente | API + Server Actions |
| `/reserva/[codigo]` | Bilhete da reserva, status, pagamento simulado | API + Server Actions |
| `/minha-reserva` | Consulta pelo código | Server Action → redireciona |
| `/como-funciona` | Explica a engenharia (vaga real, lock, regras de preço) | estático |
| `not-found`, `sitemap.xml`, `robots.txt`, `opengraph-image` | | |

## Transições

- Card do slider ↔ fundo do hero: mesmo `name` de ViewTransition (`destino-foto-<slug>`), troca disparada em `startTransition`.
- Card/fundo da home → hero de `/destinos/[slug]`: o mesmo nome forma o par entre rotas.
- Card de pacote → hero de `/destinos/[slug]/pacotes/[id]`.
- Rotas: deslize direcional (`nav-forward` / `nav-back` via `transitionTypes` nos `<Link>`), header ancorado.
- `prefers-reduced-motion`: sem deslocamento; o slider também pausa o autoplay.

## SEO

- `lang="pt-BR"`, `metadata` por página (título e descrição únicos), Open Graph com a foto do destino, `sitemap.ts` com home, destinos e páginas estáticas, `robots.ts`.
- Dados estruturados `TravelAgency` na home **sem endereço, telefone ou avaliações** (marca fictícia, nada a afirmar).

## Formulários e integridade

- Reserva real na API (vaga ocupada de verdade). CPF validado no cliente (dígitos) e na API.
- Pagamento: registra na API e aprova pelo endpoint de aprovação, num passo identificado como **"Simular aprovação do pagamento (demonstração)"**. Nada finge cobrança.
- Aviso de demonstração no rodapé e na etapa de pagamento. Coleta de dados pessoais com finalidade explicada e link para `/privacidade` (rascunho).
- Sem analytics, pixel ou cookie.

## Dados de demonstração

`scripts/seed-demo.mjs` cadastra na API os 6 destinos, pacotes, roteiros e saídas. Os preços e datas são **inventados para a demo** (agência fictícia) e o site diz isso.

## Ordem de construção

1. Tokens, fontes, layout, header/rodapé.
2. Conteúdo local + cliente da API + seed.
3. Home: hero slider com morph → busca → seções.
4. Destino → pacote → reservar → reserva → minha reserva.
5. Transições de rota, 404, SEO.
6. Revisão (F7) e verificação (F8).
