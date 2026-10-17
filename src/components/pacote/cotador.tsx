"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { cotar, type ResultadoCotacao } from "@/app/actions";
import { Vagas } from "@/components/destino/vagas";
import { Stepper } from "@/components/ui/stepper";
import { dataCurta, moeda, percentual, plural } from "@/lib/format";
import type { FormaPagamento } from "@/lib/types";

type SaidaOpcao = { id: number; dataPartida: string; dataRetorno: string; vagas: number; capacidade: number };

const FORMAS: { valor: FormaPagamento; rotulo: string }[] = [
  { valor: "PIX", rotulo: "PIX" },
  { valor: "BOLETO", rotulo: "Boleto" },
  { valor: "CARTAO", rotulo: "Cartão" },
];

export function Cotador({ saidas, saidaInicial, paxInicial }: { saidas: SaidaOpcao[]; saidaInicial: number; paxInicial: number }) {
  const id = useId();
  const [saidaId, setSaidaId] = useState(saidaInicial);
  const saida = saidas.find((s) => s.id === saidaId) ?? saidas[0];
  const [paxDesejado, setPax] = useState(paxInicial);
  const pax = Math.min(paxDesejado, saida.vagas);
  const [forma, setForma] = useState<FormaPagamento>("PIX");
  const [parcelas, setParcelas] = useState(1);
  const [resultado, setResultado] = useState<ResultadoCotacao | null>(null);
  const [carregando, iniciar] = useTransition();
  const ultima = useRef(0);

  const parcelasReais = forma === "CARTAO" ? parcelas : 1;

  useEffect(() => {
    const pedido = ++ultima.current;
    iniciar(async () => {
      const r = await cotar({ saidaId: saida.id, qtdPassageiros: pax, forma, parcelas: parcelasReais });
      if (pedido === ultima.current) setResultado(r);
    });
  }, [saida.id, pax, forma, parcelasReais]);

  const c = resultado?.ok ? resultado.cotacao : null;
  const reservar = `/reservar/${saida.id}?pax=${pax}&forma=${forma}&parcelas=${parcelasReais}`;

  return (
    <div className="rounded-card bg-white p-6 shadow-card ring-1 ring-linha sm:p-8">
      <fieldset>
        <legend className="font-display text-3xl font-bold uppercase">Escolha a saída</legend>
        <div className="mt-4 divide-y divide-linha border-y border-linha">
          {saidas.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-4 py-3 has-[:checked]:bg-areia/60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sol">
              <input
                type="radio"
                name={`${id}-saida`}
                value={s.id}
                checked={s.id === saidaId}
                onChange={() => setSaidaId(s.id)}
                className="ml-2 size-5 accent-tinta"
              />
              <span className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <span className="font-display text-xl font-bold uppercase">
                  {dataCurta(s.dataPartida)} – {dataCurta(s.dataRetorno)}
                </span>
                <Vagas vagas={s.vagas} capacidade={s.capacidade} />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span id={`${id}-pax`} className="rotulo">
          Passageiros
        </span>
        <Stepper valor={pax} min={1} max={saida.vagas} onChange={setPax} rotuloId={`${id}-pax`} />
      </div>
      {paxDesejado > saida.vagas && (
        <p className="mt-2 text-sm text-alerta">Essa saída só tem {plural(saida.vagas, "vaga", "vagas")}.</p>
      )}

      <fieldset className="mt-6">
        <legend className="rotulo">Pagamento</legend>
        <div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-full bg-linha ring-1 ring-linha">
          {FORMAS.map((f) => (
            <label key={f.valor} className="relative flex min-h-11 cursor-pointer items-center justify-center bg-white text-sm font-semibold has-[:checked]:bg-tinta has-[:checked]:text-papel has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-4 has-[:focus-visible]:outline-sol">
              <input type="radio" name={`${id}-forma`} value={f.valor} checked={forma === f.valor} onChange={() => setForma(f.valor)} className="sr-only" />
              {f.rotulo}
            </label>
          ))}
        </div>
      </fieldset>

      {forma === "CARTAO" && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <label htmlFor={`${id}-parcelas`} className="rotulo">
            Parcelas
          </label>
          <select id={`${id}-parcelas`} value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))} className="entrada w-auto min-w-36">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}x {n <= 3 ? "sem taxa" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-8 border-t-2 border-tinta pt-5" aria-live="polite" aria-busy={carregando}>
        {resultado && !resultado.ok ? (
          <p className="text-alerta">{resultado.erro}</p>
        ) : (
          <dl className={`space-y-2 transition-opacity ${carregando || !c ? "opacity-50" : ""}`}>
            <Linha rotulo={`${plural(pax, "passageiro", "passageiros")} × ${c ? moeda(c.valorUnitario) : "…"}`} valor={c ? moeda(c.subtotal) : "…"} />
            {c && c.valorDesconto > 0 && <Linha rotulo={`Desconto de grupo (${percentual(c.percentualDesconto)})`} valor={`− ${moeda(c.valorDesconto)}`} destaque />}
            {c && c.taxaParcelamento > 0 && <Linha rotulo={`Taxa do parcelamento (${percentual(c.taxaParcelamento)})`} valor={`+ ${moeda(c.valorCobrado - c.valorTotal)}`} />}
            <div className="flex items-end justify-between gap-4 pt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="text-right">
                <span className="block font-display text-4xl font-bold tabular-nums">{c ? moeda(c.valorCobrado) : "…"}</span>
                {c && c.parcelas > 1 && (
                  <span className="text-sm text-pedra">
                    {c.parcelas}x de {moeda(c.valorParcela)}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        )}
        {carregando && (
          <p className="mt-2 flex items-center gap-2 text-sm text-pedra">
            <LoaderCircle aria-hidden className="size-4 animate-spin" /> Calculando
          </p>
        )}
      </div>

      <Link href={reservar} transitionTypes={["nav-forward"]} className="botao-sol mt-6 w-full">
        Reservar {plural(pax, "vaga", "vagas")}
        <ArrowRight aria-hidden className="size-5" />
      </Link>
      <p className="mt-3 text-center text-sm text-pedra">A vaga só é ocupada quando você confirma seus dados.</p>
    </div>
  );
}

function Linha({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-pedra">{rotulo}</dt>
      <dd className={`whitespace-nowrap tabular-nums ${destaque ? "font-semibold text-ok" : ""}`}>{valor}</dd>
    </div>
  );
}
