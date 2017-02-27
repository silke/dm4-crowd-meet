angular.module("crowdedit")
.controller("EditPersonController", function($scope, $routeParams, $location, crowdService) {

    var loadPerson = function(personId) {
      crowdService.getEditablePerson(personId, function(response) {
        $scope.person = response.data;
        $scope.isUpdateBlocked = false;

        // Resets new data
        $scope.newData = {
          email: "",
          address: {
            street: "",
            postalCode: "",
            city: "",
            country: ""
          },
          url: "",
          nationality: "",
          language: ""
        };

      });
    };

    var updatePerson = function() {
      var person = $scope.person;
      // Prevent further updates until the last write hasn't been followed by
      // a reload.
      if (!$scope.isUpdateBlocked) {
        $scope.isUpdateBlocked = true;

        // Reloads the person completely automatically
        crowdService.updatePerson(person, function(response) {
          loadPerson(person.id);
        });

      }
    };

    var validateAndLoadPerson = function() {
      var errorCallback = function(errorResponse) {
        $location.path("/error-noperson");
      };

      crowdService.validateSetup(function(validateResponse) {
        crowdService.getPersonIdByLoggedInUser(function(response) {
            var personId = response.data;
            loadPerson(personId);
        }, errorCallback);
      }, errorCallback);
    };

    $scope.newData = {};

    $scope.isUpdateBlocked = false;

    // Autoload
    validateAndLoadPerson();

    $scope.addNewEmail = function() {
      var person = $scope.person;

      if (!person['childs']['dm4.contacts.email_address']) {
        person['childs']['dm4.contacts.email_address'] = [];
      }

      person['childs']['dm4.contacts.email_address'].push({
        uri: "",
        type_uri: "dm4.contacts.email_address",
        value: $scope.newData.email
      });

      $scope.newData.email = "";

      updatePerson();
    };

    var addNewMultivalueElement = function(dmTopicType, newDataField) {
      var person = $scope.person;

      if (!person['childs'][dmTopicType]) {
        person['childs'][dmTopicType] = [];
      }

      person['childs'][dmTopicType].push({
        uri: "",
        type_uri: dmTopicType,
        value: $scope.newData[newDataField]
      });

      $scope.newData[newDataField] = "";

      updatePerson();
    };

    $scope.addNewURL = function() {
      addNewMultivalueElement('dm4.webbrowser.url', 'url');
    };

    $scope.addNewLanguage = function() {
      addNewMultivalueElement('crowd.language', 'language');
    };

    $scope.addNewNationality = function() {
      addNewMultivalueElement('crowd.person.nationality', 'nationality');
    };

    var moveToTrash = function(array, index) {
      var old = array[index];

      if (old.id) {
        // Replace with a trash object
        array[index] = "del_id:" + old.id;
      } else {
        // Has not been saved yet. Just throw away the array entry
        array.splice(index, 1);
      }
    };

    var removeMultivalueElement = function(dmTopicType, index) {
      moveToTrash($scope.person['childs'][dmTopicType], index);

      updatePerson();
    };

    $scope.removeURL = function(index) {
      removeMultivalueElement('dm4.webbrowser.url', index);
    };

    $scope.removeLanguage = function(index) {
      removeMultivalueElement('crowd.language', index);
    };

    $scope.removeNationality = function(index) {
      removeMultivalueElement('crowd.person.nationality', index);
    };

    $scope.removeEmail = function(index) {
      moveToTrash($scope.person['childs']['dm4.contacts.email_address'], index);

      updatePerson();
    };

    $scope.addNewAddress = function() {
      var person = $scope.person;

      if (!person['childs']['dm4.contacts.address#dm4.contacts.address_entry']) {
        person['childs']['dm4.contacts.address#dm4.contacts.address_entry'] = [];
      }

      person['childs']['dm4.contacts.address#dm4.contacts.address_entry'].push({
        uri: "",
        type_uri: "dm4.contacts.address",
        childs: {
          "dm4.contacts.street": {
            type_uri: "dm4.contacts.street",
            value: $scope.newData.address.street
          },
          "dm4.contacts.postal_code": {
            type_uri: "dm4.contacts.postal_code",
            value: $scope.newData.address.postalCode
          },
          "dm4.contacts.city": {
            type_uri: "dm4.contacts.city",
            value: $scope.newData.address.city
          },
          "dm4.contacts.country": {
            type_uri: "dm4.contacts.country",
            value: $scope.newData.address.country
          }
        }
      });

      $scope.newData.address = {
        street: "",
        postalCode: "",
        city: "",
        country: ""
      };

      updatePerson();
    };

    $scope.removeAddress = function(index) {
      moveToTrash($scope.person['childs']['dm4.contacts.address#dm4.contacts.address_entry'], index);

      updatePerson();
    };

    $scope.updatePerson = updatePerson;

    $scope.logout = function() {
      crowdService.logout(function() {
        $location.path("/start");
      });
    };

    $scope.killId = function(topic) {
      delete topic.id;
    };

})
