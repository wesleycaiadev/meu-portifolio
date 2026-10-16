import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/siteMetadata";

export default function robots(): MetadataRoute.Robots {
  if (!siteOrigin) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/playground" }, sitemap: new URL("/sitemap.xml", siteOrigin).href };
}
