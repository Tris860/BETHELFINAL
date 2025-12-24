import { renderHomePage } from "./api/renderApi.js";

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
function animateCounter(element, target) {
  let current = 0;
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 16ms is roughly 60fps

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + "+";
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + "+";
    }
  }, 16);
}

function initStatsObserver() {
    const statsSection = document.querySelector('.stats_counter');
    const counters = document.querySelectorAll('.counter_number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    // Extract the number from text (e.g., "200+" becomes 200)
                    const target = parseInt(counter.textContent);
                    animateCounter(counter, target);
                });
                // Stop observing once the animation has triggered
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Triggers when 50% of the section is visible

    observer.observe(statsSection);
}


document.addEventListener('DOMContentLoaded', () => {
        
        renderHomePage()
          .then(() => {
                  console.log("Success");
                        showSlides();
                  
          })
          .catch((err) => {
            console.error("Error:", err);
          });
        initStatsObserver();
     
           
    
    

});