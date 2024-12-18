<?php

$servername = "localhost";
$username = "root";  
$password = "";  
$dbname = "task_manager_db";  

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->title) && isset($data->description)) {
    $title = $data->title;
    $description = $data->description;

    $stmt = $conn->prepare("INSERT INTO notes (title, description) VALUES (?, ?)");
    $stmt->bind_param("ss", $title, $description);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save note"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
}

$conn->close();
?>
