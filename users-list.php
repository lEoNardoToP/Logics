<?php
require_once('connection.php');
session_start();
$cypherMethod = 'AES-128-CBC';
$outgoing_id = openssl_decrypt($_SESSION["user_id"], $cypherMethod, getenv('APP_ENCRYPTION_KEY'), $options=0, "1234567812345678");
$output = "";

$query = "
    SELECT *
    FROM users
    WHERE id = :id
";

$check = $pdo->prepare($query);
$check->bindParam(':id', $outgoing_id, PDO::PARAM_STR);
$check->execute();
$user = $check->fetch(PDO::FETCH_ASSOC);

if ($user["username"] != "admin"){
  $query = "
      SELECT *
      FROM users
      WHERE username = :username
  ";
  $admin = "admin";
  $check = $pdo->prepare($query);
  $check->bindParam(':username', $admin, PDO::PARAM_STR);
  $check->execute();
  $user = $check->fetch(PDO::FETCH_ASSOC);
    include "data.php";
    echo $output;
    exit;
}

$query = "
    SELECT *
    FROM users
    WHERE NOT id = :id
";

$check = $pdo->prepare($query);
$check->bindParam(':id', $outgoing_id, PDO::PARAM_STR);
$check->execute();


if ($check->rowCount() == 0) {
  $output .= "Nessuno disponibile a chattare";
} else if ($check->rowCount() > 0) {
  while ($user = $check->fetch(PDO::FETCH_ASSOC)){
  include "data.php";
}
}
echo $output;
?>
