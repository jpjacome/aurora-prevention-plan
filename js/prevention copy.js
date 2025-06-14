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
}        

// Initialize ScrollSmoother
document.addEventListener('DOMContentLoaded', function() {            // Create ScrollSmoother instance
    const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        
        // **SMOOTH SCROLL CONTROL VALUES**
        smooth: 2,                   // Main smoothing: 0 = no smoothing, higher = more smoothing
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
    };    // **NAVBAR BULLET SYSTEM** - Clean, consolidated implementation
    (function() {
      const bullets = document.querySelectorAll('.bullet-navbar .bullet');
      const wrappers = Array.from(document.querySelectorAll('.wrapper'));
      const bulletLabel = document.querySelector('.bullet-navbar .bullet-label');
      
      if (!bullets.length || !wrappers.length) return;
        // Extract titles from each wrapper's data-nav-title attribute
      const wrapperTitles = wrappers.map(wrapper => {
        const titleElement = wrapper.querySelector('.title h1, .title h2');
        if (titleElement && titleElement.hasAttribute('data-nav-title')) {
          return titleElement.getAttribute('data-nav-title').trim();
        }
        // Fallback to text content if no data attribute
        return titleElement ? titleElement.textContent.trim() : `Sección ${wrappers.indexOf(wrapper) + 1}`;
      });
        let lastScrollY = 0;
      let scrollDirection = 'down';
      let isScrolling = false;
        // Get current scroll position (unified function)
      function getScrollY() {
        let smoother = window.ScrollSmoother && ScrollSmoother.get();
        return smoother ? smoother.scrollTop() : (window.scrollY || window.pageYOffset);
      }      // Track scroll direction and handle all bullet activation
      function handleBulletActivation() {
        const currentScrollY = getScrollY();
        
        // Update scroll direction
        if (currentScrollY > lastScrollY) {
          scrollDirection = 'down';
        } else if (currentScrollY < lastScrollY) {
          scrollDirection = 'up';
        }
        lastScrollY = currentScrollY;
        
        // Calculate which bullet should be active based on scroll position
        const viewportHeight = window.innerHeight;
        const sectionIndex = Math.floor(currentScrollY / viewportHeight);
        const progressInSection = (currentScrollY % viewportHeight) / viewportHeight;
        
        let activeBulletIndex = 0;
        
        if (scrollDirection === 'down') {
          // Activate next bullet when halfway through section
          activeBulletIndex = progressInSection >= 0.5 
            ? Math.min(sectionIndex + 1, wrappers.length - 1)
            : sectionIndex;
        } else {
          // Activate current bullet when scrolling up, with better responsiveness
          activeBulletIndex = progressInSection <= 0.2 && sectionIndex > 0
            ? sectionIndex - 1
            : sectionIndex;
        }
        
        // Clamp to valid range
        activeBulletIndex = Math.max(0, Math.min(activeBulletIndex, bullets.length - 1));
        
        // Apply bullet states to ALL bullets
        bullets.forEach((bullet, index) => {
          bullet.classList.toggle('bullet-active', index === activeBulletIndex);
        });
        
        // Update bullet label with active wrapper title
        if (bulletLabel && wrapperTitles[activeBulletIndex]) {
          bulletLabel.textContent = wrapperTitles[activeBulletIndex];
        }
      }// BULLET CLICK HANDLERS
      bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', function() {
          const wrapper = wrappers[index];
          if (wrapper) {
            // Immediately update bullet states and label BEFORE scrolling
            bullets.forEach((b, i) => {
              b.classList.remove('bullet-active');
            });
            bullets[index].classList.add('bullet-active');
            
            if (bulletLabel && wrapperTitles[index]) {
              bulletLabel.textContent = wrapperTitles[index];
            }
              // Temporarily disable scroll handler to prevent interference
            window.removeEventListener('scroll', mainScrollHandler);
            
            // Scroll to the wrapper (keeping original working logic)
            let smoother = ScrollSmoother.get();
            if (smoother) {
              // For first wrapper, scroll to very top (0)
              if (index === 0) {
                smoother.scrollTo(0, true);
              } else {
                smoother.scrollTo(wrapper, true, 'top top');
              }
            } else {
              if (index === 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                wrapper.scrollIntoView({ behavior: 'smooth' });
              }
            }
              // Re-enable scroll handler after scroll animation completes
            setTimeout(() => {
              lastScrollY = getScrollY();
              window.addEventListener('scroll', mainScrollHandler, { passive: true });
            }, 1200); // Give enough time for scroll animation to complete
          }
        });
      });        // BULLETPROOF TOP OVERRIDE - Runs on EVERY scroll event, no exceptions
        function absoluteTopOverride() {
          const currentScrollY = getScrollY();
          
          // If within 300px of top, FORCE first bullet - no questions asked
          // Reduced from 500px to 300px for faster activation
          if (currentScrollY <= 300) {
            // Clear all bullets
            bullets.forEach(bullet => bullet.classList.remove('bullet-active'));
            // Force first bullet active
            bullets[0].classList.add('bullet-active');
            // Update label
            if (bulletLabel && wrapperTitles[0]) {
              bulletLabel.textContent = wrapperTitles[0];
            }
            return true; // Signal override happened
          }
          return false; // No override
        }

        // MAIN SCROLL HANDLER - Named function for proper event listener management
        function mainScrollHandler() {
          // FIRST: Always check top override before anything else
          if (absoluteTopOverride()) {
            return; // If top override activated, skip all other logic
          }
          
          // SECOND: Only run normal bullet logic if not near top
          // Use requestAnimationFrame for smooth performance
          if (!isScrolling) {
            requestAnimationFrame(() => {
              handleBulletActivation();
              isScrolling = false;
            });
            isScrolling = true;
          }
        }

        // SINGLE SCROLL EVENT LISTENER with ABSOLUTE TOP PRIORITY
        window.addEventListener('scroll', mainScrollHandler, { passive: true });
          // Initialize on page load - Force first bullet active
      bullets.forEach(bullet => bullet.classList.remove('bullet-active'));
      bullets[0].classList.add('bullet-active');
      
      // Set initial bullet label
      if (bulletLabel && wrapperTitles[0]) {
        bulletLabel.textContent = wrapperTitles[0];
      }
      
    })();
});

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