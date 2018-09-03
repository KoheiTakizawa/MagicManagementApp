var app = angular.module('mmApp', ['ngResource']);

app.controller('AppController', function($scope, $resource) {

	var dataList = [];
	$scope.isPriest = false;
	$scope.isFairyTamer = false;
	var magicList = [];
	$scope.magics = [];

	var getData = function() {
		$resource('data.json').get(function(data) {
			dataList = data;
			$scope.skills = dataList.skills;
			$scope.gods = dataList.gods;
			$scope.fairyTamerElements = dataList.fairyTamerElements;
			magicList = dataList.magics;
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

	$scope.isChecked = function(index) {
		// プリーストかチェック
		if(index-1 === 2) {
			isPriest(index-1);
		}
		// フェアリーテイマーかチェック
		if(index-1 === 4) {
			isFairyTamer(index-1);
		}
		// チェックが付いているならdisabledはfalse
		if($scope.skills[index-1].checked) {
			return false;
		}
		// チェックが外れていた場合はレベルをクリア
		if($scope.skills[index-1].level) {
			$scope.skills[index-1].level = null;
		}
		return true;
	}

	var getFairyTamerMagicList = function() {
		// 土属性フィルター
		var groundElementMagics = magicList.filter(function(magic) {
			return (magic.skillId = 5, magic.elementId = 1, magic.rank <= $scope.fairyTamerElements[0].level);
		});
		groundElementMagics.forEach(function(magics){
			$scope.magics.push(magics);
		})
	}

	$scope.submit = function() {
		console.log("submit start");
		// submitする度に初期化
		$scope.magics = [];
		if($scope.skills[4].checked){
			getFairyTamerMagicList();
		}
	}

	var init = function() {
		getData();
	}

	init();
})