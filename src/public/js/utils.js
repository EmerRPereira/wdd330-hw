// Render a template with optional callback
export function renderWithTemplate(template, parentElement, data, callback) {
    // Insert the template into the parent element
    parentElement.innerHTML = template;
    
    // Call the callback function if it exists
    if (callback && typeof callback === 'function') {
        callback(data);
    }
}

// Load a template from a file
export async function loadTemplate(path) {
    const res = await fetch(path);
    const template = await res.text();
    return template;
}

// Load header and footer templates
export async function loadHeaderFooter() {
    // Load the header template
    const headerTemplate = await loadTemplate('/partials/header.html');
    const headerElement = document.querySelector('#main-header');
    
    if (headerElement) {
        renderWithTemplate(headerTemplate, headerElement, null, initializeCartIcon);
    }
    
    // Load the footer template
    const footerTemplate = await loadTemplate('/partials/footer.html');
    const footerElement = document.querySelector('#main-footer');
    
    if (footerElement) {
        renderWithTemplate(footerTemplate, footerElement);
    }
}

// Callback function to initialize cart icon functionality
function initializeCartIcon() {
    const cartLink = document.querySelector('.cart a');
    if (cartLink) {
        // Add any cart icon initialization here (e.g., item count, animation)
        updateCartCount();
    }
}

// Helper function to update cart count (for stretch activity)
export function updateCartCount() {
    const cartItems = getLocalStorage('so-cart') || [];
    const cartCount = cartItems.length;
    
    // You could add a badge to the cart icon
    const cartLink = document.querySelector('.cart a');
    if (cartLink && cartCount > 0) {
        // Add a count badge to the cart icon
        let badge = cartLink.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            cartLink.appendChild(badge);
        }
        badge.textContent = cartCount;
    }
}

// Helper function to get data from localStorage
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Helper function to set data in localStorage
export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Helper function to get URL parameters
export function getParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

// Helper function to render a list with a template
export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = true) {
    if (clear) {
        parentElement.innerHTML = '';
    }
    const htmlString = list.map(templateFn).join('');
    parentElement.insertAdjacentHTML(position, htmlString);
}