import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ICONE_ITEM } from "@/components/destino/pacotes-do-destino";
import { Cotador } from "@/components/pacote/cotador";
import { TransicaoPagina } from "@/components/transicao-pagina";
import { destinoPorSlug } from "@/content/destinos";
import { api, ApiError, mensagemDeErro } from "@/lib/api";
import { aceitaReserva } from "@/lib/catalogo";
import { hojeSP, moedaCurta, plural } from "@/lib/format";
import type { ItemRoteiro } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/destinos/[slug]/pacotes/[id]">): Promise<Metadata> {
  const { slug, id } = await params;
  const destino = destinoPorSlug(slug);
  try {
    const pacote = await api.pacote(Number(id));
    return {
      title: `${pacote.nome}: ${plural(pacote.duracaoDias, "dia", "dias")} em ${pacote.destinoNome}`,
      description: `${pacote.descricao ?? ""} A partir de ${moedaCurta(pacote.precoBase)} por pessoa, com saídas e vagas em tempo real.`.trim(),
      openGraph: destino ? { images: [{ url: destino.foto.src, alt: destino.alt }] } : undefined,
    };
  } catch {
    return { title: destino ? `Pacote para ${destino.nome}` : "Pacote" };
  }
}

export default function PacotePage({ params, searchParams }: PageProps<"/destinos/[slug]/pacotes/[id]">) {
  return (
    <TransicaoPagina>
      <main className="mx-auto max-w-[1600px] px-5 py-14 sm:px-10 lg:px-14 lg:py-20">
        <Suspense fallback={<PacoteSkeleton />}>
          <PacoteConteudo params={params} searchParams={searchParams} />
        </Suspense>
      </main>
    </TransicaoPagina>
  );
}

async function PacoteConteudo({ params, searchParams }: PageProps<"/destinos/[slug]/pacotes/[id]">) {
  const [{ slug, id }, busca] = await Promise.all([params, searchParams]);
  const destino = destinoPorSlug(slug);
  if (!destino || !/^\d+$/.test(id)) notFound();

  let pacote, saidas;
  try {
    [pacote, saidas] = await Promise.all([api.pacote(Number(id)), api.saidas(Number(id))]);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    return <p className="max-w-xl text-lg text-pedra">{mensagemDeErro(e)}</p>;
  }
  if (pacote.destinoNome !== destino.nome) notFound();

  const hoje = hojeSP();
  const abertas = saidas.filter((s) => aceitaReserva(s, hoje)).sort((a, b) => a.dataPartida.localeCompare(b.dataPartida));
  const saidaPedida = Number(busca.saida);
  const paxPedido = Number(busca.pax);

  const dias = new Map<number, ItemRoteiro[]>();
  for (const item of pacote.itens) dias.set(item.dia, [...(dias.get(item.dia) ?? []), item]);

  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-20">
      <div>
        <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] font-bold uppercase leading-[0.9]">{pacote.nome}</h1>
        <p className="mt-4 text-lg">
          <strong className="font-semibold">{plural(pacote.duracaoDias, "dia", "dias")}</strong>
          <span className="text-pedra"> · {moedaCurta(pacote.precoBase)} por pessoa</span>
        </p>
        {pacote.descricao && <p className="mt-5 max-w-[62ch] text-lg text-pedra">{pacote.descricao}</p>}

        <h2 className="mt-16 font-display text-4xl font-bold uppercase">Roteiro dia a dia</h2>
        {dias.size === 0 ? (
          <p className="mt-4 text-pedra">O roteiro detalhado deste pacote ainda não foi publicado.</p>
        ) : (
          <ol className="mt-8">
            {[...dias.entries()]
              .sort(([a], [b]) => a - b)
              .map(([dia, itens]) => (
                <li key={dia} className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-linha py-6 sm:grid-cols-[6rem_1fr]">
                  <p className="font-display text-3xl font-bold uppercase leading-none">
                    <span className="block text-sm tracking-[0.14em] text-pedra">Dia</span>
                    {String(dia).padStart(2, "0")}
                  </p>
                  <ul className="space-y-4">
                    {itens.map((item) => {
                      const Icone = ICONE_ITEM[item.tipo];
                      return (
                        <li key={item.id} className="flex gap-3">
                          <Icone aria-hidden className="mt-1 size-5 shrink-0 text-pedra" />
                          <span>
                            <span className="block font-semibold">{item.titulo}</span>
                            {item.descricao && <span className="block text-pedra">{item.descricao}</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
          </ol>
        )}
      </div>

      <aside aria-label="Escolha a saída e veja o preço" className="lg:sticky lg:top-28 lg:self-start">
        {abertas.length === 0 ? (
          <div className="rounded-card bg-areia p-8">
            <h2 className="font-display text-3xl font-bold uppercase">Sem saídas abertas</h2>
            <p className="mt-3 text-pedra">Todas as datas deste pacote estão lotadas ou encerradas.</p>
          </div>
        ) : (
          <Cotador
            saidas={abertas.map((s) => ({
              id: s.id,
              dataPartida: s.dataPartida,
              dataRetorno: s.dataRetorno,
              vagas: s.vagasDisponiveis,
              capacidade: s.capacidadeTotal,
            }))}
            saidaInicial={abertas.some((s) => s.id === saidaPedida) ? saidaPedida : abertas[0].id}
            paxInicial={paxPedido >= 1 ? Math.floor(paxPedido) : 2}
          />
        )}
      </aside>
    </div>
  );
}

function PacoteSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando pacote" className="grid gap-14 lg:grid-cols-[1fr_420px]">
      <div className="space-y-5">
        <div className="h-16 w-3/4 animate-pulse rounded bg-areia" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-areia" />
        <div className="h-24 animate-pulse rounded bg-areia" />
        <div className="h-64 animate-pulse rounded bg-areia" />
      </div>
      <div className="h-[520px] animate-pulse rounded-card bg-areia" />
    </div>
  );
}
