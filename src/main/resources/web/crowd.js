angular.module("crowd", ["ngRoute", "leaflet-directive"])
.config(function($routeProvider) {
    $routeProvider
        .when("/welcome",             {templateUrl: "views/welcome.html",      controller: "WelcomeController"})
        .when("/person/:personId",    {templateUrl: "views/person.html",       controller: "PersonController"})
        .when("/institution/:instId", {templateUrl: "views/institution.html",  controller: "InstitutionController"})
        .when("/work/:workId",        {templateUrl: "views/work.html",         controller: "WorkController"})
        .when("/event_series/:eventSeriesId",
                                      {templateUrl: "views/event-series.html", controller: "EventSeriesController"})
        .when("/event/:eventId",      {templateUrl: "views/event.html",        controller: "EventController"})
        .otherwise({redirectTo: "/welcome"})
})
.config(function($logProvider) {
    $logProvider.debugEnabled(false);
})
.config(function($httpProvider) {
    // console.log("Configuring request/response interceptors")
    $httpProvider.useLegacyPromiseExtensions(false);
    $httpProvider.interceptors.push(function($injector) {
        var $http
        return {
            request: function(config) {
                // console.log("Loading starts")
                setLoadingWidgetDisplay("block")
                return config
            },
            response: function(response) {
                $http = $http || $injector.get("$http")     // getting $http lazily avoids circular dependency
                if (!$http.pendingRequests.length) {
                    // console.log("Loading complete")
                    setLoadingWidgetDisplay("none")
                }
                return response
            }
        }

        function setLoadingWidgetDisplay(display) {
            document.getElementById("spinner").style.display = display
        }
    })
})
