document.addEventListener('DOMContentLoaded', () => {
        // --- Navigation ---
        const navLinks = document.querySelectorAll('.nav-link');
        const pageSections = document.querySelectorAll('.page-section');
        const mainNav = document.getElementById('mainNav');
        const menuToggle = document.querySelector('.menu-toggle');

        function setActivePage(targetId) {
            // Hide all sections
            pageSections.forEach(section => section.classList.remove('active'));
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Update active link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${targetId}`) {
                    link.classList.add('active');
                }
            });

            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '&#9776;'; // Hamburger
            }
            
            // Scroll to top of page
            window.scrollTo(0, 0);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                setActivePage(targetId);
                // Update URL hash for history and direct linking (optional)
                // window.location.hash = targetId;
            });
        });

        // Initial page load - check hash or default to home
        // const currentHash = window.location.hash.substring(1);
        // if (currentHash && document.getElementById(currentHash)) {
        //     setActivePage(currentHash);
        // } else {
        //     setActivePage('home');
        // }
        // For simplicity in this single file, always start at home.
         setActivePage('home');


        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isExpanded = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            menuToggle.innerHTML = isExpanded ? '&times;' : '&#9776;'; // Close icon or Hamburger
        });

        // --- Slider ---
        const slider = document.querySelector('.slider');
        if (slider) {
            const slides = Array.from(slider.children);
            const nextButton = document.querySelector('.next-slide');
            const prevButton = document.querySelector('.prev-slide');
            const dotsContainer = document.querySelector('.slider-dots');
            let currentIndex = 0;
            let slideInterval;

            // Create dots
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });
            const dots = Array.from(dotsContainer.children);

            function updateSlider() {
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach(dot => dot.classList.remove('active'));
                dots[currentIndex].classList.add('active');
            }

            function goToSlide(index) {
                currentIndex = (index + slides.length) % slides.length; // Loop
                updateSlider();
            }

            nextButton.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                resetInterval();
            });
            prevButton.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                resetInterval();
            });

            function autoSlide() {
                goToSlide(currentIndex + 1);
            }

            function startInterval() {
                slideInterval = setInterval(autoSlide, 5000); // Change slide every 5 seconds
            }
            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }
            
            startInterval();
            updateSlider(); // Initial position
        }


        // --- Animated Counters ---
        const countersSection = document.getElementById('counters');
        if (countersSection) {
            const counters = document.querySelectorAll('.counters h3[data-target]');
            const speed = 200; // Lower is faster

            const animateCounter = (counter) => {
                const target = +counter.getAttribute('data-target');
                const updateCount = () => {
                    const count = +counter.innerText;
                    const increment = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target; // Ensure it ends on target
                    }
                };
                updateCount();
                counter.dataset.animated = 'true'; // Mark as animated
            };

            const observerOptions = {
                root: null, // viewport
                threshold: 0.5 // 50% visible
            };

            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counters.forEach(counter => {
                            if (!counter.dataset.animated) { // Animate only if not already animated
                                animateCounter(counter);
                            }
                        });
                        // Optionally, unobserve after animating if you only want it once
                        // observer.unobserve(countersSection); 
                    }
                });
            }, observerOptions);

            counterObserver.observe(countersSection);
        }

        // --- FAQ Accordion ---
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('h4');
            const answer = item.querySelector('.faq-answer');
            question.addEventListener('click', () => {
                const isOpen = item.classList.toggle('open');
                answer.style.maxHeight = isOpen ? answer.scrollHeight + "px" : null;
                question.setAttribute('aria-expanded', isOpen);
            });
            // Initialize ARIA attribute
            question.setAttribute('aria-expanded', 'false');
        });

        // --- Modal Logic ---
        const inquiryModal = document.getElementById('inquiryModal');
        const openModalButton = document.getElementById('openInquiryModal');
        const closeModalButton = inquiryModal.querySelector('.close-button');
        const inquiryForm = document.getElementById('inquiryForm');
        const modalFormMessage = document.getElementById('modal-form-message');


        if (openModalButton) {
            openModalButton.addEventListener('click', () => {
                inquiryModal.style.display = 'block';
                inquiryModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
                inquiryModal.querySelector('input, textarea, button').focus(); // Focus first element
            });
        }

        closeModalButton.addEventListener('click', closeModal);
        
        window.addEventListener('click', (event) => {
            if (event.target === inquiryModal) {
                closeModal();
            }
        });
        
        function closeModal() {
            inquiryModal.style.display = 'none';
            inquiryModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
            modalFormMessage.textContent = ''; // Clear message on close
            inquiryForm.reset(); // Reset form
        }
        
        // Handle Escape key to close modal
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && inquiryModal.style.display === 'block') {
                closeModal();
            }
        });

        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic form processing simulation
            modalFormMessage.textContent = 'Thank you for your inquiry! We will get back to you soon.';
            modalFormMessage.style.color = 'var(--royal-blue)';
            // inquiryForm.reset(); // Optionally reset after few seconds or keep data
            setTimeout(closeModal, 3000); // Close modal after 3 seconds
        });
        
        // --- Contact Form ---
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('form-message');

        if(contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Basic form processing simulation
                formMessage.textContent = 'Message sent successfully! We appreciate you reaching out.';
                formMessage.style.color = 'var(--royal-blue)';
                contactForm.reset();
                setTimeout(() => { formMessage.textContent = ''; }, 5000);
            });
        }

        // --- Footer Current Year ---
        document.getElementById('currentYear').textContent = new Date().getFullYear();

    });