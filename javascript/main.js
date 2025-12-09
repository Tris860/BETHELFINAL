// ------------------- Mobile Navigation Logic -------------------
    function openNav() {
        console.log("hello");
        document.getElementById("navigation").classList.remove("close");
        document.getElementById("navigation").classList.add("open");
    }

    function closeNav() {
        document.getElementById("navigation").classList.remove("open");
        document.getElementById("navigation").classList.add("close");
    }

    // Event listeners correctly attach functions to the buttons
    document.addEventListener('DOMContentLoaded', () => {
        const openBtn = document.getElementById("nav-open-btn");
        const closeBtn = document.getElementById('nav-close-btn');

        if (openBtn) {
            openBtn.addEventListener('click', openNav);
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', closeNav);
        }
    });