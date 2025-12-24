<?php

class User {
    private $conn;

    /**
     * Constructor for the User class.
     *
     * @param mysqli $conn The database connection object.
     */
    public function __construct(mysqli $conn) {
        $this->conn = $conn;
    }

    /**
     * Registers a new user.
     *
     * @param string $email The user's email.
     * @param string $passkey The user's password (will be hashed).
     * @return array Success status and message.
     */
    public function register(string $email, string $passkey): array {
        if (empty($email) || empty($passkey)) {
            return ["success" => false, "message" => "Email and password cannot be empty."];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ["success" => false, "message" => "Invalid email format."];
        }

        // Check if email already exists
        $stmt = $this->conn->prepare("SELECT id_users FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $stmt->close();
            return ["success" => false, "message" => "Email already registered."];
        }
        $stmt->close();

        $hashedPasskey = password_hash($passkey, PASSWORD_DEFAULT);

        // Insert new user with default settings for timetable_enabled and hard_switch_enabled
        $stmt = $this->conn->prepare("INSERT INTO users (email, passkey, timetable_enabled, hard_switch_enabled) VALUES (?, ?, 1, 1)");
        $stmt->bind_param("ss", $email, $hashedPasskey);

        if ($stmt->execute()) {
            $stmt->close();
            return ["success" => true, "message" => "Registration successful!"];
        } else {
            error_log("User registration error: " . $stmt->error);
            $stmt->close();
            return ["success" => false, "message" => "Registration failed. Please try again."];
        }
    }

    /**
     * Logs in a user.
     *
     * @param string $email The user's email.
     * @param string $passkey The user's password.
     * @return array Success status and message. Sets session variables on success.
     */
    public function login(string $email, string $passkey): array {
        if (empty($email) || empty($passkey)) {
            return ["success" => false, "message" => "Email and password cannot be empty."];
        }

        $stmt = $this->conn->prepare("SELECT id, email, passkey FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if (password_verify($passkey, $user['passkey'])) {
                // Set session variables
                $_SESSION['logged_in'] = true;
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['email'] = $user['email'];
            
                $stmt->close();
                return ["success" => true, "message" => "Login successful!"];
            } else {
                $stmt->close();
                return ["success" => false, "message" => "Invalid email or password."];
            }
        } else {
            $stmt->close();
            return ["success" => false, "message" => "Invalid email or password."];
        }
    }

    /**
     * Logs out the current user.
     *
     * @return array Success status and message. Destroys session.
     */
    public function logout(): array {
        // Unset all session variables
        $_SESSION = [];

        // Destroy the session
        session_destroy();

        // Also clear the session cookie
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        return ["success" => true, "message" => "Logged out successfully."];
    }

    /**
     * Changes the user's password.
     *
     * @param int $userId The ID of the user.
     * @param string $currentPassword The current password.
     * @param string $newPassword The new password.
     * @return array Success status and message.
     */
    public function changePassword(int $userId, string $currentPassword, string $newPassword): array {
        if (empty($currentPassword) || empty($newPassword)) {
            return ["success" => false, "message" => "Current and new passwords cannot be empty."];
        }
        if (strlen($newPassword) < 8) {
            return ["success" => false, "message" => "New password must be at least 8 characters long."];
        }

        $stmt = $this->conn->prepare("SELECT passkey FROM users WHERE id_users = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if (password_verify($currentPassword, $user['passkey'])) {
                $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                $updateStmt = $this->conn->prepare("UPDATE users SET passkey = ? WHERE id_users = ?");
                $updateStmt->bind_param("si", $hashedNewPassword, $userId);
                if ($updateStmt->execute()) {
                    $updateStmt->close();
                    return ["success" => true, "message" => "Password changed successfully."];
                } else {
                    error_log("Password update error: " . $updateStmt->error);
                    $updateStmt->close();
                    return ["success" => false, "message" => "Failed to change password."];
                }
            } else {
                $stmt->close();
                return ["success" => false, "message" => "Incorrect current password."];
            }
        } else {
            $stmt->close();
            return ["success" => false, "message" => "User not found."];
        }
    }

    /**
     * Changes the user's email.
     *
     * @param int $userId The ID of the user.
     * @param string $currentPassword The user's current password for verification.
     * @param string $newEmail The new email address.
     * @return array Success status and message.
     */
    public function changeEmail(int $userId, string $currentPassword, string $newEmail): array {
        if (empty($currentPassword) || empty($newEmail)) {
            return ["success" => false, "message" => "Current password and new email cannot be empty."];
        }
        if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
            return ["success" => false, "message" => "Invalid new email format."];
        }

        // Verify current password and fetch existing email
        $stmt = $this->conn->prepare("SELECT passkey, email FROM users WHERE id_users = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if (password_verify($currentPassword, $user['passkey'])) {
                if ($user['email'] === $newEmail) {
                    $stmt->close();
                    return ["success" => false, "message" => "New email is the same as the current email."];
                }

                // Check if new email already exists for another user
                $checkEmailStmt = $this->conn->prepare("SELECT id_users FROM users WHERE email = ? AND id_users != ?");
                $checkEmailStmt->bind_param("si", $newEmail, $userId);
                $checkEmailStmt->execute();
                $checkEmailStmt->store_result();
                if ($checkEmailStmt->num_rows > 0) {
                    $checkEmailStmt->close();
                    $stmt->close();
                    return ["success" => false, "message" => "This email is already in use by another account."];
                }
                $checkEmailStmt->close();

                // Update email
                $updateStmt = $this->conn->prepare("UPDATE users SET email = ? WHERE id_users = ?");
                $updateStmt->bind_param("si", $newEmail, $userId);
                if ($updateStmt->execute()) {
                    // Update session email if successful
                    $_SESSION['email'] = $newEmail;
                    $updateStmt->close();
                    $stmt->close();
                    return ["success" => true, "message" => "Email changed successfully."];
                } else {
                    error_log("Email update error: " . $updateStmt->error);
                    $updateStmt->close();
                    $stmt->close();
                    return ["success" => false, "message" => "Failed to change email."];
                }
            } else {
                $stmt->close();
                return ["success" => false, "message" => "Incorrect current password."];
            }
        } else {
            $stmt->close();
            return ["success" => false, "message" => "User not found."];
        }
    }

    
   
}



// Ensure that the DateTime class is available for time validation.
// No other specific 'use' statements are needed for this class with standard PHP functions.

class Manager {
    private $conn; // Stores the mysqli connection object

    /**
     * Constructor for Manager.
     * Initializes the database connection and sets character set.
     *
     * @param mysqli $conn The mysqli database connection object.
     * @throws Exception If the database connection is not valid or charset cannot be set.
     */
    public function __construct(mysqli $conn) {
        if ($conn->connect_error) {
            throw new Exception("Database connection failed: " . $conn->connect_error);
        }
        $this->conn = $conn;
        // Set charset for the connection to prevent encoding issues
        if (!$this->conn->set_charset("utf8mb4")) {
            throw new Exception("Error loading character set utf8mb4: " . $this->conn->error);
        }
    }
    private function refValues(array $arr) {
        $refs = [];
        foreach ($arr as $key => $value) {
            $refs[$key] = &$arr[$key]; // Create a reference to each value
        }
        return $refs;
    }

    /**
     * Fetches all periods, optionally filtered by day.
     *
     * @param string|null $dayOfWeek Optional. The day of the week to filter by (e.g., 'Monday').
     * @return array An array of period data.
     * @throws mysqli_sql_exception If a database error occurs during statement preparation or execution.
     */
    public function getCTA(string $key): ?array {
        $sql = "SELECT * FROM cta WHERE page = ?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            throw new mysqli_sql_exception("Failed to prepare statement for fetching single period: " . $this->conn->error);
        }
        $stmt->bind_param("s", $key);
        if (!$stmt->execute()) {
            throw new mysqli_sql_exception("Failed to execute statement for fetching single period: " . $stmt->error);
        }
        $result = $stmt->get_result();
        $cta = $result->fetch_assoc(); // Fetch a single row

        $stmt->close();
        return $cta;
    }
    public function updateCTA(array $data){
        try {
            $update_query = "UPDATE cta SET heading = ? ,caption = ?  WHERE page = ?";
            $stmt = $this->conn->prepare($update_query);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }

            $stmt->bind_param("sss", $data['heading'], $data['caption'],$data['page']);
            $stmt->execute();

            if ($stmt->affected_rows === 1) {
                return ['success' => true, 'message' => 'CTA for '.$data['page'].' updated successfully.'];
            } else {
                // This might happen if the user doesn't exist or no change was made
                return ['success' => false, 'message' => 'Failed to update CTA for '.$data['page']];
            }
        } catch (Exception $e) {
            error_log("Update CTA error for  {$data['page']}: " . $e->getMessage());
            return ['success' => false, 'message' => 'An error occurred while updating CTA for '.$data['page']];
        }
    }


    public function getScripture(int $id): ?array {
        $sql = "SELECT * FROM scriptureofday WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            throw new mysqli_sql_exception("Failed to prepare statement for fetching the scripture od the day: " . $this->conn->error);
        }
        $stmt->bind_param("i", $id);
        if (!$stmt->execute()) {
            throw new mysqli_sql_exception("Failed to execute statement for fetching the scripture od the day: " . $stmt->error);
        }
        $result = $stmt->get_result();
        $scripture = $result->fetch_assoc(); // Fetch a single row

        $stmt->close();
        return $scripture;
    }
    public function updateScripture(array $data){
        try {
            $update_query = "UPDATE scriptureofday SET title = ? ,content = ?  WHERE id = 1";
            $stmt = $this->conn->prepare($update_query);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }

            $stmt->bind_param("ss", $data['title'], $data['content']);
            $stmt->execute();

            if ($stmt->affected_rows === 1) {
                return ['success' => true, 'message' => 'Scripture of the day updated successfully.'];
            } else {
                // This might happen if the user doesn't exist or no change was made
                return ['success' => false, 'message' => 'Failed to update the scripture of the day'];
            }
        } catch (Exception $e) {
            error_log("Update CTA error for  {$data['page']}: " . $e->getMessage());
            return ['success' => false, 'message' => 'An error occurred while updating the scripture of the day'];
        }
    }

    public function getWord(int $id): ?array {
        $sql = "SELECT * FROM presidentsword WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            throw new mysqli_sql_exception("Failed to prepare statement for fetching the president's word: " . $this->conn->error);
        }
        $stmt->bind_param("i", $id);
        if (!$stmt->execute()) {
            throw new mysqli_sql_exception("Failed to execute statement for fetching the president's word: " . $stmt->error);
        }
        $result = $stmt->get_result();
        $presidentword = $result->fetch_assoc(); // Fetch a single row

        $stmt->close();
        return $presidentword;
    }
    public function updateWord(array $data){
        try {
            if( $data['featured_image_url']){
              $update_query = "UPDATE presidentsword SET name = ? ,message = ?,image = ?  WHERE id = 1";
              $stmt = $this->conn->prepare($update_query);
              if (!$stmt) {
                  throw new Exception("Prepare failed: " . $this->conn->error);
               }
               $stmt->bind_param("sss", $data['name'], $data['message'], $data['featured_image_url']);
               $stmt->execute();
               if ($stmt->affected_rows === 1) {
                    return ['success' => true, 'message' => 'word from the President updated successfully.'];
                } else {
                   // This might happen if the user doesn't exist or no change was made
                  return ['success' => false, 'message' => $data['message'].'Failed to update the word from the President'];
                }
            }
            else{
                $update_query = "UPDATE presidentsword SET name = ? ,message = ?  WHERE id = 1";
                $stmt = $this->conn->prepare($update_query);
                if (!$stmt) {
                    throw new Exception("Prepare failed: " . $this->conn->error);
                 }
                $stmt->bind_param("ss", $data['name'], $data['message']);
                $stmt->execute();

                if ($stmt->affected_rows === 1) {
                    return ['success' => true, 'message' => 'word from the President updated successfully.'];
                } else {
                   // This might happen if the user doesn't exist or no change was made
                  return ['success' => false, 'message' => '2 Failed to update the word from the President'];
                }
            }
            
            
        } catch (Exception $e) {
            error_log("Update  error : " . $e->getMessage());
            return ['success' => false, 'message' => 'An error occurred while updating the word from the President'];
        }
    }
    public function getSong(int $id = null): ?array {
        if($id){
            $sql = "SELECT * FROM songs WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                throw new mysqli_sql_exception("Failed to prepare statement for fetching song: " . $this->conn->error);
            }
            $stmt->bind_param("i", $id);
            if (!$stmt->execute()) {
                throw new mysqli_sql_exception("Failed to execute statement for fetching song: " . $stmt->error);
            }
            $result = $stmt->get_result();
            $song = $result->fetch_assoc(); // Fetch a single row

            $stmt->close();
            return $song;
        }
        else{
            $sql = "SELECT * FROM songs";
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                throw new mysqli_sql_exception("Failed to prepare statement for fetching songs: " . $this->conn->error);
            }
            if (!$stmt->execute()) {
                throw new mysqli_sql_exception("Failed to execute statement for fetching songs: " . $stmt->error);
            }
            $result = $stmt->get_result();
            $songs =[];
            while ($row = $result->fetch_assoc()) {
                $songs[] = $row;
            }
            $result->free();
            $stmt->close();
            return $songs;
        }
    }
    

    public function addSong(array $data) {
        $stmt = $this->conn->prepare("INSERT INTO songs (title,link) VALUES (?, ?)");
        $stmt->bind_param("ss", $data['title'], $data['link']);

        if ($stmt->execute()) {
            $lastInsertId = $this->conn->insert_id;
            $stmt->close();
             $response = ["success" => true, "message" => "New song added successfully!", "id" => $lastInsertId];
            return $response;
        } else {
            error_log("Failed to add new song: " . $stmt->error);
            $stmt->close();
            $response = ["success" => false, "message" =>"Failed to add new song: " . $stmt->error];
            return $response;
        }
    }
    public function updateSong(int $id, array $data) {
        $stmt = $this->conn->prepare("UPDATE songs SET title = ?, link = ? WHERE id = ?");
        $stmt->bind_param("ssi", $data['title'], $data['link'], $id);
        if ($stmt->execute()) {
            $rowsAffected = $stmt->affected_rows;
            $stmt->close();
            $response = ["success" => true, "message" => "Song updated successfully!", "id" => $rowsAffected];
            return $response;
        } else {
            error_log("Failed to update Song: " . $stmt->error);
            $stmt->close();
            $response = ["success" => false, "message" => "Failed to update Song "];
            return $response;
        }
    }

    /**
     * Deletes a news article.
     * @param int $id The ID of the news article to delete.
     * @return int The number of affected rows (1 for success, 0 for not found).
     */
    public function deleteSong(int $id) {
        $stmt = $this->conn->prepare("DELETE FROM songs WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            $rowsAffected = $stmt->affected_rows;
            $stmt->close();
            $response = ["success" => true, "data" => $rowsAffected ?? "No song found."];
            return $response ;
        } else {
            error_log("Failed to delete song: " . $stmt->error);
            $stmt->close();
            $response = ["success" => false, "message" => "Failed to delete song."];
            return $response;
        }
    }
    
    public function getPicture(int $id = null): ?array {
        if($id){
            $sql = "SELECT * FROM pictures WHERE id = ? ";
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                throw new mysqli_sql_exception("Failed to prepare statement for fetching picture: " . $this->conn->error);
            }
            $stmt->bind_param("i", $id);
            if (!$stmt->execute()) {
                throw new mysqli_sql_exception("Failed to execute statement for fetching picture: " . $stmt->error);
            }
            $result = $stmt->get_result();
            $picture = $result->fetch_assoc(); // Fetch a single row

            $stmt->close();
            return $picture;
        }
        else{
            $sql = "SELECT * FROM pictures ORDER BY id DESC";
            $stmt = $this->conn->prepare($sql);
            if ($stmt === false) {
                throw new mysqli_sql_exception("Failed to prepare statement for fetching pictures: " . $this->conn->error);
            }
            if (!$stmt->execute()) {
                throw new mysqli_sql_exception("Failed to execute statement for fetching pictures: " . $stmt->error);
            }
            $result = $stmt->get_result();
            $pictures =[];
            while ($row = $result->fetch_assoc()) {
                $pictures[] = $row;
            }
            $result->free();
            $stmt->close();
            return $pictures;
        }
    }
    public function addPicture(array $data) {
        $stmt = $this->conn->prepare("INSERT INTO pictures (caption,link) VALUES (?, ?)");
        $stmt->bind_param("ss", $data['caption'], $data['featured_image_url']);

        if ($stmt->execute()) {
            $lastInsertId = $this->conn->insert_id;
            $stmt->close();
             $response = ["success" => true, "message" => "New picture added successfully!", "id" => $lastInsertId];
            return $response;
        } else {
            error_log("Failed to add new picture: " . $stmt->error);
            $stmt->close();
            $response = ["success" => false, "message" =>"Failed to add new picture: " . $stmt->error];
            return $response;
        }
    }
    public function updatePicture(int $id, array $data) {
        if(!isset($data['featured_image_url'])){
            $data['featured_image_url']=$data['url'];
        }
        $stmt = $this->conn->prepare("UPDATE pictures SET caption = ?, link = ? WHERE id = ?");
        $stmt->bind_param("ssi", $data['caption'], $data['featured_image_url'], $id);
        if ($stmt->execute()) {
            $rowsAffected = $stmt->affected_rows;
            $stmt->close();
            $response = ["success" => true, "message" => $data['featured_image_url']."Picture updated successfully!", "id" => $rowsAffected];
            return $response;
        } else {
            error_log("Failed to update Picture: " . $stmt->error);
            $stmt->close();
            $response = ["success" => false, "message" => "Failed to update Picture "];
            return $response;
        }
    }

    /**
     * Deletes a news article.
     * @param int $id The ID of the picture to delete.
     * @return int The number of affected rows (1 for success, 0 for not found).
     */
    public function deletePicture(int $id) {
        $stmt = $this->conn->prepare("DELETE FROM pictures WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            $rowsAffected = $stmt->affected_rows;
            $stmt->close();
            $response = ["success" => true, "data" => $rowsAffected ?? "No pictures found."];
            return $response ;
        } else {
            error_log("Failed to delete song: " . $stmt->error);
            $stmt->close();
            $response = ["success" => false, "message" => "Failed to delete the picture."];
            return $response;
        }
    }

    
    public function updateSlideshowImage(int $id, int $status) {
    // Convert boolean to integer (true → 1, false → 0)
    $slideshowValue = $status ;

    // Prepare query
    $update_query = "UPDATE pictures SET slideshow = ? WHERE id = ?";
    $stmt = $this->conn->prepare($update_query);

    if (!$stmt) {
        return [
            "success" => false,
            "message" => "Failed to prepare statement: " . $this->conn->error
        ];
    }

    $stmt->bind_param("ii", $slideshowValue, $id);

    if (!$stmt->execute()) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "Query execution failed: " . $stmt->error
        ];
    }

    // Check if any row was actually updated
    if ($stmt->affected_rows === 0) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "No rows updated. Possibly invalid ID."
        ];
    }

    $stmt->close();

    return [
        "success" => true,
        "message" => "Slideshow image status updated successfully."
    ];
}


    public function addCommittee(array $data) {
       $this->conn->begin_transaction();

        try {
          // Step 1: Insert into bethelcommitte
           $stmt = $this->conn->prepare("INSERT INTO bethelcommitte (era, ecree, picture) VALUES (?, ?, ?)");
           $stmt->bind_param("sss", $data['period'], $data['ecree'], $data['picture_url']);
           if (!$stmt->execute()) {
              throw new Exception("Failed to add committee: " . $stmt->error);
           }
           $commit_id = $this->conn->insert_id;
           $stmt->close();
 
           // Step 2: Insert members
           $memberStmt = $this->conn->prepare("INSERT INTO bethelcommittemember (commit_id, names, post) VALUES (?, ?, ?)");
           foreach ($data['members'] as $member) {
               $memberStmt->bind_param("iss", $commit_id, $member['name'], $member['post']);
               if (!$memberStmt->execute()) {
                  throw new Exception("Failed to add member: " . $memberStmt->error);
                }
            }
           $memberStmt->close();

           // All good — commit
           $this->conn->commit();
           return [
              "success" => true,
              "message" => "Committee and members added successfully!",
              "commit_id" => $commit_id
            ];
        } catch (Exception $e) {
           // Something went wrong — rollback
           $this->conn->rollback();
           error_log($e->getMessage());
           return [
              "success" => false,
              "message" => $e->getMessage()
            ];
        }
    }
    public function getAllCommittees(): array {
    $committees = [];

    // Step 1: Fetch all committees
    $sql = "SELECT * FROM bethelcommitte ORDER BY era DESC";
    $stmt = $this->conn->prepare($sql);
    if ($stmt === false) {
        throw new mysqli_sql_exception("Failed to prepare statement for fetching committees: " . $this->conn->error);
    }
    if (!$stmt->execute()) {
        throw new mysqli_sql_exception("Failed to execute statement for fetching committees: " . $stmt->error);
    }
    $result = $stmt->get_result();
    $allCommittees = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // Step 2: For each committee, fetch its members
    foreach ($allCommittees as $committee) {
        $commitId = $committee['commit_id'];

        $sqlMembers = "SELECT * FROM bethelcommittemember WHERE commit_id = ?";
        $stmtMembers = $this->conn->prepare($sqlMembers);
        if ($stmtMembers === false) {
            throw new mysqli_sql_exception("Failed to prepare statement for fetching members: " . $this->conn->error);
        }
        $stmtMembers->bind_param("i", $commitId);
        if (!$stmtMembers->execute()) {
            throw new mysqli_sql_exception("Failed to execute statement for fetching members: " . $stmtMembers->error);
        }
        $resultMembers = $stmtMembers->get_result();
        $members = [];
        while ($row = $resultMembers->fetch_assoc()) {
            $members[] = $row;
        }
        $stmtMembers->close();

        // Step 3: Attach members to committee
        $committee['members'] = $members;

        $committees[] = $committee;
    }

    return $committees;
}

    
    public function getCommittee(string $id): ?array {
      // Step 1: Fetch committee details
      $committee=[];
      $sql = "SELECT * FROM bethelcommitte WHERE era = ?";
      $stmt = $this->conn->prepare($sql);
      if ($stmt === false) {
          throw new mysqli_sql_exception("Failed to prepare statement for fetching committee: " . $this->conn->error);
      }
      $stmt->bind_param("s", $id);
      if (!$stmt->execute()) {
          throw new mysqli_sql_exception("Failed to execute statement for fetching committee: " . $stmt->error);
       }
      $result = $stmt->get_result();
      $committee = $result->fetch_assoc();
      $stmt->close();
      
      if (!$committee) {
          return null; // No committee found
      }
      $id = $committee['commit_id'];
      
      // Step 2: Fetch members linked to this committee
      $sqlMembers = "SELECT * FROM bethelcommittemember WHERE commit_id = ?";
      $stmtMembers = $this->conn->prepare($sqlMembers);
      if ($stmtMembers === false) {
          throw new mysqli_sql_exception("Failed to prepare statement for fetching members: " . $this->conn->error);
      }
      $stmtMembers->bind_param("i", $id);
      if (!$stmtMembers->execute()) {
          throw new mysqli_sql_exception("Failed to execute statement for fetching members: " . $stmtMembers->error);
      }
      $resultMembers = $stmtMembers->get_result();
      $members = [];
      while ($row = $resultMembers->fetch_assoc()) {
          $members[] = $row;
      }
      $stmtMembers->close();

      // Step 3: Combine committee + members
      $committee['members'] = $members;

      return $committee;
   }
   public function getCommittEra(){
        $sql = "SELECT DISTINCT * FROM bethelcommitte ORDER BY era DESC";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            throw new mysqli_sql_exception("Failed to prepare statement for fetching committee eras: " . $this->conn->error);
        }
        if (!$stmt->execute()) {
            throw new mysqli_sql_exception("Failed to execute statement for fetching committee eras: " . $stmt->error);
        }
        $result = $stmt->get_result();
        $eras =[];
        while ($row = $result->fetch_assoc()) {
            $eras[] = $row;
        }
        $result->free();
        $stmt->close();
        return $eras;
   }
   public function deleteCommittee(int $id) {
      $this->conn->begin_transaction();

      try {
          // Step 1: Delete members
          $stmtMembers = $this->conn->prepare("DELETE FROM bethelcommittemember WHERE commit_id = ?");
          $stmtMembers->bind_param("i", $id);
          if (!$stmtMembers->execute()) {
              throw new Exception("Failed to delete members: " . $stmtMembers->error);
          }
          $stmtMembers->close();

          // Step 2: Delete committee
          $stmtCommittee = $this->conn->prepare("DELETE FROM bethelcommitte WHERE commit_id = ?");
          $stmtCommittee->bind_param("i", $id);
          if (!$stmtCommittee->execute()) {
              throw new Exception("Failed to delete committee: " . $stmtCommittee->error);
          }
          $stmtCommittee->close();

          // All good — commit
          $this->conn->commit();
          return [
              "success" => true,
              "message" => "Committee and its members deleted successfully!"
          ];
      } catch (Exception $e) {
          // Something went wrong — rollback
          $this->conn->rollback();
          error_log($e->getMessage());
          return [
              "success" => false,
              "message" => $e->getMessage()
          ];
      } 
    }

    public function updateCommittee(int $id, array $data) {
        if(isset($data['picture_url'])==false){
            $data['picture_url']=$data['url'];
        }
    try {
        $this->conn->begin_transaction();

        // Step 1: Update committee details
        $update_query = "UPDATE bethelcommitte SET era = ?, ecree = ?, picture = ? WHERE commit_id = ?";
        $stmt = $this->conn->prepare($update_query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $this->conn->error);
        }
        $stmt->bind_param("sssi", $data['period'], $data['ecree'], $data['picture_url'], $id);
        if (!$stmt->execute()) {
            throw new Exception("Committee update failed: " . $stmt->error);
        }
        $stmt->close();

        // Step 2: Delete existing members
        $delete_query = "DELETE FROM bethelcommittemember WHERE commit_id = ?";
        $deleteStmt = $this->conn->prepare($delete_query);
        if (!$deleteStmt) {
            throw new Exception("Prepare failed for member deletion: " . $this->conn->error);
        }
        $deleteStmt->bind_param("i", $id);
        if (!$deleteStmt->execute()) {
            throw new Exception("Member deletion failed: " . $deleteStmt->error);
        }
        $deleteStmt->close();

        // Step 3: Insert new members
        $insert_query = "INSERT INTO bethelcommittemember (commit_id, names, post) VALUES (?, ?, ?)";
        $insertStmt = $this->conn->prepare($insert_query);
        if (!$insertStmt) {
            throw new Exception("Prepare failed for member insertion: " . $this->conn->error);
        }

        foreach ($data['members'] as $member) {
            $insertStmt->bind_param("iss", $id, $member['name'], $member['post']);
            if (!$insertStmt->execute()) {
                throw new Exception("Member insert failed: " . $insertStmt->error);
            }
        }
        $insertStmt->close();

        $this->conn->commit();
        return ['success' => true, 'message' => 'Committee and members updated successfully.'];
    } catch (Exception $e) {
        $this->conn->rollback();
        error_log("Update Committee error for {$id}: " . $e->getMessage());
        return ['success' => false, 'message' => $e->getMessage()." **** ".'An error occurred while updating the committee and its members'];
    }
}
  public function getAnnualAchievements(int $id = null): ?array {
    if ($id === null) {
        // Fetch all achievements
        $sql = "SELECT * FROM annualachievements ORDER BY year ASC";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            return [
                "success" => false,
                "message" => "Failed to prepare statement: " . $this->conn->error,
                "data"    => null
            ];
        }

        if (!$stmt->execute()) {
            $stmt->close();
            return [
                "success" => false,
                "message" => "Query execution failed: " . $stmt->error,
                "data"    => null
            ];
        }

        $result = $stmt->get_result();
        $achievements = $result->fetch_all(MYSQLI_ASSOC);

        $stmt->close();

        if (empty($achievements)) {
            return [
                "success" => false,
                "message" => "No achievements found.",
                "data"    => null
            ];
        }

        return [
            "success" => true,
            "message" => "Achievements retrieved successfully.",
            "data"    => $achievements
        ];
    } else {
        // Fetch single achievement by ID
        $sql = "SELECT * FROM annualachievements WHERE id = ?";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            return [
                "success" => false,
                "message" => "Failed to prepare statement: " . $this->conn->error,
                "data"    => null
            ];
        }

        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            $stmt->close();
            return [
                "success" => false,
                "message" => "Query execution failed: " . $stmt->error,
                "data"    => null
            ];
        }

        $result = $stmt->get_result();
        $achievement = $result->fetch_assoc();

        $stmt->close();

        if (!$achievement) {
            return [
                "success" => false,
                "message" => "No achievement found for ID: $id",
                "data"    => null
            ];
        }

        return [
            "success" => true,
            "message" => "Achievement retrieved successfully.",
            "data"    => $achievement
        ];
    }
}
public function addAnnualAchievement(array $data): array {
    // Validate required fields
    if (!isset($data['year']) || !isset($data['context'])) {
        return [
            "success" => false,
            "message" => "Missing required fields: year and summary."
        ];
    }

    $year = trim($data['year']);
    $summary = $data['context'];

    // Check for duplicate year
    $check_query = "SELECT id FROM annualachievements WHERE year = ?";
    $stmt = $this->conn->prepare($check_query);

    if ($stmt === false) {
        return [
            "success" => false,
            "message" => "Failed to prepare duplicate check: " . $this->conn->error
        ];
    }

    $stmt->bind_param("s", $year);
    if (!$stmt->execute()) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "Failed to execute duplicate check: " . $stmt->error
        ];
    }

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "An achievement for year '$year' already exists."
        ];
    }
    $stmt->close();

    // Insert new achievement
    $insert_query = "INSERT INTO annualachievements (year, summary) VALUES (?, ?)";
    $stmt = $this->conn->prepare($insert_query);

    if ($stmt === false) {
        return [
            "success" => false,
            "message" => "Failed to prepare insert statement: " . $this->conn->error
        ];
    }

    $stmt->bind_param("ss", $year, $summary);

    if (!$stmt->execute()) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "Failed to insert achievement: " . $stmt->error
        ];
    }

    $stmt->close();

    return [
        "success" => true,
        "message" => "Achievement for year '$year' added successfully."
    ];
}

public function updateAnnualAchievement(array $data): array {
    // Validate required fields
    if (!isset($data['yearId']) || !isset($data['year']) || !isset($data['context'])) {
        return [
            "success" => false,
            "message" => "Missing required Data"
        ];
    }

    $id = (int)$data['yearId'];
    $year = trim($data['year']);
    $summary = $data['context'];

    // Check if the new year already exists for a different ID
    $check_query = "SELECT id FROM annualachievements WHERE year = ? AND id != ?";
    $stmt = $this->conn->prepare($check_query);

    if ($stmt === false) {
        return [
            "success" => false,
            "message" => "Failed to prepare duplicate check: " . $this->conn->error
        ];
    }

    $stmt->bind_param("si", $year, $id);
    if (!$stmt->execute()) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "Failed to execute duplicate check: " . $stmt->error
        ];
    }

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        // Another record (different ID) already has this year
        $stmt->close();
        return [
            "success" => false,
            "message" => "Another achievement already uses the year '$year'."
        ];
    }
    $stmt->close();

    // Proceed with update (same year allowed if it's the same ID)
    $update_query = "UPDATE annualachievements SET year = ?, summary = ? WHERE id = ?";
    $stmt = $this->conn->prepare($update_query);

    if ($stmt === false) {
        return [
            "success" => false,
            "message" => "Failed to prepare update statement: " . $this->conn->error
        ];
    }

    $stmt->bind_param("ssi", $year, $summary, $id);

    if (!$stmt->execute()) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "Failed to update achievement: " . $stmt->error
        ];
    }

    if ($stmt->affected_rows === 0) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "No changes made. Either ID not found or data is identical."
        ];
    }

    $stmt->close();

    return [
        "success" => true,
        "message" => "Achievement updated successfully for ID $id."
    ];
}

public function deleteAnnualAchievement(int $id): array {
    // First check if the achievement exists
    $check_query = "SELECT id FROM annualachievements WHERE id = ?";
    $stmt = $this->conn->prepare($check_query);

    if ($stmt === false) {
        return [
            "success" => false,
            "message" => "Failed to prepare existence check: " . $this->conn->error
        ];
    }

    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "Failed to execute existence check: " . $stmt->error
        ];
    }

    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "No achievement found with ID $id."
        ];
    }
    $stmt->close();

    // Proceed with deletion
    $delete_query = "DELETE FROM annualachievements WHERE id = ?";
    $stmt = $this->conn->prepare($delete_query);

    if ($stmt === false) {
        return [
            "success" => false,
            "message" => "Failed to prepare delete statement: " . $this->conn->error
        ];
    }

    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "Failed to delete achievement: " . $stmt->error
        ];
    }

    if ($stmt->affected_rows === 0) {
        $stmt->close();
        return [
            "success" => false,
            "message" => "No rows deleted. Possibly invalid ID."
        ];
    }

    $stmt->close();

    return [
        "success" => true,
        "message" => "Achievement with ID $id deleted successfully."
    ];
}
    public function getFlyer(){
        $sql = "SELECT * FROM flyer";
        $stmt = $this->conn->prepare($sql);
        if ($stmt === false) {
            throw new mysqli_sql_exception("Failed to prepare statement for fetching flyer: " . $this->conn->error);
        }
        if (!$stmt->execute()) {
            throw new mysqli_sql_exception("Failed to execute statement for fetching flyer: " . $stmt->error);
        }
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $result->free();
        $stmt->close();
        return $row;
   }
   public function updateFlyer(array $data){
    //    $data["status"] = $data["status"] === '0' ?;
        try {
            if(isset($data['featured_image_url'])){
              $update_query = "UPDATE flyer SET link = ? ,status = ?  WHERE id = 1";
              $stmt = $this->conn->prepare($update_query);
              if (!$stmt) {
                  throw new Exception("Prepare failed: " . $this->conn->error);
               }
               $stmt->bind_param("si",$data['featured_image_url'],$data["status"]);
               $stmt->execute();
               if ($stmt->affected_rows === 1) {
                    return ['success' => true, 'message' => 'Flyer updated successfully.'];
                } else {
                   // This might happen if the user doesn't exist or no change was made
                  return ['success' => false, 'message' => $data['message'].'Failed to update the flyer'];
                }
            }
            else{
                $update_query = "UPDATE flyer SET status = ?  WHERE id = 1";
                $stmt = $this->conn->prepare($update_query);
                if (!$stmt) {
                    throw new Exception("Prepare failed: " . $this->conn->error);
                 }
                $stmt->bind_param("i", $data['status']);
                $stmt->execute();

                if ($stmt->affected_rows === 1) {
                    return ['success' => true, 'message' => 'Flyer updated successfully.'];
                } else {
                   // This might happen if the user doesn't exist or no change was made
                  return ['success' => false, 'message' => $data['message'].'Failed to update the flyer'];
                }
            }
            
            
        } catch (Exception $e) {
            error_log("Update  error : " . $e->getMessage());
            return ['success' => false, 'message' => 'An error occurred while updating the word from the President'];
        }
    }
     public function getSlideshowImages() {
    $sql = "SELECT * FROM pictures WHERE slideshow = 1 ORDER BY id DESC LIMIT 5";
    $stmt = $this->conn->prepare($sql); 
    if ($stmt === false) {
        throw new mysqli_sql_exception("Failed to prepare statement for fetching slideshow images: " . $this->conn->error);
     }
    if (!$stmt->execute()) {
        throw new mysqli_sql_exception("Failed to execute statement for fetching slideshow images: " . $stmt->error);
     }
    $result = $stmt->get_result();
    $images = [];       
    while ($row = $result->fetch_assoc()) {
        $images[] = $row;
    }       
    $result->free();                        

    $stmt->close();
    return $images;
}
}
?>