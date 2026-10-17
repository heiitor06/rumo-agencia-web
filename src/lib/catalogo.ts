import { connection } from "next/server";
import { cache } from "react";
import { api } from "./api";
import { hojeSP } from "./format";
import type { PacoteResumo, Saida } from "./types";

export type SaidaDoPacote = Saida & { pacote: PacoteResumo };

export type CatalogoDestino = {
  pacotes: PacoteResumo[];
  /** Saídas que ainda aceitam reserva, da mais próxima para a mais distante. */
  saidas: SaidaDoPacote[];
  proxima: SaidaDoPacote | undefined;
  aPartirDe: number | undefined;
};

/** A API recusa reserva em saída fechada, lotada ou que parte hoje ou antes (fuso de São Paulo). */
export function aceitaReserva(saida: Saida, hoje: string) {
  return saida.status === "ABERTA" && saida.vagasDisponiveis > 0 && saida.dataPartida > hoje;
}

/**
 * Pacotes e saídas de todos os destinos, agrupados pelo nome do destino.
 * Sem cache: vaga muda a cada reserva. O React.cache só evita repetir as chamadas dentro do mesmo request.
 */
export const catalogo = cache(async (): Promise<Map<string, CatalogoDestino>> => {
  await connection();
  const hoje = hojeSP();
  const pacotes = (await api.pacotes()).content.filter((p) => p.ativo);
  const saidas = (
    await Promise.all(pacotes.map(async (p) => (await api.saidas(p.id)).map((s) => ({ ...s, pacote: p }))))
  ).flat();

  const porDestino = new Map<string, CatalogoDestino>();
  for (const pacote of pacotes) {
    const atual = porDestino.get(pacote.destinoNome) ?? { pacotes: [], saidas: [], proxima: undefined, aPartirDe: undefined };
    atual.pacotes.push(pacote);
    porDestino.set(pacote.destinoNome, atual);
  }
  for (const saida of saidas) {
    if (aceitaReserva(saida, hoje)) porDestino.get(saida.pacote.destinoNome)?.saidas.push(saida);
  }
  for (const destino of porDestino.values()) {
    destino.saidas.sort((a, b) => a.dataPartida.localeCompare(b.dataPartida));
    destino.proxima = destino.saidas[0];
    const comSaida = destino.pacotes.filter((p) => destino.saidas.some((s) => s.pacoteId === p.id));
    destino.aPartirDe = comSaida.length ? Math.min(...comSaida.map((p) => p.precoBase)) : undefined;
  }
  return porDestino;
});
