
    // --- Main Header Image Slider Logic (Automatically rotates hero images) ---
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
            
        }
        setInterval(showSlides, 7000);
        

    // --- Committee Slideshow Logic (Based on user's provided logic) ---

        let currentCommitIndex = 0;
        let slides = [];
        const transitionDuration = 900; // Matches CSS animation duration in ms (0.9s)
        const slideInterval = 7000; // Time each slide is shown

        // Function to handle the transition to the next slide
        function showNextSlide() {
            if (slides.length < 2) return;

            const oldIndex = currentCommitIndex;
            // Calculate the index of the next slide (loop back to 0 if at the end)
            currentCommitIndex = (currentCommitIndex + 1) % slides.length;

            const oldSlide = slides[oldIndex];
            const newSlide = slides[currentCommitIndex];

            // 1. Start the transition out for the old slide
            // Remove 'active' status and apply 'slideOut' animation class
            oldSlide.classList.remove('active');
            oldSlide.classList.add('slideOut');

            // Set a timeout to wait for the slideOut animation to finish
            setTimeout(() => {
                // 2. Hide the old slide after it slides out and clean up the animation class
                oldSlide.classList.remove('slideOut');
                oldSlide.style.display = 'none';

                // 3. Prepare the new slide to slide in
                // Set the new slide to display: block immediately (it starts hidden off-screen by the animation)
                newSlide.style.display = 'block';
                newSlide.classList.add('slideIn'); // Apply the animation that brings it from the left
                
                // Set a timeout to wait for the slideIn animation to finish
                setTimeout(() => {
                    // 4. Clean up the slideIn class and set the new slide as 'active' (fully visible state)
                    newSlide.classList.remove('slideIn');
                    newSlide.classList.add('active'); 
                }, transitionDuration); 

            }, transitionDuration); 
        }

        // Initialize the slideshow when the window loads
        window.onload = function() {
            slides = document.querySelectorAll('#committeeSlideshow .slide');

            if (slides.length > 0) {
                // Ensure only the first slide is visible and active on load
                slides.forEach((slide, index) => {
                    slide.classList.remove('active', 'slideOut', 'slideIn');
                    slide.style.display = 'none';
                });
                slides[0].style.display = 'block';
                slides[0].classList.add('active');

                // Start the automatic rotation
                setInterval(showNextSlide, slideInterval);
            }
        };

