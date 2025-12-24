import { fetchData  } from "./api/renderApi.js";
import { renderGalleryPage } from "./api/renderApi.js";
// Array of placeholder images and captions (replace with your actual data)
let images = [];
let currentIndex = 0;
const viewer = document.getElementById("image-viewer");
function openViewer(index) {
  showImage(index);
  viewer.style.opacity = 0;
  viewer.style.display = "flex";
  // Trigger fade in
  setTimeout(() => {
    viewer.style.opacity = 1;
  }, 10);
}
function showImage(index) {
  const viewerImage = document.getElementById("viewer-image");
  const imageCaption = document.getElementById("image-caption");
  if (index >= 0 && index < images.length) {
    // Start fade out effect for the current image
    viewerImage.style.opacity = 0;

    // After the fade out period (150ms), change source and fade back in
    setTimeout(() => {
      currentIndex = index;
      viewerImage.src = "../" + images[currentIndex].link;
      viewerImage.alt = images[currentIndex].caption;
      imageCaption.textContent = images[currentIndex].caption;

      // Fade the new image in
      viewerImage.style.opacity = 1;
    }, 150);
  }
}
function closeViewer() {
  viewer.style.opacity = 0;
  setTimeout(() => {
    viewer.style.display = "none";
  }, 300); // Wait for fade out to complete
}
document
  .getElementById("close-btn")
  .addEventListener("click", () => closeViewer());
document
  .getElementById("prev-btn")
  .addEventListener("click", () => prevImage());
document
  .getElementById("next-btn")
  .addEventListener("click", () => nextImage());
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
viewer.addEventListener("click", (event) => {
  // Check if the click target is the viewer itself, not the content inside
  if (event.target === viewer) {
    closeViewer();
  }
});

// Keyboard navigation (Escape, Left, Right)
document.addEventListener("keydown", (event) => {
  if (viewer.style.display === "flex") {
    if (event.key === "Escape") {
      closeViewer();
    } else if (event.key === "ArrowRight") {
      nextImage();
    } else if (event.key === "ArrowLeft") {
      prevImage();
    }
  }
});
async function renderGallery_2() {
  const galleryGrid = document.getElementById("gallery-grid");
  galleryGrid.innerHTML = "";
  images = await fetchData("picture");

  images.forEach((img, index) => {
    const item = document.createElement("div");
    item.classList.add("gallery-item");
    item.setAttribute("data-index", index);

    item.style.animationDelay = `${index * 0.08}s`;

    const image = document.createElement("img");
    image.src = "../" + img.link;
    image.alt = img.caption;

    item.appendChild(image);
    item.addEventListener("click", () => openViewer(index));
    galleryGrid.appendChild(item);
  });
}
// Initialize gallery on load
document.addEventListener("DOMContentLoaded", async () => { 
    renderGalleryPage().then(async () => {
                  console.log("Success");
                         await renderGallery_2();
                  
          })
          .catch((err) => {
            console.error("Error:", err);
          });
   

});

