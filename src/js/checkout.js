// In the file that initializes the checkout page (e.g., src/js/checkout.js)

import CheckoutProcess from './CheckoutProcess.mjs';

document.addEventListener('DOMContentLoaded', () => {
  // Assuming CheckoutProcess is instantiated
  const myCheckout = new CheckoutProcess('so-cart', document.querySelector('#checkout-container'));
  
  // Get the button and the form
  const submitButton = document.querySelector('#checkoutSubmit');
  const checkoutForm = document.querySelector('#checkout-form');

  if (submitButton && checkoutForm) {
    submitButton.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent any default button behavior
      
      // Check if the form is valid according to the HTML5 'required' attributes
      const isFormValid = checkoutForm.checkValidity();
      
      // Trigger the browser's built-in validation UI to show messages
      checkoutForm.reportValidity();
      
      // Only proceed with checkout if the form is valid
      if (isFormValid) {
        myCheckout.checkout();
      }
    });
  }
});