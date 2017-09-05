// The configuration for the app. Configure this before running the app.
var config = {
    // The customer name ( from https://<customer>.movin.io ).
    customer: "<customer>",
    // An API key which can be retrieved from the Movin Portal.
    apikey: "<API key>", 
    // An identifier of a map which can be retrieved from the Movin Portal.
    mapid: "<map id>"
};

var app = {
    // Indicates whether all data is ready for the app.
    isReady: false,
    // Contains the map loaded using the config.mapid value.
    map: null,
    // The OpenLayers source to which features can be added.
    olSource: null,

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this),
            false);
    },

    onDeviceReady: function() {
        // Initialize the Movin SDK with the specified customer and API key.
        // The Movin SDK works a lot with JavaScript Promises. A promise is
        // returned when initialize is called, which will be resolved once
        // the SDK has loaded.
        Movin.MovinSDK.initialize(config.customer, config.apikey)
        .then(function(){
            // Call onSDKInitialized once the SDK has been initialized.
            app.onSDKInitialized();
        }, function(error){
            // If the SDK fails to initialize, show an alert.
            alert('Movin SDK failed to initialize: ' + error);
        });

        // When the search form is submitted, call highlightName with the
        // value entered in the form.
        var input = document.querySelector('.search #searchName');
        document.querySelector('.search form').onsubmit = function() {
            var query = input.value;
            input.blur();

            app.highlightName(query);

            return false;
        };
    },

    // This method is called once the Movin SDK has been initialized.
    onSDKInitialized: function() {
        // Fetch the map we'll be using based on the configured map identifier.
        this.map = Movin.MovinSDK.maps[config.mapid];
        
        // Download the map data (buildings and entites) so we can use it to
        // search the entities later on. The data will be loaded from the cache
        // if it has been loaded previously.
        this.map.downloadMapData()
        .then(function(){
            // Set the ready flag so we know we can start searching.
            app.isReady = true;

            // Create the OL Map.
            var olMap = new MovinOL.MovinOLMap({
                target: 'map-container'
            });

            // Add world map layer
            let groundLayer = new ol.layer.Tile(
                {
                    source: new ol.source.OSM(),
                    opacity: 0.35
                }
            );
            groundLayer.setZIndex(0);
            olMap.addLayer(groundLayer);
            
            // Load the Movin Map into the OL Map.
            olMap.setMovinMap(app.map, {
                fitToMap: true
            }).then(function(){console.log('ok');}, function(e){console.error(e);});

            // Create an OL source and layer for drawing the highlighed feature and
            // add it to the OL map at Z-index 2.
            app.olSource = new ol.source.Vector();
        
            var layer = new ol.layer.Vector({
                source: app.olSource,
                style: function(featureObject) {
                    return [
                        new ol.style.Style({
                            fill: new ol.style.Fill({color: "rgba(255, 0, 0, 0.4)"})
                        })
                    ]
                }
            });
    
            layer.setZIndex(2);
            
            olMap.addLayer(layer);
        },
        function(error) {
            alert('Could not load map data: ' + error);
        });
    },

    // Finds the first "Room" entity which contains the specified text in
    // the name of the entity.
    searchEntity: function(query) {
        // Validate the input.
        if(query == null || query.length == 0) {
            return null;
        }

        // Search in lower case.
        query = query.toLowerCase();

        // Find the first entity of base type "Room" which as a name containing
        // the specified search query.
        return this.map.entities.find(function(entity) {
            return entity.subType.baseType == "Room" && 
            entity.name != null && 
            entity.name.toLowerCase().indexOf(query) !== -1;
        });
    },

    // Highlights the room which contains the specified text in the name of the
    // entity.
    highlightName: function(query) {
        // If the search data is not yet ready, return.
        if(!this.isReady) {
            return;
        }

        // Find the entity containing the specified search query in its name.
        var entity = this.searchEntity(query);

        // If no entity was found, show an alert and return.
        if(entity == null) {
            alert('Could not find "' + query + '".');
            return;
        }

        // Convert the entity's geometry to the GeoJSON format. The entity's
        // geometry is of type GeoPolygon. In a future version of
        // movinsdk-cordova simply calling entity.geometry.toJson() will
        // provide the data in GeoJSON format.
        var rings = [];
        for(var i = 0; i < entity.geometry.rings.length; i++) {
            var points = [];
            for(var j = 0; j < entity.geometry.rings[i].points.length; j++) {
                points.push([
                    entity.geometry.rings[i].points[j].lng, 
                    entity.geometry.rings[i].points[j].lat
                ]);
            }

            rings.push(points);
        }

        // Create a GeoJSON feature of the entity.
        var featureJson = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: rings
            }
        };

        // Create a converter to convert the GeoJSON feature to an OL feature.
        var converter = new ol.format.GeoJSON({
            featureProjection: "EPSG:3857"
        });

        // Convert the feature to an OL feature.
        var feature = converter.readFeature(featureJson);

        // Replace any previously added feature with the new feature on the OL layer source.
        this.olSource.clear();
        this.olSource.addFeature(feature);

        // Lastly, show an alert indicating which entity has been highlighted.
        alert('Highlighted "' + entity.name + '".');
    }
};

app.initialize();
