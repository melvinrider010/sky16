/**
 * Sky16 Cafe — Cinematic Coffee Cup Scroll Animation Engine
 * GSAP + ScrollTrigger with Vanilla RAF Fallback & Full Responsive Support
 */

(function () {
  'use strict';

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initCinematicExperience();
  });

  function initCinematicExperience() {
    const heroSection = document.getElementById('cinematic-hero-section');
    const cupWrapper = document.getElementById('cinematic-cup-wrapper');
    const cupImg = document.getElementById('cinematic-cup-img');
    const chapters = document.querySelectorAll('.story-chapter');
    const dots = document.querySelectorAll('.chapter-dot');
    const beans = document.querySelectorAll('.parallax-bean');

    if (!heroSection || !cupWrapper) return;

    // 1. Initial State before entrance
    if (!prefersReducedMotion) {
      cupWrapper.style.transform = 'translateY(-120vh) rotate(-28deg) scale(0.85)';
      cupWrapper.style.opacity = '0';
    }

    // 2. Entrance Animation on Page Load
    function playEntranceAnimation() {
      if (prefersReducedMotion) {
        cupWrapper.style.transform = 'none';
        cupWrapper.style.opacity = '1';
        updateChapterState(0);
        return;
      }

      if (window.gsap) {
        gsap.to(cupWrapper, {
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 1.8,
          ease: 'power4.out',
          onComplete: () => {
            // Initiate scroll animation after entrance settles
            setupScrollAnimation();
          }
        });
      } else {
        // Vanilla CSS fallback entrance
        cupWrapper.style.transition = 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease-out';
        cupWrapper.style.transform = 'translateY(0) rotate(0deg) scale(1)';
        cupWrapper.style.opacity = '1';
        setTimeout(setupScrollAnimation, 1800);
      }
    }

    // Small delay so layout is stable
    setTimeout(playEntranceAnimation, 150);

    // 3. Scroll Choreography
    function setupScrollAnimation() {
      if (prefersReducedMotion) return;

      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // Timeline scrubbed directly to scroll progress
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            onUpdate: (self) => {
              handleChapterProgress(self.progress);
            }
          }
        });

        // Responsive transformations across the 400vh scroll track
        if (isMobile) {
          // Mobile adjustments: reduced travel distance and rotation
          tl.to(cupWrapper, {
            rotation: 120,
            scale: 1.08,
            y: 10,
            ease: 'none'
          }, 0)
          .to(cupWrapper, {
            rotation: 240,
            scale: 1.02,
            y: -10,
            ease: 'none'
          }, 0.5)
          .to(cupWrapper, {
            rotation: 360,
            scale: 1,
            y: 0,
            ease: 'none'
          }, 0.8);
        } else if (isTablet) {
          // Tablet adjustments
          tl.to(cupWrapper, {
            rotation: 110,
            x: -20,
            y: 20,
            scale: 1.1,
            ease: 'none'
          }, 0)
          .to(cupWrapper, {
            rotation: 230,
            x: 10,
            y: -20,
            scale: 1.15,
            ease: 'none'
          }, 0.5)
          .to(cupWrapper, {
            rotation: 360,
            x: 0,
            y: 0,
            scale: 1,
            ease: 'none'
          }, 0.8);
        } else {
          // Full Desktop Cinematic Orchestration
          // Phase 1 -> 2: Intro into Coffee / Food
          tl.to(cupWrapper, {
            rotation: 105,
            x: -30,
            y: 40,
            scale: 1.18,
            ease: 'power1.inOut'
          }, 0);

          // Phase 2 -> 3: Coffee / Food into Adventures & Stays
          tl.to(cupWrapper, {
            rotation: 235,
            x: 35,
            y: -35,
            scale: 1.22,
            ease: 'power1.inOut'
          }, 0.45);

          // Phase 3 -> 4: Adventures into Visit & Location
          tl.to(cupWrapper, {
            rotation: 360,
            x: 0,
            y: 0,
            scale: 1.05,
            ease: 'power1.inOut'
          }, 0.75);
        }

        // Parallax Coffee Beans Movement
        beans.forEach((bean, idx) => {
          const speed = (idx + 1) * 70;
          const rot = (idx % 2 === 0 ? 1 : -1) * 180;
          tl.to(bean, {
            y: (idx % 2 === 0 ? -speed : speed) * 1.5,
            x: (idx % 2 === 0 ? speed * 0.5 : -speed * 0.5),
            rotation: rot,
            ease: 'none'
          }, 0);
        });

      } else {
        // Vanilla Window Scroll Fallback
        window.addEventListener('scroll', onVanillaScroll, { passive: true });
      }
    }

    function onVanillaScroll() {
      const rect = heroSection.getBoundingClientRect();
      const totalScroll = heroSection.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const progress = Math.min(Math.max(-rect.top / totalScroll, 0), 1);
      
      const rot = progress * 360;
      const scale = 1 + Math.sin(progress * Math.PI) * 0.18;
      const x = Math.sin(progress * Math.PI * 2) * 30;

      cupWrapper.style.transform = `translate(${x}px, 0px) rotate(${rot}deg) scale(${scale})`;
      handleChapterProgress(progress);
    }

    // Switch Chapter Content based on Scroll Progress (0.0 to 1.0)
    function handleChapterProgress(progress) {
      let activeIndex = 0;
      if (progress < 0.28) {
        activeIndex = 0;
      } else if (progress < 0.58) {
        activeIndex = 1;
      } else if (progress < 0.85) {
        activeIndex = 2;
      } else {
        activeIndex = 3;
      }
      updateChapterState(activeIndex);
    }

    function updateChapterState(activeIndex) {
      chapters.forEach((ch, idx) => {
        if (idx === activeIndex) {
          ch.classList.add('active');
        } else {
          ch.classList.remove('active');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

  }
})();
