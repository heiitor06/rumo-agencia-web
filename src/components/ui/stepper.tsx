"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  valor: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  rotuloId: string;
  /** Nome do campo quando o stepper vai dentro de um <form> com Server Action. */
  name?: string;
};

export function Stepper({ valor, min, max, onChange, rotuloId, name }: Props) {
  return (
    <div role="group" aria-labelledby={rotuloId} className="flex items-center gap-1">
      <button
        type="button"
        className="botao-stepper"
        onClick={() => onChange(Math.max(min, valor - 1))}
        disabled={valor <= min}
        aria-label="Menos um passageiro"
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <output aria-live="polite" className="w-10 text-center font-display text-2xl font-bold tabular-nums">
        {valor}
      </output>
      <button
        type="button"
        className="botao-stepper"
        onClick={() => onChange(Math.min(max, valor + 1))}
        disabled={valor >= max}
        aria-label="Mais um passageiro"
      >
        <Plus aria-hidden className="size-4" />
      </button>
      {name && <input type="hidden" name={name} value={valor} />}
    </div>
  );
}
