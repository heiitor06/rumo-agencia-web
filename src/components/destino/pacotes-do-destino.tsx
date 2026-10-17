import { ArrowRight, BedDouble, Bus, Compass } from "lucide-react";
import Link from "next/link";
import type { DestinoConteudo } from "@/content/destinos";
import { api, mensagemDeErro } from "@/lib/api";
import { catalogo } from "@/lib/catalogo";
import { chaveMes, dataCurta, mesAno, moedaCurta, plural } from "@/lib/format";
import type { TipoItem } from "@/lib/types";
import { Vagas } from "./vagas";

export const ICONE_ITEM: Record<TipoItem, typeof Bus> = { TRANSPORTE: Bus, HOTEL: BedDouble, PASSEIO: Compass };

type Busca = Promise<Record<string, string | string[] | undefined>>;

const texto = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export async function PacotesDoDestino({ destino, searchParams }: { destino: DestinoConteudo; searchParams: Busca }) {
  const busca = await searchParams;
  const mes = /^\d{4}-\d{2}$/.test(texto(busca.mes)) ? texto(busca.mes) : "";
  const pax = Math.max(1, Math.min(20, Number(texto(busca.pax)) || 1));

  let dados;
  try {
    const cat = await catalogo();
    const doDestino = cat.get(destino.nome);
    const pacotes = doDestino ? await Promise.all(doDestino.pacotes.map((p) => api.pacote(p.id))) : [];
    dados = { pacotes, saidas: doDestino?.saidas ?? [] };
  } catch (e) {
    return <p className="mt-10 max-w-xl text-lg text-pedra">{mensagemDeErro(e)}</p>;
  }

  if (!dados.pacotes.length) {
    return <p className="mt-10 max-w-xl text-lg text-pedra">Ainda não há pacotes abertos para {destino.nome}.</p>;
  }

  const filtra = mes !== "" || pax > 1;
  const visiveis = dados.saidas.filter((s) => (!mes || chaveMes(s.dataPartida) === mes) && s.vagasDisponiveis >= pax);

  return (
    <>
      {filtra && (
        <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-pedra">
          <span>
            Mostrando saídas {mes && <>em <strong className="font-semibold text-tinta">{mesAno(mes)}</strong> </>}
            com vaga para <strong className="font-semibold text-tinta">{plural(pax, "passageiro", "passageiros")}</strong>.
          </span>
          <Link href={`/destinos/${destino.slug}#saidas`} scroll={false} className="link-texto text-tinta">
            Ver todas as datas
          </Link>
        </p>
      )}

      <div className="mt-12 divide-y divide-linha border-y border-linha">
        {dados.pacotes.map((pacote) => {
          const saidas = visiveis.filter((s) => s.pacoteId === pacote.id);
          const passeios = pacote.itens.filter((i) => i.tipo === "PASSEIO").slice(0, 3);
          const link = `/destinos/${destino.slug}/pacotes/${pacote.id}${pax > 1 ? `?pax=${pax}` : ""}`;
          return (
            <article key={pacote.id} className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
              <div>
                <h3 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-bold uppercase leading-[0.95]">{pacote.nome}</h3>
                <p className="mt-3 text-lg">
                  <strong className="font-semibold">{plural(pacote.duracaoDias, "dia", "dias")}</strong>
                  <span className="text-pedra"> · a partir de </span>
                  <strong className="font-semibold">{moedaCurta(pacote.precoBase)}</strong>
                  <span className="text-pedra"> por pessoa</span>
                </p>
                {pacote.descricao && <p className="mt-4 max-w-[60ch] text-pedra">{pacote.descricao}</p>}
                {passeios.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {passeios.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <Compass aria-hidden className="size-4 shrink-0 text-sol-forte" />
                        {item.titulo}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={link} prefetch transitionTypes={["nav-forward"]} className="botao-contorno mt-8">
                  Roteiro completo e preço
                  <ArrowRight aria-hidden className="size-5" />
                </Link>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-[0.14em] text-pedra uppercase">Próximas saídas</h4>
                {saidas.length === 0 ? (
                  <p className="mt-4 text-pedra">
                    {filtra ? "Nenhuma saída deste pacote com esse filtro." : "Sem saídas abertas no momento."}
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-linha">
                    {saidas.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/destinos/${destino.slug}/pacotes/${pacote.id}?saida=${s.id}&pax=${pax}`}
                          prefetch
                          transitionTypes={["nav-forward"]}
                          className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                        >
                          <span>
                            <span className="block font-display text-2xl font-bold uppercase">
                              {dataCurta(s.dataPartida)} <span className="text-pedra">a</span> {dataCurta(s.dataRetorno)}
                            </span>
                            <span className="text-sm text-pedra">{s.dataPartida.slice(0, 4)}</span>
                          </span>
                          <Vagas vagas={s.vagasDisponiveis} capacidade={s.capacidadeTotal} />
                          <span className="col-span-2 inline-flex items-center gap-1 font-display text-lg font-bold uppercase underline decoration-sol decoration-2 underline-offset-4 group-hover:decoration-tinta sm:col-span-1">
                            Escolher
                            <span className="sr-only"> a saída de {dataCurta(s.dataPartida)}</span>
                            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export function PacotesSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando pacotes" className="mt-12 space-y-10 border-y border-linha py-12">
      {[0, 1].map((i) => (
        <div key={i} className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-12 w-2/3 animate-pulse rounded bg-areia" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-areia" />
            <div className="h-20 w-full animate-pulse rounded bg-areia" />
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-14 animate-pulse rounded bg-areia" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
