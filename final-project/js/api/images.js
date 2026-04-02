import { PLACEHOLDER_IMAGE } from '../config/constants.js';

export async function fetchImages(word) {
    try {
        // Usar proxy CORS para evitar problemas
        const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=photo&per_page=3&safesearch=true`;
        
        console.log('Fetching images for:', word);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.warn('Pixabay API response not OK:', response.status);
            return [];
        }
        
        const data = await response.json();
        console.log('Pixabay response:', data);
        
        if (data.hits && data.hits.length > 0) {
            // Retornar URLs das imagens
            const imageUrls = data.hits.map(hit => hit.webformatURL);
            console.log('Images found:', imageUrls);
            return imageUrls;
        }
        
        console.log('No images found for:', word);
        return [];
        
    } catch (error) {
        console.error('Pixabay API error:', error);
        return [];
    }
}