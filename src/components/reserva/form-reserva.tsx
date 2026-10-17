"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { reservar, type EstadoReserva } from "@/app/actions";
import { formatarCpf, formatarTelefone } from "@/lib/cpf";
import { plural } from "@/lib/format";

export function FormReserva({ saidaId, pax }: { saidaId: number; pax: number }) {
  const [estado, acao, enviando] = useActionState<EstadoReserva, FormData>(reservar, {});
  const [cpf, setCpf] = useState("");
  const [tel, setTel] = useState("");
  const v = estado.valores ?? {};
  const e = estado.campos ?? {};

  return (
    <form action={acao} noValidate className="mt-10 max-w-xl space-y-6">
      <input type="hidden" name="saidaId" value={saidaId} />
      <input type="hidden" name="pax" value={pax} />

      <Campo id="nome" rotulo="Nome completo" erro={e.nome}>
        <input id="nome" name="nome" autoComplete="name" required defaultValue={v.nome} aria-invalid={!!e.nome} aria-describedby={e.nome ? "nome-erro" : undefined} className="entrada" />
      </Campo>

      <Campo id="documento" rotulo="CPF" erro={e.documento}>
        <input
          id="documento"
          name="documento"
          inputMode="numeric"
          autoComplete="off"
          required
          value={cpf}
          onChange={(ev) => setCpf(formatarCpf(ev.target.value))}
          placeholder="000.000.000-00"
          aria-invalid={!!e.documento}
          aria-describedby={e.documento ? "documento-erro" : undefined}
          className="entrada"
        />
      </Campo>

      <div className="grid gap-6 sm:grid-cols-2">
        <Campo id="email" rotulo="E-mail" erro={e.email}>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} aria-invalid={!!e.email} aria-describedby={e.email ? "email-erro" : undefined} className="entrada" />
        </Campo>
        <Campo id="telefone" rotulo="Celular com DDD" erro={e.telefone}>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required
            value={tel}
            onChange={(ev) => setTel(formatarTelefone(ev.target.value))}
            placeholder="(11) 90000-0000"
            aria-invalid={!!e.telefone}
            aria-describedby={e.telefone ? "telefone-erro" : undefined}
            className="entrada"
          />
        </Campo>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-pedra">
          <input type="checkbox" name="consentimento" className="mt-1 size-5 shrink-0 accent-tinta" aria-invalid={!!e.consentimento} aria-describedby={e.consentimento ? "consentimento-erro" : undefined} />
          <span>
            Autorizo o uso desses dados só para criar e acompanhar esta reserva, como descrito na{" "}
            <Link href="/privacidade" className="link-texto text-tinta">
              política de privacidade
            </Link>
            .
          </span>
        </label>
        {e.consentimento && (
          <p id="consentimento-erro" className="erro-campo mt-2">
            {e.consentimento}
          </p>
        )}
      </div>

      {estado.erro && (
        <p role="alert" className="rounded-lg bg-alerta/10 px-4 py-3 font-medium text-alerta">
          {estado.erro}
        </p>
      )}

      <button type="submit" disabled={enviando} className="botao-sol w-full sm:w-auto">
        {enviando ? (
          <>
            <LoaderCircle aria-hidden className="size-5 animate-spin" />
            Reservando
          </>
        ) : (
          `Reservar ${plural(pax, "vaga", "vagas")}`
        )}
      </button>
    </form>
  );
}

function Campo({ id, rotulo, erro, children }: { id: string; rotulo: string; erro?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="rotulo">
        {rotulo}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="erro-campo">
          {erro}
        </p>
      )}
    </div>
  );
}
