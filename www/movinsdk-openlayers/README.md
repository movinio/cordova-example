# MovinSDK Openlayers
The movinsdk-openlayers package allows you to quickly show your Movin indoor map using the [Openlayers](https://openlayers.org/) library.

## Dependencies
This project relies on the Javascript MovinSDK and the Openlayers library.

For the Javascript MovinSDK you can use either the [Web](...) or [Cordova](...) version.

For Openlayers you must install at least version 4.3.0:
```
npm install openlayers@4.3.0 --save
```

### Typescript support
A typescript definition file is available in the package. To enable the definition file in your project you may need to add 
```
/// <reference types="movinsdk-openlayers" />
``` 
add the top of your Javascript files.

## Getting started
Install the package using npm. This is the same package regardless if you use the Web or Cordova MovinSDK.

```
npm install movinsdk-openlayers --save
```

Include the Javascript and CSS in your project.
```
<html>
    <head>
        ...

        <link rel="stylesheet" type="text/css" href="movinsdk-openlayers.css">

        <script type="text/javascript" src="movinsdk-openlayers.js"></script>

        ...
    </head>
    <body>
        ...

        <!-- We will attach the indoor map to this div -->
        <div id="map-container">
    </body>
</html>
```

A minimal Javascript example to initialize the MovinSDK and display an indoor map would look like this:

```
// Initialize the SDK
Movin.MovinSDK.initialize("CUSTOMER_NAME_HERE", "API_KEY_HERE").then(
    function(result) {
        // Retrieve map object by id.
        var activeMovinMap = Movin.MovinSDK.maps["MAP_ID_HERE"];

        // Download the map data.
        activeMovinMap.downloadMapData().then(
            function() {
                // Create ol map. The MovinOLMap object inherits from
                // the ol.Map (https://openlayers.org/en/master/apidoc/ol.Map.html)
                // object. Therefore anything you can do with an ol.Map object
                // you can do with the MovinOLMap object.
                var olMap = new MovinOL.MovinOLMap({
                    target: "map-container"
                });

                // Set active map with the fitToMap option set to true.
                // This will move the camera to the map.
                olMap.setMovinMap(activeMovinMap, {
                    fitToMap: true
                });
            }
        );
    }
);
```

By default you will see an indoor map with the `Default` layer, `Default` style and a floor switcher in the bottom left corner. The start floor will be the lowest available floor number.

## Advanced usage
Below you will find several advanced examples.

### Changing layer and style
To set a different layer and style when initializing the map do:
```
olMap.setMovinMap(activeMovinMap, {
    tileLayer: "HDPI",
    tileStyle: "CustomStyle"
});
```

To change it after you have set the Movin map you must manually create a MovinTileProvider:
```
// First get the tile manifest. The tile manifest contains all
// information about the layers and styles available.
var movinMap = Movin.MovinSDK.maps["MAP_ID_HERE"];
movinMap.getTileManifest().then(
    function(manifest) {
        // Create tile provider passing along the new style and layer.
        var promise = Movin.MovinTileProvider.create(
            manifest.styles["CustomStyle"],
            manifest.layers["HDPI"]
        ).then(
            function(provider) {
                // Set the new tile provider on the MovinOLMap object.
                olMap.setTileProvider(provider);
            }
        );
    }
);
```

### Customizing the floor switcher

#### Hiding/showing the floor switcher
To disable the floor switcher on the MovinOLMap object do:
```
olMap.getFloorSwitcherControl().hide();
```

To make the floor switcher visible again do:
```
olMap.getFloorSwitcherControl().show();
```

#### Moving the floor switcher
To move the floor switcher to a different corner do:
```
olMap.getFloorSwitcherControl().setLocation(location);
```

Available options for `location` are:
- "top-right"
- "top-left"
- "bottom-right"
- "bottom-left"

#### Styling the floor switcher
You can override the default styling of the floor switcher by adding custom CSS.

For example the below CSS will make the floor switcher gray instead of blue:
```
.custom-fs.ol-control button{
    background-color: #404040;
}
.custom-fs.ol-control button:hover {
    background-color: #606060;
}
.custom-fs .floors-container button.active-floor {
    background-color: #303030;
}
```

Next we have to change the class name of the floor switcher:
```
olMap.getFloorSwitcherControl().setClassName("custom-fs");
```