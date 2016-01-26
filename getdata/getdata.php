<?php

  // Function to generate JSON
  function generateJSON($auth_key, $guid, $year, $filename){
    // Get json from API
    $url = "http://api.quito.junar.com/datastreams/invoke/" . $guid . "?auth_key=" . $auth_key . "&output=json_array";
    $str = file_get_contents($url);
    $json = json_decode($str, true);

    // Array of Zonales id
    $zonales_id = array(1 => "Calderón", 2 => "Eloy Alfaro", 3 => "Eugenio Espejo", 4 => "La Delicia", 5 => "Los Chillos",
    6 => "Manuela Saenz", 7 => "Quitumbe", 8 => "Tumbaco", 12 => "Sur", 13 => "Norte", 16 => "Centro");

    $datos = array();

    // Reading JSON and verify
    foreach ($json['result'] as $data) {
      $id_zonal = 0;
      $zonal = reset($zonales_id);

      // Checks if json contains a valid zonal and returns id
      while ($zonal = current($zonales_id)) {
        if (strpos($zonal, $data[1]) !== false){
          $id_zonal = key($zonales_id);
          break;
        }
        next($zonales_id);
      }

      // Assings data according to id
      if($id_zonal > 0){
        if($id_zonal > 10){
          $id_zonal = $id_zonal - 10;
        }
        $datos[] = array("id" => $id_zonal, "zonal" => html_entity_decode($zonales_id[$id_zonal]), "periodo" => 2014, "dato" => intval($data[14]));
      }
    }

    // Write json
    file_put_contents($filename, json_encode($datos));
  }



?>
