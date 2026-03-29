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
        libraryGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No words saved yet. Search and save words to build your vocabulary!</p>';
        return;
    }

    libraryGrid.innerHTML = library.map(card => `
        <div class="library-card" onclick="window.viewWordHandler('${card.word}')">
            <img src="${card.imageUrl}" alt="${card.word}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <div class="library-card-content">
                <div class="library-word">${card.word}</div>
                <div class="library-definition">${truncateText(card.definition, 80)}</div>
                <div class="library-actions">
                    <button class="btn-icon" onclick="event.stopPropagation(); window.removeFromLibraryHandler('${card.id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                    <button class="btn-icon" onclick="event.stopPropagation(); window.speakWordHandler('${card.word}')">
                        <i class="fas fa-volume-up"></i> Listen
                    </button>
                </div>
            </div>
        </div>
    `).join('');
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