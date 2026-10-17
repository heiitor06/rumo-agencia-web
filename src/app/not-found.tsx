import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-[1600px] flex-col justify-center px-5 pt-28 pb-20 sm:px-10 lg:px-14">
      <p className="font-display text-[clamp(6rem,22vw,16rem)] font-bold leading-none text-areia" aria-hidden>
        404
      </p>
      <h1 className="-mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold uppercase leading-[0.9]">
        Essa estrada não leva a lugar nenhum
      </h1>
      <p className="mt-4 max-w-lg text-lg text-pedra">A página que você procurou não existe ou mudou de endereço.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/" className="botao-sol">
          Ir para o início
        </Link>
        <Link href="/minha-reserva" className="botao-contorno">
          Consultar reserva
        </Link>
      </div>
    </main>
  );
}
