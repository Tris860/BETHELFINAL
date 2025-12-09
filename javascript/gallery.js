        // Array of placeholder images and captions (replace with your actual data)
        const images = [
  { url: "../media/placeholders/IMG-20250410-WA0030.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250410-WA0029.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250410-WA0028.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250410-WA0027.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250410-WA0026.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250410-WA0025.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250410-WA0024.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250403-WA0030.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250403-WA0030 copy.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250403-WA0029.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250403-WA0028.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20250403-WA0006.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20240821-WA0016.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20240821-WA0015.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20240821-WA0014.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20240821-WA0013.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20240411-WA0004.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/IMG-20240409-WA0004.jpg", caption: "Choir Event Photo" },
  { url: "../media/placeholders/2100914c-293b-42ad-9824-7773055685e9.png", caption: "Committee Archive" },
  { url: "../media/placeholders/2024_2025.jpeg", caption: "Committee Archive" },
  { url: "../media/placeholders/2024_2025 (1).jpeg", caption: "Patrons Meeting - Strategic Planning" },
  { url: "../media/placeholders/68f8e1102a5d5_BETHEL FAMILY chior (20).png", caption: "Bethel Family Choir" },
  { url: "../media/placeholders/14d40086-59fc-4512-b057-2da8a873a4de.png", caption: "Committee Archive" },
  { url: "../media/placeholders/14d40086-59fc-4512-b057-2da8a873a4de copy.png", caption: "Committee Archive" },
  { url: "../media/placeholders/0ddf7e55-3c13-457e-82bb-9763d652839a.png", caption: "Committee Archive" }
]


        let currentIndex = 0;
        const viewer = document.getElementById('image-viewer');
        const viewerImage = document.getElementById('viewer-image');
        const imageCaption = document.getElementById('image-caption');
        const galleryGrid = document.getElementById('gallery-grid');

        // --- Gallery Initialization ---
        function renderGallery() {
            galleryGrid.innerHTML = ''; // Clear existing content
            images.forEach((img, index) => {
                const item = document.createElement('div');
                item.classList.add('gallery-item');
                item.setAttribute('data-index', index);
                
                // Set animation delay for staggered artistic loading
                item.style.animationDelay = `${index * 0.08}s`;
                
                const image = document.createElement('img');
                image.src = img.url;
                image.alt = img.caption;
                
                item.appendChild(image);
                item.addEventListener('click', () => openViewer(index));
                galleryGrid.appendChild(item);
            });
        }
        
        // --- Viewer Functions ---

        // Display a specific image in the viewer
        function showImage(index) {
            if (index >= 0 && index < images.length) {
                
                // Start fade out effect for the current image
                viewerImage.style.opacity = 0;

                // After the fade out period (150ms), change source and fade back in
                setTimeout(() => {
                    currentIndex = index;
                    viewerImage.src = images[currentIndex].url;
                    viewerImage.alt = images[currentIndex].caption;
                    imageCaption.textContent = images[currentIndex].caption;

                    // Fade the new image in
                    viewerImage.style.opacity = 1;
                }, 150); 
            }
        }

        // Open the viewer modal
        function openViewer(index) {
            showImage(index);
            viewer.style.opacity = 0;
            viewer.style.display = 'flex';
            // Trigger fade in
            setTimeout(() => {
                viewer.style.opacity = 1;
            }, 10);
        }

        // Close the viewer modal
        function closeViewer() {
            viewer.style.opacity = 0;
            setTimeout(() => {
                viewer.style.display = 'none';
            }, 300); // Wait for fade out to complete
        }

        // Navigate to the next image
        function nextImage() {
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
        }

        // Navigate to the previous image
        function prevImage() {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        }

        // Close viewer when clicking outside the image (on the overlay)
        viewer.addEventListener('click', (event) => {
            // Check if the click target is the viewer itself, not the content inside
            if (event.target === viewer) {
                closeViewer();
            }
        });

        // Keyboard navigation (Escape, Left, Right)
        document.addEventListener('keydown', (event) => {
            if (viewer.style.display === 'flex') {
                if (event.key === 'Escape') {
                    closeViewer();
                } else if (event.key === 'ArrowRight') {
                    nextImage();
                } else if (event.key === 'ArrowLeft') {
                    prevImage();
                }
            }
        });

        // Initialize gallery on load
        window.onload = renderGallery;