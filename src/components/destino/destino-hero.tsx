import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import type { DestinoConteudo } from "@/content/destinos";

type Props = {
  destino: DestinoConteudo;
  /** "cheio" na página do destino; "faixa" acima do pacote. A foto tem o mesmo nome de transição nos dois. */
  tamanho: "cheio" | "faixa";
  voltar: { href: string; rotulo: string };
  children?: ReactNode;
};

export function DestinoHero({ destino, tamanho, voltar, children }: Props) {
  const cheio = tamanho === "cheio";
  return (
    <section data-hero-foto className={`relative isolate flex flex-col justify-end overflow-hidden bg-noite text-papel ${cheio ? "min-h-[82svh]" : "min-h-[44svh]"}`}>
      <ViewTransition name={`destino-${destino.slug}`} share="morph" default="none">
        <Image
          src={destino.foto}
          alt={destino.alt}
          fill
          sizes="100vw"
          placeholder="blur"
          fetchPriority="high"
          loading="eager"
          className="-z-20 object-cover"
        />
      </ViewTransition>
      <div aria-hidden className="veu-hero absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-28 pb-10 sm:px-10 lg:px-14 lg:pb-14">
        <Link href={voltar.href} transitionTypes={["nav-back"]} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-nevoa hover:text-papel">
          <ArrowLeft aria-hidden className="size-4" />
          {voltar.rotulo}
        </Link>
        {children}
      </div>
    </section>
  );
}
