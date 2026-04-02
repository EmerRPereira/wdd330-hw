import { speakWord } from '../services/speech.js';
import { showToast } from '../utils/helpers.js';
import { MESSAGES } from '../config/constants.js';
import { PLACEHOLDER_IMAGE } from '../config/constants.js';

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
    if (currentImages && currentImages[index]) {
        selectedImageUrl = currentImages[index];
        renderFlashcard(currentWord, currentImages, selectedImageUrl);
    }
}

export function renderFlashcard(wordData, images, selectedImage) {
    currentWord = wordData;
    currentImages = images || [];
    
    // Garantir que selectedImage seja uma string válida
    if (!selectedImage || selectedImage === 'undefined') {
        selectedImageUrl = currentImages[0] || PLACEHOLDER_IMAGE;
    } else {
        selectedImageUrl = selectedImage;
    }
    
    // Se não há imagens, mostrar placeholder
    const displayImages = currentImages.length > 0 ? currentImages : [PLACEHOLDER_IMAGE];
    const displaySelectedImage = selectedImageUrl || displayImages[0];
    
    const flashcardHtml = `
        <img src="${displaySelectedImage}" alt="${wordData.word}" class="flashcard-image" onerror="this.src='${PLACEHOLDER_IMAGE}'">
        <div class="flashcard-content">
            <div class="word-section">
                <h2 class="word">${escapeHtml(wordData.word)}</h2>
                <div class="phonetic">${wordData.phonetic || ''}</div>
                <button id="speakBtn" class="pronounce-btn">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="definition-section">
                <p class="definition-text">${escapeHtml(wordData.definition)}</p>
            </div>
            <div class="example-section">
                <i class="fas fa-quote-left"></i> "${escapeHtml(wordData.example || 'No example available.')}"
            </div>
            <div class="image-options">
                ${displayImages.map((img, idx) => `
                    <div class="image-option ${displaySelectedImage === img ? 'selected' : ''}" onclick="window.selectImageHandler(${idx})">
                        <img src="${img}" alt="Option ${idx + 1}" onerror="this.src='${PLACEHOLDER_IMAGE}'">
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
        
        const speakBtn = document.getElementById('speakBtn');
        const saveBtn = document.getElementById('saveCardBtn');
        const newBtn = document.getElementById('newWordBtn');
        
        if (speakBtn) speakBtn.addEventListener('click', () => speakWord(wordData.word));
        if (saveBtn) saveBtn.addEventListener('click', () => {
            if (onSaveCallback) onSaveCallback();
        });
        if (newBtn) newBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
        });
    }
}

// Função auxiliar para escapar HTML (segurança)
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make selectImage available globally for inline onclick
window.selectImageHandler = selectImage;