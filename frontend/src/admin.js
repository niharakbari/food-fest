import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'

// Init Lenis smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Custom Cursor Logic
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power2.out'
    });
  });
}

const addCursorHover = (elements) => {
  if (!cursor) return;
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
};

const API_URL = 'http://localhost:5000/api/v1';

async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    if(data.success) renderCategories(data.data);
  } catch(e) { console.log('Error fetching categories.', e); }
}

async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/events`);
    const data = await res.json();
    if(data.success) renderEvents(data.data);
  } catch(e) { console.log('Error fetching events.', e); }
}

async function fetchChefs() {
  try {
    const res = await fetch(`${API_URL}/chefs`);
    const data = await res.json();
    if(data.success) renderChefs(data.data);
  } catch(e) { console.log('Error fetching chefs.', e); }
}

async function fetchJourneys() {
  try {
    const res = await fetch(`${API_URL}/journeys`);
    const data = await res.json();
    if(data.success) renderJourneys(data.data);
  } catch(e) { console.log('Error fetching journeys.', e); }
}

async function fetchGallery() {
  try {
    const res = await fetch(`${API_URL}/gallery`);
    const data = await res.json();
    if(data.success) renderGallery(data.data);
  } catch(e) { console.log('Error fetching gallery.', e); }
}

// Custom Modal Logic
const modalOverlay = document.getElementById('custom-modal-overlay');
const modalTitle = document.getElementById('custom-modal-title');
const modalBody = document.getElementById('custom-modal-body');
const btnClose = document.getElementById('custom-modal-close');
const btnCancel = document.getElementById('custom-modal-cancel');
const btnConfirm = document.getElementById('custom-modal-confirm');

let currentModalResolve = null;

function openCustomModal(title, htmlContent, onConfirm) {
  modalTitle.innerText = title;
  modalBody.innerHTML = htmlContent;
  modalOverlay.classList.remove('hidden');

  return new Promise((resolve) => {
    currentModalResolve = resolve;

    const cleanup = () => {
      modalOverlay.classList.add('hidden');
      btnClose.removeEventListener('click', onCancelClick);
      btnCancel.removeEventListener('click', onCancelClick);
      btnConfirm.removeEventListener('click', onConfirmClick);
    };

    const onCancelClick = () => { cleanup(); resolve(null); };
    const onConfirmClick = () => {
      const result = onConfirm();
      cleanup();
      resolve(result);
    };

    btnClose.addEventListener('click', onCancelClick);
    btnCancel.addEventListener('click', onCancelClick);
    btnConfirm.addEventListener('click', onConfirmClick);
  });
}

function confirmAction(message) {
  return openCustomModal("Confirm Action", `<p style="margin: 0; font-size: 0.95rem; color: var(--color-text);">${message}</p>`, () => true);
}

// Inline Edit Helpers
window.editImage = async (imgElement) => {
  const newUrl = await openCustomModal(
    "Edit Image URL",
    `<input type="text" id="modal-input-url" value="${imgElement.src}" placeholder="https://..." />`,
    () => document.getElementById('modal-input-url').value
  );
  if (newUrl) imgElement.src = newUrl;
};

window.editIcon = async (spanElement) => {
  const newIcon = await openCustomModal(
    "Edit Icon/Emoji",
    `<input type="text" id="modal-input-icon" value="${spanElement.innerText}" placeholder="e.g., 🍰" />`,
    () => document.getElementById('modal-input-icon').value
  );
  if (newIcon) spanElement.innerText = newIcon;
};

window.editDate = async (card, spanElement) => {
  const newDate = await openCustomModal(
    "Edit Date",
    `<input type="date" id="modal-input-date" value="${card.dataset.date || ''}" />`,
    () => document.getElementById('modal-input-date').value
  );
  if (newDate) {
      card.dataset.date = newDate;
      spanElement.innerText = new Date(newDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
};

window.editTimeStatus = async (card) => {
    const result = await openCustomModal(
        "Edit Time & Status",
        `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <label style="font-size: 0.8rem; font-weight: 600;">Start Time</label>
            <input type="time" id="modal-input-start" value="${card.dataset.start || ''}" step="1" />
            
            <label style="font-size: 0.8rem; font-weight: 600;">End Time</label>
            <input type="time" id="modal-input-end" value="${card.dataset.end || ''}" step="1" />
            
            <label style="font-size: 0.8rem; font-weight: 600;">Status</label>
            <select id="modal-input-status">
                <option value="upcoming" ${card.dataset.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                <option value="live" ${card.dataset.status === 'live' ? 'selected' : ''}>Live</option>
                <option value="past" ${card.dataset.status === 'past' ? 'selected' : ''}>Past</option>
            </select>
        </div>
        `,
        () => ({
            start: document.getElementById('modal-input-start').value,
            end: document.getElementById('modal-input-end').value,
            status: document.getElementById('modal-input-status').value
        })
    );

    if (result) {
        card.dataset.start = result.start;
        card.dataset.end = result.end;
        card.dataset.status = result.status;
        const timeSpan = card.querySelector('.event-meta-item:nth-child(3)');
        if (timeSpan) {
            timeSpan.innerHTML = `<span class="meta-icon">🕐</span> ${result.start.slice(0,5)} – ${result.end.slice(0,5)}`;
        }
        const statusPill = card.querySelector('.event-status-pill');
        if (statusPill) {
            statusPill.className = `event-status-pill ${result.status}`;
            statusPill.innerText = result.status;
        }
    }
};

// ================= CATEGORIES =================
function renderCategories(categories) {
  const container = document.getElementById('category-container');
  container.innerHTML = `
    <div style="width: 100%; text-align: center; margin-bottom: 20px;">
        <button onclick="addCategory()" class="cta-button primary" style="padding: 10px 20px;">+ Add Category</button>
    </div>
    <div id="category-list" style="display:contents;">
      ${categories.map(c => `
      <div class="category-pill" style="display: flex; align-items: center; gap: 10px;" data-id="${c.id}">
          <span class="cat-icon" style="cursor:pointer;" onclick="editIcon(this)">${c.icon}</span>
          <span class="cat-name" contenteditable="true" spellcheck="false">${c.name}</span>
          <div class="card-actions-bar" style="margin: 0; padding: 5px; background: transparent; backdrop-filter: none;">
            <button onclick="updateCategory(this)">Save</button>
            <button onclick="deleteCategory(${c.id})" class="delete-btn">Delete</button>
          </div>
      </div>
      `).join('')}
    </div>
  `;
  addCursorHover(document.querySelectorAll('button'));
}
window.addCategory = () => {
    const list = document.getElementById('category-list');
    list.insertAdjacentHTML('afterbegin', `
      <div class="category-pill new-item" style="display: flex; align-items: center; gap: 10px;" data-id="new">
          <span class="cat-icon" style="cursor:pointer;" onclick="editIcon(this)">❓</span>
          <span class="cat-name" contenteditable="true" spellcheck="false">New Category</span>
          <div class="card-actions-bar" style="margin: 0; padding: 5px; background: transparent; backdrop-filter: none;">
            <button onclick="saveNewCategory(this)">Save</button>
            <button onclick="this.closest('.category-pill').remove()" class="delete-btn">Cancel</button>
          </div>
      </div>
    `);
};
window.saveNewCategory = async (btn) => {
    const card = btn.closest('.category-pill');
    const data = {
        name: card.querySelector('.cat-name').innerText.trim(),
        icon: card.querySelector('.cat-icon').innerText.trim()
    };
    await fetch(`${API_URL}/categories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    fetchCategories();
};
window.updateCategory = async (btn) => {
    const card = btn.closest('.category-pill');
    const id = card.dataset.id;
    const data = {
        name: card.querySelector('.cat-name').innerText.trim(),
        icon: card.querySelector('.cat-icon').innerText.trim()
    };
    await fetch(`${API_URL}/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
};
window.deleteCategory = async (id) => {
    const confirmed = await confirmAction("Are you sure you want to delete this category?");
    if (!confirmed) return;
    await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
};

// ================= EVENTS =================
function renderEvents(events) {
  const container = document.getElementById('events-container');
  container.innerHTML = `
    <div style="width: 100%; text-align: center; margin-bottom: 20px;">
        <button onclick="addEvent()" class="cta-button primary" style="padding: 10px 20px;">+ Add Event</button>
    </div>
    <div id="event-list" style="display:contents;">
      ${events.map(e => `
      <div class="event-card-wrapper" style="position:relative;">
        <div class="card-actions-bar">
            <button onclick="editTimeStatus(this.closest('.event-card-wrapper').querySelector('.event-card'))">Edit Times</button>
            <button onclick="updateEvent(this)">Save</button>
            <button onclick="deleteEvent(${e.id})" class="delete-btn">Delete</button>
        </div>
        <div class="event-card" data-id="${e.id}" data-date="${e.event_date.split('T')[0]}" data-start="${e.start_time}" data-end="${e.end_time}" data-status="${e.status}" data-cat="${e.category_id || ''}">
          <div class="event-info">
            <div>
              ${e.status === 'live' ? '<span class="live-badge">LIVE NOW</span>' : ''}
              <div class="event-meta">
                <span class="meta-date" style="cursor:pointer;" onclick="editDate(this.closest('.event-card'), this)">${new Date(e.event_date).toLocaleDateString()}</span>
                <span class="meta-location" contenteditable="true" spellcheck="false">${e.location}</span>
              </div>
              <h3 class="event-title" contenteditable="true" spellcheck="false">${e.name}</h3>
            </div>
            <p class="event-desc" contenteditable="true" spellcheck="false">${e.description}</p>
          </div>
          <div class="event-image" style="cursor:pointer;" onclick="editImage(this.querySelector('img'))">
            <img src="${e.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'}" alt="${e.name}">
          </div>
        </div>
      </div>
      `).join('')}
    </div>
  `;
  addCursorHover(document.querySelectorAll('button'));
}
window.addEvent = () => {
    const list = document.getElementById('event-list');
    list.insertAdjacentHTML('afterbegin', `
      <div class="event-card-wrapper new-item" style="padding: 10px;">
        <div class="card-actions-bar">
            <button onclick="editTimeStatus(this.closest('.event-card-wrapper').querySelector('.event-card'))">Edit Times</button>
            <button onclick="saveNewEvent(this)">Save</button>
            <button onclick="this.closest('.event-card-wrapper').remove()" class="delete-btn">Cancel</button>
        </div>
        <div class="event-card" data-id="new" data-date="2027-10-15" data-start="12:00:00" data-end="14:00:00" data-status="upcoming" data-cat="1">
          <div class="event-info">
            <div>
              <div class="event-meta">
                <span class="meta-date" style="cursor:pointer;" onclick="editDate(this.closest('.event-card'), this)">10/15/2027</span>
                <span class="meta-location" contenteditable="true" spellcheck="false">New Location</span>
              </div>
              <h3 class="event-title" contenteditable="true" spellcheck="false">New Event Title</h3>
            </div>
            <p class="event-desc" contenteditable="true" spellcheck="false">Event description goes here...</p>
          </div>
          <div class="event-image" style="cursor:pointer;" onclick="editImage(this.querySelector('img'))">
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" alt="New Event">
          </div>
        </div>
      </div>
    `);
};
window.saveNewEvent = async (btn) => {
    const wrapper = btn.closest('.event-card-wrapper');
    const card = wrapper.querySelector('.event-card');
    const data = {
        name: card.querySelector('.event-title').innerText.trim(),
        description: card.querySelector('.event-desc').innerText.trim(),
        location: card.querySelector('.meta-location').innerText.trim(),
        image_url: card.querySelector('.event-image img').src,
        event_date: card.dataset.date,
        start_time: card.dataset.start,
        end_time: card.dataset.end,
        status: card.dataset.status,
        category_id: card.dataset.cat ? parseInt(card.dataset.cat) : null
    };
    await fetch(`${API_URL}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    fetchEvents();
};
window.updateEvent = async (btn) => {
    const wrapper = btn.closest('.event-card-wrapper');
    const card = wrapper.querySelector('.event-card');
    const id = card.dataset.id;
    const data = {
        name: card.querySelector('.event-title').innerText.trim(),
        description: card.querySelector('.event-desc').innerText.trim(),
        location: card.querySelector('.meta-location').innerText.trim(),
        image_url: card.querySelector('.event-image img').src,
        event_date: card.dataset.date,
        start_time: card.dataset.start,
        end_time: card.dataset.end,
        status: card.dataset.status,
        category_id: card.dataset.cat ? parseInt(card.dataset.cat) : null
    };
    await fetch(`${API_URL}/events/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
};
window.deleteEvent = async (id) => {
    const confirmed = await confirmAction("Are you sure you want to delete this event?");
    if (!confirmed) return;
    await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
    fetchEvents();
};

// ================= CHEFS =================
function renderChefs(chefs) {
  const container = document.getElementById('chefs-container');
  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; margin-bottom: 20px;">
        <button onclick="addChef()" class="cta-button primary" style="padding: 10px 20px;">+ Add Chef</button>
    </div>
    <div id="chef-list" style="display:contents;">
      ${chefs.map(c => `
      <div class="chef-card-wrapper">
        <div class="card-actions-bar">
            <button onclick="updateChef(this)">Save</button>
            <button onclick="deleteChef(${c.id})" class="delete-btn">Delete</button>
        </div>
        <div class="chef-card" data-id="${c.id}">
          <div class="chef-image" style="cursor:pointer;" onclick="editImage(this.querySelector('img'))">
            <img src="${c.image_url || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80'}" alt="${c.name}">
          </div>
          <h3 class="chef-name" contenteditable="true" spellcheck="false">${c.name}</h3>
          <p class="chef-specialty" contenteditable="true" spellcheck="false">${c.specialty}</p>
          <p class="chef-desc" contenteditable="true" spellcheck="false" style="font-size: 0.9rem; margin-top:0.5rem; opacity:0.8;">${c.description || 'Add description...'}</p>
        </div>
      </div>
      `).join('')}
    </div>
  `;
  addCursorHover(document.querySelectorAll('button'));
}
window.addChef = () => {
    const list = document.getElementById('chef-list');
    list.insertAdjacentHTML('afterbegin', `
      <div class="chef-card-wrapper new-item" style="padding: 10px;">
        <div class="card-actions-bar">
            <button onclick="saveNewChef(this)">Save</button>
            <button onclick="this.closest('.chef-card-wrapper').remove()" class="delete-btn">Cancel</button>
        </div>
        <div class="chef-card" data-id="new">
          <div class="chef-image" style="cursor:pointer;" onclick="editImage(this.querySelector('img'))">
            <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80" alt="New Chef">
          </div>
          <h3 class="chef-name" contenteditable="true" spellcheck="false">New Chef</h3>
          <p class="chef-specialty" contenteditable="true" spellcheck="false">Specialty</p>
          <p class="chef-desc" contenteditable="true" spellcheck="false" style="font-size: 0.9rem; margin-top:0.5rem; opacity:0.8;">Chef description here...</p>
        </div>
      </div>
    `);
};
window.saveNewChef = async (btn) => {
    const wrapper = btn.closest('.chef-card-wrapper');
    const card = wrapper.querySelector('.chef-card');
    const data = {
        name: card.querySelector('.chef-name').innerText.trim(),
        specialty: card.querySelector('.chef-specialty').innerText.trim(),
        description: card.querySelector('.chef-desc').innerText.trim(),
        image_url: card.querySelector('.chef-image img').src
    };
    await fetch(`${API_URL}/chefs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    fetchChefs();
};
window.updateChef = async (btn) => {
    const wrapper = btn.closest('.chef-card-wrapper');
    const card = wrapper.querySelector('.chef-card');
    const id = card.dataset.id;
    const data = {
        name: card.querySelector('.chef-name').innerText.trim(),
        specialty: card.querySelector('.chef-specialty').innerText.trim(),
        description: card.querySelector('.chef-desc').innerText.trim(),
        image_url: card.querySelector('.chef-image img').src
    };
    await fetch(`${API_URL}/chefs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
};
window.deleteChef = async (id) => {
    const confirmed = await confirmAction("Are you sure you want to delete this chef?");
    if (!confirmed) return;
    await fetch(`${API_URL}/chefs/${id}`, { method: 'DELETE' });
    fetchChefs();
};

// ================= JOURNEYS =================
function renderJourneys(journeys) {
  const container = document.getElementById('journey-container');
  if (!container) return;
  
  let html = `
    <div style="width: 100%; text-align: center; margin-bottom: 20px;">
        <button onclick="addJourney()" class="cta-button primary" style="padding: 10px 20px;">+ Add Journey Item</button>
    </div>
    <div class="timeline-line"></div>
    <div id="journey-list" style="display:contents;">
  `;
  
  journeys.forEach((j, index) => {
    const isRight = index % 2 !== 0 ? 'right' : '';
    html += `
      <div class="timeline-item ${isRight}" style="opacity: 1;" data-id="${j.id}">
        <div class="timeline-content" style="position: relative;">
          <div class="card-actions-bar" style="margin-left: 0; margin-bottom: 15px;">
              <button onclick="updateJourney(this)">Save</button>
              <button onclick="deleteJourney(${j.id})" class="delete-btn">Delete</button>
          </div>
          <h3 class="journey-year" contenteditable="true" spellcheck="false">${j.year}</h3>
          <p class="journey-desc" contenteditable="true" spellcheck="false">${j.description}</p>
        </div>
        <div class="timeline-image" style="cursor:pointer;" onclick="editImage(this.querySelector('img'))">
          <img src="${j.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80'}" alt="${j.year}">
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  container.innerHTML = html;
  addCursorHover(document.querySelectorAll('button'));
}

window.addJourney = () => {
    const list = document.getElementById('journey-list');
    list.insertAdjacentHTML('afterbegin', `
      <div class="timeline-item new-item" style="opacity: 1; padding: 10px;" data-id="new">
        <div class="timeline-content">
          <div class="card-actions-bar" style="margin-left: 0; margin-bottom: 15px;">
              <button onclick="saveNewJourney(this)">Save</button>
              <button onclick="this.closest('.timeline-item').remove()" class="delete-btn">Cancel</button>
          </div>
          <h3 class="journey-year" contenteditable="true" spellcheck="false">YYYY</h3>
          <p class="journey-desc" contenteditable="true" spellcheck="false">New Journey description...</p>
        </div>
        <div class="timeline-image" style="cursor:pointer;" onclick="editImage(this.querySelector('img'))">
          <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80" alt="New Journey">
        </div>
      </div>
    `);
};
window.saveNewJourney = async (btn) => {
    const card = btn.closest('.timeline-item');
    const data = {
        year: card.querySelector('.journey-year').innerText.trim(),
        description: card.querySelector('.journey-desc').innerText.trim(),
        image_url: card.querySelector('.timeline-image img').src
    };
    await fetch(`${API_URL}/journeys`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    fetchJourneys();
};
window.updateJourney = async (btn) => {
    const card = btn.closest('.timeline-item');
    const id = card.dataset.id;
    const data = {
        year: card.querySelector('.journey-year').innerText.trim(),
        description: card.querySelector('.journey-desc').innerText.trim(),
        image_url: card.querySelector('.timeline-image img').src
    };
    await fetch(`${API_URL}/journeys/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
};
window.deleteJourney = async (id) => {
    const confirmed = await confirmAction("Are you sure you want to delete this journey item?");
    if (!confirmed) return;
    await fetch(`${API_URL}/journeys/${id}`, { method: 'DELETE' });
    fetchJourneys();
};


// ================= GALLERY =================
function renderGallery(images) {
  const container = document.getElementById('gallery-container');
  if (!container) return;
  
  let html = `
    <div style="width: 100%; text-align: center; margin-bottom: 20px; column-span: all;">
        <button onclick="addGalleryImage()" class="cta-button primary" style="padding: 10px 20px;">+ Add Image</button>
    </div>
    <div id="gallery-list" style="display:contents;">
  `;
  
  images.forEach((img) => {
    html += `
      <div class="gallery-item-wrapper" style="position: relative;" data-id="${img.id}">
        <div class="card-actions-bar" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
            <button onclick="updateGallery(this)">Save</button>
            <button onclick="deleteGallery(${img.id})" class="delete-btn">Delete</button>
        </div>
        <img src="${img.image_url}" class="m-item" style="cursor:pointer;" onclick="editImage(this)" />
      </div>
    `;
  });
  
  html += `</div>`;
  container.innerHTML = html;
  addCursorHover(document.querySelectorAll('button'));
}

window.addGalleryImage = () => {
    const list = document.getElementById('gallery-list');
    list.insertAdjacentHTML('afterbegin', `
      <div class="gallery-item-wrapper new-item" style="position: relative; padding: 5px;">
        <div class="card-actions-bar" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
            <button onclick="saveNewGallery(this)">Save</button>
            <button onclick="this.closest('.gallery-item-wrapper').remove()" class="delete-btn">Cancel</button>
        </div>
        <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" class="m-item" style="cursor:pointer;" onclick="editImage(this)" />
      </div>
    `);
};
window.saveNewGallery = async (btn) => {
    const wrapper = btn.closest('.gallery-item-wrapper');
    const data = {
        image_url: wrapper.querySelector('img').src
    };
    await fetch(`${API_URL}/gallery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    fetchGallery();
};
window.updateGallery = async (btn) => {
    const wrapper = btn.closest('.gallery-item-wrapper');
    const id = wrapper.dataset.id;
    const data = {
        image_url: wrapper.querySelector('img').src
    };
    await fetch(`${API_URL}/gallery/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
};
window.deleteGallery = async (id) => {
    const confirmed = await confirmAction("Are you sure you want to delete this image?");
    if (!confirmed) return;
    await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
    fetchGallery();
};

// Custom Modal Logic
const modalOverlay = document.getElementById('custom-modal-overlay');
const modalTitle = document.getElementById('custom-modal-title');
const modalBody = document.getElementById('custom-modal-body');
const btnClose = document.getElementById('custom-modal-close');
const btnCancel = document.getElementById('custom-modal-cancel');
const btnConfirm = document.getElementById('custom-modal-confirm');

let currentModalResolve = null;

function openCustomModal(title, htmlContent, onConfirm) {
  modalTitle.innerText = title;
  modalBody.innerHTML = htmlContent;
  modalOverlay.classList.remove('hidden');

  return new Promise((resolve) => {
    currentModalResolve = resolve;

    const cleanup = () => {
      modalOverlay.classList.add('hidden');
      btnClose.removeEventListener('click', onCancelClick);
      btnCancel.removeEventListener('click', onCancelClick);
      btnConfirm.removeEventListener('click', onConfirmClick);
    };

    const onCancelClick = () => { cleanup(); resolve(null); };
    const onConfirmClick = () => {
      const result = onConfirm();
      cleanup();
      resolve(result);
    };

    btnClose.addEventListener('click', onCancelClick);
    btnCancel.addEventListener('click', onCancelClick);
    btnConfirm.addEventListener('click', onConfirmClick);
  });
}

function confirmAction(message) {
  return openCustomModal("Confirm Action", `<p style="margin: 0; font-size: 0.95rem; color: var(--color-text);">${message}</p>`, () => true);
}


// Init
document.addEventListener('DOMContentLoaded', () => {
  addCursorHover(document.querySelectorAll('a, button'));
  fetchCategories();
  fetchEvents();
  fetchChefs();
  fetchJourneys();
  fetchGallery();
});
