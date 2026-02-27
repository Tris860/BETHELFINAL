import { fetchData } from "../../admin/backend/api.js";

function highlightByPattern(originalText) {
  const words = originalText.split(" ");

  const highlightedWords = words.map((word, index) => {
    if ((index + 1) % 2 !== 0) {
      return `<span>${word}</span>`;
    }
    return word;
  });
  return highlightedWords.join(" ");
}

/**
 * Loads and renders the hero background slideshow for the homepage
 * Fetches images from the backend and creates slider elements
 * @async
 * @function Slideshow
 * @returns {Promise<void>}
 */
async function Slideshow() {
  const sliderArea = document.getElementById("image");
  if (!sliderArea) return; // Guard clause for missing DOM element

  try {
    // Fetch slideshow images from backend API
    const images = await fetchData("Slideshow");
    sliderArea.innerHTML = ""; // Clear existing content

    // Create slider divs for each image
    images.forEach((img, index) => {
      const sliderDiv = document.createElement("div");
      sliderDiv.className = `slider ${index === 0 ? "active" : ""}`; // First image is active

      const imageEl = document.createElement("img");
      imageEl.className = "w-full h-full object-cover";
      imageEl.src = img.link;
      imageEl.alt = img.alt || "Hero background image";

      sliderDiv.appendChild(imageEl);
      sliderArea.appendChild(sliderDiv);
    });
  } catch (error) {
    console.error("Failed to load slideshow:", error);
  }
}
async function Slideshow_2() {
  const sliderArea = document.getElementById("image");
  if (!sliderArea) return; // Guard clause

  try {
    const images = await fetchData("Slideshow");
    sliderArea.innerHTML = "";

    images.forEach((img, index) => {
      const sliderDiv = document.createElement("div");
      sliderDiv.className = `slider ${index === 0 ? "active" : ""}`;

      const imageEl = document.createElement("img");
      imageEl.className = "w-full h-full object-cover";
      imageEl.src = "../" + img.link;
      imageEl.alt = img.alt || "";

      sliderDiv.appendChild(imageEl);
      sliderArea.appendChild(sliderDiv);
    });
  } catch (error) {
    console.error("Failed to load slideshow:", error);
  }
}
async function flyerRender() {
  const flyerArea = document.getElementById("flyer");
  if (!flyerArea) return; // Guard clause
  flyerArea.innerHTML = "";
  const flyerImg = document.createElement("img");
  const data = await fetchData("flyer");
  flyerImg.src = data.link;
  flyerImg.alt = "sunday Service Flyer";

  if (data.status === 1) {
    flyerArea.classList.add("show");
    flyerArea.classList.remove("hidden");
  } else {
    flyerArea.classList.remove("show");
    flyerArea.classList.add("hidden");
  }
  flyerArea.appendChild(flyerImg);
  flyerArea.onclick = function () {
    flyerArea.classList.remove("show");
    flyerArea.classList.add("hidden");
  };
}

async function HeroContent(targetpage) {
  const heroContent = document.getElementById("heroContent");
  const data = await fetchData("CTA", targetpage);

  heroContent.innerHTML = "";

  const innerDiv = document.createElement("div");

  const h1 = document.createElement("h1");
  const highlightedText = highlightByPattern(
    data.heading || "BETHEL FAMILY CHOIR, THE HOLY GATES OF HEAVEN",
  );
  h1.innerHTML = highlightedText;

  const p = document.createElement("p");
  p.textContent =
    data.caption ||
    "Welcome to our community! Join us in celebrating faith, music, and togetherness.";

  // Assemble the elements
  innerDiv.appendChild(h1);
  innerDiv.appendChild(p);
  heroContent.appendChild(innerDiv);

  return heroContent;
}

async function BibleVerse() {
  const container = document.getElementById("bibleVerse");
  container.innerHTML = "";
  const data = await fetchData("Scripture");
  const h3 = document.createElement("h3");

  const icon = document.createElement("i");
  icon.className = "fas fa-bible goldenSpan";

  // Create the text node for the reference
  const verseRef = document.createTextNode(`${data.title}`);

  // Assemble H3
  h3.appendChild(icon);
  h3.appendChild(verseRef);

  // Create the Paragraph element
  const p = document.createElement("p");
  p.textContent = data.content || "";

  // Assemble the container
  container.appendChild(h3);
  container.appendChild(p);

  return container;
}

async function renderGallery() {
  const galleryHolder = document.getElementById("gallery_holder");
  galleryHolder.innerHTML = "";
  const items = await fetchData("picture");

  items.forEach((item, index) => {
    if (index >= 4) return; // Limit to first 4 items
    const itemDiv = document.createElement("div");
    itemDiv.className = "gallery_item";

    const link = document.createElement("a");
    link.href = "websections/gallery.html";

    const img = document.createElement("img");
    img.src = item.link;
    img.alt = item.caption || `Gallery Image ${index + 1}`;

    link.appendChild(img);
    itemDiv.appendChild(link);
    galleryHolder.appendChild(itemDiv);
  });

  return galleryHolder;
}

async function PresidentMessage() {
  const msgDiv = document.getElementById("presidentMessage");
  msgDiv.innerHTML = "";

  const data = await fetchData("PresidentWord");

  const profilePicDiv = document.createElement("div");
  profilePicDiv.className = "profilePic";

  const img = document.createElement("img");
  img.src = data.image;
  img.alt = data.name;

  profilePicDiv.appendChild(img);

  const msgContDiv = document.createElement("div");
  msgContDiv.className = "msg_cont";

  const h3 = document.createElement("h3");
  h3.innerHTML = `El Presidente <span>${data.name}</span>`;

  const p = document.createElement("p");
  p.textContent = `${data.message}`;

  msgContDiv.appendChild(h3);
  msgContDiv.appendChild(p);

  // 4. Assemble the main container
  msgDiv.appendChild(profilePicDiv);
  msgDiv.appendChild(msgContDiv);

  return msgDiv;
}

async function renderVideoGallery() {
  const videoData = await fetchData("song");

  const fragment = document.getElementById("video-grid");
  fragment.innerHTML = ""; // Clear existing content

  videoData.forEach((video) => {
    // Create main card
    const videoCard = document.createElement("div");
    videoCard.className = "video-card";

    // Create responsive container
    const videoResponsive = document.createElement("div");
    videoResponsive.className = "video-responsive";

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = video.link;
    iframe.title = video.title;
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    // Create caption
    const caption = document.createElement("p");
    caption.className = "video-caption";
    caption.textContent = video.title;

    // Assemble
    videoResponsive.appendChild(iframe);
    videoCard.appendChild(videoResponsive);
    videoCard.appendChild(caption);

    fragment.appendChild(videoCard);
  });
}

async function BethelCommittee() {
  const committees = await fetchData("Committee");
  let committee = committees[0];
  const bethelCommittee = document.getElementById("bethelCommitte");

  // Headers
  const h2_1 = document.createElement("h2");
  h2_1.textContent = "Meet Bethel's Committes";
  bethelCommittee.appendChild(h2_1);

  const h2_2 = document.createElement("h2");
  const spanCommitte = document.createElement("span");
  spanCommitte.textContent = "Committe";
  const spanYear = document.createElement("span");
  spanYear.textContent = committee.era;

  h2_2.appendChild(document.createTextNode("B-"));
  h2_2.appendChild(spanCommitte);
  h2_2.appendChild(document.createTextNode(" members "));
  h2_2.appendChild(spanYear);
  bethelCommittee.appendChild(h2_2);

  // Committee Main Container
  const committeeDiv = document.createElement("div");
  committeeDiv.className = "Committe";

  // Image Section
  const imgDiv = document.createElement("div");
  imgDiv.className = "committeImg";
  const img = document.createElement("img");
  img.src = "../" + committee.picture;
  img.alt = "";
  imgDiv.appendChild(img);
  committeeDiv.appendChild(imgDiv);

  // Description Section
  const descDiv = document.createElement("div");
  descDiv.className = "description";
  const ul = document.createElement("ul");

  const members = committee.members;

  members.forEach((member) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = `${member.post}:`;
    li.appendChild(span);
    li.appendChild(document.createTextNode(` ${member.names}`));
    ul.appendChild(li);
  });

  descDiv.appendChild(ul);
  committeeDiv.appendChild(descDiv);
  bethelCommittee.appendChild(committeeDiv);
}

async function CommitteeSlideshow() {
  const committeeData = await fetchData("Committee");
  const container = document.getElementById("committeeSlideshow");
  container.innerHTML = "";
  committeeData.forEach((data, index) => {
    const slide = document.createElement("div");

    const activeClass = index === 0 ? "active" : "";
    slide.className = `slide ${activeClass}`;

    const h2 = document.createElement("h2");
    h2.innerHTML = `<span>B-</span>Committee <span>(${data.era})</span>`;
    slide.appendChild(h2);

    // Create Committee Wrapper
    const committeeWrapper = document.createElement("div");
    committeeWrapper.className = "committe";

    // Create Image Section
    const imgDiv = document.createElement("div");
    imgDiv.className = "committeImg";
    const img = document.createElement("img");
    img.src = "../" + data.picture;
    img.alt = "";
    imgDiv.appendChild(img);
    committeeWrapper.appendChild(imgDiv);

    // Create Description Section
    const descDiv = document.createElement("div");
    descDiv.className = "description";
    const ul = document.createElement("ul");

    data.members.forEach((member) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${member.post}:</span> ${member.names}`;
      ul.appendChild(li);
    });

    descDiv.appendChild(ul);
    committeeWrapper.appendChild(descDiv);
    slide.appendChild(committeeWrapper);

    // Create Bottom Header
    const h3 = document.createElement("h3");
    h3.className = "oliveSpan";
    h3.innerHTML = `<span>Ecree: </span>${data.ecree}`;
    slide.appendChild(h3);

    container.appendChild(slide);
  });
}

async function createYearDetails() {
  const historyData = await fetchData("AnnualAchievement");
  const container = document.getElementById("year_details");
  container.innerHTML = "";

  historyData.forEach((item) => {
    const p = document.createElement("p");
    // Using innerHTML to preserve the <span>, <i>, and <a> tags inside the text
    p.innerHTML = `<span>${item.year}</span>: ${item.summary}`;
    container.appendChild(p);
  });
}

async function renderHomePage() {
  await Slideshow();
  await flyerRender();
  await HeroContent("Home");
  await BibleVerse();
  await renderGallery();
  await PresidentMessage();
  return true;
}

async function renderServicesPage() {
  await Slideshow_2();
  await HeroContent("Service");
  await renderVideoGallery();
  return true;
}

async function renderaboutPage() {
  await Slideshow_2();
  await HeroContent("About");
  await BethelCommittee(1);
  return true;
}
async function renderGalleryPage() {
  await Slideshow_2();
  await HeroContent("Gallery");
  return true;
}
async function renderHistoryPage() {
  await Slideshow_2();
  await HeroContent("History");
  await CommitteeSlideshow();
  await createYearDetails();
  return true;
}

export {
  fetchData,
  renderHomePage,
  renderServicesPage,
  renderGalleryPage,
  renderaboutPage,
  renderHistoryPage,
};
