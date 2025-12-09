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
    const defaultNavBtn = document.querySelector('.nav-button[data-target="scriptureOfDay"]');
    if(defaultNavBtn) {
        defaultNavBtn.classList.add('selected');
    }
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
            <td><button type="button" class="delete-btn">Delete</button></td>
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
    const CTAForm = document.getElementById('CTAform');
    const heading =document.getElementById('headingCTA');
    const caption =document.getElementById('caption');
    const page =document.getElementById('pageselected');
    const pageButtons = document.querySelectorAll('.page-button');
    const pageSelector = document.getElementById('pageSelector');

    const ScriptureForm = document.getElementById("ScriptureForm");
    const ScriptureTitle =document.getElementById('ScriptureTitle');
    const ScriptureMeaning =document.getElementById('ScriptureMeaning');
     

    const presidentWordForm = document.getElementById('presidentWordForm');
    const uploadPic = document.getElementById('uploadPic');
    const message = document.getElementById('message');
    const presidentName = document.getElementById('presidentName');

    const songTable = document.getElementById("song-list");
    const songTableBody = document.querySelector("#song-list tbody");
    const SongForm =document.getElementById("SongForm");
    const addSong =document.getElementById("add-row-btn3");
    const SongFormTitle = document.getElementById("SongFormTitle");

    const PictureForm =document.getElementById("imagePostForm");
    const image =document.getElementById("imagePost");
    const ImageCaption =document.getElementById("ImageCaption");
    const pictureTableBody = document.querySelector("#pictureTableBody");
    const addPicture =document.getElementById("add-row-btn4");
    const pictureFormTitle = document.getElementById("pictureFormTitle");

    const imageViewer = document.getElementById('image-viewer');
    const viewerImage = document.getElementById('viewer-image');


    renderSongs();


    if (CTAForm) {
            CTAForm.addEventListener('submit',async function(event) {
               event.preventDefault(); // Prevent default form submission
               if(page.value){
                  const confirmed = await showMessageBox('Confirm Submission', 'Are you sure you want to update CTA ?');
                  if(confirmed){
                    const formData = new FormData();
                    formData.append("heading",heading.value);
                    formData.append("caption",caption.value);
                    formData.append("page",page.value);
                    const data = await postData('CTA', formData);
                    if(data.success){
                        heading.value = "";
                        caption.value ="";
                        page.value ="";
                        pageButtons.forEach(btn => btn.classList.remove('selectedpage'));
                    }
                  }
               }else{
                  const confirmed = await showMessageBox('Fill form', 'Please Select Page ?');
               }
            });
        }
    pageSelector.addEventListener('click',async (event) => {
    const clickedButton = event.target.closest('.page-button');
    if (clickedButton) {
       const targetpage = clickedButton.dataset.target;

       document.getElementById("pageselected").value = targetpage;
       pageButtons.forEach(btn => btn.classList.remove('selectedpage'));

            // Find the button associated with the panel ID using the data-target attribute
       const activeBtn = document.querySelector(`.page-button[data-target="${targetpage}"]`);
       if (activeBtn) {
           activeBtn.classList.add('selectedpage');
           const data = await fetchData("CTA",targetpage);
           heading.value = data.heading;
           page.value = data.page;
           caption.value = data.caption;
        }
    }
    
    });
    async function Scripturerender(){
        const data = await fetchData("Scripture");
        ScriptureTitle.value = data.title;
        ScriptureMeaning.value =data.content;
    }
    async function Wordrender(){
        const data = await fetchData("PresidentWord")

        presidentName.value = data.name;
        message.value =data.message;
        document.getElementById("Pic").src = "../" + data.image;

    }

    if(ScriptureForm){
        Scripturerender();
        
        ScriptureForm.addEventListener('submit',async function(event) {
        event.preventDefault(); // Prevent default form submission
      
        const confirmed = await showMessageBox('Confirm Submission', 'Are you sure you want to update Scripture of the Day?');
        if(confirmed){
            const formData = new FormData();
            formData.append("ScriptureTitle",ScriptureTitle.value);
            formData.append("ScriptureMeaning",ScriptureMeaning.value);

            const data = await postData('Scripture', formData);
            if(data.success){
              ScriptureTitle.value = "";
              ScriptureMeaning.value ="";
              Scripturerender();
            }
        }
        
        });
    }

    if(presidentWordForm){
        Wordrender();
        presidentWordForm.addEventListener('submit',async function(event) {
        event.preventDefault(); // Prevent default form submission
      
        const confirmed = await showMessageBox('Confirm Submission', 'Are you sure you want to update President word ?');
        if(confirmed){
            const formData = new FormData();
            const featured_image = uploadPic.files[0];
            if (uploadPic.files.length > 0 ) {
                formData.append('featured_image', featured_image);
            }
            formData.append("presidentName",presidentName.value);
            formData.append("message",message.value);

            const data = await postData('PresidentWord', formData);
            if(data.success){
              presidentName.value = "";
              message.value ="";
              Wordrender();
            }

        }
        
        });


    }

    async function renderSongs(){
        SongForm.style.display='none';
         let songs = await fetchData("song");
         songTableBody.innerHTML = '';
         songs.forEach(song => {
            const row = songTableBody.insertRow();
            row.insertCell(0).textContent = song.title;
            const actionsCell = row.insertCell(1);
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', () => editSong(song.id));
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteSong(song.id));
            actionsCell.appendChild(deleteBtn);
         });
    }
    addSong.addEventListener('click', () => { 
        SongForm.style.display = 'flex'; 
        document.getElementById("SongFormTitle").innerText = 'Add a song'; 
        document.getElementById('titleSong').value = ''; 
        document.getElementById('linkSong').value = '';
    });
    async function editSong(id) {
       const song = await fetchData('song', id);
        if (song) {
            SongForm.style.display = 'flex'; 
            document.getElementById("SongFormTitle").innerText = 'Edit the song'; 
            document.getElementById('songId').value = song.id; 
            document.getElementById('titleSong').value = song.title; 
            document.getElementById('linkSong').value = song.link;
        }
    }
    async function deleteSong(id) {
        const confirmed = await showMessageBox('Confirm Delete', 'Delete this song', true);
        if (confirmed) { 
            const result = await deleteData('song', id);
            if (result.success) {
               renderSongs();
              }
        }
    }
    if (SongForm) {
        SongForm.addEventListener('submit',async function(event) {
          event.preventDefault(); // Prevent default form submission

          const formData = new FormData();
          formData.append("title",document.getElementById('titleSong').value);
          formData.append("link",document.getElementById('linkSong').value );
          const id=document.getElementById('songId').value;
          const data = await postData('song', formData ,id);
          if(data.success){
              SongForm.style.display = 'none'; 
              document.getElementById("SongFormTitle").innerText = ''; 
              document.getElementById('titleSong').value = ''; 
              document.getElementById('linkSong').value = '';
              document.getElementById('songId').value = '';
              renderSongs();
          }
        });
    }
    renderPictures();
    async function renderPictures(){
         PictureForm.style.display='none';
         let pictures = await fetchData("picture");
         pictureTableBody.innerHTML = '';
         pictures.forEach(picture => {
            const row = pictureTableBody.insertRow();
            row.classList.add("hover-row");
            row.setAttribute('data-image-url', picture.link);
            row.addEventListener('mouseover', (event) => {
                    // Get the image URL from the data attribute of the hovered row
                    const imageUrl = row.getAttribute('data-image-url');

                    // If a URL exists, update the viewer and show it
                    if (imageUrl) {
                        const imageUrls="../"+imageUrl;
                        viewerImage.src = imageUrls;
                        imageViewer.classList.remove('hidden');
                        imageViewer.style.opacity = 1; // Fade in effect
                    }
                });

                // Event listener for when the mouse leaves a row
                row.addEventListener('mouseout', () => {
                    // Hide the viewer instantly
                    imageViewer.classList.add('hidden');
                    imageViewer.style.opacity = 0;
                });
            row.insertCell(0).textContent = picture.caption;
            const actionsCell = row.insertCell(1);
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', () => editPicture(picture.id));
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deletePicture(picture.id));
            actionsCell.appendChild(deleteBtn);
         });
    }
    addPicture.addEventListener('click', () => { 
        PictureForm.style.display = 'flex'; 
        document.getElementById("pictureFormTitle").innerText = 'Add a picture'; 
         ImageCaption.value = '';
         document.getElementById("Mypost2").value="";
         document.getElementById("url").value="";
         document.getElementById("pictureId").value="";
    });
    async function editPicture(id) {
       const picture = await fetchData('picture', id);
        if (picture) {
            PictureForm.style.display = 'flex'; 
            document.getElementById("pictureFormTitle").innerText = 'Edit the picture'; 
            document.getElementById('pictureId').value = picture.id;
            document.getElementById('Mypost2').src="../"+picture.link; 
            document.getElementById('url').value=picture.link; 
            ImageCaption.value=picture.caption;
        }
    }
    async function deletePicture(id) {
        const confirmed = await showMessageBox('Confirm Delete', 'Delete this picture', true);
        if (confirmed) { 
            const result = await deleteData('picture', id);
            if (result.success) {
               renderSongs();
              }
        }
    }
    if (PictureForm) {
        
       PictureForm.addEventListener('submit',async function(event) { 
          event.preventDefault(); // Prevent default form submission

          const formData = new FormData();
           formData.append("url",document.getElementById('url').value); 
          formData.append("caption",document.getElementById('ImageCaption').value);
          const featured_image = image.files[0];
          if (image.files.length > 0 ) {
              formData.append('featured_image', featured_image);
            }
          const id=document.getElementById('pictureId').value;
          const data = await postData('picture', formData ,id);
          if(data.success){
              SongForm.style.display = 'none'; 
              document.getElementById("pictureId").innerText = ''; 
              pictureFormTitle.innerText = ''; 
              document.getElementById('Mypost2').src="";
              ImageCaption.value="";
              document.getElementById('url').value='';
              PictureForm.reset();
              renderPictures();
          }
        });
    }

});