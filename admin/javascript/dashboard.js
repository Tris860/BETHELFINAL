import {  deleteData, postData , putData, fetchData,showMessageBox } from "../backend/api.js";

document.getElementById('logoutButton').addEventListener('click', async () => {
    const confirmed = await showMessageBox('Confirm Logout', 'Are you sure you want to logout ?', true);
    if (confirmed) {
            // Simulate logout process
        const result = await postData('logout','');
           
        if (result.success) {
            window.location.href = '../index.html'; 
        }
     }
 });

const contentPanels = document.querySelectorAll('.content-panel');
const navButtons = document.querySelectorAll('.nav-button');
const sidebar = document.getElementById('sidebar-nav');




function show_div2(panelId) {
            
            // 1. Hide all content panels
    contentPanels.forEach(panel => {
            panel.style.display = 'none';
        });

            // 2. Show the target panel
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
        targetPanel.classList.remove('hidden');
        targetPanel.style.display = 'block'; // Make it visible
    } else {
        console.error(`Content panel with ID '${panelId}' not found.`);
                // If the target panel is missing, default back to 'intro'
         document.getElementById('intro').style.display = 'block';
         panelId = 'intro';
    }

            // 3. Update active state in sidebar (using 'selected' class)
    navButtons.forEach(btn => btn.classList.remove('selected'));

            // Find the button associated with the panel ID using the data-target attribute
    const activeBtn = document.querySelector(`.nav-button[data-target="${panelId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('selected');
    }
            
            // 4. Close mobile menu if open
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        penNav(); // Toggles the 'open' class
    }
}
sidebar.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('.nav-button');
    if (clickedButton) {
      const targetId = clickedButton.dataset.target;
      if (targetId) {
          show_div2(targetId);
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
            // Ensure the intro is the default active view
    show_div2('intro'); 

            // Initial active button highlight (must run after intro is shown)
   /*  const defaultNavBtn = document.querySelector('.nav-button[data-target="scriptureOfDay"]');
    if(defaultNavBtn) {
        defaultNavBtn.classList.add('selected');
    } */
});

function openNav() {
        sidebar.classList.toggle('open');
        console.log('Mobile Navigation Toggled');
    }

    // Stub for other original functions
    
    function addInput() {
        // This function probably added an input row dynamically, 
        // e.g., to the service_songs form, or B_commit table.
        console.log('Add input/row functionality triggered.');
    }
    
    // Helper function for dynamic row adding (Example for B_commit table)
    document.getElementById('add-row-btn')?.addEventListener('click', () => {
        const tableBody = document.querySelector('#staff-table tbody');
        const newRow = tableBody.insertRow();
        
        newRow.innerHTML = `
            <td><input type="text" name="names[]" placeholder="Enter name" required></td>
            <td><input type="text" name="posts[]" placeholder="Enter post held" required></td>
            <td>
                <button type="button" class="delete-btn">Delete</button>
            </td>
        `;
        
        newRow.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.target.closest('tr').remove();
        });
    });

    // Delegate delete button functionality to the table for dynamism
    document.querySelectorAll('table').forEach(table => {
        table.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                e.target.closest('tr').remove();
            }
        });
    });

    // Simple image preview for single file inputs (Mypost2/Myupdate)
    function setupImagePreview(inputId, imgId) {
        const input = document.getElementById(inputId);
        const img = document.getElementById(imgId);

        if (input && img) {
            input.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        img.src = e.target.result;
                        img.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                } else {
                    img.src = '';
                    // Using placeholder for better UX
                    img.src = `https://placehold.co/${img.width}x${img.height}/282828/fff?text=New+Image`;
                }
            });
        }
    }
    
    // Apply image preview to main post sections
    setupImagePreview('imagePost', 'Mypost2');
    setupImagePreview('uploadPic', 'Pic');
    setupImagePreview('updateImage', 'Myupdate');
    setupImagePreview('updateImage2', 'Myupdate2');

document.addEventListener('DOMContentLoaded', function() {
  const CTAForm = document.getElementById("CTAform");
  const heading = document.getElementById("headingCTA");
  const caption = document.getElementById("caption");
  const page = document.getElementById("pageselected");
  const pageButtons = document.querySelectorAll(".page-button");
  const pageSelector = document.getElementById("pageSelector");

  const ScriptureForm = document.getElementById("ScriptureForm");
  const ScriptureTitle = document.getElementById("ScriptureTitle");
  const ScriptureMeaning = document.getElementById("ScriptureMeaning");

  const actionButtonsContainer = document.getElementById("deleteContainer");

  const presidentWordForm = document.getElementById("presidentWordForm");
  const uploadPic = document.getElementById("uploadPic");
  const message = document.getElementById("message");
  const presidentName = document.getElementById("presidentName");

  const songTable = document.getElementById("song-list");
  const songTableBody = document.querySelector("#song-list tbody");
  const SongForm = document.getElementById("SongForm");
  const addSong = document.getElementById("add-row-btn3");
  const SongFormTitle = document.getElementById("SongFormTitle");

  const PictureForm = document.getElementById("imagePostForm");
  const image = document.getElementById("imagePost");
  const ImageCaption = document.getElementById("ImageCaption");
  const pictureTableBody = document.querySelector("#pictureTableBody");
  const addPicture = document.getElementById("add-row-btn4");
  const pictureFormTitle = document.getElementById("pictureFormTitle");

  const imageViewer = document.getElementById("image-viewer");
  const viewerImage = document.getElementById("viewer-image");

  async function overview() {
    const songs = await fetchData("song");
    document.getElementById("Songs").innerText = songs.length;

    const Pictures = await fetchData("picture");
    document.getElementById("Pictures").innerText = Pictures.length;

    const committee = await fetchData("Committee");
    document.getElementById("Committes").innerText = committee.length;

    const year = await fetchData("AnnualAchievement");
    document.getElementById("YearsRecorded").innerText = year.length;

  }
  overview();

  renderSongs();

  if (CTAForm) {
    CTAForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission
      if (page.value) {
        const confirmed = await showMessageBox(
          "Confirm Submission",
          "Are you sure you want to update CTA ?"
        );
        if (confirmed) {
          const formData = new FormData();
          formData.append("heading", heading.value);
          formData.append("caption", caption.value);
          formData.append("page", page.value);
          const data = await postData("CTA", formData);
          if (data.success) {
            heading.value = "";
            caption.value = "";
            page.value = "";
            pageButtons.forEach((btn) => btn.classList.remove("selectedpage"));
          }
        }
      } else {
        const confirmed = await showMessageBox(
          "Fill form",
          "Please Select Page ?"
        );
      }
    });
  }
  pageSelector.addEventListener("click", async (event) => {
    const clickedButton = event.target.closest(".page-button");
    if (clickedButton) {
      const targetpage = clickedButton.dataset.target;

      document.getElementById("pageselected").value = targetpage;
      pageButtons.forEach((btn) => btn.classList.remove("selectedpage"));

      // Find the button associated with the panel ID using the data-target attribute
      const activeBtn = document.querySelector(
        `.page-button[data-target="${targetpage}"]`
      );
      if (activeBtn) {
        activeBtn.classList.add("selectedpage");
        const data = await fetchData("CTA", targetpage);
        heading.value = data.heading;
        page.value = data.page;
        caption.value = data.caption;
      }
    }
  });
  async function Scripturerender() {
    const data = await fetchData("Scripture");
    ScriptureTitle.value = data.title;
    ScriptureMeaning.value = data.content;
  }
  async function Wordrender() {
    const data = await fetchData("PresidentWord");

    presidentName.value = data.name;
    message.value = data.message;
    document.getElementById("Pic").src = "../" + data.image;
  }

  if (ScriptureForm) {
    Scripturerender();

    ScriptureForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      const confirmed = await showMessageBox(
        "Confirm Submission",
        "Are you sure you want to update Scripture of the Day?"
      );
      if (confirmed) {
        const formData = new FormData();
        formData.append("ScriptureTitle", ScriptureTitle.value);
        formData.append("ScriptureMeaning", ScriptureMeaning.value);

        const data = await postData("Scripture", formData);
        if (data.success) {
          ScriptureTitle.value = "";
          ScriptureMeaning.value = "";
          Scripturerender();
        }
      }
    });
  }

  if (presidentWordForm) {
    Wordrender();
    presidentWordForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      const confirmed = await showMessageBox(
        "Confirm Submission",
        "Are you sure you want to update President word ?"
      );
      if (confirmed) {
        const formData = new FormData();
        const featured_image = uploadPic.files[0];
        if (uploadPic.files.length > 0) {
          formData.append("featured_image", featured_image);
        }
        formData.append("presidentName", presidentName.value);
        formData.append("message", message.value);

        const data = await postData("PresidentWord", formData);
        if (data.success) {
          presidentName.value = "";
          message.value = "";
          Wordrender();
        }
      }
    });
  }

  async function renderSongs() {
    SongForm.style.display = "none";
    let songs = await fetchData("song");
    songTableBody.innerHTML = "";
    songs.forEach((song) => {
      const row = songTableBody.insertRow();
      row.insertCell(0).textContent = song.title;
      const actionsCell = row.insertCell(1);
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-btn");
      editBtn.addEventListener("click", () => editSong(song.id));
      actionsCell.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => deleteSong(song.id));
      actionsCell.appendChild(deleteBtn);
    });
  }
  addSong.addEventListener("click", () => {
    SongForm.style.display = "flex";
    document.getElementById("SongFormTitle").innerText = "Add a song";
    document.getElementById("titleSong").value = "";
    document.getElementById("linkSong").value = "";
  });
  async function editSong(id) {
    const song = await fetchData("song", id);
    if (song) {
      SongForm.style.display = "flex";
      document.getElementById("SongFormTitle").innerText = "Edit the song";
      document.getElementById("songId").value = song.id;
      document.getElementById("titleSong").value = song.title;
      document.getElementById("linkSong").value = song.link;
    }
  }
  async function deleteSong(id) {
    const confirmed = await showMessageBox(
      "Confirm Delete",
      "Delete this song",
      true
    );
    if (confirmed) {
      const result = await deleteData("song", id);
      if (result.success) {
        renderSongs();
      }
    }
  }
  if (SongForm) {
    SongForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData();
      formData.append("title", document.getElementById("titleSong").value);
      formData.append("link", document.getElementById("linkSong").value);
      const id = document.getElementById("songId").value;
      const data = await postData("song", formData, id);
      if (data.success) {
        SongForm.style.display = "none";
        document.getElementById("SongFormTitle").innerText = "";
        document.getElementById("titleSong").value = "";
        document.getElementById("linkSong").value = "";
        document.getElementById("songId").value = "";
        renderSongs();
      }
    });
  }
  renderPictures();
  // Function to create the switch element
 function updateButtonAppearance(button, isActive) {
   button.textContent = isActive ? "ACTIVE" : "INACTIVE";
   button.setAttribute("data-status", isActive);

   // Remove existing status classes
   button.classList.remove("status-active-button", "status-inactive-button");

   // Add the correct status class
   if (isActive) {
     button.classList.add("status-active-button");
   } else {
     button.classList.add("status-inactive-button");
   }
 }

 /**
  * Global function to handle the status button click and state change.
  * @param {HTMLButtonElement} button - The button element that triggered the change.
  * @param {string} caption - The caption associated with the row/item.
  */


 /**
  * Creates the full HTML structure for the status button.
  * @param {string} captionText - The text used to identify the button in the console log.
  * @param {boolean} isActive - Initial state of the status.
  * @returns {HTMLButtonElement} The complete status button element.
  */


  // Example usage: append to body
 

  async function renderPictures() {
    PictureForm.style.display = "none";
    let pictures = await fetchData("picture");
    pictureTableBody.innerHTML = "";
    pictures.forEach((picture) => {
      const row = pictureTableBody.insertRow();
      row.classList.add("hover-row");
      row.setAttribute("data-image-url", picture.link);
      row.addEventListener("mouseover", (event) => {
        // Get the image URL from the data attribute of the hovered row
        const imageUrl = row.getAttribute("data-image-url");

        // If a URL exists, update the viewer and show it
        if (imageUrl) {
          const imageUrls = "../" + imageUrl;
          viewerImage.src = imageUrls;
          imageViewer.classList.remove("hidden");
          imageViewer.style.opacity = 1; // Fade in effect
        }
      });

      // Event listener for when the mouse leaves a row
      row.addEventListener("mouseout", () => {
        // Hide the viewer instantly
        imageViewer.classList.add("hidden");
        imageViewer.style.opacity = 0;
      });
      row.insertCell(0).textContent = picture.caption;
      const statusButton = document.createElement("button");
      statusButton.className = "status-button";
      statusButton.textContent = picture.slideshow ? "ACTIVE" : "INACTIVE";
      
      statusButton.addEventListener("click", async () => {
        console.log(`Status button for "${picture.slideshow}" clicked.`);
        const formData = new FormData();
        formData.append("status", !picture.slideshow);
        formData.append("imageId", picture.id);

        const result = await postData("Slideshow", formData, picture.id);
        if (result.success) {
            renderPictures();
        }
      });
      const actionsCell = row.insertCell(1); 
      actionsCell.appendChild(statusButton);
      
       
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-btn");
      editBtn.addEventListener("click", () => editPicture(picture.id));
      actionsCell.appendChild(editBtn);
      
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", () => deletePicture(picture.id));
        actionsCell.appendChild(deleteBtn); 
    });
      
  }
  addPicture.addEventListener("click", () => {
    PictureForm.style.display = "flex";
    document.getElementById("pictureFormTitle").innerText = "Add a picture";
    ImageCaption.value = "";
    document.getElementById("Mypost2").value = "";
    document.getElementById("url").value = "";
    document.getElementById("pictureId").value = "";
  });
  async function editPicture(id) {
    const picture = await fetchData("picture", id);
    if (picture) {
      PictureForm.style.display = "flex";
      document.getElementById("pictureFormTitle").innerText =
        "Edit the picture";
      document.getElementById("pictureId").value = picture.id;
      document.getElementById("Mypost2").src = "../" + picture.link;
      document.getElementById("url").value = picture.link;
      ImageCaption.value = picture.caption;
    }
  }
  async function deletePicture(id) {
    const confirmed = await showMessageBox(
      "Confirm Delete",
      "Delete this picture",
      true
    );
    if (confirmed) {
      const result = await deleteData("picture", id);
      if (result.success) {
        renderSongs();
      }
    }
  }
  if (PictureForm) {
    PictureForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData();
      formData.append("url", document.getElementById("url").value);
      formData.append("caption", document.getElementById("ImageCaption").value);
      formData.append("pictureId", document.getElementById("pictureId").value);
      const featured_image = image.files[0];
      if (image.files.length > 0) {
        formData.append("featured_image", featured_image);
      }
      const id = document.getElementById("pictureId").value;
      const data = await postData("picture", formData, id);
      if (data.success) {
        SongForm.style.display = "none";
        document.getElementById("pictureId").innerText = "";
        pictureFormTitle.innerText = "";
        document.getElementById("Mypost2").src = "";
        ImageCaption.value = "";
        document.getElementById("url").value = "";
        PictureForm.reset();
        renderPictures();
      }
    });
  }

  const StaffForm = document.getElementById("staff-form");

  if (StaffForm) {
    StaffForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      const confirmed = await showMessageBox(
        "Confirm Submission",
        "Are you sure you want to save this Committee?"
      );

      if (confirmed) {
        const formData = new FormData(StaffForm);

        // Send data to backend
        const data = await postData("Committee", formData);

        if (data.success) {
          // Reset form fields
          StaffForm.reset();
          renderEra();
        }
      }
    });
  }
  async function renderEra() {
    // Fetch all eras from backend
    let eras = await fetchData("Committee");
    const tableBody = document.querySelector("#staff-table tbody");
    const container = document.getElementById("committeAction");
    container.innerHTML = ""; // clear old buttons
    tableBody.innerHTML = "";
    document.getElementById("staffTitle").innerText = "";
    document.getElementById("staffTitle").innerText =
      "Register a new Bethel Committee";

    // Add one empty row
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
        <td><input type="text" name="names[]" placeholder="Enter name" required></td>
        <td><input type="text" name="posts[]" placeholder="Enter post held" required></td>
        <td><button type="button" class="delete-btn">Delete</button></td>
    `;
    tableBody.appendChild(emptyRow);
    tableBody.removeAttribute("data-image-url");

    const btn = document.createElement("button");
    btn.classList.add("page-button");
    btn.textContent = "New";
    btn.id = "NewCommitte";
    container.appendChild(btn);
    btn.addEventListener("click", () => {
      // Clear form for new entry
      tableBody.removeAttribute("data-image-url");
      document
        .querySelectorAll(".page-button")
        .forEach((b) => b.classList.remove("selectedpage"));
      btn.classList.add("selectedpage");
      actionButtonsContainer.innerHTML = "";
      StaffForm.reset();
      const inputs = document.querySelectorAll("#staff-form input");
      inputs.forEach((input) => {
        input.required = false; // or input.removeAttribute('required');
      });

      // Clear all existing rows
      tableBody.innerHTML = "";

      // Add one empty row
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `
        <td><input type="text" name="names[]" placeholder="Enter name" required></td>
        <td><input type="text" name="posts[]" placeholder="Enter post held" required></td>
        <td><button type="button" class="delete-btn">Delete</button></td>
    `;
      tableBody.appendChild(emptyRow);
      document.getElementById("staffTitle").innerText =
        "Register a new Bethel Committee";
    });

    eras.forEach((era) => {
      const btn = document.createElement("button");
      btn.classList.add("page-button");
      btn.dataset.target = era.commit_id;
      btn.textContent = era.era;

      btn.addEventListener("click", async (event) => {
        const commit_id = btn.dataset.target;

        // Update hidden field
        document.getElementById("pageselected").value = commit_id;

        // Remove active class from all buttons
        document
          .querySelectorAll(".page-button")
          .forEach((b) => b.classList.remove("selectedpage"));

        // Mark this one active
        btn.classList.add("selectedpage");

        // Fetch committee data for this era
        document.getElementById("staffTitle").innerText =
          "Editing Bethel Committee of " + era.era;
        const data = await fetchData("Committee", commit_id);

        renderCommitteeForm(data);
        const inputs = document.querySelectorAll("#staff-form input");
        inputs.forEach((input) => {
          input.required = false; // or input.removeAttribute('required');
        });
      });

      container.appendChild(btn);
    });
  }

  renderEra();
  async function renderCommitteeForm(data) {
    const staffForm = document.getElementById("staff-form");
    const tableBody = staffForm.querySelector("#staff-table tbody");
    actionButtonsContainer.innerHTML = ""; // Clear previous buttons
    const btn = document.createElement("button");
    btn.classList.add("delete-btn");
    btn.textContent = "Delete Committee";
    btn.type = "button";
    btn.addEventListener("click", async () => {
      const confirmed = await showMessageBox(
        "Confirm Delete",
        "Delete this Committee",
        true
      );
      if (confirmed) {
        const result = await deleteData("Committee", data.commit_id);
        if (result.success) {
          // Clear form and re-render eras
          staffForm.reset();
          renderEra();
        }
      }
    });
    actionButtonsContainer.appendChild(btn);
    // Clear existing rows
    tableBody.innerHTML = "";
    tableBody.setAttribute("data-image-url", data.picture);
    tableBody.addEventListener("mouseover", (event) => {
      // Get the image URL from the data attribute of the hovered row
      const imageUrl = tableBody.getAttribute("data-image-url");

      // If a URL exists, update the viewer and show it
      if (imageUrl) {
        const imageUrls = "../" + imageUrl;
        viewerImage.src = imageUrls;
        imageViewer.classList.remove("hidden");
        imageViewer.style.opacity = 1; // Fade in effect
      }
    });
    tableBody.addEventListener("mouseout", () => {
      // Hide the viewer instantly
      imageViewer.classList.add("hidden");
      imageViewer.style.opacity = 0;
    });

    // Populate members
    data.members.forEach((member) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td><input type="text" name="names[]" value="${member.names}" required></td>
            <td><input type="text" name="posts[]" value="${member.post}" required></td>
            <td><button type="button" class="delete-btn">Delete</button></td>
        `;
      tableBody.appendChild(row);
    });

    // Fill decree and period
    staffForm.querySelector('input[name="ecree"]').value = data.ecree || "";
    staffForm.querySelector('input[name="period"]').value = data.era || "";
    staffForm.querySelector('input[name="commit_id"]').value =
      data.commit_id || "";
    staffForm.querySelector('input[name="url"]').value = data.picture || "";
  }
  renderAnnualAchievements();
  async function renderAnnualAchievements() {
    const achievements = await fetchData("AnnualAchievement");
    const erachievementsContainer = document.getElementById("annual_achivementsAction");
    const newbtn = document.createElement("button");
    erachievementsContainer.innerHTML = ""; // clear old buttons
    newbtn.classList.add("page-button");
    newbtn.classList.add("selectedpage");
    newbtn.textContent = "New";
    newbtn.id = "NewAchievement";
    erachievementsContainer.appendChild(newbtn);
    newbtn.addEventListener("click", () => {
      document.querySelectorAll(".page-button")
        .forEach((b) => b.classList.remove("selectedpage"));
      newbtn.classList.add("selectedpage");
      document.getElementById("actionbox").innerHTML = "";
      document.getElementById("yearId").value = "";

      // Clear all existing rows
      document.getElementById("yearForm").reset();
      document.getElementById("achievementTitle").innerText ="New Annual Achievements";
    });

    
    achievements.forEach((achievement) => {
      const btn = document.createElement("button");
      btn.classList.add("page-button");
      btn.dataset.target = achievement.id;
      btn.textContent = achievement.year; 

      btn.addEventListener("click", async (event) => {
        const yearId = btn.dataset.target;  
        document.getElementById("yearId").value = yearId;
        /* document.getElementById(
          "achievementTitle"
        ).innerText = `Edit ${achievement.year} Annual Achievements`;
 */
        // Remove active class from all buttons
        document
          .querySelectorAll(".page-button")
          .forEach((b) => b.classList.remove("selectedpage"));  
        
        // Mark this one active

        btn.classList.add("selectedpage");

        // Fetch achievement data for this year
        const data = await fetchData("AnnualAchievement", yearId);  

        document.getElementById("year").value = achievement.year;
        document.getElementById("yearContext").value = achievement.summary;

        const actionBtn = document.createElement("button");
        actionBtn.classList.add("delete-btn");
        actionBtn.textContent = "Delete Achievement";
        actionBtn.type = "button";
        document.getElementById("actionbox").innerHTML = "";
        document.getElementById("actionbox").appendChild(actionBtn);
        actionBtn.addEventListener("click", async () => {
          const confirmed = await showMessageBox(
            "Confirm Delete",
            "Delete this Achievement",
            true
          );
          if (confirmed) {
            const result = await deleteData("AnnualAchievement",achievement.id);
            if (result.success) {
              console.log(result.success);
              erachievementsContainer.reset();
              renderAnnualAchievements();
            }
          }
        });
      });
      erachievementsContainer.appendChild(btn);
    });
  }
  const achievementsForm = document.getElementById("yearForm");
  if (achievementsForm) {
    achievementsForm.addEventListener("submit", async function (event) {
      event.preventDefault();// Prevent default form submission
      const formData = new FormData(achievementsForm);

      const id = document.getElementById("yearId").value;
      const data = await postData("AnnualAchievement", formData, id);
      if (data.success) {
        achievementsForm.reset();
        renderAnnualAchievements();
      }
    });
  }
  renderFlyer();
  async function renderFlyer() {
    const flyer = await fetchData('flyer');
    document.getElementById("Myupdate2").src ="../" + flyer.link;
    const button = document.getElementById("status-btn");
    button.textContent = flyer.status ? "ACTIVE" : "INACTIVE";
    button.setAttribute("data-status", flyer.status);
    button.classList.add("status-button");
    button.classList.add(
      flyer.status ?  "active-button" : "inactive-button"
    );
    button.addEventListener('click', (event) => {
      let status = button.getAttribute("data-status")=="0" ? 1 : 0; 

      button.classList.remove("active-button", "inactive-button");
      event.preventDefault();
      button.setAttribute("data-status", status);
       
      button.textContent = status ? "ACTIVE" : "INACTIVE";
      

    });
    
  }
  const flyerForm = document.getElementById("flyerForm");
  if (flyerForm) {
    flyerForm.addEventListener("submit", async function (event) {
       event.preventDefault();

       const confirmed = await showMessageBox(
         "Confirm Submission",
         "Are you sure you want to save this Flyer ?"
       );

       if (confirmed) {
         const formData = new FormData(flyerForm);

         // Send data to backend

         const status = document
           .getElementById("status-btn")
           .getAttribute("data-status");

         formData.append("status", status);
         const data = await postData("flyer", formData);

         if (data.success) {
           // Reset form fields
           flyerForm.reset();
           renderFlyer();
         }
       }
     });
  }
  
});
