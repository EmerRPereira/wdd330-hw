import { showToast, shuffleArray } from '../utils/helpers.js';
import { MESSAGES } from '../config/constants.js';

let reviewQueue = [];
let currentIndex = 0;
let currentLanguage = 'en';
let onCompleteCallback = null;

export function setReviewCallbacks(onComplete) {
    onCompleteCallback = onComplete;
}

export function startReviewMode(library, onUpdate) {
    if (library.length === 0) {
        const lang = document.getElementById('languageSelect')?.value || 'en';
        showToast(MESSAGES[lang]?.emptyLibrary || MESSAGES.en.emptyLibrary, 'warning');
        return;
    }
    
    reviewQueue = shuffleArray([...library]);
    currentIndex = 0;
    currentLanguage = document.getElementById('languageSelect')?.value || 'en';
    showNextReview();
    
    if (onUpdate) onUpdate();
}

function showNextReview() {
    if (currentIndex >= reviewQueue.length) {
        closeReview();
        showToast(MESSAGES[currentLanguage]?.reviewComplete || MESSAGES.en.reviewComplete, 'success');
        if (onCompleteCallback) onCompleteCallback();
        return;
    }
    
    const card = reviewQueue[currentIndex];
    const reviewWord = document.getElementById('reviewWord');
    const reviewDefinition = document.getElementById('reviewDefinition');
    const reviewModal = document.getElementById('reviewModal');
    
    if (reviewWord) reviewWord.textContent = card.word;
    if (reviewDefinition) reviewDefinition.textContent = card.definition;
    if (reviewModal) reviewModal.style.display = 'flex';
}

export function reviewAnswer(isCorrect) {
    const card = reviewQueue[currentIndex];
    
    if (isCorrect) {
        card.reviewCount++;
        card.lastReviewed = new Date().toISOString();
        showToast(MESSAGES[currentLanguage]?.correct || MESSAGES.en.correct, 'success');
    } else {
        showToast(MESSAGES[currentLanguage]?.wrong || MESSAGES.en.wrong, 'warning');
        reviewQueue.push(card);
    }
    
    currentIndex++;
    
    // Save updated review count
    const library = JSON.parse(localStorage.getItem('vocabulary_library') || '[]');
    const index = library.findIndex(item => item.id === card.id);
    if (index !== -1) {
        library[index] = card;
        localStorage.setItem('vocabulary_library', JSON.stringify(library));
    }
    
    showNextReview();
}

export function closeReview() {
    const reviewModal = document.getElementById('reviewModal');
    if (reviewModal) reviewModal.style.display = 'none';
    currentIndex = 0;
    reviewQueue = [];
}

// Setup event listeners for review modal
document.addEventListener('DOMContentLoaded', () => {
    const reviewCorrect = document.getElementById('reviewCorrect');
    const reviewWrong = document.getElementById('reviewWrong');
    const reviewClose = document.getElementById('reviewClose');
    
    if (reviewCorrect) reviewCorrect.addEventListener('click', () => reviewAnswer(true));
    if (reviewWrong) reviewWrong.addEventListener('click', () => reviewAnswer(false));
    if (reviewClose) reviewClose.addEventListener('click', closeReview);
});