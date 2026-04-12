gsap.registerPlugin(ScrollTrigger);

/* =========================================
   PROJECT DATA (centralized)
   ========================================= */
const PROJECTS = {
    fokus: {
        title: 'Fokus',
        thumb: 'assets/fokus.png',
        desc: 'Pomodoro Timer imersivo construído com <b>Vanilla JS e CSS puro</b> — sem frameworks, sem dependências. Score <b>Lighthouse 98/100</b> em performance. Projetado para manter desenvolvedores em estado de <i>flow</i> controlando ciclos com precisão.<br><br><b>Engenharia Zero-Framework:</b> Toda a reatividade do timer foi construída sem framework, garantindo performance bruta e eliminando repaints desnecessários. Persistência via <b>LocalStorage</b> avançado. Animações de transição de estado em CSS puro com variáveis customizadas.',
        code: 'https://github.com/wesleycaiadev/fokus-projeto',
        live: 'https://wesleycaiadev.github.io/fokus-projeto/'
    },
    spasmooth: {
        title: 'SpaSmooth',
        thumb: 'assets/spasmooth.png',
        desc: 'Plataforma digital em produção para clínica de estética em Aracaju. <b>React + Next.js + Supabase</b>. Sistema completo de agendamentos integrado com painel administrativo real — atendendo clientes ativos.<br><br><b>Stack & Resultados:</b> Score <b>Lighthouse 96+</b> em performance e acessibilidade. Sistema de booking com autenticação Supabase, controle de profissionais e gestão de leads por WhatsApp. O funil de conversão foi arquitetado para guiar o visitante da primeira impressão até o agendamento em menos de 30 segundos de navegação.',
        code: 'https://github.com/wesleycaiadev/spasmooth-landing',
        live: 'https://spasmooth.com.br'
    },
    opencell: {
        title: 'Vistoriador OpenCell',
        thumb: 'assets/opencell.png',
        desc: 'PWA desenvolvido para o Samsung Smart Center de Aracaju que eliminou o gargalo operacional de vistorias manuais em papel — reduzindo o tempo de inspeção por painel em mais de <b>60%</b>.<br><br><b>Impacto Técnico e de Negócio:</b> O sistema processa fotografias de painéis de TV em tempo real, utiliza <b>leitura OCR</b> para capturar automaticamente códigos de peças e classifica defeitos sem intervenção manual. Os dados de cada vistoria são armazenados localmente via <b>Service Workers</b> e <b>IndexedDB</b>, garantindo operação 100% offline em ambientes fabris com rede instável. Um módulo de <b>exportação estruturada</b> permite download dos laudos em formato compartilhável, integrando o fluxo de aprovação/rejeição ao pipeline logístico da unidade.<br><br>Resultado: um processo que demandava prancheta, caneta e retrabalho agora roda em um único dispositivo mobile com zero dependência de conectividade.',
        code: 'https://github.com/wesleycaiadev/vistoriador-opencell',
        live: 'https://vistoriador-opencell.vercel.app/'
    },
    vgtech: {
        title: 'VgTech',
        thumb: 'assets/vgtech.png',
        desc: 'Landing page de alta conversão para laboratório de reparos de dispositivos Apple e Android em Aracaju — <b>cliente ativo em produção</b>. Entregue em menos de <b>72h</b> do briefing ao deploy.<br><br><b>Design & Conversão:</b> A estética imersiva com highlights em azul ciano foi estruturada para direcionar atenção à ação primária: atendimento via WhatsApp. Layout responsivo em grid com princípios de <i>conversion-driven design</i>, simplificando a jornada do cliente e transmitindo autoridade técnica na primeira rolagem.',
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
   PROJECT CARD — Internal Parallax (desktop only)
   ========================================= */
gsap.matchMedia().add('(min-width: 1201px)', () => {
    document.querySelectorAll('.project-visual').forEach(visual => {
        visual.style.overflow = 'hidden';
    });

    gsap.utils.toArray('.project-card').forEach(card => {
        const img = card.querySelector('.project-visual img');
        if (!img) return;

        gsap.fromTo(img,
            { yPercent: -8 },
            {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            }
        );
    });
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

    // Thumbnail
    const thumb = document.getElementById('modalThumb');
    if (thumb) {
        if (p.thumb) {
            thumb.src = p.thumb;
            thumb.alt = p.title;
            thumb.classList.add('visible');
        } else {
            thumb.classList.remove('visible');
        }
    }

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

/* =========================================
   CV DOWNLOAD TOAST
   ========================================= */
function showCvToast() {
    const toast = document.getElementById('cv-toast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

const cvNavLink = document.getElementById('cv-download-link');
if (cvNavLink) cvNavLink.addEventListener('click', showCvToast);

const cvFooterLink = document.getElementById('cv-download-footer');
if (cvFooterLink) cvFooterLink.addEventListener('click', showCvToast);