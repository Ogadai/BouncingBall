(function() {
    'use strict';

    define(['app'], function (app) {
        app.directive('gameCanvas', [function () {
            return {
                restrict: 'E',
                scope: { game: '=game' },
                template: '<canvas width="1000" height="1000"></canvas>',
                link: function (scope, element) {
                    scope.game.initialise(element.find('canvas')[0]);
                }
            };
        }]);
    });
})();