
/*
// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
*/

// utils.mjs
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Other utility functions you might have...
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// src/js/utils.mjs

// ... (other utility functions)

export function alertMessage(message, scroll = true) {
  // Create a div to hold the alert
  const alert = document.createElement('div');
  alert.classList.add('alert');
  
  // Set the content with a close button (X)
  alert.innerHTML = `
    <p>${message}</p>
    <button class="alert-close-btn">&times;</button>
  `;
  
  // Add an event listener to remove the alert when the close button is clicked
  alert.addEventListener('click', (e) => {
    if (e.target.classList.contains('alert-close-btn')) {
      const main = document.querySelector('main');
      if (main && main.contains(alert)) {
        main.removeChild(alert);
      }
    }
  });
  
  // Optionally auto-remove the alert after 5 seconds
  setTimeout(() => {
    if (document.body.contains(alert)) {
      alert.remove();
    }
  }, 5000);
  
  // Insert the alert at the top of the main element
  const main = document.querySelector('main');
  if (main) {
    main.prepend(alert);
  } else {
    // Fallback if there's no <main> tag (should not happen on the checkout page)
    document.body.prepend(alert);
  }
  
  // Scroll to the top to ensure the user sees the alert
  if (scroll) {
    window.scrollTo(0, 0);
  }
}