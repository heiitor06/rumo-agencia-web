"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, use, useId, useState, type FormEvent } from "react";
import type { DestinoConteudo } from "@/content/destinos";
import { Stepper } from "@/components/ui/stepper";
import { mesAno } from "@/lib/format";
import type { ResumoDestinos } from "@/lib/resumo";

type Props = {
  destinos: Pick<DestinoConteudo, "slug" | "nome" | "uf">[];
  resumo: Promise<ResumoDestinos>;
};

/** Busca que funciona de verdade: leva ao destino já filtrado por mês e passageiros. */
export function BuscaSaidas({ destinos, resumo }: Props) {
  const router = useRouter();
  const id = useId();
  const [slug, setSlug] = useState(destinos[0].slug);
  const [mes, setMes] = useState("");
  const [pax, setPax] = useState(2);
  const destino = destinos.find((d) => d.slug === slug) ?? destinos[0];

  function buscar(e: FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({ pax: String(pax) });
    if (mes) q.set("mes", mes);
    router.push(`/destinos/${slug}?${q}#saidas`, { transitionTypes: ["nav-forward"] });
  }

  return (
    <form
      onSubmit={buscar}
      aria-label="Buscar saídas"
      className="grid gap-px overflow-hidden rounded-card bg-linha shadow-card md:grid-cols-[1.3fr_1fr_auto_auto]"
    >
      <label htmlFor={`${id}-destino`} className="campo-busca">
        <span className="rotulo-busca">Destino</span>
        <select
          id={`${id}-destino`}
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setMes("");
          }}
          className="select-busca"
        >
          {destinos.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.nome} · {d.uf}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor={`${id}-mes`} className="campo-busca">
        <span className="rotulo-busca">Quando</span>
        <Suspense fallback={<SelectMes id={`${id}-mes`} meses={[]} valor="" onChange={setMes} />}>
          <MesesDoDestino id={`${id}-mes`} resumo={resumo} nome={destino.nome} valor={mes} onChange={setMes} />
        </Suspense>
      </label>
      <div className="campo-busca">
        <span className="rotulo-busca" id={`${id}-pax`}>
          Passageiros
        </span>
        <Stepper valor={pax} min={1} max={20} onChange={setPax} rotuloId={`${id}-pax`} />
      </div>
      <button
        type="submit"
        className="flex min-h-16 items-center justify-center gap-2 bg-sol px-8 font-display text-xl font-bold tracking-wide text-tinta uppercase transition-colors hover:bg-sol-forte"
      >
        <Search aria-hidden className="size-5" />
        Ver saídas
      </button>
    </form>
  );
}

type SelectProps = { id: string; valor: string; onChange: (v: string) => void };

function MesesDoDestino({ resumo, nome, ...props }: SelectProps & { resumo: Promise<ResumoDestinos>; nome: string }) {
  const meses = use(resumo).porNome[nome]?.meses ?? [];
  return <SelectMes {...props} meses={meses} />;
}

function SelectMes({ id, meses, valor, onChange }: SelectProps & { meses: string[] }) {
  return (
    <select id={id} value={valor} onChange={(e) => onChange(e.target.value)} className="select-busca">
      <option value="">Qualquer data</option>
      {meses.map((m) => (
        <option key={m} value={m}>
          {mesAno(m)}
        </option>
      ))}
    </select>
  );
}
