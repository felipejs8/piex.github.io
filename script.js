// ===============================================
// CONSTRUÇÃO 4.0 - BIM + IA + ODS 9.4
// Script Principal
// ===============================================

// Menu Mobile Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animar hamburger
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0)';
            spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : 'rotate(0)';
        });
    }
    
    // Fechar menu ao clicar em um link (mobile)
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'rotate(0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'rotate(0)';
            }
        });
    });
});

// Smooth Scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offset = 80; // Offset para navbar fixa
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animação de scroll para elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.card, .pillar-card, .nexus-card, .cta-card, .result-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Contador animado para números
function animateCounter(element, target, suffix = '', duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.round(target) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(start) + suffix;
        }
    }, 16);
}

// Observar elementos de resultado para animar números
const resultObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const numberElement = entry.target.querySelector('.result-number, .metric-value');
            if (numberElement) {
                const text = numberElement.textContent;
                
                // Detectar se é um intervalo (ex: 20-30%, 20%-30%)
                const isRange = text.match(/(\d+)\s*[-–—]\s*(\d+)/);
                
                if (isRange) {
                    // Se é intervalo, não animar - apenas marcar como animado
                    // para evitar múltiplas tentativas
                    entry.target.dataset.animated = 'true';
                } else {
                    // Número simples - animar normalmente
                    const number = parseFloat(text.replace(/[^0-9.]/g, ''));
                    
                    // Detectar sufixo (%, t, kg, etc.)
                    let suffix = '';
                    if (text.includes('%')) {
                        suffix = '%';
                    } else if (text.toLowerCase().includes('t')) {
                        suffix = 't';
                    } else if (text.toLowerCase().includes('kg')) {
                        suffix = 'kg';
                    }
                    
                    if (!isNaN(number)) {
                        numberElement.textContent = '0' + suffix;
                        animateCounter(numberElement, number, suffix);
                        entry.target.dataset.animated = 'true';
                    }
                }
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const resultElements = document.querySelectorAll('.result-item, .result-metric');
    resultElements.forEach(el => resultObserver.observe(el));
});

// Função de cópia de código (para página de tutorial)
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code');
    
    if (code) {
        const text = code.textContent;
        
        // Usar Clipboard API moderna
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showCopyFeedback(button);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                fallbackCopyTextToClipboard(text, button);
            });
        } else {
            // Fallback para navegadores antigos
            fallbackCopyTextToClipboard(text, button);
        }
    }
}

// Fallback para cópia em navegadores sem Clipboard API
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyFeedback(button);
        }
    } catch (err) {
        console.error('Erro ao copiar:', err);
    }
    
    document.body.removeChild(textArea);
}

// Mostrar feedback visual de cópia
function showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Copiado! ✓';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Navbar transparente no topo (opcional)
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Adicionar sombra ao navbar após scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Lazy loading para imagens (se houver)
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Adicionar classe ao body indicando JavaScript ativo
document.documentElement.classList.add('js-enabled');

// Prevenção de scroll horizontal
document.addEventListener('DOMContentLoaded', function() {
    // Prevenir scroll horizontal em dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
    }, { passive: true });
});

// Analytics simulado (pode ser substituído por Google Analytics)
function trackPageView(pageName) {
    console.log(`Page View: ${pageName}`);
    // Aqui você pode adicionar código de analytics real
}

// Track inicial
document.addEventListener('DOMContentLoaded', function() {
    const pageName = document.title;
    trackPageView(pageName);
});

// Easter egg: Console message
console.log(
    '%c🏗️ Construção 4.0 - BIM + IA + ODS 9.4',
    'color: #667eea; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cProjeto desenvolvido para demonstrar a interseção entre tecnologia e sustentabilidade na construção civil.',
    'color: #2c3e50; font-size: 14px;'
);
console.log(
    '%cInteressado em contribuir? Este é um projeto educacional!',
    'color: #27ae60; font-size: 12px;'
);

// Performance monitoring (básico)
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// Adicionar ano atual no footer automaticamente
document.addEventListener('DOMContentLoaded', function() {
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
    }
});

// Validação de formulários (caso sejam adicionados no futuro)
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Adicionar funcionalidade de busca (caso necessário no futuro)
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            // Implementar lógica de busca aqui
        });
    }
}

// Accessibility: Foco visível com teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// Print-friendly (remover elementos desnecessários ao imprimir)
window.addEventListener('beforeprint', function() {
    console.log('Preparing for print...');
    // Adicionar classe para estilização de impressão
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});

// Service Worker (para PWA no futuro)
if ('serviceWorker' in navigator) {
    // Descomentado quando houver service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed'));
}

// Export functions for use in other scripts
window.ConstrucaoQuatroPontoZero = {
    copyCode: copyCode,
    trackPageView: trackPageView,
    validateForm: validateForm
};

