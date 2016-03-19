angular.module("crowd").controller("EventController", function($scope, $routeParams, crowdService) {
    $scope.setMapVisibility(false);
    crowdService.getEvent($routeParams.eventId, function(response) {
        $scope.event = response.data;
    });
})
