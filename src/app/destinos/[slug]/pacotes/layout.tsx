import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DestinoHero } from "@/components/destino/destino-hero";
import { destinoPorSlug } from "@/content/destinos";

// A faixa com a foto fica no layout e depende só do slug (conteúdo local, sem API).
// Os links para o pacote usam prefetch completo, então ela chega pronta na navegação
// e a foto do destino "voa" da página anterior até aqui.
export default function PacotesLayout({ children, params }: LayoutProps<"/destinos/[slug]/pacotes">) {
  return (
    <>
      <Suspense fallback={<div data-hero-foto className="min-h-[44svh] bg-noite" />}>
        {params.then(({ slug }) => (
          <Faixa slug={slug} />
        ))}
      </Suspense>
      {children}
    </>
  );
}

function Faixa({ slug }: { slug: string }) {
  const destino = destinoPorSlug(slug);
  if (!destino) notFound();
  return (
    <DestinoHero destino={destino} tamanho="faixa" voltar={{ href: `/destinos/${destino.slug}`, rotulo: `Pacotes para ${destino.nome}` }}>
      <p className="mt-6 font-display text-[clamp(2.5rem,7vw,5rem)] font-bold uppercase leading-[0.88]">{destino.nome}</p>
      <p className="mt-2 text-nevoa">
        {destino.cidade} · {destino.uf}
      </p>
    </DestinoHero>
  );
}
