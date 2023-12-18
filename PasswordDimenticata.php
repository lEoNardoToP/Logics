<?php
require_once('SendEmail.php');
require_once('connection.php');
$email = $_POST["email"];
$failed_email = "";
$alert = "";
$canGo = true;
if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
  $failed_email = "Email non valida";
  $canGo = false;
}
if (empty($email)){
  $failed_email = "Immettere l'email";
  $canGo = false;
}


if ($canGo){
  session_start();
  $query = '
  SELECT * FROM users WHERE email = :email
  ';
  $check = $pdo->prepare($query);
  $check->bindParam(':email', $email, PDO::PARAM_STR);
  $check->execute();
  $user = $check->fetch();
  $cypherMethod = 'AES-128-CBC';

  $encryptedID = openssl_encrypt($user["id"], $cypherMethod, "REMOVED_SECRET", $options=0, "1234567812345678");
  send_email($email, "LOGICS resetta la tua email", '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta http-equiv="X-UA-Compatible" content="ie=edge" /><title>Logics</title></head><body><a href="http://localhost/FedeLeoSite/ResetPassword.php?token='.$encryptedID.'&password='.$_POST["password"].'">Resetta il tuo indirizzo email </a></body></html>');

}

$results = array(
  "failedEmail" => $failed_email,
);
echo json_encode($results);
?>
