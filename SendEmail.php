<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

//CAMBIARE QUESTO BLOCCO IN PRODUCTION PER SICUREZZA
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
//CAMBIARE QUESTO BLOCCO IN PRODUCTION PER SICUREZZA

require 'vendor/phpmailer/phpmailer/src/Exception.php';
require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
require 'vendor/phpmailer/phpmailer/src/SMTP.php';
$canGo = true;
function send_email ($to, $title, $body) {
  $mail = new PHPMailer(true);

  try {
      //Server settings
      $mail->SMTPDebug = 0;
      $mail->isSMTP();                                            //Send using SMTP
      $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
      $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
      $mail->Username   = 'REMOVED_EMAIL';                     //SMTP username
      $mail->Password   = 'REMOVED_SECRET';                               //SMTP password
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
      $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

      //Recipients
      $mail->setFrom('REMOVED_EMAIL', 'LOGICS');
      $mail->addAddress($to);     //Add a recipient

      //Content
      $mail->isHTML(true);                                  //Set email format to HTML
      $mail->Subject = $title;
      $mail->Body    = $body;
      $mail->AltBody = '';

      $mail->send();
  } catch (Exception $e) {
      $canGo = false;
  }
}
?>
