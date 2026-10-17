"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError, mensagemDeErro } from "@/lib/api";
import { cpfValido, mascaraApi, soDigitos } from "@/lib/cpf";
import type { Cliente, Cotacao, FormaPagamento } from "@/lib/types";

const FORMAS: FormaPagamento[] = ["PIX", "BOLETO", "CARTAO"];
const formaValida = (v: unknown): v is FormaPagamento => FORMAS.includes(v as FormaPagamento);

export type ResultadoCotacao = { ok: true; cotacao: Cotacao } | { ok: false; erro: string };

export async function cotar(entrada: {
  saidaId: number;
  qtdPassageiros: number;
  forma: FormaPagamento;
  parcelas: number;
}): Promise<ResultadoCotacao> {
  if (!formaValida(entrada.forma)) return { ok: false, erro: "Forma de pagamento inválida." };
  try {
    return { ok: true, cotacao: await api.cotar(entrada) };
  } catch (e) {
    return { ok: false, erro: mensagemDeErro(e) };
  }
}

export type EstadoReserva = {
  erro?: string;
  campos?: Partial<Record<"nome" | "documento" | "email" | "telefone" | "consentimento", string>>;
  valores?: Record<string, string>;
};

/**
 * Cadastro de quem já reservou antes: a API recusa CPF repetido (409) e não tem busca por CPF.
 * Procura o cliente pela máscara do CPF + e-mail. Pendência registrada para a API: GET /api/clientes?documento=.
 */
async function clienteExistente(documento: string, email: string): Promise<Cliente | undefined> {
  const mascara = mascaraApi(documento);
  for (let pagina = 0; pagina < 20; pagina++) {
    const page = await api.clientes(pagina);
    const achado = page.content.find((c) => c.documento === mascara && c.email.toLowerCase() === email.toLowerCase());
    if (achado || pagina >= page.totalPages - 1) return achado;
  }
  return undefined;
}

export async function reservar(_anterior: EstadoReserva, form: FormData): Promise<EstadoReserva> {
  const valores = {
    nome: String(form.get("nome") ?? "").trim(),
    documento: String(form.get("documento") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    telefone: String(form.get("telefone") ?? "").trim(),
  };
  const saidaId = Number(form.get("saidaId"));
  const pax = Number(form.get("pax"));

  const campos: EstadoReserva["campos"] = {};
  if (valores.nome.length < 3) campos.nome = "Escreva o nome completo de quem faz a reserva.";
  if (!cpfValido(valores.documento)) campos.documento = "Esse CPF não é válido. Confira os números.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email)) campos.email = "Esse e-mail parece incompleto.";
  if (soDigitos(valores.telefone).length < 10) campos.telefone = "Informe o telefone com DDD.";
  if (form.get("consentimento") !== "on") campos.consentimento = "Precisamos do seu ok para usar esses dados na reserva.";
  if (Object.keys(campos).length) return { campos, valores };
  if (!Number.isInteger(saidaId) || !Number.isInteger(pax) || pax < 1) return { erro: "Saída ou passageiros inválidos.", valores };

  let codigo: string;
  try {
    let cliente: Cliente | undefined;
    try {
      cliente = await api.criarCliente({ ...valores, documento: soDigitos(valores.documento) });
    } catch (e) {
      if (!(e instanceof ApiError && e.tipo === "recurso-duplicado")) throw e;
      cliente = await clienteExistente(valores.documento, valores.email);
      if (!cliente) {
        return {
          campos: { email: "Esse CPF já tem cadastro com outro e-mail. Use o e-mail da primeira reserva." },
          valores,
        };
      }
    }
    const reserva = await api.criarReserva({ clienteId: cliente.id, saidaId, qtdPassageiros: pax });
    codigo = reserva.codigo;
  } catch (e) {
    return { erro: mensagemDeErro(e), valores };
  }
  redirect(`/reserva/${codigo}?nova=1`);
}

export type EstadoPagamento = { erro?: string };

export async function registrarPagamento(_anterior: EstadoPagamento, form: FormData): Promise<EstadoPagamento> {
  const codigo = String(form.get("codigo"));
  const forma = form.get("forma");
  const parcelas = forma === "CARTAO" ? Number(form.get("parcelas")) : 1;
  const bruto = String(form.get("valor") ?? "").trim();
  // "1.234,56" (como o campo vem preenchido) ou "1234.56" (se a pessoa digitar com ponto).
  const valor = Number(bruto.includes(",") ? bruto.replace(/\./g, "").replace(",", ".") : bruto);
  if (!formaValida(forma)) return { erro: "Escolha a forma de pagamento." };
  if (!(valor > 0)) return { erro: "Informe um valor maior que zero." };
  try {
    await api.registrarPagamento(codigo, { valor, forma, parcelas });
  } catch (e) {
    return { erro: mensagemDeErro(e) };
  }
  refresh();
  return {};
}

export async function aprovarPagamento(_anterior: EstadoPagamento, form: FormData): Promise<EstadoPagamento> {
  try {
    await api.aprovarPagamento(Number(form.get("pagamentoId")));
  } catch (e) {
    return { erro: mensagemDeErro(e) };
  }
  refresh();
  return {};
}
