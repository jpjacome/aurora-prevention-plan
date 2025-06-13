// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function scrollToSection(sectionNumber) {
    const section = document.getElementById(`section-${sectionNumber}`);
    // Use ScrollSmoother's scrollTo method for smooth scrolling
    let smoother = ScrollSmoother.get();
    if (smoother) {
        smoother.scrollTo(section, true, "top top");
    } else {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}        // Initialize ScrollSmoother
document.addEventListener('DOMContentLoaded', function() {            // Create ScrollSmoother instance
    const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        
        // **SMOOTH SCROLL CONTROL VALUES**
        smooth: 3,                   // Main smoothing: 0 = no smoothing, higher = more smoothing
                                    // Try values: 0.5 (fast), 1 (normal), 2 (smooth), 3+ (very smooth)
        
        smoothTouch: 1,           // Touch device smoothing (mobile/tablet)
                                    // false = no touch smoothing, 0.1-1 = smoothing amount
        
        speed: .8,                   // Overall scroll speed multiplier
                                    // 0.5 = half speed, 1 = normal, 2 = double speed
        
        effects: false,             // Disable effects to avoid conflicts with pinning
        normalizeScroll: true,      // Force scroll on JS thread for consistency
        
        // **EASING CONTROL**
        ease: "expo.out",           // Easing function for smooth scroll
                                    // Options: "expo", "power2", "elastic", "back", "sine"
        
        // **CALLBACKS FOR FINE CONTROL**
        onUpdate: function() {
            // Called on every scroll update
        },
        
    });    // **SOLUTION: True deck-of-cards stacking effect**
    // All sections stack on top of each other at the top of the screen
    let sections = gsap.utils.toArray('.wrapper');
    
    sections.forEach((section, i) => {
        // Set z-index so first section is on bottom, last section is on top
        gsap.set(section, { zIndex: i + 1 });
        
        // Create the main stacking ScrollTrigger
        ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: `+=${window.innerHeight}`,
            pin: true,
            pinSpacing: false,
            scroller: '#smooth-wrapper',
            onUpdate: (self) => {
                // As we scroll through this section, scale down all previous sections
                const progress = self.progress;
                
                // Scale down and move previous sections
                for (let j = 0; j < i; j++) {
                    const scale = 1 - (progress * 0.05 * (i - j)); // Gradual scale down
                    const y = progress * -20 * (i - j); // Move up slightly
                    
                    gsap.set(sections[j], {
                        scale: scale,
                        y: y,
                        transformOrigin: 'center top'
                    });
                }
            }
        });
    });    // **ELEGANT POP ANIMATIONS FOR INNER CONTAINERS**
    // Create beautiful entrance animations for each inner container
    const innerContainers = gsap.utils.toArray('.inner-container');
    
    innerContainers.forEach((container, i) => {
        // Set initial state - hidden and smaller
        gsap.set(container, {
            opacity: 0,
            scale: 0.8,
            y: 60,
            rotationX: 15,
            transformOrigin: "center center"
        });
        
        // Create the pop animation timeline - one-time entrance only
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.closest('.wrapper'), // Trigger on parent wrapper instead
                start: 'top 80%', // Start when container is 80% in view
                end: 'top 20%', // End when container reaches 20% from top
                toggleActions: 'play none none reverse', // Play on enter, reverse on leave
                scroller: '#smooth-wrapper', // Use same scroller as ScrollSmoother
                // Optional: Add markers for debugging (remove in production)
                // markers: true,
                onToggle: self => {
                    if (self.isActive) {
                    } else {
                    }
                }
            }
        });
        
        // Animate container only
        tl.to(container, {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
            ease: "back.out(1.4)", // Bouncy ease for pop effect
            delay: i * 0.15 // Stagger animation for each container
        });
        
        container.addEventListener('mouseleave', () => {
            gsap.to(container, {
                boxShadow: "0 0 0px rgba(255, 255, 255, 0)",
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });// Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });            // **DYNAMIC CONTROL METHODS** - Call these from browser console to test
    window.controlSmoothScroll = {
        // Change smoothing amount (0-5)
        setSmooth: (value) => {
            smoother.smooth(value);
        },
        
        // Get current smooth value
        getSmooth: () => {
            return smoother.smooth();
        },
        
        // Pause/resume smooth scrolling
        pause: () => {
            smoother.paused(true);
        },
        
        resume: () => {
            smoother.paused(false);
        },
        
        // Get current scroll progress (0-1)
        getProgress: () => {
            return smoother.progress;
        },
        
        // Get current scroll velocity
        getVelocity: () => {
            return smoother.getVelocity();
        }
    };
    // **ANIMATION CONTROL METHODS** - Control the pop animations
    window.controlAnimations = {
        // Replay all inner container animations
        replayAnimations: () => {
            ScrollTrigger.refresh();
        },        // Kill all animations
        killAnimations: () => {
            gsap.killTweensOf('.inner-container');
        },
        
        // Reset all inner containers to initial state
        resetContainers: () => {
            gsap.set('.inner-container', {
                opacity: 0,
                scale: 0.8,
                y: 60,
                rotationX: 15,
                clearProps: "boxShadow"
            });
        },
        
        // Check which containers are currently visible
        getVisibleContainers: () => {
            const triggers = ScrollTrigger.getAll();
            const visibleContainers = triggers.filter(trigger => trigger.isActive).length;
            return { visible: visibleContainers };
        }
    };
    // --- BULLET ACTIVE STATE & LABEL UPDATE REMOVED (RESET) ---
    (function() {
      const bullets = document.querySelectorAll('.bullet-navbar .bullet');
      const wrappers = Array.from(document.querySelectorAll('.wrapper'));
      if (bullets.length && wrappers.length) {
        // Special case for the first bullet
        bullets[0].addEventListener('click', function() {
          const wrapper = wrappers[0];
          if (wrapper) {
            let smoother = ScrollSmoother.get();
            if (smoother) {
              smoother.scrollTo(wrapper.offsetTop, true, 'top top');
            } else {
              wrapper.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
        // All other bullets
        for (let i = 1; i < bullets.length; i++) {
          bullets[i].addEventListener('click', function() {
            const wrapper = wrappers[i];
            if (wrapper) {
              let smoother = ScrollSmoother.get();
              if (smoother) {
                smoother.scrollTo(wrapper, true, 'top top');
              } else {
                wrapper.scrollIntoView({ behavior: 'smooth' });
              }
            }
          });
        }
      }
    })();
});
// Add Intersection Observer for wrapper visibility
(function() {
  const bullets = document.querySelectorAll('.bullet-navbar .bullet');
  const wrappers = Array.from(document.querySelectorAll('.wrapper'));
  if (bullets.length && wrappers.length) {
    // Special scroll event for the first wrapper (activate bullet 1 near top)
    window.addEventListener('scroll', function() {
      let scrollY = 0;
      let smoother = window.ScrollSmoother && ScrollSmoother.get();
      if (smoother) {
        scrollY = smoother.scrollTop();
      } else {
        scrollY = window.scrollY || window.pageYOffset;
      }      // If scroll is near the top (within 200px), activate bullet 1
      if (scrollY <= 200) {
        bullets[0].classList.add('bullet-active');
        // Deactivate all other bullets
        for (let i = 1; i < bullets.length; i++) {
          bullets[i].classList.remove('bullet-active');
        }
      } else {
        // If not near the top, deactivate bullet 1 if any other bullet is active
        const anyOtherActive = Array.from(bullets).slice(1).some(b => b.classList.contains('bullet-active'));
        if (anyOtherActive) {
          bullets[0].classList.remove('bullet-active');
        }
      }
    }, { passive: true });

    // Intersection Observer for all other wrappers (2+)
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const rect = entry.target.getBoundingClientRect();
        const center = window.innerHeight / 2;
        if (rect.top <= center + 40 && rect.top >= center - 40) {
          // Only handle wrappers 2+ here
          if (entry.target !== wrappers[0]) {
            // Only activate bullets 2+ if not near the top
            let scrollY = 0;
            let smoother = window.ScrollSmoother && ScrollSmoother.get();
            if (smoother) {
              scrollY = smoother.scrollTop();
            } else {
              scrollY = window.scrollY || window.pageYOffset;
            }
            if (scrollY > 200) {
              // Deactivate bullet 1 when activating other bullets
              bullets[0].classList.remove('bullet-active');
              wrappers.forEach((w, i) => {
                if (i !== 0) bullets[i].classList.toggle('bullet-active', w === entry.target);
              });
            }
          }        } else {
          // Check if wrapper-2 is at center or below center - deactivate bullet 2
          if (entry.target === wrappers[1] && rect.top >= center) {
            bullets[1].classList.remove('bullet-active');
            // Activate bullet 1 when bullet 2 gets deactivated (if not near top)
            let scrollY = 0;
            let smoother = window.ScrollSmoother && ScrollSmoother.get();
            if (smoother) {
              scrollY = smoother.scrollTop();
            } else {
              scrollY = window.scrollY || window.pageYOffset;
            }
            if (scrollY > 200) {
              bullets[0].classList.add('bullet-active');
            }
          }
          // Only activate bullets if the wrapper is centered AND not near the top
          else if (rect.top <= center + 40 && rect.top >= center - 40) {
            // Only handle wrappers 2+ here
            if (entry.target !== wrappers[0]) {
              // Only activate bullets 2+ if not near the top
              let scrollY = 0;
              let smoother = window.ScrollSmoother && ScrollSmoother.get();
              if (smoother) {
                scrollY = smoother.scrollTop();
              } else {
                scrollY = window.scrollY || window.pageYOffset;
              }
              if (scrollY > 200) {
                wrappers.forEach((w, i) => {
                  if (i !== 0) bullets[i].classList.toggle('bullet-active', w === entry.target);
                });
              }
            }
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: Array.from({length: 101}, (_, i) => i / 100)
    });
    wrappers.slice(1).forEach(wrapper => observer.observe(wrapper));
  }
})();
// FAQ accordion interaction
(function() {
  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', function() {
      // Close others
      faqs.forEach(i => { if(i !== item) i.classList.remove('open'); });
      // Toggle this one
      item.classList.toggle('open');
    });
  });
})();