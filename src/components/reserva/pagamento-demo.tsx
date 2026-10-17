"use client";

import { FlaskConical, LoaderCircle } from "lucide-react";
import { useActionState, useId, useState } from "react";
import { aprovarPagamento, registrarPagamento, type EstadoPagamento } from "@/app/actions";
import { moeda } from "@/lib/format";
import type { FormaPagamento } from "@/lib/types";

type Pendente = { id: number; valor: number; forma: string };

const FORMAS: { valor: FormaPagamento; rotulo: string }[] = [
  { valor: "PIX", rotulo: "PIX" },
  { valor: "BOLETO", rotulo: "Boleto" },
  { valor: "CARTAO", rotulo: "Cartão" },
];

const paraCampo = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function PagamentoDemo({ codigo, saldo, pendentes }: { codigo: string; saldo: number; pendentes: Pendente[] }) {
  return (
    <div className="mt-6 space-y-6">
      <p className="flex items-start gap-3 rounded-card bg-areia px-5 py-4 text-pedra">
        <FlaskConical aria-hidden className="mt-0.5 size-5 shrink-0 text-tinta" />
        <span>
          <strong className="font-semibold text-tinta">Pagamento de demonstração.</strong> Nada é cobrado. Num site real, aqui
          entraria o checkout do banco ou do gateway; a aprovação abaixo faz o papel do aviso que ele mandaria.
        </span>
      </p>
      {pendentes.map((p) => (
        <Aprovar key={p.id} pendente={p} />
      ))}
      {saldo > 0 && <Registrar codigo={codigo} saldo={saldo} />}
    </div>
  );
}

function Aprovar({ pendente }: { pendente: Pendente }) {
  const [estado, acao, enviando] = useActionState<EstadoPagamento, FormData>(aprovarPagamento, {});
  return (
    <form action={acao} className="rounded-card border border-linha bg-white p-5">
      <input type="hidden" name="pagamentoId" value={pendente.id} />
      <p>
        <strong className="font-semibold tabular-nums">{moeda(pendente.valor)}</strong> no {pendente.forma}, aguardando aprovação.
      </p>
      <button type="submit" disabled={enviando} className="botao-contorno mt-4">
        {enviando && <LoaderCircle aria-hidden className="size-5 animate-spin" />}
        Simular aprovação
      </button>
      {estado.erro && (
        <p role="alert" className="erro-campo mt-3">
          {estado.erro}
        </p>
      )}
    </form>
  );
}

function Registrar({ codigo, saldo }: { codigo: string; saldo: number }) {
  const id = useId();
  const [estado, acao, enviando] = useActionState<EstadoPagamento, FormData>(registrarPagamento, {});
  const [forma, setForma] = useState<FormaPagamento>("PIX");

  return (
    <form action={acao} className="space-y-5">
      <input type="hidden" name="codigo" value={codigo} />
      <fieldset>
        <legend className="rotulo">Forma de pagamento</legend>
        <div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-full bg-linha ring-1 ring-linha">
          {FORMAS.map((f) => (
            <label key={f.valor} className="flex min-h-11 cursor-pointer items-center justify-center bg-white text-sm font-semibold has-[:checked]:bg-tinta has-[:checked]:text-papel has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-4 has-[:focus-visible]:outline-sol">
              <input type="radio" name="forma" value={f.valor} checked={forma === f.valor} onChange={() => setForma(f.valor)} className="sr-only" />
              {f.rotulo}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-valor`} className="rotulo">
            Valor (R$)
          </label>
          <input id={`${id}-valor`} name="valor" inputMode="decimal" defaultValue={paraCampo(saldo)} className="entrada tabular-nums" />
          <p className="text-sm text-pedra">Pode ser um sinal. Faltam {moeda(saldo)}.</p>
        </div>
        {forma === "CARTAO" && (
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-parcelas`} className="rotulo">
              Parcelas
            </label>
            <select id={`${id}-parcelas`} name="parcelas" defaultValue={1} className="entrada">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}x {n <= 3 ? "sem taxa" : "com taxa"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {estado.erro && (
        <p role="alert" className="rounded-lg bg-alerta/10 px-4 py-3 font-medium text-alerta">
          {estado.erro}
        </p>
      )}

      <button type="submit" disabled={enviando} className="botao-sol">
        {enviando && <LoaderCircle aria-hidden className="size-5 animate-spin" />}
        Registrar pagamento
      </button>
    </form>
  );
}
