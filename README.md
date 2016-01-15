# Interactive Choropleth Crime Map of Quito

Interactive Choropleth Crime Map of Quito made with [Leaflet](http://leafletjs.com/), [Bootstrap](http://getbootstrap.com/) and [Leaflet-sidebar](https://github.com/Turbo87/leaflet-sidebar).

You can read about the development process and methodology in my blog.

## Features
Crime in Quito (2013 - 2014):
- Murders
- Motor vehicle theft
- Burglary
- Robbery

## Demo:

http://flandrade.github.io/quito-crime-map/

## Data

Crime and population data were collected from [Datos Abiertos](http://datosabiertos.quito.gob.ec/) and [Ecuador en cifras](http://www.ecuadorencifras.gob.ec/informacion-censal-cantonal/).

I created two GeoJSON Quito maps. The first includes the borders of (administraciones zonales)[https://github.com/flandrade/quito-crime-map/blob/master/data/zonales_quito.geojson], and the second includes the borders of [parroquias](https://github.com/flandrade/quito-crime-map/blob/master/data/parroquias_quito.geojson).   

While the data of "administraciones-zonales" were collected from a GIS file of [Datos Abiertos](http://datosabiertos.quito.gob.ec/), the data of "parroquias" were collected (from OpenStreetMap)[http://wiki.openstreetmap.org/wiki/WikiProject_Ecuador].

This app uses 'administraciones zonales'.
