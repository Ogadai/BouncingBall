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

    var start = function start() {
        require(["app"]);
    };

    if (window.cordova) {
        document.addEventListener('deviceready', start, false);
    } else {
        start();
    }
})();