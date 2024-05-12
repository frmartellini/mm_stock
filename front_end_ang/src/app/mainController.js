angular.module('app.component').controller('mainController', function ($scope) {
    $scope.activeTab = '';

    $scope.setActive = function (tab) {
        $scope.activeTab = tab;
    };

});
