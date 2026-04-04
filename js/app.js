/**
 * ============================================
 * VISUAL VOCABULARY BUILDER
 * A web application for learning English vocabulary
 * with images, audio pronunciation, and flashcards
 * 
 * @version 1.0.0
 * @author Emerson Ronald Pereira
 * @license MIT
 * ============================================
 */

// ============================================
// GLOBAL STATE VARIABLES
// ============================================
let library = [];           
let searchHistory = [];     
let currentWordData = null; 
let currentImages = [];      
let selectedImageUrl = '';   

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================
const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/4A90E2/white?text=No+Image+Available';

// API de imagens que funciona sem CORS - Usando Lorem Picsum (sempre funciona)
const IMAGE_API = 'https://picsum.photos/400/300';

// ============================================
// MESSAGES
// ============================================
const MESSAGES = {
    searchPlaceholder: 'Enter a word...',
    wordNotFound: 'Word not found. Try another word!',
    saveSuccess: 'Word saved to library!',
    alreadyExists: 'This word is already in your library!',
    removeSuccess: 'Word removed from library',
    libraryCleared: 'Library cleared',
    emptyLibrary: 'No words to review. Save some words first!',
    reviewComplete: 'Review completed! Great job! 🎉',
    correct: 'Correct! 🎯',
    wrong: 'Keep practicing! 📚'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(container) {
    if (container) {
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin spinner"></i> Loading...</div>';
        container.classList.add('active');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateExampleSentence(word, definition) {
    const templates = [
        `"${word}" is an important word to learn in English.`,
        `I learned the meaning of "${word}" today.`,
        `Can you use "${word}" in a sentence?`,
        `The word "${word}" means: ${definition.substring(0, 50)}...`,
        `Understanding "${word}" helps improve vocabulary.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

// ============================================
// API FUNCTIONS (External APIs)
// ============================================

async function fetchDefinition(word) {
    try {
        const response = await fetch(`${DICTIONARY_API}${word}`);
        if (!response.ok) throw new Error('Word not found');
        const data = await response.json();
        
        const meaning = data[0].meanings[0];
        let definition = meaning.definitions[0].definition;
        let example = meaning.definitions[0].example || null;
        const phonetic = data[0].phonetic || '';
        const partOfSpeech = meaning.partOfSpeech;
        
        if (!example) {
            example = generateExampleSentence(word, definition);
        }
        
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

/**
 * Fetches images for a word from Pexels API (imagens reais e relevantes)
 * @param {string} word - Word to search images for
 * @returns {Promise<string[]>} Array of image URLs
 */
async function fetchImages(word) {
    const imageUrls = [];
    
    // SUA API KEY DO PEXELS (cadastre-se gratuitamente em pexels.com/api)
    const PEXELS_API_KEY = 'UfV9Zd2dAL7RT4soWeuUtHVNbMjMk3Wz7VG6YMkVz1uCgkXEvgXaOtDR';
    
    try {
        // Tentativa 1: Pexels API (imagens reais relacionadas à palavra)
        const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(word)}&per_page=5`;
        
        const response = await fetch(pexelsUrl, {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
                // Adiciona as imagens do Pexels
                data.photos.forEach(photo => {
                    imageUrls.push(photo.src.medium);
                });
                console.log(`✅ Pexels: ${data.photos.length} imagens encontradas para "${word}"`);
            } else {
                console.log(`⚠️ Pexels: Nenhuma imagem encontrada para "${word}"`);
            }
        } else {
            console.log(`⚠️ Pexels API error: ${response.status}`);
        }
    } catch (error) {
        console.error('Pexels API error:', error);
    }
    
    // Se não conseguiu imagens do Pexels, usa fallbacks
    if (imageUrls.length === 0) {
        // Fallback 1: Unsplash Source (pode ter CORS, mas tenta)
        imageUrls.push(`https://source.unsplash.com/featured/400x300/?${encodeURIComponent(word)}`);
        
        // Fallback 2: Placeholder com a palavra
        imageUrls.push(`https://placehold.co/600x400/4A90E2/white?text=${encodeURIComponent(word)}+(no+image)`);
        
        // Fallback 3: Imagem ilustrativa por categoria
        const categories = {
            animal: '🐶🐱🐭',
            food: '🍎🍕🍔',
            nature: '🌲🌳🌴',
            people: '👤👥👪',
            technology: '💻📱🖥️'
        };
        const randomCat = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
        imageUrls.push(`https://placehold.co/600x400/50E3C2/white?text=${randomCat}+${encodeURIComponent(word)}`);
    }
    
    return imageUrls.slice(0, 5);
}

// ============================================
// SPEECH SYNTHESIS (Web Speech API)
// ============================================

function speakWord(word) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        setTimeout(() => {
            speechSynthesis.speak(utterance);
        }, 100);
    } else {
        showToast('Speech not supported in this browser', 'error');
    }
}

// ============================================
// LOCAL STORAGE FUNCTIONS
// ============================================

function saveLibrary() {
    localStorage.setItem('vocab_library', JSON.stringify(library));
}

function loadLibrary() {
    const saved = localStorage.getItem('vocab_library');
    library = saved ? JSON.parse(saved) : [];
    updateProfileStats();
    renderLibrary();
}

function saveSearchHistory() {
    localStorage.setItem('vocab_history', JSON.stringify(searchHistory));
}

function loadSearchHistory() {
    const saved = localStorage.getItem('vocab_history');
    searchHistory = saved ? JSON.parse(saved) : [];
    updateSearchHistoryUI();
}

function saveTheme(theme) {
    localStorage.setItem('vocab_theme', theme);
}

function loadTheme() {
    return localStorage.getItem('vocab_theme') || 'light';
}

// ============================================
// UI RENDER FUNCTIONS
// ============================================

function updateSearchHistoryUI() {
    const historyDiv = document.getElementById('searchHistory');
    if (!historyDiv) return;
    
    if (searchHistory.length === 0) {
        historyDiv.innerHTML = '';
        return;
    }
    
    historyDiv.innerHTML = searchHistory.map(word => `
        <div class="history-item" onclick="window.searchHistoryWord('${word}')" role="button" tabindex="0">
            ${escapeHtml(word)}
        </div>
    `).join('');
}

function addToSearchHistory(word) {
    searchHistory = searchHistory.filter(w => w !== word);
    searchHistory.unshift(word);
    if (searchHistory.length > 5) searchHistory.pop();
    saveSearchHistory();
    updateSearchHistoryUI();
}

function renderFlashcard(wordData, images, selectedImage) {
    currentWordData = wordData;
    currentImages = images || [];
    selectedImageUrl = selectedImage || (images && images[0]) || PLACEHOLDER_IMAGE;
    
    const displayImages = currentImages.length > 0 ? currentImages : [PLACEHOLDER_IMAGE];
    
    const flashcardHtml = `
        <img src="${selectedImageUrl}" alt="${wordData.word}" class="flashcard-image" onerror="this.src='${PLACEHOLDER_IMAGE}'">
        <div class="flashcard-content">
            <div class="word-section">
                <h2 class="word">${escapeHtml(wordData.word)}</h2>
                <div class="phonetic">${wordData.phonetic || ''}</div>
                <button id="speakBtn" class="pronounce-btn" aria-label="Pronounce ${wordData.word}">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="definition-section">
                <p class="definition-text">${escapeHtml(wordData.definition)}</p>
            </div>
            <div class="example-section">
                <i class="fas fa-quote-left"></i> "${escapeHtml(wordData.example)}"
            </div>
            <div class="image-options">
                ${displayImages.map((img, idx) => `
                    <div class="image-option ${selectedImageUrl === img ? 'selected' : ''}" onclick="window.selectImage(${idx})" role="button" tabindex="0">
                        <img src="${img}" alt="Image option ${idx + 1}" onerror="this.src='${PLACEHOLDER_IMAGE}'">
                    </div>
                `).join('')}
            </div>
            <div class="flashcard-actions">
                <button id="saveCardBtn" class="btn btn-primary" aria-label="Save word to library">
                    <i class="fas fa-save"></i> SAVE
                </button>
                <button id="newWordBtn" class="btn btn-secondary" aria-label="Clear and search new word">
                    <i class="fas fa-plus"></i> NEW
                </button>
            </div>
        </div>
    `;
    
    const flashcardContainer = document.getElementById('flashcard');
    flashcardContainer.innerHTML = flashcardHtml;
    flashcardContainer.classList.add('active');
    
    const speakBtn = document.getElementById('speakBtn');
    const saveBtn = document.getElementById('saveCardBtn');
    const newBtn = document.getElementById('newWordBtn');
    
    if (speakBtn) speakBtn.addEventListener('click', () => speakWord(wordData.word));
    if (saveBtn) saveBtn.addEventListener('click', saveToLibrary);
    if (newBtn) newBtn.addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('searchInput').focus();
        flashcardContainer.classList.remove('active');
    });
}

function renderLibrary() {
    const libraryGrid = document.getElementById('libraryGrid');
    if (!libraryGrid) return;
    
    if (library.length === 0) {
        libraryGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">✨ No words saved yet. Search and save words to build your vocabulary! ✨</p>';
        return;
    }
    
    libraryGrid.innerHTML = library.map(card => `
        <div class="library-card" onclick="window.viewWord('${escapeHtml(card.word)}')" role="button" tabindex="0">
            <img src="${card.imageUrl || PLACEHOLDER_IMAGE}" alt="${escapeHtml(card.word)}" onerror="this.src='${PLACEHOLDER_IMAGE}'">
            <div class="library-card-content">
                <div class="library-word">${escapeHtml(card.word)}</div>
                <div class="library-definition">${escapeHtml(card.definition.substring(0, 80))}...</div>
                <div class="library-actions">
                    <button onclick="event.stopPropagation(); window.removeFromLibrary('${card.id}')" aria-label="Remove ${card.word} from library">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                    <button onclick="event.stopPropagation(); window.speakWord('${escapeHtml(card.word)}')" aria-label="Pronounce ${card.word}">
                        <i class="fas fa-volume-up"></i> Listen
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateProfileStats() {
    const totalWords = document.getElementById('totalWordsLearned');
    const reviewCount = document.getElementById('reviewCount');
    
    if (totalWords) totalWords.textContent = library.length;
    if (reviewCount) {
        const totalReviews = library.reduce((sum, card) => sum + (card.reviewCount || 0), 0);
        reviewCount.textContent = totalReviews;
    }
}

// ============================================
// CORE APPLICATION FUNCTIONS
// ============================================

window.selectImage = function(index) {
    if (currentImages && currentImages[index]) {
        selectedImageUrl = currentImages[index];
        renderFlashcard(currentWordData, currentImages, selectedImageUrl);
    }
};

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
        const definition = await fetchDefinition(word);
        if (!definition) {
            showToast(MESSAGES.wordNotFound, 'error');
            flashcardContainer.innerHTML = '';
            flashcardContainer.classList.remove('active');
            return;
        }
        
        const images = await fetchImages(word);
        const selectedImage = images.length > 0 ? images[0] : null;
        
        renderFlashcard(definition, images, selectedImage);
        addToSearchHistory(word);
        
    } catch (error) {
        console.error('Search error:', error);
        showToast('Error searching word. Please try again.', 'error');
        flashcardContainer.innerHTML = '';
        flashcardContainer.classList.remove('active');
    }
}

function saveToLibrary() {
    if (!currentWordData) {
        showToast('No word to save', 'error');
        return;
    }
    
    const exists = library.some(item => item.word === currentWordData.word);
    if (exists) {
        showToast(MESSAGES.alreadyExists, 'warning');
        return;
    }
    
    const flashcard = {
        id: `${currentWordData.word}_${Date.now()}`,
        word: currentWordData.word,
        definition: currentWordData.definition,
        phonetic: currentWordData.phonetic,
        example: currentWordData.example,
        imageUrl: selectedImageUrl,
        createdAt: new Date().toISOString(),
        reviewCount: 0,
        lastReviewed: null
    };
    
    library.unshift(flashcard);
    saveLibrary();
    renderLibrary();
    updateProfileStats();
    showToast(MESSAGES.saveSuccess, 'success');
}

window.removeFromLibrary = function(id) {
    library = library.filter(card => card.id !== id);
    saveLibrary();
    renderLibrary();
    updateProfileStats();
    showToast(MESSAGES.removeSuccess, 'success');
};

window.viewWord = async function(word) {
    document.getElementById('searchInput').value = word;
    navigateTo('home');
    await searchWord();
};

window.searchHistoryWord = async function(word) {
    document.getElementById('searchInput').value = word;
    await searchWord();
};

function clearLibrary() {
    if (confirm('Are you sure you want to clear your entire library?')) {
        library = [];
        saveLibrary();
        renderLibrary();
        updateProfileStats();
        showToast(MESSAGES.libraryCleared, 'success');
    }
}

// ============================================
// REVIEW SYSTEM
// ============================================

let reviewQueue = [];
let reviewIndex = 0;

function startReview() {
    if (library.length === 0) {
        showToast(MESSAGES.emptyLibrary, 'warning');
        return;
    }
    
    reviewQueue = [...library];
    reviewIndex = 0;
    showNextReview();
}

function showNextReview() {
    if (reviewIndex >= reviewQueue.length) {
        closeReviewModal();
        showToast(MESSAGES.reviewComplete, 'success');
        updateProfileStats();
        return;
    }
    
    const card = reviewQueue[reviewIndex];
    document.getElementById('reviewWord').textContent = card.word;
    document.getElementById('reviewDefinition').textContent = card.definition;
    document.getElementById('reviewModal').style.display = 'flex';
}

function reviewAnswer(isCorrect) {
    const card = reviewQueue[reviewIndex];
    
    if (isCorrect) {
        card.reviewCount = (card.reviewCount || 0) + 1;
        card.lastReviewed = new Date().toISOString();
        const index = library.findIndex(item => item.id === card.id);
        if (index !== -1) library[index] = card;
        saveLibrary();
        showToast(MESSAGES.correct, 'success');
    } else {
        showToast(MESSAGES.wrong, 'warning');
        reviewQueue.push(card);
    }
    
    reviewIndex++;
    showNextReview();
}

function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    reviewQueue = [];
    reviewIndex = 0;
}

// ============================================
// NAVIGATION
// ============================================

function navigateTo(section) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (activeItem) activeItem.classList.add('active');
    
    const flashcard = document.getElementById('flashcard');
    const librarySection = document.getElementById('librarySection');
    const profileSection = document.getElementById('profileSection');
    
    if (flashcard) {
        if (section === 'home') {
            flashcard.style.display = 'block';
        } else {
            flashcard.style.display = 'none';
        }
    }
    if (librarySection) librarySection.classList.toggle('active', section === 'library');
    if (profileSection) profileSection.classList.toggle('active', section === 'profile');
    
    if (section === 'library') renderLibrary();
    if (section === 'profile') updateProfileStats();
    if (section === 'review') startReview();
}

// ============================================
// THEME MANAGEMENT
// ============================================

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    saveTheme(theme);
    
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.classList.remove(theme === 'dark' ? 'fa-moon' : 'fa-sun');
        icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
    }
}

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

// ============================================
// APPLICATION INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Visual Vocabulary Builder initialized');
    
    loadLibrary();
    loadSearchHistory();
    applyTheme();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = MESSAGES.searchPlaceholder;
    }
    
    const searchBtn = document.getElementById('searchBtn');
    const themeToggle = document.getElementById('themeToggle');
    const clearLibraryBtn = document.getElementById('clearLibraryBtn');
    const reviewCorrect = document.getElementById('reviewCorrect');
    const reviewWrong = document.getElementById('reviewWrong');
    const reviewClose = document.getElementById('reviewClose');
    
    if (searchBtn) searchBtn.addEventListener('click', searchWord);
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWord();
    });
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (clearLibraryBtn) clearLibraryBtn.addEventListener('click', clearLibrary);
    if (reviewCorrect) reviewCorrect.addEventListener('click', () => reviewAnswer(true));
    if (reviewWrong) reviewWrong.addEventListener('click', () => reviewAnswer(false));
    if (reviewClose) reviewClose.addEventListener('click', closeReviewModal);
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.section));
    });
    
    window.speakWord = speakWord;
    window.searchWord = searchWord;
    window.navigateTo = navigateTo;
    
    console.log('✅ Application ready! Search for a word to begin.');
});