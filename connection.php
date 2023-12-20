<?php

//CAMBIARE QUESTO BLOCCO IN PRODUCTION PER SICUREZZA
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
//CAMBIARE QUESTO BLOCCO IN PRODUCTION PER SICUREZZA

$config = [
    'db_engine' => 'mysql',
    'db_host' => '127.0.0.1',
    'db_name' => 'login',
    'db_user' => 'root',
    'db_password' => 'REMOVED_SECRET',
];

$db_config = $config['db_engine'] . ":host=".$config['db_host'] . ";dbname=" . $config['db_name'].";charset=utf8mb4";

try {
    $pdo = new PDO($db_config, $config['db_user'], $config['db_password'], [
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_general_ci"
    ]);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

} catch (PDOException $e) {
    exit("Impossibile connettersi al database: " . $e->getMessage());
}
?>
