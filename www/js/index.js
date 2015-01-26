(function () {
    'use strict';

    require.config({
        baseUrl: "js",
        paths: {
            'angular': '../bower_components/angular/angular',
            'angular-route': '../bower_components/angular-route/angular-route',
            'angularAMD': '../bower_components/angularAMD/angularAMD'
        },
        shim: { 'angularAMD': ['angular'], 'angular-route': ['angular'] }
    });

    require(["require"], function (require) {
        var app = {
            // Application Constructor
            initialize: function () {
                this.bindEvents();
            },
            // Bind Event Listeners
            //
            // Bind any events that are required on startup. Common events are:
            // 'load', 'deviceready', 'offline', and 'online'.
            bindEvents: function () {
                document.addEventListener('deviceready', this.onDeviceReady, false);
            },
            // deviceready Event Handler
            //
            // The scope of 'this' is the event. In order to call the 'receivedEvent'
            // function, we must explicitly call 'app.receivedEvent(...);'
            onDeviceReady: function () {
                app.receivedEvent('deviceready');
                start();
            },
            // Update DOM on a Received Event
            receivedEvent: function (id) {
                console.log('Received Event: ' + id);
            }
        };

        var start = function start() {
            require(["app"]);
        };

        if (window.cordova) {
            app.initialize();
        } else {
            start();
        }
    });
})();