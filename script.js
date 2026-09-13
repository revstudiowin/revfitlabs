document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation & Header Scroll State ---
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });


    // --- Mobile Menu Toggle ---
    const hamburgerBtn = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');

    function toggleMenu() {
        const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
        
        hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
        hamburgerBtn.classList.toggle('is-active');
        
        mobileMenu.setAttribute('aria-hidden', isExpanded);
        mobileMenu.classList.toggle('is-open');
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    }

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });


    // --- Scroll Reveal Animations (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px" 
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Number Counter Animation ---
    const counterElements = document.querySelectorAll('.counter');
    const counterObserverOptions = {
        threshold: 0.5,
        rootMargin: "0px"
    };

    const counterObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetEl = entry.target;
                const targetNum = parseInt(targetEl.getAttribute('data-target'), 10);
                if (isNaN(targetNum)) return;
                
                let startTime = null;
                const duration = 2000; // 2 seconds

                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    // easeOutExpo function for smooth deceleration
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    
                    targetEl.innerText = Math.floor(easeProgress * targetNum);
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        targetEl.innerText = targetNum;
                    }
                };
                
                window.requestAnimationFrame(step);
                observer.unobserve(targetEl);
            }
        });
    }, counterObserverOptions);

    counterElements.forEach(el => {
        counterObserver.observe(el);
    });

    // --- Trainerize Scroll Stack Animation ---
    const scrollWrapper = document.getElementById('trainerize-scroll-wrapper');
    const stackCards = document.querySelectorAll('.stack-card');
    
    if (scrollWrapper && stackCards.length > 0) {
        // Check for prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            let isTicking = false;
            
            const updateCards = () => {
                // Check if we are in mobile layout (where stacking is disabled)
                if (window.innerWidth <= 968) {
                    isTicking = false;
                    return; // CSS resets transforms, no JS needed
                }
                
                const rect = scrollWrapper.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // The wrapper is taller than the viewport. The section inside sticks at top: 0.
                // It starts sticking when rect.top <= 0 and stops when rect.bottom <= viewportHeight.
                const scrollableDistance = rect.height - viewportHeight; 
                
                let progress = 0;
                if (rect.top <= 0) {
                    // Calculate progress from 0 to 1 based on how far we've scrolled while pinned
                    progress = Math.min(Math.abs(rect.top) / scrollableDistance, 1);
                }
                
                // Map progress (0 to 1) to cards
                stackCards.forEach((card, index) => {
                    let yTransform = '150%'; // default offscreen below (clipped by parent)
                    let scale = 1;
                    let opacity = 1;
                    let shadowOpacity = 0.05;
                    
                    if (index === 0) {
                        yTransform = `-${progress * 40}px`;
                        scale = 1 - (progress * 0.08);
                        opacity = 1 - (progress * 0.4);
                    } else if (index === 1) {
                        const cardProgress = Math.max(0, Math.min(progress / 0.5, 1));
                        if (progress <= 0.5) {
                            yTransform = `${150 - (cardProgress * 150)}%`;
                        } else {
                            const overProgress = (progress - 0.5) / 0.5;
                            yTransform = `-${overProgress * 20}px`;
                            scale = 1 - (overProgress * 0.04);
                            opacity = 1 - (overProgress * 0.2);
                        }
                        shadowOpacity = 0.05 + (cardProgress * 0.15); // max 0.2 shadow
                    } else if (index === 2) {
                        const cardProgress = Math.max(0, Math.min((progress - 0.5) / 0.5, 1));
                        yTransform = `${150 - (cardProgress * 150)}%`;
                        shadowOpacity = 0.05 + (cardProgress * 0.2); // max 0.25 shadow
                    }
                    
                    card.style.setProperty('--card-y', yTransform);
                    card.style.setProperty('--card-scale', scale);
                    card.style.setProperty('--card-opacity', opacity);
                    card.style.setProperty('--card-shadow', `rgba(0,0,0,${shadowOpacity})`);
                });
                
                isTicking = false;
            };
            
            window.addEventListener('scroll', () => {
                if (!isTicking) {
                    window.requestAnimationFrame(updateCards);
                    isTicking = true;
                }
            }, { passive: true });
            
            // Initial call
            updateCards();
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (!isTicking) {
                    window.requestAnimationFrame(updateCards);
                    isTicking = true;
                }
            }, { passive: true });
        }
    }
});
