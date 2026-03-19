<?php
// Database configuration
$host = 'Localhost';
$user = 'bethelfa';
$user = "cpses_be1kdj144l";
$pass = "Holygates@2025"; // Your actual password
$dbname = "bethelfa_bethelfinal"; // Your actual database name
// Enable error reporting for debugging
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Attempt to establish connection
    $mysqli = new mysqli($host, $user, $pass, $dbname);
    
    echo "Successfully connected to the database!";
    echo " Host info: " . $mysqli->host_info;
    
    $mysqli->close();
} catch (mysqli_sql_exception $e) {
    // Output the specific error code and message
    echo "Connection Failed: " . $e->getMessage();
    echo "<br>Error Code: " . $e->getCode();
}
$hashedPassword = password_hash("Holygates@2005", PASSWORD_DEFAULT);
echo "\n Hashed Password: " . $hashedPassword;
?>