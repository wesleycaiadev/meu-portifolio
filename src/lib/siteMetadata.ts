import type { Metadata } from "next";

// Set only after Wesley confirms the public origin. Never infer it from requests
// or use localhost/a hosting preview as the portfolio's canonical domain.
function confirmedOrigin(): URL | undefined {
  const value = process.env.SITE_URL?.trim();
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return;
    return url;
  } catch { return; }
}

export const siteOrigin = confirmedOrigin();

export function portfolioMetadata(title: string, description: string, pathname: string, image?: string): Metadata {
  return {
    title, description,
    ...(siteOrigin ? { metadataBase: siteOrigin, alternates: { canonical: pathname } } : {}),
    robots: { index: !!siteOrigin, follow: !!siteOrigin },
    openGraph: {
      title, description, siteName: "Wesley Caiã", locale: "pt_BR", type: "website",
      ...(siteOrigin ? { url: pathname, ...(image ? { images: [{ url: image, alt: title }] } : {}) } : {}),
    },
    twitter: { card: siteOrigin && image ? "summary_large_image" : "summary", title, description,
      ...(siteOrigin && image ? { images: [image] } : {}) },
  };
}
