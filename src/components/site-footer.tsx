import Link from "next/link";
import { destinos } from "@/content/destinos";

export function SiteFooter() {
  return (
    <footer className="bg-noite text-papel">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 sm:px-10 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-14">
        <div>
          <p className="font-display text-4xl font-bold uppercase tracking-[0.12em]">Rumo</p>
          <p className="mt-4 max-w-sm text-nevoa">
            Pacotes para destinos brasileiros, com data de saída, vaga e preço vindos direto do sistema de reservas.
          </p>
          <p className="mt-6 max-w-sm border-t border-papel/15 pt-4 text-sm text-nevoa">
            Projeto de demonstração. A Rumo é uma agência fictícia: nenhuma viagem é vendida e nenhum pagamento é cobrado.
          </p>
        </div>

        <nav aria-label="Destinos">
          <h2 className="font-display text-lg font-bold uppercase tracking-wider text-sol">Destinos</h2>
          <ul className="mt-4 space-y-2">
            {destinos.map((d) => (
              <li key={d.slug}>
                <Link href={`/destinos/${d.slug}`} className="link-claro">
                  {d.nome}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-wider text-sol">A Rumo</h2>
          <ul className="mt-4 space-y-2">
            <li><Link href="/como-funciona" className="link-claro">Como funciona a reserva</Link></li>
            <li><Link href="/minha-reserva" className="link-claro">Consultar minha reserva</Link></li>
            <li><Link href="/privacidade" className="link-claro">Privacidade</Link></li>
          </ul>
          <h2 className="mt-8 font-display text-lg font-bold uppercase tracking-wider text-sol">Fotos</h2>
          <p className="mt-3 text-sm leading-relaxed text-nevoa">
            Unsplash:{" "}
            {destinos.map((d, i) => (
              <span key={d.slug}>
                <a href={d.credito.url} className="link-claro" rel="noopener noreferrer" target="_blank">
                  {d.credito.autor}
                </a>
                {i < destinos.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
