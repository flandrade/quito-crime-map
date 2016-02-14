# Interactive Choropleth Crime Map of Quito

Interactive Choropleth Crime Map of Quito made with [Leaflet](http://leafletjs.com/), [Bootstrap](http://getbootstrap.com/) and [Leaflet-sidebar](https://github.com/Turbo87/leaflet-sidebar).

Inspired by the [NYPD Crime Map](https://maps.nyc.gov/crime/), I created an [interactive crime map of Quito](http://flandrade.github.io/quito-crime-map/). This map shows the crime rate by category and year, as reported to Policía Nacional del Ecuador. The administrative areas are shaded according to crime rate per 100,000 population.

Data was collected from [Datos Abiertos](http://datosabiertos.quito.gob.ec/), the official government site for open government. The crime categories represented here are the same categories used by the Police such as murders, motor vehicle theft, burglary and robbery.

## Demo:

http://flandrade.github.io/quito-crime-map/

## Maps

I created two GeoJSON Quito maps. The first includes the borders of [administraciones zonales](https://github.com/flandrade/quito-crime-map/blob/master/data/zonales_quito.geojson), and the second includes the borders of [parroquias](https://github.com/flandrade/quito-crime-map/blob/master/data/parroquias_quito.geojson).  

This app uses 'administraciones zonales'.

## Data

Crime and population data were collected from [Datos Abiertos](http://datosabiertos.quito.gob.ec/) and [Ecuador en cifras](http://www.ecuadorencifras.gob.ec/informacion-censal-cantonal/).

While the data of "administraciones-zonales" were collected from a GIS file of [Datos Abiertos](http://datosabiertos.quito.gob.ec/), the data of "parroquias" were collected from [OpenStreetMap](http://wiki.openstreetmap.org/wiki/WikiProject_Ecuador).
