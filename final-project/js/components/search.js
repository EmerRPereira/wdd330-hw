import { DEFAULT_SETTINGS } from '../config/constants.js';

export function updateSearchHistoryUI(history) {
    const historyDiv = document.getElementById('searchHistory');
    if (!historyDiv) return;
    
    if (!history || history.length === 0) {
        historyDiv.innerHTML = '';
        return;
    }
    
    historyDiv.innerHTML = history.map(word => `
        <div class="history-item" onclick="window.searchHistoryWordHandler('${word}')">
            ${word}
        </div>
    `).join('');
}

export function addToSearchHistory(word, searchHistory, saveCallback, updateUICallback) {
    let updatedHistory = searchHistory.filter(w => w !== word);
    updatedHistory.unshift(word);
    if (updatedHistory.length > DEFAULT_SETTINGS.maxHistoryItems) {
        updatedHistory.pop();
    }
    
    if (saveCallback) saveCallback(updatedHistory);
    if (updateUICallback) updateUICallback(updatedHistory);
    
    return updatedHistory;
}

export function setSearchCallbacks(onSearchHistoryWord) {
    window.searchHistoryWordHandler = onSearchHistoryWord;
}