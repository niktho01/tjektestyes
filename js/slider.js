// Topbar slider
let currentSlide = 0;
const slides = document.querySelectorAll('.topbar-slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Auto-rotation
setInterval(nextSlide, 10000);

// TILFØJET: Keyboard navigation for slider (WCAG compliant)
document.addEventListener('keydown', function(e) {
    const topbar = document.getElementById('topbar');
    const activeElement = document.activeElement;
    
    // Check if focus is within topbar
    if (topbar && topbar.contains(activeElement)) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    }
});

// Navbar scroll - KUN på desktop (ikke mobil)
let lastScrollTop = 0;
const header = document.querySelector('.transparent-header');
const topbar = document.querySelector('.topbar');
let topbarHidden = false;
let headerHidden = false;

window.addEventListener('scroll', function() {
    // Deaktiver scroll hide på mobil (under 768px)
    if (window.innerWidth <= 768) {
        return; // Stop funktionen på mobil
    }
    
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        if (scrollTop > 50 && !topbarHidden) {
            topbar.classList.add('hidden');
            header.style.top = '0';
            topbarHidden = true;
        }
        if (scrollTop > 150 && !headerHidden) {
            header.style.transform = 'translateY(-100%)';
            headerHidden = true;
        }
    } else {
        if (scrollTop < 100 && headerHidden) {
            header.style.transform = 'translateY(0)';
            headerHidden = false;
        }
        if (scrollTop < 30 && topbarHidden) {
            topbar.classList.remove('hidden');
            header.style.top = '40px';
            topbarHidden = false;
        }
    }
    
    lastScrollTop = scrollTop;
});

// Custom scrollbar - THUMB FØLGER MUSEN (WCAG compliant)
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('categoryCardsContainer');
    const thumb = document.getElementById('scrollThumb');
    const scrollbar = document.getElementById('customScrollbar');

    if (!container || !thumb || !scrollbar) return;

    let isDragging = false;

    // Beregn thumb størrelse
    function setThumbSize() {
        const visibleRatio = container.clientWidth / container.scrollWidth;
        const thumbWidth = Math.max(scrollbar.clientWidth * visibleRatio, 50);
        thumb.style.width = thumbWidth + 'px';
    }

    // Opdater thumb position
    function updateThumb() {
        const scrollRatio = container.scrollLeft / (container.scrollWidth - container.clientWidth);
        const maxMove = scrollbar.clientWidth - thumb.clientWidth;
        thumb.style.left = (scrollRatio * maxMove) + 'px';
    }

    // Scroll event - opdater thumb
    container.addEventListener('scroll', function() {
        if (!isDragging) {
            updateThumb();
        }
    });

    window.addEventListener('resize', function() {
        setThumbSize();
        updateThumb();
    });

    // Mouse down på thumb
    thumb.addEventListener('mousedown', function(e) {
        isDragging = true;
        document.body.style.userSelect = 'none';
        thumb.style.cursor = 'grabbing';
        e.preventDefault();
    });

    // TILFØJET: Keyboard support for scrollbar (WCAG 2.1.1)
    thumb.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            container.scrollLeft -= 100;
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            container.scrollLeft += 100;
        }
    });

    // Mouse move - opdater BÅDE thumb og scroll
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        const rect = scrollbar.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const maxMove = scrollbar.clientWidth - thumb.clientWidth;
        
        // Beregn ny thumb position
        let thumbPos = mouseX - (thumb.clientWidth / 2);
        thumbPos = Math.max(0, Math.min(thumbPos, maxMove));
        
        // Opdater thumb position DIREKTE
        thumb.style.left = thumbPos + 'px';
        
        // Opdater scroll baseret på thumb position
        const scrollRatio = thumbPos / maxMove;
        container.scrollLeft = scrollRatio * (container.scrollWidth - container.clientWidth);
    });

    // Mouse up
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
            thumb.style.cursor = 'grab';
        }
    });

    // Klik på scrollbar
    scrollbar.addEventListener('click', function(e) {
        if (e.target === thumb) return;
        
        const rect = scrollbar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const maxMove = scrollbar.clientWidth - thumb.clientWidth;
        
        // Beregn thumb position
        let thumbPos = clickX - (thumb.clientWidth / 2);
        thumbPos = Math.max(0, Math.min(thumbPos, maxMove));
        
        // Opdater både thumb og scroll
        thumb.style.left = thumbPos + 'px';
        const scrollRatio = thumbPos / maxMove;
        container.scrollLeft = scrollRatio * (container.scrollWidth - container.clientWidth);
    });

    // Initial setup
    setThumbSize();
    updateThumb();
});

// Quantity selector functions
function increaseQuantity() {
    const input = document.getElementById('quantity');
    if (!input) return;
    
    let value = parseInt(input.value);
    if (value < parseInt(input.max)) {
        input.value = value + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (!input) return;
    
    let value = parseInt(input.value);
    if (value > parseInt(input.min)) {
        input.value = value - 1;
    }
}

// ==================== MOBILE MENU ====================
// Mobile Menu Toggle - Kun sekundære links
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const secondaryNav = document.querySelector('.secondary-nav-links');
    const body = document.body;
    
    if (menuToggle && secondaryNav) {
        // Toggle menu når hamburger klikkes
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle active class på sekundær navigation
            secondaryNav.classList.toggle('active');
            
            // Forhindre scroll når menu er åben
            body.classList.toggle('menu-open');
            
            // Opdater aria-label
            menuToggle.setAttribute('aria-label', isExpanded ? 'Åbn menu' : 'Luk menu');
        });
        
        // Luk menu når der klikkes på et sekundært link
        const secondaryLinks = secondaryNav.querySelectorAll('a');
        secondaryLinks.forEach(link => {
            link.addEventListener('click', function() {
                secondaryNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Åbn menu');
                body.classList.remove('menu-open');
            });
        });
        
        // Luk menu når der klikkes uden for menuen
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && 
                !secondaryNav.contains(event.target) && 
                secondaryNav.classList.contains('active')) {
                secondaryNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Åbn menu');
                body.classList.remove('menu-open');
            }
        });
    }
});