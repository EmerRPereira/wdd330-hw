// Show Toast Notification
export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 
                  type === 'error' ? 'fa-exclamation-circle' : 
                  'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Show Loading State
export function showLoading(container) {
    if (container) {
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin spinner"></i> Loading...</div>';
    }
}

// Hide Loading (just a placeholder, actual removal happens when content is rendered)
export function hideLoading() {
    // Loading is replaced when content renders
}

// Shuffle Array
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Format Date
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Truncate Text
export function truncateText(text, maxLength = 80) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Generate Unique ID
export function generateId(word) {
    return `${word}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
