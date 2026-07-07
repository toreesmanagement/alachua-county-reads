function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert('Audio narration is not available in this browser.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88;
  utterance.pitch = 1;
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

function listenSubmitGuide() {
  speakText('This page lets community providers submit a new literacy program. The program will not appear publicly until someone from Alachua County Reads reviews and approves the information.');
}

function getPendingSubmissions() {
  try {
    return JSON.parse(localStorage.getItem('acrPendingSubmissions') || '[]');
  } catch (error) {
    return [];
  }
}

function savePendingSubmissions(items) {
  localStorage.setItem('acrPendingSubmissions', JSON.stringify(items));
}

function getApprovedPrograms() {
  try {
    return JSON.parse(localStorage.getItem('acrApprovedPrograms') || '[]');
  } catch (error) {
    return [];
  }
}

function saveApprovedPrograms(items) {
  localStorage.setItem('acrApprovedPrograms', JSON.stringify(items));
}

function checkedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
}

function selectedAgeGroups() {
  const selected = checkedValues('ageGroups');
  return selected.length ? selected : ['adult'];
}

function buildSubmittedProgram() {
  const support = checkedValues('support');
  const languages = checkedValues('languages');
  const ageGroups = selectedAgeGroups();
  const format = document.getElementById('format').value;
  const cost = document.getElementById('cost').value;
  const location = document.getElementById('location').value;
  const address = document.getElementById('address').value.trim();
  const tags = [];

  if (cost.toLowerCase().includes('free')) tags.push('free');
  if (format.toLowerCase().includes('in-person')) tags.push('in-person');
  if (format.toLowerCase().includes('virtual') || format.toLowerCase().includes('online')) tags.push('virtual');
  if (languages.join(' ').toLowerCase().includes('english')) tags.push('english');
  if (languages.join(' ').toLowerCase().includes('spanish')) tags.push('spanish');
  if (support.join(' ').toLowerCase().includes('transportation')) tags.push('transportation');
  if (support.join(' ').toLowerCase().includes('ged')) tags.push('ged');
  if (support.join(' ').toLowerCase().includes('reading') || support.join(' ').toLowerCase().includes('literacy')) tags.push('reading');
  if (ageGroups.some(age => age !== 'adult')) tags.push('child');

  return {
    id: 'submitted-' + Date.now(),
    status: 'Pending Review',
    submittedAt: new Date().toLocaleString(),
    organization: document.getElementById('organizationName').value.trim(),
    contactPerson: document.getElementById('contactPerson').value.trim(),
    contactEmail: document.getElementById('contactEmail').value.trim(),
    name: document.getElementById('programName').value.trim(),
    ageGroups,
    image: 'images/hero-family.jpg',
    location,
    address,
    latitude: null,
    longitude: null,
    cost,
    format,
    language: languages.join(' / ') || 'English',
    tags: Array.from(new Set(tags)),
    support: support.length ? support : ['Literacy Support'],
    phone: document.getElementById('phoneNumber').value.trim(),
    website: document.getElementById('website').value.trim() || '#',
    helps: document.getElementById('description').value.trim(),
    start: document.getElementById('eligibility').value.trim() || 'Contact the provider for enrollment details.',
    notes: document.getElementById('providerNotes').value.trim(),
    source: 'Provider submission - pending verification'
  };
}

function submitProviderForm(event) {
  event.preventDefault();
  const program = buildSubmittedProgram();
  const pending = getPendingSubmissions();
  pending.push(program);
  savePendingSubmissions(pending);

  const message = document.getElementById('submitMessage');
  message.innerHTML = `
    <strong>Program submitted for review.</strong>
    <p>${program.name} was saved in the review queue. For this board demo, the queue is stored in this browser. In production, this will connect to a secure review database or Airtable/Google Sheets workflow.</p>
    <p><a href="review.html">Open review queue</a></p>
  `;
  message.classList.remove('hidden');
  document.getElementById('providerForm').reset();
}

function renderReviewQueue() {
  const list = document.getElementById('reviewList');
  if (!list) return;

  const pending = getPendingSubmissions();
  const approved = getApprovedPrograms();
  const approvedCount = document.getElementById('approvedCount');
  const pendingCount = document.getElementById('pendingCount');

  if (approvedCount) approvedCount.textContent = approved.length;
  if (pendingCount) pendingCount.textContent = pending.length;

  if (!pending.length) {
    list.innerHTML = '<div class="empty-review"><h2>No pending submissions</h2><p>New provider submissions will appear here for review.</p></div>';
    return;
  }

  list.innerHTML = pending.map(item => `
    <article class="review-card">
      <div>
        <span class="program-status">Pending Review</span>
        <h2>${item.name}</h2>
        <p>${item.helps}</p>
      </div>

      <div class="review-grid">
        <span><strong>Organization:</strong> ${item.organization || 'Not provided'}</span>
        <span><strong>Contact:</strong> ${item.contactPerson || 'Not provided'}</span>
        <span><strong>Email:</strong> ${item.contactEmail || 'Not provided'}</span>
        <span><strong>Phone:</strong> ${item.phone || 'Not provided'}</span>
        <span><strong>Age:</strong> ${item.ageGroups.join(', ')}</span>
        <span><strong>Cost:</strong> ${item.cost}</span>
        <span><strong>Format:</strong> ${item.format}</span>
        <span><strong>Location:</strong> ${item.location}</span>
        <span><strong>Address:</strong> ${item.address || 'Not provided'}</span>
        <span><strong>Language:</strong> ${item.language}</span>
        <span><strong>Support:</strong> ${item.support.join(', ')}</span>
        <span><strong>Submitted:</strong> ${item.submittedAt}</span>
      </div>

      <div class="review-actions">
        <button onclick="approveSubmission('${item.id}')"><span class="material-symbols-rounded">check_circle</span> Approve</button>
        <button class="reject-button" onclick="rejectSubmission('${item.id}')"><span class="material-symbols-rounded">delete</span> Remove</button>
      </div>
    </article>
  `).join('');
}

function approveSubmission(id) {
  const pending = getPendingSubmissions();
  const item = pending.find(program => program.id === id);
  if (!item) return;

  const approved = getApprovedPrograms();
  const approvedProgram = {
    ...item,
    status: 'Approved',
    source: 'Provider submission - approved for board demo',
    approvedAt: new Date().toLocaleString()
  };
  delete approvedProgram.organization;
  delete approvedProgram.contactPerson;
  delete approvedProgram.contactEmail;
  delete approvedProgram.notes;

  approved.push(approvedProgram);
  saveApprovedPrograms(approved);
  savePendingSubmissions(pending.filter(program => program.id !== id));
  renderReviewQueue();
}

function rejectSubmission(id) {
  const pending = getPendingSubmissions();
  savePendingSubmissions(pending.filter(program => program.id !== id));
  renderReviewQueue();
}

function clearDemoSubmissions() {
  if (!confirm('Clear all demo submissions and approvals from this browser?')) return;
  localStorage.removeItem('acrPendingSubmissions');
  localStorage.removeItem('acrApprovedPrograms');
  renderReviewQueue();
}

document.addEventListener('DOMContentLoaded', renderReviewQueue);
