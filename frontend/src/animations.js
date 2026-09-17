import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initAnimations() {
  const easeOutExpo = 'expo.out'

  // ── Hero entrance ──────────────────────────────────────
  const tlHero = gsap.timeline({ defaults: { ease: easeOutExpo } })

  tlHero
    .from('.navbar', { y: -40, opacity: 0, duration: 1 })
    .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-title', {
      y: 80,
      opacity: 0,
      duration: 1.4,
      clipPath: 'inset(100% 0 0 0)'
    }, '-=0.5')
    .from('.hero-intro', { y: 20, opacity: 0, duration: 0.9 }, '-=0.9')
    .from('.cta-button.primary', { scale: 0.85, opacity: 0, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.7')
    .from('.hero-stats', { y: 20, opacity: 0, duration: 0.8 }, '-=0.8')
    .from('.hero-image-wrapper', { x: 60, opacity: 0, duration: 1.4 }, '-=1.2')
    .from('.floating-badge', { scale: 0, rotation: -30, duration: 0.9, ease: 'back.out(2)' }, '-=0.5')

  // ── Section headings ───────────────────────────────────
  gsap.utils.toArray('.section-heading').forEach(heading => {
    gsap.from(heading, {
      scrollTrigger: { trigger: heading, start: 'top 88%' },
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: easeOutExpo,
      clipPath: 'inset(100% 0 0 0)'
    })
  })

  // ── Categories stagger ─────────────────────────────────
  gsap.from('.category-pill', {
    scrollTrigger: { trigger: '#category-container', start: 'top 85%' },
    y: 24,
    opacity: 0,
    stagger: 0.07,
    duration: 0.7,
    ease: easeOutExpo
  })

  // ── Events stagger ─────────────────────────────────────
  gsap.utils.toArray('.event-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%' },
      y: 40,
      opacity: 0,
      duration: 0.9,
      delay: i * 0.08,
      ease: easeOutExpo
    })
  })

  // ── Chef cards stagger ─────────────────────────────────
  gsap.utils.toArray('.chef-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: '.chefs-grid', start: 'top 85%' },
      y: 50,
      opacity: 0,
      duration: 0.9,
      delay: i * 0.1,
      ease: easeOutExpo
    })
  })

  // ── Gallery items stagger ──────────────────────────────
  gsap.utils.toArray('.m-item').forEach((img, i) => {
    gsap.fromTo(img,
      { y: i % 2 === 0 ? 40 : 70 },
      {
        scrollTrigger: {
          trigger: '.masonry-gallery',
          start: 'top 90%',
          end: 'bottom top',
          scrub: 1.5
        },
        y: -40,
        ease: 'none'
      }
    )
  })

  // ── Final CTA ──────────────────────────────────────────
  gsap.from('.section-cta h2', {
    scrollTrigger: { trigger: '.section-cta', start: 'top 75%' },
    scale: 0.88,
    opacity: 0,
    duration: 1.4,
    ease: easeOutExpo
  })
}
