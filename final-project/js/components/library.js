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
    
   
