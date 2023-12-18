<?php
session_start();
require_once('connection.php');
function getIPAddress() {
    //whether ip is from the share internet
     if(!empty($_SERVER['HTTP_CLIENT_IP'])) {
                $ip = $_SERVER['HTTP_CLIENT_IP'];
        }
    //whether ip is from the proxy
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
     }
//whether ip is from the remote address
    else{
             $ip = $_SERVER['REMOTE_ADDR'];
     }
     return $ip;
}



if (isset($_POST["reload"])) {
  if (isset($_SESSION["session_id"])){
    $results = array("username" => $_SESSION["session_user"]);
     echo json_encode($results);
  } else {
    echo json_encode(array());
  }
}

$user = ["username" => ""];
$canGo = true;
if (isset($_POST['login'])) {
  $username = $_POST['username'] ?? '';
  $password = $_POST['password'] ?? '';
  $msg = '';
  $failedUsername = '';
  $failedPassword = '';
  $isUsernameValid = filter_var(
      $username,
      FILTER_VALIDATE_REGEXP, [
          "options" => [
              "regexp" => "/^[a-z\d_]{3,20}$/i"
          ]
      ]
  );

    $ip = getIPAddress();
    $query = "
        SELECT *
        FROM ips
        WHERE ip = :ip
    ";

    $check = $pdo->prepare($query);
    $check->bindParam(':ip', $ip, PDO::PARAM_STR);
    $check->execute();
    $row = $check->fetch(PDO::FETCH_ASSOC);
    if ($check->rowCount() == 0){
      $query2 = "
          INSERT INTO ips
          VALUES (:ip, now(), 0)
      ";

      $check2 = $pdo->prepare($query2);
      $check2->bindParam(':ip', $ip, PDO::PARAM_STR);
      $check2->execute();
    } else if ($row["tentativi"] > 50){
        $fmt = new \IntlDateFormatter('it_IT',IntlDateFormatter::FULL,IntlDateFormatter::FULL, 'Europe/Rome');
        $fmt->setPattern('yyyy-MM-dd HH:mm:ss ');
        $now = $fmt->format(time());
        if (abs(strtotime($row["date"]) - strtotime($now)) < 60*60){
          $canGo = false;
          $msg = "troppi tentativi, riprova più tardi";

        } else {
          $query3 = "
              UPDATE ips
              SET date = now(), tentativi = 0
              WHERE ip = :ip
          ";
          $check3 = $pdo->prepare($query3);
          $check3->bindParam(':ip', $ip, PDO::PARAM_STR);
          $check3->execute();
      }
    } else {
      $query3 = "
          UPDATE ips
          SET tentativi = :tentativi
          WHERE ip = :ip
      ";
      $newTentativi = $row["tentativi"] + 1;
      $check3 = $pdo->prepare($query3);
      $check3->bindParam(':ip', $ip, PDO::PARAM_STR);
      $check3->bindParam(':tentativi', $newTentativi, PDO::PARAM_STR);
      $check3->execute();
    }



    if (empty($username)) {
        $failedUsername = 'Inserisci lo username';
        $canGo = false;
    }
    if (empty($password)) {
        $failedPassword = 'Inserisci la password';
        $canGo = false;
    }

    if (!empty($username) && false === $isUsernameValid) {
        $failedUsername = 'Lo username non è valido.';
        $canGo = false;
      }
      $query = "
          SELECT verified
          FROM users
          WHERE username = :username
      ";

      $check = $pdo->prepare($query);
      $check->bindParam(':username', $username, PDO::PARAM_STR);
      $check->execute();
      $verified = $check->fetch(PDO::FETCH_ASSOC)["verified"];
      if ($verified == 0){
        $msg = "Devi verificare il tuo account prima";
        $canGo = false;
      }


    if ($canGo){
        $query = "
            SELECT username, password, id
            FROM users
            WHERE username = :username
        ";

        $check = $pdo->prepare($query);
        $check->bindParam(':username', $username, PDO::PARAM_STR);
        $check->execute();

        $user = $check->fetch(PDO::FETCH_ASSOC);

        if (!$user || password_verify($password, $user['password'] ?? '') === false) {
            $msg = 'Credenziali utente errate';

        } else {

            session_regenerate_id(true);
            $_SESSION['session_id'] = session_id();
            $cypherMethod = 'AES-128-CBC';

            $encryptedID = openssl_encrypt($user["id"], $cypherMethod, "REMOVED_SECRET", $options=0, "1234567812345678");
            $_SESSION["user_id"] = $encryptedID;
            $_SESSION['session_user'] = $user['username'];
            $msg = "Login Effettuato";
            $status = "Active now";
            $sql = '
            UPDATE users SET status  = :status
            WHERE id = :id
            ';
            $cypherMethod = 'AES-128-CBC';
            if (isset($_SESSION["user_id"])){
            $id = openssl_decrypt($_SESSION["user_id"], $cypherMethod, "REMOVED_SECRET", $options=0, "1234567812345678");
            } else {
              $id = "";
            }
            $check = $pdo->prepare($sql);
            $check->bindParam(':status', $status, PDO::PARAM_STR);
            $check->bindParam(':id', $id, PDO::PARAM_STR);
            $check->execute();
            //header('Location: HomePage.html');
        }
    }


  $results = array("msg" => $msg,
   "username" => $user["username"] ?? '',
 "failedUsername" => $failedUsername,
"failedPassword" => $failedPassword);
   echo json_encode($results);
    //header('Location: HomePage.html');
    //echo $msg.'<br><a href="./HomePage.html">torna indietro</a>';
  }

  if (isset($_POST["logout"])){
    $status = "Offline now";
    $sql = '
    UPDATE users SET status  = :status
    WHERE id = :id
    ';
    $cypherMethod = 'AES-128-CBC';
    if (isset($_SESSION["user_id"])){
    $id = openssl_decrypt($_SESSION["user_id"], $cypherMethod, "REMOVED_SECRET", $options=0, "1234567812345678");
    } else {
      $id = "";
    }
    unset($_SESSION["user_id"]);
    unset($_SESSION['session_user']);
    $check = $pdo->prepare($sql);
    $check->bindParam(':status', $status, PDO::PARAM_STR);
    $check->bindParam(':id', $id, PDO::PARAM_STR);
    $check->execute();
    session_destroy();
  }
?>
