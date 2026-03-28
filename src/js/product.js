import { setLocalStorage, alertMessage } from './utils.mjs';
import ProductData from './ProductData.mjs';

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get existing cart or create a new array
  const cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  cart.push(product);
  setLocalStorage('so-cart', cart);
  
  // Show a success message to the user
  alertMessage(`${product.Name} has been added to your cart!`, false);

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
