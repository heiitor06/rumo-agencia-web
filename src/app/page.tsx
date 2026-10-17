import { ArrowRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import { BuscaSaidas } from "@/components/home/busca-saidas";
import { ConsultaReserva } from "@/components/home/consulta-reserva";
import { HeroSlider } from "@/components/home/hero-slider";
import { MosaicoDestinos } from "@/components/home/mosaico-destinos";
import { TransicaoPagina } from "@/components/transicao-pagina";
import { destinos } from "@/content/destinos";
import { resumoDestinos } from "@/lib/resumo";
import { SITE_URL } from "@/lib/site";

const PASSOS = [
  {
    titulo: "Escolha a saída",
    texto: "Cada pacote mostra as datas abertas e quantas vagas restam em cada uma, contadas na hora.",
  },
  {
    titulo: "Veja o preço fechado",
    texto: "Passageiros, forma de pagamento e parcelas entram na conta antes de você reservar. Grupo de 6 ou mais ganha 10%.",
  },
  {
    titulo: "Reserve a vaga",
    texto: "A vaga sai da contagem no momento da reserva e você recebe um código para acompanhar tudo.",
  },
  {
    titulo: "Pague como preferir",
    texto: "PIX, boleto ou cartão em até 10x. Dá para pagar um sinal agora e o restante depois.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Rumo",
  url: SITE_URL,
  description: "Agência fictícia de demonstração com pacotes para destinos brasileiros.",
  areaServed: "BR",
};

export default function Home() {
  const resumo = resumoDestinos();

  return (
    <TransicaoPagina>
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <HeroSlider destinos={destinos} resumo={resumo} />

        <section aria-labelledby="busca-titulo" className="relative z-10 mx-auto -mt-8 max-w-[1600px] px-5 sm:px-10 lg:px-14">
          <h2 id="busca-titulo" className="sr-only">
            Buscar saídas
          </h2>
          <BuscaSaidas destinos={destinos.map(({ slug, nome, uf }) => ({ slug, nome, uf }))} resumo={resumo} />
          <p className="mt-4 flex items-start gap-2 text-[0.95rem] text-pedra">
            <FlaskConical aria-hidden className="mt-0.5 size-4 shrink-0 text-tinta" />
            <span>
              <strong className="font-semibold text-tinta">Projeto de demonstração.</strong> A Rumo é uma agência fictícia: as vagas
              e reservas funcionam num sistema de teste e nenhum pagamento é cobrado.
            </span>
          </p>
        </section>

        <section id="destinos" aria-labelledby="destinos-titulo" className="mx-auto max-w-[1600px] px-5 pt-24 pb-24 sm:px-10 lg:px-14 lg:pt-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="destinos-titulo" className="max-w-2xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold uppercase leading-[0.92]">
              Seis Brasis para escolher
            </h2>
            <p className="max-w-md text-lg text-pedra">
              Do litoral do Maranhão à serra gaúcha. Toda data e toda vaga abaixo vêm do sistema de reservas agora.
            </p>
          </div>
          <MosaicoDestinos resumo={resumo} />
        </section>

        <section aria-labelledby="passos-titulo" className="bg-areia">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 lg:px-14 lg:py-32">
            <h2 id="passos-titulo" className="max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold uppercase leading-[0.92]">
              Da vontade à vaga em quatro passos
            </h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {PASSOS.map((p, i) => (
                <li key={p.titulo} className="relative border-t-2 border-tinta pt-10">
                  <span className="absolute -top-5 left-0 grid size-10 place-items-center rounded-full border-2 border-tinta bg-sol font-display text-xl font-bold tabular-nums">
                    <span className="sr-only">Passo </span>
                    {i + 1}
                  </span>
                  <h3 className="font-display text-3xl font-bold uppercase leading-none">{p.titulo}</h3>
                  <p className="mt-4 max-w-[34ch] text-pedra">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="prova-titulo" className="bg-noite text-papel">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-24 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:px-14 lg:py-32">
            <h2 id="prova-titulo" className="font-display text-[clamp(2.75rem,7vw,6rem)] font-bold uppercase leading-[0.88]">
              Vaga que aparece é vaga que <span className="text-sol">existe</span>
            </h2>
            <div className="max-w-xl text-lg text-nevoa">
              <p>
                Quando duas pessoas tentam a última vaga no mesmo segundo, só uma leva. O sistema trava a saída durante cada
                reserva, e isso foi testado com 20 compras simultâneas disputando 5 vagas: saíram exatamente 5 reservas.
              </p>
              <Link href="/como-funciona" transitionTypes={["nav-forward"]} className="mt-8 inline-flex items-center gap-2 font-display text-xl font-bold uppercase text-sol hover:underline">
                Como funciona por dentro
                <ArrowRight aria-hidden className="size-5" />
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="consulta-titulo" className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 id="consulta-titulo" className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold uppercase leading-[0.92]">
                Já reservou?
              </h2>
              <p className="mt-3 max-w-md text-lg text-pedra">
                Digite o código que você recebeu para ver o status, os pagamentos e o saldo da sua viagem.
              </p>
            </div>
            <ConsultaReserva />
          </div>
        </section>
      </main>
    </TransicaoPagina>
  );
}
