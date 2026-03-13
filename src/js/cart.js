import { getLocalStorage, setLocalStorage } from "./utils.mjs"; 

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  
  // Verificar se o carrinho tem itens
  if (cartItems && cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
  } else {
    document.querySelector(".product-list").innerHTML = "<li>Seu carrinho está vazio</li>";
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0]?.ColorName || 'N/A'}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function addProductToCart(product) {
  // 1. Pegar carrinho atual (ou array vazio se não existir)
  let cart = getLocalStorage("so-cart") || [];
  
  // 2. Adicionar novo produto
  cart.push(product);
  
  // 3. Salvar carrinho completo
  setLocalStorage("so-cart", cart);
  
  // Opcional: mostrar no console para verificar
  console.log("Produto adicionado. Carrinho atual:", cart);
}

// Só executa se estiver na página do carrinho
if (window.location.pathname.includes("cart")) {
  renderCartContents();
}