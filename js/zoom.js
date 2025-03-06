// פונקציונליות משולבת לתמיכה בעכבר ובמסכי מגע
(function() {
    // משתנים משותפים
    let scale = 1;
    let posX = 0;
    let posY = 0;
    let isDragging = false;
    let startX, startY;
    
    // משתנים למסכי מגע
    let lastDistance = 0;
    
    const zoomImage = document.getElementById('zoom-image');
    const zoomModal = document.querySelector('.zoom-modal');
    const zoomClose = document.querySelector('.zoom-close');
    const zoomIn = document.querySelector('.zoom-in');
    const zoomOut = document.querySelector('.zoom-out');
    const zoomReset = document.querySelector('.zoom-reset');
    const zoomIcon = document.querySelector('.zoom-icon');
    
    // בדיקה אם המכשיר הוא נייד
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // פונקציה לעדכון התמונה
    function updateTransform() {
        zoomImage.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${scale})`;
    }
    
    // איפוס התמונה
    function resetZoom() {
        scale = 1;
        posX = 0;
        posY = 0;
        updateTransform();
    }
    
    // חישוב מרחק בין שתי נקודות מגע
    function getDistance(touch1, touch2) {
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) + 
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
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
    
    // ===== טיפול באירועי עכבר (למחשב) =====
    
    // זום עם גלגלת העכבר
    zoomImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (e.shiftKey || e.ctrlKey) {
            // זום רגיל עם shift או ctrl
            if (e.deltaY < 0) {
                // זום פנימה
                scale = Math.min(5, scale + 0.2);
            } else {
                // זום החוצה
                scale = Math.max(1, scale - 0.2);
            }
            
            // שמירה על מרכוז בעת שינוי הזום
            if (scale === 1) {
                posX = 0;
                posY = 0;
            }
        } else if (scale > 1) {
            // חישוב מרווח תנועה מקסימלי
            const maxOffsetX = (scale - 1) * zoomImage.width * 0.2;  // 20% מרווח תנועה לצדדים
            const maxOffsetY = (scale - 1) * zoomImage.height * 0.3; // 30% מרווח תנועה למעלה ולמטה
            
            if (e.deltaY !== 0) {
                if (e.shiftKey) {
                    // תנועה אופקית עם shift
                    posX += e.deltaY > 0 ? -10 : 10;
                    posX = Math.min(Math.max(-maxOffsetX, posX), maxOffsetX);
                } else {
                    // תנועה אנכית
                    posY += e.deltaY > 0 ? -10 : 10;
                    posY = Math.min(Math.max(-maxOffsetY, posY), maxOffsetY);
                }
            }
        }
        
        updateTransform();
    }, { passive: false });
    
    // התחלת גרירה
    zoomImage.addEventListener('mousedown', function(e) {
        if (scale > 1) {
            isDragging = true;
            startX = e.clientX - posX;
            startY = e.clientY - posY;
            e.preventDefault();
        }
    });
    
    // גרירת התמונה
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            updateTransform();
        }
    });
    
    // סיום גרירה
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // ===== טיפול באירועי מגע (לניידים) =====
    if (isTouchDevice) {
        // התחלת מגע
        zoomImage.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                // שתי אצבעות - לזום
                lastDistance = getDistance(e.touches[0], e.touches[1]);
                e.preventDefault();
            } else if (e.touches.length === 1 && scale > 1) {
                // אצבע אחת להזזה (אחרי הזום)
                startX = e.touches[0].clientX - posX;
                startY = e.touches[0].clientY - posY;
            }
        });
        
        // תנועת מגע
        zoomImage.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                // זום עם שתי אצבעות
                e.preventDefault();
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const factor = currentDistance / lastDistance;
                
                const newScale = scale * factor;
                scale = Math.min(Math.max(0.5, newScale), 5);
                
                lastDistance = currentDistance;
                
                if (scale <= 1) {
                    posX = 0;
                    posY = 0;
                }
                
                updateTransform();
            } else if (e.touches.length === 1 && scale > 1) {
                // הזזה עם אצבע אחת
                posX = e.touches[0].clientX - startX;
                posY = e.touches[0].clientY - startY;
                
                updateTransform();
            }
        }, { passive: false });
        
        // סיום מגע
        zoomImage.addEventListener('touchend', function() {
            if (scale <= 1) {
                posX = 0;
                posY = 0;
                updateTransform();
            }
        });
        
        // Double tap to zoom
        let lastTap = 0;
        zoomImage.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0) {
                e.preventDefault();
                if (scale === 1) {
                    scale = 2.5;
                } else {
                    scale = 1;
                    posX = 0;
                    posY = 0;
                }
                updateTransform();
            }
            lastTap = currentTime;
        });
    }
    
    // ===== כפתורים משותפים =====
    
    // כפתור הגדלה
    zoomIn.addEventListener('click', function() {
        scale = Math.min(5, scale + 0.2);
        updateTransform();
    });
    
    // כפתור הקטנה
    zoomOut.addEventListener('click', function() {
        scale = Math.max(0.5, scale - 0.2);
        if (scale <= 1) {
            posX = 0;
            posY = 0;
        }
        updateTransform();
    });
    
    // כפתור איפוס
    zoomReset.addEventListener('click', resetZoom);
    
    // סגירת המודאל
    zoomClose.addEventListener('click', closeModal);
    
    // סגירת המודאל בלחיצה מחוץ לתמונה
    zoomModal.addEventListener('click', function(e) {
        if (e.target === zoomModal) {
            closeModal();
        }
    });
    
    // מניעת גלילת התוכן במודאל כאשר התמונה מוגדלת
    zoomModal.addEventListener('wheel', function(e) {
        if (scale > 1) {
            e.preventDefault();
        }
    });
    
    // טיפול בלחיצה על אייקון הזום
    zoomIcon.addEventListener('click', function() {
        const currentImage = document.querySelector('.swiper-slide-active img');
        if (currentImage) {
            openModal(currentImage.src);
        }
    });
    
    // הפיכת פונקציות המודאל לזמינות גלובלית
    window.portfolioZoom = {
        openModal: openModal,
        closeModal: closeModal
    };
    
    // זיהוי אם מדובר במחשב או מכשיר נייד
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // אם זה מחשב, נוסיף את הפונקציונליות המשופרת
    if (!isMobile) {
        const zoomImage = document.getElementById('zoom-image');
        const zoomModal = document.querySelector('.zoom-modal');
        
        // משתנים לשליטה בזום ובתנועה
        let currentScale = 1;
        let posX = 0;
        let posY = 0;
        let isDragging = false;
        let startX, startY;
        
        // פונקציה לעדכון התמונה בצורה חלקה
        function updatePosition() {
            // הגבלת טווח התנועה לפי רמת הזום
            const maxOffset = (currentScale - 1) * Math.min(zoomImage.width, zoomImage.height) / 2;
            
            // הגבלת התנועה כך שהתמונה תישאר תמיד במסגרת התצוגה
            posX = Math.min(Math.max(-maxOffset, posX), maxOffset);
            posY = Math.min(Math.max(-maxOffset, posY), maxOffset);
            
            // עדכון בצורה חלקה עם אנימציה
            zoomImage.style.transition = "transform 0.1s ease-out";
            zoomImage.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${currentScale})`;
        }
        
        // גלילה חכמה עם גלגלת העכבר
        zoomImage.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            // גלילה עם מקש Shift לצורך זום
            if (e.shiftKey) {
                // זום אין או אאוט
                if (e.deltaY < 0) {
                    currentScale += 0.2;
                    if (currentScale > 5) currentScale = 5;
                } else {
                    currentScale -= 0.2;
                    if (currentScale < 1) currentScale = 1;
                    
                    // איפוס פוזיציה בחזרה לזום רגיל
                    if (currentScale === 1) {
                        posX = 0;
                        posY = 0;
                    }
                }
            } else if (currentScale > 1) {
                // גלילה רגילה לתנועה בתוך התמונה המוגדלת
                const moveStep = 30 / currentScale; // התאמת מהירות התנועה לרמת הזום
                
                if (e.deltaY > 0) {
                    // גלילה למטה
                    posY -= moveStep;
                } else {
                    // גלילה למעלה
                    posY += moveStep;
                }
                
                // תנועה אופקית עם מקש Alt
                if (e.altKey) {
                    if (e.deltaY > 0) {
                        posX -= moveStep;
                    } else {
                        posX += moveStep;
                    }
                }
            }
            
            updatePosition();
        });
        
        // תמיכה בגרירה עם העכבר
        zoomImage.addEventListener('mousedown', function(e) {
            if (currentScale > 1) {
                isDragging = true;
                startX = e.clientX - posX;
                startY = e.clientY - posY;
                zoomImage.style.transition = "none"; // ביטול אנימציה בזמן גרירה
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                posX = e.clientX - startX;
                posY = e.clientY - startY;
                zoomImage.style.transition = "none";
                zoomImage.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${currentScale})`;
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                updatePosition(); // עדכון סופי עם הגבלות
            }
        });
        
        // הוספת טיפ קטן למשתמש בפתיחת המודאל
        const zoomTip = document.createElement('div');
        zoomTip.className = 'zoom-tip';
        zoomTip.innerHTML = 'גלגלת: לגלול | Shift+גלגלת: זום | גרירה: הזזה';
        zoomTip.style.position = 'absolute';
        zoomTip.style.bottom = '70px';
        zoomTip.style.left = '50%';
        zoomTip.style.transform = 'translateX(-50%)';
        zoomTip.style.backgroundColor = 'rgba(0,0,0,0.6)';
        zoomTip.style.color = 'white';
        zoomTip.style.padding = '8px 15px';
        zoomTip.style.borderRadius = '20px';
        zoomTip.style.fontSize = '14px';
        zoomTip.style.opacity = '0';
        zoomTip.style.transition = 'opacity 0.3s';
        zoomModal.appendChild(zoomTip);
        
        // הצגת הטיפ בפתיחת המודאל
        document.querySelector('.zoom-close').addEventListener('click', function() {
            setTimeout(() => {
                zoomTip.style.opacity = '0';
            }, 100);
            currentScale = 1;
            posX = 0;
            posY = 0;
        });
        
        // עדכון פונקציית הצגת המודאל
        const openZoomModal = (imageSrc) => {
            zoomImage.src = imageSrc;
            zoomModal.style.display = 'block';
            currentScale = 1;
            posX = 0;
            posY = 0;
            updatePosition();
            
            // הצגת הטיפ לזמן קצר
            setTimeout(() => {
                zoomTip.style.opacity = '1';
                setTimeout(() => {
                    zoomTip.style.opacity = '0';
                }, 3000);
            }, 500);
        };
        
        // עדכון פתיחת המודאל בכל התמונות
        document.querySelectorAll('.swiper-slide img').forEach(img => {
            img.addEventListener('click', function() {
                openZoomModal(this.src);
            });
        });
    }
})(); 