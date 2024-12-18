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

if (isset($data->id)) {
    $id = $data->id;

    $stmt = $conn->prepare("DELETE FROM notes WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Note deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete note"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Missing note ID"]);
}

$conn->close();
?>
