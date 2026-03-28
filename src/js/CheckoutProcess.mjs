// src/js/CheckoutProcess.mjs

import { alertMessage } from './utils.mjs';

export default class CheckoutProcess {
  // ... (constructor and other methods)

  async checkout() {
    const formData = this.buildOrderObject();
    
    try {
      // Attempt to submit the order
      const response = await this.externalServices.checkout(formData);
      
      // If successful, clear the cart and redirect to the success page.
      localStorage.removeItem('so-cart');
      window.location.href = '/checkout/success.html';
    } catch (err) {
      // An error occurred. Log it for debugging.
      console.error('Checkout error:', err);
      
      // Extract the error message. The structure might vary.
      let errorMessage = 'An unknown error occurred. Please try again.';
      
      // Check if our custom 'servicesError' was thrown.
      if (err.name === 'servicesError' && err.message) {
        // The server's error response might have a 'message' property.
        if (err.message.message) {
          errorMessage = err.message.message;
        } 
        // If the server sent a list of errors (e.g., for form fields), combine them.
        else if (err.message.errors && Array.isArray(err.message.errors)) {
          errorMessage = err.message.errors.join(', ');
        }
        // If it's a simple string, use it directly.
        else if (typeof err.message === 'string') {
          errorMessage = err.message;
        }
      } 
      // Fallback for other errors (like network issues)
      else if (err.message) {
        errorMessage = err.message;
      }
      
      // Display the error message to the user.
      alertMessage(errorMessage);
      // No redirection; the user remains on the checkout page to fix the issue.
    }
  }
}