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

    const words = ["Kevin Jing", "A Founder", "A Lifelong Learner"];
    let i = 0;
    let j = 0;
    let currentWord = "";
    let isDeleting = false;
    let isWaiting = false;
    const typewriterElement = document.getElementById("typewriter");

    function type() {
        if (i < words.length) {
            if (!isDeleting && !isWaiting && j < words[i].length + 1) {
                currentWord = words[i].substring(0, j++);
                typewriterElement.textContent = currentWord;
            }

            if (isDeleting && j > 0) {
                currentWord = words[i].substring(0, j--);
                typewriterElement.textContent = currentWord;
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

    const timelineItems = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => {
        observer.observe(item);
    });

    const timeline = document.querySelector('.timeline');
    const progressBar = document.createElement('div');
    progressBar.classList.add('timeline_progress');
    timeline.appendChild(progressBar);

    function updateProgress() {
        const timelineRect = timeline.getBoundingClientRect();
        const timelineStart = timelineRect.top;
        const timelineEnd = timelineRect.bottom;
        const windowHeight = window.innerHeight;

        let progress = (windowHeight - timelineStart) / (timelineEnd - timelineStart);
        progress = Math.min(Math.max(progress, 0), 1);

        progressBar.style.height = `${progress * 100}%`;

        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemMiddle = rect.top + rect.height / 2;

            if (itemMiddle < windowHeight * 0.8) {
                item.classList.add('active');
                item.classList.add('visible');
            } else {
                item.classList.remove('active');
            }
        });
    }

    timelineItems.forEach(item => {
        experienceObserver.observe(item);
    });

    window.addEventListener('scroll', updateProgress);
    updateProgress();
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