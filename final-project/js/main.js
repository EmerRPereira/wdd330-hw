import { fetchDefinition } from './api/dictionary.js';
import { fetchImages } from './api/images.js';
import { speakWord } from './services/speech.js';
import { saveLibrary, loadLibrary, saveSearchHistory, loadSearchHistory, saveTheme, loadTheme, saveLanguage, loadLanguage } from './services/storage.js';
import { showToast, showLoading, shuffleArray } from './utils/helpers.js';
import { MESSAGES, DEFAULT_SETTINGS } from './config/constants.js';
import { renderFlashcard, getCurrentWord, getSelectedImageUrl, setFlashcardCallbacks, selectImage } from './components/flashcard.js';
import { renderLibrary, setLibraryData, getLibraryData, setLibraryCallbacks } from './components/library.js';
import { startReviewMode, setReviewCallbacks } from './components/review.js';
import { updateSearchHistoryUI, addToSearchHistory, setSearchCallbacks } from './components/search.js';

// No início do arquivo, após os imports
console.log('🚀 main.js carregado com sucesso!');
console.log('Módulos importados:', {
    fetchDefinition: typeof fetchDefinition,
    fetchImages: typeof fetchImages,
    renderFlashcard: typeof renderFlashcard
});

// No DOMContentLoaded, adicione:
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM completamente carregado!');
    console.log('Elementos encontrados:', {
        searchBtn: document.getElementById('searchBtn'),
        searchInput: document.getElementById('searchInput'),
        themeToggle: document.getElementById('themeToggle'),
        languageSelect: document.getElementById('languageSelect')
    });
    
    loadData();
    setupEventListeners();
    setupCallbacks();
    applyTheme();
    applyLanguage();
    updateUI();
    
    console.log('✅ Inicialização completa!');
});


// Global State
let library = [];
let searchHistory = [];
let currentLanguage = 'en';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    setupCallbacks();
    applyTheme();
    applyLanguage();
    updateUI();
});

// Load all data from localStorage
function loadData() {
    library = loadLibrary();
    searchHistory = loadSearchHistory();
    currentLanguage = loadLanguage();
    
    setLibraryData(library);
    updateProfileStats();
}

// Save all data to localStorage
function saveData() {
    saveLibrary(library);
    saveSearchHistory(searchHistory);
}

// Setup event listeners
function setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const themeToggle = document.getElementById('themeToggle');
    const languageSelect = document.getElementById('languageSelect');
    const clearLibraryBtn = document.getElementById('clearLibraryBtn');
    
    if (searchBtn) searchBtn.addEventListener('click', () => searchWord());
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWord();
    });
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener('change', changeLanguage);
    }
    if (clearLibraryBtn) clearLibraryBtn.addEventListener('click', clearLibrary);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.section));
    });
}

// Setup component callbacks
function setupCallbacks() {
    setFlashcardCallbacks(saveToLibrary);
    setLibraryCallbacks(removeFromLibrary, viewWord);
    setSearchCallbacks(searchHistoryWord);
    setReviewCallbacks(updateReviewStats);
}

// Update UI components
function updateUI() {
    renderLibrary();
    updateSearchHistoryUI(searchHistory);
    updateProfileStats();
}

// Update profile statistics
function updateProfileStats() {
    const totalWords = document.getElementById('totalWordsLearned');
    const reviewCount = document.getElementById('reviewCount');
    
    if (totalWords) totalWords.textContent = library.length;
    if (reviewCount) {
        const totalReviews = library.reduce((sum, card) => sum + (card.reviewCount || 0), 0);
        reviewCount.textContent = totalReviews;
    }
}

// Update review statistics
function updateReviewStats() {
    updateProfileStats();
    saveData();
}

// Search word
async function searchWord() {
    const searchInput = document.getElementById('searchInput');
    const word = searchInput?.value.trim().toLowerCase();
    
    if (!word) {
        showToast('Please enter a word to search', 'error');
        return;
    }

    const flashcardContainer = document.getElementById('flashcard');
    showLoading(flashcardContainer);
    
    try {
        // Primeiro busca definição
        const definition = await fetchDefinition(word);
        if (!definition) {
            showToast(MESSAGES[currentLanguage]?.wordNotFound || MESSAGES.en.wordNotFound, 'error');
            flashcardContainer.innerHTML = ''; // Limpar loading
            return;
        }

        // Depois busca imagens (não travar se falhar)
        let images = [];
        try {
            images = await fetchImages(word);
            console.log('Images fetched:', images);
        } catch (imgError) {
            console.warn('Image fetch failed, continuing without images:', imgError);
            images = [];
        }

        const selectedImage = images.length > 0 ? images[0] : null;

        renderFlashcard(definition, images, selectedImage);
        addToSearchHistory(word, searchHistory, saveData, updateSearchHistoryUI);
        
    } catch (error) {
        console.error('Search error:', error);
        showToast('Error searching word. Please try again.', 'error');
        flashcardContainer.innerHTML = '';
    }
}

// Save to library
function saveToLibrary() {
    const currentWord = getCurrentWord();
    const selectedImageUrl = getSelectedImageUrl();
    
    if (!currentWord) {
        showToast('No word to save', 'error');
        return;
    }

    const exists = library.some(item => item.word === currentWord.word);
    if (exists) {
        showToast(MESSAGES[currentLanguage]?.alreadyExists || MESSAGES.en.alreadyExists, 'warning');
        return;
    }

    const flashcard = {
        id: `${currentWord.word}_${Date.now()}`,
        word: currentWord.word,
        definition: currentWord.definition,
        phonetic: currentWord.phonetic,
        example: currentWord.example,
        imageUrl: selectedImageUrl,
        createdAt: new Date().toISOString(),
        reviewCount: 0,
        lastReviewed: null
    };

    library.unshift(flashcard);
    setLibraryData(library);
    saveData();
    renderLibrary();
    updateProfileStats();
    showToast(MESSAGES[currentLanguage]?.saveSuccess || MESSAGES.en.saveSuccess, 'success');
}

// Remove from library
function removeFromLibrary(id) {
    library = library.filter(card => card.id !== id);
    setLibraryData(library);
    saveData();
    renderLibrary();
    updateProfileStats();
    showToast(MESSAGES[currentLanguage]?.removeSuccess || MESSAGES.en.removeSuccess, 'success');
}

// View word from library
async function viewWord(word) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = word;
    }
    navigateTo('home');
    await searchWord();
}

// Clear entire library
function clearLibrary() {
    if (confirm('Are you sure you want to clear your entire library?')) {
        library = [];
        setLibraryData(library);
        saveData();
        renderLibrary();
        updateProfileStats();
        showToast(MESSAGES[currentLanguage]?.libraryCleared || MESSAGES.en.libraryCleared, 'success');
    }
}

// Search history word
function searchHistoryWord(word) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = word;
    }
    searchWord();
}

// Navigation
function navigateTo(section) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (activeItem) activeItem.classList.add('active');
    
    const flashcard = document.getElementById('flashcard');
    const librarySection = document.getElementById('librarySection');
    const profileSection = document.getElementById('profileSection');
    
    if (flashcard) flashcard.style.display = 'block';
    if (librarySection) librarySection.classList.remove('active');
    if (profileSection) profileSection.classList.remove('active');
    
    switch(section) {
        case 'library':
            if (flashcard) flashcard.style.display = 'none';
            if (librarySection) librarySection.classList.add('active');
            renderLibrary();
            break;
        case 'profile':
            if (flashcard) flashcard.style.display = 'none';
            if (profileSection) profileSection.classList.add('active');
            updateProfileStats();
            break;
        case 'review':
            startReviewMode(library, updateReviewStats);
            break;
        case 'home':
        default:
            if (flashcard) flashcard.style.display = 'block';
            if (librarySection) librarySection.classList.remove('active');
            if (profileSection) profileSection.classList.remove('active');
            break;
    }
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    saveTheme(theme);
    
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// Apply saved theme
function applyTheme() {
    const theme = loadTheme();
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

// Change language
function changeLanguage(e) {
    currentLanguage = e.target.value;
    saveLanguage(currentLanguage);
    applyLanguage();
}

// Apply saved language
function applyLanguage() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = MESSAGES[currentLanguage]?.searchPlaceholder || MESSAGES.en.searchPlaceholder;
    }
}

// Make functions available globally for inline handlers
window.searchWord = searchWord;
window.navigateTo = navigateTo;