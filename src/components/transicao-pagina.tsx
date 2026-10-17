import { ViewTransition, type ReactNode } from "react";

const DIRECOES = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" } as const;

/** Envolve o conteúdo de cada page.tsx: desliza para a esquerda ao avançar e para a direita ao voltar. */
export function TransicaoPagina({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={DIRECOES} exit={DIRECOES} default="none">
      {children}
    </ViewTransition>
  );
}
