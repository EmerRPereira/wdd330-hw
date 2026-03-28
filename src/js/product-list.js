// product-list.js

// Function to fetch tents data
async function loadTents() {
  const container = document.getElementById('product-list-container');
  // Show loading message
  if (container) {
    container.innerHTML = '<p class="loading">Loading products...</p>';
  }
  try {
    const response = await fetch('/json/tents.json');
    const tents = await response.json();
    displayTents(tents);
  } catch (error) {
    console.error('Error loading tents:', error);
  }
}

// Function to filter and render the four desired tents
function displayTents(tents) {
  const container = document.getElementById('product-list-container');
  if (!container) return;

  // IDs of the tents we want to show (based on original product pages)
  const allowedIds = [
    'cedar-ridge-rimrock-2',
    'marmot-ajax-3',
    'northface-alpine-3',
    'northface-talus-4'
  ];

  // Filter the tents
  const filteredTents = tents.filter(tent => allowedIds.includes(tent.id));

  // Generate HTML for each tent
  let html = '';
  filteredTents.forEach(tent => {
    // Use the first image from the images array, or a placeholder
    const imageUrl = tent.images && tent.images.length > 0 
      ? tent.images[0] 
      : '/images/placeholder.jpg';

    html += `
      <div class="product-card">
        <a href="/product_pages/?product=${tent.id}">
          <img src="${imageUrl}" alt="${tent.name}">
          <h3>${tent.name}</h3>
          <p class="brand">${tent.brand}</p>
          <p class="price">$${tent.price.toFixed(2)}</p>
        </a>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Load the tents when the page loads
loadTents();
