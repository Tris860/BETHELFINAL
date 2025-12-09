const LoginForm = document.getElementById('adminLoginForm');
        // Define your API base URL.
        // IMPORTANT: Replace 'http://localhost/backend/api/Endpoint.php' with the actual URL to your Endpoint.php file.
const API_BASE_URL = 'http://localhost:3000/admin/backend/main.php';


document.addEventListener('DOMContentLoaded', function() {
            // Get elements for the login modal

            const adminLoginForm = document.getElementById('adminLoginForm');
            const modalEmailInput = document.getElementById('modalEmail');
            const modalPasswordInput = document.getElementById('modalPassword');


            // Event listener for the login form submission
            if (adminLoginForm) {
                adminLoginForm.addEventListener('submit', function(event) {
                    event.preventDefault(); // Prevent default form submission
                    handleSubmit('login', this, `${API_BASE_URL}`, 'Login successful', 'dashboard.html', () => this.reset());
                });
            }
        });
async function handleSubmit(action, form, url,successMessage, redirectUrl = null, successCallback = null) {
        try {
            const formData = new FormData(form);
            formData.append('login', action);
            const response = await fetch(`${API_BASE_URL}?action=login`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            if (data.success) {
                window.location.href = redirectUrl;
            } else {
               document.getElementById("error").innerText = data.message;
               console.error('Submission failed:', data.message);
               if (successCallback && typeof successCallback === 'function') {
                  successCallback(data); // Optional custom error handling
                  }
            }
        } catch (error) {
            console.error('Submission failed:', error);
            document.getElementById("error").style.display="block";
            document.getElementById("error").innerText =`${error.message}.`;; 
        }
    }

