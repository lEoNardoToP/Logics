<?php
require_once('connection.php');
session_start();
if (isset($_POST["submitComment"])) {

  $message = $_POST["message"];
  $stars = $_POST["stars"];
  if ($stars < 1){
    $stars = 1;
  } else if ($stars > 5){
    $stars = 5;
  }
  $cypherMethod = 'AES-128-CBC';
  if (isset($_SESSION["user_id"])){
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
  if (empty($check->fetch())){
    echo "Devi essere loggato per inserire una valutazione";
    exit;
  }

  $query = "
      SELECT date
      FROM comments
      WHERE uid = :uid
  ";
  $check = $pdo->prepare($query);
  $check->bindParam(':uid', $id, PDO::PARAM_STR);
  $check->execute();
  $dates = $check->fetchAll(PDO::FETCH_ASSOC);
  foreach($dates as $date){
    $now = new DateTime();
    $pos_diff = (new DateTime($date["date"]))->diff($now)->format("%a");
    if (intval($pos_diff) == 0){
      echo "Puoi inserire una valutazione solo una volta al giorno";
      exit;
    }
  }

  $query = "
      INSERT  INTO comments
      values(0, :uid, :date, :message, :stars)
  ";

  $date = (new DateTime())->format("Y-m-d H:m:s");
  if (!$date) {
    $date = "UNKNOWN DATE";
  }

  $safeMessage = htmlspecialchars($message);
  $check = $pdo->prepare($query);
  $check->bindParam(':uid', $id, PDO::PARAM_STR);
  $check->bindParam(':date', $date, PDO::PARAM_STR);
  $check->bindParam(':message', $safeMessage, PDO::PARAM_STR);
  $check->bindParam(':stars', $stars, PDO::PARAM_STR);
  $check->execute();

}

if (isset($_POST["loadComments"])) {
  $query = "
      SELECT *
      FROM comments
  ";

  $check = $pdo->prepare($query);
  $check->execute();

  $comments = $check->fetchAll(PDO::FETCH_ASSOC);

  $query = "
      SELECT username
      FROM users
      WHERE id = :id
  ";
  for($i = 0;$i<count($comments);$i++){
    $check = $pdo->prepare($query);
    $check->bindParam(':id', $comments[$i]["uid"], PDO::PARAM_STR);
    $check->execute();
    $username = $check->fetch(PDO::FETCH_ASSOC)["username"];
    $comments[$i]["uid"] = $username;
}

  echo json_encode($comments);

}

?>
