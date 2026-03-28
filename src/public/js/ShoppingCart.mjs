import { getLocalStorage, setLocalStorage, renderListWithTemplate } from './utils.mjs';

export default class ShoppingCart {
    constructor(cartElement) {
        this.cartElement = cartElement;
        this.cartItems = getLocalStorage('so-cart') || [];
    }

    init() {
        this.renderCart();
    }

    renderCart() {
        if (this.cartItems.length === 0) {
            this.renderEmptyCart();
        } else {
            this.renderCartItems();
        }
    }

    renderEmptyCart() {
        const template = () => `
            <div class="cart-empty">
                <p>Your cart is empty</p>
                <a href="/product_pages/index.html" class="button">Continue Shopping</a>
            </div>
        `;
        renderListWithTemplate(template, this.cartElement, [{}]);
    }

    renderCartItems() {
        const cartItemTemplate = (item) => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.jpg'}" 
                     alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-brand">${item.brand}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <p class="cart-item-colors">Colors: ${item.colors ? item.colors.join(', ') : 'Various'}</p>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            </div>
        `;

        renderListWithTemplate(cartItemTemplate, this.cartElement, this.cartItems);
        
        // Add remove functionality
        this.cartElement.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                this.removeItem(itemId);
            });
        });

        // Add total and checkout
        this.renderCartFooter();
    }

    renderCartFooter() {
        const total = this.cartItems.reduce((sum, item) => sum + item.price, 0);
        const footerTemplate = () => `
            <div class="cart-footer">
                <p class="cart-total">Total: $${total.toFixed(2)}</p>
                <a href="/cart/checkout.html" class="button">Checkout</a>
            </div>
        `;
        renderListWithTemplate(footerTemplate, this.cartElement, [{}], 'beforeend', false);
    }

    removeItem(itemId) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        setLocalStorage('so-cart', this.cartItems);
        this.renderCart();
        
        // Update cart count in header if you have that functionality
        const event = new CustomEvent('cart-updated', { detail: { count: this.cartItems.length } });
        window.dispatchEvent(event);
    }
}