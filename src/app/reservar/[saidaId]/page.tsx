import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FormReserva } from "@/components/reserva/form-reserva";
import { TransicaoPagina } from "@/components/transicao-pagina";
import { destinoPorNome } from "@/content/destinos";
import { api, ApiError, mensagemDeErro } from "@/lib/api";
import { aceitaReserva } from "@/lib/catalogo";
import { dataLonga, hojeSP, moeda, plural } from "@/lib/format";
import type { FormaPagamento } from "@/lib/types";

export const metadata: Metadata = {
  title: "Seus dados para a reserva",
  robots: { index: false },
};

export default function ReservarPage({ params, searchParams }: PageProps<"/reservar/[saidaId]">) {
  return (
    <TransicaoPagina>
      <main className="mx-auto max-w-[1200px] px-5 pt-28 pb-20 sm:px-10 lg:pt-36">
        <Suspense fallback={<div aria-busy="true" className="h-[640px] animate-pulse rounded-card bg-areia" />}>
          <Conteudo params={params} searchParams={searchParams} />
        </Suspense>
      </main>
    </TransicaoPagina>
  );
}

const FORMAS: FormaPagamento[] = ["PIX", "BOLETO", "CARTAO"];
const NOME_FORMA: Record<FormaPagamento, string> = { PIX: "PIX", BOLETO: "boleto", CARTAO: "cartão" };

async function Conteudo({ params, searchParams }: PageProps<"/reservar/[saidaId]">) {
  const [{ saidaId }, busca] = await Promise.all([params, searchParams]);
  if (!/^\d+$/.test(saidaId)) notFound();

  const forma = FORMAS.includes(busca.forma as FormaPagamento) ? (busca.forma as FormaPagamento) : "PIX";
  const parcelas = forma === "CARTAO" ? Math.min(10, Math.max(1, Number(busca.parcelas) || 1)) : 1;

  let saida, pacote;
  try {
    saida = await api.saida(Number(saidaId));
    pacote = await api.pacote(saida.pacoteId);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    return <p className="text-lg text-pedra">{mensagemDeErro(e)}</p>;
  }

  if (!aceitaReserva(saida, hojeSP())) {
    return (
      <div className="max-w-xl">
        <h1 className="font-display text-5xl font-bold uppercase">Essa saída fechou</h1>
        <p className="mt-4 text-lg text-pedra">As vagas acabaram ou a data já passou. Volte ao pacote e escolha outra saída.</p>
      </div>
    );
  }

  const pax = Math.min(saida.vagasDisponiveis, Math.max(1, Number(busca.pax) || 1));
  const cotacao = await api.cotar({ saidaId: saida.id, qtdPassageiros: pax, forma, parcelas }).catch(() => null);
  const destino = destinoPorNome(pacote.destinoNome);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
      <div>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold uppercase leading-[0.9]">Quem vai reservar?</h1>
        <p className="mt-4 max-w-xl text-lg text-pedra">
          A reserva fica no nome de quem preenche. Os outros passageiros podem ser informados depois.
        </p>
        <FormReserva saidaId={saida.id} pax={pax} />
      </div>

      <aside aria-label="Resumo da viagem" className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-card bg-noite text-papel shadow-card">
          {destino && (
            <div className="relative aspect-[16/9]">
              <Image src={destino.foto} alt={destino.alt} fill sizes="380px" placeholder="blur" className="object-cover" />
            </div>
          )}
          <div className="p-6">
            <p className="text-sm text-nevoa">{pacote.destinoNome}</p>
            <p className="font-display text-3xl font-bold uppercase leading-tight">{pacote.nome}</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-nevoa">Ida</dt>
                <dd className="font-semibold">{dataLonga(saida.dataPartida)}</dd>
              </div>
              <div>
                <dt className="text-nevoa">Volta</dt>
                <dd className="font-semibold">{dataLonga(saida.dataRetorno)}</dd>
              </div>
              <div>
                <dt className="text-nevoa">Passageiros</dt>
                <dd className="font-semibold">{plural(pax, "pessoa", "pessoas")}</dd>
              </div>
            </dl>
            {cotacao && (
              <div className="mt-6 border-t border-papel/20 pt-5">
                <p className="text-sm text-nevoa">
                  Total no {NOME_FORMA[forma]}
                  {cotacao.parcelas > 1 && ` em ${cotacao.parcelas}x de ${moeda(cotacao.valorParcela)}`}
                </p>
                <p className="font-display text-4xl font-bold tabular-nums text-sol">{moeda(cotacao.valorCobrado)}</p>
                <p className="mt-2 text-sm text-nevoa">O pagamento é feito depois, na página da reserva.</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
