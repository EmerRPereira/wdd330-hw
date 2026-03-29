import { DICTIONARY_API } from '../config/constants.js';
import { showToast } from '../utils/helpers.js';

export async function fetchDefinition(word) {
    try {
        const response = await fetch(`${DICTIONARY_API}${word}`);
        if (!response.ok) throw new Error('Word not found');
        const data = await response.json();
        
        const meaning = data[0].meanings[0];
        const definition = meaning.definitions[0].definition;
        const example = meaning.definitions[0].example || 'No example available.';
        const phonetic = data[0].phonetic || '';
        const partOfSpeech = meaning.partOfSpeech;
        
        return {
            word: data[0].word,
            definition: `${partOfSpeech}: ${definition}`,
            phonetic: phonetic,
            example: example,
            partOfSpeech: partOfSpeech
        };
    } catch (error) {
        console.error('Dictionary API error:', error);
        return null;
    }
}
