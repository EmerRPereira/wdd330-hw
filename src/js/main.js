// main.js
import ProductList from "./ProductList.mjs";
import ProductData from "./ProductData.mjs";
import { qs } from "./utils.mjs";

// Create instances of our classes
const dataSource = new ProductData();
const listElement = qs(".product-list");
const productList = new ProductList("Tents", dataSource, listElement);

// Initialize the product list
productList.init();