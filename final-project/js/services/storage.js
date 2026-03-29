import { STORAGE_KEYS } from '../config/constants.js';

// Library Storage
export function saveLibrary(library) {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(library));
}

export function loadLibrary() {
    const saved = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    return saved ? JSON.parse(saved) : [];
}

// Search History Storage
export function saveSearchHistory(history) {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
}

export function loadSearchHistory() {
    const saved = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return saved ? JSON.parse(saved) : [];
}

// Theme Storage
export function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function loadTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

// Language Storage
export function saveLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

export function loadLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
}
