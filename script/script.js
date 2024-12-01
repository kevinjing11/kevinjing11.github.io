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

                // Update URL without the hash
                window.history.pushState('', '', window.location.pathname);
            }
        });
    });
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