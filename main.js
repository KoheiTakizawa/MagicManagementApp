var app = angular.module('mmApp', []);

app.controller('AppController', function($scope) {
	$scope.isPriest = function() {
		console.log("isPriest called");
	};

	$scope.submit = function() {
		console.log("submitted")
	}
})