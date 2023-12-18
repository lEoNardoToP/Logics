<?php
  $query = '
  SELECT *
  FROM messages
  WHERE (incoming_msg_id = :id1 OR outgoing_msg_id = :id2) AND (outgoing_msg_id = :out1 OR incoming_msg_id = :out2)
  ORDER BY msg_id DESC LIMIT 1
  ';
  $check2 = $pdo->prepare($query);
  $check2->bindParam(':id1', $user["id"], PDO::PARAM_STR);
  $check2->bindParam(':id2', $user["id"], PDO::PARAM_STR);
  $check2->bindParam(':out1', $outgoing_id, PDO::PARAM_STR);
  $check2->bindParam(':out2', $outgoing_id, PDO::PARAM_STR);
  $check2->execute();
  $row = $check2->fetch(PDO::FETCH_ASSOC);

   if ($check2->rowCount() > 0) {
    $result = $row["msg"];
  } else {
    $result = "Nessun messaggio";
  }
  (strlen($result) > 28) ? $msg = substr($result, 0, 28)."..." : $msg = $result;
  if ($row){
  ($outgoing_id ==  $row["incoming_msg_id"]) ? $you = "Tu: " :$you = "";
  } else {
    $you = "";
  }
  ($user["status"] == "Offline now") ? $offline = "offline" : $offline = "";



  $output .= '
  <div class="users-list">
  <div class="status-dot '.$offline.'"><i class="fas fa-circle"></i></div>
    <a href="#" class="User-click">
      <div class="content">
        <div class="details">
          <span class="users-list-name">'.$user["username"].'</span>
          <p>'.$you.$msg.'</p>
        </div>
      </div>
      </a>
  </div>
  ';
?>
