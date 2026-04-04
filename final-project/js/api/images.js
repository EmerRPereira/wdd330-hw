import { PIXABAY_API_KEY, PLACEHOLDER_IMAGE } from '../config/constants.js';

export async function fetchImages(word) {
    try {
        // Usar proxy CORS para evitar problemas
        const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=photo&per_page=3&safesearch=true`;
        
        console.log('Fetching images for:', word);
        console.log('API Key exists?', !!PIXABAY_API_KEY);
        
        const response = await fetch(url);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            console.warn('Pixabay API response not OK:', response.status);
            return [];
        }
        
        const data = await response.json();
        console.log('Pixabay response:', data);
        
        if (data.hits && data.hits.length > 0) {
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

// Adicione esta função de fallback
export async function fetchImages(word) {
    try {
        // Tentativa 1: Usar Unsplash (mais confiável para CORS)
        const unsplashUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(word)}`;
        
        // Retorna um array com a imagem do Unsplash como fallback
        return [unsplashUrl];
        
    } catch (error) {
        console.error('Image fetch error:', error);
        return [];
    }
}