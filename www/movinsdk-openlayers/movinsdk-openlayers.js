window["MovinOL"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MovinTextSource; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderers_text_TextRenderer__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MovinCanvasSource__ = __webpack_require__(6);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var MovinTextSource = (function (_super) {
    __extends(MovinTextSource, _super);
    function MovinTextSource(olMap, movinMap, floor, layer, rule, renderHelper) {
        var _this = _super.call(this, olMap, movinMap, floor, layer, rule) || this;
        _this.renderHelper = renderHelper;
        _this.renderer = new __WEBPACK_IMPORTED_MODULE_0__renderers_text_TextRenderer__["a" /* TextRenderer */](renderHelper, Movin.MovinSDK.internationalization);
        // Extract render entities
        _this.loadEntities();
        return _this;
    }
    MovinTextSource.prototype.getEntitiesAt = function (coordinate) {
        if (!this.lastRenderResult)
            return [];
        else
            return this.lastRenderResult.getEntitiesAtCoordinate(coordinate);
    };
    MovinTextSource.prototype.renderLayer = function (rule, extent, size, pixelRatio, transform, context) {
        // Get visible entities
        var viewFrustum = _super.prototype.extentToBoundingBox.call(this, extent);
        var visibleEntities = this.spatialDictionary.query(viewFrustum, this.floor);
        this.lastRenderResult = this.renderer.render(this.rule, transform, context, visibleEntities);
        if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING) {
            console.log("MovinTextSource: rendering " + visibleEntities.length + " entities", visibleEntities);
            context.strokeStyle = "green";
            context.lineWidth = 4;
            this.renderHelper.debugRenderSpatialDictionary(this.spatialDictionary, context, transform, this.floor);
            this.lastRenderResult.render(context, transform);
        }
    };
    MovinTextSource.prototype.loadEntities = function () {
        var _this = this;
        // Create spatial dictionary
        this.spatialDictionary = new Movin.GeoSpatialDictionary(this.movinMap.geometry.getBoundingBox(), Movin.GeoSpatialDictionary.DEFAULT_MAX_NODES_IN_CELL, Movin.GeoSpatialDictionary.DEFAULT_MAX_DEPTH);
        this.movinMap.getEntities().then(function (entities) {
            var filteredEntities = entities.filter(function (entity) { return _this.entityIsPartOfRule(entity); });
            // Add entities to spatial dictionary
            for (var _i = 0, filteredEntities_1 = filteredEntities; _i < filteredEntities_1.length; _i++) {
                var entity = filteredEntities_1[_i];
                _this.spatialDictionary.add(entity, entity.geometry, entity.floor);
            }
        }).then(function () { return _super.prototype.changed.call(_this); });
    };
    /**
     * Checks if the given entity should be rendered by this source.
     * @param entity Entity to check
     */
    MovinTextSource.prototype.entityIsPartOfRule = function (entity) {
        if (entity.floor != _super.prototype.getFloor.call(this))
            return false;
        var entitySubType = entity.subType;
        var layerSubType = this.layer.subType;
        if (entitySubType.baseType != layerSubType.baseType)
            return false;
        else if (layerSubType.name && entitySubType.name != layerSubType.name)
            return false;
        else
            return true;
    };
    return MovinTextSource;
}(__WEBPACK_IMPORTED_MODULE_1__MovinCanvasSource__["a" /* MovinCanvasSource */]));



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MovinPOISource; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MovinCanvasSource__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__renderers_Transform__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__renderers_poi_POIRenderer__ = __webpack_require__(14);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var MovinPOISource = (function (_super) {
    __extends(MovinPOISource, _super);
    function MovinPOISource(olMap, movinMap, floor, layer, rule, renderHelper) {
        var _this = _super.call(this, olMap, movinMap, floor, layer, rule) || this;
        _this.renderHelper = renderHelper;
        _this.currentSpatialDictionaryZoom = null;
        _this.currentSpatialDictionaryRotation = null;
        _this.renderer = new __WEBPACK_IMPORTED_MODULE_2__renderers_poi_POIRenderer__["a" /* POIRenderer */](movinMap, renderHelper);
        _this.loadEntities();
        return _this;
    }
    MovinPOISource.prototype.getEntitiesAt = function (coordinate) {
        if (!this.lastRenderResult)
            return [];
        else
            return this.lastRenderResult.getEntitiesAtCoordinate(coordinate);
    };
    MovinPOISource.prototype.renderLayer = function (rule, extent, size, pixelRatio, transform, context) {
        // Did the zoom or rotation change?
        var currentZoom = this.olMap.getView().getZoom();
        var currentRotation = this.olMap.getView().getRotation();
        if (currentZoom != this.currentSpatialDictionaryZoom || currentRotation != this.currentSpatialDictionaryRotation) {
            // Recreate spatial dictionary
            this.createSpatialDictionary(transform);
            this.currentSpatialDictionaryZoom = currentZoom;
            this.currentSpatialDictionaryRotation = currentRotation;
        }
        var viewFrustum = _super.prototype.extentToBoundingBox.call(this, extent);
        var entities = this.spatialDictionary.query(viewFrustum, this.floor);
        this.lastRenderResult = this.renderer.renderRule(rule, transform, context, entities);
        if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING) {
            console.log("MovinPOISource: rendering " + entities.length + " entities", entities);
            context.strokeStyle = "green";
            context.lineWidth = 4;
            this.renderHelper.debugRenderSpatialDictionary(this.spatialDictionary, context, transform, this.floor);
            if (this.lastRenderResult)
                this.lastRenderResult.render(context, transform);
        }
    };
    MovinPOISource.prototype.createSpatialDictionary = function (transform) {
        this.spatialDictionary = new Movin.GeoSpatialDictionary(this.movinMap.geometry.getBoundingBox(), Movin.GeoSpatialDictionary.DEFAULT_MAX_NODES_IN_CELL, Movin.GeoSpatialDictionary.DEFAULT_MAX_DEPTH);
        for (var _i = 0, _a = this.filteredEntities; _i < _a.length; _i++) {
            var entity = _a[_i];
            var bounding = this.renderer.computeRenderedPOIGeoAABB(entity, this.rule, transform);
            this.spatialDictionary.add(entity, bounding, this.floor);
        }
    };
    MovinPOISource.prototype.loadEntities = function () {
        var _this = this;
        this.movinMap.getEntities().then(function (entities) {
            _this.filteredEntities = entities.filter(function (entity) { return _this.entityIsPartOfRule(entity); });
        }).then(function () { return _super.prototype.changed.call(_this); });
    };
    MovinPOISource.prototype.initializeSpatialDictionariesForEntity = function (entity, extent, size, pixelRatio) {
        for (var i = 18; i <= 22; i++) {
            var transform = new __WEBPACK_IMPORTED_MODULE_1__renderers_Transform__["a" /* Transform */](this.olMap, size, extent, pixelRatio, this.olMap.getView().getRotation());
            var spatialDictionary = this.spatialDictionary[i];
            if (!spatialDictionary) {
                spatialDictionary = new Movin.GeoSpatialDictionary(this.movinMap.geometry.getBoundingBox(), Movin.GeoSpatialDictionary.DEFAULT_MAX_NODES_IN_CELL, Movin.GeoSpatialDictionary.DEFAULT_MAX_DEPTH);
                this.spatialDictionary[i] = spatialDictionary;
            }
            var boundingBox = this.renderer.computeRenderedPOIGeoAABB(entity, this.rule, transform);
            if (boundingBox)
                spatialDictionary.add(entity, boundingBox, this.floor);
        }
    };
    /**
     * Checks if the given entity should be rendered by this source.
     * @param entity Entity to check
     */
    MovinPOISource.prototype.entityIsPartOfRule = function (entity) {
        if (entity.floor != _super.prototype.getFloor.call(this))
            return false;
        var entitySubType = entity.subType;
        var layerSubType = this.layer.subType;
        if (entitySubType.baseType != layerSubType.baseType)
            return false;
        else if (layerSubType.name && entitySubType.name != layerSubType.name)
            return false;
        else
            return true;
    };
    return MovinPOISource;
}(__WEBPACK_IMPORTED_MODULE_0__MovinCanvasSource__["a" /* MovinCanvasSource */]));



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MovinLayerFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sources_MovinTileSource__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sources_MovinTextSource__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sources_MovinPOISource__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sources_renderers_cache_ImageCacher__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sources_renderers_cache_FontCacher__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sources_renderers_RenderHelper__ = __webpack_require__(8);






/**
 * Factory for creating Movin specific Openlayers layers.
 *
 * This factory is also responsible for caching fonts and images.
 */
var MovinLayerFactory = (function () {
    function MovinLayerFactory() {
        this.imageCacher = new __WEBPACK_IMPORTED_MODULE_3__sources_renderers_cache_ImageCacher__["a" /* ImageCacher */]();
        this.fontCacher = new __WEBPACK_IMPORTED_MODULE_4__sources_renderers_cache_FontCacher__["a" /* FontCacher */]();
        this.renderHelper = new __WEBPACK_IMPORTED_MODULE_5__sources_renderers_RenderHelper__["a" /* RenderHelper */](this.fontCacher, this.imageCacher);
    }
    MovinLayerFactory.getInstance = function () {
        return MovinLayerFactory.instance;
    };
    /**
     * Prepares the image and font cache for use of the given MovinTileStyle.
     *
     * This function will preload all icons and fonts.
     * @param style
     */
    MovinLayerFactory.prototype.prepareCache = function (map, style) {
        return Promise.all([
            this.fontCacher.prepareFontCacheForStyle(style),
            this.imageCacher.prepareImageCacheForMap(map)
        ]).then();
    };
    /**
     * Constructs a new ol.layer.Tile layer configured to display Movin tiles.
     * @param map The map to get tiles for.
     * @param floor The floor to get tiles for.
     * @param movinLayer The layer to get tiles for.
     * @param movinStyle The style to get tiles for.
     */
    MovinLayerFactory.prototype.createMovinTileLayer = function (tileProvider) {
        var layer = new ol.layer.Tile({
            source: new __WEBPACK_IMPORTED_MODULE_0__sources_MovinTileSource__["a" /* MovinTileSource */](tileProvider)
        });
        layer.setZIndex(1);
        return layer;
    };
    /**
     * Constructs a new ol.layer.Image layer configured to draw text.
     * @param map The map to draw text for.
     * @param floor The floor to draw text for.
     * @param movinRule The rule to use when styling the text.
     * @param index The z index of the layer.
     */
    MovinLayerFactory.prototype.createMovinTextLayer = function (olMap, movinMap, floor, movinLayer, movinRule, index) {
        var layer = new ol.layer.Image({
            source: new __WEBPACK_IMPORTED_MODULE_1__sources_MovinTextSource__["a" /* MovinTextSource */](olMap, movinMap, floor, movinLayer, movinRule, this.renderHelper)
        });
        layer.setZIndex(index);
        return layer;
    };
    /**
     * Constructs a new ol.layer.Image layer configured to draw POIs.
     * @param map The map to draw POIs for.
     * @param floor The floor to draw POIs for.
     * @param movinRule The rule to use when styling the POIs.
     * @param index The z index of the layer.
     */
    MovinLayerFactory.prototype.createMovinPOILayer = function (olMap, movinMap, floor, movinLayer, movinRule, index) {
        var layer = new ol.layer.Image({
            source: new __WEBPACK_IMPORTED_MODULE_2__sources_MovinPOISource__["a" /* MovinPOISource */](olMap, movinMap, floor, movinLayer, movinRule, this.renderHelper)
        });
        layer.setZIndex(index);
        return layer;
    };
    MovinLayerFactory.instance = new MovinLayerFactory();
    return MovinLayerFactory;
}());



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MovinTileSource; });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MovinTileSource = (function (_super) {
    __extends(MovinTileSource, _super);
    function MovinTileSource(tileProvider) {
        var _this = _super.call(this, {
            url: "{x}/{y}/{z}",
            tileLoadFunction: function (tile, src) { return _this.getTileUrl(tile, src); }
        }) || this;
        _this.tileProvider = tileProvider;
        if ({"ENV":"development","DEBUG_RENDERING":false}.ENV == "development") {
            MovinTileSource.initializeDebugReporting();
            _this.on('tileloadstart', function (e) {
                e.tile.startTime = new Date();
            });
            _this.on('tileloadend', function (e) {
                var totalTime = new Date().getTime() - e.tile.startTime.getTime();
                MovinTileSource.totalTileLoadTime += totalTime;
                MovinTileSource.totalTilesLoaded++;
            });
            _this.on('tileloaderror', function () {
                MovinTileSource.totalTileLoadErrors++;
            });
        }
        _this.createTransparentTileUrl();
        return _this;
    }
    MovinTileSource.initializeDebugReporting = function () {
        if (MovinTileSource.debugReportingInitialized)
            return;
        setInterval(function () {
            // Print debug stats
            console.info("---- TileSource Stats ----");
            console.info("Total tiles loaded = " + MovinTileSource.totalTilesLoaded);
            console.info("Total tiles failed to load = " + MovinTileSource.totalTileLoadErrors);
            console.info("Average tile load time = " + Math.round(MovinTileSource.totalTileLoadTime / MovinTileSource.totalTilesLoaded) + "ms");
        }, MovinTileSource.debugReportingInterval);
        MovinTileSource.debugReportingInitialized = true;
    };
    MovinTileSource.prototype.createTransparentTileUrl = function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.tileProvider.layer.tileWidth;
        canvas.height = this.tileProvider.layer.tileHeight;
        var context = canvas.getContext("2d");
        context.fillStyle = "rgba(0, 0, 0, 0.0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        this.transparentTileUrl = canvas.toDataURL();
    };
    MovinTileSource.prototype.getTileUrl = function (tile, src) {
        var _this = this;
        var imageTile = tile;
        var image = imageTile.getImage();
        var coord = imageTile.getTileCoord();
        var x = coord[1];
        var y = -coord[2] - 1;
        var zoom = coord[0];
        this.tileProvider.getTile(x, y, zoom).then(function (url) {
            image.src = url || _this.transparentTileUrl;
        }, function (error) {
            image.src = _this.transparentTileUrl;
            console.error("Failed to get tile url: " + error);
        });
    };
    MovinTileSource.debugReportingInitialized = false;
    MovinTileSource.debugReportingInterval = 30000;
    MovinTileSource.totalTilesLoaded = 0;
    MovinTileSource.totalTileLoadErrors = 0;
    MovinTileSource.totalTileLoadTime = 0;
    return MovinTileSource;
}(ol.source.XYZ));



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenderResult; });
var RenderResult = (function () {
    function RenderResult(usedTransform) {
        this.usedTransform = usedTransform;
        this.results = [];
    }
    RenderResult.prototype.addRenderResult = function (result) {
        this.results.push(result);
    };
    RenderResult.prototype.getEntitiesAtCoordinate = function (coordinate) {
        var pixel = this.usedTransform.coordinateToPixel(coordinate);
        var entities = [];
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var result = _a[_i];
            if (result.pointIsInBox(pixel))
                entities.push(result.entity);
        }
        return entities;
    };
    /**
     * Renders the render result. Used for debugging.
     * @param context
     * @param transform
     */
    RenderResult.prototype.render = function (context, transform) {
        context.save();
        context.strokeStyle = "red";
        context.lineWidth = 2;
        for (var _i = 0, _a = this.results; _i < _a.length; _i++) {
            var result = _a[_i];
            result.render(context, transform);
        }
        context.restore();
    };
    return RenderResult;
}());



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenderResultBox; });
var RenderResultBox = (function () {
    function RenderResultBox(entity, pixelBox) {
        this.entity = entity;
        this.pixelBox = pixelBox;
    }
    RenderResultBox.prototype.pointIsInBox = function (point) {
        for (var i = 0; i < 4; i++) {
            var start = this.pixelBox[i];
            var end = this.pixelBox[(i + 1) % 4];
            var dir = [
                end[0] - start[0],
                end[1] - start[1]
            ];
            dir = [-dir[1], dir[0]];
            var dirToPoint = [
                point[0] - start[0],
                point[1] - start[1]
            ];
            var dot = dir[0] * dirToPoint[0] + dir[1] * dirToPoint[1];
            if (dot < 0)
                return false;
        }
        return true;
    };
    RenderResultBox.prototype.render = function (context, transform) {
        context.beginPath();
        context.moveTo(this.pixelBox[0][0], this.pixelBox[0][1]);
        context.lineTo(this.pixelBox[1][0], this.pixelBox[1][1]);
        context.lineTo(this.pixelBox[2][0], this.pixelBox[2][1]);
        context.lineTo(this.pixelBox[3][0], this.pixelBox[3][1]);
        context.closePath();
        context.stroke();
    };
    return RenderResultBox;
}());



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MovinCanvasSource; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderers_Transform__ = __webpack_require__(7);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var MovinCanvasSource = (function (_super) {
    __extends(MovinCanvasSource, _super);
    function MovinCanvasSource(olMap, movinMap, floor, layer, rule) {
        var _this = _super.call(this, {
            canvasFunction: function (extent, resolution, pixelRatio, size, proj) { return _this.render(extent, resolution, pixelRatio, size, proj); },
            projection: "EPSG:3857",
            ratio: MovinCanvasSource.RATIO
        }) || this;
        _this.olMap = olMap;
        _this.movinMap = movinMap;
        _this.floor = floor;
        _this.layer = layer;
        _this.rule = rule;
        return _this;
    }
    MovinCanvasSource.prototype.render = function (extent, resolution, pixelRatio, size, projection) {
        var canvas = this.getCanvasForSize(size);
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (this.isVisible()) {
            var transform = new __WEBPACK_IMPORTED_MODULE_0__renderers_Transform__["a" /* Transform */](this.olMap, size, extent, pixelRatio, this.olMap.getView().getRotation());
            this.renderLayer(this.rule, extent, size, pixelRatio, transform, context);
        }
        return canvas;
    };
    MovinCanvasSource.prototype.extentToBoundingBox = function (extent) {
        var min = ol.proj.transform([extent[0], extent[1]], "EPSG:3857", "EPSG:4326");
        var max = ol.proj.transform([extent[2], extent[3]], "EPSG:3857", "EPSG:4326");
        var width = max[0] - min[0];
        var height = max[1] - min[1];
        return new Movin.GeoAABB(new Movin.GeoLatLng(min[1] + height / 2, min[0] + width / 2), width, height);
    };
    MovinCanvasSource.prototype.isVisible = function () {
        if (this.hasMinZoom() && this.getZoom() < this.rule.minZoom)
            return false;
        if (this.hasMaxZoom() && this.getZoom() > this.rule.maxZoom)
            return false;
        return true;
    };
    MovinCanvasSource.prototype.hasMinZoom = function () {
        return this.rule.minZoom !== undefined && this.rule.minZoom !== null;
    };
    MovinCanvasSource.prototype.hasMaxZoom = function () {
        return this.rule.maxZoom !== undefined && this.rule.maxZoom !== null;
    };
    MovinCanvasSource.prototype.getZoom = function () {
        return this.olMap.getView().getZoom();
    };
    MovinCanvasSource.prototype.getFloor = function () {
        return this.floor;
    };
    MovinCanvasSource.prototype.getCanvasForSize = function (size) {
        if (!this.canvas)
            this.canvas = document.createElement("canvas");
        if (this.canvas.width != size[0] || this.canvas.height != size[1]) {
            this.canvas.width = size[0];
            this.canvas.height = size[1];
        }
        return this.canvas;
    };
    MovinCanvasSource.RATIO = 1.5;
    return MovinCanvasSource;
}(ol.source.ImageCanvas));



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Transform; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RenderHelper__ = __webpack_require__(8);

var Transform = (function () {
    function Transform(olMap, renderSize, extent, renderPixelRatio, rotation) {
        this.olMap = olMap;
        this.renderSize = renderSize;
        this.extent = extent;
        this.renderPixelRatio = renderPixelRatio;
        this.rotation = rotation;
    }
    Transform.prototype.coordinateToPixel = function (coordinate) {
        // We do not use the olMap getPixelFromCoordinate method because
        // this method does not play nicely with rotated maps.
        coordinate = ol.proj.transform(coordinate, "EPSG:4326", "EPSG:3857");
        var pixel = [
            this.renderSize[0] * (coordinate[0] - this.extent[0]) / (this.extent[2] - this.extent[0]),
            -this.renderSize[1] * (coordinate[1] - this.extent[3]) / (this.extent[3] - this.extent[1]),
        ];
        return pixel;
    };
    Transform.prototype.getWidthPerPixel = function () {
        var fromPixel = [0, 0];
        var toPixel = [100, 0];
        toPixel = Transform.renderHelper.rotatePoint(toPixel, this.getRotation());
        var start = this.olMap.getCoordinateFromPixel(fromPixel);
        var end = this.olMap.getCoordinateFromPixel(toPixel);
        start = ol.proj.transform(start, "EPSG:3857", "EPSG:4326");
        end = ol.proj.transform(end, "EPSG:3857", "EPSG:4326");
        return (end[0] - start[0]) / 100;
    };
    Transform.prototype.getHeightPerPixel = function () {
        var fromPixel = [0, 0];
        var toPixel = [0, 100];
        toPixel = Transform.renderHelper.rotatePoint(toPixel, this.getRotation());
        var start = this.olMap.getCoordinateFromPixel(fromPixel);
        var end = this.olMap.getCoordinateFromPixel(toPixel);
        start = ol.proj.transform(start, "EPSG:3857", "EPSG:4326");
        end = ol.proj.transform(end, "EPSG:3857", "EPSG:4326");
        return (end[1] - start[1]) / 100;
    };
    Transform.prototype.getRotation = function () {
        return this.rotation;
    };
    Transform.prototype.getPixelRatio = function () {
        return this.renderPixelRatio;
    };
    Transform.prototype.getZoom = function () {
        return this.olMap.getView().getZoom();
    };
    Transform.renderHelper = new __WEBPACK_IMPORTED_MODULE_0__RenderHelper__["a" /* RenderHelper */](null, null);
    return Transform;
}());



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenderHelper; });
var RenderHelper = (function () {
    function RenderHelper(fontCacher, imageCacher) {
        this.fontCacher = fontCacher;
        this.imageCacher = imageCacher;
    }
    RenderHelper.prototype.rotatePoint = function (point, angle) {
        return [
            point[0] * Math.cos(angle) - point[1] * Math.sin(angle),
            point[0] * Math.sin(angle) + point[1] * Math.cos(angle)
        ];
    };
    RenderHelper.prototype.applyFill = function (rule, context) {
        context.fillStyle = rule.fill;
    };
    RenderHelper.prototype.applyStrokeBase = function (zoom, rule, context) {
        var strokeWidth = rule.strokeWidth;
        if (rule.strokeIsScaled) {
            // Scale stroke width based on zoom level
            strokeWidth = strokeWidth * Math.pow(2, zoom - rule.strokeZoomLevel);
        }
        context.lineWidth = strokeWidth || 1;
        context.lineJoin = rule.lineJoin || "miter";
        context.lineCap = rule.lineCap || "butt";
        if (rule.dashArray && rule.dashArray.length > 0) {
            context.setLineDash(rule.dashArray);
            context.lineDashOffset = rule.dashOffset || 0;
        }
    };
    RenderHelper.prototype.applyStroke = function (rule, context) {
        context.strokeStyle = rule.stroke;
    };
    RenderHelper.prototype.debugRenderSpatialDictionary = function (spatialDictionary, context, transform, floor) {
        var root = spatialDictionary.getRoot(floor);
        if (root)
            this.debugRenderSpatialCell(root, context, transform);
    };
    RenderHelper.prototype.debugRenderSpatialCell = function (cell, context, transform) {
        // Render nodes
        for (var _i = 0, _a = cell.nodes || []; _i < _a.length; _i++) {
            var node = _a[_i];
            this.debugRenderShape(node.shape, context, transform);
        }
        for (var _b = 0, _c = cell.cells || []; _b < _c.length; _b++) {
            var childCell = _c[_b];
            this.debugRenderSpatialCell(childCell, context, transform);
        }
    };
    RenderHelper.prototype.debugRenderShape = function (shape, context, transform) {
        var points = shape.getPoints();
        context.beginPath();
        for (var i = 0; i < points.length; i++) {
            var point = transform.coordinateToPixel(points[i].asArray());
            if (i == 0)
                context.moveTo(point[0], point[1]);
            else
                context.lineTo(point[0], point[1]);
        }
        context.closePath();
        context.stroke();
    };
    return RenderHelper;
}());



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OLControlFactory; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FloorSwitcherControl__ = __webpack_require__(10);

var OLControlFactory = (function () {
    function OLControlFactory() {
    }
    OLControlFactory.getInstance = function () {
        return OLControlFactory.instance;
    };
    OLControlFactory.prototype.createFloorSwitcherControl = function (movinMap, tileProvider, options) {
        options = options || {};
        options.element = document.createElement("div");
        return new __WEBPACK_IMPORTED_MODULE_0__FloorSwitcherControl__["a" /* FloorSwitcherControl */](movinMap, tileProvider, options);
    };
    OLControlFactory.instance = new OLControlFactory();
    return OLControlFactory;
}());



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FloorSwitcherControl; });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FloorSwitcherControl = (function (_super) {
    __extends(FloorSwitcherControl, _super);
    function FloorSwitcherControl(movinMap, tileProvider, options) {
        var _this = _super.call(this, options) || this;
        _this.movinMap = movinMap;
        _this.tileProvider = tileProvider;
        _this.isOpened = false;
        _this.onFloorChanged = function (newFloor) {
            _this.toggleButton.innerHTML = _this.getFloorName(newFloor);
        };
        _this.className = options.className || "movin-fs";
        _this.location = options.location || "bottom-left";
        _this.hidden = !!options.hidden;
        _this.rootElement = options.element;
        _this.constructHTML(options);
        _this.applyCurrentOptions();
        _this.tileProvider.addFloorChangedListener(_this.onFloorChanged);
        return _this;
    }
    FloorSwitcherControl.prototype.applyCurrentOptions = function () {
        // Set classname and location
        this.rootElement.className = this.className + " movin-fs ol-unselectable ol-control " + this.location;
        // Hide/show
        this.rootElement.style.display = this.hidden ? "none" : "block";
        // Remove other floor button element and add at correct position again.
        if (this.rootElement.contains(this.otherFloorElement))
            this.rootElement.removeChild(this.otherFloorElement);
        if (this.location.startsWith("bottom"))
            this.rootElement.insertBefore(this.otherFloorElement, this.toggleButton);
        else
            this.rootElement.appendChild(this.otherFloorElement);
        // Open/close
        this.toggleButton.className = this.isOpened ? "opened" : "";
        this.otherFloorElement.className = this.isOpened ? "floors-container" : "floors-container closed";
    };
    /**
     * Call when the floor switcher is removed from an ol.Map object.
     *
     * This will unsubscribe from any event handlers.
     */
    FloorSwitcherControl.prototype.destroy = function () {
        this.tileProvider.removeFloorChangedListener(this.onFloorChanged);
    };
    FloorSwitcherControl.prototype.getFloorName = function (floorNumber) {
        var floor = this.movinMap.floors[floorNumber];
        if (floor && floor.abbreviatedName)
            return Movin.MovinSDK.internationalization.translate(floor.abbreviatedName, []);
        else
            return floorNumber.toString();
    };
    /**
     * Gets the current custom class name.
     */
    FloorSwitcherControl.prototype.getClassName = function () {
        return this.className;
    };
    /**
     * Sets a custom class name.
     * @param className
     */
    FloorSwitcherControl.prototype.setClassName = function (className) {
        this.className = className;
        this.applyCurrentOptions();
    };
    /**
     * Gets the current location.
     */
    FloorSwitcherControl.prototype.getLocation = function () {
        return this.location;
    };
    /**
     * Sets the location. Available options:
     * - 'top-left'
     * - 'top-right'
     * - 'bottom-left'
     * - 'bottom-right'
     * @param location
     */
    FloorSwitcherControl.prototype.setLocation = function (location) {
        this.location = location;
        this.close();
        this.applyCurrentOptions();
    };
    /**
     * Returns true if the floor switcher is opened.
     */
    FloorSwitcherControl.prototype.getIsOpened = function () {
        return this.isOpened;
    };
    /**
     * Opens the floor switcher.
     */
    FloorSwitcherControl.prototype.open = function () {
        var _this = this;
        this.isOpened = true;
        // Add floor switch buttons
        var buttons = [];
        var activeFloorButton = null;
        var _loop_1 = function (floorNumber) {
            var floor = this_1.movinMap.floors[floorNumber];
            var otherButton = document.createElement("button");
            otherButton.innerHTML = this_1.getFloorName(floor.floorNumber);
            if (floor.floorNumber == this_1.tileProvider.floor) {
                otherButton.className = "active-floor";
                activeFloorButton = otherButton;
            }
            otherButton.type = "button";
            otherButton.floor = floor.floorNumber;
            otherButton.onclick = function () {
                _this.tileProvider.setFloor(floor.floorNumber);
                _this.close();
            };
            buttons.push(otherButton);
        };
        var this_1 = this;
        for (var floorNumber in this.movinMap.floors) {
            _loop_1(floorNumber);
        }
        // Sort so lowest floor comes first
        buttons.sort(function (a, b) {
            if (_this.location.startsWith("bottom"))
                return b.floor - a.floor;
            else
                return a.floor - b.floor;
        });
        for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
            var button = buttons_1[_i];
            this.otherFloorElement.appendChild(button);
        }
        // Scroll to active floor
        setTimeout(function () {
            _this.otherFloorElement.scrollTop = activeFloorButton.offsetTop - 50;
        });
        this.applyCurrentOptions();
    };
    /**
     * Closes the floor switcher.
     */
    FloorSwitcherControl.prototype.close = function () {
        this.isOpened = false;
        this.otherFloorElement.innerHTML = "";
        this.applyCurrentOptions();
    };
    /**
     * Returns true if the floor switcher is hidden.
     */
    FloorSwitcherControl.prototype.getIsHidden = function () {
        return this.hidden;
    };
    /**
     * Hides the floor switcher.
     */
    FloorSwitcherControl.prototype.hide = function () {
        this.hidden = true;
        this.applyCurrentOptions();
    };
    /**
     * Shows the floor switcher.
     */
    FloorSwitcherControl.prototype.show = function () {
        this.hidden = false;
        this.applyCurrentOptions();
    };
    FloorSwitcherControl.prototype.constructHTML = function (options) {
        var _this = this;
        var location = options.location || "bottom-left";
        this.otherFloorElement = document.createElement("div");
        this.toggleButton = document.createElement("button");
        this.toggleButton.innerHTML = this.getFloorName(this.tileProvider.floor);
        this.toggleButton.type = "button";
        this.toggleButton.onclick = function () {
            if (_this.getIsOpened())
                _this.close();
            else
                _this.open();
        };
        this.rootElement.appendChild(this.toggleButton);
    };
    return FloorSwitcherControl;
}(ol.control.Control));



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MovinOLMap__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MovinLayerFactory__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sources_MovinTileSource__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sources_MovinTextSource__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sources_MovinPOISource__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controls_OLControlFactory__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__controls_FloorSwitcherControl__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MovinOLMap", function() { return __WEBPACK_IMPORTED_MODULE_0__MovinOLMap__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MovinLayerFactory", function() { return __WEBPACK_IMPORTED_MODULE_1__MovinLayerFactory__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MovinTileSource", function() { return __WEBPACK_IMPORTED_MODULE_2__sources_MovinTileSource__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MovinTextSource", function() { return __WEBPACK_IMPORTED_MODULE_3__sources_MovinTextSource__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MovinPOISource", function() { return __WEBPACK_IMPORTED_MODULE_4__sources_MovinPOISource__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "OLControlFactory", function() { return __WEBPACK_IMPORTED_MODULE_5__controls_OLControlFactory__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "FloorSwitcherControl", function() { return __WEBPACK_IMPORTED_MODULE_6__controls_FloorSwitcherControl__["a"]; });










/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MovinOLMap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MovinLayerFactory__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__controls_OLControlFactory__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sources_MovinPOISource__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sources_MovinTextSource__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




/**
 * Wraps an Openlayers Map object.
 */
var MovinOLMap = (function (_super) {
    __extends(MovinOLMap, _super);
    /**
     * Constructs a new MovinOLMap object.
     * @param options olx.MapOptions objects.
     */
    function MovinOLMap(options) {
        var _this = _super.call(this, options) || this;
        _this.internalLayers = [];
        _this.topIndex = 0;
        _this.poiClickHandlers = [];
        _this.textClickHandlers = [];
        _this.onFloorChanged = function (newFloor) {
            _this.initializeMovinMap();
        };
        _this.addInternalEventHandlers();
        return _this;
    }
    /**
     * Adds an event handler which will be fired once a user clicks on a POI.
     * @param handler
     */
    MovinOLMap.prototype.addPOIClickHandler = function (handler) {
        this.poiClickHandlers.push(handler);
    };
    /**
     * Removes a POI click event handler.
     * @param handler
     */
    MovinOLMap.prototype.removePOIClickHandler = function (handler) {
        this.poiClickHandlers.splice(this.poiClickHandlers.indexOf(handler), 1);
    };
    /**
     * Adds an event handler which will be fired once a user click on text.
     * @param handler
     */
    MovinOLMap.prototype.addTextClickHandler = function (handler) {
        this.textClickHandlers.push(handler);
    };
    /**
     * Removes a text click event handler.
     * @param handler
     */
    MovinOLMap.prototype.removeTextClickHandler = function (handler) {
        this.textClickHandlers.splice(this.textClickHandlers.indexOf(handler), 1);
    };
    // Overwrite of base setView method
    MovinOLMap.prototype.setView = function (view) {
        _super.prototype.setView.call(this, view);
        this.addInternalEventHandlers();
    };
    MovinOLMap.prototype.addInternalEventHandlers = function () {
        var _this = this;
        this.getView().on("change:rotation", function () {
            // Map was rotated, call changed method on the sources
            // of all Image layers.
            for (var _i = 0, _a = _this.internalLayers; _i < _a.length; _i++) {
                var internalLayer = _a[_i];
                if (internalLayer instanceof ol.layer.Image) {
                    internalLayer.getSource().changed();
                }
            }
        });
        this.on("click", function (e) {
            var coordinate = ol.proj.transform(e.coordinate, "EPSG:3857", "EPSG:4326");
            var processedPois = false;
            var processedText = false;
            for (var i = _this.internalLayers.length - 1; i >= 0; i--) {
                var internalLayer = _this.internalLayers[i];
                if (!(internalLayer instanceof ol.layer.Image))
                    continue;
                var source = internalLayer.getSource();
                if (!processedPois && source instanceof __WEBPACK_IMPORTED_MODULE_2__sources_MovinPOISource__["a" /* MovinPOISource */]) {
                    var entities = source.getEntitiesAt(coordinate);
                    if (entities.length > 0) {
                        _this.firePOIClickHandler(entities[0], coordinate);
                        processedPois = true;
                    }
                }
                if (!processedText && source instanceof __WEBPACK_IMPORTED_MODULE_3__sources_MovinTextSource__["a" /* MovinTextSource */]) {
                    var entities = source.getEntitiesAt(coordinate);
                    if (entities.length > 0) {
                        _this.fireTextClickHandler(entities[0], coordinate);
                        processedText = true;
                    }
                }
                if (processedPois && processedText)
                    break;
            }
        });
    };
    MovinOLMap.prototype.firePOIClickHandler = function (entity, coordinate) {
        for (var _i = 0, _a = this.poiClickHandlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler(entity, coordinate);
        }
    };
    MovinOLMap.prototype.fireTextClickHandler = function (entity, coordinate) {
        for (var _i = 0, _a = this.textClickHandlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler(entity, coordinate);
        }
    };
    /**
     * Sets the active Movin map.
     * @param map The active MovinMap
     * @param options Optional. An object with options.
     */
    MovinOLMap.prototype.setMovinMap = function (map, options) {
        var _this = this;
        options = options || {};
        options.floorSwitcherControl = options.floorSwitcherControl || {};
        this.movinMap = map;
        this.options = options;
        return map.getTileManifest().then(function (manifest) {
            var tileProviderPromise;
            if (options.tileProvider) {
                // A tile provider is defined in the options object
                tileProviderPromise = Promise.resolve(options.tileProvider);
            }
            else {
                // No tile provider was defined in the options object, we have to create one ourselves.
                // Get tile style
                var tileStyle = manifest.styles[options.tileStyle];
                if (!tileStyle) {
                    if (options.tileStyle)
                        console.warn("Could not find MovinMapStyle '" + options.tileStyle + "', reverting back to default '" + manifest.defaultStyle.name + "'");
                    tileStyle = manifest.defaultStyle;
                }
                // Get tile layer
                var tileLayer = manifest.layers[options.tileLayer];
                if (!tileLayer) {
                    if (options.tileLayer)
                        console.warn("Could not find MovinMapLayer '" + options.tileLayer + "', reverting back to default '" + manifest.defaultLayer.name + "'");
                    tileLayer = manifest.defaultLayer;
                }
                tileProviderPromise = Movin.MovinTileProvider.create(tileStyle, tileLayer);
            }
            return tileProviderPromise;
        }).then(function (tileProvider) {
            // Prepare the MovinMap and download the map translations.
            return Promise.all([
                _this.movinMap.prepareMap(),
                Movin.MovinSDK.internationalization.downloadMapTranslations(_this.movinMap)
            ]).then(function () { return tileProvider; });
        }).then(function (tileProvider) {
            // Fit to map and set the tile provider
            if (options.fitToMap)
                _this.fitToMap();
            return _this.setTileProvider(tileProvider);
        });
    };
    /**
     * Gets the active Movin map.
     */
    MovinOLMap.prototype.getMovinMap = function () {
        return this.movinMap;
    };
    /**
     * Sets the active tile provider.
     * @param tileProvider
     */
    MovinOLMap.prototype.setTileProvider = function (tileProvider) {
        var _this = this;
        if (this.tileProvider)
            this.tileProvider.removeFloorChangedListener(this.onFloorChanged);
        if (this.floorSwitcherControl) {
            // Remove previous floor switcher control.
            this.floorSwitcherControl.destroy();
            _super.prototype.removeControl.call(this, this.floorSwitcherControl);
        }
        this.tileProvider = tileProvider;
        this.tileProvider.addFloorChangedListener(this.onFloorChanged);
        // (re)create the floor switcher. If a floor switcher already exists we copy the options
        // of this floor switcher. Otherwise we revert to the last used options object.
        this.floorSwitcherControl = __WEBPACK_IMPORTED_MODULE_1__controls_OLControlFactory__["a" /* OLControlFactory */].getInstance().createFloorSwitcherControl(this.movinMap, this.tileProvider, {
            location: this.floorSwitcherControl ? this.floorSwitcherControl.getLocation() : this.options.floorSwitcherControl.location,
            className: this.floorSwitcherControl ? this.floorSwitcherControl.getClassName() : this.options.floorSwitcherControl.className,
            hidden: this.floorSwitcherControl ? this.floorSwitcherControl.getIsHidden() : this.options.floorSwitcherControl.hidden
        });
        this.addControl(this.floorSwitcherControl);
        return this.tileProvider.style.prepareStyle().then(function () { return _this.initializeMovinMap(); });
    };
    /**
     * Gets the active tile provider.
     */
    MovinOLMap.prototype.getTileProvider = function () {
        return this.tileProvider;
    };
    /**
     * Gets the floor switcher control.
     */
    MovinOLMap.prototype.getFloorSwitcherControl = function () {
        return this.floorSwitcherControl;
    };
    /**
     * Sets the floor of the active tile provider.
     * @param floor
     */
    MovinOLMap.prototype.setFloor = function (floor) {
        this.tileProvider.setFloor(floor);
    };
    /**
     * Returns the floor of the active tile provider.
     */
    MovinOLMap.prototype.getFloor = function () {
        return this.tileProvider.floor;
    };
    /**
     * Returns the layer index on top of all Movin layers.
     */
    MovinOLMap.prototype.getTopIndex = function () {
        return this.topIndex;
    };
    /**
     * Fits the map view to the active Movin map.
     */
    MovinOLMap.prototype.fitToMap = function () {
        if (!this.movinMap)
            throw new Error("No active Movin map found");
        var boundingBox = this.movinMap.geometry.getBoundingBox();
        var topLeft = boundingBox.topLeft.asArray();
        var bottomRight = boundingBox.bottomRight.asArray();
        topLeft = ol.proj.transform(topLeft, "EPSG:4326", "EPSG:3857");
        bottomRight = ol.proj.transform(bottomRight, "EPSG:4326", "EPSG:3857");
        var extent = [
            topLeft[0],
            bottomRight[1],
            bottomRight[0],
            topLeft[1]
        ];
        this.getView().fit(extent);
    };
    MovinOLMap.prototype.clearInternalLayers = function () {
        for (var _i = 0, _a = this.internalLayers; _i < _a.length; _i++) {
            var internalLayer = _a[_i];
            _super.prototype.removeLayer.call(this, internalLayer);
        }
        this.internalLayers = [];
    };
    /**
     * Initializes the Movin map. This will first remove all internal controls and layers.
     * Next it will recreate them.
     *
     * Calling this function will therefore effectively refresh this MovinOLMap.
     */
    MovinOLMap.prototype.initializeMovinMap = function () {
        var _this = this;
        this.clearInternalLayers();
        if (this.movinMap) {
            __WEBPACK_IMPORTED_MODULE_0__MovinLayerFactory__["a" /* MovinLayerFactory */].getInstance().prepareCache(this.movinMap, this.tileProvider.style).then(function () {
                // All resources succesfully cached!
            }, function (error) {
                // Something could not be cached :(
                console.warn("Caching fonts and images failed (partially)", error);
            }).then(function () {
                _this.prepareInternalLayers();
            });
        }
    };
    /**
     * Creates all text and poi layers as defined by the active map style.
     */
    MovinOLMap.prototype.prepareInternalLayers = function () {
        // Add tile layer
        this.internalLayers = [
            __WEBPACK_IMPORTED_MODULE_0__MovinLayerFactory__["a" /* MovinLayerFactory */].getInstance().createMovinTileLayer(this.tileProvider)
        ];
        var nextLayerIndex = 2;
        for (var _i = 0, _a = this.tileProvider.style.tileStyle.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            var baseType = layer.subType.baseType;
            if (baseType != "Text" && baseType != "POI")
                continue;
            for (var _b = 0, _c = layer.rules; _b < _c.length; _b++) {
                var rule = _c[_b];
                if (rule.preRendered)
                    continue;
                if (baseType == "Text") {
                    this.internalLayers.push(__WEBPACK_IMPORTED_MODULE_0__MovinLayerFactory__["a" /* MovinLayerFactory */].getInstance().createMovinTextLayer(this, this.movinMap, this.tileProvider.floor, layer, rule, nextLayerIndex++));
                }
                else {
                    this.internalLayers.push(__WEBPACK_IMPORTED_MODULE_0__MovinLayerFactory__["a" /* MovinLayerFactory */].getInstance().createMovinPOILayer(this, this.movinMap, this.tileProvider.floor, layer, rule, nextLayerIndex++));
                }
            }
        }
        this.topIndex = nextLayerIndex;
        for (var _d = 0, _e = this.internalLayers; _d < _e.length; _d++) {
            var internalLayer = _e[_d];
            _super.prototype.addLayer.call(this, internalLayer);
        }
    };
    return MovinOLMap;
}(ol.Map));



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RenderResult__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RenderResultBox__ = __webpack_require__(5);


var TextRenderer = (function () {
    function TextRenderer(renderHelper, internationalization) {
        this.renderHelper = renderHelper;
        this.internationalization = internationalization;
    }
    TextRenderer.prototype.render = function (rule, transform, context, entities) {
        var renderResult = new __WEBPACK_IMPORTED_MODULE_0__RenderResult__["a" /* RenderResult */](transform);
        if (!rule.fill)
            return renderResult;
        // Apply the font settings
        this.applyFont(rule, context, transform);
        // Extract the set of visible entities. The below for loop will filter entities 
        // which do not fit within the entity bounding.
        var visibleEntities = [];
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (!(entity.geometry instanceof Movin.GeoPolygon))
                continue;
            // Calculate center
            var center = this.calculateGeometryCenter(entity.geometry);
            var pixel = transform.coordinateToPixel(center);
            var entityBox = this.calculateEntityTextBox(entity, transform);
            var textBox = this.calculateTextBounding(this.getSplitTextFromEntity(entity, rule), pixel, this.getTextRotation(entity, rule, transform), context);
            if (this.boxIsInBox(textBox, entityBox)) {
                visibleEntities.push(entity);
                // Store render result
                renderResult.addRenderResult(new __WEBPACK_IMPORTED_MODULE_1__RenderResultBox__["a" /* RenderResultBox */](entity, [
                    textBox[0],
                    textBox[1],
                    textBox[2],
                    textBox[3]
                ]));
            }
            // Enable the lines below to enable debug drawing of text boxes
            /*context.beginPath();
            context.strokeStyle = "red";
            for(let j = 0; j < textBox.length; j++) {
                let coordinate = textBox[j];
                if(j == 0)
                    context.moveTo(coordinate[0], coordinate[1]);
                else
                    context.lineTo(coordinate[0], coordinate[1]);
            }
            context.closePath();
            context.stroke();*/
        }
        // These settings force the text to be drawn in the center
        context.textAlign = rule.textAlign || "center";
        context.textBaseline = "middle";
        if (rule.hasTextHalo) {
            // Render the halo for the text items first
            context.save();
            context.lineJoin = "round";
            this.applyHalo(rule, context, transform);
            for (var i = 0; i < visibleEntities.length; i++) {
                var entity_1 = visibleEntities[i];
                this.renderText(rule, entity_1, false, this.getTextRotation(entity_1, rule, transform), context, transform);
            }
            context.restore();
        }
        // Apply text filling options
        this.renderHelper.applyFill(rule, context);
        // Render the final text properties
        for (var i = 0; i < visibleEntities.length; i++) {
            var entity_2 = visibleEntities[i];
            this.renderText(rule, entity_2, true, this.getTextRotation(entity_2, rule, transform), context, transform);
        }
        return renderResult;
    };
    TextRenderer.prototype.renderText = function (rule, entity, fill, rotation, context, transform) {
        if (entity.geometry instanceof Movin.GeoPolygon) {
            // Calculate center
            var center = this.calculateGeometryCenter(entity.geometry);
            var pixel = transform.coordinateToPixel(center);
            var lines = this.getSplitTextFromEntity(entity, rule);
            var textHeight = this.calculateTextHeight(lines, context);
            var lineHeight = this.getSingleLineHeight(context);
            if (rule.textAlign != "center") {
                // Adjust the draw pixel for the chosen text alignment
                var vector = [Math.cos(rotation), Math.sin(rotation)];
                var width = this.calculateTextWidth(lines, context) / 2;
                var dist = rule.textAlign == "left" ? -width : width;
                pixel = [
                    pixel[0] + vector[0] * dist,
                    pixel[1] + vector[1] * dist
                ];
            }
            var rotationFlipped = rotation - Math.PI / 2;
            var dirVector = [Math.cos(rotationFlipped), Math.sin(rotationFlipped)];
            // Calculate the start y offset.
            // The y offset is equal to lineHeight * (amountOfLines / 2) - (lineHeight / 2);
            // We must subtract half of the line height because the 
            // text base line is the vertical center of the text.
            var startYOffset = 0;
            if (lines.length > 1)
                startYOffset = lineHeight * Math.floor(lines.length / 2) - (lineHeight / 2);
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                var offset = startYOffset - lineHeight * i;
                var newPixel = [
                    pixel[0] + dirVector[0] * offset,
                    pixel[1] + dirVector[1] * offset
                ];
                context.save();
                context.translate(newPixel[0], newPixel[1]);
                context.rotate(rotation);
                if (fill)
                    context.fillText(line, 0, 0);
                else
                    context.strokeText(line, 0, 0);
                context.restore();
            }
        }
    };
    TextRenderer.prototype.applyHalo = function (rule, context, transform) {
        var lineWidth = rule.textHaloWidth;
        if (rule.scalingType == Movin.MovinTileStyleScaling.scaled) {
            var zoom = transform.getZoom();
            var scaling = zoom - rule.fixedZoomLevel;
            lineWidth *= Math.pow(2, scaling);
        }
        context.strokeStyle = rule.textHaloColor;
        context.lineWidth = lineWidth;
    };
    TextRenderer.prototype.applyFont = function (rule, context, transform) {
        var fontSize = rule.fontSize;
        if (rule.scalingType == Movin.MovinTileStyleScaling.scaled) {
            var zoom = transform.getZoom();
            var scaling = zoom - rule.fixedZoomLevel;
            fontSize *= Math.pow(2, scaling) * transform.getPixelRatio();
        }
        var fontString = "";
        if (rule.isBold)
            fontString += "bold ";
        if (rule.isItalics)
            fontString += "italic ";
        fontString += fontSize + "px " + rule.fontFamily.name;
        context.font = fontString;
    };
    TextRenderer.prototype.getSplitTextFromEntity = function (entity, rule) {
        var text = this.getTextFromEntity(entity, rule);
        text = text.replace(new RegExp("\r", "g"), "");
        return text.split("\n");
    };
    TextRenderer.prototype.getTextFromEntity = function (entity, rule) {
        if (rule.translationKeyProperty) {
            var translationKey = entity.properties[rule.translationKeyProperty];
            if (translationKey) {
                // Read final translated value from translation file
                return this.internationalization.translate(translationKey, []) || "";
            }
            else {
                return "";
            }
        }
        else {
            return entity.properties[rule.textProperty] || "";
        }
    };
    TextRenderer.prototype.getTextRotation = function (entity, rule, transform) {
        if (rule.rotationType == Movin.MovinTileStyleRotation.horizontal)
            return -transform.getRotation();
        else if (rule.rotationType == Movin.MovinTileStyleRotation.rotated)
            return entity.properties.rotation;
        // Add transform rotation now for calculation below. Before returning
        // we remove the transform rotation again because ol3js performs the actual rotation.
        var textRotation = entity.properties.rotation + transform.getRotation();
        // Make sure the rotation is always >= 0 and <= Math.PI * 2
        while (textRotation < 0)
            textRotation += Math.PI * 2;
        textRotation %= Math.PI * 2;
        if (textRotation >= Math.PI / 2 && textRotation <= (Math.PI + Math.PI / 2))
            textRotation += Math.PI;
        return textRotation - transform.getRotation();
    };
    TextRenderer.prototype.calculateGeometryCenter = function (geometry) {
        var total = [0, 0];
        var coordinates = geometry.getPoints();
        for (var j = 0; j < coordinates.length - 1; j++) {
            var coordinate = coordinates[j];
            total[0] += coordinate.lng;
            total[1] += coordinate.lat;
        }
        return [
            total[0] / (coordinates.length - 1),
            total[1] / (coordinates.length - 1)
        ];
    };
    TextRenderer.prototype.calculateTextBounding = function (lines, center, rotation, context) {
        var width = this.calculateTextWidth(lines, context);
        var height = this.calculateTextHeight(lines, context);
        var halfWidth = width / 2;
        var halfHeight = height / 2;
        var box = [
            [
                -halfWidth, -halfHeight
            ],
            [
                halfWidth, -halfHeight
            ],
            [
                halfWidth, halfHeight
            ],
            [
                -halfWidth, halfHeight
            ]
        ];
        // Rotate and translate box
        for (var i = 0; i < box.length; i++) {
            var coordinate = this.rotatePoint(box[i], rotation);
            coordinate[0] += center[0];
            coordinate[1] += center[1];
            box[i] = coordinate;
        }
        return box;
    };
    TextRenderer.prototype.calculateTextWidth = function (lines, context) {
        var width = -1;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var w = context.measureText(line).width;
            if (w > width)
                width = w;
        }
        return width;
    };
    TextRenderer.prototype.calculateTextHeight = function (lines, context) {
        return this.getSingleLineHeight(context) * lines.length;
    };
    TextRenderer.prototype.getSingleLineHeight = function (context) {
        return context.measureText("M").width * 1.2;
    };
    /**
     * Returns a clockwise text box.
     * @param entity
     * @param transform
     */
    TextRenderer.prototype.calculateEntityTextBox = function (entity, transform) {
        var box = [];
        var coordinates = entity.geometry.getPoints();
        var startDir = [
            coordinates[1][0] - coordinates[0][0],
            coordinates[1][1] - coordinates[0][1]
        ];
        var startIndex = 0;
        var endIndex = coordinates.length;
        var increment = 1;
        if (!this.isClockWise(coordinates)) {
            // Counter clock wise direction
            startIndex = coordinates.length - 1;
            endIndex = -1;
            increment = -1;
        }
        for (var i = startIndex; i != endIndex; i += increment) {
            var coordinate = coordinates[i];
            box.push(transform.coordinateToPixel(coordinate.asArray()));
        }
        return box;
    };
    /**
     * Returns true if box1 is completed contained by box2.
     * @param box1 An array with the four coordinates of box1.
     * @param box2 An array with the four coordinates of box2.
     */
    TextRenderer.prototype.boxIsInBox = function (box1, box2) {
        for (var i = 0; i < box1.length; i++) {
            if (!this.pointIsInBox(box1[i], box2))
                return false;
        }
        return true;
    };
    /**
     * Returns true if the given point is inside the box.
     * @param point The point.
     * @param box An array with the four coordinates of the box.
     */
    TextRenderer.prototype.pointIsInBox = function (point, box) {
        // We use a simple algorithm to determine if the point inside the box:
        // For each line segment of the box we take the dot product between the point and the
        // line vector. If this value is less than 0 it means the point is on the wrong side
        // of the line and the point therefore cannot be inside the box.
        for (var i = 0; i < box.length; i++) {
            var start = box[i];
            var end = box[(i + 1) % box.length];
            var dir = [
                end[0] - start[0],
                end[1] - start[1]
            ];
            var norm = [
                -dir[1],
                dir[0]
            ];
            var v = [
                point[0] - start[0],
                point[1] - start[1]
            ];
            var dot = norm[0] * v[0] + norm[1] * v[1];
            if (dot < 0)
                return false;
        }
        return true;
    };
    TextRenderer.prototype.rotatePoint = function (point, angle) {
        return [
            point[0] * Math.cos(angle) - point[1] * Math.sin(angle),
            point[0] * Math.sin(angle) + point[1] * Math.cos(angle)
        ];
    };
    TextRenderer.prototype.isClockWise = function (points) {
        var total = 0;
        for (var i = 0; i < points.length; i++) {
            var start = points[i];
            var end = points[(i + 1) % points.length];
            total += (end.lng - start.lng) * (end.lat + start.lat);
        }
        return total >= 0;
    };
    return TextRenderer;
}());



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return POIRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RenderResult__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RenderResultBox__ = __webpack_require__(5);


var POIRenderer = (function () {
    function POIRenderer(map, renderHelper) {
        this.map = map;
        this.renderHelper = renderHelper;
    }
    POIRenderer.prototype.renderRule = function (rule, transform, context, entities) {
        var renderResult = new __WEBPACK_IMPORTED_MODULE_0__RenderResult__["a" /* RenderResult */](transform);
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var renderProperties = this.computePOIRenderProperties(entity, rule, transform);
            context.save();
            context.translate(-renderProperties.anchorOffset[0], -renderProperties.anchorOffset[1]);
            context.translate(renderProperties.position[0], renderProperties.position[1]);
            context.translate(renderProperties.anchorOffset[0], renderProperties.anchorOffset[1]);
            context.rotate(renderProperties.rotation);
            context.translate(-renderProperties.anchorOffset[0], -renderProperties.anchorOffset[1]);
            context.drawImage(renderProperties.image, 0, 0, renderProperties.size[0], renderProperties.size[1]);
            context.restore();
            // Store render result
            renderResult.addRenderResult(new __WEBPACK_IMPORTED_MODULE_1__RenderResultBox__["a" /* RenderResultBox */](entity, this.getRenderBox(renderProperties)));
        }
        return renderResult;
    };
    POIRenderer.prototype.computePOIRenderProperties = function (entity, rule, transform) {
        if (!(entity.geometry instanceof Movin.GeoLatLng)) {
            if ({"ENV":"development","DEBUG_RENDERING":false}.ENV == "development")
                console.warn("Unsupported geometry type for POI", entity.geometry);
            return;
        }
        var point = transform.coordinateToPixel(entity.geometry.asArray());
        var rotation = this.getPOIRotation(entity, rule, transform);
        var subType = this.getMapSubType(entity.properties.subType);
        if (!subType) {
            if ({"ENV":"development","DEBUG_RENDERING":false}.ENV == "development")
                console.warn("Subtype does not exist for POI", entity.properties.subType);
            return null;
        }
        var image = this.renderHelper.imageCacher.getCachedImage(subType.name);
        if (!image) {
            if ({"ENV":"development","DEBUG_RENDERING":false}.ENV == "development")
                console.warn("Image could not be loaded for POI or not yet finished loading");
            return null;
        }
        var imageSize = [
            image.width / Math.pow(2, image.originalScaleLevel - 1),
            image.height / Math.pow(2, image.originalScaleLevel - 1)
        ];
        if (rule.scalingType == Movin.MovinTileStyleScaling.scaled) {
            imageSize = [
                imageSize[0] * Math.pow(2, transform.getZoom() - rule.fixedZoomLevel),
                imageSize[1] * Math.pow(2, transform.getZoom() - rule.fixedZoomLevel)
            ];
        }
        imageSize[0] *= transform.getPixelRatio();
        imageSize[1] *= transform.getPixelRatio();
        var anchorOffset = [
            imageSize[0] * subType.poiAnchor[0],
            imageSize[1] * subType.poiAnchor[1]
        ];
        return {
            position: point,
            anchorOffset: anchorOffset,
            size: imageSize,
            rotation: rotation,
            image: image
        };
    };
    /**
     * Computes a GeoAABB for the given poi, rule and transform.
     * @param entity
     * @param rule
     * @param transform
     */
    POIRenderer.prototype.computeRenderedPOIGeoAABB = function (entity, rule, transform) {
        var renderProperties = this.computePOIRenderProperties(entity, rule, transform);
        if (!renderProperties)
            return null;
        var position = entity.geometry.asArray();
        var widthPerPixel = transform.getWidthPerPixel() / transform.getPixelRatio();
        var heightPerPixel = transform.getHeightPerPixel() / transform.getPixelRatio();
        renderProperties.anchorOffset = [
            renderProperties.anchorOffset[0] * widthPerPixel,
            renderProperties.anchorOffset[1] * heightPerPixel
        ];
        renderProperties.size = [
            renderProperties.size[0] * widthPerPixel,
            renderProperties.size[1] * heightPerPixel
        ];
        var base = [
            -renderProperties.anchorOffset[0],
            -renderProperties.anchorOffset[1]
        ];
        var points = [
            base,
            [base[0] + renderProperties.size[0], base[1]],
            [base[0] + renderProperties.size[0], base[1] + renderProperties.size[1]],
            [base[0], base[1] + renderProperties.size[1]]
        ];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            point = this.renderHelper.rotatePoint(point, renderProperties.rotation);
            points[i] = [
                point[0] + position[0],
                point[1] + position[1]
            ];
        }
        var width = points[2][0] - points[0][0];
        var height = points[0][1] - points[2][1];
        return new Movin.GeoAABB(new Movin.GeoLatLng(points[0][1] - height / 2, points[0][0] + width / 2), width, height);
    };
    /**
     * Computes a bounding box in pixel coordinates for the given POI render options.
     * @param position
     * @param size
     * @param anchorOffset
     * @param rotation
     * @param transform
     */
    POIRenderer.prototype.getRenderBox = function (renderProperties) {
        var base = [
            -renderProperties.anchorOffset[0],
            -renderProperties.anchorOffset[1]
        ];
        var points = [
            base,
            [base[0] + renderProperties.size[0], base[1]],
            [base[0] + renderProperties.size[0], base[1] + renderProperties.size[1]],
            [base[0], base[1] + renderProperties.size[1]]
        ];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            point = this.renderHelper.rotatePoint(point, renderProperties.rotation);
            points[i] = [
                point[0] + renderProperties.position[0],
                point[1] + renderProperties.position[1]
            ];
        }
        return points;
    };
    POIRenderer.prototype.getPOIRotation = function (poi, rule, transform) {
        if (rule.rotationType == Movin.MovinTileStyleRotation.horizontal)
            return -transform.getRotation();
        else if (rule.rotationType == Movin.MovinTileStyleRotation.rotated)
            return poi.properties.rotation;
        else {
            var rotation = poi.properties.rotation + transform.getRotation();
            // Make sure the rotation is always >= 0 and <= Math.PI * 2
            while (rotation < 0)
                rotation += Math.PI * 2;
            rotation %= Math.PI * 2;
            if (rotation >= Math.PI / 2 && rotation <= (Math.PI + Math.PI / 2))
                rotation += Math.PI;
            return rotation - transform.getRotation();
        }
    };
    POIRenderer.prototype.getMapSubType = function (name) {
        return this.map.subTypes[name];
    };
    return POIRenderer;
}());



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImageCacher; });
var ImageCacher = (function () {
    function ImageCacher() {
        this.imageCache = {};
    }
    ImageCacher.prototype.prepareImageCacheForMap = function (map) {
        var promises = [];
        for (var subTypeName in map.subTypes) {
            var subType = map.subTypes[subTypeName];
            if (subType.baseType == "POI" && !this.getCachedImage(subType.name))
                promises.push(this.preparePOISubType(subType));
        }
        return Promise.all(promises).then();
    };
    ImageCacher.prototype.preparePOISubType = function (subType) {
        var _this = this;
        var url;
        var scaleLevel;
        if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING)
            console.log("Preparing sub type '" + subType.name + "' for preferred scale level " + ImageCacher.PREFERRED_POI_SCALE_LEVEL + "...");
        if (subType.hasScaledPois) {
            if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING)
                console.log("  Available scale levels:", subType.scaledPoiUrls);
            // Pick appropriate url using the following rules
            // - If a scale lever equal to PREFERRED_POI_SCALE_LEVEL exists use this one
            // - Else use the first higher scale level
            // - Else use the first lower scale level
            var nextHigherScaleLevel = void 0;
            var nextLowerScaleLevel = void 0;
            var equalScaleLevel = void 0;
            var preferredScale = ImageCacher.PREFERRED_POI_SCALE_LEVEL;
            for (var _i = 0, _a = subType.scaledPoiUrls; _i < _a.length; _i++) {
                var scaledPoiUrl = _a[_i];
                if (scaledPoiUrl.scale == preferredScale) {
                    // This is the scale level equal to the preferred scale level
                    equalScaleLevel = scaledPoiUrl;
                }
                else if (scaledPoiUrl.scale > preferredScale &&
                    (!nextHigherScaleLevel || nextHigherScaleLevel.scale > scaledPoiUrl.scale)) {
                    // This is the (new) scale level higher and closest to the preferred scale level.
                    nextHigherScaleLevel = scaledPoiUrl;
                }
                else if (scaledPoiUrl.scale < preferredScale &&
                    (!nextLowerScaleLevel || nextLowerScaleLevel.scale < scaledPoiUrl.scale)) {
                    // This is the (new) scale level lower and closest to the preferred scale level.
                    nextLowerScaleLevel = scaledPoiUrl;
                }
            }
            if (equalScaleLevel && equalScaleLevel.url) {
                if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING)
                    console.log("  Equal scale level will be used");
                url = equalScaleLevel.url;
                scaleLevel = equalScaleLevel.scale;
            }
            else if (nextHigherScaleLevel && nextHigherScaleLevel.url) {
                if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING)
                    console.log("  Next higher scale level will be used");
                url = nextHigherScaleLevel.url;
                scaleLevel = nextHigherScaleLevel.scale;
            }
            else if (nextLowerScaleLevel && nextLowerScaleLevel.url) {
                if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING)
                    console.log("  Next lower scale level will be used");
                url = nextLowerScaleLevel.url;
                scaleLevel = nextLowerScaleLevel.scale;
            }
        }
        else {
            if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING)
                console.log("  Legacy format, only one scale level available");
            // Legacy format, simply use poiUrl property as the url.
            url = subType.poiUrl;
            scaleLevel = 1;
        }
        if (url) {
            if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING)
                console.log("  Sub type will be rendered with scale level " + scaleLevel);
            // Load image
            return new Promise(function (resolve, reject) {
                var image = new Image();
                image.originalScaleLevel = scaleLevel;
                image.onload = function () {
                    _this.cacheImage(subType.name, image);
                    resolve();
                };
                image.onerror = function () {
                    console.warn("Failed to load POI image for sub type " + subType.name);
                    resolve();
                };
                image.src = url;
            });
        }
        else {
            if ({"ENV":"development","DEBUG_RENDERING":false}.DEBUG_RENDERING)
                console.warn("  No url found to render sub type with");
            return Promise.resolve();
        }
    };
    ImageCacher.prototype.cacheImage = function (url, image) {
        this.imageCache[url] = image;
    };
    ImageCacher.prototype.clearCache = function () {
        this.imageCache = {};
    };
    ImageCacher.prototype.getCachedImage = function (url) {
        return this.imageCache[url] || null;
    };
    ImageCacher.PREFERRED_POI_SCALE_LEVEL = window.devicePixelRatio;
    return ImageCacher;
}());



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FontCacher; });
var FontCacher = (function () {
    function FontCacher() {
        this.fontNames = {};
    }
    FontCacher.prototype.prepareFontCacheForStyle = function (style) {
        var promises = [];
        var errors = [];
        for (var _i = 0, _a = style.tileStyle.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            if (layer.subType.baseType == "Text") {
                promises.push(this.prepareFontCacheForLayer(layer).then(function () {
                    // Do nothing
                }, function (error) {
                    // Store error and continue
                    errors.push(error);
                }));
            }
        }
        return Promise.all(promises).then(function () {
            if (errors.length > 0)
                return Promise.reject(errors);
        });
    };
    FontCacher.prototype.prepareFontCacheForLayer = function (layer) {
        for (var _i = 0, _a = layer.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            var textRule = rule;
            var font = textRule.fontFamily;
            if (font.name && font.url && !this.urlIsRegistered(font.url)) {
                this.cacheFont(font.name, font.url);
            }
        }
        return Promise.resolve();
    };
    FontCacher.prototype.cacheFont = function (name, url) {
        // Add @font-face css element
        var newStyle = document.createElement("style");
        newStyle.appendChild(document.createTextNode("\
            @font-face {\
                font-family: '" + name + "';\
                src: url('" + url + "');\
            }\
        "));
        document.head.appendChild(newStyle);
        // Add HTML div which uses the font (to force load the font)
        // Otherwise we risk the font not being available the first time
        // we draw it on a canvas.
        var div = document.createElement("div");
        div.style.fontFamily = name;
        div.style.position = "absolute";
        div.style.top = "0px";
        div.style.zIndex = "10000";
        div.style.color = "gray";
        div.style.fontSize = "1px";
        div.innerHTML = ".";
        document.body.appendChild(div);
        this.registerFontName(name, url);
    };
    FontCacher.prototype.urlIsRegistered = function (url) {
        return !!this.getFontName(url);
    };
    FontCacher.prototype.registerFontName = function (name, url) {
        this.fontNames[url] = name;
    };
    FontCacher.prototype.getFontName = function (url) {
        return this.fontNames[url];
    };
    return FontCacher;
}());



/***/ })
/******/ ]);