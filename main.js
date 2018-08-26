var app = angular.module('mmApp', ['ngResource']);

app.controller('AppController', function($scope, $resource) {

	var dataList = [];
	$scope.isPriest = false;
	$scope.isFairyTamer = false;

	var getData = function() {
		$resource('data.json').get(function(data) {
			dataList = data;
			$scope.skills = dataList.skills;
			$scope.gods = dataList.gods;
		})
	}


	var isPriest = function(index) {
		if($scope.skills[index].checked) {
			return $scope.isPriest = true;
		}
		return $scope.isPriest = false;
	}

	var isFairyTamer = function(index) {
		if($scope.skills[index].checked) {
			return $scope.isFairyTamer = true;
		}
		return $scope.isFairyTamer = false;
	}

	var init = function() {
		getData();
	}

	init()

	$scope.isChecked = function(index) {
		// プリーストかチェック
		if(index-1 === 2) {
			isPriest(index-1);
		}
		// フェアリーテイマーかチェック
		if(index-1 === 3) {
			isFairyTamer(index-1);
		}
		// チェックが付いているか外れているかチェック
		if($scope.skills[index-1].checked) {
			return false;
		}
		// チェックが外れていた場合はレベルをクリア
		if($scope.skills[index-1].level) {
			$scope.skills[index-1].level = null;
		}
		return true;
	}

	// $scope.isPriest = function() {
	// 	if($scope.skills[2].checked) {
	// 		return true;
	// 	}
	// 	return false;
	// };

	// $scope.isFairyTamer = function() {
	// 	if($scope.skills[3].checked) {
	// 		return true;
	// 	}
	// 	return false;
	// }

	$scope.submit = function() {
		console.log("submitted")
	}
})