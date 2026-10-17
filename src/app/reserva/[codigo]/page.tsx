import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PagamentoDemo } from "@/components/reserva/pagamento-demo";
import { TransicaoPagina } from "@/components/transicao-pagina";
import { api, ApiError, mensagemDeErro } from "@/lib/api";
import { dataLonga, moeda, plural } from "@/lib/format";
import type { FormaPagamento, StatusPagamento, StatusReserva } from "@/lib/types";

export const metadata: Metadata = { title: "Sua reserva", robots: { index: false } };

const STATUS: Record<StatusReserva, { rotulo: string; classe: string }> = {
  PENDENTE: { rotulo: "Aguardando pagamento", classe: "bg-sol text-tinta" },
  CONFIRMADA: { rotulo: "Confirmada", classe: "bg-ok text-papel" },
  CANCELADA: { rotulo: "Cancelada", classe: "bg-alerta text-papel" },
};
const STATUS_PAG: Record<StatusPagamento, string> = { PENDENTE: "Aguardando aprovação", APROVADO: "Aprovado", RECUSADO: "Recusado" };
const FORMA: Record<FormaPagamento, string> = { PIX: "PIX", BOLETO: "Boleto", CARTAO: "Cartão" };

export default function ReservaPage({ params, searchParams }: PageProps<"/reserva/[codigo]">) {
  return (
    <TransicaoPagina>
      <main className="mx-auto max-w-[1200px] px-5 pt-28 pb-20 sm:px-10 lg:pt-36">
        <Suspense fallback={<div aria-busy="true" className="h-[560px] animate-pulse rounded-card bg-areia" />}>
          <Conteudo params={params} searchParams={searchParams} />
        </Suspense>
      </main>
    </TransicaoPagina>
  );
}

async function Conteudo({ params, searchParams }: PageProps<"/reserva/[codigo]">) {
  const [{ codigo }, busca] = await Promise.all([params, searchParams]);
  let r;
  try {
    r = await api.reserva(decodeURIComponent(codigo).toUpperCase());
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    return <p className="text-lg text-pedra">{mensagemDeErro(e)}</p>;
  }
  const status = STATUS[r.status];
  const nova = busca.nova === "1";

  return (
    <>
      {nova && r.status === "PENDENTE" && (
        <p role="status" className="surge mb-8 flex items-start gap-3 rounded-card bg-ok/10 px-5 py-4 text-ok">
          <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0" />
          <span>
            <strong className="font-semibold">{plural(r.qtdPassageiros, "vaga reservada", "vagas reservadas")} no seu nome.</strong> Guarde o
            código abaixo para voltar a esta página.
          </span>
        </p>
      )}

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <section aria-labelledby="reserva-titulo" className="overflow-hidden rounded-card bg-noite text-papel shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-dashed border-papel/25 p-6 sm:p-8">
            <div>
              <p className="text-sm text-nevoa">Código da reserva</p>
              <h1 id="reserva-titulo" className="font-display text-[clamp(2.75rem,7vw,4.5rem)] font-bold tracking-wide tabular-nums">
                {r.codigo}
              </h1>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${status.classe}`}>{status.rotulo}</span>
          </div>
          <dl className="grid gap-x-8 gap-y-5 p-6 sm:grid-cols-2 sm:p-8">
            <Dado rotulo="Pacote" valor={r.pacoteNome} largo />
            <Dado rotulo="Ida" valor={dataLonga(r.dataPartida)} />
            <Dado rotulo="Volta" valor={dataLonga(r.dataRetorno)} />
            <Dado rotulo="Em nome de" valor={r.clienteNome} />
            <Dado rotulo="Passageiros" valor={plural(r.qtdPassageiros, "pessoa", "pessoas")} />
          </dl>
          <dl className="grid grid-cols-3 gap-4 border-t border-dashed border-papel/25 p-6 sm:p-8">
            <Valor rotulo="Total" valor={moeda(r.valorTotal)} />
            <Valor rotulo="Pago" valor={moeda(r.valorPago)} />
            <Valor rotulo="Falta" valor={moeda(r.saldo)} destaque={r.saldo > 0} />
          </dl>
          {r.percentualDesconto > 0 && (
            <p className="px-6 pb-6 text-sm text-nevoa sm:px-8">Inclui {r.percentualDesconto}% de desconto de grupo.</p>
          )}
        </section>

        <section aria-labelledby="pagamento-titulo">
          <h2 id="pagamento-titulo" className="font-display text-4xl font-bold uppercase">
            {r.status === "CONFIRMADA" ? "Tudo pago" : r.status === "CANCELADA" ? "Reserva cancelada" : "Pagamento"}
          </h2>

          {r.pagamentos.length > 0 && (
            <ul className="mt-5 divide-y divide-linha border-y border-linha">
              {r.pagamentos.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span>
                    <span className="font-semibold tabular-nums">{moeda(p.valorCobrado)}</span>
                    <span className="text-pedra">
                      {" "}
                      · {FORMA[p.forma]}
                      {p.parcelas > 1 && ` em ${p.parcelas}x`}
                    </span>
                  </span>
                  <span className={`text-sm font-semibold ${p.status === "APROVADO" ? "text-ok" : p.status === "RECUSADO" ? "text-alerta" : "text-pedra"}`}>
                    {STATUS_PAG[p.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {r.status === "CONFIRMADA" && (
            <p className="mt-5 text-lg text-pedra">
              Sua viagem está confirmada. Até {dataLonga(r.dataPartida)}!
            </p>
          )}

          {r.status === "PENDENTE" && (
            <PagamentoDemo
              codigo={r.codigo}
              saldo={r.saldo}
              pendentes={r.pagamentos.filter((p) => p.status === "PENDENTE").map((p) => ({ id: p.id, valor: p.valorCobrado, forma: FORMA[p.forma] }))}
            />
          )}

          <p className="mt-10 text-sm text-pedra">
            Quer ver outras viagens? <Link href="/#destinos" className="link-texto text-tinta">Voltar aos destinos</Link>
          </p>
        </section>
      </div>
    </>
  );
}

function Dado({ rotulo, valor, largo }: { rotulo: string; valor: string; largo?: boolean }) {
  return (
    <div className={largo ? "sm:col-span-2" : ""}>
      <dt className="text-sm text-nevoa">{rotulo}</dt>
      <dd className={`font-semibold ${largo ? "font-display text-3xl uppercase" : "text-lg"}`}>{valor}</dd>
    </div>
  );
}

function Valor({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div>
      <dt className="text-sm text-nevoa">{rotulo}</dt>
      <dd className={`font-display text-xl font-bold tabular-nums sm:text-2xl ${destaque ? "text-sol" : ""}`}>{valor}</dd>
    </div>
  );
}
