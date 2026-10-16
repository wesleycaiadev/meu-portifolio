"use client";

import { getImageProps, type ImageProps } from "next/image";
import { useCallback } from "react";

type Variant = Pick<ImageProps, "src" | "width" | "height" | "sizes"> & { media: string };

function sourceForWidth(src: string, srcSet: string | undefined, width: number) {
  const candidates = srcSet?.split(", ").map(candidate => {
    const [url, descriptor] = candidate.split(" ");
    return { url, width: Number.parseInt(descriptor ?? "0") };
  });
  return candidates?.find(candidate => candidate.width >= width)?.url ?? candidates?.at(-1)?.url ?? src;
}

// Keep Next's optimized URLs, but own and dispose the resize subscription.
// Native responsive-image listeners retained detached route trees in Edge during
// the repeated-navigation audit. No srcset/sizes listener is registered here.
export function ResponsiveImage({ mobile, ...props }: ImageProps & { mobile?: Variant | undefined }) {
  const { props: { src, srcSet, ...image } } = getImageProps(props);
  const alternate = mobile ? getImageProps({ ...props, ...mobile }).props : undefined;
  const alternateSrc = alternate?.src;
  const alternateSet = alternate?.srcSet;
  const alternateWidth = alternate?.width;
  const alternateHeight = alternate?.height;
  const media = mobile?.media;
  const attach = useCallback((element: HTMLImageElement | null) => {
    if (!element) return;
    const query = media ? matchMedia(media) : undefined;
    const update = () => {
      const useAlternate = query?.matches && alternateSrc;
      const width = useAlternate ? alternateWidth : image.width;
      const height = useAlternate ? alternateHeight : image.height;
      const next = sourceForWidth(useAlternate ? alternateSrc : src, useAlternate ? alternateSet : srcSet,
        Math.ceil(element.getBoundingClientRect().width * devicePixelRatio));
      if (width) element.width = width;
      if (height) element.height = height;
      if (element.getAttribute("src") !== next) element.src = next;
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    query?.addEventListener("change", update);
    update();
    return () => { observer.disconnect(); query?.removeEventListener("change", update); };
  }, [src, srcSet, media, alternateSrc, alternateSet, alternateWidth, alternateHeight, image.width, image.height]);
  // The server fallback is also a real, optimized image, including without JS.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...image} sizes={undefined} alt={image.alt} ref={attach} src={sourceForWidth(src, srcSet, 640)} />;
}
