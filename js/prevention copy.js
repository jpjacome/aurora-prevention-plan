// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

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

// **SCROLL LOCK SYSTEM** - Prevent scrolling past certain sections until unlocked
let maxUnlockedSection = 4; // Initially allow scrolling up to wrapper-4
let isScrollLocked = false;

function unlockNextSection() {
    maxUnlockedSection = Math.min(maxUnlockedSection + 1, 5); // Max section is 5
    console.log(`✅ Unlocked section ${maxUnlockedSection}`);
    
    // Release the GSAP scroll lock
    if (maxUnlockedSection >= 5) {
        releaseGSAPScrollLock();
    }
    
    // Trigger event to update bullet states
    window.dispatchEvent(new CustomEvent('sectionUnlocked'));
}

// Function to validate all required form fields
function validateAllForms() {
    const errors = [];
    
    // Section 2 - Basic Information
    const ownerName = document.getElementById('owner-name');
    const petName = document.getElementById('pet-name');
    const petSpecies = document.getElementById('pet-species');
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    
    if (!ownerName || !ownerName.value.trim()) {
        errors.push('Nombre del cuidador');
    }
    if (!petName || !petName.value.trim()) {
        errors.push('Nombre de la mascota');
    }
    if (!petSpecies || !petSpecies.value) {
        errors.push('Especie de mascota');
    }
    
    let genderSelected = false;
    genderRadios.forEach(radio => {
        if (radio.checked) genderSelected = true;
    });
    if (!genderSelected) {
        errors.push('Género de la mascota');
    }
    
    // Section 3 - Pet Details
    const petBirthday = document.getElementById('pet-birthday');
    const petBreed = document.getElementById('pet-breed');
    const petWeight = document.getElementById('pet-weight');
    const colorCheckboxes = document.querySelectorAll('input[name="color"]');
    
    if (!petBirthday || !petBirthday.value) {
        errors.push('Fecha de cumpleaños');
    }
    if (!petBreed || !petBreed.value.trim()) {
        errors.push('Raza de la mascota');
    }
    if (!petWeight || !petWeight.value) {
        errors.push('Peso de la mascota');
    }
    
    let colorSelected = false;
    colorCheckboxes.forEach(checkbox => {
        if (checkbox.checked) colorSelected = true;
    });
    if (!colorSelected) {
        errors.push('Color de la mascota');
    }
    
    // Section 4 - Environment
    const livingSpaceRadios = document.querySelectorAll('input[name="living-space"]');
    const inspirationCheckboxes = document.querySelectorAll('input[name="inspiration"]');
    
    let livingSpaceSelected = false;
    livingSpaceRadios.forEach(radio => {
        if (radio.checked) livingSpaceSelected = true;
    });
    if (!livingSpaceSelected) {
        errors.push('Tipo de vivienda');
    }
    
    let inspirationSelected = false;
    inspirationCheckboxes.forEach(checkbox => {
        if (checkbox.checked) inspirationSelected = true;
    });
    if (!inspirationSelected) {
        errors.push('Al menos una palabra de inspiración');
    }
    
    return errors;
}

// Function to show validation errors
function showValidationErrors(errors) {
    const errorMessage = `Por favor completa los siguientes campos:\n\n• ${errors.join('\n• ')}`;
    
    // Create a more detailed notification
    const notification = document.createElement('div');
    notification.className = 'scroll-lock-notification validation-error';
    notification.innerHTML = `
        <div class="lock-icon">⚠️</div>
        <div class="main-text">Formulario incompleto</div>
        <div class="sub-text">Por favor, completa todos los campos requeridos</div>
        <div class="error-list">${errors.map(error => `• ${error}`).join('<br>')}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 5 seconds (longer for error messages)
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 5000);
}

// Function called by the "Calcular" button to unlock wrapper-5
function unlockAndScrollToNext() {
    console.log('🎯 Calcular button clicked!');
    
    // First, validate all required fields
    const validationErrors = validateAllForms();
    
    if (validationErrors.length > 0) {
        console.log('❌ Form validation failed:', validationErrors);
        showValidationErrors(validationErrors);
        return; // Don't proceed if validation fails
    }
    
    console.log('✅ All forms validated successfully!');
    
    // Remove the pulsing animation from the button
    const calcularButton = document.querySelector('.wrapper-4 .btn-primary');
    if (calcularButton) {
        calcularButton.classList.add('clicked');
        gsap.killTweensOf(calcularButton); // Stop any running animations
        gsap.set(calcularButton, { scale: 1 }); // Reset scale
        console.log('✅ Button animation removed');
    }
    
    // Unlock the next section
    unlockNextSection();
    
    // Scroll to the newly unlocked section
    setTimeout(() => {
        scrollToSection(5);
    }, 100); // Small delay to ensure scroll lock is released
    
    console.log('🎉 Form completed! Unlocked wrapper-5');
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
            // Called on every scroll update - simplified for performance
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
    });    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
    
    // Initialize scroll lock system - GSAP-native approach
    setTimeout(() => {
        createGSAPScrollLock();
    }, 1000); // Delay to ensure all other ScrollTriggers are created first// **DYNAMIC CONTROL METHODS** - Call these from browser console to test
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
          const sectionNumber = index + 1; // Convert to 1-based section number
          
          if (wrapper) {
            // Check if section is unlocked before navigating
            if (sectionNumber <= maxUnlockedSection) {
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
            } else {
              // Section is locked, show notification
              console.log(`🔒 Section ${sectionNumber} is locked. Complete the current section first.`);
              showLockNotification();
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
      
      // **UPDATE BULLET STATES BASED ON LOCK STATUS**
      function updateBulletLockStates() {
        bullets.forEach((bullet, index) => {
          const sectionNumber = index + 1;
          if (sectionNumber > maxUnlockedSection) {
            bullet.classList.add('bullet-locked');
            bullet.classList.remove('bullet-active');
          } else {
            bullet.classList.remove('bullet-locked');
          }
        });
      }
      
      // Initial update of bullet states
      updateBulletLockStates();
      
      // Update bullet states whenever a section is unlocked
      window.addEventListener('sectionUnlocked', updateBulletLockStates);
      
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
    
    // **GSAP-NATIVE SCROLL LOCK SYSTEM** - Using ScrollTrigger pin to create hard stop
    let scrollLockTrigger = null;
    let scrollLockActive = false;
    let lockScrollPosition = null;
    
    function createGSAPScrollLock() {
        // Remove existing lock if any
        if (scrollLockTrigger) {
            scrollLockTrigger.kill();
            scrollLockTrigger = null;
        }
        
        // Only create lock if wrapper-5 is locked
        if (maxUnlockedSection < 5) {
            const wrapper4 = document.getElementById('section-4');
            
            if (wrapper4) {
                console.log('🔒 Creating GSAP-native scroll lock at wrapper-4');
                
                scrollLockTrigger = ScrollTrigger.create({
                    trigger: wrapper4,
                    start: 'bottom bottom',
                    end: '+=9999', // Large end value to keep it active
                    scroller: '#smooth-wrapper',
                    
                    onEnter: () => {
                        if (maxUnlockedSection < 5) {
                            const smoother = ScrollSmoother.get();
                            if (smoother) {
                                // Store the current scroll position as the lock point
                                lockScrollPosition = smoother.scrollTop();
                                scrollLockActive = true;
                                
                                console.log('🔒 Scroll lock activated at position:', lockScrollPosition);
                                showLockNotification();
                                pulseCalcularButton();
                                
                                // Create a continuous monitoring system
                                const lockMonitor = () => {
                                    if (!scrollLockActive || maxUnlockedSection >= 5) {
                                        return; // Exit if lock is released
                                    }
                                    
                                    const currentPosition = smoother.scrollTop();
                                    
                                    // If user tries to scroll past the lock point
                                    if (currentPosition > lockScrollPosition + 10) { // 10px tolerance
                                        smoother.scrollTo(lockScrollPosition, false); // Snap back immediately
                                        showLockNotification();
                                        pulseCalcularButton();
                                    }
                                    
                                    // Schedule next check
                                    requestAnimationFrame(lockMonitor);
                                };
                                
                                // Start the monitoring loop
                                requestAnimationFrame(lockMonitor);
                            }
                        }
                    },
                    
                    onLeave: (self) => {
                        // Only allow leaving if the section is unlocked
                        if (maxUnlockedSection < 5) {
                            // Force back to the locked position
                            const smoother = ScrollSmoother.get();
                            if (smoother && lockScrollPosition !== null) {
                                smoother.scrollTo(lockScrollPosition, true);
                            }
                        }
                    }
                });
            }
        }
    }
    
    function releaseGSAPScrollLock() {
        if (scrollLockTrigger) {
            console.log('🔓 Releasing GSAP scroll lock');
            
            // Deactivate lock monitoring
            scrollLockActive = false;
            lockScrollPosition = null;
            
            // Kill the ScrollTrigger
            scrollLockTrigger.kill();
            scrollLockTrigger = null;
            
            // Clear any pulsing animations
            const calcularButton = document.querySelector('.wrapper-4 .btn-primary');
            if (calcularButton) {
                gsap.killTweensOf(calcularButton);
                gsap.set(calcularButton, { scale: 1 });
            }
            
            // Refresh ScrollTrigger system
            ScrollTrigger.refresh();
        }
    }
    
    function pulseCalcularButton() {
        const calcularButton = document.querySelector('.wrapper-4 .btn-primary');
        if (calcularButton && !calcularButton.classList.contains('clicked')) {
            gsap.to(calcularButton, {
                scale: 1.05,
                duration: 0.8,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }

// Enhanced scrollToSection function with lock checking
function scrollToSectionWithLock(sectionNumber) {
    // Always allow navigation to unlocked sections or backwards
    if (sectionNumber <= maxUnlockedSection) {
        scrollToSection(sectionNumber);
    } else {
        console.log(`🔒 Section ${sectionNumber} is locked. Complete the current section first.`);
        // Optional: Show a notification to the user
        showLockNotification();
    }
}

function showLockNotification() {
    // Prevent multiple notifications from stacking
    const existingNotification = document.querySelector('.scroll-lock-notification');
    if (existingNotification) {
        return; // Already showing a notification
    }
    
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'scroll-lock-notification'; // Add additional style classes here if desired
    
    // Create structured content
    notification.innerHTML = `
        <div class="lock-icon">🔒</div>
        <div class="main-text">Completa el formulario para continuar</div>
        <div class="sub-text">Haz clic en "Calcular" para desbloquear</div>
    `;
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3.5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400); // Wait for fade out animation
    }, 2000);
}

    // **DEBUG INFORMATION** - Show current scroll status (remove in production)
    if (typeof window !== 'undefined') {
        window.debugScrollLock = {
            getCurrentSection: () => {
                const smoother = ScrollSmoother.get();
                if (smoother) {
                    const progress = smoother.progress();
                    return Math.floor(progress * 5) + 1;
                }
                return 1;
            },
            getMaxUnlocked: () => maxUnlockedSection,
            unlockNext: () => unlockNextSection(),
            createLock: () => createGSAPScrollLock(),
            releaseLock: () => releaseGSAPScrollLock(),
            showCurrentStatus: () => {
                console.log(`Current Section: ${window.debugScrollLock.getCurrentSection()}`);
                console.log(`Max Unlocked: ${maxUnlockedSection}`);
                console.log(`Scroll Progress: ${ScrollSmoother.get()?.progress() || 0}`);
                console.log(`Lock Active: ${scrollLockTrigger ? 'Yes' : 'No'}`);
                console.log(`Lock Position: ${lockScrollPosition}`);
                console.log(`Current Scroll: ${ScrollSmoother.get()?.scrollTop() || 0}`);
                console.log(`Prevent Events: ${preventScrollEvents}`);
            }
        };
    }
// **FALLBACK SCROLL PREVENTION** - Additional methods to ensure lock works on all devices
    let preventScrollEvents = false;
    
    function enableScrollPrevention() {
        preventScrollEvents = true;
        
        // Prevent wheel events
        const wheelHandler = (e) => {
            if (preventScrollEvents && maxUnlockedSection < 5) {
                const smoother = ScrollSmoother.get();
                if (smoother && lockScrollPosition !== null) {
                    const currentPosition = smoother.scrollTop();
                    if (e.deltaY > 0 && currentPosition >= lockScrollPosition - 10) {
                        e.preventDefault();
                        e.stopPropagation();
                        showLockNotification();
                        pulseCalcularButton();
                        return false;
                    }
                }
            }
        };
        
        // Prevent touch events on mobile
        const touchHandler = (e) => {
            if (preventScrollEvents && maxUnlockedSection < 5) {
                const smoother = ScrollSmoother.get();
                if (smoother && lockScrollPosition !== null) {
                    const currentPosition = smoother.scrollTop();
                    if (currentPosition >= lockScrollPosition - 10) {
                        e.preventDefault();
                        showLockNotification();
                        pulseCalcularButton();
                        return false;
                    }
                }
            }
        };
        
        // Add event listeners
        document.addEventListener('wheel', wheelHandler, { passive: false });
        document.addEventListener('touchmove', touchHandler, { passive: false });
        document.addEventListener('touchstart', touchHandler, { passive: false });
        
        // Store handlers for removal later
        window.scrollLockHandlers = { wheelHandler, touchHandler };
    }
    
    function disableScrollPrevention() {
        preventScrollEvents = false;
        
        if (window.scrollLockHandlers) {
            document.removeEventListener('wheel', window.scrollLockHandlers.wheelHandler);
            document.removeEventListener('touchmove', window.scrollLockHandlers.touchHandler);
            document.removeEventListener('touchstart', window.scrollLockHandlers.touchHandler);
            window.scrollLockHandlers = null;
        }
    }
    
    // Update the main lock creation function to include fallback prevention
    const originalCreateGSAPScrollLock = createGSAPScrollLock;
    createGSAPScrollLock = function() {
        originalCreateGSAPScrollLock();
        if (maxUnlockedSection < 5) {
            enableScrollPrevention();
        }
    };
    
    // Update the release function to disable fallback prevention
    const originalReleaseGSAPScrollLock = releaseGSAPScrollLock;
    releaseGSAPScrollLock = function() {
        disableScrollPrevention();
        originalReleaseGSAPScrollLock();
    };
    
    // **END FALLBACK SCROLL PREVENTION**

// **ANIMATED LOADING PHRASES SYSTEM** - Enhanced with SplitText for wrapper-5
    const loadingPhrases = [
        "Consultando el oráculo de raíces...",
        "Midiendo el aura botánica de tu mascota...",
        "Comparando bigotes con pétalos...",
        "Reuniendo semillas de posibilidades...",
        "Viendo qué planta se siente identificada con tu peludo...",
        "Escaneando ladridos, maullidos y latidos...",
        "Desempolvando el herbario místico...",
        "Calculando la flor que mejor encarna su esencia...",
        "Buscando en el jardín secreto de los vínculos eternos...",
        "Polinizando emociones con fotosíntesis de amor..."
    ];
    
    let phraseTimeline = null;
    let currentPhraseIndex = 0;
    let currentSplit = null;
    
    function startLoadingAnimation() {
        const phraseElement = document.querySelector('.loading-phrase');
        if (!phraseElement) return;
        
        console.log('🌱 Starting enhanced loading phrase animation with SplitText');
        
        // Create a timeline for phrase cycling
        phraseTimeline = gsap.timeline({ repeat: -1 });
        
        // Function to animate each phrase with character-by-character effects
        function animatePhrase(index) {
            const phrase = loadingPhrases[index];
            let localSplit = null;
            
            // Create a timeline for this specific phrase
            const tl = gsap.timeline();
            
            // Step 1: Setup the phrase
            tl.call(() => {
                // Clean up global split first
                if (currentSplit) {
                    currentSplit.revert();
                    currentSplit = null;
                }
                
                // Set the text content
                phraseElement.textContent = phrase;
                
                // Create new SplitText instance
                localSplit = new SplitText(phraseElement, { 
                    type: "chars,words",
                    charsClass: "char",
                    wordsClass: "word"
                });
                
                // Update global reference
                currentSplit = localSplit;
                
                console.log(`✨ Setting up phrase ${index + 1}: "${phrase}" (${localSplit.chars.length} chars)`);
            });
            
            // Step 2: Set initial state and animate in
            tl.call(() => {
                if (localSplit && localSplit.chars) {
                    // Set initial state for all characters
                    gsap.set(localSplit.chars, {
                        opacity: 0,
                        y: 50,
                        rotationX: 90,
                        scale: 0.3,
                        transformOrigin: "50% 50%"
                    });
                    
                    // Animate characters in
                    gsap.to(localSplit.chars, {
                        opacity: 1,
                        y: 0,
                        rotationX: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.4)",
                        stagger: {
                            each: 0.03,
                            from: "start"
                        }
                    });
                }
            }, null, null, "+=0.1");
            
            // Step 3: Hold the phrase
            tl.to({}, { duration: 3.5 });
            
            // Step 4: Animate characters out
            tl.call(() => {
                if (localSplit && localSplit.chars) {
                    gsap.to(localSplit.chars, {
                        opacity: 0,
                        y: -30,
                        rotationX: -45,
                        scale: 1.2,
                        duration: 0.6,
                        ease: "back.in(1.2)",
                        stagger: {
                            each: 0.02,
                            from: "end"
                        }
                    });
                }
            });
            
            // Step 5: Wait for animation to complete
            tl.to({}, { duration: 0.6 });
            
            return tl;
        }
        
        // Add all phrases to the main timeline
        loadingPhrases.forEach((phrase, index) => {
            phraseTimeline.add(animatePhrase(index));
        });
        
        // Start the animation
        phraseTimeline.play();
    }
    
    function stopLoadingAnimation() {
        if (phraseTimeline) {
            console.log('🌱 Stopping loading phrase animation');
            phraseTimeline.kill();
            phraseTimeline = null;
        }
        
        // Clean up SplitText
        if (currentSplit) {
            currentSplit.revert();
            currentSplit = null;
        }
    }
    
    // Function to show final result (can be called later when calculation is complete)
    function showPlantResult(plantName, plantDescription) {
        stopLoadingAnimation();
        
        const loadingContainer = document.querySelector('.loading-container');
        if (!loadingContainer) return;
        
        // Create result content with static icon
        const resultHTML = `
            <div class="icon-container">
                <svg class="pet-icon result-icon" id="result-svg" width="80" height="80" viewBox="0 0 72.31 52.25">
                    <path id="result-path" d="M25.66 5.21c4.44,-2.86 16.55,-2.85 21.03,0 0.1,4.68 1.45,6.52 3.58,9.54 1.85,2.63 3.59,4.98 5.52,7.37 2.97,3.71 3.92,3.19 1.13,8 -2.33,4.03 -5.84,5.94 -6.18,6.69 -0.37,2.58 0.62,3.32 -0.86,6 -2.45,4.44 -8.53,6.6 -13.83,6.56 -4,-0.03 -7.84,-1.19 -10.44,-3.13 -5.83,-4.37 -3.34,-7.94 -4.01,-9.43 -0.61,-0.74 -1.77,-1.55 -2.53,-2.23 -2.38,-2.08 -4.71,-5.49 -5.39,-8.9l7.12 -9.18c3.23,-4.42 4.75,-6.16 4.86,-11.29zm27.81 -2.14c5.69,-0.89 11.4,5.37 13.23,8.4 1.39,2.32 2.52,4.97 2.64,8.16 0.11,3.07 -1.37,6.57 -3.99,6.79 -3.76,0.31 -9.18,-8.22 -11.19,-10.76 -2.88,-3.61 -8.8,-11.32 -0.69,-12.59zm-36.55 0.06c3.11,-0.44 6.62,0.98 6.08,4.23 -0.35,2.14 -2.7,5.42 -3.85,6.98 -2.44,3.31 -6.9,9.85 -10.13,11.62 -3.2,1.75 -5.42,-1.53 -5.87,-4.3 -1.22,-7.56 5.94,-17.4 13.77,-18.53zm43.91 24.54c1.42,0.43 1.97,1.29 4.04,1.4 1.63,0.09 2.98,-0.61 3.81,-1.35 7.6,-6.75 1.09,-21.04 -8.57,-25.85 -7.37,-3.67 -10.57,0.2 -11.59,0.68 -1.42,0.67 -9.43,-4.69 -21.64,-0.71 -1.62,0.53 -2.3,1.4 -3.36,0.5 -1.02,-0.86 -1.82,-1.36 -3.37,-1.72 -6.17,-1.46 -11.43,3.12 -13.94,5.85 -4.95,5.43 -9.15,15.82 -2.39,21.35 1,0.82 2.22,1.4 3.92,1.23 1.9,-0.19 2.44,-1 3.77,-1.38 1.07,3.57 4.61,8.69 7.44,10.04 -0.14,5.47 2.08,8.58 5.21,10.74 10.04,6.9 29.63,3.74 29.23,-10.74 1.54,-0.69 3.38,-2.92 4.5,-4.34 1.21,-1.53 2.25,-3.49 2.94,-5.7z M34.33 41.04c-5.19,1.4 -0.74,4.67 3.87,3.48 1.71,-0.44 3.05,-1.95 1.23,-3 -1.38,-0.8 -3.47,-0.92 -5.1,-0.48z M43.57 23.8c-2.53,0.87 -1.47,4.58 1.24,3.85 2.53,-0.67 1.29,-4.71 -1.24,-3.85z M27.51 23.88c-2.85,1.34 -0.86,4.74 1.56,3.69 2.2,-0.96 0.85,-4.82 -1.56,-3.69z" fill="#FF6B35"></path>
                </svg>
            </div>
            <div class="plant-result">
                <div class="result-icon">🌿</div>
                <h2 class="result-title">¡Tu planta perfecta!</h2>
                <h3 class="plant-name">${plantName}</h3>
                <p class="plant-description">${plantDescription}</p>
                <div class="result-actions">
                    <button class="btn btn-primary" onclick="location.reload()">Intentar de nuevo</button>
                </div>
            </div>
        `;
        
        // Show result immediately without waiting for morphing
        setTimeout(() => {
            // Animate out the loading content and in the result
            gsap.timeline()
                .to(loadingContainer.children, {
                    opacity: 0,
                    y: -30,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: "power2.in"
                })
                .set(loadingContainer, { innerHTML: resultHTML })
                .fromTo('.plant-result > *', 
                    {
                        opacity: 0,
                        y: 50,
                        scale: 0.8
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        stagger: 0.2,
                        duration: 0.8,
                        ease: "back.out(1.4)"
                    }
                );
        }, 500); // Quick delay for loading animation
    }
    
    // Start loading animation when wrapper-5 becomes visible
    ScrollTrigger.create({
        trigger: '#section-5',
        start: 'top 80%',
        scroller: '#smooth-wrapper',
        onEnter: () => {
            setTimeout(startLoadingAnimation, 500); // Small delay to ensure smooth transition
        },
        once: true // Only trigger once
    });
    
    // Example of how to show a result after some time (remove this in production)
    // setTimeout(() => {
    //     showPlantResult(
    //         "Rosa Majestuosa", 
    //         "Como tu mascota, esta rosa combina elegancia y carácter fuerte. Sus pétalos suaves reflejan el cariño que das y recibes cada día."
    //     );
    // }, 15000); // Show result after 15 seconds for demo
    
    // **END ANIMATED LOADING PHRASES SYSTEM**

    // **TEMPORARY TESTING BYPASS** - Remove in production
    // Press Ctrl+T to bypass form validation and unlock wrapper-5
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            console.log('🚀 TESTING BYPASS: Unlocking wrapper-5 directly');
            
            // Unlock section 5
            maxUnlockedSection = 5;
            
            // Release scroll lock
            releaseGSAPScrollLock();
            
            // Update bullet states
            window.dispatchEvent(new CustomEvent('sectionUnlocked'));
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'scroll-lock-notification';
            notification.innerHTML = `
                <div class="lock-icon">🚀</div>
                <div class="main-text">Testing Mode Activated</div>
                <div class="sub-text">Press Ctrl+5 to jump to wrapper-5</div>
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => document.body.contains(notification) && document.body.removeChild(notification), 400);
            }, 2500);
        }
        
        // Press Ctrl+5 to jump directly to wrapper-5
        if (e.ctrlKey && e.key === '5') {
            e.preventDefault();
            console.log('🎯 TESTING: Jumping to wrapper-5');
            scrollToSection(5);
        }
    });

    // Removed temporary Test Mode button (was used for testing)

    // **END TEMPORARY TESTING BYPASS**

    // Initialize UI state when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ DOM loaded, initializing triangle SVG setup...');
        
        // Array of available animal SVGs
        const animalSvgs = [
            './assets/imgs/icon-dog.svg',
            './assets/imgs/icon-cat.svg',
            './assets/imgs/icon-bunny.svg',
            './assets/imgs/icon-hamster.svg'
        ];
        
        // Get references to the three SVG positions
        const svgElements = {
            top: document.getElementById('pet-svg-top'),
            left: document.getElementById('pet-svg-left'),
            right: document.getElementById('pet-svg-right')
        };
        
        // Function to get a random SVG that's different from the current one
        function getRandomSvg(currentSrc) {
            const availableOptions = animalSvgs.filter(svg => svg !== currentSrc);
            return availableOptions[Math.floor(Math.random() * availableOptions.length)];
        }
        
        // Function to change SVG with smooth transition
        function changeSvgWithTransition(element) {
            if (!element) return;
            
            // Get current source
            const currentSrc = element.src;
            
            // Fade out - only animate opacity and scale, preserve rotation
            gsap.to(element, {
                opacity: 0.3,
                scale: 0.8,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: function() {
                    // Change the source to a random different one
                    const newSrc = getRandomSvg(currentSrc);
                    element.src = newSrc;
                    
                    // Fade back in - only animate opacity and scale, preserve rotation
                    gsap.to(element, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                }
            });
        }
        
        // Function to randomly change one of the three SVGs
        function randomlyChangeSvg() {
            const positions = ['top', 'left', 'right'];
            const randomPosition = positions[Math.floor(Math.random() * positions.length)];
            const selectedElement = svgElements[randomPosition];
            
            changeSvgWithTransition(selectedElement);
            console.log(`🔄 Changed ${randomPosition} SVG to a random animal`);
        }
        
        // Function to start continuous triangle rotation with better control
        function startContinuousRotation() {
            const triangleContainer = document.querySelector('.triangle-container');
            const allIcons = document.querySelectorAll('.pet-icon');
            
            if (triangleContainer) {
                console.log('🔧 Setting up continuous rotation with timeline control...');
                
                // Kill any existing animations on these elements
                gsap.killTweensOf(triangleContainer);
                allIcons.forEach(icon => {
                    gsap.killTweensOf(icon);
                });
                
                // Create master timeline for better control
                const masterTimeline = gsap.timeline({ repeat: -1 });
                
                // Force reset all elements to clean state
                gsap.set(triangleContainer, { 
                    rotation: 0,
                    clearProps: "all",
                    transformOrigin: "center center"
                });
                
                allIcons.forEach((icon, index) => {
                    gsap.set(icon, { 
                        rotation: 0,
                        clearProps: "all",
                        transformOrigin: "center center"
                    });
                    
                    console.log(`� Reset icon ${index} to clean state`);
                });
                
                // Small delay before starting animations
                setTimeout(() => {
                    // Add triangle rotation to timeline
                    masterTimeline.to(triangleContainer, {
                        rotation: 360,
                        duration: 5, // Faster rotation: 5 seconds for full rotation
                        ease: "none",
                        transformOrigin: "center center"
                    }, 0); // Start at time 0
                    
                    // Add counter-rotation for each icon to the same timeline
                    allIcons.forEach((icon, index) => {
                        masterTimeline.to(icon, {
                            rotation: -360,
                            duration: 5, // Same duration as triangle rotation
                            ease: "none",
                            transformOrigin: "center center"
                        }, 0); // Also start at time 0 (parallel with triangle)
                        
                        console.log(`✅ Added counter-rotation for icon ${index} to timeline`);
                    });
                    
                    // Store timeline globally for debugging
                    window.rotationTimeline = masterTimeline;
                    
                    console.log('🔄 Started synchronized rotation timeline');
                }, 50);
            }
        }
        
        // Verify all elements exist
        Object.keys(svgElements).forEach(position => {
            if (svgElements[position]) {
                console.log(`✅ ${position.charAt(0).toUpperCase() + position.slice(1)} animal icon ready`);
            }
        });
        
        // Set up all icons with proper initial state
        const petIcons = document.querySelectorAll('.pet-icon');
        console.log(`🔧 Found ${petIcons.length} pet icons to set up`);
        
        // Set initial transform properties for all icons
        petIcons.forEach((icon, index) => {
            // Clear any existing transforms and set initial state
            gsap.set(icon, { 
                rotation: 0,
                y: 0,
                x: 0,
                scale: 1,
                transform: "none",
                transformOrigin: "center center"
            });
            
            console.log(`🔧 Reset icon ${index} to clean state`);
        });
        
        // Start continuous rotation FIRST
        startContinuousRotation();
        
        // THEN add floating animations with a delay to avoid conflicts
        setTimeout(() => {
            petIcons.forEach((icon, index) => {
                // Create individual floating animation for each icon with stagger
                // Only animate Y position to avoid rotation conflicts
                gsap.to(icon, {
                    y: '+=10',
                    duration: 3,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: index * 0.5, // Stagger the floating animations
                    // Make sure this doesn't override rotation
                    transformOrigin: "center center"
                });
                console.log(`✅ Added floating animation to icon ${index}`);
            });
        }, 200); // Wait for rotation to start
        
        // Start the random SVG cycling every 1.5 seconds (no triangle rotation here)
        const cyclingInterval = setInterval(() => {
            randomlyChangeSvg(); // Only change a random SVG
        }, 500);
        
        // Store interval ID globally so it can be cleared if needed
        window.svgCyclingInterval = cyclingInterval;
        
        console.log('✅ Triangle SVG setup complete with continuous rotation and random cycling every 1.5 seconds');
    });
    
    // DEBUG: Function to monitor icon rotations
        function debugIconRotations() {
            const triangleContainer = document.querySelector('.triangle-container');
            const allIcons = document.querySelectorAll('.pet-icon');
            
            console.log('=== ROTATION DEBUG ===');
            
            if (triangleContainer) {
                const triangleStyle = window.getComputedStyle(triangleContainer);
                console.log('Triangle container transform:', triangleStyle.transform);
                console.log('Triangle container rotation (GSAP):', gsap.getProperty(triangleContainer, "rotation"));
            }
            
            allIcons.forEach((icon, index) => {
                const iconStyle = window.getComputedStyle(icon);
                console.log(`Icon ${index} computed transform:`, iconStyle.transform);
                console.log(`Icon ${index} rotation (GSAP):`, gsap.getProperty(icon, "rotation"));
                console.log(`Icon ${index} Y position (GSAP):`, gsap.getProperty(icon, "y"));
            });
            
            console.log('=====================');
        }
        
        // Add debug function to window for console access
        window.debugRotations = debugIconRotations;
        
        // Auto-debug every 5 seconds for monitoring
        setInterval(debugIconRotations, 5000);
        
        // Debug controls for rotation
        window.rotationControls = {
            stop: () => {
                if (window.rotationTimeline) {
                    window.rotationTimeline.pause();
                    console.log('⏸️ Rotation paused');
                }
            },
            start: () => {
                if (window.rotationTimeline) {
                    window.rotationTimeline.play();
                    console.log('▶️ Rotation resumed');
                }
            },
            restart: () => {
                if (window.rotationTimeline) {
                    window.rotationTimeline.kill();
                }
                startContinuousRotation();
                console.log('🔄 Rotation restarted');
            },
            reset: () => {
                const triangleContainer = document.querySelector('.triangle-container');
                const allIcons = document.querySelectorAll('.pet-icon');
                
                if (window.rotationTimeline) {
                    window.rotationTimeline.kill();
                }
                
                gsap.set(triangleContainer, { rotation: 0, clearProps: "all" });
                allIcons.forEach(icon => {
                    gsap.set(icon, { rotation: 0, clearProps: "all" });
                });
                
                console.log('🔄 All rotations reset to 0');
            }
        };