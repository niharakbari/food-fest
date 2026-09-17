import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initAnimations } from './animations'

gsap.registerPlugin(ScrollTrigger)

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
document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: 'power2.out'
  });
});

const addCursorHover = (elements) => {
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
};

// Fetch Data
const API_URL = 'http://localhost:5001/api/v1';

async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    if(data.success) {
      renderCategories(data.data);
    }
  } catch(e) {
    console.log('Error fetching categories. Using fallback UI.');
  }
}

async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/events`);
    const data = await res.json();
    if(data.success) {
      renderEvents(data.data);
    }
  } catch(e) {
    console.log('Error fetching events. Using fallback UI.');
  }
}

async function fetchChefs() {
  try {
    const res = await fetch(`${API_URL}/chefs`);
    const data = await res.json();
    if(data.success) {
      renderChefs(data.data);
    }
  } catch(e) {
    console.log('Error fetching chefs. Using fallback UI.');
  }
}

// Render Functions
function renderCategories(categories) {
  const container = document.getElementById('category-container');
  container.innerHTML = categories.map(c => `
    <div class="category-pill">${c.icon} ${c.name}</div>
  `).join('');
  addCursorHover(document.querySelectorAll('.category-pill'));
}

function renderEvents(events) {
  const container = document.getElementById('events-container');
  container.innerHTML = events.map(e => `
    <div class="event-card">
      <div class="event-info">
        <div>
          ${e.status === 'live' ? '<span class="live-badge">LIVE NOW</span>' : ''}
          <div class="event-meta">
            <span>${new Date(e.event_date).toLocaleDateString()}</span>
            <span>${e.location}</span>
          </div>
          <h3 class="event-title">${e.name}</h3>
        </div>
        <p>${e.description}</p>
        <button class="cta-button secondary" style="width:fit-content; padding: 0.5rem 0;">EXPLORE →</button>
      </div>
      <div class="event-image">
        <img src="${e.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'}" alt="${e.name}">
      </div>
    </div>
  `).join('');
  addCursorHover(document.querySelectorAll('.event-card, .cta-button'));
}

function renderChefs(chefs) {
  const container = document.getElementById('chefs-container');
  container.innerHTML = chefs.map(c => `
    <div class="chef-card">
      <div class="chef-image">
        <img src="${c.image_url || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80'}" alt="${c.name}">
      </div>
      <h3 class="chef-name">${c.name}</h3>
      <p class="chef-specialty">${c.specialty}</p>
    </div>
  `).join('');
  addCursorHover(document.querySelectorAll('.chef-card'));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  addCursorHover(document.querySelectorAll('a, button'));
  
  // Try fetching. If fails (backend not running), UI remains mostly empty but structure holds.
  fetchCategories();
  fetchEvents();
  fetchChefs();

  // Give a small delay to let DOM render dynamically before init animations
  setTimeout(() => {
    initAnimations();
  }, 500);
});
