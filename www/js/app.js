(function () {
    'use strict';

    define(['angularAMD', 'angular-route'], function (angularAMD) {
        var app = angular.module("bouncing-ball", ['ngRoute']);
        app.config(function ($routeProvider) {
            $routeProvider
                .when("/home", angularAMD.route({
                    templateUrl: 'views/home.html', controller: 'HomeCtrl',
                    controllerUrl: 'home/home-ctrl'
                }))
                .when("/game", angularAMD.route({
                    templateUrl: 'views/game.html', controller: 'GameCtrl',
                    controllerUrl: 'game/game-ctrl'
                }))
                .when("/settings", angularAMD.route({
                    templateUrl: 'views/settings.html', controller: 'SettingsCtrl',
                    controllerUrl: 'settings/settings-ctrl'
                }))
                .otherwise({ redirectTo: '/home' });
        });
        return angularAMD.bootstrap(app);
    });
})();