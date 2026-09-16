// ============================================
// MAIN JAVASCRIPT - Portfolio Interactions & Logic
// ============================================

// 1. Initialize AOS (Animate on Scroll)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        once: false,
        mirror: true,
        offset: 50
    });
}

// 2. Set Current Year in Footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// 3. Mobile Navigation Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// 4. Smooth Scrolling & Active Link Handling
const scrollAnchors = document.querySelectorAll('.nav-link, .btn-primary, .btn-outline');
scrollAnchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, href);
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        } else if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Highlight active nav item based on scroll position (for single-page view)
const pageSections = document.querySelectorAll('section[id]');
if (pageSections.length > 1) {
    function updateActiveNavOnScroll() {
        const scrollPos = window.scrollY + 120;
        let currentSectionId = '';
        pageSections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            document.querySelectorAll('.nav-link').forEach(link => {
                const target = link.getAttribute('data-target') || (link.getAttribute('href') || '').replace('#', '').replace(/\//g, '');
                if (target === currentSectionId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

// 5. Security Gallery Modal
const galleryItems = [
    { icon: 'fa-terminal', name: 'Nmap Network Scan - Host Discovery & Port Analysis' },
    { icon: 'fa-file-alt', name: 'Nessus Vulnerability Assessment Report' },
    { icon: 'fa-terminal', name: 'Metasploit Framework - Exploitation Lab' },
    { icon: 'fa-shield-virus', name: 'CrowdStrike Falcon Console - Next-Gen SIEM & EDR Threat Workbench' },
    { icon: 'fa-certificate', name: 'Advanced Cybersecurity Training Certificate' },
    { icon: 'fa-bug', name: 'Burp Suite - Web Application Security Testing' }
];

window.openGalleryModal = function (idx) {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    if (modal && modalImage && modalCaption && galleryItems[idx]) {
        modalImage.innerHTML = `<i class="fas ${galleryItems[idx].icon}" style="font-size: 4rem;"></i>`;
        modalCaption.innerHTML = galleryItems[idx].name;
        modal.style.display = 'block';
    }
};

window.closeGalleryModal = function () {
    const modal = document.getElementById('galleryModal');
    if (modal) modal.style.display = 'none';
};

window.addEventListener('click', (e) => {
    const modal = document.getElementById('galleryModal');
    if (modal && e.target === modal) {
        closeGalleryModal();
    }
});

// 6. Contact Form Submission (FormSubmit.co API with Mailto Fallback)
function setupContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const fb = document.getElementById('formFeedback');

    if (form && !form.hasAttribute('data-listener-attached')) {
        form.setAttribute('data-listener-attached', 'true');
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();
            const honey = form.querySelector('input[name="_honey"]')?.value;

            // Honeypot trap for spambots
            if (honey) return;

            // Form validation
            if (!name || !email || !message) {
                if (fb) {
                    fb.className = 'form-feedback error';
                    fb.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all fields.';
                }
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (fb) {
                    fb.className = 'form-feedback error';
                    fb.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please provide a valid email address.';
                }
                return;
            }

            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<i class="fas fa-paper-plane"></i> Send Secure Msg';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';
            }
            if (fb) {
                fb.className = 'form-feedback';
                fb.innerHTML = '<span style="color: #0ff0fc;"><i class="fas fa-circle-notch fa-spin"></i> Delivering secure message to Dilip...</span>';
            }

            const mailtoFallback = `mailto:dilipcr777@gmail.com?subject=${encodeURIComponent('Portfolio Contact from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;

            try {
                const response = await fetch('https://formsubmit.co/ajax/dilipcr777@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: `New Portfolio Message from ${name}`,
                        _template: 'table',
                        _captcha: 'false'
                    })
                });

                const data = await response.json();

                if (response.ok && (data.success === 'true' || data.success === true)) {
                    if (fb) {
                        fb.className = 'form-feedback success';
                        fb.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! Dilip will get back to you soon.';
                    }
                    form.reset();
                    setTimeout(() => {
                        if (fb && fb.classList.contains('success')) fb.innerHTML = '';
                    }, 6000);
                } else if (data.message && data.message.toLowerCase().includes('activat')) {
                    if (fb) {
                        fb.className = 'form-feedback';
                        fb.innerHTML = '<span style="color: #0ff0fc;"><i class="fas fa-envelope-open-text"></i> <strong>Action Required:</strong> FormSubmit sent a one-time activation link to <strong>dilipcr777@gmail.com</strong>. Please check your inbox and click <strong>"Activate Form"</strong>!</span>';
                    }
                } else if (data.message && data.message.toLowerCase().includes('web server')) {
                    if (fb) {
                        fb.className = 'form-feedback';
                        fb.innerHTML = `<span style="color: #ffb86c;"><i class="fas fa-info-circle"></i> Browsers block form delivery when opened directly as a local <code>file://</code>. Once published on <strong>GitHub Pages</strong>, it sends automatically! You can <a href="${mailtoFallback}">click here to email dilipcr777@gmail.com directly</a>.</span>`;
                    }
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (err) {
                console.error('Contact form submission error:', err);
                if (fb) {
                    fb.className = 'form-feedback error';
                    fb.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Notice: Form delivery requires hosting on a live server (like GitHub Pages). You can <a href="${mailtoFallback}">click here to email me directly</a> at dilipcr777@gmail.com.`;
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }
}

// 7. Optional Dynamic Section Loader (for HTTP/server environments with #sections-container)
async function loadSections() {
    const container = document.getElementById('sections-container');
    if (!container) return;

    const sections = ['about', 'training', 'skills', 'projects', 'hobbies', 'gallery', 'contact'];
    container.innerHTML = '';

    for (const section of sections) {
        try {
            const response = await fetch(`sections/${section}.html`);
            if (response.ok) {
                const html = await response.text();
                container.innerHTML += html;
            }
        } catch (error) {
            console.warn(`Dynamic load skipped for ${section}:`, error);
        }
    }

    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    setupContactForm();
    initCertifications();
}

// 8. Certifications Rendering, Live Search & Filtering
function initCertifications() {
    if (typeof CERTIFICATIONS_DATA === 'undefined' || !Array.isArray(CERTIFICATIONS_DATA)) {
        return;
    }

    // Determine path prefix based on whether page is in a subdirectory (e.g., training/)
    const hasSubdirCss = document.querySelector('link[href*="../css/style.css"]');
    const isSubdir = hasSubdirCss !== null || window.location.pathname.includes('/training/');
    const basePath = isSubdir ? '../' : '';

    // Update Banner Metric Counters if present
    const totalCountEl = document.getElementById('totalCertCount');
    const partnerCountEl = document.getElementById('partnerCertCount');
    const learningPlanCountEl = document.getElementById('learningPlanCount');
    const specialistCourseCountEl = document.getElementById('specialistCourseCount');

    if (totalCountEl) totalCountEl.textContent = CERTIFICATIONS_DATA.length;
    if (partnerCountEl) {
        const partnerCount = CERTIFICATIONS_DATA.filter(c => c.category === 'partner').length;
        partnerCountEl.textContent = partnerCount;
    }
    if (learningPlanCountEl) {
        const lpCount = CERTIFICATIONS_DATA.filter(c => c.category === 'learning-plan').length;
        learningPlanCountEl.textContent = lpCount;
    }
    if (specialistCourseCountEl) {
        const courseCount = CERTIFICATIONS_DATA.filter(c => !['partner', 'learning-plan'].includes(c.category)).length;
        specialistCourseCountEl.textContent = courseCount;
    }

    // Update filter pill counts if present
    const filterButtons = document.querySelectorAll('.cert-filter-btn');
    filterButtons.forEach(btn => {
        const filterVal = btn.getAttribute('data-filter');
        const countSpan = btn.querySelector('.filter-count');
        if (countSpan) {
            if (filterVal === 'all') {
                countSpan.textContent = CERTIFICATIONS_DATA.length;
            } else {
                const count = CERTIFICATIONS_DATA.filter(c => c.category === filterVal).length;
                countSpan.textContent = count;
            }
        }
    });

    // 1. Full Gallery Page Container (#certificationsGrid)
    const fullGrid = document.getElementById('certificationsGrid');
    const searchInput = document.getElementById('certSearch');
    const searchClear = document.getElementById('certSearchClear');
    const resultsMeta = document.getElementById('certResultsMeta');

    let currentFilter = 'all';
    let currentSearchTerm = '';

    function renderCertList() {
        if (!fullGrid) return;

        let filtered = CERTIFICATIONS_DATA.filter(item => {
            const matchesFilter = (currentFilter === 'all') || (item.category === currentFilter);
            if (!matchesFilter) return false;

            if (!currentSearchTerm) return true;

            const q = currentSearchTerm.toLowerCase();
            const inTitle = (item.title || '').toLowerCase().includes(q);
            const inIssuer = (item.issuer || '').toLowerCase().includes(q);
            const inCertId = (item.certId || '').toLowerCase().includes(q);
            const inDesc = (item.description || '').toLowerCase().includes(q);
            const inTools = (item.tools || []).some(t => t.toLowerCase().includes(q));

            return inTitle || inIssuer || inCertId || inDesc || inTools;
        });

        if (resultsMeta) {
            resultsMeta.textContent = `Showing ${filtered.length} of ${CERTIFICATIONS_DATA.length} certifications`;
        }

        if (filtered.length === 0) {
            fullGrid.innerHTML = `
                <div class="no-certs-found">
                    <i class="fas fa-search"></i>
                    <h3>No matching certifications found</h3>
                    <p>Try searching for a different keyword such as <code>SIEM</code>, <code>Zero Trust</code>, <code>Endpoint</code>, or <code>Falcon</code>.</p>
                </div>
            `;
            return;
        }

        fullGrid.innerHTML = filtered.map(cert => {
            const pdfUrl = cert.pdf ? `${basePath}${cert.pdf}` : null;
            const cardThemeClass = cert.category === 'partner' ? 'card-partner' : (cert.category === 'learning-plan' ? 'card-learning-plan' : 'card-course');

            return `
                <div class="card training-card ${cardThemeClass}" data-aos="fade-up">
                    <div>
                        <div class="card-top-meta">
                            <span class="card-badge-pill ${cert.badgeColor}">
                                <i class="fas ${cert.category === 'partner' ? 'fa-shield-alt' : (cert.category === 'learning-plan' ? 'fa-graduation-cap' : 'fa-certificate')}"></i>
                                ${cert.badgeType}
                            </span>
                            ${cert.date ? `<span class="cert-date"><i class="far fa-calendar-alt"></i> ${cert.date}</span>` : ''}
                        </div>

                        <h3>${cert.title}</h3>
                        <p class="institution"><i class="fas fa-award"></i> ${cert.issuer}</p>
                        ${cert.certId ? `<span class="cert-id-tag"><i class="fas fa-id-badge"></i> Credential: ${cert.certId}</span>` : ''}
                        <p class="cert-desc">${cert.description}</p>
                        
                        <div class="tools-used">
                            ${(cert.tools || []).map(t => `<span>${t}</span>`).join('')}
                        </div>
                    </div>

                    <div class="card-footer">
                        <span class="verified-stamp"><i class="fas fa-check-circle"></i> Authenticated</span>
                        ${pdfUrl ? `
                            <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn-cert-view ${cert.badgeColor === 'gold' ? 'gold' : ''}" title="View official certificate PDF">
                                <i class="fas fa-file-pdf"></i> View PDF <i class="fas fa-external-link-alt" style="font-size: 0.7rem;"></i>
                            </a>
                        ` : `
                            <span class="cert-badge"><i class="fas fa-check-circle"></i> Verified Credential</span>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Attach search and filter listeners
    if (fullGrid) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter') || 'all';
                renderCertList();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearchTerm = e.target.value.trim();
                if (searchClear) {
                    searchClear.style.display = currentSearchTerm ? 'block' : 'none';
                }
                renderCertList();
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    currentSearchTerm = '';
                    searchClear.style.display = 'none';
                    searchInput.focus();
                    renderCertList();
                }
            });
        }

        renderCertList();
    }

    // 2. Featured Grid Container for Home Page (#featuredCertsGrid)
    const featuredGrid = document.getElementById('featuredCertsGrid');
    if (featuredGrid) {
        // Feature top Partner Certifications and Core Learning Plans (e.g. 6 premium badges)
        const featuredList = CERTIFICATIONS_DATA.filter(c => c.category === 'partner' || c.category === 'learning-plan').slice(0, 6);
        featuredGrid.innerHTML = featuredList.map(cert => {
            const pdfUrl = cert.pdf ? `${basePath}${cert.pdf}` : null;
            const cardThemeClass = cert.category === 'partner' ? 'card-partner' : 'card-learning-plan';

            return `
                <div class="card training-card ${cardThemeClass}" data-aos="fade-up">
                    <div>
                        <div class="card-top-meta">
                            <span class="card-badge-pill ${cert.badgeColor}">
                                <i class="fas ${cert.category === 'partner' ? 'fa-shield-alt' : 'fa-graduation-cap'}"></i>
                                ${cert.badgeType}
                            </span>
                            ${cert.date ? `<span class="cert-date"><i class="far fa-calendar-alt"></i> ${cert.date}</span>` : ''}
                        </div>

                        <h3>${cert.title}</h3>
                        <p class="institution"><i class="fas fa-award"></i> ${cert.issuer}</p>
                        ${cert.certId ? `<span class="cert-id-tag"><i class="fas fa-id-badge"></i> Credential: ${cert.certId}</span>` : ''}
                        <p class="cert-desc">${cert.description}</p>
                        
                        <div class="tools-used">
                            ${(cert.tools || []).map(t => `<span>${t}</span>`).join('')}
                        </div>
                    </div>

                    <div class="card-footer">
                        <span class="verified-stamp"><i class="fas fa-check-circle"></i> Authenticated</span>
                        ${pdfUrl ? `
                            <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn-cert-view ${cert.badgeColor === 'gold' ? 'gold' : ''}">
                                <i class="fas fa-file-pdf"></i> View PDF <i class="fas fa-external-link-alt" style="font-size: 0.7rem;"></i>
                            </a>
                        ` : `
                            <span class="cert-badge"><i class="fas fa-check-circle"></i> Verified Credential</span>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setupContactForm();
    loadSections();
    initCertifications();
});

console.log('✅ Portfolio JavaScript loaded successfully');

