import { showToast } from '../utils/helpers.js';
import { MESSAGES } from '../config/constants.js';

export function speakWord(word, language = 'en') {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = language === 'en' ? 'en-US' : 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    } else {
        const lang = document.getElementById('languageSelect')?.value || 'en';
        showToast(MESSAGES[lang]?.speechNotSupported || MESSAGES.en.speechNotSupported, 'error');
    }
}

export function stopSpeech() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
}
