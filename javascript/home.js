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
document.addEventListener('DOMContentLoaded', () => {
    // Setup Hero Slideshow
    showSlides();
    

});