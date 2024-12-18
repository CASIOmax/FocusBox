<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "document_storage";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $name = $_POST['docName'];
    $desc = $_POST['docDesc'];
    $file = $_FILES['docFile'];

    $filePath = $uploadDir . basename($file['name']);

    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        $stmt = $conn->prepare("INSERT INTO files (name, description, path) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $desc, $filePath);
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'fileName' => $name,
                'fileDesc' => $desc,
                'filePath' => $filePath
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Database insertion failed']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
    }
}

$conn->close();
?>

