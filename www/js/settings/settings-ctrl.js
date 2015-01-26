(function () {
    'use strict';

    define(['app', 'app-settings'], function (app) {
        app.controller('SettingsCtrl', ['$scope', '$location', 'appSettings', function ($scope, $location, appSettings) {
            $scope.sizes = [
                { name: "Full Screen", size: null },
                { name: "Nexus 5", size: { width: 1080 / 3, height: 1920 / 3 - 48 } },
                { name: "Nexus 9", size: { width: 1536 / 2, height: 2048 / 2 - 48 } },
                { name: "Custom", size: {} }
            ];

            $scope.settingSize = appSettings.getSize();
            
            $scope.sizes.forEach(function (s) {
                if ((!s.size && !$scope.settingSize)
                        || (s.size && $scope.settingSize && s.size.width === $scope.settingSize.width && s.size.height === $scope.settingSize.height)
                        || (!$scope.size && s.size && (!s.size.width || !s.size.height))) {
                    $scope.size = s;
                }
            });

            $scope.customWidth = $scope.settingSize ? $scope.settingSize.width : 1000;
            $scope.customHeight = $scope.settingSize ? $scope.settingSize.height : 800;

            $scope.saveSettings = function () {
                var size = $scope.size.size;
                if (size && (!size.width || !size.height)) {
                    // Custom size
                    size = { width: $scope.customWidth, height: $scope.customHeight };
                }
                appSettings.setSize(size);

                $location.path('/home');
            };
        }]);
    });
})();