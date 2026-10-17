import type { StaticImageData } from "next/image";
import bonito from "@/assets/destinos/bonito.jpg";
import chapada from "@/assets/destinos/chapada-diamantina.jpg";
import noronha from "@/assets/destinos/fernando-de-noronha.jpg";
import gramado from "@/assets/destinos/gramado.jpg";
import jalapao from "@/assets/destinos/jalapao.jpg";
import lencois from "@/assets/destinos/lencois-maranhenses.jpg";

export type DestinoConteudo = {
  slug: string;
  /** Igual ao nome cadastrado na API: é por ele que o front liga a foto aos pacotes. */
  nome: string;
  /** Quebra do nome no hero, linha a linha. */
  linhas: string[];
  cidade: string;
  uf: string;
  regiao: string;
  resumo: string;
  foto: StaticImageData;
  alt: string;
  credito: { autor: string; url: string };
};

export const destinos: DestinoConteudo[] = [
  {
    slug: "lencois-maranhenses",
    nome: "Lençóis Maranhenses",
    linhas: ["Lençóis", "Maranhenses"],
    cidade: "Barreirinhas",
    uf: "MA",
    regiao: "Maranhão",
    resumo:
      "Dunas brancas a perder de vista e lagoas de água da chuva entre elas, mais cheias de junho a setembro.",
    foto: lencois,
    alt: "Vista aérea de dunas brancas com lagoas azuis ao lado de uma faixa de mata verde nos Lençóis Maranhenses",
    credito: { autor: "Léo Castro", url: "https://unsplash.com/photos/7rZLx5w1Kj0" },
  },
  {
    slug: "chapada-diamantina",
    nome: "Chapada Diamantina",
    linhas: ["Chapada", "Diamantina"],
    cidade: "Lençóis",
    uf: "BA",
    regiao: "Bahia",
    resumo:
      "Chapadões de pedra, cachoeiras e grutas de água azul no coração da Bahia, com trilha para todo fôlego.",
    foto: chapada,
    alt: "Paredões de pedra sobre um vale verde na Chapada Diamantina",
    credito: { autor: "Luiza Braun", url: "https://unsplash.com/photos/bR-lvWBmJQs" },
  },
  {
    slug: "fernando-de-noronha",
    nome: "Fernando de Noronha",
    linhas: ["Fernando", "de Noronha"],
    cidade: "Fernando de Noronha",
    uf: "PE",
    regiao: "Pernambuco",
    resumo:
      "Arquipélago no meio do Atlântico, de mar transparente e com o Morro Dois Irmãos na paisagem.",
    foto: noronha,
    alt: "Praia de areia dourada entre rochas escuras, com dois morros pontudos ao fundo, em Fernando de Noronha",
    credito: { autor: "Allan Rodrigues", url: "https://unsplash.com/photos/20HcuRSRK14" },
  },
  {
    slug: "bonito",
    nome: "Bonito",
    linhas: ["Bonito"],
    cidade: "Bonito",
    uf: "MS",
    regiao: "Mato Grosso do Sul",
    resumo:
      "Rios tão transparentes que dá para flutuar vendo os peixes, além de grutas e cachoeiras na Serra da Bodoquena.",
    foto: bonito,
    alt: "Rio de água cristalina com plantas no fundo, metade da foto acima e metade abaixo da água, em Bonito",
    credito: { autor: "Azzedine Rouichi", url: "https://unsplash.com/photos/cZ3k8ZEcA-U" },
  },
  {
    slug: "jalapao",
    nome: "Jalapão",
    linhas: ["Jalapão"],
    cidade: "Mateiros",
    uf: "TO",
    regiao: "Tocantins",
    resumo:
      "Dunas douradas, cachoeiras e fervedouros, os poços de água que brota do chão e não deixa ninguém afundar.",
    foto: jalapao,
    alt: "Poço de água verde-clara cercado de vegetação no Jalapão",
    credito: { autor: "Charles Betito Filho", url: "https://unsplash.com/photos/F9vf_wOJOYA" },
  },
  {
    slug: "gramado",
    nome: "Gramado",
    linhas: ["Gramado"],
    cidade: "Gramado",
    uf: "RS",
    regiao: "Rio Grande do Sul",
    resumo:
      "Serra gaúcha de clima frio, arquitetura de pedra e madeira e uma cidade inteira iluminada no fim do ano.",
    foto: gramado,
    alt: "Igreja de pedra iluminada à noite, com decoração de Natal na praça em frente, em Gramado",
    credito: { autor: "Edson Junior", url: "https://unsplash.com/photos/CWGGSi5FEhc" },
  },
];

export const destinoPorSlug = (slug: string) => destinos.find((d) => d.slug === slug);
export const destinoPorNome = (nome: string) => destinos.find((d) => d.nome === nome);
