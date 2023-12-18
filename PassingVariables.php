<?php
session_start();
if (isset($_POST["session_user"])){
    if (isset($_SESSION['session_user'])){
      echo $_SESSION['session_user'];
    }
}


?>
