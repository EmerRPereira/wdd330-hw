import { speakWord } from '../services/speech.js';
import { showToast } from '../utils/helpers.js';
import { MESSAGES } from '../config/constants.js';

let currentWord = null;
let currentImages = [];
let selectedImageUrl = '';
let onSaveCallback = null;

export function setFlashcardCallbacks(onSave) {
    onSaveCallback = onSave;
}

export function getCurrentWord() {
    return currentWord;
}

export function getSelectedImageUrl() {
    return selectedImageUrl;
}

export function selectImage(index) {
    if (currentImages[index]) {
        selectedImageUrl = currentImages[index];
        renderFlashcard(currentWord, currentImages, selectedImageUrl);
    }
}

export function renderFlashcard(wordData, images, selectedImage) {
    currentWord = wordData;
    currentImages = images;
    selectedImageUrl = selectedImage;
    
    const flashcardHtml = `
        <img src="${selectedImage}" alt="${wordData.word}" class="flashcard-image">
        <div class="flashcard-content">
            <div class="word-section">
                <h2 class="word">${wordData.word}</h2>
                <div class="phonetic">${wordData.phonetic || ''}</div>
                <button id="speakBtn" class="pronounce-btn">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="definition-section">
                <p class="definition-text">${wordData.definition}</p>
            </div>
            <div class="example-section">
                <i class="fas fa-quote-left"></i> "${wordData.example}"
            </div>
            <div class="image-options">
                ${images.map((img, idx) => `
                    <div class="image-option ${selectedImage === img ? 'selected' : ''}" onclick="window.selectImageHandler(${idx})">
                        <img src="${img}" alt="Option ${idx + 1}">
                    </div>
                `).join('')}
            </div>
            <div class="flashcard-actions">
                <button id="saveCardBtn" class="btn btn-primary">
                    <i class="fas fa-save"></i> SAVE
                </button>
                <button id="newWordBtn" class="btn btn-secondary">
                    <i class="fas fa-plus"></i> NEW
                </button>
            </div>
        </div>
    `;
    
    const flashcardContainer = document.getElementById('flashcard');
    if (flashcardContainer) {
        flashcardContainer.innerHTML = flashcardHtml;
        
        document.getElementById('speakBtn')?.addEventListener('click', () => speakWord(wordData.word));
        document.getElementById('saveCardBtn')?.addEventListener('click', () => {
            if (onSaveCallback) onSaveCallback();
        });
        document.getElementById('newWordBtn')?.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
        });
    }
}

// Make selectImage available globally for inline onclick
window.selectImageHandler = selectImage;
