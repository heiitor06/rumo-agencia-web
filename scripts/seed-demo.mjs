// Cadastra na api_agencia os dados de demonstração da Rumo: destinos, pacotes, roteiros, saídas
// e algumas reservas para as vagas não aparecerem todas cheias.
// Preços, datas e roteiros são INVENTADOS para a demo (agência fictícia).
// Uso: node scripts/seed-demo.mjs   (API em http://localhost:8080; mude com API_URL=...)
// Roda de novo sem duplicar: destino que já existe é pulado.

const API = `${process.env.API_URL ?? "http://localhost:8080"}/api`;

async function call(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : undefined;
}

function diasAPartirDeHoje(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

// CPF válido gerado a partir de uma semente: só para os clientes de demonstração.
function cpf(semente) {
  const base = String(100000000 + semente * 7919).slice(-9).split("").map(Number);
  const dv = (nums) => {
    const soma = nums.reduce((acc, n, i) => acc + n * (nums.length + 1 - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const d1 = dv(base);
  const d2 = dv([...base, d1]);
  return [...base, d1, d2].join("");
}

const DESTINOS = [
  {
    nome: "Lençóis Maranhenses", cidade: "Barreirinhas", uf: "MA",
    descricao: "Dunas e lagoas de água da chuva no litoral do Maranhão.",
    pacotes: [
      {
        nome: "Lençóis Essencial", dias: 5, preco: 1890, capacidades: [20, 16, 20], offsets: [24, 52, 88],
        descricao: "Barreirinhas como base, circuitos das lagoas e passeio de barco pelo Rio Preguiças.",
        roteiro: [
          ["TRANSPORTE", 1, "Traslado de São Luís a Barreirinhas", "Van com ar-condicionado, cerca de 4 horas de estrada."],
          ["HOTEL", 1, "Pousada em Barreirinhas", "4 noites com café da manhã."],
          ["PASSEIO", 2, "Circuito Lagoa Azul", "Jardineira 4x4 até as dunas e banho nas lagoas."],
          ["PASSEIO", 3, "Rio Preguiças de lancha", "Vassouras, Mandacaru e Caburé."],
          ["PASSEIO", 4, "Circuito Lagoa Bonita", "Subida da duna mais alta para o pôr do sol."],
          ["TRANSPORTE", 5, "Retorno a São Luís", ""],
        ],
      },
      {
        nome: "Travessia dos Lençóis", dias: 7, preco: 3490, capacidades: [10, 10], offsets: [40, 110],
        descricao: "Três dias atravessando as dunas a pé, dormindo em casas de oásis.",
        roteiro: [
          ["TRANSPORTE", 1, "Traslado a Atins", ""],
          ["PASSEIO", 2, "Início da travessia", "Caminhada até o oásis da Baixa Grande."],
          ["HOTEL", 2, "Casa de família no oásis", "Rede, jantar e café incluídos."],
          ["PASSEIO", 4, "Chegada a Santo Amaro", ""],
          ["HOTEL", 5, "Pousada em Santo Amaro", "2 noites."],
          ["TRANSPORTE", 7, "Retorno a São Luís", ""],
        ],
      },
    ],
  },
  {
    nome: "Chapada Diamantina", cidade: "Lençóis", uf: "BA",
    descricao: "Chapadões, cachoeiras e grutas no centro da Bahia.",
    pacotes: [
      {
        nome: "Chapada Clássica", dias: 6, preco: 2290, capacidades: [18, 18, 14], offsets: [18, 46, 75],
        descricao: "Pai Inácio, Poço Azul, Cachoeira da Fumaça por cima e Gruta da Lapa Doce.",
        roteiro: [
          ["TRANSPORTE", 1, "Traslado de Salvador a Lençóis", ""],
          ["HOTEL", 1, "Pousada no centro histórico de Lençóis", "5 noites."],
          ["PASSEIO", 2, "Morro do Pai Inácio e Gruta da Lapa Doce", ""],
          ["PASSEIO", 3, "Poço Azul e Poço Encantado", ""],
          ["PASSEIO", 4, "Cachoeira da Fumaça", "Trilha de 6 km ida e volta."],
          ["TRANSPORTE", 6, "Retorno a Salvador", ""],
        ],
      },
    ],
  },
  {
    nome: "Fernando de Noronha", cidade: "Fernando de Noronha", uf: "PE",
    descricao: "Arquipélago no Atlântico, parte de Pernambuco.",
    pacotes: [
      {
        nome: "Noronha Mar Aberto", dias: 5, preco: 5890, capacidades: [12, 12, 12], offsets: [30, 64, 120],
        descricao: "Ilhatour, mergulho de batismo e as praias do Sancho e do Leão.",
        roteiro: [
          ["HOTEL", 1, "Pousada na Vila dos Remédios", "4 noites com café da manhã."],
          ["PASSEIO", 2, "Ilhatour", "Volta na ilha com as principais praias e mirantes."],
          ["PASSEIO", 3, "Mergulho de batismo", "Com instrutor, equipamento incluído."],
          ["PASSEIO", 4, "Praia do Sancho e Baía dos Porcos", ""],
        ],
      },
    ],
  },
  {
    nome: "Bonito", cidade: "Bonito", uf: "MS",
    descricao: "Rios transparentes, grutas e cachoeiras na Serra da Bodoquena.",
    pacotes: [
      {
        nome: "Bonito Águas Claras", dias: 5, preco: 2690, capacidades: [16, 16, 16], offsets: [21, 49, 84],
        descricao: "Flutuação no Rio da Prata, Gruta do Lago Azul e Estância Mimosa.",
        roteiro: [
          ["TRANSPORTE", 1, "Traslado de Campo Grande a Bonito", ""],
          ["HOTEL", 1, "Hotel em Bonito", "4 noites."],
          ["PASSEIO", 2, "Flutuação no Rio da Prata", ""],
          ["PASSEIO", 3, "Gruta do Lago Azul", ""],
          ["PASSEIO", 4, "Estância Mimosa", "Trilha com oito cachoeiras."],
        ],
      },
    ],
  },
  {
    nome: "Jalapão", cidade: "Mateiros", uf: "TO",
    descricao: "Dunas, cachoeiras e fervedouros no leste do Tocantins.",
    pacotes: [
      {
        nome: "Jalapão 4x4", dias: 6, preco: 3190, capacidades: [8, 8], offsets: [35, 95],
        descricao: "Expedição em 4x4 pelas dunas, Cachoeira da Formiga e fervedouros.",
        roteiro: [
          ["TRANSPORTE", 1, "Saída de Palmas em 4x4", ""],
          ["PASSEIO", 2, "Dunas do Jalapão ao pôr do sol", ""],
          ["PASSEIO", 3, "Fervedouros do Ceiça e Buriti", ""],
          ["PASSEIO", 4, "Cachoeira da Formiga", ""],
          ["HOTEL", 1, "Pousadas em Ponte Alta e Mateiros", "5 noites."],
        ],
      },
    ],
  },
  {
    nome: "Gramado", cidade: "Gramado", uf: "RS",
    descricao: "Serra gaúcha, frio e arquitetura de pedra.",
    pacotes: [
      {
        nome: "Serra Gaúcha", dias: 4, preco: 1690, capacidades: [24, 24, 24], offsets: [16, 44, 70],
        descricao: "Gramado, Canela e o Vale dos Vinhedos, com um jantar de fondue.",
        roteiro: [
          ["TRANSPORTE", 1, "Traslado de Porto Alegre a Gramado", ""],
          ["HOTEL", 1, "Hotel no centro de Gramado", "3 noites."],
          ["PASSEIO", 2, "Canela e Cascata do Caracol", ""],
          ["PASSEIO", 3, "Vale dos Vinhedos", "Visita a duas vinícolas com degustação."],
        ],
      },
    ],
  },
];

// Quantos lugares cada saída já tem vendidos, para a demo mostrar vagas variadas.
const VENDIDOS = [5, 13, 2, 9, 0, 7, 11, 4, 0, 6, 3, 10];

const existentes = new Set((await call("GET", "/destinos?size=200")).content.map((d) => d.nome));
let semente = Date.now() % 100000;
let vendaIdx = 0;
let cliente;

async function novoCliente() {
  semente += 1;
  return call("POST", "/clientes", {
    nome: `Cliente de demonstração ${semente}`,
    documento: cpf(semente),
    email: `demo${semente}@rumo.example`,
    telefone: "(11) 90000-0000",
  });
}

for (const d of DESTINOS) {
  if (existentes.has(d.nome)) {
    console.log(`= ${d.nome} já existe, pulando`);
    continue;
  }
  const destino = await call("POST", "/destinos", { nome: d.nome, cidade: d.cidade, uf: d.uf, pais: "Brasil", descricao: d.descricao });
  console.log(`+ ${destino.nome}`);
  for (const p of d.pacotes) {
    const pacote = await call("POST", "/pacotes", {
      destinoId: destino.id, nome: p.nome, descricao: p.descricao, duracaoDias: p.dias, precoBase: p.preco, ativo: true,
    });
    const ordemPorDia = {};
    for (const [tipo, dia, titulo, descricao] of p.roteiro) {
      ordemPorDia[dia] = (ordemPorDia[dia] ?? -1) + 1;
      await call("POST", `/pacotes/${pacote.id}/itens`, { tipo, titulo, descricao: descricao || null, dia, ordem: ordemPorDia[dia] });
    }
    for (const [i, offset] of p.offsets.entries()) {
      const saida = await call("POST", `/pacotes/${pacote.id}/saidas`, { dataPartida: diasAPartirDeHoje(offset), capacidadeTotal: p.capacidades[i] });
      const vendidos = Math.min(VENDIDOS[vendaIdx++ % VENDIDOS.length], saida.capacidadeTotal - 1);
      if (vendidos > 0) {
        cliente = await novoCliente();
        await call("POST", "/reservas", { clienteId: cliente.id, saidaId: saida.id, qtdPassageiros: vendidos });
      }
      console.log(`  ${pacote.nome} ${saida.dataPartida}: ${saida.capacidadeTotal - vendidos}/${saida.capacidadeTotal} vagas`);
    }
  }
}
console.log("Pronto.");
