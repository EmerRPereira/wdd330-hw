import { speakWord } from '../services/speech.js';
import { truncateText } from '../utils/helpers.js';
import { PLACEHOLDER_IMAGE } from '../config/constants.js';
import { speakWord } from '../services/speech.js';
import { truncateText } from '../utils/helpers.js';

let library = [];
let onRemoveCallback = null;
let onViewCallback = null;

export function setLibraryCallbacks(onRemove, onView) {
    onRemoveCallback = onRemove;
    onViewCallback = onView;
}

export function setLibraryData(data) {
    library = data;
}

export function getLibraryData() {
    return library;
}

export function renderLibrary() {
    const libraryGrid = document.getElementById('libraryGrid');
    
    if (!libraryGrid) return;
    
    if (library.length === 0) {
        libraryGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">✨ No words saved yet. Search and save words to build your vocabulary! ✨</p>';
        return;
    }

    libraryGrid.innerHTML = library.map(card => `
        <div class="library-card" onclick="window.viewWordHandler('${escapeHtml(card.word)}')">
            <img src="${card.imageUrl || PLACEHOLDER_IMAGE}" 
                 alt="${escapeHtml(card.word)}" 
                 onerror="this.src='${PLACEHOLDER_IMAGE}'">
            <div class="library-card-content">
                <div class="library-word">${escapeHtml(card.word)}</div>
                <div class="library-definition">${truncateText(card.definition || '', 80)}</div>
                <div class="library-actions">
                    <button class="btn-icon" onclick="event.stopPropagation(); window.removeFromLibraryHandler('${card.id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                    <button class="btn-icon" onclick="event.stopPropagation(); window.speakWordHandler('${escapeHtml(card.word)}')">
                        <i class="fas fa-volume-up"></i> Listen
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Adicionar função escapeHtml
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make handlers available globally
window.viewWordHandler = (word) => {
    if (onViewCallback) onViewCallback(word);
};

window.removeFromLibraryHandler = (id) => {
    if (onRemoveCallback) onRemoveCallback(id);
};

window.speakWordHandler = (word) => {
    speakWord(word);
};