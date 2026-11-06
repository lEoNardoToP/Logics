<?php
ini_set('display_errors', 1);
require_once('SendEmail.php');
require_once('connection.php');
function generateRandomString($length = 30) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$%&/(=)><*#@';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}


if (isset($_POST['register'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $email = $_POST['email'] ?? '';
    $passwordAgain = $_POST["passwordAgain"] ?? '';
    $msg = '';
    $isUsernameValid = filter_var(
        $username,
        FILTER_VALIDATE_REGEXP, [
            "options" => [
                "regexp" => "/^[a-z\d_]{3,20}$/i"
            ]
        ]
    );
    $isEmailValid = filter_var($email, FILTER_VALIDATE_EMAIL);
    $userLenght = mb_strlen($username);
    $pwdLenght = mb_strlen($password);
    $canGo = true;
    $failedUsername = "";
    $failedPassword = "";
    $failedEmail = "";
    $failedPasswordAgain = "";

    if (empty($email)) {
      $failedEmail = "Compila il campo email";
      $canGo = false;
    } else if (!$isEmailValid) {
      $failedEmail = "Indirizzo email non valido";
      $canGo = false;
    }

    if (empty($username)){
      $failedUsername = 'Compila il campo dello username';
      $canGo = false;
    }
    if(empty($password)) {
        $failedPassword = 'Compila il campo della password';
        $canGo = false;
    }
    if (empty($passwordAgain)) {
      $failedPasswordAgain = "Compila il campo della verifica Password";
      $canGo = false;
    }
    if ($passwordAgain != $password) {
      $failedPasswordAgain = "I campi password non sono uguali";
      $canGo = false;
    }
    if (!empty($username) && $userLenght < 3) {
        $failedUsername = 'Lo username deve essere almeno di tre caratteri';
        $canGo = false;
    } else if (!empty($username) && $userLenght > 20) {
      $failedUsername = 'Lo username non può essere più lungo di venti caratteri';
      $canGo = false;
    } else if (!empty($username) && false === $isUsernameValid) {
        $failedUsername = 'Lo username non è valido. Sono ammessi solamente caratteri
                alfanumerici e l\'underscore.';
        $canGo = false;
    }
    if (!empty($password) && $pwdLenght < 8) {
        $failedPassword = 'Lunghezza minima password 8 caratteri.';
        $canGo = false;
    } elseif ($pwdLenght > 20) {
        $failedPassword = 'Lunghezza massima password 20 caratteri';
        $canGo = false;
    }

    $thereIS = false;
    for ($i = 0; $i<$pwdLenght; $i++) {
      if (str_contains("QWERTYUIOPASDFGHJKLZXCVBNM", $password[$i])){
        $thereIS = true;
        break;
      }
    }
    if (!$thereIS){
      if ($failedPassword != ""){
          $failedPassword .= ". ";
      }
      $failedPassword .= "Ci deve essere almeno una maiuscola";
      $canGo = false;
    }
    $thereIS = false;
    for ($i = 0; $i<$pwdLenght; $i++) {
      if (str_contains("1234567890", $password[$i])) {
        $thereIS = true;
        break;
      }
    }
    if (!$thereIS){
      if ($failedPassword != ""){
          $failedPassword .= ". ";
      }
      $failedPassword .= "Ci deve essere almeno un numero";
      $canGo = false;
    }
    $thereIS = false;
    for ($i = 0; $i<$pwdLenght; $i++) {
      if (!str_contains("1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM", $password[$i])){
        $thereIS = true;
        break;
      }
    }
    if (!$thereIS){
      if ($failedPassword != ""){
          $failedPassword .= ". ";
      }
      $failedPassword .= "Ci deve essere almeno un carattere speciale";
      $canGo = false;
    }


    $query = "
        SELECT id, username
        FROM users
        WHERE username = :username
    ";

    $check = $pdo->prepare($query);
    $check->bindParam(':username', $username, PDO::PARAM_STR);
    $check->execute();

    $user = $check->fetchAll(PDO::FETCH_ASSOC);

    if (count($user) > 0) {
        $failedUsername = 'Username già in uso';
        $canGo = false;
    }
      $query = "
          SELECT id, username
          FROM users
          WHERE email = :email
      ";

      $check = $pdo->prepare($query);
      $check->bindParam(':email', $email, PDO::PARAM_STR);
      $check->execute();

      $emailcheck = $check->fetchAll(PDO::FETCH_ASSOC);
      if (count($emailcheck) > 0) {
          $failedEmail = 'Email già in uso';
          $canGo = false;
      }



    if ($canGo) {
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

            $query = "
                SELECT id
                FROM users
            ";

            $check = $pdo->prepare($query);
            $check->execute();

            $ids = $check->fetchAll(PDO::FETCH_NUM);
            $randomID = generateRandomString();
            $cypherMethod = 'AES-128-CBC';

            $equal = false;
            while(!$equal){
                $equal = true;
                if (in_array($randomID, $ids)){
                  $equal = false;
                  $randomID = generateRandomString();
                }
            }

            $encryptedID = openssl_encrypt($randomID, $cypherMethod, "REMOVED_SECRET", $options=0, "1234567812345678");
            $canGo = send_email($email, "LOGICS verifica la tua email" ,'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta http-equiv="X-UA-Compatible" content="ie=edge" /><title>Logics</title></head><body><a href="http://localhost/Logics/futureRegistration.php?token='.$encryptedID.'">Verifica il tuo indirizzo email </a></body></html>', );

              if ($canGo) {
                $query = "
                    INSERT INTO users
                    VALUES (:id, :username, :password, :email, :status, 0)
                ";
                $status = "Active now";
                $check = $pdo->prepare($query);
                $check->bindParam(':id', $randomID, PDO::PARAM_STR);
                $check->bindParam(':username', $username, PDO::PARAM_STR);
                $check->bindParam(':email', $email, PDO::PARAM_STR);
                $check->bindParam(':password', $password_hash, PDO::PARAM_STR);
                $check->bindParam(':status', $status, PDO::PARAM_STR);
                $check->execute();

                if ($check->rowCount() > 0) {
                    $msg = 'Registrazione eseguita con successo, verifica il tuo account adesso';
                } else {
                    $msg = 'Problemi con l\'inserimento dei dati';
                }
              }
            }

    $results = array(
      "failedUsername" => $failedUsername,
      "failedPassword" => $failedPassword,
      "failedEmail" => $failedEmail,
      "failedPasswordAgain" => $failedPasswordAgain,
      "msg" => $msg
    );
    echo json_encode($results);
    //header('Location: HomePage.html');
}
?>
