document.addEventListener('DOMContentLoaded', () => {
    // Function to add reveal classes
    const addRevealClasses = () => {
        // Add reveal classes to platform titles
        document.querySelectorAll('.platform-title').forEach((title, index) => {
            title.classList.add('reveal');
            title.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
        });

        // Add reveal animation to iframes
        document.querySelectorAll('.music-grid iframe').forEach(iframe => {
            iframe.classList.add('reveal', 'reveal-up');
        });
    };

    // Function to trigger animations
    const triggerAnimation = (element, delay = 0) => {
        setTimeout(() => {
            element.classList.add('reveal-visible');
        }, delay);
    };

    // Initialize observer for scrolling animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerAnimation(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    // Add reveal classes
    addRevealClasses();

    // Trigger animations for elements already in view
    document.querySelectorAll('.reveal').forEach((element, index) => {
        // Check if element is in viewport
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;

        if (isInViewport) {
            // Stagger the animations
            triggerAnimation(element, index * 200);
        } else {
            // Observe elements not in viewport
            observer.observe(element);
        }
    });
});