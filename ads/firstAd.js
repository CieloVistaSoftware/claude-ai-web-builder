// Image Slider with optimized performance and error handling
let slideIndex = 0;
let slides = [];
let dots = [];
let sliderTrack = null;
let imageData = null;
let autoSlideInterval = null;
let isPaused = false;
let isTransitioning = false;

// Toggle pause/resume functionality
function togglePause() {
    const pauseBtn = document.getElementById('pauseBtn');
    if (isPaused) {
        // Resume
        startAutoSlide();
        pauseBtn.innerHTML = '⏸️';
        pauseBtn.classList.remove('paused');
        pauseBtn.title = 'Pause Slideshow';
        isPaused = false;
    } else {
        // Pause
        stopAutoSlide();
        pauseBtn.innerHTML = '▶️';
        pauseBtn.classList.add('paused');
        pauseBtn.title = 'Resume Slideshow';
        isPaused = true;
    }
}

function startAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Load images data from JSON with error handling
async function loadImageData() {
    try {
        const response = await fetch('images.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.images || [];
    } catch (error) {
        console.warn('Using fallback images due to error:', error);
        
        // Enhanced fallback images with proper paths
        return [
            {
                "filename": "../images/samples/BlueRightSample.png",
                "title": "Modern Business",
                "description": "Clean and professional design perfect for corporate websites",
                "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "category": "business"
            },
            {
                "filename": "../images/samples/bluesample.png",
                "title": "Creative Portfolio",
                "description": "Artistic layout ideal for designers and photographers",
                "gradient": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                "category": "portfolio"
            },
            {
                "filename": "../images/samples/BlueTopSample.png",
                "title": "E-commerce Store",
                "description": "Product-focused design for online retail businesses",
                "gradient": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                "category": "ecommerce"
            },
            {
                "filename": "../images/samples/greenleftsample.png",
                "title": "Restaurant Menu",
                "description": "Appetizing layout for food and dining establishments",
                "gradient": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                "category": "restaurant"
            }
        ];
    }
}

// Generate slides with optimized loading
function generateSlides() {
    if (!imageData || imageData.length === 0) return;

    sliderTrack = document.getElementById('sliderTrack');
    const indicatorsContainer = document.getElementById('sliderIndicators');
    
    // Clear existing content
    sliderTrack.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    const indicatorFragment = document.createDocumentFragment();

    // Generate slides
    imageData.forEach((image, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.background = image.gradient;
        
        // Create image element with lazy loading
        const img = document.createElement('img');
        img.src = image.filename;
        img.alt = `${image.title} Website Template`;
        img.className = 'slide-img';
        img.loading = 'lazy';
        
        // Error handling for images
        img.onerror = function() {
            console.warn(`Failed to load image: ${image.filename}`);
            // Create placeholder SVG
            this.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="%23f0f0f0"/><text x="400" y="200" font-family="Arial" font-size="24" fill="%23666" text-anchor="middle">${encodeURIComponent(image.title)}</text></svg>`;
        };
        
        const slideContent = document.createElement('div');
        slideContent.className = 'slide-content';
        
        const slideTitle = document.createElement('div');
        slideTitle.className = 'slide-title';
        slideTitle.textContent = image.title;
        
        const slideDescription = document.createElement('div');
        slideDescription.className = 'slide-description';
        slideDescription.textContent = image.description;
        
        // Add "Use This Template" button
        const useTemplateBtn = document.createElement('button');
        useTemplateBtn.textContent = 'Use This Template';
        useTemplateBtn.className = 'template-btn';
        useTemplateBtn.style.cssText = `
            background: linear-gradient(45deg, #ff6b6b, #ffa500);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            margin-top: 15px;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        useTemplateBtn.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(255, 107, 107, 0.5)';
        };
        useTemplateBtn.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
        useTemplateBtn.onclick = () => goToBuilderWithTemplate(image);
        
        slideContent.appendChild(slideTitle);
        slideContent.appendChild(slideDescription);
        slideContent.appendChild(useTemplateBtn);
        
        slide.appendChild(img);
        slide.appendChild(slideContent);
        fragment.appendChild(slide);

        // Create indicator
        const indicator = document.createElement('span');
        indicator.className = index === 0 ? 'dot active' : 'dot';
        indicator.onclick = () => currentSlide(index);
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        indicatorFragment.appendChild(indicator);
    });

    // Append fragments to DOM
    sliderTrack.appendChild(fragment);
    indicatorsContainer.appendChild(indicatorFragment);

    // Update references
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    
    // Initialize slider after generating slides
    initializeSlider();
}

function initializeSlider() {
    if (!sliderTrack || slides.length === 0) {
        console.error('Slider initialization failed');
        return;
    }
    
    // Start auto-slide
    if (!isPaused) {
        startAutoSlide();
    }
    
    // Initialize first slide
    showSlide(0);
}

function showSlide(index) {
    if (slides.length === 0 || isTransitioning) return;
    
    isTransitioning = true;
    slideIndex = index;
    
    // Wrap around
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    
    if (sliderTrack) {
        sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // Preload next slide image
        const nextIndex = (slideIndex + 1) % slides.length;
        const nextImg = slides[nextIndex]?.querySelector('img');
        if (nextImg && !nextImg.complete) {
            nextImg.loading = 'eager';
        }
    }
    
    // Update indicators
    if (dots.length > 0) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === slideIndex);
            dot.setAttribute('aria-current', i === slideIndex ? 'true' : 'false');
        });
    }
    
    // Reset transition flag
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

function changeSlide(direction) {
    if (!isTransitioning) {
        showSlide(slideIndex + direction);
    }
}

function currentSlide(index) {
    if (!isTransitioning) {
        showSlide(index);
    }
}

// Navigate to website builder
function goToBuilder() {
    try {
        window.location.href = '../dist/wb/wb.html';
    } catch (error) {
        console.error('Navigation error:', error);
        alert('Unable to navigate to the website builder. Please try refreshing the page.');
    }
}

// Navigate to builder with specific template
function goToBuilderWithTemplate(template) {
    try {
        // Store template data in sessionStorage for the builder to use
        sessionStorage.setItem('selectedTemplate', JSON.stringify({
            category: template.category,
            title: template.title,
            gradient: template.gradient,
            image: template.filename
        }));
        
        window.location.href = '../dist/wb/wb.html';
    } catch (error) {
        console.error('Navigation error:', error);
        goToBuilder(); // Fallback to regular navigation
    }
}

// Handle plan selection
function selectPlan(planType) {
    console.log(`Selected plan: ${planType}`);
    
    // Store selected plan for checkout
    sessionStorage.setItem('selectedPlan', planType);
    
    switch(planType) {
        case 'premium':
            alert('Starting your 14-day free trial! Redirecting to registration...');
            // In production: window.location.href = '/register?plan=premium';
            break;
        case 'professional':
            alert('Connecting you with our sales team...');
            // In production: window.location.href = '/contact-sales?plan=professional';
            break;
        default:
            goToBuilder();
    }
}

// Keyboard navigation
function handleKeyboard(event) {
    if (event.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (event.key === 'ArrowRight') {
        changeSlide(1);
    } else if (event.key === ' ') {
        event.preventDefault();
        togglePause();
    }
}

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        changeSlide(1); // Swipe left, go to next
    }
    if (touchEndX > touchStartX + 50) {
        changeSlide(-1); // Swipe right, go to previous
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load image data
        imageData = await loadImageData();
        
        if (imageData && imageData.length > 0) {
            generateSlides();
            
            // Add keyboard navigation
            document.addEventListener('keydown', handleKeyboard);
            
            // Add touch support
            const slider = document.querySelector('.slider-container');
            if (slider) {
                slider.addEventListener('touchstart', handleTouchStart);
                slider.addEventListener('touchend', handleTouchEnd);
                
                // Pause on hover
                slider.addEventListener('mouseenter', () => {
                    if (!isPaused) {
                        stopAutoSlide();
                    }
                });
                
                slider.addEventListener('mouseleave', () => {
                    if (!isPaused) {
                        startAutoSlide();
                    }
                });
            }
        } else {
            console.error('No image data available');
            document.getElementById('sliderTrack').innerHTML = 
                '<div class="error-message">Unable to load templates. Please refresh the page.</div>';
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    stopAutoSlide();
});