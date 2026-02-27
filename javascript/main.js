/**
 * ===========================================
 * MOBILE NAVIGATION CONTROLLER
 * ===========================================
 * Handles the opening and closing of the mobile navigation drawer.
 * Provides smooth slide-in/slide-out animations for mobile menu.
 *
 * Dependencies: None
 * DOM Elements: #navigation, #nav-open-btn, #nav-close-btn
 * ===========================================
 */

// ------------------- Mobile Navigation Logic -------------------

/**
 * Opens the mobile navigation drawer
 * Removes 'close' class and adds 'open' class to trigger CSS animation
 */
function openNav() {
    console.log("Opening mobile navigation menu");
    document.getElementById("navigation").classList.remove("close");
    document.getElementById("navigation").classList.add("open");
}

/**
 * Closes the mobile navigation drawer
 * Removes 'open' class and adds 'close' class to trigger CSS animation
 */
function closeNav() {
    document.getElementById("navigation").classList.remove("open");
    document.getElementById("navigation").classList.add("close");
}

// Initialize event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get references to navigation control buttons
    const openBtn = document.getElementById("nav-open-btn");
    const closeBtn = document.getElementById('nav-close-btn');

    // Attach click event listeners if buttons exist
    if (openBtn) {
        openBtn.addEventListener('click', openNav);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNav);
    }
});
