// Funções de localStorage
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Função para carregar templates
export async function loadTemplate(path) {
    const res = await fetch(path);
    const template = await res.text();
    return template;
}

// Função para carregar header e footer
export async function loadHeaderFooter() {
    try {
        const headerTemplate = await loadTemplate('/partials/header.html');
        const headerElement = document.querySelector('#main-header');
        if (headerElement) {
            headerElement.innerHTML = headerTemplate;
            updateCartCount();
        }
        
        const footerTemplate = await loadTemplate('/partials/footer.html');
        const footerElement = document.querySelector('#main-footer');
        if (footerElement) {
            footerElement.innerHTML = footerTemplate;
        }
    } catch (error) {
        console.error('Error loading header/footer:', error);
    }
}

// Função para atualizar contador do carrinho
export function updateCartCount() {
    const cartItems = getLocalStorage('so-cart') || [];
    const cartCount = cartItems.length;
    const cartLink = document.querySelector('.cart a');
    if (cartLink) {
        let badge = cartLink.querySelector('.cart-badge');
        if (cartCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                cartLink.appendChild(badge);
            }
            badge.textContent = cartCount;
        } else if (badge) {
            badge.remove();
        }
    }
}

// FUNÇÃO DE ALERTA
export function alertMessage(message, scroll = true) {
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.innerHTML = `
        <p>${message}</p>
        <button class="alert-close-btn">&times;</button>
    `;
    
    alert.addEventListener('click', (e) => {
        if (e.target.classList.contains('alert-close-btn')) {
            const main = document.querySelector('main');
            if (main && main.contains(alert)) {
                main.removeChild(alert);
            }
        }
    });
    
    const main = document.querySelector('main');
    if (main) {
        main.prepend(alert);
    }
    
    if (scroll) {
        window.scrollTo(0, 0);
    }
    
    setTimeout(() => {
        if (document.body.contains(alert)) {
            alert.remove();
        }
    }, 5000);
}

// Função para renderizar listas
export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = true) {
    if (clear) {
        parentElement.innerHTML = '';
    }
    const htmlString = list.map(templateFn).join('');
    parentElement.insertAdjacentHTML(position, htmlString);
}