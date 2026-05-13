document.addEventListener("DOMContentLoaded", () => {
    // 1. Set Copyright Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu && closeMenuBtn) {
        const openMenu = () => {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
            lenis.stop(); // Stop scrolling while menu is open
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            lenis.start(); // Resume scrolling
        };

        mobileMenuBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        
        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // 4. Custom Cursor Logic & Hero Parallax
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, textarea');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Normalize cursor position for parallax (-1 to 1)
            const xNorm = (posX / window.innerWidth) * 2 - 1;
            const yNorm = (posY / window.innerHeight) * 2 - 1;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline trails slightly
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });

            // Architectural Parallax for Video Container
            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed') || 0.02;
                gsap.to(layer, {
                    x: xNorm * 100 * speed,
                    y: yNorm * 100 * speed,
                    duration: 1.5,
                    ease: "power2.out"
                });
            });
        });

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            target.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // 5. GSAP Animations Registration
    gsap.registerPlugin(ScrollTrigger);

    // Navbar transparent to solid on scroll
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('bg-espresso-dark/90', 'backdrop-blur-md', 'py-4', 'border-b', 'border-white/5');
            nav.classList.remove('py-6');
        } else {
            nav.classList.remove('bg-espresso-dark/90', 'backdrop-blur-md', 'py-4', 'border-b', 'border-white/5');
            nav.classList.add('py-6');
        }
    });

    // Hero Text Reveal
    const heroTl = gsap.timeline();
    heroTl.to(".gs-reveal", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
    });

    // Hero Cinematic Video Slow Motion Effect
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Slow down playback to give it a calmer, more luxurious architectural feel
        heroVideo.playbackRate = 0.85; 
    }

    // Standard Fade Up Triggers for general content
    gsap.utils.toArray('.gs-fade-up').forEach(element => {
        gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Image Reveal Masks (Used on Founder and Next-Gen photos)
    gsap.utils.toArray('.reveal-img-container').forEach(container => {
        let img = container.querySelector('.reveal-img');
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
            }
        });
        tl.fromTo(container, 
            { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1.5, ease: "power4.inOut" }
        ).fromTo(img, 
            { scale: 1.2 }, 
            { scale: 1, duration: 1.5, ease: "power3.out" }, 
            "-=1.5"
        );
    });

    // 6. Interactive Projects Slider
    const initSlider = () => {
        const slider = document.getElementById('project-slider');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');
        const dotsContainer = document.getElementById('slider-dots');
        
        if (!slider || !prevBtn || !nextBtn || !dotsContainer) return;

        const cards = slider.querySelectorAll('.project-card');
        if(cards.length === 0) return;

        // Generate Dots dynamically
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 hover-target ${index === 0 ? 'bg-gold w-8' : 'bg-white/20 hover:bg-white/50'}`;
            dot.setAttribute('aria-label', `Go to project ${index + 1}`);
            
            dot.addEventListener('click', () => {
                const scrollAmount = cards[index].offsetLeft - slider.offsetLeft - 32; // Offset for padding
                slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            });
            
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');

        // Scroll event to update active dot
        slider.addEventListener('scroll', () => {
            let closestIndex = 0;
            let closestDistance = Infinity;

            cards.forEach((card, index) => {
                const distance = Math.abs(card.getBoundingClientRect().left - slider.getBoundingClientRect().left);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            // Update dots CSS
            dots.forEach((dot, i) => {
                if (i === closestIndex) {
                    dot.className = 'w-8 h-2 rounded-full transition-all duration-300 bg-gold hover-target';
                } else {
                    dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-white/20 hover:bg-white/50 hover-target';
                }
            });
        });

        // Arrow Buttons Logic
        prevBtn.addEventListener('click', () => {
            const scrollWidth = cards[0].offsetWidth + 32; // Width + gap
            slider.scrollBy({ left: -scrollWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const scrollWidth = cards[0].offsetWidth + 32; // Width + gap
            slider.scrollBy({ left: scrollWidth, behavior: 'smooth' });
        });
    };
    initSlider();

    // 7. Magnetic Buttons Logic
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    if (window.matchMedia("(pointer: fine)").matches) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }
});