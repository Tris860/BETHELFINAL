const API_BASE_URL = 'http://localhost:3000/admin/backend/main.php';
function showMessageBox(title, message, isConfirm = false) {
    const messageBoxOverlay = document.getElementById('messageBoxOverlay');
    const messageBox = document.getElementById('messageBox');
    const messageBoxTitle = document.getElementById('messageBoxTitle');
    const messageBoxContent = document.getElementById('messageBoxContent');
    const messageBoxConfirmBtn = document.getElementById('messageBoxConfirmBtn');
    const messageBoxCancelBtn = document.getElementById('messageBoxCancelBtn');
        return new Promise((resolve) => {
            messageBoxTitle.textContent = title;
            messageBoxContent.textContent = message;
            messageBoxConfirmBtn.textContent = isConfirm ? 'Yes' : 'OK';
            messageBoxCancelBtn.style.display = isConfirm ? 'inline-block' : 'none';

            messageBoxOverlay.style.display = 'block';
            messageBox.style.display = 'block';

            const confirmHandler = () => {
                messageBoxOverlay.style.display = 'none';
                messageBox.style.display = 'none';
                messageBoxConfirmBtn.removeEventListener('click', confirmHandler);
                messageBoxCancelBtn.removeEventListener('click', cancelHandler);
                resolve(true); // User confirmed
            };

            const cancelHandler = () => {
                messageBoxOverlay.style.display = 'none';
                messageBox.style.display = 'none';
                messageBoxConfirmBtn.removeEventListener('click', confirmHandler);
                messageBoxCancelBtn.removeEventListener('click', cancelHandler);
                resolve(false); // User cancelled
            };

            messageBoxConfirmBtn.addEventListener('click', confirmHandler);
            messageBoxCancelBtn.addEventListener('click', cancelHandler);
        });
    }

    async function fetchData(resource, id = '') {
        try {
            const response = await fetch(`${API_BASE_URL}?action=${resource}&id=${id}`);
            if (!response.ok) {
                // Attempt to parse error message from response body
                let errorDetails = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || errorDetails;
                } catch (jsonError) {
                    // If response is not JSON, use status text
                    errorDetails = response.statusText || errorDetails;
                }
                throw new Error(errorDetails);
            }
            const data = await response.json();

            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'API error');
            }
        } catch (error) {
            console.error(`Error fetching ${resource}:`, error);
            showMessageBox('Error', `Failed to load ${resource}: ${error.message}. Please ensure your PHP server is running and the main.php file is accessible at ${API_BASE_URL}.`);
            return []; // Return empty array on error for lists
        }
    }
    async function postData(resource, payload,id='') {
        try {
            const response = await fetch(`${API_BASE_URL}?action=${resource}&id=${id}`, {
                method: 'POST',
                body: payload,
            });
            /* const rawText = await response.text();
            let data;
            console.log('Raw response text:', rawText);
        try {
             data = JSON.parse(rawText);
         } catch (jsonError) {
           console.error('Raw response (not JSON):', rawText); 
            showMessageBox('Error', 'Server returned invalid JSON. Check the console for details.', true);
          return  data;
        }  */
            const data = await response.json();
            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            showMessageBox('Success', data.message || `${resource} added successfully!`);
            return data; // Returns { status: 'success', message: ..., id: ... }
        } catch (error) {
            console.error(`Error adding ${resource}:`, error);
            showMessageBox('Error', `Failed to add ${resource}: ${error.message}`);
            return { status: 'error', message: error.message };
        }
    }

    async function putData(resource, id, payload) {
        try {
            const response = await fetch(`${API_BASE_URL}?action=${resource}&id=${id}`, {
                method: 'POST',
                body: payload,
            });
            
            const data = await response.json();
            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            showMessageBox('Success', data.message || `${resource} updated successfully!`);
            return data;
            
        } catch (error) {
            console.error(`Error updating ${resource}:`, error);
            showMessageBox('Error', `Failed to update ${resource}: ${error.message}`);
            return { status: 'error', message: error.message };
        }
    }

    async function deleteData(resource, id) {
        const confirmed = await showMessageBox('Confirm Delete', `Are you sure you want to delete this ${resource} item?`, true);
        if (!confirmed) {
            return { status: 'cancelled', message: 'Deletion cancelled.' };
        }
        try {
            const response = await fetch(`${API_BASE_URL}?action=${resource}&id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            
            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            showMessageBox('Success', data.message || `${resource} deleted successfully!`);
            return data;
        } catch (error) {
            console.error(`Error deleting ${resource}:`, error);
            showMessageBox('Error', `Failed to delete ${resource}: ${error.message}`);
            return { status: 'error', message: error.message };
        }
    }

export {  deleteData, postData , putData, fetchData,showMessageBox};