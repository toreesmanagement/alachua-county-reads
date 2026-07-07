(function () {
  const ACR_GUIDE_VERSION = 'RC1.4';

  const state = {
    open: false,
    started: false
  };

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') node.className = value;
      else if (key === 'html') node.innerHTML = value;
      else node.setAttribute(key, value);
    });
    children.forEach(child => node.appendChild(child));
    return node;
  }

  function init() {
    if (document.getElementById('acrGuidePanel')) return;

    const launcher = el('button', {
      id: 'acrGuideLauncher',
      class: 'acr-guide-launcher',
      type: 'button',
      'aria-label': 'Open the ACR Guide'
    });

    launcher.innerHTML = `
      <span class="acr-guide-launcher-icon"><span class="material-symbols-rounded">support_agent</span></span>
      <span class="acr-guide-launcher-copy"><strong>Need help finding the right program?</strong><span>Talk with the ACR Guide</span></span>
      <span class="material-symbols-rounded">arrow_forward</span>
    `;
    launcher.addEventListener('click', openGuide);

    const panel = el('section', {
      id: 'acrGuidePanel',
      class: 'acr-guide-panel hidden',
      'aria-label': 'ACR Guide'
    });

    panel.innerHTML = `
      <div class="acr-guide-header">
        <div class="acr-guide-identity">
          <div class="acr-guide-avatar"><span class="material-symbols-rounded">support_agent</span></div>
          <div class="acr-guide-title"><strong>ACR Guide</strong><span>Here to help you find literacy support</span></div>
        </div>
        <button class="acr-guide-close" type="button" aria-label="Close Guide">✕</button>
      </div>
      <div id="acrGuideBody" class="acr-guide-body" aria-live="polite"></div>
      <div class="acr-guide-footer">
        <div class="acr-guide-input-row">
          <input id="acrGuideInput" type="text" placeholder="Type a question, like GED or Spanish" aria-label="Ask the ACR Guide a question" />
          <button id="acrGuideSend" type="button" aria-label="Send question"><span class="material-symbols-rounded">send</span></button>
        </div>
        <p class="acr-guide-note">The Guide uses information on this website to help you navigate literacy resources. Please confirm details directly with providers.</p>
      </div>
    `;

    panel.querySelector('.acr-guide-close').addEventListener('click', closeGuide);
    panel.querySelector('#acrGuideSend').addEventListener('click', handleTypedQuestion);
    panel.querySelector('#acrGuideInput').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleTypedQuestion();
    });

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const params = new URLSearchParams(window.location.search);
    const guideIntent = params.get('guide');
    if (guideIntent) {
      setTimeout(() => {
        openGuide();
        chooseIntent(guideIntent);
      }, 600);
    }
  }

  function openGuide() {
    document.getElementById('acrGuideLauncher')?.classList.add('hidden');
    document.getElementById('acrGuidePanel')?.classList.remove('hidden');
    state.open = true;

    if (!state.started) {
      state.started = true;
      showWelcome();
    }

    setTimeout(() => document.getElementById('acrGuideInput')?.focus(), 200);
  }

  function closeGuide() {
    document.getElementById('acrGuidePanel')?.classList.add('hidden');
    document.getElementById('acrGuideLauncher')?.classList.remove('hidden');
    state.open = false;
  }

  function body() {
    return document.getElementById('acrGuideBody');
  }

  function addMessage(type, html) {
    const wrapper = el('div', { class: `acr-guide-message ${type}` });
    const bubble = el('div', { class: 'acr-guide-bubble', html });
    wrapper.appendChild(bubble);
    body().appendChild(wrapper);
    body().scrollTop = body().scrollHeight;
  }

  function addActions(actions) {
    const actionsWrap = el('div', { class: 'acr-guide-actions' });
    actions.forEach(action => {
      const button = el('button', {
        type: 'button',
        class: 'acr-guide-action' + (action.primary ? ' primary' : '')
      });
      button.innerHTML = `<span class="material-symbols-rounded">${action.icon || 'arrow_forward'}</span>${action.label}`;
      button.addEventListener('click', action.onClick);
      actionsWrap.appendChild(button);
    });
    body().appendChild(actionsWrap);
    body().scrollTop = body().scrollHeight;
  }

  function showWelcome() {
    addMessage('guide', `<strong>Welcome to Alachua County Reads.</strong><br>I'm the ACR Guide. I can help you find literacy programs, explain this site, and help you take the next step.`);
    addMessage('guide', `What would you like to do today?`);
    showMainActions();
  }

  function showMainActions() {
    addActions([
      { label: 'Find reading help', icon: 'menu_book', primary: true, onClick: () => chooseIntent('reading') },
      { label: 'Help my child', icon: 'family_restroom', onClick: () => chooseIntent('child') },
      { label: 'Learn English', icon: 'translate', onClick: () => chooseIntent('english') },
      { label: 'Find GED support', icon: 'school', onClick: () => chooseIntent('ged') },
      { label: 'Find programs near me', icon: 'near_me', onClick: () => chooseIntent('nearby') },
      { label: "I'm not sure where to start", icon: 'help', onClick: () => chooseIntent('unsure') }
    ]);
  }

  function chooseIntent(intent) {
    const labels = {
      reading: 'I need reading help',
      child: 'I need help for my child',
      english: 'I want to learn English',
      ged: 'I need GED support',
      nearby: 'Find programs near me',
      free: 'Find free programs',
      spanish: 'Find Spanish-language support',
      submit: 'Submit a program',
      partners: 'Community partners',
      listen: 'Read this page aloud',
      unsure: "I don't know where to start"
    };

    addMessage('user', labels[intent] || intent);

    if (intent === 'listen') {
      if (window.ACRAudio && typeof window.ACRAudio.speakPage === 'function') {
        addMessage('guide', 'Absolutely. I will start reading this page aloud. You can pause or stop the narration using the audio controls.');
        window.ACRAudio.speakPage();
      } else {
        addMessage('guide', 'Audio is available on supported pages. Look for the Listen button near the top of the page.');
      }
      showContinueActions();
      return;
    }

    if (intent === 'submit') {
      addMessage('guide', 'Provider submissions are handled on the Submit a Program page. New programs can be reviewed before they are added publicly.');
      addActions([
        { label: 'Open Submit a Program', icon: 'send', primary: true, onClick: () => { window.location.href = 'submit.html'; } },
        { label: 'Keep looking here', icon: 'arrow_back', onClick: showContinueActions }
      ]);
      return;
    }

    if (intent === 'partners') {
      addMessage('guide', 'Community partners help keep literacy information visible, useful, and connected to real local services.');
      addActions([
        { label: 'Open Community Partners', icon: 'groups', primary: true, onClick: () => { window.location.href = 'partners.html'; } },
        { label: 'Keep looking here', icon: 'arrow_back', onClick: showContinueActions }
      ]);
      return;
    }

    if (intent === 'nearby') {
      if (isProgramsPage()) {
        addMessage('guide', 'I can help with that. If you allow location access, nearby programs will move closer to the top of the list and route buttons can use your location.');
        if (window.ACRProgramsAPI && typeof window.ACRProgramsAPI.useMyLocation === 'function') {
          window.ACRProgramsAPI.useMyLocation();
        }
        scrollToPrograms();
        showContinueActions();
      } else {
        addMessage('guide', 'The nearby program tool is on the Find Programs page. I can take you there now.');
        addActions([
          { label: 'Open nearby programs', icon: 'near_me', primary: true, onClick: () => { window.location.href = 'programs.html?guide=nearby'; } },
          { label: 'Stay here', icon: 'arrow_back', onClick: showContinueActions }
        ]);
      }
      return;
    }

    const intro = {
      reading: 'Good place to start. I will look for programs focused on reading, tutoring, books, and literacy support.',
      child: 'I can help with child literacy options. I will look for programs designed for children and families.',
      english: 'I will look for English learning, ESOL, conversation, and language-support options.',
      ged: 'I will look for GED and adult education support.',
      free: 'I will look for free programs first.',
      spanish: 'I will look for programs with Spanish-language support.',
      unsure: "That's okay. Many people are not sure where to begin. I will show good first-step programs that are free or broadly helpful."
    }[intent] || 'I will look for helpful options.';

    addMessage('guide', intro);

    if (isProgramsPage() && window.ACRProgramsAPI && typeof window.ACRProgramsAPI.filterByGuide === 'function') {
      const matches = window.ACRProgramsAPI.filterByGuide(intent) || [];
      if (matches.length) {
        addMessage('guide', `I found ${matches.length} option${matches.length === 1 ? '' : 's'} that may help. I moved matching programs into the list below.`);
        renderGuideRecommendations(matches.slice(0, 3));
      } else {
        addMessage('guide', "I couldn't find an exact match in the current list. Try viewing all programs or searching by city, language, or need.");
      }
      scrollToPrograms();
      showContinueActions();
    } else {
      addMessage('guide', 'The program finder can show matching options for you. I can open it now.');
      addActions([
        { label: 'Open Find Programs', icon: 'search', primary: true, onClick: () => { window.location.href = `programs.html?guide=${encodeURIComponent(intent)}`; } },
        { label: 'Stay on this page', icon: 'arrow_back', onClick: showContinueActions }
      ]);
    }
  }

  function renderGuideRecommendations(programs) {
    programs.forEach(program => {
      const card = el('div', { class: 'acr-guide-recommendation' });
      const safeName = encodeURIComponent(program.name || '');
      card.innerHTML = `
        <strong>${program.name}</strong>
        <p>${program.location || ''}${program.cost ? ' • ' + program.cost : ''}${program.format ? ' • ' + program.format : ''}</p>
        <p>${program.helps || 'This program may be a helpful place to start.'}</p>
        <div class="acr-guide-mini-actions">
          <button class="primary-mini" type="button" data-open-program="${safeName}">Details</button>
          ${program.address ? `<a href="${getRoute(program.address)}" target="_blank">Directions</a>` : ''}
        </div>
      `;
      const details = card.querySelector('[data-open-program]');
      if (details) details.addEventListener('click', () => {
        if (window.ACRProgramsAPI && typeof window.ACRProgramsAPI.openByName === 'function') {
          window.ACRProgramsAPI.openByName(safeName);
        }
      });
      body().appendChild(card);
    });
    body().scrollTop = body().scrollHeight;
  }

  function showContinueActions() {
    addActions([
      { label: 'Show all programs', icon: 'apps', onClick: () => chooseIntent('all') },
      { label: 'Ask another question', icon: 'question_answer', primary: true, onClick: showMainActions },
      { label: 'Listen to this page', icon: 'volume_up', onClick: () => chooseIntent('listen') }
    ]);
  }

  function handleTypedQuestion() {
    const input = document.getElementById('acrGuideInput');
    const text = (input?.value || '').trim();
    if (!text) return;
    input.value = '';
    addMessage('user', escapeHtml(text));
    respondToText(text);
  }

  function respondToText(text) {
    const q = text.toLowerCase();

    if (q.includes('submit') || q.includes('provider') || q.includes('organization')) return chooseIntent('submit');
    if (q.includes('partner')) return chooseIntent('partners');
    if (q.includes('listen') || q.includes('read aloud') || q.includes('audio')) return chooseIntent('listen');
    if (q.includes('near') || q.includes('location') || q.includes('map') || q.includes('directions') || q.includes('bus')) return chooseIntent('nearby');
    if (q.includes('english') || q.includes('esol') || q.includes('esl') || q.includes('language')) return chooseIntent('english');
    if (q.includes('spanish') || q.includes('espanol')) return chooseIntent('spanish');
    if (q.includes('ged') || q.includes('diploma')) return chooseIntent('ged');
    if (q.includes('child') || q.includes('kid') || q.includes('son') || q.includes('daughter')) return chooseIntent('child');
    if (q.includes('free') || q.includes('cost') || q.includes('money')) return chooseIntent('free');
    if (q.includes('read') || q.includes('literacy') || q.includes('tutor') || q.includes('book')) return chooseIntent('reading');
    if (q.includes('frustrated') || q.includes('embarrass') || q.includes('ashamed') || q.includes('hard')) {
      addMessage('guide', "I'm sorry this has been difficult. You're not alone, and we can take this one step at a time.");
      return chooseIntent('unsure');
    }

    addMessage('guide', "I may not understand that exact question yet, but I can still help you get started. Choose one option below.");
    showMainActions();
  }

  function isProgramsPage() {
    return /programs\.html$|programs\.html\?|\/programs(?:\?|$)/.test(window.location.pathname + window.location.search);
  }

  function scrollToPrograms() {
    const target = document.getElementById('programResults') || document.querySelector('.programs-page');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getRoute(address) {
    const params = new URLSearchParams();
    params.set('api', '1');
    params.set('destination', address);
    params.set('travelmode', 'driving');
    return 'https://www.google.com/maps/dir/?' + params.toString();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    })[char]);
  }

  document.addEventListener('DOMContentLoaded', init);

  window.ACRGuide = {
    open: openGuide,
    close: closeGuide,
    choose: chooseIntent,
    version: ACR_GUIDE_VERSION
  };
})();
