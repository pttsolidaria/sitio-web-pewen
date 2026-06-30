/* app.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- MOBILE MENU DRAWER ---
    const navToggleBtn = document.getElementById('nav-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    function toggleMobileMenu() {
        navToggleBtn.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        // Prevent body scrolling when menu is open
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : 'initial';
    }
    
    if (navToggleBtn && mobileMenuOverlay) {
        navToggleBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuOverlay.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    
    // --- SMOOTH SCROLL & ACTIVE NAV LINK ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust threshold offset for active nav highlight
            if (scrollPosition >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (href === '#' && current === 'home')) {
                link.classList.add('active');
            }
        });
        
        // Dynamic styling for navbar on scroll
        const navbarWrapper = document.querySelector('.navbar-wrapper');
        if (scrollPosition > 50) {
            navbarWrapper.style.boxShadow = 'var(--shadow-md)';
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                navbarWrapper.style.backgroundColor = 'rgba(250, 250, 252, 0.98)';
            } else {
                navbarWrapper.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
            }
        } else {
            navbarWrapper.style.boxShadow = 'none';
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                navbarWrapper.style.backgroundColor = 'rgba(250, 250, 252, 0.9)';
            } else {
                navbarWrapper.style.backgroundColor = 'rgba(10, 25, 47, 0.85)';
            }
        }
    });

    
    // --- SEARCH / FILTER PRACTICE AREAS ---
    const searchInput = document.getElementById('search-input');
    const practiceCards = document.querySelectorAll('.practice-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            practiceCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    card.classList.remove('hidden');
                    // Add micro-fade-in animation trigger
                    card.style.animation = 'scaleIn 0.3s forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    
    // --- CONTACT FORM AJAX SUBMISSION ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = contactForm ? contactForm.querySelector('.form-submit-btn') : null;
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                showStatus('Por favor, completa los campos requeridos (Nombre, Email, Mensaje).', 'error');
                return;
            }
            
            // Email regex check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showStatus('Por favor, ingresa una dirección de correo válida.', 'error');
                return;
            }
            
            // Prepare loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }
            
            // Prepare payload for FormSubmit AJAX
            const formData = {
                nombre: name,
                email: email,
                telefono: phone,
                asunto: subject,
                mensaje: message,
                _subject: `Contacto Web - ${subject || 'Nueva Consulta'}`,
                _template: 'table' // FormSubmit offers styled tables
            };
            
            // Use FormSubmit's AJAX endpoint
            // Sends to the studio contact mail, which will be forwarded to your personal mail.
            // Note: The first time the form is submitted, FormSubmit sends an activation email to that address.
            // Click the activation link in that email to start receiving form messages.
            const actionUrl = contactForm.getAttribute('action') || 'https://formsubmit.co/ajax/contacto@estudiojuridicopewen.cl';
            
            fetch(actionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                showStatus('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                showStatus('Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo o escríbenos directamente por WhatsApp.', 'error');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Mensaje';
                }
            });
        });
    }
    
    function showStatus(msg, type) {
        if (formStatus) {
            formStatus.textContent = msg;
            formStatus.className = 'form-status ' + type;
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Hide notification after 8 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 8000);
        }
    }
});
