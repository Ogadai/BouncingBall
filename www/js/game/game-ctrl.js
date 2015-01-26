(function() {
    'use strict';

    define(['app', './game', 'game/game-directive', 'app-settings'], function (app, game) {
        app.controller('GameCtrl', ['$scope', 'appSettings', function ($scope, appSettings) {
            $scope.game = game;
            $scope.game.setSize(appSettings.getSize());

            $scope.restart = function restart() {
                game.restart();
            };

            $scope.$on("$destroy", function () {
                game.endGame();
            });
        }]);
    });
})();
