// src/js/components/menu-toggle.js
/**
 * Lógica de Acessibilidade e Interação do Menu Hamburguer (Mobile).
 * Implementado por: Front-end Tech Lead / Accessibility Specialist
 */

export const setupMenuToggle = () => {
    const nav = document.getElementById('main-nav');
    const toggleButton = document.getElementById('menu-toggle');
    const menuList = document.getElementById('main-nav-list');
    
    if (!nav || !toggleButton || !menuList) return;

    // Acessibilidade: Define estado inicial ARIA
    toggleButton.setAttribute('aria-expanded', 'false');

    toggleButton.addEventListener('click', () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        
        // Alterna a classe visual e o atributo ARIA
        nav.classList.toggle('is-open');
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        
        // Acessibilidade: Garante que o menu é navegável por teclado quando aberto
        // (O CSS já controla o display/visibilidade)
    });
    
    // Bônus A11y: Fechar menu se redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            nav.classList.remove('is-open');
            toggleButton.setAttribute('aria-expanded', 'false');
        }
    });
};

// Adicionar a chamada 'setupMenuToggle()' no home.js e em todos os outros JS de página.