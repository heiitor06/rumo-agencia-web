"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  ViewTransition,
  type CSSProperties,
} from "react";
import { flushSync } from "react-dom";
import type { DestinoConteudo } from "@/content/destinos";
import type { ResumoDestinos } from "@/lib/resumo";
import { ProximaSaida } from "./proxima-saida";

const DURACAO_EXPANSAO = 900;
const INTERVALO_AUTOPLAY = 7000;
const EASE_EXPANSAO = "cubic-bezier(0.7, 0, 0.18, 1)";

type Camada = { indice: number; top: number; left: number; width: number; height: number };

function girar(ordem: number[], passos: number) {
  return [...ordem.slice(passos), ...ordem.slice(0, passos)];
}

const MOVIMENTO_REDUZIDO = "(prefers-reduced-motion: reduce)";

function useMovimentoReduzido() {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(MOVIMENTO_REDUZIDO);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(MOVIMENTO_REDUZIDO).matches,
    () => false,
  );
}

export function HeroSlider({ destinos, resumo }: { destinos: DestinoConteudo[]; resumo: Promise<ResumoDestinos> }) {
  const [ordem, setOrdem] = useState(() => destinos.map((_, i) => i));
  const [camada, setCamada] = useState<Camada | null>(null);
  const [saindo, setSaindo] = useState(false);
  const [entrou, setEntrou] = useState<number[]>([]);
  const [pausado, setPausado] = useState(false);
  const [emFoco, setEmFoco] = useState(false);
  const reduzido = useMovimentoReduzido();

  const heroRef = useRef<HTMLElement>(null);
  const camadaRef = useRef<HTMLDivElement>(null);
  const filaRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef(new Map<number, HTMLLIElement>());
  const animando = useRef(false);
  const pendente = useRef<number | null>(null);

  const ativo = destinos[ordem[0]];
  const posicao = ordem[0];

  const concluir = useCallback(
    (passos: number) => {
      // flushSync: a fila precisa estar na ordem nova antes de cancelar o deslocamento, senão pisca.
      flushSync(() => {
        setOrdem((o) => girar(o, passos));
        setCamada(null);
        setSaindo(false);
        setEntrou(ordem.slice(0, passos));
      });
      filaRef.current?.getAnimations().forEach((a) => a.cancel());
      pendente.current = null;
      animando.current = false;
    },
    [ordem],
  );

  const irPara = useCallback(
    (passos: number) => {
      if (animando.current || passos <= 0 || passos >= destinos.length) return;
      const alvo = ordem[passos];
      const card = cardRefs.current.get(alvo);
      const hero = heroRef.current;
      if (reduzido || !card || !hero) {
        setOrdem((o) => girar(o, passos));
        setEntrou([]);
        return;
      }
      animando.current = true;
      const r = card.getBoundingClientRect();
      const h = hero.getBoundingClientRect();
      pendente.current = passos;
      setSaindo(true);
      setCamada({ indice: alvo, top: r.top - h.top, left: r.left - h.left, width: r.width, height: r.height });

      const passo = card.offsetWidth + parseFloat(getComputedStyle(filaRef.current!).columnGap || "0");
      filaRef.current?.animate([{ transform: "translateX(0)" }, { transform: `translateX(${-passo * passos}px)` }], {
        duration: DURACAO_EXPANSAO * 0.85,
        easing: EASE_EXPANSAO,
        fill: "forwards",
      });
    },
    [destinos.length, ordem, reduzido],
  );

  const voltar = useCallback(() => {
    if (animando.current) return;
    setOrdem((o) => girar(o, o.length - 1));
    setEntrou([]);
  }, []);

  // A camada nasce no lugar do card e cresce até cobrir o hero; só então a ordem gira.
  useLayoutEffect(() => {
    const el = camadaRef.current;
    const hero = heroRef.current;
    if (!camada || !el || !hero || pendente.current === null) return;
    const passos = pendente.current;
    const anim = el.animate(
      [
        { top: `${camada.top}px`, left: `${camada.left}px`, width: `${camada.width}px`, height: `${camada.height}px`, borderRadius: "14px" },
        { top: "0px", left: "0px", width: `${hero.clientWidth}px`, height: `${hero.clientHeight}px`, borderRadius: "0px" },
      ],
      { duration: DURACAO_EXPANSAO, easing: EASE_EXPANSAO, fill: "forwards" },
    );
    anim.finished.then(() => concluir(passos)).catch(() => {});
    return () => anim.cancel();
  }, [camada, concluir]);

  const parado = pausado || emFoco || reduzido;
  useEffect(() => {
    if (parado) return;
    const id = window.setInterval(() => {
      if (!document.hidden) irPara(1);
    }, INTERVALO_AUTOPLAY);
    return () => window.clearInterval(id);
  }, [irPara, parado]);

  const progresso = ((posicao + 1) / destinos.length) * 100;

  return (
    <section
      ref={heroRef}
      data-hero-foto
      aria-roledescription="carrossel"
      aria-label="Destinos em destaque"
      className="relative isolate h-svh min-h-[600px] w-full overflow-hidden bg-noite text-papel"
      onFocusCapture={() => setEmFoco(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setEmFoco(false);
      }}
      onPointerEnter={() => setEmFoco(true)}
      onPointerLeave={() => setEmFoco(false)}
    >
      <ViewTransition name={`destino-${ativo.slug}`} share="morph" default="none">
        <Image
          key={ativo.slug}
          src={ativo.foto}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          fetchPriority="high"
          loading="eager"
          className="-z-20 object-cover"
        />
      </ViewTransition>
      {/* Pré-carrega a foto do próximo destino para a expansão não abrir em branco. */}
      <Image src={destinos[ordem[1]].foto} alt="" fill sizes="100vw" loading="eager" className="invisible -z-30 object-cover" aria-hidden />

      {camada && (
        <div ref={camadaRef} className="absolute -z-10 overflow-hidden" style={{ top: camada.top, left: camada.left, width: camada.width, height: camada.height, borderRadius: 14 }}>
          <Image src={destinos[camada.indice].foto} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      )}

      <div aria-hidden className="veu-hero pointer-events-none absolute inset-0 -z-[5]" />

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col px-5 pt-24 pb-16 sm:px-10 sm:pt-28 lg:px-14 lg:pb-16">
        <div className="grid flex-1 items-end gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
          <div
            key={ativo.slug}
            aria-live="polite"
            className={`max-w-xl transition-[opacity,translate] duration-300 ease-out ${saindo ? "-translate-y-3 opacity-0" : ""}`}
          >
            <p className="hero-linha flex items-center gap-3 text-sm font-medium tracking-wide text-nevoa" style={atraso(0)}>
              <span aria-hidden className="h-px w-8 bg-sol" />
              {ativo.regiao} · {ativo.uf}
            </p>
            <h1 className="mt-4 font-display text-[clamp(3.25rem,9vw,6rem)] font-bold uppercase leading-[0.88] tracking-[-0.01em]">
              {ativo.linhas.map((linha, i) => (
                <span key={linha} className="block overflow-hidden pb-1">
                  <span className="hero-linha block" style={atraso(1 + i)}>
                    {linha}
                  </span>
                </span>
              ))}
            </h1>
            <p className="hero-linha mt-5 max-w-md text-base leading-relaxed text-nevoa sm:text-lg" style={atraso(3)}>
              {ativo.resumo}
            </p>
            <div className="hero-linha mt-7 flex flex-wrap items-center gap-x-6 gap-y-4" style={atraso(4)}>
              <Link
                href={`/destinos/${ativo.slug}`}
                transitionTypes={["nav-forward"]}
                className="botao-sol"
              >
                Ver pacotes
              </Link>
              <Suspense fallback={<span className="h-5 w-56 animate-pulse rounded bg-papel/15" />}>
                <ProximaSaida resumo={resumo} nome={ativo.nome} />
              </Suspense>
            </div>
          </div>

          <div className="relative -mr-5 overflow-hidden sm:-mr-10 lg:-mr-14 lg:self-end lg:pb-16">
            <ul ref={filaRef} className="flex gap-4 pl-1 sm:gap-5" aria-label="Próximos destinos">
              {ordem.slice(1).map((indice, i) => {
                const d = destinos[indice];
                const escondido = camada?.indice === indice;
                return (
                  <li
                    key={d.slug}
                    ref={(el) => {
                      if (el) cardRefs.current.set(indice, el);
                      else cardRefs.current.delete(indice);
                    }}
                    className={`relative shrink-0 ${entrou.includes(indice) ? "card-entra" : ""} ${escondido ? "opacity-0" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => irPara(i + 1)}
                      className="group relative block aspect-[3/4] w-[132px] overflow-hidden rounded-card text-left shadow-card outline-offset-4 sm:w-[180px] lg:w-[min(15vw,232px)]"
                    >
                      <Image src={d.foto} alt="" fill sizes="(min-width:1024px) 232px, 180px" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-noite/85 via-noite/10 to-transparent" />
                      <span className="absolute inset-x-3 bottom-3 block">
                        <span aria-hidden className="mb-2 block h-0.5 w-6 bg-sol" />
                        <span className="block text-xs text-nevoa">{d.uf}</span>
                        <span className="block font-display text-lg font-bold uppercase leading-tight sm:text-xl">{d.nome}</span>
                        <span className="sr-only">: mostrar este destino</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 sm:gap-6">
          <button type="button" onClick={voltar} className="botao-redondo" aria-label="Destino anterior">
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={() => irPara(1)} className="botao-redondo" aria-label="Próximo destino">
            <ChevronRight aria-hidden className="size-5" />
          </button>
          {!reduzido && (
            <button
              type="button"
              onClick={() => setPausado((p) => !p)}
              className="botao-redondo"
              aria-label={pausado ? "Retomar troca automática" : "Pausar troca automática"}
            >
              {pausado ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
            </button>
          )}
          <div className="relative h-0.5 flex-1 bg-papel/25" role="presentation">
            <div className="absolute inset-y-0 left-0 bg-sol transition-[width] duration-700 ease-out" style={{ width: `${progresso}%` }} />
          </div>
          <p className="font-display text-4xl font-bold tabular-nums sm:text-6xl" aria-label={`Destino ${posicao + 1} de ${destinos.length}`}>
            {String(posicao + 1).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}

function atraso(passo: number): CSSProperties {
  return { animationDelay: `${120 + passo * 70}ms` };
}
