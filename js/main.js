/* ========================================
   하라뷰티샵 강남본점 - JavaScript
   Smooth interactions and animations
   ======================================== */

(function($) {
    'use strict';

    /* ==================== Variables ==================== */
    let lastScrollTop = 0;
    const $window = $(window);
    const $navbar = $('.navbar');
    const $navLinks = $('.nav-link');
    
    /* ==================== Document Ready ==================== */
    $(document).ready(function() {
        // Initialize all functions
        initNavigation();
        initSmoothScroll();
        initScrollAnimations();
        initFAQ();
        initHeroSwiper();
        
        // Trigger scroll event on load
        $window.trigger('scroll');
    });

    /* ==================== Navigation ==================== */
    function initNavigation() {
        // Navbar scroll effect
        $window.on('scroll', function() {
            const scrollTop = $window.scrollTop();
            
            // Add/remove scrolled class
            if (scrollTop > 50) {
                $navbar.addClass('scrolled');
            } else {
                $navbar.removeClass('scrolled');
            }
            
            // Update active navigation
            updateActiveNav();
            
            lastScrollTop = scrollTop;
        });

        // Mobile menu close on link click
        $navLinks.on('click', function() {
            if ($window.width() < 992) {
                $('.navbar-collapse').collapse('hide');
            }
        });

        // Navbar toggler animation
        $('.navbar-toggler').on('click', function() {
            $(this).toggleClass('active');
        });
    }

    /* ==================== Update Active Navigation ==================== */
    function updateActiveNav() {
        const scrollPos = $window.scrollTop() + 100;
        
        $navLinks.each(function() {
            const $this = $(this);
            const href = $this.attr('href');
            
            if (href && href.startsWith('#')) {
                const $section = $(href);
                
                if ($section.length) {
                    const sectionTop = $section.offset().top;
                    const sectionBottom = sectionTop + $section.outerHeight();
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                        $navLinks.removeClass('active');
                        $this.addClass('active');
                    }
                }
            }
        });
    }

    /* ==================== Smooth Scroll ==================== */
    function initSmoothScroll() {
        $('a[href^="#"]').on('click', function(e) {
            const href = $(this).attr('href');
            
            if (href === '#' || href === '') return;
            
            const $target = $(href);
            
            if ($target.length) {
                e.preventDefault();
                
                const targetOffset = $target.offset().top - 80;
                
                $('html, body').animate({
                    scrollTop: targetOffset
                }, 800, 'swing');
            }
        });
    }

    /* ==================== Scroll Animations ==================== */
    function initScrollAnimations() {
        // Add animate-on-scroll class to elements
        const animateElements = [
            '.service-item',
            '.credentials-list li',
            '.contact-method',
            '.location-item',
            '.faq-item'
        ].join(', ');
        
        $(animateElements).addClass('animate-on-scroll');
        
        // Trigger animation check on scroll
        $window.on('scroll', checkAnimations);
        
        // Check on load
        checkAnimations();
    }

    /* ==================== Check Animations ==================== */
    function checkAnimations() {
        const windowHeight = $window.height();
        const scrollTop = $window.scrollTop();
        
        $('.animate-on-scroll').each(function() {
            const $element = $(this);
            const elementTop = $element.offset().top;
            const elementVisible = 150; // pixels before element is visible
            
            if (scrollTop + windowHeight - elementVisible > elementTop) {
                // Add delay based on index
                const index = $element.index();
                const delay = (index % 3) * 100; // Stagger animation
                
                setTimeout(function() {
                    $element.addClass('animated');
                }, delay);
            }
        });
    }

    /* ==================== FAQ Accordion ==================== */
    function initFAQ() {
        $('.faq-question').on('click', function() {
            const $item = $(this).closest('.faq-item');
            const $allItems = $('.faq-item');
            
            // Close all other items
            $allItems.not($item).removeClass('active');
            
            // Toggle current item
            $item.toggleClass('active');
            
            // Smooth scroll to item if it's being opened
            if ($item.hasClass('active')) {
                setTimeout(function() {
                    const itemTop = $item.offset().top - 100;
                    
                    if ($window.scrollTop() > itemTop || 
                        $window.scrollTop() + windowHeight < itemTop + $item.outerHeight()) {
                        $('html, body').animate({
                            scrollTop: itemTop
                        }, 400);
                    }
                }, 300);
            }
        });
    }

    /* ==================== Hero Swiper ==================== */
    function initHeroSwiper() {
        if (typeof Swiper !== 'undefined' && $('.heroSwiper').length) {
            const heroSwiper = new Swiper('.heroSwiper', {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                speed: 800,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                pagination: {
                    el: '.hero-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                navigation: {
                    nextEl: '.hero-nav-next',
                    prevEl: '.hero-nav-prev',
                },
                keyboard: {
                    enabled: true,
                },
                mousewheel: {
                    enabled: false,
                },
            });
        }
    }

    /* ==================== Service Item Hover Effect ==================== */
    $('.service-item').hover(
        function() {
            $(this).find('.service-icon').css('transform', 'scale(1.1) rotate(5deg)');
        },
        function() {
            $(this).find('.service-icon').css('transform', 'scale(1) rotate(0deg)');
        }
    );

    /* ==================== Contact Method Animation ==================== */
    $('.contact-method').hover(
        function() {
            $(this).find('.contact-icon').css('transform', 'scale(1.1)');
        },
        function() {
            $(this).find('.contact-icon').css('transform', 'scale(1)');
        }
    );

    /* ==================== Image Lazy Loading ==================== */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            $('img[data-src]').each(function() {
                imageObserver.observe(this);
            });
        }
    }

    /* ==================== Resize Handler ==================== */
    let resizeTimer;
    $window.on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Recalculate animations
            checkAnimations();
        }, 250);
    });

    /* ==================== External Links ==================== */
    $('a[target="_blank"]').on('click', function(e) {
        // Add rel attributes for security
        $(this).attr('rel', 'noopener noreferrer');
    });

    /* ==================== Form Validation (if forms are added) ==================== */
    function validateForm($form) {
        let isValid = true;
        
        $form.find('input[required], textarea[required]').each(function() {
            const $input = $(this);
            const value = $input.val().trim();
            
            if (value === '') {
                isValid = false;
                $input.addClass('error');
            } else {
                $input.removeClass('error');
            }
        });
        
        return isValid;
    }

    /* ==================== Smooth Page Load ==================== */
    $window.on('load', function() {
        $('body').removeClass('loading');
        
        // Trigger animations
        setTimeout(function() {
            $('.fade-in-up').css('opacity', '1');
        }, 100);
    });

    /* ==================== Custom Cursor (Optional Enhancement) ==================== */
    function initCustomCursor() {
        if ($window.width() > 991) {
            const $cursor = $('<div class="custom-cursor"></div>').appendTo('body');
            
            $window.on('mousemove', function(e) {
                $cursor.css({
                    'left': e.clientX + 'px',
                    'top': e.clientY + 'px'
                });
            });
            
            $('a, button').hover(
                function() { $cursor.addClass('hover'); },
                function() { $cursor.removeClass('hover'); }
            );
        }
    }

    /* ==================== Console Message ==================== */
    console.log('%c하라뷰티샵 강남본점', 'font-size: 20px; font-weight: bold; color: #8B2332;');
    console.log('%c웹사이트가 성공적으로 로드되었습니다.', 'font-size: 12px; color: #666;');

    /* ==================== Performance Monitoring ==================== */
    if (window.performance) {
        $window.on('load', function() {
            setTimeout(function() {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('페이지 로드 시간: ' + (pageLoadTime / 1000).toFixed(2) + '초');
            }, 0);
        });
    }

    /* ==================== Error Handling ==================== */
    window.addEventListener('error', function(e) {
        console.error('오류 발생:', e.message);
        // Could send error to analytics service here
    });

    /* ==================== Accessibility Enhancements ==================== */
    function initAccessibility() {
        // Skip to content link removed - not needed for this site
        
        // Keyboard navigation for FAQ
        $('.faq-question').on('keypress', function(e) {
            if (e.which === 13 || e.which === 32) { // Enter or Space
                e.preventDefault();
                $(this).click();
            }
        });
        
        // Add ARIA labels
        $('.faq-question').attr('role', 'button').attr('tabindex', '0');
    }

    // Initialize accessibility features
    initAccessibility();

})(jQuery);

/* ==================== Pure JavaScript Fallbacks ==================== */

// Intersection Observer for animations (fallback if jQuery fails)
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', function() {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observe all animate-on-scroll elements
        document.querySelectorAll('.animate-on-scroll').forEach(function(element) {
            observer.observe(element);
        });
    });
}

// Prevent FOUC (Flash of Unstyled Content)
document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
