import type { Metadata } from "next";
import Link from "next/link";
import { TransicaoPagina } from "@/components/transicao-pagina";

export const metadata: Metadata = {
  title: "Como funciona a reserva",
  description:
    "Por dentro da Rumo: vagas contadas em tempo real, nenhuma vaga vendida duas vezes, regras de preço e pagamento em partes.",
};

const BLOCOS = [
  {
    titulo: "A vaga é contada na hora",
    texto:
      "Cada saída tem uma lotação. Quando alguém reserva, as vagas saem da contagem no mesmo instante; quando cancela, voltam. O número que você vê na página é o do sistema no momento em que ela abriu.",
  },
  {
    titulo: "Ninguém compra a mesma vaga",
    texto:
      "Se duas pessoas tentam a última vaga no mesmo segundo, o sistema trava aquela saída enquanto uma reserva é gravada e a outra espera a vez. Foi testado com 20 compras simultâneas disputando 5 vagas: saíram 5 reservas, nenhuma a mais. O banco de dados ainda recusa qualquer vaga negativa, como segunda proteção.",
  },
  {
    titulo: "O preço fica gravado",
    texto:
      "O valor é o preço por pessoa vezes os passageiros, com 10% de desconto a partir de 6 pessoas. Ele é gravado na reserva: se a agência mudar o preço do pacote depois, quem já reservou não é afetado.",
  },
  {
    titulo: "Pagamento em partes",
    texto:
      "PIX e boleto são à vista. Cartão vai até 3x sem taxa e de 4x a 10x com 1,5% por parcela acima da terceira. Dá para pagar um sinal e o resto depois; quando a soma aprovada cobre o total, a reserva vira confirmada sozinha.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <TransicaoPagina>
      <main className="mx-auto max-w-[1600px] px-5 pt-32 pb-24 sm:px-10 lg:px-14 lg:pt-40">
        <h1 className="max-w-4xl font-display text-[clamp(3rem,8vw,6rem)] font-bold uppercase leading-[0.88]">
          Por dentro de uma reserva
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-pedra">
          A vitrine é a parte que se vê. Embaixo dela há um sistema de reservas que cuida para a vaga anunciada existir de
          verdade e o preço não mudar no meio do caminho.
        </p>

        <div className="mt-16 grid gap-x-16 gap-y-14 border-t-2 border-tinta pt-14 md:grid-cols-2">
          {BLOCOS.map((b, i) => (
            <section key={b.titulo} aria-labelledby={`bloco-${i}`}>
              <h2 id={`bloco-${i}`} className="font-display text-4xl font-bold uppercase leading-none">
                {b.titulo}
              </h2>
              <p className="mt-4 max-w-[60ch] text-lg text-pedra">{b.texto}</p>
            </section>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap items-center gap-6 rounded-card bg-noite p-8 text-papel sm:p-12">
          <p className="max-w-xl flex-1 font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
            Quer ver funcionando? Faça uma reserva de teste.
          </p>
          <Link href="/#destinos" transitionTypes={["nav-back"]} className="botao-sol">
            Escolher um destino
          </Link>
        </div>
      </main>
    </TransicaoPagina>
  );
}
