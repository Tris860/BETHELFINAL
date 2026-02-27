/**
 * ===========================================
 * HOMEPAGE CONTROLLER
 * ===========================================
 * Manages homepage-specific functionality including
 * slideshow rotation and animated statistics counters.
 *
 * Dependencies: renderApi.js (renderHomePage function)
 * DOM Elements: .slider-area .slider, .stats_counter, .counter_number
 * ===========================================
 */

import { renderHomePage } from "./api/renderApi.js";

// Global variables for slideshow state
let slideIndex = 0; // Current slide index
let sliderElements = []; // Array of slider DOM elements

/**
 * Rotates through hero background images automatically
 * Called every 7 seconds to advance to next slide
 * @function showSlides
 * @returns {void}
 */
function showSlides() {
  // Get all slider elements from DOM
  sliderElements = document.querySelectorAll(".slider-area .slider");
  if (sliderElements.length === 0) return; // Guard clause if no slides exist

  // Hide all slides by removing active class
  sliderElements.forEach((el) => el.classList.remove("active"));

  // Advance index and handle wrap-around
  slideIndex = slideIndex % sliderElements.length;

  // Show the current slide by adding active class
  sliderElements[slideIndex].classList.add("active");
  slideIndex++;

  // Call again after 7 seconds for continuous rotation
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
  const statsSection = document.querySelector(".stats_counter");
  const counters = document.querySelectorAll(".counter_number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach((counter) => {
            // Extract the number from text (e.g., "200+" becomes 200)
            const target = parseInt(counter.textContent);
            animateCounter(counter, target);
          });
          // Stop observing once the animation has triggered
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  ); // Triggers when 50% of the section is visible

  observer.observe(statsSection);
}

document.addEventListener("DOMContentLoaded", () => {
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
