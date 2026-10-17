# PROGRESSO: Rumo (demo de portfólio, front da api_agencia)

Iniciado em: 2026-10-17   Stack: Next.js 16.4 + React 19.3 + TypeScript + Tailwind 4 (sem shadcn/ui, ver docs/arquitetura.md)
Skill de estilo (Bloco B): nenhuma, apenas Impeccable   Direção visual aprovada: "O padrão da categoria" (canon, inspirado no pin "cards_opening")

## Fases
| Fase | Status | Artefato | Aprovado em | Observações |
|---|---|---|---|---|
| F0 Preparação | [x] | PROGRESSO.md | 2026-10-17 | Node 24.18, npm 11.16, git ok. MCP shadcn-ui falhou (timeout); seguido sem ele |
| F1 Briefing | [x] | PRODUCT.md | 2026-10-17 | Mini-briefing autorizado (projeto pessoal). Público: donos de agência; destinos BR; marca Rumo |
| F2 Estratégia e conteúdo | [x] | docs/arquitetura.md (rotas) + copy no código | 2026-10-17 | Mini-briefing autorizado; copy escrita pelo Claude, sem dados inventados como reais |
| F3 Direção visual | [~] | .impeccable/surfaces/src-app-page-tsx.md | 2026-10-17 | Carlos escolheu a opção 3 (canon). DESIGN.md sai no fim da revisão (documenter do Impeccable) |
| F4 Arquitetura e plano | [x] | docs/arquitetura.md | 2026-10-17 | Coberto pela autorização de seguir até o site rodando |
| F5 Setup | [x] | scaffold + tokens | 2026-10-17 | build passando |
| F6 Construção | [x] | src/ | 2026-10-17 | Todas as rotas; fluxo de reserva testado ponta a ponta no navegador |
| F7 Qualidade | [ ] | relatório | | Detector Impeccable: 0 achados. Finish review em andamento. Faltam critique/audit/polish, web-design-guidelines, 768/1920 |
| F8 Verificação final | [ ] | saídas dos comandos | | |
| F9 Entrega e registro | [ ] | README + pendências | | |

## Autorizações de pular etapa (só com pedido explícito do Carlos)
- 2026-10-17 | F1/F2 completos trocados por mini-briefing e decisões visuais delegadas ao Claude | projeto pessoal de portfólio (resposta "Sim, pode")

## Mudanças de escopo
- 2026-10-17 | projeto é demo pessoal/portfólio, agência fictícia, vitrine + reserva sem conta, pagamento simulado | F1/F2 simplificados
- 2026-10-17 | direção "editorial claro" trocada pela "padrão da categoria" (pin cards_opening) com animação card → tela cheia | F3 reaberta e decidida

## Pendências
- [ ] API: endpoint `GET /api/clientes?documento=` (hoje o front acha cliente repetido percorrendo a lista; funciona, mas não escala)
- [ ] API: campo de imagem em destino (hoje as fotos ficam no front, ligadas pelo nome do destino)
- [ ] Fase 2: painel administrativo; fase 3: gateway em sandbox

## Placeholders ainda no site
- Nenhum. Preços, datas e roteiros vêm do seed de demonstração (scripts/seed-demo.mjs) e o site avisa que é demo.

## Créditos e licenças
- Fotos (Unsplash License, uso comercial livre): Léo Castro (s0EKwK7xzT8), Luiza Braun (bR-lvWBmJQs), Allan Rodrigues (20HcuRSRK14), Azzedine Rouichi (cZ3k8ZEcA-U), Charles Betito Filho (F9vf_wOJOYA), Edson Junior (CWGGSi5FEhc)
- Fontes: Barlow e Barlow Condensed (Google Fonts, OFL)
- Ícones: lucide-react (ISC)

## Verificações feitas (2026-10-17)
- `npx tsc --noEmit`: ok · `npm run lint`: ok · `npm run build`: ok (rotas em pré-render parcial)
- Navegador (produção): sem erros no console; sem rolagem horizontal em 360, 390 e 1440
- Fluxo real: reserva RSV-RWZ5PR (2 vagas) → sinal R$ 1.000 + saldo → aprovação simulada → Confirmada; 2ª reserva com mesmo CPF reaproveitou o cadastro; consulta "rsv rwz5pr" normalizada
- Bugs achados e corrigidos: percentual mostrado como fração (0.1%); botões do slider cobertos pela busca no celular; contraste do texto do hero em foto clara no celular
