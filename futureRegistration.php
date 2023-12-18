<?php
require_once('connection.php');
$cypherMethod = 'AES-128-CBC';
if (isset($_GET["token"])){
  $id = openssl_decrypt($_GET["token"], $cypherMethod, "REMOVED_SECRET", $options=0, "1234567812345678");
  $query = "
      SELECT username
      FROM users
      WHERE id = :id
  ";
  $check = $pdo->prepare($query);
  $check->bindParam(':id', $id, PDO::PARAM_STR);
  $check->execute();
  $user = $check->fetch(PDO::FETCH_ASSOC);
  if ($check->rowCount() > 0){
    $query = "
        UPDATE users
        SET verified = 1
        WHERE id = :id
    ";

    $check = $pdo->prepare($query);
    $check->bindParam(':id', $id, PDO::PARAM_STR);
    $check->execute();
    session_start();
    $_SESSION["user_id"] = $_GET["token"];
    $_SESSION['session_user'] = $user["username"];
    header("Location: http://localhost/Logics/HomePage.html");
  } else {
    $id = openssl_decrypt($_GET["token"], $cypherMethod, "REMOVED_SECRET", $options=0, "1234567812345678");
    echo "<h1>Something went wrong</h1>";
    echo $id;
  }
}

?>
