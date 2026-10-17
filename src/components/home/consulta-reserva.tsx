import { ArrowRight } from "lucide-react";

/** Formulário GET simples: funciona sem JavaScript e cai na página de consulta. */
export function ConsultaReserva({ codigoInicial = "" }: { codigoInicial?: string }) {
  return (
    <form action="/minha-reserva" method="get" className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="codigo-reserva" className="sr-only">
        Código da reserva
      </label>
      <input
        id="codigo-reserva"
        name="codigo"
        required
        defaultValue={codigoInicial}
        autoComplete="off"
        spellCheck={false}
        placeholder="RSV-XXXXXX"
        pattern="[Rr][Ss][Vv]-?[A-Za-z0-9]{4,12}"
        title="O código começa com RSV-, por exemplo RSV-7K2M9Q"
        className="entrada min-h-14 flex-1 font-display text-2xl font-bold uppercase tracking-wider placeholder:font-normal placeholder:tracking-normal"
      />
      <button type="submit" className="botao-sol min-h-14">
        Consultar
        <ArrowRight aria-hidden className="size-5" />
      </button>
    </form>
  );
}
