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
                target: 'map-container',
                pixelRatio: 1
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

            // Request permissions to scan for iBeacons
            app.requestPermissions();

            // Start scanning for iBeacons
            app.scanForBeacons();
        },
        function(error) {
            alert('Could not load map data: ' + error);
        });
    },

    // Requests the necessary bluetooth permissions to scan for beacons
    requestPermissions: function() {
        
        // On iOS, there is SDK support to request bluetooth permissions:
        if(device.platform.toLowerCase() == "ios") {
            Movin.MovinIOS.requestWhenInUseAuthorization();
        } 
        
        // On Android, use a plugin for this
        else if(device.platform.toLowerCase() == "android") {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, 
                // Success method
                function(status) {
                    if(!status.hasPermission) {
                        alert("Permission denied!");
                    } else {
                        console.log("Received location permission")
                    }
                },
                // Error method
                function() {
                    alert("Permission denied!");
                }
            )
        }
    },

    // Starts scanning for beacons
    scanForBeacons: function() {
        var beaconScanner = Movin.MovinSDK.beaconScanner;

        // Add the map to the beacon scanner, so it can scan for the beacons found in the map
        beaconScanner.addMap(this.map);

        // Start the beaconScanner with a listener
        beaconScanner.start({
            
            // Check if the scanned beacon can be used as the nearest beacon (i.e. to determine the current room)
            isValidNearestBeacon: function(rangedBeacon) {
                // Make sure the ranged beacon is known in the database and has a location attached to it
                return rangedBeacon.beacon && rangedBeacon.beacon.position;
            },

            // When a new beacon became the nearest beacon, or no more valid beacons are seen, this method is called
            onNearestBeaconChanged: function(rangedBeacon) {
                if(!rangedBeacon) {
                    // No longer near any valid beacons (in this case beacons with a known location in our database)
                    // Do something with this information, i.e. unhighlight any previous highlight
                    console.log("No longer near any valid beacons")
                } else {
                    // Found a nearest beacon, of which we know for sure it has a position
                    var beaconPosition = rangedBeacon.beacon.position;
                    // Do something with this position, such as get the underlying room entity
                    app.map.getEntitiesInShape(beaconPosition.position, beaconPosition.floor)
                    .then(
                        function(entities) {
                            // Try to find the room entity at this beacon position
                            var roomEntity = null;
                            for(var entity of entities) {
                                if(entity.subType.baseType == "Room") {
                                    roomEntity = entity;
                                }
                            }

                            // Do something with the room entity, i.e. highlight it
                            if(roomEntity) {
                                console.log("Near a room entity!");
                            } else {
                                console.log("Near a beacon that is not in a room entity. Beacon: ", JSON.stringify(rangedBeacon.beaconIdentifier));
                            }
                        },
                        function(error) {
                            alert(error);
                        }
                    )
                }
            },

            // Called each second to inform you of all nearby beacons
            onBeaconsRanged: function(rangedBeacons) {
                // Do something with this information
                // For now, log the first 5 beacons (they are sorted, so they are also the 5 nearest beacons)
                for(var i = 0; i < Math.min(5, rangedBeacons.length); i++) {
                    console.log("Ranged a beacon at " + rangedBeacons[i].distance + "m distance: " + JSON.stringify(rangedBeacons[i].beaconIdentifier));
                }
            }
        })
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
