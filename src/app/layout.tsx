import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rumo · Viagens pelo Brasil com vaga garantida",
    template: "%s · Rumo",
  },
  description:
    "Pacotes para Lençóis Maranhenses, Chapada Diamantina, Noronha, Bonito, Jalapão e Gramado, com datas, vagas e preços em tempo real. Projeto de demonstração.",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Rumo" },
};

export const viewport: Viewport = { themeColor: "#0e0c0a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-sol focus:px-5 focus:py-3 focus:font-semibold"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <div id="conteudo" className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
