<?php
  require_once('connection.php');
  session_start();
if (isset($_SESSION["user_id"])){
  $output = "";
  $outgoing_username = $_POST["outgoing_username"];
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
    exit;
  }
  if ($fetched["username"] != "admin" && $outgoing_username != "admin"){
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

//if image LEFT JOIN users on users.id = messages.outgoing_msg_id
  $query = "
      SELECT *
      FROM messages
      WHERE outgoing_msg_id = :outgoing_id AND incoming_msg_id = :incoming_id
      OR outgoing_msg_id = :incoming_id2 AND incoming_msg_id = :outgoing_id2 ORDER BY msg_id
  ";
  $check = $pdo->prepare($query);
  $check->bindParam(':outgoing_id', $outgoing_id, PDO::PARAM_STR);
  $check->bindParam(':outgoing_id2', $outgoing_id, PDO::PARAM_STR);
  $check->bindParam(':incoming_id', $id, PDO::PARAM_STR);
  $check->bindParam(':incoming_id2', $id, PDO::PARAM_STR);
  $check->execute();
  $messages = $check->fetchAll(PDO::FETCH_ASSOC);
  for($i=0;$i<$check->rowCount();$i++){
    if ($messages[$i]["outgoing_msg_id"] == $outgoing_id){ //he is a message sender
      $output .= '<div class="chat outgoing">
        <div class="details">
          <p>'.$messages[$i]["msg"].'</p>
        </div>
      </div>';

    } else if ($messages[$i]["outgoing_msg_id"] == $id) { //he is a message receiver
      $output .= '<div class="chat incoming">
        <div class="details">
          <p>'.$messages[$i]["msg"].'</p>
        </div>
      </div>';
    }
  }
  echo $output;


?>
