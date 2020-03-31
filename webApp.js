// Reference: Programming Patterns - Link: https://developers.arcgis.com/javascript/latest/guide/programming-patterns/
// To load the Map, MapView, and FeatureLayer class: pass them through the require()
// and use their local variable names (Map, Mapview, and FeatureLayer) as the positional arguments for the callback function
require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"],
  function(Map, MapView, FeatureLayer) {

// Reference: Programming Patterns - Link: https://developers.arcgis.com/javascript/latest/guide/programming-patterns/
// Pass parameters to the constructor to set class properties
    var map = new Map({
      basemap: "topo-vector"
    });

    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-78.042512, 44.085821],
      zoom: 12
    });
    
// Reference: Filter a Feature Layer - Link: https://developers.arcgis.com/javascript/latest/guide/filter-a-feature-layer/
// Add a feature layer to map with all features visible (no filter)
  var featureLayer = new FeatureLayer({
      url: "https://services1.arcgis.com/pMeXRvgWClLJZr3s/arcgis/rest/services/PrescribedBurn/FeatureServer/0",
      outFields: ["*"],  // Return all fields to client
      popupTemplate: {  // Enable a popup on client
        title: "{Year}", // Show field value
        content: "This burn was completed in {Year}."  // Show field value
      }
    });

    map.add(featureLayer);

    // Create a UI with the filter expressions
    var sqlExpressions = ["Year = 2006", "Year = 2007", "Year = 2008", "Year = 2009", "Year = 2010", "Year = 2010", "Year = 2011", "Year = 2012", "Year = 2013", "Year = 2014", "Year = 2015", "Year = 2016", "Year = 2017", "Year = 2018", "Year = 2019", "Year = 2020"];

    var selectFilter = document.createElement("select");
    selectFilter.setAttribute("class", "esri-widget esri-select");
    selectFilter.setAttribute("style", "width: 275px; font-family: Avenir Next W00; font-size: 1em;");
    sqlExpressions.forEach(function(sql){
      var option = document.createElement("option");
      option.value = sql;
      option.innerHTML = sql;
      selectFilter.appendChild(option);
    });
    view.ui.add(selectFilter, "top-right");

    selectFilter.addEventListener('change', function (event) {
      // Server side
      setFeatureLayerFilter(event.target.value);
      // Client side
      setFeatureLayerViewFilter(event.target.value);
    });

    // Server-side filter
    function setFeatureLayerFilter(expression) {featureLayer.definitionExpression = expression;}

    // Client-side filter
    function setFeatureLayerViewFilter(expression) {
      view.whenLayerView(featureLayer).then(function(featureLayerView) {
        featureLayerView.filter = {
          where: expression
        };
        //*** CHALLENGE - Style the excluded features ***//
        // featureLayerView.effect = {
        //   filter: {
        //     where: expression
        //   },
        //   excludedEffect: "opacity(50%)"
        // }
      });
    }

    //*** CHALLENGE: Find and highlight features ***//

//       var highlight;

//       view.whenLayerView(featureLayer).then(function(featureLayerView) {
//         view.on("pointer-move", function(event){
//           view.hitTest(event).then(function(response){
//             // Only return features for the feature layer
//             var feature = response.results.filter(function (result) {
//              return result.graphic.layer === featureLayer;
//             })[0].graphic;
//             if (highlight) {
//              highlight.remove();
//             }
//             // Highlight feature
//             highlight = featureLayerView.highlight(feature);
//           });
//         });
//       });
  });

