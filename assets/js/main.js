document.addEventListener('DOMContentLoaded', function() {
    // Total number of pages in the portfolio
    const TOTAL_PAGES = 19;
    const currentPageElement = document.getElementById('current-page');
    const totalPagesElement = document.getElementById('total-pages');
    
    // Set the total pages in the UI
    totalPagesElement.textContent = TOTAL_PAGES;
    
    // Function to dynamically load portfolio images
    function loadPortfolioImages() {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        const thumbnailsContainer = document.querySelector('.thumbnails-container');
        
        // Clear existing content
        swiperWrapper.innerHTML = '';
        if (thumbnailsContainer) thumbnailsContainer.innerHTML = '';
        
        // Load each image
        for (let i = 1; i <= TOTAL_PAGES; i++) {
            // Format the page number with leading zero if needed (e.g., 01, 02, etc.)
            const pageNumber = i < 10 ? `0${i}` : i;
            
            // Create slide for Swiper
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            
            const img = document.createElement('img');
            img.src = `assets/images/page-${pageNumber}.jpg`; // Updated image naming convention with leading zeros
            img.alt = `Portfolio page ${i}`;
            img.loading = i <= 3 ? 'eager' : 'lazy'; // Load first 3 images eagerly, others lazily
            
            slide.appendChild(img);
            swiperWrapper.appendChild(slide);
            
            // Create thumbnail (optional feature)
            if (thumbnailsContainer) {
                const thumbnail = document.createElement('div');
                thumbnail.classList.add('thumbnail');
                thumbnail.dataset.index = i - 1; // Zero-based index for Swiper
                
                const thumbImg = document.createElement('img');
                thumbImg.src = `assets/images/page-${pageNumber}.jpg`; // Using same image format for thumbnails
                thumbImg.alt = `Thumbnail ${i}`;
                
                thumbnail.appendChild(thumbImg);
                thumbnailsContainer.appendChild(thumbnail);
                
                // Add click event to thumbnail
                thumbnail.addEventListener('click', function() {
                    swiper.slideTo(parseInt(this.dataset.index));
                });
            }
        }
    }
    
    // Initialize Swiper
    let swiper = new Swiper(".mySwiper", {
        direction: "horizontal",
        loop: false,
        keyboard: {
            enabled: true,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 2,
        },
        on: {
            slideChange: function () {
                // Update current page indicator
                const currentIndex = this.activeIndex + 1;
                currentPageElement.textContent = currentIndex;
                
                // Update active thumbnail
                const thumbnails = document.querySelectorAll('.thumbnail');
                thumbnails.forEach(thumb => {
                    thumb.classList.remove('active');
                    if (parseInt(thumb.dataset.index) === this.activeIndex) {
                        thumb.classList.add('active');
                    }
                });
                
                // Log page view (for analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_view', {
                        'page_title': `Portfolio Page ${currentIndex}`,
                        'page_location': `#page-${currentIndex}`
                    });
                }
            },
        },
    });
    
    // Load images
    loadPortfolioImages();
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            swiper.slidePrev();
        } else if (e.key === 'ArrowLeft') {
            swiper.slideNext();
        }
    });
}); 