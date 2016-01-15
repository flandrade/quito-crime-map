/* Global variables for Map */
var selectYear = 2014;  // Year selected
var selectCrime = 1;    // Year selected
var crimeName = "homicidios";  // Name of selected crime
var dataZonales;        // GeoJson of zonales (map)
var crimeLayer;         // Json of crimes (layer)

/* Global variables for Data Crime */
var dataCrime = new Array();  // Crime data array used to fill
var divDensity = 0;           // Fraction of density used to fill
var totalCrime = 0;            // Total number of crimes

/* Crimes rate = crimes per 100.000 residents */
function crimeRate(crimes, residents){
  var aux_residents = residents / 100000;
  var result = crimes / aux_residents;
  return result;
}

/* Change name of crimen to show */
function changeCrime(crime){
  var crimeNameAll;
  var nPosition = crime.search("-");
  if (nPosition >= 0) {
    crimeNameAll = crime.substring(0, nPosition) + " de " + crime.substring(nPosition + 1);
  } else {
    crimeNameAll = crime;
  }
  return crimeNameAll;
}

/* Functions of custom control map */
var crimeLayer;
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#000',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	//info.update(layer.feature);
  sidebar.updateHover(layer.feature);
}

function resetHighlight(e) {
	crimeLayer.resetStyle(e.target);
  sidebar.update();
}

function zoomToFeature(e) {
	//map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

/* Map filling function: it defines the fill color according to id and density */
function getMapColor(rate) {
  // Fill according to crime rate
  return rate > Math.round(divDensity*7) ? '#800026':
         rate > Math.round(divDensity*6) ? '#BD0026':
         rate > Math.round(divDensity*5) ? '#E31A1C':
         rate > Math.round(divDensity*4) ? '#FC4E2A':
         rate > Math.round(divDensity*3) ? '#FD8D3C':
         rate > Math.round(divDensity*2) ? '#FEB24C':
         rate > Math.round(divDensity*1) ? '#FED976':
                                           '#FFEDA0';
}

/* Style map function according to crime */
function styleMap(feature) {
    return {
        fillColor: getMapColor(dataCrime[feature.id-1]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

/* Loads JSON data according to selection */
function processDataMap(year, crime, crimeName){
    var auxCrime;

    // Reset variables
    dataCrime = new Array();
    divDensity = 0;
    totalCrime = 0;

    // Load JSON according to selection
    if (year == 0 || crime == 0) {
      alert();
    } else{
      var json_file = "data/" + crimeName + "-" + year + ".json";
      var getDataJSON = $.getJSON(json_file, function (data) {
        auxCrime = data;
      });
    }

  getDataJSON.done(function(){
    // Checks if there is a previous layer and removes
    if(map.hasLayer(crimeLayer)){
      map.removeLayer(crimeLayer);
    }

    // Checks if there is a previous legend
    var currentLegend = document.getElementsByClassName("info legend leaflet-control");
    if (currentLegend[0] != null){
      document.getElementsByClassName("info legend leaflet-control")[0].remove();;
    }

    // Sorts dataCrime according to id
    auxCrime.sort(function(a, b) {
    return parseFloat(a.id) - parseFloat(b.id);
    });

    getMapJSON.done(function(){
      // Creates dataCrime with crime date in order to fill map
      for (index = 0; index < auxCrime.length; ++index) {
        var aux_poblation = dataZonales.features[index].properties.habitantes;
        var aux_crime = auxCrime[index].dato;
        var rate = crimeRate(aux_crime, aux_poblation);
        totalCrime = totalCrime + rate;

        dataCrime.push(rate);
      }

      // Calculates fraction of density in order to fill map
      var maxValue = Math.max.apply(null,dataCrime);
      divDensity = maxValue / (dataCrime.length-1);
    });

    // Adds crime layer to map
    crimeLayer = L.geoJson(dataZonales, {style: styleMap, onEachFeature: onEachFeature});
    map.addLayer(crimeLayer);

    // Creates legend
    createLegend(divDensity);

    // Creates sidebar
    map.addControl(sidebar);
    sidebar.update();

    // Updates SVG
    replaceSVG();

  });

}

/* Click functions */
$('li[id^="year"]').click(function() {
  // Removes active class of previous selection
  $('li[id^="year"]').removeClass('active');

  // Identifies year
  selectYear = $(this).attr("id").substring(5);

  // Add active class to selection
  $('#year-' + selectYear).addClass('active');

  // Reload map
  processDataMap(selectYear, selectCrime, crimeName);
});

$('li[id^="crimen"]').click(function() {
  // Removes active class of previous selection
  $('li[id^="crimen"]').removeClass('active');

  // Identifies crime name and id
  crimeName = $(this).attr("id").substring(9);
  selectCrime = $(this).attr("id").substring(7,8);

  // Add active class to selection
  $('#crimen-' + selectCrime + '-' + crimeName).addClass('active');

  // Reload map
  processDataMap(selectYear, selectCrime, crimeName);
});

/* Creates legend */
function createLegend(fracDensity){
  // Creates legend
  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, Math.round(fracDensity * 1), Math.round(fracDensity * 2), Math.round(fracDensity * 3),
      Math.round(fracDensity * 4), Math.round(fracDensity * 5), Math.round(fracDensity * 6), Math.round(fracDensity * 7)],
    labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getMapColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
}

/* Initializing Map */
var map = L.map('map').setView([-0.1552205, -78.31939], 10);
var mapboxAccessToken = 'pk.eyJ1IjoiZmxhbmRyYWRlIiwiYSI6ImNpaWhpdHVzMTAwOGV0bWtuazBxNGNndXAifQ.3DaHhvxjyEku11wcUEhDMg';

/* Basemap Layer */
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'flandrade.ogakcbop',
}).addTo(map);

/* Sidebar in order to show crime*/
var sidebar = L.control.sidebar('sidebar-crime', {
    closeButton: true,
    position: 'right'
});

/* Updates sidebar with data according to selection */
sidebar.update = function () {
  // Updates name of Quito
  document.getElementById("sidebar-crimen-titulo").innerHTML = 'Quito';

  // Updates year and total number of crimes
  document.getElementById("sidebar-crimen-year").innerHTML = selectYear;
  document.getElementById("sidebar-crimen-total").innerHTML = Math.round(totalCrime);

  // Updates name of crime
  var crimeNameAll = changeCrime(crimeName);
  document.getElementById("sidebar-crimen-nombre").innerHTML = crimeNameAll;

  // Updates crime of each zonal
  for (var i = 1; i < dataCrime.length + 1; i++) {
    var nameId = "sidebar-crimen-" + i;
    document.getElementById(nameId).innerHTML = Math.round(dataCrime[i-1]) + " " + crimeNameAll;
  }

  // Removes previous SVG and creates new
  if(document.getElementById("sidebar-crimen-logo") instanceof SVGElement) {
    // Removes svg
    document.getElementById("sidebar-crimen-logo").remove();

    // Creates img
    var containerSVG = document.getElementById("sidebar-container-logo");
    console.log(containerSVG);
    var imgLogo = document.createElement('img');
    imgLogo.className = 'svg logo-crime';
    imgLogo.id = 'sidebar-crimen-logo';
    imgLogo.src = 'include/img/svg/' + crimeName + '.svg';
    containerSVG.appendChild(imgLogo);
  }

  // Shows crime list
  document.getElementById("crimenes-list").style.visibility='visible';
  document.getElementById("dato-zonal-crimenes").style.color = '#fff';
  document.getElementById("dato-zonal-crimenes").style.background = "#800026";
};

/* Updates sidebar with data according to selection */
sidebar.updateHover = function (props) {
  // Updates name of zonal
  document.getElementById("sidebar-crimen-titulo").innerHTML = props.properties.zonal;

  // Updates crimes in selected zonal and year
  document.getElementById("sidebar-crimen-total").innerHTML = Math.round(dataCrime[props.id - 1]);
  document.getElementById("sidebar-crimen-year").innerHTML = selectYear;

  // Updates name of crime
  var crimeNameAll = changeCrime(crimeName);
  document.getElementById("sidebar-crimen-nombre").innerHTML = crimeNameAll;

  // Checks if there is a crime list and hides
  var currentList = document.getElementById("crimenes-list");
  if (currentList !== null){
    document.getElementById("crimenes-list").style.visibility='hidden';
  }

  var colorBack = getMapColor(Math.round(dataCrime[props.id - 1] + 1));
  if(colorBack == '#FED976' || colorBack == '#FFEDA0'){
    document.getElementById("dato-zonal-crimenes").style.color = '#000';
  } else{
    document.getElementById("dato-zonal-crimenes").style.color = '#fff';
  }

  document.getElementById("dato-zonal-crimenes").style.background = colorBack;

};

/* Loads JSON of zonales */
var getMapJSON = $.getJSON('data/zonales_quito.geojson', function (data) {
  dataZonales = data;
});

/* Creates map's layers*/
getMapJSON.done(function(){
  // Loads Map Layer according to year and crime
  processDataMap(selectYear, selectCrime, crimeName);

  // Replacing SVG and hiding loading div when loading is completed
  $(document).one("ajaxStop", function () {
    $("#loading").hide();
  });
});
