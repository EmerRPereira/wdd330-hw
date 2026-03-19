import ShoppingCart from '../js/ShoppingCart.mjs';

const cartElement = document.querySelector('#cart-container');
const shoppingCart = new ShoppingCart(cartElement);
shoppingCart.init();