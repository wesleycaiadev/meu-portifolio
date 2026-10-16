import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/siteMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return [];
  return ["/", "/projetos/spasmooth", "/projetos/mf-consultoria"].map(pathname => ({ url: new URL(pathname, siteOrigin).href }));
}
