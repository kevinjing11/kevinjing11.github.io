document.addEventListener("DOMContentLoaded", function() {
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
});