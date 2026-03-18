/* ===================================
   PRESTIGE ACADEMY - JAVASCRIPT
   =================================== */

// ==================== DOM Elements ==================== //
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// ==================== Mobile Menu Toggle ==================== //
/**
 * Toggle mobile hamburger menu
 */
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

/**
 * Close mobile menu when a nav link is clicked
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

/**
 * Close mobile menu when clicking outside
 */
document.addEventListener('click', (event) => {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ==================== Smooth Scrolling ==================== //
/**
 * Smooth scroll to a specific element
 * @param {string} selector - CSS selector or ID of target element
 */
function smoothScroll(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

/**
 * Smooth scroll to contact form
 */
function scrollToForm() {
    smoothScroll('#contactForm');
}

// ==================== Form Validation ==================== //
/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show error message for a form field
 * @param {HTMLElement} field - Form field element
 * @param {string} message - Error message to display
 */
function showError(field, message) {
    const errorId = field.id + 'Error';
    const errorElement = document.getElementById(errorId);
    
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Clear error message for a form field
 * @param {HTMLElement} field - Form field element
 */
function clearError(field) {
    const errorId = field.id + 'Error';
    const errorElement = document.getElementById(errorId);
    
    field.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Validate entire contact form
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    let isValid = true;

    // Validate name
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Name must be at least 2 characters');
        isValid = false;
    } else {
        clearError(nameInput);
    }

    // Validate email
    if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError(emailInput);
    }

    // Validate subject
    if (!subjectInput.value) {
        showError(subjectInput, 'Please select a subject');
        isValid = false;
    } else {
        clearError(subjectInput);
    }

    // Validate message
    if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters');
        isValid = false;
    } else {
        clearError(messageInput);
    }

    return isValid;
}

// ==================== Form Submission ==================== //
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Prepare for submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        const successMsg = document.getElementById('formSuccess');
        const formData = new FormData(contactForm);
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

        try {
            // Real Formspree submission using fetch
            const response = await fetch('https://formspree.io/f/xzdjklrb', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                if (successMsg) {
                    successMsg.style.display = 'block';
                    successMsg.textContent = "Thank you! Your message has been sent successfully.";
                    successMsg.style.color = "var(--success)";
                }

                // Reset form
                contactForm.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    throw new Error(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    throw new Error("Oops! There was a problem submitting your form");
                }
            }
        } catch (error) {
            // Show error message
            if (successMsg) {
                successMsg.style.display = 'block';
                successMsg.textContent = error.message;
                successMsg.style.color = "var(--error)";
                successMsg.style.backgroundColor = "#fee2e2";
            }
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;

            // Hide success/error message after 5 seconds
            setTimeout(() => {
                if (successMsg) {
                    successMsg.style.display = 'none';
                }
            }, 5000);
        }
    });

    // Clear error messages on input
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            clearError(input);
        });
    });
}

// ==================== Scroll Animations ==================== //
/**
 * Observe elements for scroll animations
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply scroll animations to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll(
        '.highlight-card, .program-card, .facility-card, .news-card, .info-block'
    );
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(card);
    });
});

// ==================== Active Navigation Link ==================== //
/**
 * Update active navigation link based on scroll position
 */
window.addEventListener('scroll', () => {
    let currentSection = '';
    
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// ==================== Utility Functions ==================== //
/**
 * Add active class styling to nav link
 */
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--secondary-color);
        font-weight: 600;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ==================== Keyboard Navigation ==================== //
/**
 * Close mobile menu with Escape key
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ==================== Performance Optimization ==================== //
/**
 * Lazy loading for images (if needed in future)
 * Using native lazy loading with data attributes
 */
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-lazy]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.lazy;
                img.removeAttribute('data-lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// ==================== Print Functionality ==================== //
/**
 * Print page with enhanced styling
 */
function printPage() {
    window.print();
}

// ==================== Console Warning ==================== //
/**
 * Professional console message
 */
console.log(
    '%cJugal School Official',
    'font-size: 24px; font-weight: bold; color: #1e3a8a; text-shadow: 2px 2px 0px rgba(245, 158, 11, 0.3);'
);
console.log(
    '%cDo Good, Be Good',
    'font-size: 14px; color: #f59e0b; font-style: italic;'
);
