"use client";

import { use } from "react";
import { dataCurta, moedaCurta, plural } from "@/lib/format";
import type { ResumoDestinos } from "@/lib/resumo";

/** Dado vivo da API ao lado do botão do hero: próxima saída, vagas e preço de entrada. */
export function ProximaSaida({ resumo, nome }: { resumo: Promise<ResumoDestinos>; nome: string }) {
  const { offline, porNome } = use(resumo);
  const d = porNome[nome];

  if (offline) return <p className="text-sm text-nevoa">Datas e vagas indisponíveis no momento.</p>;
  if (!d?.proxima) return <p className="text-sm text-nevoa">Sem saídas abertas agora.</p>;

  return (
    <p className="text-sm leading-snug text-nevoa">
      Próxima saída <strong className="font-semibold text-papel">{dataCurta(d.proxima.data)}</strong>
      <span aria-hidden> · </span>
      <strong className="font-semibold text-sol">{plural(d.proxima.vagas, "vaga", "vagas")}</strong>
      {d.aPartirDe !== undefined && (
        <>
          <span aria-hidden> · </span>a partir de <strong className="font-semibold text-papel">{moedaCurta(d.aPartirDe)}</strong>
        </>
      )}
    </p>
  );
}

/** Vagas da próxima saída no card da fila do hero: os cards são as próximas telas, então já mostram o dado vivo. */
export function VagasDoCard({ resumo, nome }: { resumo: Promise<ResumoDestinos>; nome: string }) {
  const proxima = use(resumo).porNome[nome]?.proxima;
  if (!proxima) return null;
  return (
    <>
      <span aria-hidden> · </span>
      <span className="font-semibold text-sol">{plural(proxima.vagas, "vaga", "vagas")}</span>
    </>
  );
}
