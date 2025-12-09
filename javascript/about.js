

        // --- HERO SLIDESHOW FUNCTIONS ---
        let slideIndex = 0;
        let sliderElements = [];
        
        function showSlides() {
            sliderElements = document.querySelectorAll('.slider-area .slider');
            if (sliderElements.length === 0) return;

            // Hide all slides
            sliderElements.forEach(el => el.classList.remove('active'));

            // Advance index and handle wrap-around
            slideIndex = (slideIndex % sliderElements.length); 

            // Show the current slide
            sliderElements[slideIndex].classList.add('active');
            slideIndex++;

            // Call again after 7 seconds
            setTimeout(showSlides, 7000); 
        }
        
        // --- PILLAR ROTATOR FUNCTIONS (Click-activated) ---

        const pillarMeanings = document.querySelectorAll('#pillar_meaning .pillar-meaning');
        const pillarButtons = document.querySelectorAll('.pillars');
        let currentPillarIndex = 0;
        let pillarTimer;
        const autoRotatePillar = true; 

        function updatePillarStyles(index) {
             pillarButtons.forEach((el, i) => {
                el.classList.remove('active-pillar');
                
                if (i === index) {
                    el.classList.add('active-pillar');
                }
            });
        }

        function showPillar(index, resetTimer = true) {
            if (resetTimer) clearTimeout(pillarTimer);
            currentPillarIndex = index;
            
            // 1. Update the display of meaning boxes (using smooth CSS classes)
            pillarMeanings.forEach((meaningEl, i) => {
                if (i === currentPillarIndex) {
                    meaningEl.classList.add('active');
                } else {
                    meaningEl.classList.remove('active');
                }
            });
            
            // 2. Update button styles
            updatePillarStyles(index);

            // 3. Set timer for the next pillar (5 seconds)
            if (autoRotatePillar) {
                pillarTimer = setTimeout(nextPillar, 5000);
            }
        }

        function nextPillar() {
            currentPillarIndex = (currentPillarIndex + 1) % pillarMeanings.length;
            showPillar(currentPillarIndex, false);
        }

        // --- MISSION/VISION ROTATOR (Auto-rotating Card) ---
        let missionIndex = 0;
        let missionElements = [];
        let missionTitles = [];
        let missionInterval;

        function initMissionRotator() {
            missionElements = document.querySelectorAll('#mission_version .mission_aboutus');
            missionTitles = document.querySelectorAll('#mission_version .vm');
            if (missionElements.length < 2) return;

            // Initialize: show the first element, hide the rest
            missionElements.forEach((el, i) => {
                el.style.zIndex = (missionElements.length - i);
                if (i === 0) {
                    el.classList.remove('opacity-0');
                    missionTitles[i].style.color = 'var(--color-accent-olive-light)';
                } else {
                    el.classList.add('opacity-0');
                    missionTitles[i].style.color = 'var(--color-secondary-gold)';
                }
            });

            missionInterval = setInterval(rotateMission, 7000);
        }

        function rotateMission() {
            // Hide current card by opacity and move to back (z-index)
            missionElements[missionIndex].classList.add('opacity-0');
            missionElements[missionIndex].style.zIndex = 0; 

            // Advance index
            missionIndex = (missionIndex + 1) % missionElements.length;

            // Show next card by bringing it to front
            missionElements[missionIndex].classList.remove('opacity-0');
            missionElements[missionIndex].style.zIndex = 1; 

            // Swap title colors for visual feedback
            missionTitles.forEach((el, i) => {
                if (i === missionIndex) {
                    el.style.color = 'var(--color-accent-olive-light)';
                } else {
                    el.style.color = 'var(--color-secondary-gold)';
                }
            });
        }


        // --- DOM CONTENT LOADED ---
        document.addEventListener('DOMContentLoaded', () => {
            // Setup Hero Slideshow
            showSlides();

            // Setup Pillar Rotator
            showPillar(0, true); 
            
           
        });

