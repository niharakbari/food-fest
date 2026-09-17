import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initAnimations() {
  
  // Custom Ease
  const easeOutExpo = "expo.out";

  // Hero Animations
  const tlHero = gsap.timeline();
  
  tlHero.from('.navbar', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: easeOutExpo
  })
  .from('.hero-title', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: easeOutExpo,
    clipPath: 'inset(100% 0 0 0)'
  }, "-=0.5")
  .from('.hero-intro', {
    y: 20,
    opacity: 0,
    duration: 1,
    ease: easeOutExpo
  }, "-=1")
  .from('.cta-button.primary', {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)"
  }, "-=0.8")
  .from('.hero-image-wrapper', {
    x: 100,
    opacity: 0,
    duration: 1.5,
    ease: easeOutExpo
  }, "-=1.2")
  .from('.floating-badge', {
    scale: 0,
    rotation: -45,
    duration: 1,
    ease: "back.out(2)"
  }, "-=0.5");

  // Story Timeline Scroll Animation
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        end: "top 50%",
        scrub: 1
      },
      opacity: 1,
      y: -20,
      ease: "power2.out"
    });
  });

  // Timeline line draw
  gsap.from('.timeline-line', {
    scrollTrigger: {
      trigger: '.timeline',
      start: "top 80%",
      end: "bottom 50%",
      scrub: true
    },
    scaleY: 0,
    transformOrigin: "top center",
    ease: "none"
  });

  // Section Headings Reveal
  gsap.utils.toArray('.section-heading').forEach(heading => {
    gsap.from(heading, {
      scrollTrigger: {
        trigger: heading,
        start: "top 85%"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: easeOutExpo,
      clipPath: 'inset(100% 0 0 0)'
    });
  });

  // Categories Stagger
  gsap.from('.category-pill', {
    scrollTrigger: {
      trigger: '.category-grid',
      start: "top 80%"
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: easeOutExpo
  });

  // Events Stagger
  gsap.from('.event-card', {
    scrollTrigger: {
      trigger: '.events-list',
      start: "top 80%"
    },
    y: 50,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: easeOutExpo
  });

  // Gallery Parallax
  gsap.utils.toArray('.m-item').forEach((img, i) => {
    gsap.fromTo(img, {
      y: i % 2 === 0 ? 50 : 100
    }, {
      scrollTrigger: {
        trigger: '.masonry-gallery',
        start: "top 90%",
        end: "bottom top",
        scrub: 1
      },
      y: -50,
      ease: "none"
    });
  });

  // Final CTA
  gsap.from('.section-cta h2', {
    scrollTrigger: {
      trigger: '.section-cta',
      start: "top 75%"
    },
    scale: 0.9,
    opacity: 0,
    duration: 1.5,
    ease: easeOutExpo
  });
}
