// API Configuration
export const PIXABAY_API_KEY = '48920990-b57e343c58243a08514cf86b2';
export const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// LocalStorage Keys
export const STORAGE_KEYS = {
    LIBRARY: 'vocabulary_library',
    SEARCH_HISTORY: 'search_history',
    THEME: 'theme',
    LANGUAGE: 'language'
};

// Default Settings
export const DEFAULT_SETTINGS = {
    theme: 'light',
    language: 'en',
    maxHistoryItems: 5
};

// Messages
export const MESSAGES = {
    en: {
        searchPlaceholder: 'Enter a word...',
        wordNotFound: 'Word not found. Try another word!',
        saveSuccess: 'Word saved to library!',
        alreadyExists: 'This word is already in your library!',
        removeSuccess: 'Word removed from library',
        libraryCleared: 'Library cleared',
        emptyLibrary: 'No words to review. Save some words first!',
        reviewComplete: 'Review completed! Great job! 🎉',
        correct: 'Correct! 🎯',
        wrong: 'Keep practicing! 📚',
        speechNotSupported: 'Speech synthesis not supported'
    },
    pt: {
        searchPlaceholder: 'Digite uma palavra...',
        wordNotFound: 'Palavra não encontrada. Tente outra palavra!',
        saveSuccess: 'Palavra salva na biblioteca!',
        alreadyExists: 'Esta palavra já está na sua biblioteca!',
        removeSuccess: 'Palavra removida da biblioteca',
        libraryCleared: 'Biblioteca limpa',
        emptyLibrary: 'Nenhuma palavra para revisar. Salve algumas palavras primeiro!',
        reviewComplete: 'Revisão concluída! Ótimo trabalho! 🎉',
        correct: 'Correto! 🎯',
        wrong: 'Continue praticando! 📚',
        speechNotSupported: 'Síntese de fala não suportada'
    }
};
