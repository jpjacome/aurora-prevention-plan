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
    });    
    
    // **ELEGANT POP ANIMATIONS FOR INNER CONTAINERS**
    // Create beautiful entrance animations for each inner container (EXCEPT wrapper-1)
    const innerContainers = gsap.utils.toArray('.inner-container').filter((container, index) => {
        // Exclude wrapper-1's inner-container (index 0) since it has its own page load animation
        return index !== 0;
    });
    
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
    };    // **NAVBAR BULLET SYSTEM** - ScrollTrigger-based implementation
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
      
      // Function to activate a specific bullet
      function activateBullet(index) {
        // Clear all bullets
        bullets.forEach(bullet => bullet.classList.remove('bullet-active'));
        // Activate the specified bullet
        if (bullets[index]) {
          bullets[index].classList.add('bullet-active');
          // Update label
          if (bulletLabel && wrapperTitles[index]) {
            bulletLabel.textContent = wrapperTitles[index];
          }
        }
      }
      
      // Create ScrollTrigger for each wrapper
      wrappers.forEach((wrapper, index) => {
        ScrollTrigger.create({
          trigger: wrapper,
          start: 'top 50%', // When wrapper top hits middle of viewport
          end: 'bottom 50%', // When wrapper bottom hits middle of viewport
          scroller: '#smooth-wrapper', // Use ScrollSmoother scroller
          
          onEnter: () => {
            // Activate this bullet when entering from above
            activateBullet(index);
          },
          
          onEnterBack: () => {
            // Activate this bullet when entering from below (scrolling up)
            activateBullet(index);
          },
          
          // Optional: Add markers for debugging (remove in production)
          // markers: true,
          // id: `navbar-${index}`
        });
      });
      
      // BULLET CLICK HANDLERS
      bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', function() {
          const wrapper = wrappers[index];
          if (wrapper) {
            // Immediately update bullet states and label BEFORE scrolling
            activateBullet(index);
            
            // Scroll to the wrapper
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
          }
        });
      });
      
      // BULLET HOVER: Show respective wrapper title in label on hover
      bullets.forEach((bullet, index) => {
        bullet.addEventListener('mouseenter', function() {
          if (bulletLabel && wrapperTitles[index]) {
            bulletLabel.textContent = wrapperTitles[index];
          }
        });
        bullet.addEventListener('mouseleave', function() {
          // Restore the label to the currently active bullet
          const activeIndex = Array.from(bullets).findIndex(b => b.classList.contains('bullet-active'));
          if (bulletLabel && wrapperTitles[activeIndex]) {
            bulletLabel.textContent = wrapperTitles[activeIndex];
          }
        });
      });
      
      // Initialize - Force first bullet active
      activateBullet(0);
      
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


// **PAGE LOAD ENTRANCE ANIMATION** - Relaxing and smooth for wrapper 1
    // Force scroll to top on page load
    window.scrollTo(0, 0);
    
    // First, set wrapper-1's inner-container to hidden for smooth entrance
    const wrapper1InnerContainer = document.querySelector('.wrapper-1 .inner-container');
    if (wrapper1InnerContainer) {
        gsap.set(wrapper1InnerContainer, {
            opacity: 0, // Start hidden for smooth entrance
            scale: 0.85,
            y: 30,
            rotationX: 10,
            transformOrigin: "center center"
        });
    }
    
    // Select wrapper 1 elements for entrance animation
    const wrapper1Elements = [
        '.wrapper-1 .logo',
        '.wrapper-1 .title',
        '.wrapper-1 .paragraph',
        '.wrapper-1 .cta-buttons'
    ];
    
    // Only fade in the elements (no movement, scale, or rotation)
    gsap.set(wrapper1Elements, {
        opacity: 0
    });
    
    // Create beautiful entrance timeline with stagger
    const entranceTl = gsap.timeline({ 
        delay: .2, // Longer delay for more elegant entrance
        onComplete: () => {
            console.log('✨ Wrapper 1 entrance animation complete');
        }
    });
    
    // Animate the inner container first, slow and smooth
    entranceTl.to(wrapper1InnerContainer, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        duration: 2.2,
        ease: "power2.out"
    })
    // Fade in the children after the container is mostly visible
    .to(wrapper1Elements, {
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        stagger: {
            each: 0.35,
            from: "start",
            ease: "power2.out"
        }
    }, "-=0.5"); // Start children after most of the container is visible

    // **BULLET NAVBAR ENTRANCE ANIMATION**
    // Hide navbar and its children initially
    const bulletNavbar = document.querySelector('.bullet-navbar');
    const bulletNavbarLabel = bulletNavbar?.querySelector('.bullet-label');
    const bulletNavbarList = bulletNavbar?.querySelector('ul');
    if (bulletNavbar) {
        gsap.set(bulletNavbar, { opacity: 0 });
    }
    if (bulletNavbarLabel) {
        gsap.set(bulletNavbarLabel, { opacity: 0 });
    }
    if (bulletNavbarList) {
        gsap.set(bulletNavbarList, { opacity: 0 });
    }
    // Timeline for navbar entrance
    const navbarTl = gsap.timeline({ delay: 2 });
    // Fade in navbar background (parent)
    navbarTl.to(bulletNavbar, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
    });
    // Fade in label and ul children one by one
    navbarTl.to([bulletNavbarLabel, bulletNavbarList], {
        opacity: 1,
        duration: 1.1,
        ease: "power2.out",
        stagger: {
            each: 0.25,
            from: "start"
        }
    });