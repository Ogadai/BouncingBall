'use strict';

require.config({
    baseUrl: "js",
    paths: {
        'angular': '../bower_components/angular/angular.js',
        'angular-route': '../bower_components/angular-route/angular-route.js',
        'angularAMD': '../bower_components/angularAMD/angularAMD.js'
    },
    shim: { 'angularAMD': ['angular'], 'angular-route': ['angular'] },
    deps: ['app']
});
