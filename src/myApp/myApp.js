(function(){
    'use strict';

    var myApp = angular.module('myApp', ['ui.router', 'angularUtils.directives.dirPagination', 'xeditable']),
        storageName = 'appGuestBook',
        saveMessage = function (toSendData, appData) {
            if (appData) {
                appData.push(toSendData);
                localStorage.setItem(storageName, JSON.stringify(appData));
            } else {
                localStorage.setItem(storageName, JSON.stringify(toSendData));
            }
        };

    myApp.controller('saveEdit', function ($scope) {
        $scope.updateData = function (id, fieldName, data) {
            var appData = JSON.parse(localStorage.getItem(storageName));
            appData.forEach(function (item) {
                if (item.id === id) {
                    item[fieldName] = data;
                    saveMessage(appData);
                }
            });
        }
    });

    myApp.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/guestbook");
        $stateProvider
            .state('guestbook', {
                url: "/guestbook",
                templateProvider: function($templateCache) {
                    return $templateCache.get('myApp/myApp.html');
                },
                controller: function StorageData ($scope) {
                    var appData = JSON.parse(localStorage.getItem(storageName)) || [];
                    $scope.orderProp = 'date';
                    $scope.storage = appData;
                    $scope.feedbackEdit = function (id) {
                        $('#' + id).toggleClass('edit-disable');
                    };
                    $scope.feedbackRemove = function (id) {
                        $scope.storage.forEach(function (item, index, array) {
                            if (item.id === id) {
                                array.splice(index, 1);
                                saveMessage(array);
                            }
                        });
                    };
                    $scope.submitForm = function (form){
                        var now = new Date();
                        $scope.fields.id = now.getTime();
                        $scope.fields.date = now;
                        saveMessage($scope.fields, appData);
                        delete $scope.fields;
                    };
                }
            });
    });
})();