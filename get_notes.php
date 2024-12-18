<?php

$servername = "localhost";
$username = "root";  
$password = ""; 
$dbname = "task_manager_db";  

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM notes ORDER BY created_at DESC";
$result = $conn->query($sql);

$notes = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
}

echo json_encode($notes);

$conn->close();
?>

