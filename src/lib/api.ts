import type {
  Cliente,
  Cotacao,
  FormaPagamento,
  Pacote,
  PacoteResumo,
  Page,
  Pagamento,
  Problem,
  Reserva,
  Saida,
} from "./types";

// Só roda no servidor: a API não tem CORS e o endereço dela não vai para o navegador.
const API_URL = process.env.API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly problem: Problem,
  ) {
    super(problem.detail ?? problem.title ?? `Erro ${status} na API`);
  }

  get tipo(): string {
    return this.problem.type?.split("/").pop() ?? "";
  }
}

export class ApiOfflineError extends Error {
  constructor() {
    super("A API de reservas não respondeu.");
  }
}

async function request<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method: init?.method ?? "GET",
      headers: { "Content-Type": "application/json", Accept: "application/json, application/problem+json" },
      body: init?.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
    });
  } catch {
    throw new ApiOfflineError();
  }
  if (!res.ok) {
    const problem = (await res.json().catch(() => ({}))) as Problem;
    throw new ApiError(res.status, problem);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  pacotes: () => request<Page<PacoteResumo>>("/pacotes?size=200&sort=precoBase"),
  pacote: (id: number) => request<Pacote>(`/pacotes/${id}`),
  saidas: (pacoteId: number) => request<Saida[]>(`/pacotes/${pacoteId}/saidas`),
  saida: (id: number) => request<Saida>(`/saidas/${id}`),
  cotar: (body: { saidaId: number; qtdPassageiros: number; forma: FormaPagamento; parcelas: number }) =>
    request<Cotacao>("/cotacoes", { method: "POST", body }),
  criarCliente: (body: { nome: string; documento: string; email: string; telefone: string }) =>
    request<Cliente>("/clientes", { method: "POST", body }),
  clientes: (page: number) => request<Page<Cliente>>(`/clientes?size=200&page=${page}`),
  criarReserva: (body: { clienteId: number; saidaId: number; qtdPassageiros: number }) =>
    request<Reserva>("/reservas", { method: "POST", body }),
  reserva: (codigo: string) => request<Reserva>(`/reservas/${encodeURIComponent(codigo)}`),
  registrarPagamento: (codigo: string, body: { valor: number; forma: FormaPagamento; parcelas: number }) =>
    request<Pagamento>(`/reservas/${encodeURIComponent(codigo)}/pagamentos`, { method: "POST", body }),
  aprovarPagamento: (id: number) => request<Pagamento>(`/pagamentos/${id}/aprovacao`, { method: "POST" }),
};

/** Mensagem em português para mostrar ao visitante, a partir de qualquer erro vindo da API. */
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ApiOfflineError) {
    return "O sistema de reservas está fora do ar agora. Tente de novo em alguns minutos.";
  }
  if (erro instanceof ApiError) {
    const campos = erro.problem.erros?.map((e) => `${e.campo}: ${e.mensagem}`).join("; ");
    switch (erro.tipo) {
      case "vagas-insuficientes":
        return "As vagas dessa saída acabaram enquanto você preenchia. Escolha menos passageiros ou outra data.";
      case "tente-novamente":
        return "Muita gente reservando essa saída agora. Tente de novo em instantes.";
      case "dados-invalidos":
        return campos ? `Confira os dados: ${campos}.` : (erro.problem.detail ?? "Confira os dados informados.");
      case "recurso-nao-encontrado":
        return erro.problem.detail ?? "Não encontramos o que você procurou.";
      default:
        return erro.problem.detail ?? "Não foi possível concluir. Tente de novo.";
    }
  }
  return "Algo deu errado do nosso lado. Tente de novo.";
}
