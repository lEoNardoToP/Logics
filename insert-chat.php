<?php
session_start();
require_once("SendEmail.php");
 if (isset($_SESSION["user_id"])){
   require_once('connection.php');
   $outgoing_username = $_POST["outgoing_username"];
   $message = $_POST["message"];
   $cypherMethod = 'AES-128-CBC';
   $id = openssl_decrypt($_SESSION["user_id"], $cypherMethod, getenv('APP_ENCRYPTION_KEY'), $options=0, "1234567812345678");
   } else {
     $id = "";
   }
   $query = "
       SELECT username
       FROM users
       WHERE id = :id
   ";
   $check = $pdo->prepare($query);
   $check->bindParam(':id', $id, PDO::PARAM_STR);
   $check->execute();
   $fetched = $check->fetch();
   if (empty($fetched)){
     echo "Devi essere loggato per messaggiarci";
     exit;
   }
   if ($fetched["username"] != "admin" && $outgoing_username != "admin"){
     echo "Solo l'admin può messaggiare con gli altri utenti";
     exit;
   }
   $query = "
       SELECT id
       FROM users
       WHERE username = :username
   ";
   $check = $pdo->prepare($query);
   $check->bindParam(':username', $outgoing_username, PDO::PARAM_STR);
   $check->execute();
   $outgoing_id = $check->fetch()[0];

   if (!empty($message)){
     $message = trim($message);

     $query = "
         INSERT INTO messages (incoming_msg_id, outgoing_msg_id, msg)
         values(:id, :outgoing_id, :msg)
     ";
     $check = $pdo->prepare($query);
     $check->bindParam(':id', $id, PDO::PARAM_STR);
     $check->bindParam(':outgoing_id', $outgoing_id, PDO::PARAM_STR);
     $check->bindParam(':msg', $message, PDO::PARAM_STR);
     $check->execute();

     $query = "
         SELECT status
         FROM users
         WHERE username = \"admin\"
     ";
     $check = $pdo->prepare($query);
     $check->execute();
     $adminStatus = $check->fetch(PDO::FETCH_ASSOC);
     if ($adminStatus["status"] == "Offline now"){
       send_email(getenv('ADMIN_NOTIFY_EMAIL'), "Nuovo messaggio", '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta http-equiv="X-UA-Compatible" content="ie=edge" /><title>Logics</title></head><body>Da: '.$fetched["username"].'.<br>'.$message.'</body></html>');

     }
   }

?>
