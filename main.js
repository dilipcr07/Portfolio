// ============================================
// MAIN JAVASCRIPT - Handles loading and interactions
// ============================================

// Initialize AOS animations
AOS.init({ 
    duration: 800, 
    once: false, 
    mirror: true,
    offset: 50
});

// Set current year in footer
document.getElementById('year').innerHTML = new Date().getFullYear();

// Mobile menu toggle
const menuToggle = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Load all sections dynamically
async function loadSections() {
    const sections = ['about', 'training', 'skills', 'projects', 'hobbies', 'gallery', 'contact'];
    const container = document.getElementById('sections-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const section of sections) {
        try {
            const response = await fetch(`sections/${section}.html`);
            if (response.ok) {
                const html = await response.text();
                container.innerHTML += html;
            } else {
                console.warn(`Section ${section} not found`);
            }
        } catch (error) {
            console.error(`Error loading ${section}:`, error);
        }
    }
    
    // Re-initialize AOS for dynamically loaded content
    AOS.refresh();
    
    // Setup contact form after loading
    setupContactForm();
}

// Contact form handler
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form && !form.hasAttribute('data-listener')) {
        form.setAttribute('data-listener', 'true');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();
            const feedback = document.getElementById('formFeedback');
            
            if (!name || !email || !message) {
                if (feedback) feedback.innerHTML = '<span style="color: #ff7777;">❌ Please fill all required fields</span>';
                return;
            }
            if (!email.includes('@')) {
                if (feedback) feedback.innerHTML = '<span style="color: #ff7777;">⚠️ Please enter a valid email</span>';
                return;
            }
            
            if (feedback) {
                feedback.innerHTML = '<span style="color: #0ff0fc;">✅ Message sent! I will get back to you soon.</span>';
            }
            form.reset();
            setTimeout(() => {
                if (feedback) feedback.innerHTML = '';
            }, 5000);
        });
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link, .btn-primary, .btn-outline').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        }
    });
});

// Load all sections when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSections();
});

console.log('✅ Portfolio loaded - Edit section files in /sections/ folder to update content');