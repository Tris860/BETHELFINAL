/**
 * ═══════════════════════════════════════════════════════════
 *  BETHEL STUDIO — dashboard.js
 *
 *  Loaded as a plain <script> tag (no type="module").
 *  Uses a dynamic import() inside an async IIFE to pull the
 *  API helpers — this keeps the file itself a normal script
 *  so everything (show_div2, toggleSidebar, etc.) lives in
 *  the regular global scope and is reachable from anywhere.
 * ═══════════════════════════════════════════════════════════
 */

(async function () {
  /* ─────────────────────────────────────────────────────
     IMPORT API HELPERS
     Dynamic import so this file stays a plain script.
  ───────────────────────────────────────────────────── */
  const { deleteData, postData, fetchData, showMessageBox } =
    await import("../backend/api.js");

  /* ─────────────────────────────────────────────────────
     DOM REFERENCES  (script is at end of <body> so DOM
     is already present when this runs)
  ───────────────────────────────────────────────────── */
  const contentPanels = document.querySelectorAll(".content-panel");
  const navButtons = document.querySelectorAll(".nav-button");
  const sidebar = document.getElementById("sidebar-nav");
  const overlay = document.getElementById("sidebarOverlay");
  const imageViewer = document.getElementById("image-viewer");
  const viewerImage = document.getElementById("viewer-image");

  /* ═══════════════════════════════════════════════════
     1.  PANEL SWITCHER
  ═══════════════════════════════════════════════════ */
  function show_div2(panelId) {
    // Hide all panels
    contentPanels.forEach((p) => {
      p.style.display = "none";
      p.classList.add("hidden");
    });

    // Show target — fall back to intro if id not found
    let panel = document.getElementById(panelId);
    if (!panel) {
      console.warn(`Panel "${panelId}" not found — showing intro.`);
      panel = document.getElementById("intro");
      panelId = "intro";
    }
    panel.classList.remove("hidden");
    panel.style.display = "block";

    // Update sidebar highlighted state
    navButtons.forEach((b) => b.classList.remove("selected"));
    const activeBtn = document.querySelector(
      `.nav-button[data-target="${panelId}"]`,
    );
    if (activeBtn) activeBtn.classList.add("selected");

    // Close mobile drawer if open
    if (window.innerWidth <= 1024 && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
    }
  }

  // Expose on window — the Welcome button and activity
  // quick-links both call window.show_div2(target)
  window.show_div2 = show_div2;

  /* ═══════════════════════════════════════════════════
     2.  SIDEBAR — hamburger, overlay, drawer
  ═══════════════════════════════════════════════════ */
  function toggleSidebar() {
    sidebar.classList.toggle("open");
  }

  document
    .getElementById("navTrigger")
    .addEventListener("click", toggleSidebar);

  overlay.addEventListener("click", () => sidebar.classList.remove("open"));

  // Keep overlay .visible in sync with sidebar .open
  new MutationObserver(() => {
    overlay.classList.toggle("visible", sidebar.classList.contains("open"));
  }).observe(sidebar, { attributes: true, attributeFilter: ["class"] });

  // Sidebar nav-button → switch panel
  sidebar.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-button");
    if (btn && btn.dataset.target) show_div2(btn.dataset.target);
  });

  // Legacy typo shims
  window.penNav = toggleSidebar;
  window.openNav = toggleSidebar;

  /* ═══════════════════════════════════════════════════
     3.  QUICK-LINKS  +  WELCOME NAVBAR BUTTON
         .activity-link  — Key Activity cards (intro panel)
         .nav-link-btn   — "Welcome" button in header nav
         Both carry data-target and call show_div2.
  ═══════════════════════════════════════════════════ */
  document.addEventListener("click", (e) => {
    const link = e.target.closest(
      ".activity-link[data-target], .nav-link-btn[data-target]",
    );
    if (link) {
      e.preventDefault();
      show_div2(link.dataset.target);
    }
  });

  /* ═══════════════════════════════════════════════════
     4.  LOGOUT
  ═══════════════════════════════════════════════════ */
  document
    .getElementById("logoutButton")
    .addEventListener("click", async () => {
      const ok = await showMessageBox(
        "Confirm Logout",
        "Are you sure you want to logout?",
        true,
      );
      if (!ok) return;
      const result = await postData("logout", "");
      if (result.success) window.location.href = "../index.html";
    });

  /* ═══════════════════════════════════════════════════
     5.  ADD-ROW / DELETE-ROW TABLE HELPERS
  ═══════════════════════════════════════════════════ */

  // Committee table — Add Row
  document.getElementById("add-row-btn")?.addEventListener("click", () => {
    const tbody = document.querySelector("#staff-table tbody");
    const row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="text" name="names[]" placeholder="Enter name" required></td>
        <td><input type="text" name="posts[]" placeholder="Enter post held" required></td>
        <td class="action-cell">
          <button type="button" class="delete-btn" title="Remove row">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>`;
    row
      .querySelector(".delete-btn")
      .addEventListener("click", (e) => e.target.closest("tr").remove());
  });

  // Memory album — Add Image
  document.getElementById("add-memory-row")?.addEventListener("click", () => {
    const tbody = document.querySelector("#memory-images tbody");
    const row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="file" name="memories[]" accept="image/*" required></td>
        <td class="action-cell">
          <button type="button" class="delete-btn" title="Remove">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>`;
    row
      .querySelector(".delete-btn")
      .addEventListener("click", (e) => e.target.closest("tr").remove());
  });

  // Delegate in-table delete for all tables
  document.querySelectorAll("table").forEach((table) => {
    table.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-btn");
      if (btn?.closest("tbody")) btn.closest("tr").remove();
    });
  });

  /* ═══════════════════════════════════════════════════
     6.  IMAGE PREVIEW HELPERS
  ═══════════════════════════════════════════════════ */
  function setupImagePreview(inputId, imgId) {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    if (!input || !img) return;
    input.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) {
        img.src = "https://placehold.co/300x200/282828/fff?text=New+Image";
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.src = ev.target.result;
        img.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  setupImagePreview("imagePost", "Mypost2");
  setupImagePreview("uploadPic", "Pic");
  setupImagePreview("updateImage", "Myupdate");
  setupImagePreview("updateImage2", "Myupdate2");

  /* ═══════════════════════════════════════════════════
     7.  IMAGE HOVER VIEWER  (shared helper)
  ═══════════════════════════════════════════════════ */
  function showViewer(url) {
    if (!url) return;
    viewerImage.src = "../" + url;
    imageViewer.classList.remove("hidden");
    imageViewer.style.opacity = "1";
  }
  function hideViewer() {
    imageViewer.classList.add("hidden");
    imageViewer.style.opacity = "0";
  }

  /* ═══════════════════════════════════════════════════
     8.  DATA RENDERS
  ═══════════════════════════════════════════════════ */

  /* ── Overview stats ── */
  async function loadOverview() {
    try {
      const [songs, pictures, committee, years] = await Promise.all([
        fetchData("song"),
        fetchData("picture"),
        fetchData("Committee"),
        fetchData("AnnualAchievement"),
      ]);
      document.getElementById("Songs").innerText = songs.length;
      document.getElementById("Pictures").innerText = pictures.length;
      document.getElementById("Committes").innerText = committee.length;
      document.getElementById("YearsRecorded").innerText = years.length;
    } catch (err) {
      console.error("Overview load failed:", err);
    }
  }

  /* ── CTA ── */
  const CTAForm = document.getElementById("CTAform");
  const headingCTA = document.getElementById("headingCTA");
  const captionInput = document.getElementById("caption");
  const pageSelected = document.getElementById("pageselected");
  const pageSelector = document.getElementById("pageSelector");

  CTAForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!pageSelected.value) {
      await showMessageBox("Fill form", "Please select a page first.");
      return;
    }
    const ok = await showMessageBox("Confirm Submission", "Update this CTA?");
    if (!ok) return;
    const fd = new FormData();
    fd.append("heading", headingCTA.value);
    fd.append("caption", captionInput.value);
    fd.append("page", pageSelected.value);
    const data = await postData("CTA", fd);
    if (data.success) {
      headingCTA.value = "";
      captionInput.value = "";
      pageSelected.value = "";
      document
        .querySelectorAll(".page-button")
        .forEach((b) => b.classList.remove("selectedpage"));
    }
  });

  pageSelector?.addEventListener("click", async (e) => {
    const btn = e.target.closest(".page-button");
    if (!btn) return;
    const page = btn.dataset.target;
    pageSelected.value = page;
    document
      .querySelectorAll(".page-button")
      .forEach((b) => b.classList.remove("selectedpage"));
    btn.classList.add("selectedpage");
    const data = await fetchData("CTA", page);
    headingCTA.value = data.heading || "";
    pageSelected.value = data.page || page;
    captionInput.value = data.caption || "";
  });

  /* ── Scripture ── */
  const ScriptureForm = document.getElementById("ScriptureForm");
  const ScriptureTitle = document.getElementById("ScriptureTitle");
  const ScriptureMeaning = document.getElementById("ScriptureMeaning");

  async function loadScripture() {
    const data = await fetchData("Scripture");
    if (ScriptureTitle) ScriptureTitle.value = data.title || "";
    if (ScriptureMeaning) ScriptureMeaning.value = data.content || "";
  }

  if (ScriptureForm) {
    loadScripture();
    ScriptureForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = await showMessageBox(
        "Confirm Submission",
        "Update Scripture of the Day?",
      );
      if (!ok) return;
      const fd = new FormData();
      fd.append("ScriptureTitle", ScriptureTitle.value);
      fd.append("ScriptureMeaning", ScriptureMeaning.value);
      const data = await postData("Scripture", fd);
      if (data.success) {
        ScriptureTitle.value = "";
        ScriptureMeaning.value = "";
        loadScripture();
      }
    });
  }

  /* ── President's Word ── */
  const presidentWordForm = document.getElementById("presidentWordForm");
  const uploadPic = document.getElementById("uploadPic");
  const messageTA = document.getElementById("message");
  const presidentName = document.getElementById("presidentName");

  async function loadPresidentWord() {
    const data = await fetchData("PresidentWord");
    if (presidentName) presidentName.value = data.name || "";
    if (messageTA) messageTA.value = data.message || "";
    const pic = document.getElementById("Pic");
    if (pic && data.image) pic.src = "../" + data.image;
  }

  if (presidentWordForm) {
    loadPresidentWord();
    presidentWordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = await showMessageBox(
        "Confirm Submission",
        "Update the President's message?",
      );
      if (!ok) return;
      const fd = new FormData();
      if (uploadPic?.files.length)
        fd.append("featured_image", uploadPic.files[0]);
      fd.append("presidentName", presidentName.value);
      fd.append("message", messageTA.value);
      const data = await postData("PresidentWord", fd);
      if (data.success) {
        presidentName.value = "";
        messageTA.value = "";
        loadPresidentWord();
      }
    });
  }

  /* ── Songs ── */
  const SongForm = document.getElementById("SongForm");
  const songTableBody = document.querySelector("#song-list tbody");
  const addSongBtn = document.getElementById("add-row-btn3");

  async function renderSongs() {
    if (SongForm) SongForm.style.display = "none";
    if (!songTableBody) return;
    const songs = await fetchData("song");
    songTableBody.innerHTML = "";
    songs.forEach((song) => {
      const row = songTableBody.insertRow();
      row.insertCell(0).textContent = song.title;
      const cell = row.insertCell(1);
      cell.className = "action-cell";

      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.innerHTML =
        '<i class="fa-solid fa-pen-to-square fa-xs"></i> Edit';
      editBtn.addEventListener("click", () => editSong(song.id));

      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.title = "Delete";
      delBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete';
      delBtn.addEventListener("click", () => deleteSong(song.id));

      cell.appendChild(editBtn);
      cell.appendChild(delBtn);
    });
  }

  addSongBtn?.addEventListener("click", () => {
    if (SongForm) SongForm.style.display = "flex";
    document.getElementById("SongFormTitle").innerText = "Add a Song";
    document.getElementById("titleSong").value = "";
    document.getElementById("linkSong").value = "";
    document.getElementById("songId").value = "";
  });

  async function editSong(id) {
    const song = await fetchData("song", id);
    if (!song) return;
    if (SongForm) SongForm.style.display = "flex";
    document.getElementById("SongFormTitle").innerText = "Edit Song";
    document.getElementById("songId").value = song.id;
    document.getElementById("titleSong").value = song.title;
    document.getElementById("linkSong").value = song.link;
  }

  async function deleteSong(id) {
    const ok = await showMessageBox(
      "Confirm Delete",
      "Delete this song?",
      true,
    );
    if (!ok) return;
    const result = await deleteData("song", id);
    if (result.success) renderSongs();
  }

  SongForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", document.getElementById("titleSong").value);
    fd.append("link", document.getElementById("linkSong").value);
    const id = document.getElementById("songId").value;
    const data = await postData("song", fd, id);
    if (data.success) {
      SongForm.style.display = "none";
      document.getElementById("SongFormTitle").innerText = "";
      document.getElementById("titleSong").value = "";
      document.getElementById("linkSong").value = "";
      document.getElementById("songId").value = "";
      renderSongs();
    }
  });

  /* ── Pictures / Gallery ── */
  const PictureForm = document.getElementById("imagePostForm");
  const imageInput = document.getElementById("imagePost");
  const ImageCaption = document.getElementById("ImageCaption");
  const pictureTableBody = document.querySelector("#pictureTableBody");
  const addPictureBtn = document.getElementById("add-row-btn4");
  const pictureFormTitle = document.getElementById("pictureFormTitle");

  function setStatusBtn(btn, isActive) {
    btn.textContent = isActive ? "ACTIVE" : "INACTIVE";
    btn.setAttribute("data-status", isActive ? "1" : "0");
    btn.classList.remove("status-active-button", "status-inactive-button");
    btn.classList.add(
      isActive ? "status-active-button" : "status-inactive-button",
    );
  }

  async function renderPictures() {
    if (PictureForm) PictureForm.style.display = "none";
    if (!pictureTableBody) return;
    const pictures = await fetchData("picture");
    pictureTableBody.innerHTML = "";

    pictures.forEach((picture) => {
      const row = pictureTableBody.insertRow();
      row.setAttribute("data-image-url", picture.link);
      row.addEventListener("mouseover", () => showViewer(picture.link));
      row.addEventListener("mouseout", hideViewer);

      row.insertCell(0).textContent = picture.caption;
      const cell = row.insertCell(1);
      cell.className = "action-cell";

      const statusBtn = document.createElement("button");
      statusBtn.className = "status-button";
      setStatusBtn(statusBtn, picture.slideshow);
      statusBtn.addEventListener("click", async () => {
        const fd = new FormData();
        fd.append("status", String(!picture.slideshow));
        fd.append("imageId", picture.id);
        const result = await postData("Slideshow", fd, picture.id);
        if (result.success) renderPictures();
      });

      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.innerHTML =
        '<i class="fa-solid fa-pen-to-square fa-xs"></i> Edit';
      editBtn.addEventListener("click", () => editPicture(picture.id));

      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.title = "Delete";
      delBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete';
      delBtn.addEventListener("click", () => deletePicture(picture.id));

      cell.appendChild(statusBtn);
      cell.appendChild(editBtn);
      cell.appendChild(delBtn);
    });
  }

  addPictureBtn?.addEventListener("click", () => {
    if (PictureForm) PictureForm.style.display = "flex";
    if (pictureFormTitle) pictureFormTitle.innerText = "Add a Picture";
    if (ImageCaption) ImageCaption.value = "";
    const mypost = document.getElementById("Mypost2");
    if (mypost)
      mypost.src = "https://placehold.co/300x200/1a1a1a/FFD700?text=New+Image";
    ["pictureId", "url"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  });

  async function editPicture(id) {
    const pic = await fetchData("picture", id);
    if (!pic) return;
    if (PictureForm) PictureForm.style.display = "flex";
    if (pictureFormTitle) pictureFormTitle.innerText = "Edit Picture";
    document.getElementById("pictureId").value = pic.id;
    document.getElementById("url").value = pic.link;
    document.getElementById("Mypost2").src = "../" + pic.link;
    if (ImageCaption) ImageCaption.value = pic.caption;
  }

  async function deletePicture(id) {
    const ok = await showMessageBox(
      "Confirm Delete",
      "Delete this picture?",
      true,
    );
    if (!ok) return;
    const result = await deleteData("picture", id);
    if (result.success) renderPictures();
  }

  PictureForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("url", document.getElementById("url").value);
    fd.append("caption", document.getElementById("ImageCaption").value);
    fd.append("pictureId", document.getElementById("pictureId").value);
    if (imageInput?.files.length)
      fd.append("featured_image", imageInput.files[0]);
    const id = document.getElementById("pictureId").value;
    const data = await postData("picture", fd, id);
    if (data.success) {
      if (pictureFormTitle) pictureFormTitle.innerText = "";
      document.getElementById("Mypost2").src = "";
      document.getElementById("ImageCaption").value = "";
      document.getElementById("url").value = "";
      document.getElementById("pictureId").value = "";
      PictureForm.reset();
      renderPictures();
    }
  });

  /* ── Committee ── */
  const StaffForm = document.getElementById("staff-form");
  const actionButtonsContainer = document.getElementById("deleteContainer");

  async function renderEra() {
    const eras = await fetchData("Committee");
    const tableBody = document.querySelector("#staff-table tbody");
    const container = document.getElementById("committeAction");
    if (!container || !tableBody) return;

    container.innerHTML = "";
    tableBody.innerHTML = "";
    document.getElementById("staffTitle").innerText =
      "Register a new Bethel Committee";

    // Default empty row
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td><input type="text" name="names[]" placeholder="Enter name" required></td>
      <td><input type="text" name="posts[]" placeholder="Enter post held" required></td>
      <td class="action-cell">
        <button type="button" class="delete-btn" title="Remove row">
          <i class="fa-solid fa-trash-can"></i> Delete Delete
        </button>
      </td>`;
    tableBody.appendChild(emptyRow);
    tableBody.removeAttribute("data-image-url");

    // "New" button
    const newBtn = document.createElement("button");
    newBtn.className = "page-button selectedpage";
    newBtn.id = "NewCommitte";
    newBtn.textContent = "New";
    newBtn.addEventListener("click", () => {
      tableBody.removeAttribute("data-image-url");
      document
        .querySelectorAll(".page-button")
        .forEach((b) => b.classList.remove("selectedpage"));
      newBtn.classList.add("selectedpage");
      if (actionButtonsContainer) actionButtonsContainer.innerHTML = "";
      if (StaffForm) StaffForm.reset();
      tableBody.innerHTML = "";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="text" name="names[]" placeholder="Enter name" required></td>
        <td><input type="text" name="posts[]" placeholder="Enter post held" required></td>
        <td class="action-cell">
          <button type="button" class="delete-btn" title="Remove row">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>`;
      tableBody.appendChild(row);
      document.getElementById("staffTitle").innerText =
        "Register a new Bethel Committee";
    });
    container.appendChild(newBtn);

    // One button per saved era
    eras.forEach((era) => {
      const btn = document.createElement("button");
      btn.className = "page-button";
      btn.dataset.target = era.era;
      btn.textContent = era.era;
      btn.addEventListener("click", async () => {
        document
          .querySelectorAll(".page-button")
          .forEach((b) => b.classList.remove("selectedpage"));
        btn.classList.add("selectedpage");
        document.getElementById("staffTitle").innerText =
          "Editing Bethel Committee of " + era.era;
        const data = await fetchData("Committee", era.era);
        renderCommitteeForm(data);
      });
      container.appendChild(btn);
    });
  }

  async function renderCommitteeForm(data) {
    const tableBody = StaffForm.querySelector("#staff-table tbody");
    if (actionButtonsContainer) actionButtonsContainer.innerHTML = "";

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "Delete Committee";
    delBtn.type = "button";
    delBtn.addEventListener("click", async () => {
      const ok = await showMessageBox(
        "Confirm Delete",
        "Delete this entire Committee?",
        true,
      );
      if (!ok) return;
      const result = await deleteData("Committee", data.commit_id);
      if (result.success) {
        StaffForm.reset();
        renderEra();
      }
    });
    if (actionButtonsContainer) actionButtonsContainer.appendChild(delBtn);

    tableBody.innerHTML = "";
    tableBody.setAttribute("data-image-url", data.picture);
    tableBody.addEventListener("mouseover", () => showViewer(data.picture));
    tableBody.addEventListener("mouseout", hideViewer);

    data.members.forEach((member) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="text" name="names[]" value="${member.names}" required></td>
        <td><input type="text" name="posts[]" value="${member.post}"  required></td>
        <td class="action-cell">
          <button type="button" class="delete-btn" title="Remove row">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    StaffForm.querySelector('input[name="ecree"]').value = data.ecree || "";
    StaffForm.querySelector('input[name="period"]').value = data.era || "";
    StaffForm.querySelector('input[name="commit_id"]').value =
      data.commit_id || "";
    StaffForm.querySelector('input[name="url"]').value = data.picture || "";
  }

  StaffForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ok = await showMessageBox(
      "Confirm Submission",
      "Save this Committee?",
    );
    if (!ok) return;
    const data = await postData("Committee", new FormData(StaffForm));
    if (data.success) {
      StaffForm.reset();
      renderEra();
    }
  });

  /* ── Annual Achievements ── */
  async function renderAnnualAchievements() {
    const achievements = await fetchData("AnnualAchievement");
    const container = document.getElementById("annual_achivementsAction");
    if (!container) return;
    container.innerHTML = "";

    const newBtn = document.createElement("button");
    newBtn.className = "page-button selectedpage";
    newBtn.id = "NewAchievement";
    newBtn.textContent = "New";
    newBtn.addEventListener("click", () => {
      document
        .querySelectorAll(".page-button")
        .forEach((b) => b.classList.remove("selectedpage"));
      newBtn.classList.add("selectedpage");
      document.getElementById("actionbox").innerHTML = "";
      document.getElementById("yearId").value = "";
      document.getElementById("yearForm").reset();
      document.getElementById("achievementTitle").innerText =
        "New Annual Achievements";
    });
    container.appendChild(newBtn);

    achievements.forEach((achievement) => {
      const btn = document.createElement("button");
      btn.className = "page-button";
      btn.dataset.target = achievement.id;
      btn.textContent = achievement.year;
      btn.addEventListener("click", async () => {
        document
          .querySelectorAll(".page-button")
          .forEach((b) => b.classList.remove("selectedpage"));
        btn.classList.add("selectedpage");
        document.getElementById("yearId").value = achievement.id;
        document.getElementById("year").value = achievement.year;
        document.getElementById("yearContext").value = achievement.summary;

        const actionbox = document.getElementById("actionbox");
        actionbox.innerHTML = "";
        const actionBtn = document.createElement("button");
        actionBtn.className = "delete-btn";
        actionBtn.textContent = "Delete Achievement";
        actionBtn.type = "button";
        actionBtn.addEventListener("click", async () => {
          const ok = await showMessageBox(
            "Confirm Delete",
            "Delete this Achievement?",
            true,
          );
          if (!ok) return;
          const result = await deleteData("AnnualAchievement", achievement.id);
          if (result.success) renderAnnualAchievements();
        });
        actionbox.appendChild(actionBtn);
      });
      container.appendChild(btn);
    });
  }

  document.getElementById("yearForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("yearId").value;
    const data = await postData(
      "AnnualAchievement",
      new FormData(e.target),
      id,
    );
    if (data.success) {
      e.target.reset();
      renderAnnualAchievements();
    }
  });

  /* ── Service Flyer ── */
  async function renderFlyer() {
    const flyer = await fetchData("flyer");
    const img = document.getElementById("Myupdate2");
    if (img && flyer.link) img.src = "../" + flyer.link;

    // Replace button node to avoid stacking event listeners on re-render
    const oldBtn = document.getElementById("status-btn");
    if (!oldBtn) return;
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);

    const isActive = !!flyer.status;
    newBtn.textContent = isActive ? "INACTIVE" : "ACTIVE";
    newBtn.setAttribute("data-status", isActive ? "0" : "1");
    newBtn.classList.remove(
      "status-active-button",
      "status-inactive-button",
      "active-button",
      "inactive-button",
    );
    newBtn.classList.add(
      isActive ? "status-active-button" : "status-inactive-button",
    );

    newBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      const next = newBtn.getAttribute("data-status") !== "1";
      newBtn.setAttribute("data-status", next ? "1" : "0");
      newBtn.textContent = next ? "ACTIVE" : "INACTIVE";
      newBtn.classList.remove("status-active-button", "status-inactive-button");
      newBtn.classList.add(
        next ? "status-active-button" : "status-inactive-button",
      );
    });
  }

  document
    .getElementById("flyerForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = await showMessageBox("Confirm Submission", "Save this Flyer?");
      if (!ok) return;
      const fd = new FormData(e.target);
      fd.append(
        "status",
        document.getElementById("status-btn")?.getAttribute("data-status") ||
          "0",
      );
      const data = await postData("flyer", fd);
      console.log("Flyer save result:", data);
      if (data.success) {
        e.target.reset();
        renderFlyer();
      }
    });

  /* ═══════════════════════════════════════════════════
     BOOT — initialise everything once DOM is ready
  ═══════════════════════════════════════════════════ */
  function boot() {
    show_div2("intro");
    loadOverview();
    renderSongs();
    renderPictures();
    renderEra();
    renderAnnualAchievements();
    renderFlyer();
  }

  // Script is at end of <body> so DOM is already parsed,
  // but guard against the rare edge-case just in case.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(); // end async IIFE
