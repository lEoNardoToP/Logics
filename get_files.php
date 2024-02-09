<?php
$dir = 'assets/blender/';
$a = scandir($dir);
$c = [];
for ($b = 0; $b < count($a); $b++){
    if (! str_starts_with($a[$b], ".")){
        array_push($c, $a[$b]);
    }
}
echo json_encode($c) ;
?>