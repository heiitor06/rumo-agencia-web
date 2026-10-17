import { catalogo } from "./catalogo";
import { chaveMes } from "./format";

export type ResumoDestino = {
  proxima: { data: string; vagas: number } | undefined;
  aPartirDe: number | undefined;
  saidasAbertas: number;
  /** Meses (AAAA-MM) com pelo menos uma saída aberta, em ordem. */
  meses: string[];
};

export type ResumoDestinos = { offline: boolean; porNome: Record<string, ResumoDestino> };

/** Versão enxuta e serializável do catálogo, para ir do servidor aos componentes de cliente. */
export async function resumoDestinos(): Promise<ResumoDestinos> {
  try {
    const cat = await catalogo();
    const porNome: Record<string, ResumoDestino> = {};
    for (const [nome, d] of cat) {
      porNome[nome] = {
        proxima: d.proxima && { data: d.proxima.dataPartida, vagas: d.proxima.vagasDisponiveis },
        aPartirDe: d.aPartirDe,
        saidasAbertas: d.saidas.length,
        meses: [...new Set(d.saidas.map((s) => chaveMes(s.dataPartida)))],
      };
    }
    return { offline: false, porNome };
  } catch {
    return { offline: true, porNome: {} };
  }
}
