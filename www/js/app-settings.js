(function () {
    'use strict';

    define(['app'], function (app) {
        app.service('appSettings', [function () {
            var storageName = 'windowSizeSetting';

            var load = function load(id) {
                var jsonVal = localStorage.getItem(id);
                return jsonVal ? JSON.parse(jsonVal) : null;
            }
            var save = function save(id, val) {
                var jsonVal = val ? JSON.stringify(val) : "";
                localStorage.setItem(id, jsonVal);
            }

            this.getSize = function getSize() { return load(storageName); };
            this.setSize = function setSize(size) { save(storageName, size); };
        }]);
    });
}());
