function Kamalan(config) {

    var _express = require('express');

    var _port = 3000,
        _defaultConfig,
        _server,
        // constanst
        STATIC_PATH = __dirname + '/assert',
        // handler
        _createServer,
        _listen,
        // event
        // setter
        _setConfig,
        _setPort,
        // getter
        _getPort;

    //===============
    // Handler
    //===============

    /**
     * handler listen event, wrap express listen
     * _listen
     * parameter: port {Number}
     * return: void
     */
    _listen = function (port) {
        if (typeof _server !== "object") {
            console.warn("Listen app server fail");
            return;
        }

        port = port || _defaultConfig.port;
        _server.listen(port);
        console.log("Start to listen port: " + port);
    };

    /**
     * handler create server, wrap express server, and contain http object to private object in kamalan.
     * _createServer
     * parameter: config {Object}
     * return: void
     */
    _createServer = function (config) {
        if (typeof config === "object") {
            _server = _express.createServer(config);
        }
        else {
            _server = _express.createServer();
        }

        return _server;
    };

    //===============
    // Setter
    //===============

    /**
     * Setter kamalan's configruration.
     * _setConfig
     * parameter: config {Object}
     * return: void
     */
    _setConfig = function (config) {
        config = config || {};

        for(var i in config) {
            _defaultConfig[i] = config[i];
        }
    };

    /**
     * Setter port
     * _setPort
     * parameter: port {String}
     * return: void
     */
    _setPort = function (port) {
        _port = port;
    };

    //===============
    // Getter
    //===============

    /**
     * Getter port
     * _setPort
     * parameter: none
     * return: port {Number}
     */
    _getPort = function () {
        return _port || 3000;
    };

    /**
     * Kamalan init function
     * _init
     * parameter: config {Object}
     * return: void
     */
    _init = function () {
        config = config || {};

        _defaultConfig = {
            port: 3000,
        };
        _setConfig(config);
    };

    // execute/fire init function.
    _init();

    return {
        set : {
            port : _setPort
        },
        get : {
            port : _getPort
        },
        createServer: _createServer,
        listen: _listen
    };
}

Kamalan.prototype.version = "0.0.1";

// return kamalan module.
module.exports = Kamalan;
