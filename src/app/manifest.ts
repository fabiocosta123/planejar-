import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Planejamento Financeiro",
    short_name: "Finanças",
    description:
      "Lançamentos do mês e, na versão Pro, o dia do aperto.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f5f8f2",
    theme_color: "#0f6e4c",
    lang: "pt-BR",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
