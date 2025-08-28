document.addEventListener("DOMContentLoaded", function() {
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Optimize cursor movement with requestAnimationFrame
    let cursorX = 0;
    let cursorY = 0;
    let requestId = null;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;

        if (!requestId) {
            requestId = requestAnimationFrame(updateCursor);
        }
    });

    function updateCursor() {
        const x = cursorX;
        const y = cursorY;
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
        requestId = null;
    }

    // Optimize hover detection
    const interactiveElements = document.querySelectorAll('a, button, input, .skill-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    const words = ["Kevin Jing", "A Founder", "A Lifelong Learner", "A Producer"];
    let i = 0;
    let j = 0;
    let currentWord = "";
    let isDeleting = false;
    let isWaiting = false;
    const typewriterElement = document.getElementById("typewriter");

    // Render typed text; when the active word is "A Producer", wrap it in a link
    function renderTypewriter(text, wordIndex) {
        const isProducer = words[wordIndex] === "A Producer";
        if (isProducer) {
            typewriterElement.innerHTML = `<a href="https://okjmusic.com" target="_blank" rel="noopener" class="typewriter-link">${text}</a>`;
        } else {
            typewriterElement.textContent = text;
        }
    }

    function type() {
        if (i < words.length) {
            if (!isDeleting && !isWaiting && j < words[i].length + 1) {
                currentWord = words[i].substring(0, j++);
                renderTypewriter(currentWord, i);
            }

            if (isDeleting && j > 0) {
                currentWord = words[i].substring(0, j--);
                renderTypewriter(currentWord, i);
            }

            if (j === words[i].length + 1 && !isDeleting && !isWaiting) {
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                }, 2000);
            }

            if (isDeleting && j === 0) {
                isDeleting = false;
                i++;
                if (i === words.length) {
                    i = 0;
                }
            }
        }
        const speed = isDeleting ? 75 : 200;
        setTimeout(type, speed);
    }

    type();

    // Magnetic effect for social icons
    const magneticButtons = document.querySelectorAll('.social-icons a');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const position = button.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0px, 0px)';
        });
    });

    // Replace the splitText function and its initialization (around lines 94-127)
    const splitText = (element) => {
        // Hide the original text immediately
        element.style.visibility = 'hidden';
        const text = element.textContent;
        const words = text.split(' ');

        // Clear the element after getting its text
        requestAnimationFrame(() => {
            element.textContent = '';
            element.style.visibility = 'visible';

        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';

                const chars = word.split('');
                chars.forEach((char, charIndex) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.setProperty('--delay', `${wordIndex * 0.1 + charIndex * 0.03}s`);
                    span.className = 'char';
                    wordSpan.appendChild(span);
                });

            element.appendChild(wordSpan);

                if (wordIndex < words.length - 1) {
                    const space = document.createElement('span');
                    space.innerHTML = '&nbsp;';
                    space.style.display = 'inline-block';
                    element.appendChild(space);
                }
            });

            // Add animation class after all elements are created
            requestAnimationFrame(() => {
                element.classList.add('animate-heading');
            });
        });
    };

    // Create a new observer for headings
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (!element.dataset.split) {
                    splitText(element);
                    element.dataset.split = 'true';
                    // Add animation class to trigger the animation
                    element.classList.add('animate-heading');
                }
                // After the about heading animates in, ensure the paragraph fits in its container
                if (element.closest('.about-content')) {
                    requestAnimationFrame(() => {
                        fitAboutText();
                    });
                }
                headingObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });

    // Initialize the observer for h2 elements
    document.querySelectorAll('h2').forEach(heading => {
        headingObserver.observe(heading);
    });

    // 3D card effect for skill items
    const cards = document.querySelectorAll('.skill-item');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                experienceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    const educationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `skillFadeIn 1.2s ease forwards ${index * 0.5}s`;
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    const volunteeringObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                volunteeringObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    // Initialize observers
    console.log('Setting up observers...');
    document.querySelectorAll('.experience-item').forEach((item) => {
        experienceObserver.observe(item);
    });
    document.querySelectorAll('.education-item').forEach((item) => {
        educationObserver.observe(item);
    });
    document.querySelectorAll('.skill-item').forEach((item) => {
        skillsObserver.observe(item);
    });
    document.querySelectorAll('.volunteering-item').forEach((item) => {
        volunteeringObserver.observe(item);
    });
    console.log('Observers initialized');

    // Initialize search functionality
    console.log('Initializing search...');
    const searchInput = document.querySelector('.search-container input');
    console.log('Search Input Element:', searchInput);

    const sections = document.querySelectorAll('section');
    console.log('Found Sections:', sections.length);

    searchInput.addEventListener('input', (e) => {
        console.log('Search Input Event Triggered');
        const searchTerm = e.target.value.toLowerCase();
        console.log('Search Term:', searchTerm);

        if (searchTerm.length < 2) {
            console.log('Search term too short, clearing highlights');
            clearHighlights();
            return;
        }

        clearHighlights();
        let matchFound = false;

        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            console.log('Searching in section:', section.className);

            if (text.includes(searchTerm)) {
                console.log('Match found in section:', section.className);
                matchFound = true;
                highlightMatches(section, searchTerm);
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });

        if (!matchFound) {
            console.log('No matches found for:', searchTerm);
        }
    });

    // Add smooth scrolling for navigation
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add this after the cursor code
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        });
    });

    // Add page transition effect
    document.addEventListener('DOMContentLoaded', () => {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
    });

    initParallaxEffect();

    initMobileMenu();

    // Add HotTakes background animation
    createHotTakesBackground();

    // Ensure the About section text fits within the fixed-height container
    fitAboutText();
    const debouncedFit = debounce(fitAboutText, 150);
    window.addEventListener('resize', debouncedFit);
    window.addEventListener('orientationchange', debouncedFit);
});

function clearHighlights() {
    const highlighted = document.querySelectorAll('.search-highlight');
    console.log('Clearing highlights, found:', highlighted.length);
    highlighted.forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
    });
}

function highlightMatches(element, searchTerm) {
    console.log('Highlighting matches for term:', searchTerm);
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let matchCount = 0;
    let node;
    while (node = walker.nextNode()) {
        const text = node.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            matchCount++;
            const span = document.createElement('span');
            span.className = 'search-highlight';
            span.textContent = node.textContent;
            node.parentNode.replaceChild(span, node);
        }
    }
    console.log('Found and highlighted', matchCount, 'matches');
}

function initParallaxEffect() {
    const hero = document.querySelector('.hero-content');

    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX - window.innerWidth / 2) * 0.015;
        const mouseY = (e.clientY - window.innerHeight / 2) * 0.015;

        requestAnimationFrame(() => {
            hero.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = navLinks.querySelectorAll('a');

    // Add index for staggered animation
    links.forEach((link, index) => {
        link.style.setProperty('--index', index);
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

function createHotTakesBackground() {
    // Find the HotTakes experience item
    const experienceItems = document.querySelectorAll('.experience-item');
    let hottakesItem = null;

    experienceItems.forEach(item => {
        if (item.querySelector('h3').textContent.includes('HOTTAKES')) {
            hottakesItem = item;
            item.classList.add('hottakes-item');
        }
    });

    if (!hottakesItem) return;

    // Create the background container
    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'hottakes-background';

    // Configuration
    const numRows = 5;
    const logosPerRow = 10;
    const logoSrc = 'assets/hottakes-logo-long.png'; // Using existing logo

    // Create rows of logos
    for (let i = 0; i < numRows; i++) {
        const row = document.createElement('div');
        row.className = 'logo-row';

        // Create a single container with double the logos for seamless looping
        const logoContainer = document.createElement('div');
        logoContainer.className = 'logo-container';

        // Alternate direction for each row
        if (i % 2 === 0) {
            logoContainer.classList.add('move-left');
        } else {
            logoContainer.classList.add('move-right');
        }

        // Add logos to the container (double the amount for seamless looping)
        for (let j = 0; j < logosPerRow * 2; j++) {
            const logo = document.createElement('img');
            logo.src = logoSrc;
            logo.alt = 'HotTakes Logo';
            logoContainer.appendChild(logo);
        }

        row.appendChild(logoContainer);
        backgroundContainer.appendChild(row);

        // Adjust animation speed slightly for each row to create more visual interest
        logoContainer.style.animationDuration = (25 + i * 5) + 's';
    }

    // Add the background container to the HotTakes item
    hottakesItem.insertBefore(backgroundContainer, hottakesItem.firstChild);
}

// Ensure the About section paragraph scales down to fit within the fixed 40vh section
function fitAboutText() {
    const about = document.querySelector('.about');
    const content = document.querySelector('.about-content');
    if (!about || !content) return;

    // Only apply on desktop/tablet where the section is fixed at 40vh
    if (window.innerWidth <= 768) return;

    const heading = content.querySelector('h2');
    const paragraph = content.querySelector('p');
    if (!paragraph) return;

    // Reset sizes to computed defaults before measuring
    paragraph.style.fontSize = '';
    paragraph.style.lineHeight = '';
    if (heading) heading.style.fontSize = '';

    const baseParaSize = parseFloat(getComputedStyle(paragraph).fontSize) || 16;
    const baseLineHeight = parseFloat(getComputedStyle(paragraph).lineHeight) || baseParaSize * 1.6;
    const baseHeadingSize = heading ? parseFloat(getComputedStyle(heading).fontSize) : 0;

    // Quick exit if it already fits
    const fitsNow = () => content.getBoundingClientRect().bottom <= about.getBoundingClientRect().bottom - 4;
    if (fitsNow()) return;

    // Binary search best scale between 0.7 and 1.0
    let low = 0.7;
    let high = 1.0;
    let best = low;

    for (let k = 0; k < 18; k++) { // ~2^-18 precision, plenty
        const mid = (low + high) / 2;

        // Apply trial scale
        paragraph.style.fontSize = (baseParaSize * mid) + 'px';
        paragraph.style.lineHeight = (baseLineHeight * mid) + 'px';
        if (heading && baseHeadingSize) {
            // Keep heading closer to paragraph size so it remains visually prominent
            const headingScale = Math.max(0.65, mid * 0.98);
            heading.style.fontSize = (baseHeadingSize * headingScale) + 'px';
        }

        if (fitsNow()) {
            best = mid;
            low = mid; // try larger
        } else {
            high = mid; // need smaller
        }
    }

    // Try a slight bump up for legibility, keeping within fit constraints
    let finalScale = Math.min(1.0, best * 1.035);
    paragraph.style.fontSize = (baseParaSize * finalScale) + 'px';
    paragraph.style.lineHeight = (baseLineHeight * finalScale) + 'px';
    if (heading && baseHeadingSize) {
        let headingScale = Math.max(0.65, finalScale * 0.99);
        heading.style.fontSize = (baseHeadingSize * headingScale) + 'px';
    }

    if (!fitsNow()) {
        finalScale = Math.min(1.0, best * 1.02);
        paragraph.style.fontSize = (baseParaSize * finalScale) + 'px';
        paragraph.style.lineHeight = (baseLineHeight * finalScale) + 'px';
        if (heading && baseHeadingSize) {
            let headingScale = Math.max(0.65, finalScale * 0.99);
            heading.style.fontSize = (baseHeadingSize * headingScale) + 'px';
        }
    }
}

function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}