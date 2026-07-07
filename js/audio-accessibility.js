/* Alachua County Reads RC1.3 Audio Accessibility */
(function () {
  const state = {
    speed: 0.75,
    voices: [],
    lastText: '',
    lastLang: 'en-US'
  };

  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    state.voices = window.speechSynthesis.getVoices() || [];
  }

  function chooseVoice(lang) {
    loadVoices();
    if (!state.voices.length) return null;
    const langPrefix = (lang || 'en-US').slice(0, 2).toLowerCase();
    return state.voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix)) ||
           state.voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) ||
           null;
  }

  function updateStatus(message) {
    document.querySelectorAll('.audio-status').forEach(el => {
      el.textContent = message;
    });
  }

  function speak(text, lang) {
    if (!text || !text.trim()) return;

    if (!('speechSynthesis' in window)) {
      alert('Audio narration is not available in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = state.speed;
    utterance.pitch = 1;
    utterance.lang = lang || state.lastLang || 'en-US';

    const voice = chooseVoice(utterance.lang);
    if (voice) utterance.voice = voice;

    state.lastText = text;
    state.lastLang = utterance.lang;

    utterance.onstart = () => updateStatus('Reading aloud...');
    utterance.onend = () => updateStatus('Audio finished.');
    utterance.onerror = () => updateStatus('Audio stopped.');

    window.speechSynthesis.speak(utterance);
  }

  function getPageText() {
    const body = document.body;
    const title = body.getAttribute('data-audio-title') || document.title || 'Alachua County Reads';
    const text = body.getAttribute('data-audio-text') || '';
    return `${title}. ${text}`;
  }

  function speakPage() {
    speak(getPageText(), document.documentElement.lang === 'es' ? 'es-US' : 'en-US');
  }

  function pauseOrResume() {
    if (!('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      updateStatus('Audio paused.');
      return;
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      updateStatus('Reading aloud...');
      return;
    }
    if (state.lastText) speak(state.lastText, state.lastLang);
  }

  function stop() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    updateStatus('Audio stopped.');
  }

  function setSpeed(value) {
    const parsed = parseFloat(value);
    state.speed = isNaN(parsed) ? 0.75 : parsed;
    updateStatus(`Speed set to ${state.speed === 0.75 ? 'slow' : state.speed === 0.9 ? 'normal' : 'fast'}.`);
  }

  function speakSelection() {
    const selection = window.getSelection ? String(window.getSelection()).trim() : '';
    if (selection) speak(selection, 'en-US');
  }

  window.addEventListener('beforeunload', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  window.ACRAudio = {
    speak,
    speakPage,
    pauseOrResume,
    stop,
    setSpeed,
    speakSelection
  };
})();
