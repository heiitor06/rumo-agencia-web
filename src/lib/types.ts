// Espelho dos DTOs da api_agencia (dev.carlosheitor.agencia.*.dto). BigDecimal chega como number no JSON.

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type Destino = {
  id: number;
  nome: string;
  cidade: string;
  uf: string | null;
  pais: string;
  descricao: string | null;
};

export type TipoItem = "HOTEL" | "TRANSPORTE" | "PASSEIO";

export type ItemRoteiro = {
  id: number;
  tipo: TipoItem;
  titulo: string;
  descricao: string | null;
  dia: number;
  ordem: number;
};

export type PacoteResumo = {
  id: number;
  destinoId: number;
  destinoNome: string;
  nome: string;
  duracaoDias: number;
  precoBase: number;
  ativo: boolean;
};

export type Pacote = PacoteResumo & {
  descricao: string | null;
  itens: ItemRoteiro[];
};

export type StatusSaida = "ABERTA" | "ENCERRADA" | "CANCELADA";

export type Saida = {
  id: number;
  pacoteId: number;
  pacoteNome: string;
  dataPartida: string;
  dataRetorno: string;
  capacidadeTotal: number;
  vagasDisponiveis: number;
  status: StatusSaida;
};

export type FormaPagamento = "PIX" | "CARTAO" | "BOLETO";

export type Cotacao = {
  qtdPassageiros: number;
  valorUnitario: number;
  subtotal: number;
  percentualDesconto: number;
  valorDesconto: number;
  valorTotal: number;
  forma: FormaPagamento;
  parcelas: number;
  taxaParcelamento: number;
  valorCobrado: number;
  valorParcela: number;
  vagasDisponiveis: number;
};

export type Cliente = {
  id: number;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
};

export type StatusReserva = "PENDENTE" | "CONFIRMADA" | "CANCELADA";
export type StatusPagamento = "PENDENTE" | "APROVADO" | "RECUSADO";

export type Pagamento = {
  id: number;
  reservaCodigo: string;
  reservaStatus: StatusReserva;
  valor: number;
  forma: FormaPagamento;
  parcelas: number;
  taxaPercentual: number;
  valorCobrado: number;
  status: StatusPagamento;
  criadoEm: string;
};

export type Reserva = {
  codigo: string;
  clienteId: number;
  clienteNome: string;
  saidaId: number;
  pacoteNome: string;
  dataPartida: string;
  dataRetorno: string;
  qtdPassageiros: number;
  valorUnitario: number;
  percentualDesconto: number;
  valorTotal: number;
  valorPago: number;
  saldo: number;
  status: StatusReserva;
  criadaEm: string;
  canceladaEm: string | null;
  pagamentos: Pagamento[];
};

/** RFC 9457: o corpo de erro que a API devolve em application/problem+json. */
export type Problem = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  erros?: { campo: string; mensagem: string }[];
};
