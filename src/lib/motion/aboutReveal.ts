import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function createAboutReveal(section: HTMLElement) {
  const heading = section.querySelector<HTMLElement>("[data-about-heading]");
  const emphasis = section.querySelector<HTMLElement>("[data-about-emphasis]");
  const description = section.querySelector<HTMLElement>("[data-about-description]");
  const portrait = section.querySelector<HTMLElement>("[data-about-portrait]");
  const image = section.querySelector<HTMLImageElement>("[data-about-image]");
  if (!heading || !emphasis || !description || !portrait || !image) return () => {};

  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add({ desktop: "(min-width: 64rem)", stacked: "(max-width: 63.999rem)" }, context => {
    const desktop = Boolean(context.conditions?.desktop);
    gsap.timeline({
      scrollTrigger: {
        id: "about-copy", trigger: section, start: "top 82%",
        end: desktop ? "top 54%" : "top 50%", scrub: true,
        invalidateOnRefresh: true,
      },
    })
      .fromTo(heading, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" }, 0)
      .fromTo(emphasis, { opacity: 0.4 }, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0.15)
      .fromTo(description, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power2.out" }, 0.2);

    const reveal = gsap.timeline({
      onUpdate: () => {
        const progress = reveal.progress();
        section.dataset.aboutProgress = String(progress);
        // Remove the filter at the endpoint; reverse scrubbing restores the blur.
        if (progress === 1) image.style.filter = "none";
        const moving = progress > 0 && progress < 1;
        image.style.willChange = moving ? "transform, filter" : "";
        portrait.style.willChange = moving ? "clip-path" : "";
      },
      scrollTrigger: {
        id: "about-portrait", trigger: desktop ? section : portrait,
        start: desktop ? "top 76%" : "top 90%",
        end: desktop ? "top top" : "top 40%", scrub: true,
        invalidateOnRefresh: true,
        onRefresh: trigger => {
          section.dataset.aboutStart = String(trigger.start);
          section.dataset.aboutEnd = String(trigger.end);
        },
      },
    });
    reveal
      .fromTo(portrait, { clipPath: "inset(10% 6% 14% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, 0)
      .fromTo(image, { y: desktop ? 32 : 24, scale: 1.045 }, { y: 0, scale: 1, duration: 1, ease: "power2.out" }, 0)
      .fromTo(image, { filter: "blur(20px)" }, { filter: "blur(12px)", duration: 0.3, ease: "sine.inOut" }, 0)
      .to(image, { filter: "blur(5px)", duration: 0.35, ease: "sine.inOut" }, 0.3)
      .to(image, { filter: "blur(0px)", duration: 0.35, ease: "power2.out" }, 0.65);

    // Refresh accounts for the preceding Hero's asynchronous pin setup.
    ScrollTrigger.refresh();
    return () => {
      image.style.willChange = "";
      portrait.style.willChange = "";
      for (const name of ["aboutProgress", "aboutStart", "aboutEnd"]) delete section.dataset[name];
    };
  }, section);

  return () => media.revert();
}
