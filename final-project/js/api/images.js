import { PIXABAY_API_KEY } from '../config/constants.js';

export async function fetchImages(word) {
    try {
        const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=photo&per_page=3`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.hits && data.hits.length > 0) {
            return data.hits.map(hit => hit.webformatURL);
        }
        return [];
    } catch (error) {
        console.error('Pixabay API error:', error);
        return [];
    }
}
