<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Allow cross-origin requests (for development; restrict in production)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // IMPORTANT: Restrict this to your frontend's domain in production
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
function uploadImage($files) {
    if (!isset($files['featured_image']) || $files['featured_image']['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'No valid featured_image uploaded.'];
    }

    // Define upload folder and create if missing
    $uploadDir=__DIR__ . '/../../media/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Generate safe filename
    $filename = uniqid() . '_' . basename($files['featured_image']['name']);
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($files['featured_image']['tmp_name'], $targetPath)) {
        // Build relative URL for frontend use
        $relativePath = 'media/' . $filename;

        return [
            'success' => true,
            'image_url' => $relativePath // Works both locally and online
        ];
    } else {
        return [
            'success' => false,
            'message' => 'Upload failed. Could not move file.'
        ];
    }
}


// Handle preflight OPTIONS request (important for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


require_once 'manager.php'; // Make sure this path is correct

// Database connection details
$servername = "localhost";
$username = "root";
$password = "shimo@123flex"; // Your actual password
$dbname = "bethelfinal"; // Your actual database name

$conn = null; // Initialize connection variable
$response = ["success" => false, "message" => "An unknown error occurred."]; // Default error response

try {
    // Establish database connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        // This will be caught by the outer catch if TimetableManager constructor is called
        // but it's good to have a direct check for immediate connection failure
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Instantiate the TimetableManager
    $userManager=new User($conn);
    $actionManager=new Manager($conn);
    // Get the action from the query string
    $action = $_GET['action'] ?? '';
    $id = $_GET['id'] ?? ''; 
    $response = ["success" => false, "message" => "Unknown error occured "];
    
    // Handle different actions
    switch ($action) {
            case 'login':
               if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                  $email = $_POST['email'] ?? '';
                  $passkey = $_POST['password'] ?? '';
                  $response = $userManager->login($email, strval($passkey)); // This sets session variables on success
                  // After successful login, refresh the $loggedInUserEmail and $isLoggedIn variables
                  // $response = ["success" => false, "message" => "Unknown action: " .$username." ".$passkey];
                  $loggedInUserEmail = $_SESSION['email'] ?? null;
                  $isLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
                  $loggedInUserId = $_SESSION['user_id'] ?? null; // Refresh user ID
               } else {
                  http_response_code(405);
                   $response = ["success" => false, "message" => $action." Invalid request method for login. Use POST."];
                }
            break;
            case 'logout':
               if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                        $response = $userManager->logout();
                        
                         // This destroys session 
                    } else {
                        http_response_code(405);
                        $response = ["success" => false, "message" => "Invalid request method for logout. Use POST."];
                    }
            break;
            case 'CTA':
                if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                    $data =[];
                    $data["heading" ]=$_POST["heading"];
                    $data["caption"] =$_POST["caption"];
                    $data["page"] =$_POST["page"];
                    $response=$actionManager->updateCTA($data);
                }
                else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                    $key =$_GET['id'];
                    $response = ["success" => true,"message" =>"Successfully retrival", "data" => $actionManager->getCTA($key)];
                }
            break;
            case  'Scripture':
                if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                    $data =[];
                    $data["content" ]=$_POST["ScriptureMeaning"];
                    $data["title"] =$_POST["ScriptureTitle"];
                    $response=$actionManager->updateScripture($data);
                }
                else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                    $key =1;
                    $response = ["success" => true,"message" =>"Successfully retrival", "data" => $actionManager->getScripture($key)];
                }
            break;
            case 'PresidentWord':
                if($_SERVER["REQUEST_METHOD"] === "POST"){
                    $data=[];
                    $data["name"]=$_POST['presidentName'];
                    $data["message"]=$_POST['message'];
                    if( isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
                        // Handle image upload
                        $uploadResult = uploadImage($_FILES);
                        if (!$uploadResult['success']) {
                            http_response_code(400); // Bad Request
                            $response = $uploadResult; // Return the error message from uploadImage
                            break;
                         }
                        // Add the image URL to the form data
                        $data['featured_image_url']= $uploadResult['image_url'];
                    }
                    $response=$actionManager->updateWord($data);
                }
                if($_SERVER["REQUEST_METHOD"] === "GET"){
                     $key=1;
                     $response = ["success" => true,"message" =>"Successfully retrival", "data" => $actionManager->getWord($key)];
                }
            break;
            case 'song':
                if($_SERVER["REQUEST_METHOD"] === "GET"){
                    $id=$_GET["id"] ?? null;
                    if($id){
                        $response = ["success" => true, "message" => "Successfully" ,"data" => $actionManager->getSong($id)];
                    }else{
                        $response = ["success" => true, "message" => "Successfully" ,"data" => $actionManager->getSong()];
                    }
                }
                else if($_SERVER["REQUEST_METHOD"] === "POST" && $id == ''){
                    $data =[];
                    $data['title']=$_POST['title'];
                    $data['link']=$_POST['link'];
                    $response = $actionManager->addSong($data);
                }
                else if($_SERVER["REQUEST_METHOD"] === "POST" && $id !== ''){
                    $data =[];
                    $data['title']=$_POST['title'];
                    $data['link']=$_POST['link'];
                    $response = $actionManager->updateSong($id ,$data);
                }
                elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
                    // Handle DELETE request for deleting an event
                    $response = $actionManager->deleteSong(intval($_GET['id']));
                }
            break;
            case 'picture':
                if($_SERVER["REQUEST_METHOD"] === "GET"){
                    $id=$_GET["id"] ?? null;
                    if($id){
                        $response = ["success" => true, "message" => "Successfully" ,"data" => $actionManager->getPicture($id)];
                    }else{
                        $response = ["success" => true, "message" => "Successfully" ,"data" => $actionManager->getPicture()];
                    }
                }
                else if($_SERVER["REQUEST_METHOD"] === "POST"){
                    $data =[];
                    $data['caption']=$_POST['caption'];
                    $data['url']=$_POST['url'];
                    $file_uploaded = isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK;
                                     ljikjio             
                    
                }
                elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
                    // Handle DELETE request for deleting an event
                    $response = $actionManager->deletePicture(intval($_GET['id']));
                }
            break;
            default:
                http_response_code(400); // Bad Request
                $response = ["success" => false, "message" => "Unknown action: " . ($action === '' ? '[empty]' : $action)];
                break;
        }

} catch (InvalidArgumentException $e) {
    http_response_code(400); // Bad Request for client input errors
    $response = ["success" => false, "message" => $e->getMessage()];
} catch (mysqli_sql_exception $e) {
    http_response_code(500); // Internal Server Error for database issues
    // Log the full error message for debugging, but send a generic one to client
    error_log("Database Error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    $response = ["success" => false, "message" => "A database error occurred. Please try again later.".$e->getMessage()];
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error for any other unexpected errors
    error_log("General Error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    $response = ["success" => false, "message" => "An unexpected ". $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine()];
} finally {
    // Ensure the database connection is closed
    if ($conn) {
        $conn->close();
    }
}

echo json_encode($response);

?>