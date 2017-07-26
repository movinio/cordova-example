// The configuration for the app. Configure this before running the app.
var config = {
    // The customer name ( from https://<customer>.movin.io ).
    customer: "<customer>",
    // An API key which can be retrieved from the Movin Portal.
    apikey: "<apikey>", 
    // An identifier of a map which can be retrieved from the Movin Portal.
    mapid: "<mapid>"
};

var app = {
    // Indicates whether all data is ready for the app.
    isReady: false,
    // Contains the map loaded using the config.mapid value.
    map: null,
    // The OpenLayers source to which features can be added.
    olSource: null,
    // The OpenLayers source in which tiles are loaded.
    tileSource: null,
    // The Movin tile provider which will provide tiles for the OL tile source.
    tileProvider: null,

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
        var input = document.querySelector('.search form');
        input.onsubmit = function() {
            var query = document.querySelector('.search #searchName').value;
            app.highlightName(query);

            input.blur();
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
        },
        function(error) {
            alert('Could not load map data: ' + error);
        });

        // In order to show the map on the OpenLayers map, load the tile
        // manifest which contains information the tile provider needs.
        this.map.getTileManifest()
        .then(function (tileManifest) {
            // Once the tile manifest has been loaded, create a tile provider.
            return Movin.MovinTileProvider.create(tileManifest.defaultStyle,
                tileManifest.defaultLayer);
        })
        .then(function(tileProvider) {
            // Once the tile provider has been loaded, load the OpenLayers map.
            app.tileProvider = tileProvider;
            app.loadOLMap();
        }, function (error) {
            // If any of the loading fails, show the error.
            alert('Failed to load map: ' + error);
        });
    },

    // Loads the OpenLayers map.
    loadOLMap: function() {
        // Find the center of the map. We'll focus the OL map on this location.
        var origin = this.map.geometry.getBoundingBox().origin;

        // Create the OL Map.
        var olMap = new ol.Map({
            target: "map-container",
            view: new ol.View({
                center: ol.proj.transform([origin.lng, origin.lat], 'EPSG:4326', 'EPSG:3857'),
                zoom: 20,
                minZoom: 18,
                maxZoom: 22
            })
        });

        // Create the OL tile source which will provide the tiles to the OL map.
        this.tileSource = new ol.source.XYZ({
            url: '{x},{y},{z}',
            tileLoadFunction: function (imageTile, src) {
                // Convert the tile coord to a simple x, y, zoom the tile
                // provider expects.
                var pos = imageTile.getTileCoord();
                var x = pos[1];
                var y = pos[2] * -1 - 1;
                var zoom = pos[0];

                // Get the requested tile trough the tile provider.
                app.tileProvider.getTile(x, y, zoom).then(function (url) {
                    // If a tile has been provided, the url will contain a
                    // base64 image URL. Set the received tile to the
                    // image tile.
                    if (url !== null) {
                        imageTile.getImage().src = url;
                    }
                }, function (error) {
                    // Log errors which occur while loading tiles.
                    console.log("Tile for " + src + " could not be received: " + error);
                });
            }
        });

        // NOTE: No interface for changing floors has been implemented in this
        // example app. In order to switch to a different floor, call the
        // following fuctions:
        //   $> app.tileProvider.setFloor(2);
        //   $> app.tileSource.refresh();

        // Create a tile layer with the newly created tile source and add it to
        // the OL map at Z-index 1.
        var tileLayer = new ol.layer.Tile({
            source: this.tileSource
        });
        tileLayer.setZIndex(1);
        olMap.addLayer(tileLayer);


        // Create an OL source and layer for drawing the highlighed feature and
        // add it to the OL map at Z-index 2.
        this.olSource = new ol.source.Vector();

        var layer = new ol.layer.Vector({
            source: this.olSource,
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