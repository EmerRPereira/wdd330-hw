import { loadHeaderFooter } from './utils.mjs';

// Load the header and footer when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadHeaderFooter();
        console.log('Header and footer loaded successfully');
    } catch (error) {
        console.error('Error loading header and footer:', error);
    }
});