var map = L.map("map", { attributionControl: false,center: [-33.67492567436574, -65.46117782592773], zoom: 13, zoomControl: false}); //VM
L.control.zoom({position: "topleft"}).addTo(map);

var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap<\/a> contributors',
        minZoom: 10,
        zoomControl: false
}).addTo(map);



/// ---- Polígono  ----

var ZonaEstacion = [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
                -65.44673681259155,
                -33.66215696633675
              ],
              [
                -65.45364618301392,
                -33.66053172207191
              ],
              [
                -65.46072721481322,
                -33.66299636618664
              ],
              [
                -65.46171426773071,
                -33.66651461262078
              ],
              [
                -65.44883966445923,
                -33.669211242167954
              ],
              [
                -65.44673681259155,
                -33.66215696633675
              ]
          ]
        ]
      }
    }
  ];

  var ZonaCentro = [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
                -65.46669244766235,
                -33.6796576511046
              ],
              [
                -65.46913862228394,
                -33.687674632349214
              ],
              [
                -65.46377420425415,
                -33.688799449636555
              ],
              [
                -65.4614782333374,
                -33.6808182848726
              ],
              [
                -65.46669244766235,
                -33.6796576511046
              ]
          ]
        ]
      }
    }
  ];

  
  
  function stylePolygon(feature) {
    return {
      weight: 1, // grosor de línea
      color: '#860e4f', // color de línea
      opacity: 0.9, // tansparencia de línea
      fillColor: '#860e4f', // color de relleno
      fillOpacity: 0.6 // transparencia de relleno
    };
  };
  
  var polygon = new L.geoJson(ZonaEstacion, {
    style: stylePolygon
  }).addTo(map);

  var polygon1 = new L.geoJson(ZonaCentro, {
    style: stylePolygon
  }).addTo(map);
  
  
  var overlayMaps = {
    "Zona Estacion": polygon,
    "Zona Centro": polygon1
  };
  
  L.control.layers(null, overlayMaps,{
    position: 'topright', // 'topleft', 'bottomleft', 'bottomright'
    collapsed: false // true
  }).addTo(map);