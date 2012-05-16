function Kamalan(config) {

    var _express = require('express');

    var _port = 3000,
        _defaultConfig,
        // constanst
        STATIC_PATH = __dirname + '/assert',
        // setter
        _setConfig,
        _setPort,
        // getter
        _getPort;

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

        console.log(_defaultConfig);
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
        createServer: _express.createServer
    };
}

Kamalan.prototype.version = "0.0.1";

// initail kamalan framework
module.exports = exports = new Kamalan();
