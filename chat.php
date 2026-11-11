<?php
require_once('connection.php');
$username = $_POST["username"];
$query = "
    SELECT status
    FROM users
    WHERE username = :username
";
$check = $pdo->prepare($query);
$check->bindParam(':username', $username, PDO::PARAM_STR);
$check->execute();
$status = $check->fetch()[0];
echo $status;
?>
