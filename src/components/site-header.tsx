"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#destinos", label: "Destinos" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/minha-reserva", label: "Minha reserva" },
];

/**
 * Sem usePathname: o cabeçalho fica transparente quando a página tem um hero com foto
 * ([data-hero-foto], regra em globals.css) e a pessoa ainda não rolou. Assim ele entra no shell estático de toda rota.
 */
export function SiteHeader() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const ouvir = () => setRolou(window.scrollY > 24);
    window.addEventListener("scroll", ouvir, { passive: true });
    return () => window.removeEventListener("scroll", ouvir);
  }, []);

  const fechar = () => setAberto(false);

  return (
    <header style={{ viewTransitionName: "site-header" }} data-rolou={rolou} data-aberto={aberto} className="cabecalho fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:h-20 sm:px-10 lg:px-14">
        <Link href="/" onClick={fechar} transitionTypes={["nav-back"]} className="font-display text-2xl font-bold uppercase tracking-[0.12em]">
          Rumo
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-9 text-[0.95rem] font-medium">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-nav">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 grid size-11 place-items-center md:hidden"
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((a) => !a)}
        >
          {aberto ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
        </button>
      </div>

      {aberto && (
        <nav id="menu-mobile" aria-label="Principal" className="border-t border-linha bg-papel px-5 pb-6 text-tinta md:hidden">
          <ul className="divide-y divide-linha">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={fechar} className="flex min-h-14 items-center font-display text-2xl font-bold uppercase">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
