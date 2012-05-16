function Kamalan(config) {

    var _express = require('express');

    var _port = 3000,
        _defaultConfig,
        _server,
        // constanst
        STATIC_PATH = __dirname + '/assert',
        // handler
        _error,
        _log,
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
     * handler _error, wrap console.error/ throw error, depend on breakFlag
     * _error
     * parameter: msg {String | Object}, breakFlag {Boolean}
     * return: void
     */
    _error = function (msg, breakFlag) {
        if (breakFlag) {
            throw new Error(msg);
        }
        else {
            console.warn(msg);
        }
    };

    /**
     * handler _log, wrap console.log, and detect debug flag
     * _log
     * parameter: msg {String | Object}
     * return: void
     */
    _log = function (msg) {
        if ( ! _defaultConfig.debug) {
            return;
        }

        if (typeof msg === "string") {
            console.log("msg");
        }
        else {
            console.log(msg);
        }
    }

    /**
     * handler listen event, wrap express listen
     * _listen
     * parameter: port {Number}
     * return: void
     */
    _listen = function (port) {
        if (typeof _server !== "object") {
            _error("Listen app server fail");
            return;
        }

        port = port || _defaultConfig.port;
        _server.listen(port);
        _log("Start to listen port: " + port);
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
            debug: true
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
