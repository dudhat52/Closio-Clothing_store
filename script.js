document.addEventListener('DOMContentLoaded', () => {
    // Create "Go to Top" button
    const goToTopBtn = document.createElement('button');
    goToTopBtn.textContent = '↑';
    Object.assign(goToTopBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 15px',
        fontSize: '18px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        display: 'none',
        cursor: 'pointer',
        zIndex: '1000',
    });

    document.body.appendChild(goToTopBtn);

    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 200) {
            goToTopBtn.style.display = 'block';
        } else {
            goToTopBtn.style.display = 'none';
        }
    });

    // Smooth scroll to top
    goToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Existing code for dropdowns and carousel

    // Dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const dropdownContent = document.getElementById(dropdown.dataset.dropdown);
            dropdownContent.style.display = 'block';
        });

        dropdown.addEventListener('mouseleave', () => {
            const dropdownContent = document.getElementById(dropdown.dataset.dropdown);
            dropdownContent.style.display = 'none';
        });
    });

    // Carousel auto-scroll
    const carousel = document.querySelector('.carousel');
    let isScrolling = false;

    const startAutoScroll = () => {
        if (!isScrolling) {
            isScrolling = true;
            setInterval(() => {
                carousel.scrollBy({ left: 300, behavior: 'smooth' });
            }, 3000);
        }
    };

    carousel.addEventListener('mouseenter', () => {
        isScrolling = false;
    });

    carousel.addEventListener('mouseleave', startAutoScroll);

    startAutoScroll();

    // Smooth scroll for anchor links
    const smoothScroll = (target, duration) => {
        const targetPosition = target.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        let startTime = null;

        const animation = currentTime => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, targetPosition, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b; 
        };

        requestAnimationFrame(animation);
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScroll(targetElement, 1000);
            }
        });
    });
});