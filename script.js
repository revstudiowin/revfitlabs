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
});
