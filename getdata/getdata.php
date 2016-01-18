<?php

  // Data in order to access API
  $auth_key = "986e0eba43e5b51f06ed554efa8a37e24490ecd5";

  // Homicidios
  //generateJSON($auth_key, "NUMER-DE-HOMIC-2013", 2013, "homicidios-2013.json");
  //generateJSON($auth_key, "NUMER-DE-HOMIC-2014", 2014, "homicidios-2014.json");

  // Robos de automotores
  //generateJSON($auth_key, "NUMER-DE-DENUN-POR-81500", 2013, "robos-automotores-2013.json");
  //generateJSON($auth_key, "NUMER-DE-DENUN-POR-73309", 2014, "robos-automotores-2014.json");

  // Robos de accesorios de automotores
  //generateJSON($auth_key, "NUMER-DE-DENUN-POR-67518", 2013, "robos-accesorios-2013.json");
  generateJSON($auth_key, "NUMER-DE-DENUN-POR-78781", 2014, "robos-accesorios-2014.json");

  // Robos de bienes en automotores
  //generateJSON($auth_key, "NUMER-DE-DENUN-POR-28521", 2013, "robos-bienes-2013.json");
  //generateJSON($auth_key, "NUMER-DE-DENUN-POR-75707", 2014, "robos-bienes-2014.json");

  // Robos de domicilios
  //generateJSON($auth_key, "NUMER-DE-DENUN-POR-88331", 2013, "robos-domicilios-2013.json");
  //generateJSON($auth_key, "NUMER-DE-DENUN-POR-82965", 2014, "robos-domicilios-2014.json");

  // Robos a locales comerciales
  //generateJSON($auth_key, "NUMER-DE-DENUN-DE-45730", 2013, "robos-locales-2013.json");
  //generateJSON($auth_key, "NUMER-DE-DENUN-DE-77097", 2014, "robos-locales-2014.json");

  // Robos a personas
  //generateJSON($auth_key, "NUMER-DE-DENUN-POR-62026", 2013, "robos-personas-2013.json");
  //generateJSON($auth_key, "NUMER-DE-DENUN-POR-37458", 2014, "robos-personas-2014.json");

  echo "Done";

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
