import type { Metadata } from "next";
import { TransicaoPagina } from "@/components/transicao-pagina";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Como a Rumo (projeto de demonstração) trata os dados informados na reserva.",
};

export default function PrivacidadePage() {
  return (
    <TransicaoPagina>
      <main className="mx-auto max-w-[760px] px-5 pt-32 pb-24 sm:px-10 lg:pt-40">
        <h1 className="font-display text-[clamp(2.75rem,7vw,4.5rem)] font-bold uppercase leading-[0.9]">Privacidade</h1>
        <p className="mt-6 rounded-card bg-areia px-5 py-4 text-pedra">
          Rascunho para um projeto de demonstração. Antes de qualquer uso real, este texto precisa ser revisado por quem
          responde juridicamente pela agência.
        </p>
        <div className="mt-10 space-y-8 text-lg text-pedra [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-tinta [&_h2]:uppercase">
          <section>
            <h2>O que pedimos</h2>
            <p className="mt-3">Nome, CPF, e-mail e celular de quem faz a reserva.</p>
          </section>
          <section>
            <h2>Para que serve</h2>
            <p className="mt-3">
              Só para criar a reserva, identificar quem é o titular e entrar em contato sobre a viagem. Não usamos esses dados
              para publicidade e não os vendemos.
            </p>
          </section>
          <section>
            <h2>O que aparece depois</h2>
            <p className="mt-3">
              O CPF nunca volta inteiro nas respostas do sistema: só os dígitos do meio aparecem, mascarados. A página da reserva
              mostra o nome do titular para quem tiver o código.
            </p>
          </section>
          <section>
            <h2>Cookies e rastreamento</h2>
            <p className="mt-3">Este site não usa cookies de publicidade, pixels nem ferramentas de análise de visitas.</p>
          </section>
          <section>
            <h2>Neste ambiente de demonstração</h2>
            <p className="mt-3">
              Nenhuma viagem é vendida e nenhum valor é cobrado. Se você testar a reserva, use dados fictícios: o CPF precisa
              apenas ter os dígitos válidos.
            </p>
          </section>
        </div>
      </main>
    </TransicaoPagina>
  );
}
