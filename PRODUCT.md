# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript estrito + Tailwind CSS, conforme a stack padrão do Carlos. Consome a `api_agencia` (Spring Boot, `c:\SitesClientes\api_agencia`), que roda em `http://localhost:8080`.

## Users

Público avaliador: **donos de agência de turismo** que o Carlos quer conquistar como clientes. Eles abrem o site para julgar se aquilo poderia ser o site da agência deles: precisa parecer produto pronto, vendável, com reserva funcionando de verdade.

Público simulado dentro da demo: o viajante brasileiro que escolhe um destino nacional, vê as datas de saída com vagas, cota o preço e reserva.

## Product Purpose

Demo de portfólio do Carlos: o front de uma agência fictícia, **Rumo**, que vende pacotes para destinos brasileiros. Prova que o Carlos entrega site bonito **e** sistema de reservas real. Sucesso: um dono de agência navega do destino até a reserva confirmada e pensa "quero isso para a minha".

## Positioning

Vagas e preços vêm de um backend real: a vaga mostrada existe, a cotação é calculada pela regra da agência e duas pessoas não compram a mesma vaga (lock pessimista testado com 20 threads disputando 5 vagas). Templates de agência mostram escassez fingida; aqui ela é verdadeira.

## Operating Context

- Fluxo: destino → pacote (roteiro dia a dia) → saída (data + vagas) → cotação (passageiros, forma de pagamento, parcelas) → dados do cliente (nome, CPF, e-mail, telefone) → reserva `PENDENTE` com código `RSV-XXXXXX` → pagamento → reserva `CONFIRMADA`.
- Consulta de reserva pelo código.
- Sem conta de usuário. Sem painel administrativo nesta fase (fica para a fase 2).

## Capabilities and Constraints

- Endpoints: `/api/destinos`, `/api/pacotes` (filtro `destinoId`), `/api/pacotes/{id}/saidas`, `/api/cotacoes`, `/api/clientes`, `/api/reservas`, `/api/reservas/{codigo}/pagamentos`, `/api/pagamentos/{id}/aprovacao`.
- Regras: preço base × passageiros; 10% de desconto a partir de 6 passageiros; PIX e boleto só à vista; cartão até 3x sem taxa, 4x a 10x com +1,5% por parcela acima da 3ª.
- Erros em `application/problem+json` (RFC 9457).
- A API não tem campo de imagem em destino ou pacote: as fotos ficam no front, mapeadas por destino.
- A API não tem CORS configurado: o front chama pelo servidor do Next (proxy), nunca direto do navegador.
- CPF é único: cadastrar o mesmo CPF duas vezes retorna 409.
- Pagamento é **simulado**: não existe gateway. A aprovação é feita pelo endpoint de aprovação e a interface diz claramente que é demonstração.

## Brand Commitments

- Nome: **Rumo** (marca fictícia, criada para a demo).
- Destinos brasileiros.
- Aviso visível de "projeto de demonstração".
- Referência de interação pedida pelo Carlos: slider de destinos em que o card avança e se expande até virar o fundo de tela cheia, com transições completas na troca de telas. É referência de movimento, não de identidade visual.

## Evidence on Hand

- Nenhum depoimento, avaliação, número de clientes, prêmio, selo ou parceria. Nada disso pode ser inventado.
- Preços, datas e vagas: só os que vêm da API.
- Fotos: bancos com licença livre para uso comercial, com crédito registrado.

## Product Principles

1. Tudo que parece real é real: vaga, preço e status vêm da API.
2. Honestidade explícita onde é demo: pagamento simulado e marca fictícia dizem que são.
3. O destino vende primeiro; a interface aparece quando o visitante decide.
4. O movimento conta onde o visitante está indo, não decora.

## Accessibility & Inclusion

WCAG AA, navegação completa por teclado, `lang="pt-BR"`, e todo movimento desligável via `prefers-reduced-motion`.
