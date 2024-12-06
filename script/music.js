document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal-visible');
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    // Add reveal classes to platform titles
    document.querySelectorAll('.platform-title').forEach((title, index) => {
        title.classList.add('reveal');
        title.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
        observer.observe(title);
    });

    // Add reveal animation to iframes
    document.querySelectorAll('.music-grid iframe').forEach(iframe => {
        iframe.classList.add('reveal', 'reveal-up');
        observer.observe(iframe);
    });
});