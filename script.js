gsap.registerPlugin(ScrollTrigger);

// Scroll suave com Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Cursor magnetic effect
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

// Componente Pulsante (Pill)
if (document.querySelector(".availability-pill .dot")) {
    gsap.to(".availability-pill .dot", { opacity: 0.2, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
}

// Hero Entrance Animations
function splitTextToSpans(selector) {
    document.querySelectorAll(selector).forEach(el => {
        const text = el.innerText;
        el.innerHTML = text.split('').map(char => 
            char === ' ' ? '&nbsp;' : `<span class="char" style="display:inline-block">${char}</span>`
        ).join('');
    });
}

// Timeline Mestre do Hero
function initHeroTimeline() {
    splitTextToSpans('.h1-line');
    
    // Libera a rolagem natural 
    if (typeof lenis !== 'undefined') lenis.start();

    const tlStart = gsap.timeline();
    
    // 1(Label) -> 2(H1-L1) -> 3(H1-L2,L3) -> 4(Subtitle & Actions) + Foto simultanea
    tlStart.fromTo(".hero-label", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)
    .fromTo(".h1-line:not(.italic-accent) .char", { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: "power3.out" }, "-=0.2")
    .fromTo(".h1-line.italic-accent .char", { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: "power3.out" }, "-=0.2")
    .fromTo(".hero-image-wrapper", { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.2)
    .fromTo(".hero-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4")
    .fromTo(".hero-actions", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }, "-=0.2")
    .fromTo(".navbar", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0)
    .add(() => {
        gsap.to(".hero-photo", {y: -10, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut"});
    }, "-=0.2");
}

/* Lógica Férrea do Preloader */
/* Lógica do Premium Loader */
let isLoaded = false;
const loader = document.getElementById("premium-loader");

function esconderLoading() {
    if (isLoaded || !loader) return;
    isLoaded = true;
    
    loader.classList.add("loader-hidden");
    
    // Pequeno delay para a animação de fade-out do CSS terminar
    setTimeout(() => {
        loader.style.display = 'none';
        initHeroTimeline();
    }, 800);
}

// Timeout de Segurança (2.2s da barra + margem)
setTimeout(esconderLoading, 2500);

// Gatilho no Load Real
window.addEventListener('load', () => {
    // Garantimos que a barra teve tempo de mostrar movimento
    setTimeout(esconderLoading, 2200); 
});

// Trava o scroll 
if (typeof lenis !== 'undefined') lenis.stop();

// 5. Scroll Reveals
// Reveal global base para elementos avulsos
const revealElements = document.querySelectorAll(".reveal-up:not(.about-text-content, .skills-card, .contact-form)");
revealElements.forEach(el => {
    gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
            y: 0, opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Staggers definidos
const staggerGroups = [
    { container: ".about-text-content", elements: "p" },
    { container: ".skills-card", elements: ".tech-master, .tech-tool" },
    { container: ".projects-wrapper", elements: ".project-card" },
    { container: ".contact-form-wrapper", elements: ".input-group, .btn-submit" }
];

staggerGroups.forEach(group => {
    const container = document.querySelector(group.container);
    if (!container) return;
    const items = container.querySelectorAll(group.elements);
    if (items.length === 0) return;

    gsap.fromTo(items,
        { y: 40, opacity: 0 },
        {
            y: 0, opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Efeito de parallax e dimming nos cards de projeto
const cards = gsap.utils.toArray('.project-card');
cards.forEach((card, i) => {
    if (i !== cards.length - 1) { // Apply to all except the last card
        gsap.to(card, {
            scale: 0.95,
            filter: "brightness(0.5)", // Fica um pouco mais claro do que 0.4 na sua versão mais escura
            ease: "none",
            scrollTrigger: {
                trigger: cards[i + 1], // Trigger when the NEXT card comes up
                start: "top 75%", // Só começa a escurecer quando o próximo card subir consideravelmente
                end: "top 20%",
                scrub: true,
            }
        });
    }
});

// Envio via WhatsApp
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
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');

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

// ==========================================
// 8. PROJECT MODAL (NOVO MODAL DE PROJECTOS)
// ==========================================
window.openProjectModal = function(element) {
    // 1. Coleta os dados embutidos na tag
    const title = element.getAttribute('data-title');
    const desc = element.getAttribute('data-desc');
    const liveLink = element.getAttribute('data-live');
    const codeLink = element.getAttribute('data-code');

    // 2. Acopla os dados na DOM
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = desc;
    
    // Configura botões dinamicamente
    const liveBtn = document.getElementById('modalLiveBtn');
    const codeBtn = document.getElementById('modalCodeBtn');
    
    if(liveLink && liveLink !== "#") {
        liveBtn.href = liveLink;
        liveBtn.style.display = "inline-flex";
    } else {
        liveBtn.style.display = "none";
    }

    if(codeLink && codeLink !== "#") {
        codeBtn.href = codeLink;
        codeBtn.style.display = "inline-flex";
    } else {
        codeBtn.style.display = "none";
    }

    // 3. Abre o modal e trava scroll nativo por baixo
    const modal = document.getElementById('projectModal');
    modal.classList.add('active');
    
    if (typeof lenis !== 'undefined') lenis.stop();
};

window.closeProjectModal = function(event, force = false) {
    // Só fecha se clicar explicitamente no X ou no overlay esfumaçado
    if (force || event.target.id === 'projectModal') {
        const modal = document.getElementById('projectModal');
        modal.classList.remove('active');
        
        // Destrava scroll da tela de trás
        if (typeof lenis !== 'undefined') lenis.start();
    }
};

// Escutar fechamento rápido pela tecla Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('projectModal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            if (typeof lenis !== 'undefined') lenis.start();
        }
    }
});