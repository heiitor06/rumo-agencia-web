import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DestinoHero } from "@/components/destino/destino-hero";
import { PacotesDoDestino, PacotesSkeleton } from "@/components/destino/pacotes-do-destino";
import { TransicaoPagina } from "@/components/transicao-pagina";
import { destinoPorSlug, destinos } from "@/content/destinos";

export function generateStaticParams() {
  return destinos.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/destinos/[slug]">): Promise<Metadata> {
  const destino = destinoPorSlug((await params).slug);
  if (!destino) return {};
  return {
    title: `${destino.nome} (${destino.uf}): pacotes e saídas`,
    description: `${destino.resumo} Veja as datas de saída, vagas e preços dos pacotes da Rumo para ${destino.nome}.`,
    openGraph: { images: [{ url: destino.foto.src, width: destino.foto.width, height: destino.foto.height, alt: destino.alt }] },
  };
}

export default async function DestinoPage({ params, searchParams }: PageProps<"/destinos/[slug]">) {
  const destino = destinoPorSlug((await params).slug);
  if (!destino) notFound();

  return (
    <TransicaoPagina>
      <main>
        <DestinoHero destino={destino} tamanho="cheio" voltar={{ href: "/#destinos", rotulo: "Todos os destinos" }}>
          <h1 className="mt-8 font-display text-[clamp(3.5rem,11vw,7.5rem)] font-bold uppercase leading-[0.86]">
            {destino.linhas.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h1>
          <p className="mt-3 font-display text-2xl font-bold tracking-wide text-nevoa uppercase">
            {destino.cidade} · {destino.regiao}
          </p>
          <p className="mt-6 max-w-xl text-lg text-nevoa">{destino.resumo}</p>
        </DestinoHero>

        <section id="saidas" aria-labelledby="saidas-titulo" className="mx-auto max-w-[1600px] px-5 py-20 sm:px-10 lg:px-14 lg:py-28">
          <h2 id="saidas-titulo" className="font-display text-[clamp(2.25rem,5vw,4rem)] font-bold uppercase leading-[0.92]">
            Pacotes e saídas
          </h2>
          <Suspense fallback={<PacotesSkeleton />}>
            <PacotesDoDestino destino={destino} searchParams={searchParams} />
          </Suspense>
        </section>
      </main>
    </TransicaoPagina>
  );
}
