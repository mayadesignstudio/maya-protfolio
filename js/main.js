// בדיקת תאימות דפדפן
if (!('IntersectionObserver' in window)) {
    // פולי-פיל בסיסי ל-IntersectionObserver אם צריך
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
    const totalPages = 19;
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    const thumbnailsContainer = document.querySelector('.thumbnails-container');
    const zoomModal = document.querySelector('.zoom-modal');
    const zoomModalContent = document.querySelector('.zoom-modal-content');
    const zoomImage = document.getElementById('zoom-image');
    const zoomClose = document.querySelector('.zoom-close');
    const zoomIcon = document.querySelector('.zoom-icon');
    const zoomIn = document.querySelector('.zoom-in');
    const zoomOut = document.querySelector('.zoom-out');
    const zoomReset = document.querySelector('.zoom-reset');
    
    // עדכון הטקסט של מספר הדפים הכולל
    document.getElementById('total-pages').textContent = totalPages;
    
    // טעינת התמונות הראשיות והמוקטנות
    for (let i = 1; i <= totalPages; i++) {
        const pageNum = i.toString().padStart(2, '0'); // הוספת אפס מובילי
        const imagePath = `assets/images/page-${pageNum}.jpg`;
        
        // הוספת תמונה לתצוגה הראשית
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `<img src="${imagePath}" alt="עמוד ${i}" loading="lazy" data-page="${i}">`;
        swiperWrapper.appendChild(slide);
        
        // הוספת תמונה מוקטנת
        const thumbnail = document.createElement('img');
        thumbnail.className = 'thumbnail';
        thumbnail.src = imagePath;
        thumbnail.alt = `תמונה מוקטנת ${i}`;
        thumbnail.dataset.index = i - 1;
        thumbnail.addEventListener('click', function() {
            swiper.slideTo(parseInt(this.dataset.index));
        });
        thumbnailsContainer.appendChild(thumbnail);
    }
    
    // אתחול Swiper עם אפקט מעודן
    const swiper = new Swiper('.swiper-container', {
        effect: 'creative',
        creativeEffect: {
            prev: {
                // הדף הקודם יזוז החוצה
                translate: ['-120%', 0, -500],
                opacity: 0,
            },
            next: {
                // הדף הבא יכנס מהצד
                translate: ['120%', 0, -500],
                opacity: 0,
            },
        },
        speed: 800,
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 1,
        keyboard: {
            enabled: true,
        },
        mousewheel: {
            invert: false,
            sensitivity: 0.8,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            slideChange: function() {
                // עדכון מספר עמוד נוכחי
                document.getElementById('current-page').textContent = this.activeIndex + 1;
                
                // הוספת אנימציית דפדוף
                const activeSlide = document.querySelector('.swiper-slide-active');
                activeSlide.querySelector('img').classList.add('page-turning');
                
                // הסרת האנימציה אחרי שהיא מסתיימת
                setTimeout(() => {
                    activeSlide.querySelector('img').classList.remove('page-turning');
                }, 700);
                
                // עדכון התמונה המוקטנת הפעילה
                document.querySelectorAll('.thumbnail').forEach((thumb, idx) => {
                    if (idx === this.activeIndex) {
                        thumb.classList.add('active');
                        // גלילה אוטומטית לתמונה המוקטנת הפעילה
                        thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    } else {
                        thumb.classList.remove('active');
                    }
                });
            },
            init: function() {
                // סימון התמונה המוקטנת הראשונה כפעילה
                document.querySelector('.thumbnail').classList.add('active');
            }
        }
    });
    
    // מאזיני מקלדת לניווט
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            if (zoomModal.classList.contains('show')) {
                // כשהמודאל פתוח, לא לעשות כלום
                return;
            }
            
            if (e.key === 'ArrowLeft') {
                swiper.slideNext();
            } else if (e.key === 'ArrowRight') {
                swiper.slidePrev();
            }
        } else if (e.key === 'Escape' && zoomModal.classList.contains('show')) {
            closeZoomModal();
        }
    });
    
    // משתנים לשליטה בזום
    let scale = 1;
    
    // פונקציה לעדכון זום
    function applyZoom() {
        zoomImage.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    
    // פונקציה לאיפוס הזום
    function resetZoom() {
        scale = 1;
        applyZoom();
    }
    
    // טיפול בכפתורי זום
    zoomIn.addEventListener('click', function() {
        scale += 0.2;
        if (scale > 5) scale = 5;
        applyZoom();
    });
    
    zoomOut.addEventListener('click', function() {
        scale -= 0.2;
        if (scale < 0.5) scale = 0.5;
        applyZoom();
    });
    
    zoomReset.addEventListener('click', resetZoom);
    
    // טיפול בגלגלת העכבר לזום
    zoomImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (e.deltaY < 0) {
            // זום פנימה
            scale += 0.2;
            if (scale > 5) scale = 5;
        } else {
            // זום החוצה
            scale -= 0.2;
            if (scale < 0.5) scale = 0.5;
        }
        
        applyZoom();
    });
    
    // מניעת גלילה במודאל
    zoomModal.addEventListener('wheel', function(e) {
        e.preventDefault();
    });
    
    // פתיחת המודאל
    document.querySelectorAll('.swiper-slide img').forEach(function(img) {
        img.addEventListener('click', function() {
            zoomImage.src = this.src;
            zoomModal.style.display = 'block';
            resetZoom();
        });
    });
    
    // סגירת המודאל
    zoomClose.addEventListener('click', function() {
        zoomModal.style.display = 'none';
    });
    
    // תמיכה במכשירי מגע
    if (typeof Hammer !== 'undefined') {
        const hammertime = new Hammer(zoomImage);
        
        hammertime.get('pinch').set({ enable: true });
        hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        
        let lastScale = 1;
        
        hammertime.on('pinchstart', function() {
            startScale = currentScale || 1;
            lastScale = 1;
        });
        
        hammertime.on('pinch', function(e) {
            currentScale = Math.max(0.5, Math.min(startScale * e.scale / lastScale, 5));
            applyTransform();
        });
        
        hammertime.on('pinchend', function() {
            lastScale = 1;
        });
        
        hammertime.on('panstart', function() {
            if (currentScale > 1) {
                startX = currentX;
                startY = currentY;
            }
        });
        
        hammertime.on('pan', function(e) {
            if (currentScale > 1) {
                currentX = startX + e.deltaX;
                currentY = startY + e.deltaY;
                applyTransform();
            }
        });
        
        // כפול-לחיצה להגדלה מהירה
        hammertime.on('doubletap', function() {
            if (currentScale === 1) {
                currentScale = 2.5;
            } else {
                currentScale = 1;
                currentX = 0;
                currentY = 0;
            }
            applyTransform();
        });
    }
    
    // הוספת טעינה מקדימה של תמונות
    function preloadImages() {
        const nextIndex = swiper.activeIndex + 1;
        const prevIndex = swiper.activeIndex - 1;
        
        if (nextIndex < totalPages) {
            const nextPage = (nextIndex + 1).toString().padStart(2, '0');
            const img = new Image();
            img.src = `assets/images/page-${nextPage}.jpg`;
        }
        
        if (prevIndex >= 0) {
            const prevPage = (prevIndex + 1).toString().padStart(2, '0');
            const img = new Image();
            img.src = `assets/images/page-${prevPage}.jpg`;
        }
    }
    
    // הפעלת טעינה מקדימה בכל החלפת עמוד
    swiper.on('slideChange', preloadImages);
    
    // טעינה מקדימה ראשונית
    preloadImages();
    
    // אפקט תקריב בריחוף על תמונות
    const slideImages = document.querySelectorAll('.swiper-slide img');
    slideImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// תיקון בעיית תזוזת תמונות במובייל
(function() {
  // בדיקה אם המכשיר הוא מובייל
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isMobile) {
    // מניעת תזוזה לא רצויה של תמונות בתצוגת מובייל
    document.addEventListener('DOMContentLoaded', function() {
      const slideImages = document.querySelectorAll('.swiper-slide img');
      slideImages.forEach(img => {
        img.style.pointerEvents = 'none'; // מבטל אינטראקציה ישירה עם התמונה
      });
    });
  }
})(); 