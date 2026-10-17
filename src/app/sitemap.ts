import type { MetadataRoute } from "next";
import { destinos } from "@/content/destinos";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...destinos.map((d) => ({ url: `${SITE_URL}/destinos/${d.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    { url: `${SITE_URL}/como-funciona`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/minha-reserva`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
