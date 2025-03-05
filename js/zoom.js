(function() {
    // Variables for image control
    let scale = 1;
    let posX = 0;
    let posY = 0;
    let isDragging = false;
    let startX, startY;
    
    const zoomImage = document.getElementById('zoom-image');
    const zoomIn = document.querySelector('.zoom-in');
    const zoomOut = document.querySelector('.zoom-out');
    const zoomReset = document.querySelector('.zoom-reset');
    const zoomModal = document.querySelector('.zoom-modal');
    const zoomIcon = document.querySelector('.zoom-icon');
    
    // Update image position and scale
    function updatePosition() {
        zoomImage.style.transform = `translate(-50%, -50%) scale(${scale}) translate(${posX / scale}px, ${posY / scale}px)`;
    }

    // Open modal function
    function openModal(imageSrc) {
        zoomModal.style.display = 'block';
        zoomImage.src = imageSrc;
        document.body.style.overflow = 'hidden';
        resetZoom();
    }

    // Close modal function
    function closeModal() {
        zoomModal.style.display = 'none';
        document.body.style.overflow = '';
        resetZoom();
    }

    // Reset zoom function
    function resetZoom() {
        scale = 1;
        posX = 0;
        posY = 0;
        updatePosition();
    }
    
    // Image dragging functionality
    zoomImage.addEventListener('mousedown', function(e) {
        if (scale > 1) {
            isDragging = true;
            startX = e.clientX - posX;
            startY = e.clientY - posY;
            e.preventDefault();
            this.style.cursor = 'grabbing';
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            
            // הגבלת התזוזה כדי שהתמונה לא תצא מהמסך
            const maxOffset = (scale - 1) * 150; // הקטנת טווח התזוזה מ-300 ל-150
            posX = Math.min(Math.max(posX, -maxOffset), maxOffset);
            posY = Math.min(Math.max(posY, -maxOffset), maxOffset);
            
            updatePosition();
        }
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        zoomImage.style.cursor = 'grab';
    });
    
    // Zoom buttons functionality
    zoomIn.addEventListener('click', function() {
        const prevScale = scale;
        scale += 0.2;
        if (scale > 5) scale = 5;
        // התאמת המיקום בהתאם לשינוי בזום
        posX = (posX / prevScale) * scale;
        posY = (posY / prevScale) * scale;
        updatePosition();
    });
    
    zoomOut.addEventListener('click', function() {
        const prevScale = scale;
        scale -= 0.2;
        if (scale < 1) {
            scale = 1;
            posX = 0;
            posY = 0;
        } else {
            // התאמת המיקום בהתאם לשינוי בזום
            posX = (posX / prevScale) * scale;
            posY = (posY / prevScale) * scale;
        }
        updatePosition();
    });
    
    zoomReset.addEventListener('click', resetZoom);
    
    // Mouse wheel zoom functionality
    zoomImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const prevScale = scale;
        if (e.deltaY < 0) {
            scale += 0.2;
            if (scale > 5) scale = 5;
        } else {
            scale -= 0.2;
            if (scale < 1) {
                scale = 1;
                posX = 0;
                posY = 0;
            }
        }
        
        if (scale > 1) {
            // התאמת המיקום בהתאם לשינוי בזום
            posX = (posX / prevScale) * scale;
            posY = (posY / prevScale) * scale;
        }
        
        updatePosition();
    });
    
    // Modal controls
    document.querySelector('.zoom-close').addEventListener('click', closeModal);
    
    // Close modal when clicking outside the image
    zoomModal.addEventListener('click', function(e) {
        if (e.target === zoomModal) {
            closeModal();
        }
    });

    // Prevent modal content from scrolling when zoomed
    zoomModal.addEventListener('wheel', function(e) {
        if (scale > 1) {
            e.preventDefault();
        }
    });

    // Add touch support for mobile devices
    let hammer = new Hammer(zoomImage);
    let lastScale = 1;

    hammer.get('pinch').set({ enable: true });
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    hammer.on('pan', function(e) {
        if (scale > 1) {
            const maxOffset = (scale - 1) * 150; // הקטנת טווח התזוזה גם עבור מכשירים ניידים
            posX = Math.min(Math.max(posX + e.deltaX, -maxOffset), maxOffset);
            posY = Math.min(Math.max(posY + e.deltaY, -maxOffset), maxOffset);
            updatePosition();
        }
    });

    hammer.on('pinch', function(e) {
        const prevScale = scale;
        let newScale = lastScale * e.scale;
        if (newScale >= 1 && newScale <= 5) {
            scale = newScale;
            // התאמת המיקום בהתאם לשינוי בזום
            posX = (posX / prevScale) * scale;
            posY = (posY / prevScale) * scale;
            updatePosition();
        }
    });

    hammer.on('pinchend', function() {
        lastScale = scale;
    });

    // Zoom icon click handler
    zoomIcon.addEventListener('click', function() {
        const currentImage = document.querySelector('.swiper-slide-active img');
        if (currentImage) {
            openModal(currentImage.src);
        }
    });

    // Make zoom icon and modal functionality available globally
    window.portfolioZoom = {
        openModal: openModal,
        closeModal: closeModal
    };
})(); 