<?php

use function PHPSTORM_META\type;

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

function hasUploadedFile(string $key): bool {
    return isset($_FILES[$key])
        && !empty($_FILES[$key]['name'])
        && $_FILES[$key]['error'] === UPLOAD_ERR_OK
        && !empty($_FILES[$key]['tmp_name'])
        && is_uploaded_file($_FILES[$key]['tmp_name'])
        && ($_FILES[$key]['size'] ?? 0) > 0;
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
$password = ""; // Your actual password
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
                    $response = ["success" => false, "message" => "Successfully ".$data['caption']." ".$data['url']." ".$file_uploaded];
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
                    // $response = ["success" => false, "message" => "Successfully ".$data['caption']." ".$data['url']." ".$file_uploaded." "];
                    if(isset($_POST['pictureId']) && !empty($_POST['pictureId'])) {
                        // Update existing picture
                        $pictureId = intval($_POST['pictureId']);
                        $response = $actionManager->updatePicture($pictureId, $data);
                    } else {
                        // Add new picture
                        $response = $actionManager->addPicture($data);
                    }
                    
                }
                elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
                    // Handle DELETE request for deleting an event
                    $response = $actionManager->deletePicture(intval($_GET['id']));
                }
            break;
            case 'Slideshow':
                if($_SERVER["REQUEST_METHOD"] === "GET") {
                    //$response = ["success" => true, "message" => "Successfully retrieved", "data" => $actionManager->getSlideshowImages()];
                } 
                else if($_SERVER["REQUEST_METHOD"] === "POST") {
                    $id=$_POST["imageId"] ?? null;
                    $status=$_POST["status"] ?? null;
                    if($status == "false")
                       $status = 0;
                    else
                       $status =1;
                    //$response = ["success" => false, "message" => "Successfully retrieved"." ".gettype($id)." ".gettype($status)];
                    $response = $actionManager->updateSlideshowImage($id, $status);
                }
            break;
            case 'Committee':
               if ($_SERVER["REQUEST_METHOD"] === "GET") {
                //  $response = ["success" => true, "message" => "Successfully retrieved", "data" => ["shimo" => $actionManager->getCommittEra()]];

                  // Example retrieval
                  if(isset($_GET['id']) && !empty($_GET['id'])){
                    $committeeId = intval($_GET['id']);
                    $response = ["success" => true, "message" => "Successfully retrieved", "data" => $actionManager->getCommittee($committeeId)];
                
                  }else{
                    $response = ["success" => true, "message" => "Successfully retrieved", "data" => $actionManager->getCommittEra()];
                   
                  }
                
                 } 
                else if ($_SERVER["REQUEST_METHOD"] === "POST") {
                  $data = [];

                  // Build members array from names[] and posts[]
                  $members = [];
                  if (isset($_POST['names']) && isset($_POST['posts'])) {
                      $names = $_POST['names'];
                      $posts = $_POST['posts'];

                      for ($i = 0; $i < count($names); $i++) {
                          $members[] = [
                             "name" => $names[$i],
                             "post" => $posts[$i]
                          ];
                        }
                     }
                   $data['members'] = $members;

                   // Other fields
                  $data['ecree'] = $_POST['ecree'] ?? '';
                  $data['period'] = $_POST['period'] ?? '';
                  $data['url'] = $_POST['url'] ?? '';

                  // Handle image upload
                 if (hasUploadedFile('featured_image')) {
                     $uploadResult = uploadImage($_FILES);
                     if (!$uploadResult['success']) {
                         http_response_code(400); // Bad Request
                         $response = $uploadResult; // Return the error message from uploadImage
                        break;
                     }
                   $data['picture_url'] = $uploadResult['image_url'];
                 }
                if (isset($_POST['commit_id']) && !empty($_POST['commit_id'])) {
                    // Update existing committee
                    $committeeId = intval($_POST['commit_id']);
                    $response = $actionManager->updateCommittee($committeeId, $data);
                } else {
                 // Save/update committee
                $response = $actionManager->addCommittee($data);
                }
               }
              else if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
                // Handle DELETE request for deleting a committee
                $response = $actionManager->deleteCommittee(intval($_GET['id']));
              }
            break;
            case 'AnnualAchievement':
                 if ($_SERVER["REQUEST_METHOD"] === "GET") {
                    // Example retrieval
                    if(isset($_GET['id']) && !empty($_GET['id'])){
                      $yearId = intval($_GET['id']);
                      $response =  $actionManager->getAnnualAchievements($yearId);
                  
                    }else{
                      $response =  $actionManager->getAnnualAchievements();
                    }
                   } 
                  else if ($_SERVER["REQUEST_METHOD"] === "POST") {
                    $data = [];
                    $data['year'] = $_POST['year'] ?? '';
                    $data['context'] = $_POST['yearContext'] ?? '';

                    if (isset($_POST['yearId']) && !empty($_POST['yearId'])) {
                        // Update existing achievement
                        $data["yearId"] = intval($_POST['yearId']);
                        //$response =["success" => false, "message" => "Update Annual Achievement ".$data["yearId"]." ".$data['year']." ".$data['context']];
                        $response = $actionManager->updateAnnualAchievement($data);
                    } else {
                       $response = $actionManager->addAnnualAchievement($data);
                    }
                   }
                  else if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
                    // Handle DELETE request for deleting an achievement
                    $response = $actionManager->deleteAnnualAchievement(intval($_GET['id']));
                  }
            break;
            case 'flyer':
            
               if($_SERVER["REQUEST_METHOD"] === "POST"){
                $data =[];
                $data["status"]=intval($_POST["status"]) ?? "";
                    if(hasUploadedFile('featured_image')) {
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
                    $response=$actionManager->updateFlyer($data);
                   // $response =["success" => false ,"message" => " ".$data["status"]." ".gettype(($data["status"]))];
                }
                elseif($_SERVER["REQUEST_METHOD"] === "GET"){
                    $response =["success"=>true , "data" => $actionManager->getFlyer()];
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