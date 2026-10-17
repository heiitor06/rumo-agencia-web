import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ConsultaReserva } from "@/components/home/consulta-reserva";
import { TransicaoPagina } from "@/components/transicao-pagina";
import { api, ApiError, mensagemDeErro } from "@/lib/api";

export const metadata: Metadata = {
  title: "Consultar minha reserva",
  description: "Digite o código da reserva para ver status, pagamentos e saldo.",
};

export default function MinhaReservaPage({ searchParams }: PageProps<"/minha-reserva">) {
  return (
    <TransicaoPagina>
      <main className="mx-auto max-w-[900px] px-5 pt-32 pb-24 sm:px-10 lg:pt-40">
        <h1 className="font-display text-[clamp(2.75rem,7vw,5rem)] font-bold uppercase leading-[0.9]">Minha reserva</h1>
        <p className="mt-4 max-w-lg text-lg text-pedra">
          O código está na página que abriu quando você reservou. Ele começa com RSV.
        </p>
        <div className="mt-10">
          <Suspense fallback={<ConsultaReserva />}>
            <Busca searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </TransicaoPagina>
  );
}

/** Aceita "rsv7k2qxm", "RSV 7K2QXM" etc. e devolve no formato da API. */
function normalizar(bruto: string) {
  const limpo = bruto.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return limpo.startsWith("RSV") ? `RSV-${limpo.slice(3)}` : `RSV-${limpo}`;
}

async function Busca({ searchParams }: Pick<PageProps<"/minha-reserva">, "searchParams">) {
  const { codigo } = await searchParams;
  const bruto = typeof codigo === "string" ? codigo : "";
  if (!bruto) return <ConsultaReserva />;

  const normal = normalizar(bruto);
  let erro: string;
  try {
    await api.reserva(normal);
    erro = "";
  } catch (e) {
    erro = e instanceof ApiError && e.status === 404 ? `Não encontramos a reserva ${normal}. Confira as letras e os números.` : mensagemDeErro(e);
  }
  if (!erro) redirect(`/reserva/${normal}`);

  return (
    <>
      <ConsultaReserva codigoInicial={normal} />
      <p role="alert" className="erro-campo mt-4 text-base">
        {erro}
      </p>
    </>
  );
}
