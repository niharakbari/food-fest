import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initAnimations } from './animations'

gsap.registerPlugin(ScrollTrigger)

// ── Smooth Scroll ──────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ── Custom Cursor ──────────────────────────────────────────
const cursor = document.querySelector('.custom-cursor')
if (cursor) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' })
  })
}

const addCursorHover = (elements) => {
  if (!cursor) return
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'))
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'))
  })
}

// ── API ────────────────────────────────────────────────────
const API_URL = 'http://localhost:5000/api/v1'

// ── Loading / Empty States ─────────────────────────────────
const loadingHTML = `
  <div class="state-loading">
    <div class="state-loading-spinner"></div>
  </div>`

const emptyState = (icon, title, text) => `
  <div class="state-empty">
    <span class="state-empty-icon">${icon}</span>
    <p class="state-empty-title">${title}</p>
    <p class="state-empty-text">${text}</p>
  </div>`

// ── Fetch helpers ──────────────────────────────────────────
async function fetchAndRender(endpoint, renderFn, containerId, emptyIcon, emptyTitle, emptyText) {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = loadingHTML
  try {
    const res  = await fetch(`${API_URL}/${endpoint}`)
    const data = await res.json()
    if (data.success && data.data.length > 0) {
      renderFn(data.data, container)
    } else {
      container.innerHTML = emptyState(emptyIcon, emptyTitle, emptyText)
    }
  } catch (e) {
    container.innerHTML = emptyState('🔌', 'Unable to connect', 'Make sure the backend server is running on port 5000.')
  }
}

// ── Render: Categories ─────────────────────────────────────
function renderCategories(categories, container) {
  container.innerHTML = categories.map(c => `
    <div class="category-pill">${c.icon} ${c.name}</div>
  `).join('')
  addCursorHover(container.querySelectorAll('.category-pill'))
}

// ── Render: Events ─────────────────────────────────────────
function renderEvents(events, container) {
  container.innerHTML = events.map(e => {
    const dateStr = new Date(e.event_date).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
    const liveBadge = e.status === 'live'
      ? `<span class="live-badge">Live Now</span>`
      : ''
    const statusPill = `<span class="event-status-pill ${e.status}">${e.status}</span>`

    return `
      <div class="event-card">
        <div class="event-info">
          <div class="event-header">
            ${liveBadge}
            <div class="event-meta">
              <span class="event-meta-item">
                <span class="meta-icon">📅</span> ${dateStr}
              </span>
              <span class="event-meta-item">
                <span class="meta-icon">📍</span> ${e.location}
              </span>
              ${e.start_time ? `<span class="event-meta-item"><span class="meta-icon">🕐</span> ${e.start_time.slice(0,5)} – ${e.end_time.slice(0,5)}</span>` : ''}
            </div>
            <h3 class="event-title">${e.name}</h3>
          </div>
          <p class="event-desc">${e.description}</p>
          <div class="event-footer">
            ${statusPill}
            <button class="cta-button secondary" style="padding: 0.6rem 1.4rem; font-size: 0.78rem;">
              Learn More &rarr;
            </button>
          </div>
        </div>
        <div class="event-image-col">
          <img src="${e.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'}" alt="${e.name}" loading="lazy">
        </div>
      </div>`
  }).join('')

  addCursorHover(container.querySelectorAll('.event-card, button'))
}

// ── Render: Chefs ──────────────────────────────────────────
function renderChefs(chefs, container) {
  container.innerHTML = chefs.map((c, i) => `
    <div class="chef-card">
      <span class="chef-number">0${i + 1}</span>
      <div class="chef-image">
        <img src="${c.image_url || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80'}" alt="${c.name}" loading="lazy">
      </div>
      <div class="chef-info">
        <h3 class="chef-name">${c.name}</h3>
        <p class="chef-specialty">${c.specialty}</p>
        ${c.description ? `<p class="chef-desc">${c.description}</p>` : ''}
      </div>
    </div>
  `).join('')
  addCursorHover(container.querySelectorAll('.chef-card'))
}

// ── Render: Journeys ───────────────────────────────────────
function renderJourneys(journeys, container) {
  let html = `<div class="timeline-spine"><div class="timeline-spine-fill" id="timeline-fill"></div></div>`

  journeys.forEach((j, index) => {
    const isRight = index % 2 !== 0 ? 'right' : ''
    html += `
      <div class="timeline-item ${isRight}">
        <span class="timeline-year">${j.year}</span>
        <p class="timeline-text">${j.description}</p>
        ${j.image_url ? `<img class="timeline-img" src="${j.image_url}" alt="${j.year}" loading="lazy">` : ''}
      </div>`
  })

  container.innerHTML = html

  // Animate in on scroll
  container.querySelectorAll('.timeline-item').forEach((item, i) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => item.classList.add('visible'), i * 100)
          observer.unobserve(item)
        }
      })
    }, { threshold: 0.15 })
    observer.observe(item)
  })

  ScrollTrigger.refresh()
}

// ── Render: Gallery ────────────────────────────────────────
function renderGallery(images, container) {
  container.innerHTML = images.map(img => `
    <img src="${img.image_url}" class="m-item" loading="lazy" alt="Food Fest gallery image">
  `).join('')
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  addCursorHover(document.querySelectorAll('a, button'))

  fetchAndRender('categories', renderCategories, 'category-container',
    '🍽️', 'No categories yet', 'Check back soon.')
  fetchAndRender('events',     renderEvents,     'events-container',
    '📅', 'No events scheduled', 'Events will appear here once added by the team.')
  fetchAndRender('chefs',      renderChefs,      'chefs-container',
    '👨‍🍳', 'Chef lineup coming soon', 'Our all-star roster will be announced shortly.')
  fetchAndRender('journeys',   renderJourneys,   'journey-container',
    '📖', 'Our story is being written', 'Check back soon.')
  fetchAndRender('gallery',    renderGallery,    'gallery-container',
    '📸', 'Gallery coming soon', 'Photos from the event will appear here.')

  setTimeout(() => initAnimations(), 600)
})
