import { plural } from "@/lib/format";

/** Barra de lotação: a parte cheia é o que já foi vendido; o número é o que sobra. */
export function Vagas({ vagas, capacidade, tom = "claro" }: { vagas: number; capacidade: number; tom?: "claro" | "escuro" }) {
  const ocupado = Math.round(((capacidade - vagas) / capacidade) * 100);
  const poucas = vagas <= 5;
  return (
    <span className="flex min-w-36 flex-col gap-1.5">
      <span className={`text-sm font-semibold tabular-nums ${poucas ? (tom === "claro" ? "text-alerta" : "text-sol") : ""}`}>
        {poucas ? `Últimas ${plural(vagas, "vaga", "vagas")}` : plural(vagas, "vaga", "vagas")}
        <span className={`font-normal ${tom === "claro" ? "text-pedra" : "text-nevoa"}`}> de {capacidade}</span>
      </span>
      <span aria-hidden className={`block h-1.5 overflow-hidden rounded-full ${tom === "claro" ? "bg-linha" : "bg-papel/20"}`}>
        <span className={`block h-full rounded-full ${tom === "claro" ? "bg-tinta" : "bg-papel"}`} style={{ width: `${ocupado}%` }} />
      </span>
    </span>
  );
}
