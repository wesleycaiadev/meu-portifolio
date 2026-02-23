gsap.registerPlugin(ScrollTrigger);

// 1. Setup Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot segue instantaneamente
    if (cursorDot) {
        gsap.set(cursorDot, { x: mouseX, y: mouseY });
    }
});

// Animação suave para o outline
gsap.ticker.add(() => {
    if (cursorOutline) {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        gsap.set(cursorOutline, { x: outlineX, y: outlineY });
    }
});

// Hover Effect no cursor
const interactables = document.querySelectorAll('a, button, .magnetic, .magnetic-text');
interactables.forEach(el => {
    if (cursorOutline) {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    }
});

// 3. Magnetic Effect
const magneticElements = document.querySelectorAll(".magnetic");
magneticElements.forEach(el => {
    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
        gsap.to(el, { x: x, y: y, duration: 0.6, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    });
});

// 4. Preloader & Hero Entrance
const tlStart = gsap.timeline();

tlStart.to(".loader-text", { yPercent: -100, opacity: 0, duration: 1, delay: 0.8, ease: "power4.inOut" })
    .to(".loader-wrapper", { yPercent: -100, duration: 1.2, ease: "expo.inOut" })
    .from(".hero-title", {
        y: 150,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
    }, "-=0.6")
    .from(".hero-subtitle", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=1")
    .from(".hero-image-wrapper", { scale: 0.9, opacity: 0, duration: 1.5, ease: "power3.out" }, "-=1")
    .from(".navbar", { y: -20, opacity: 0, duration: 1 }, "-=1.2");

// 5. Scroll Reveals
const revealElements = document.querySelectorAll(".reveal-up");
revealElements.forEach(el => {
    gsap.fromTo(el,
        { y: 80, opacity: 0 },
        {
            y: 0, opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// 6. Sticky Cards Parallax Effect (Dimming background cards)
const cards = gsap.utils.toArray('.project-card');
cards.forEach((card, i) => {
    if (i !== cards.length - 1) { // Apply to all except the last card
        gsap.to(card, {
            scale: 0.95,
            filter: "brightness(0.4)",
            ease: "none",
            scrollTrigger: {
                trigger: cards[i + 1], // Trigger when the NEXT card comes up
                start: "top bottom",
                end: "top top",
                scrub: true,
            }
        });
    }
});

// 7. Formulário de Contato WhatsApp
const whatsappForm = document.getElementById("whatsapp-form");
if (whatsappForm) {
    whatsappForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !message) return;

        // Número de telefone do WhatsApp (apenas números com o DDI)
        const phoneNumber = "5579998356598";

        // Formata a mensagem
        const textToEnv = `Olá Wesley!\nMeu nome é ${name}.\n\nTrago o seguinte projeto em mente:\n${message}`;
        const encodedText = encodeURIComponent(textToEnv);

        // Redireciona para o WhatsApp
        // const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        // window.open(whatsappUrl, '_blank');
        alert("Mensagem recebida com sucesso! (Funcionalidade offline no momento)");

        // Limpa o formulário
        whatsappForm.reset();
    });
}

// 8. Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Bloqueia scroll do background se lenis definido
        if (typeof lenis !== 'undefined') {
            if (navLinks.classList.contains('active')) {
                lenis.stop();
            } else {
                lenis.start();
            }
        }
    });

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
            if (typeof lenis !== 'undefined') lenis.start();
        });
    });
}