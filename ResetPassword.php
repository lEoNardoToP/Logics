<?php
require_once("connection.php");
if (isset($_GET["token"])){
  $cypherMethod = 'AES-128-CBC';
  $id = openssl_decrypt($_GET["token"], $cypherMethod, "REMOVED_SECRET", $options=0, "1234567812345678");
  $query = "
      SELECT username
      FROM users
      WHERE id = :id
  ";

  $check = $pdo->prepare($query);
  $check->bindParam(':id', $id, PDO::PARAM_STR);
  $check->execute();
  if ($check->rowCount() > 0){
    $query = "
        UPDATE users
        SET password = :password
        WHERE id = :id
    ";
    $password = $_GET["password"];
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $check = $pdo->prepare($query);
    $check->bindParam(':id', $id, PDO::PARAM_STR);
    $check->bindParam(':password', $password_hash, PDO::PARAM_STR);
    $check->execute();
    header("Location: http://localhost/Logics/HomePage.html");
  }
}

?>
