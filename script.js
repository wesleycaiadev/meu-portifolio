gsap.registerPlugin(ScrollTrigger);

/* =========================================
   PROJECT DATA (centralized)
   ========================================= */
const PROJECTS = {
    fokus: {
        title: 'Fokus',
        desc: 'Um Pomodoro Timer inteligente construído completamente com Vanilla JS e CSS puro, focado em ajudar desenvolvedores a otimizarem seus ciclos de tempo.<br><br><b>Construção & Arquitetura:</b> A aplicação simula um ambiente de sistema nativo utilizando <b>LocalStorage</b> de forma avançada para persistência de dados. Toda a manipulação do DOM e a reatividade do timer foram projetadas zero amarras a frameworks, garantindo performance bruta e evitando repaints desnecessários no motor do navegador.<br><br>A interface utiliza variáveis de CSS e regras de cálculo nativas para animações fluidas, pronto para ser evoluído até uma comunicação com banco de dados remoto no futuro.',
        code: 'https://github.com/wesleycaiadev/fokus-projeto',
        live: 'https://wesleycaiadev.github.io/fokus-projeto/'
    },
    spasmooth: {
        title: 'SpaSmooth',
        desc: 'Landing page promocional de altíssima conversão focada no nicho wellness e luxo.<br><br><b>Estrutura e Tecnologias:</b> Guiada sobre os mais modernos fundamentos de CSS Grid fluido e layouts assimétricos, a página alcança pontuações altíssimas de aprovação de acessibilidade e Core Web Vitals (cravado perto do 100).<br><br>As micro-interações do usuário com JavaScript otimizado visam nutrir a relação com o cliente. O esqueleto modular da plataforma foi desenhado visualizando uma evolução posterior (SaaS), pronta para integrar um sistema Back-end de agendamentos reais em Node/Python e banco de dados isolado com controle de acesso de funcionários e métricas do Spa.',
        code: 'https://github.com/wesleycaiadev/spasmooth-landing',
        live: 'https://spasmooth.com.br'
    },
    opencell: {
        title: 'Vistoriador OpenCell',
        desc: 'O Vistoriador OpenCell é um PWA (Progressive Web App) desenvolvido exclusivamente para o ecossistema técnico do Samsung Smart Center. Ele automatiza o fluxo de inspeção de painéis de TV, substituindo formulários manuais por uma interface ágil e à prova de falhas.<br><br><b>Engenharia e Recursos:</b> A aplicação utiliza <b>Local Storage</b> e <b>Service Workers</b> para garantir operação 100% offline dentro de fábricas e centros logísticos. O sistema conta com um dashboard integrativo que processa diagnósticos técnicos em tempo real, permitindo a classificação imediata de aprovação ou defeito das peças. A arquitetura foi construída para ser extremamente leve, focando no desempenho mobile sob condições de rede instáveis, mantendo um design premium e industrial.',
        code: 'https://github.com/wesleycaiadev/vistoriador-opencell',
        live: 'https://vistoriador-opencell.vercel.app/'
    },
    vgtech: {
        title: 'VgTech',
        desc: 'Desenvolvimento de uma interface digital de alta performance para o laboratório avançado VgTech. O foco do projeto foi traduzir a expertise técnica da marca em reparos de dispositivos para o ambiente web.<br><br><b>Design & Conversão:</b> A estética imersiva com highlights em azul ciano foi estruturada deliberadamente para direcionar a atenção do usuário à ação primária: o atendimento humanizado via WhatsApp. O layout responsivo em grid segue princípios modernos de design conversion-driven (focado em conversão), simplificando a jornada do cliente e passando autoridade logo na primeira rolagem.',
        code: 'https://github.com/wesleycaiadev/VG-TECH',
        live: 'https://vg-tech.vercel.app/'
    }
};

/* =========================================
   SMOOTH SCROLL (Lenis)
   ========================================= */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* =========================================
   MAGNETIC EFFECT (enhanced — scale + stronger pull)
   ========================================= */
document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
        gsap.to(el, { x, y, scale: 1.04, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    });
});

/* =========================================
   HERO ANIMATIONS
   ========================================= */
function splitTextToSpans(selector) {
    document.querySelectorAll(selector).forEach(el => {
        const text = el.innerText;
        el.innerHTML = text.split('').map(char =>
            char === ' ' ? '&nbsp;' : `<span class="char" style="display:inline-block">${char}</span>`
        ).join('');
    });
}

function initHeroTimeline() {
    splitTextToSpans('.h1-line');
    if (typeof lenis !== 'undefined') lenis.start();

    const tl = gsap.timeline();

    tl.fromTo('.hero-label', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
      .fromTo('.h1-line:not(.italic-accent) .char', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: 'power3.out' }, '-=0.2')
      .fromTo('.h1-line.italic-accent .char', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: 'power3.out' }, '-=0.2')
      .fromTo('.hero-image-wrapper', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.2)
      .fromTo('.hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo('.hero-actions', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, '-=0.2')
      .fromTo('.navbar', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0)
      .add(() => {
          gsap.to('.hero-photo', { y: -6, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }, '-=0.2');
}

/* =========================================
   PRELOADER
   ========================================= */
let isLoaded = false;
const loader = document.getElementById('premium-loader');

function esconderLoading() {
    if (isLoaded || !loader) return;
    isLoaded = true;
    loader.classList.add('loader-hidden');
    setTimeout(() => {
        loader.style.display = 'none';
        initHeroTimeline();
    }, 800);
}

setTimeout(esconderLoading, 2500);
window.addEventListener('load', () => { setTimeout(esconderLoading, 2200); });
if (typeof lenis !== 'undefined') lenis.stop();

/* =========================================
   SCROLL REVEALS (varied & sophisticated)
   ========================================= */

// Generic reveal for misc .reveal-up elements
document.querySelectorAll('.reveal-up').forEach(el => {
    if (el.classList.contains('about-text-card') ||
        el.classList.contains('skills-card') ||
        el.classList.contains('contact-section') ||
        el.classList.contains('section-header')) return;

    gsap.fromTo(el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
    );
});

// Section headers: scale entrance (premium feel)
document.querySelectorAll('.section-header').forEach(el => {
    gsap.fromTo(el,
        { scale: 0.88, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        }
    );
});

// About text card: slide from left
const aboutText = document.querySelector('.about-text-card');
if (aboutText) {
    gsap.fromTo(aboutText,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: aboutText, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
    );
}

// Skills card: slide from right
const skillsCard = document.querySelector('.skills-card');
if (skillsCard) {
    gsap.fromTo(skillsCard,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: skillsCard, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
    );
}

// Tech pills: bounce-in stagger
if (skillsCard) {
    const techItems = skillsCard.querySelectorAll('.tech-master, .tech-tool');
    if (techItems.length > 0) {
        gsap.fromTo(techItems,
            { y: 20, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.7)',
              scrollTrigger: { trigger: skillsCard, start: 'top 80%', toggleActions: 'play none none reverse' }
            }
        );
    }
}

// About text paragraphs: stagger
const aboutContent = document.querySelector('.about-text-content');
if (aboutContent) {
    gsap.fromTo(aboutContent.querySelectorAll('p'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: aboutContent, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
    );
}

// Project cards: stagger entrance
const projectCards = document.querySelectorAll('.project-card');
gsap.fromTo(projectCards,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.projects-wrapper', start: 'top 85%', toggleActions: 'play none none reverse' }
    }
);

// Contact form elements: stagger
const contactFormWrapper = document.querySelector('.contact-form-wrapper');
if (contactFormWrapper) {
    gsap.fromTo(contactFormWrapper.querySelectorAll('.input-group, .btn-submit'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: contactFormWrapper, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
    );
}

// Contact section: smooth entrance
const contactSection = document.querySelector('.contact-section');
if (contactSection) {
    gsap.fromTo(contactSection,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: contactSection, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
    );
}

/* =========================================
   PROJECT CARD EFFECTS (sticky + dimming)
   ========================================= */
const cards = gsap.utils.toArray('.project-card');
cards.forEach((card, i) => {
    if (i !== cards.length - 1) {
        gsap.to(card, {
            scale: 0.95,
            filter: 'brightness(0.5)',
            ease: 'none',
            scrollTrigger: {
                trigger: cards[i + 1],
                start: 'top 75%',
                end: 'top 20%',
                scrub: true,
            }
        });
    }
});

/* =========================================
   WHATSAPP FORM
   ========================================= */
const whatsappForm = document.getElementById('whatsapp-form');
if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();
        if (!name || !message) return;

        const phoneNumber = '5579998356598';
        const textToEnv = `Olá Wesley!\nMeu nome é ${name}.\n\nTrago o seguinte projeto em mente:\n${message}`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToEnv)}`, '_blank');
        whatsappForm.reset();
    });
}

/* =========================================
   MOBILE MENU
   ========================================= */
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        if (typeof lenis !== 'undefined') {
            navLinks.classList.contains('active') ? lenis.stop() : lenis.start();
        }
    });

    document.querySelectorAll('.nav-links li a').forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
            if (typeof lenis !== 'undefined') lenis.start();
        });
    });
}

/* =========================================
   PROJECT MODAL (centralized data)
   ========================================= */
window.openProjectModal = function(projectId) {
    const p = PROJECTS[projectId];
    if (!p) return;

    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalDesc').innerHTML = p.desc;

    const liveBtn = document.getElementById('modalLiveBtn');
    const codeBtn = document.getElementById('modalCodeBtn');

    liveBtn.href = p.live || '#';
    liveBtn.style.display = p.live ? 'inline-flex' : 'none';
    codeBtn.href = p.code || '#';
    codeBtn.style.display = p.code ? 'inline-flex' : 'none';

    document.getElementById('projectModal').classList.add('active');
    if (typeof lenis !== 'undefined') lenis.stop();
};

window.closeProjectModal = function(event, force = false) {
    if (force || event.target.id === 'projectModal') {
        document.getElementById('projectModal').classList.remove('active');
        if (typeof lenis !== 'undefined') lenis.start();
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('projectModal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            if (typeof lenis !== 'undefined') lenis.start();
        }
    }
});