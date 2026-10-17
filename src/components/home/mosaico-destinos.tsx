import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { destinos } from "@/content/destinos";
import type { ResumoDestinos } from "@/lib/resumo";
import { ProximaSaida } from "./proxima-saida";

// Mosaico: o primeiro destino ocupa um bloco grande, os outros se encaixam ao redor.
const POSICAO = [
  "lg:col-span-4 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

export function MosaicoDestinos({ resumo }: { resumo: Promise<ResumoDestinos> }) {
  return (
    <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:auto-rows-[300px] lg:grid-cols-6">
      {destinos.map((d, i) => (
        <li key={d.slug} className={`${POSICAO[i]} ${i === 0 ? "sm:col-span-2" : ""}`}>
          <Link
            href={`/destinos/${d.slug}`}
            transitionTypes={["nav-forward"]}
            className="group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-card p-6 text-papel shadow-card"
          >
            <Image
              src={d.foto}
              alt=""
              fill
              placeholder="blur"
              sizes={i === 0 ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"}
              className="-z-10 object-cover transition-transform duration-[900ms] ease-[var(--ease-saida)] group-hover:scale-[1.04]"
            />
            <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-noite/90 via-noite/25 to-transparent" />
            <span className="text-sm font-medium text-nevoa">
              {d.regiao} · {d.uf}
            </span>
            <span className={`mt-1 font-display font-bold uppercase leading-[0.9] ${i === 0 ? "text-[clamp(2.5rem,5vw,4.5rem)]" : "text-4xl"}`}>
              {d.nome}
            </span>
            <span className="mt-3 block min-h-5">
              <Suspense fallback={<span className="block h-5 w-48 animate-pulse rounded bg-papel/15" />}>
                <ProximaSaida resumo={resumo} nome={d.nome} />
              </Suspense>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
