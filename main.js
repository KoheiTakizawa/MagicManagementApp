var app = angular.module('mmApp', ['ngResource']);

app.controller('AppController', function($scope, $resource) {

	var dataList = [];
	var magicList = [];
	var categoryList = [];
	var headerList = [];
	$scope.submitFlg = false;
	$scope.isPriest = false;
	$scope.isFairyTamer = false;
	$scope.magics = [];

	var getData = function() {
		$resource('data.json').get(function(data) {
			dataList = data;
			$scope.skills = dataList.skills;
			$scope.gods = dataList.gods;
			$scope.fairyTamerElements = dataList.fairyTamerElements;
			magicList = dataList.magics;
			categoryList = dataList.categories;
			headerList = dataList.headers;
		});
	};


	var isPriest = function(index) {
		if($scope.skills[index].checked) {
			$scope.isPriest = true;
			return;
		}
		$scope.isPriest = false;
		return;
	};

	var isFairyTamer = function(index) {
		if($scope.skills[index].checked) {
			$scope.isFairyTamer = true;
			return;
		}
		$scope.isFairyTamer = false;
		return;
	};

	$scope.isChecked = function(skillId) {
		// プリーストかチェック
		if(skillId === 3) {
			isPriest(skillId-1);
		}
		// フェアリーテイマーかチェック
		if(skillId === 5) {
			isFairyTamer(skillId-1);
		}
		// チェックが付いているならdisabledはfalse
		if($scope.skills[skillId-1].checked) {
			return false;
		}
		return true;
	};

	$scope.ftFilter = function(element) {
		return element.id < 7 ? true : false;
	};

	// ソーサラー、コンジャラー、マギテック用
	var getStandardMagics = function(index, skillLevel) {
		magicList[index].magics.map(function(magic) {
			if(magic.rank <= skillLevel) {
				magic.skillName = magicList[index].skillName;
				magic.category = categoryList[magic.categoryId-1].name;
				$scope.magics.push(magic);
			}
		});
	};

	var getPriestMagics = function(index, skillLevel) {
		console.log('Priest');
		console.log($scope.selectedGod.id);
		magicList[index].magics.map(function(magic) {
			if((magic.godId === 0 && magic.rank <= skillLevel) || (magic.godId === $scope.selectedGod.id && magic.rank <= skillLevel)) {
				magic.skillName = magic.godId === 0 ? magicList[index].skillName : '特殊' + magicList[index].skillName;
				magic.category = categoryList[magic.categoryId-1].name;
				$scope.magics.push(magic);
			}
		});
	};

	var addFairyTamerMagic = function(index, i, upperLimitRank, skillName) {
		magicList[index].magics.map(function(magic) {
			if (magic.fairyElementId === i + 1 && magic.rank <= upperLimitRank) {
				magic.skillName = skillName + '(' + $scope.fairyTamerElements[i].name + ')';
				magic.category = categoryList[magic.categoryId-1].name;
				$scope.magics.push(magic);
			}
		});
		return;
	};

	var getFairyTamerMagicList = function(index, skillLevel) {
		// 総契約妖精数
		var totalFairyNumber = skillLevel * 2;
		// 当該属性の契約妖精数
		var targetElementNumber;
		// 他属性の契約妖精数
		var otherElementsNumber;
		// 取得可能当該属性ランク
		var upperLimitRank;
		// 各属性の最低レベル、判定用に初期値100
		var availableSpecialLevel = 100;
		for (var i = 0; i < $scope.fairyTamerElements.length; i++) {
			if(i < 6) {	// 土、水・氷、炎、風、光、闇の場合
				targetElementNumber = $scope.fairyTamerElements[i].level;
				otherElementsNumber = targetElementNumber !== 0 ? totalFairyNumber - targetElementNumber : 0;
				upperLimitRank = targetElementNumber + Math.floor/*ceilどっちだっけ*/(otherElementsNumber / 2) <= targetElementNumber * 2 ?
					targetElementNumber + Math.floor(otherElementsNumber / 2) :
					targetElementNumber * 2;
				addFairyTamerMagic(index, i, upperLimitRank, magicList[index].skillName);
				// 現在最低レベルと当該属性のレベルを比較し、下回れば更新 ⇒ Math.min()がNaN返すんだけどなんで？
				if(targetElementNumber < availableSpecialLevel) {
					availableSpecialLevel = targetElementNumber;
				}
			} else if(i === 6) {	// 基本の場合
				upperLimitRank = skillLevel;
				addFairyTamerMagic(index, i, upperLimitRank, magicList[index].skillName);
			} else {	// 特殊の場合
				upperLimitRank = availableSpecialLevel;
				addFairyTamerMagic(index, i, upperLimitRank, magicList[index].skillName);
			}
		}
	};

	$scope.submit = function() {
		console.log("submit start");
		// submitする度に初期化
		$scope.magics = [];
		$scope.submitFlg = true;
		// 真語魔法取得
		if($scope.skills[0].checked){
			getStandardMagics(0, $scope.skills[0].level);
		}
		// 操霊魔法取得
		if($scope.skills[1].checked){
			getStandardMagics(1, $scope.skills[1].level);
		}
		// 深智魔法取得
		if($scope.skills[0].checked && $scope.skills[1].checked) {
			var skillLevel = $scope.skills[0].level <= $scope.skills[1].level ? $scope.skills[0].level : $scope.skills[1].level;
			getStandardMagics(5, skillLevel);
		}
		// 神聖魔法取得
		if($scope.skills[2].checked){
			getPriestMagics(2, $scope.skills[2].level);
		}
		// 魔導機術取得
		if($scope.skills[3].checked){
			getStandardMagics(3, $scope.skills[3].level);
		}
		// 妖精魔法取得
		if($scope.skills[4].checked){
			getFairyTamerMagicList(4, $scope.skills[4].level);
		}
		console.log('submit finished');
	};

	// CSV出力は不要
	// $scope.outputCSV = function() {
	// 	console.log('ouputCSV start');
	// 	var csvText = '';
	// 	var headerArray = [];
	// 	for (var i = 0; i < headerList.length; i++) {
	// 		headerArray.push(headerList[i].displayName);
	// 	}
	// 	csvText = headerArray.join() + '\n';

	// 	$scope.magics.map(function(magic) {
	// 		var magicTextArray = [];
	// 		for(var i = 0; i < headerList.length; i++) {
	// 			magicTextArray.push(magic[headerList[i].name]);
	// 		}
	// 		csvText = csvText + magicTextArray.join() + '\n';
	// 	});

	// 	var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
	// 	var blob = new Blob([ bom, csvText ], {'type':'text/plain'});

	// 	if(window.navigator.msSaveBlob) {
	// 		window.navigator.msSaveBlob(blob, 'magics.csv');
	// 		window.navigator.nsSaveOrOpenBlob(blob, 'magics.csv');
	// 	} else {
	// 		document.getElementById('download').href = window.URL.createObjectURL(blob);
	// 	}
	// };

	$scope.outputExcel = function() {
		var wopts = {
			bookType: 'xlsx',
			bookSST: false,
			type: 'binary'
		};
		var workbook = {SheetNames: [], Sheets: {}};

		document.querySelectorAll('table.table-to-export').forEach(function (currentValue, index) {
			var n = currentValue.getAttribute('data-sheet-name');
			if (!n) {
				n = 'Sheet' + index;
			}
			workbook.SheetNames.push(n);
			workbook.Sheets[n] = XLSX.utils.table_to_sheet(currentValue, wopts);
		});

		var wbout = XLSX.write(workbook, wopts);

		function s2ab(s) {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i = 0; i != s.length; ++i) {
				view[i] = s.charCodeAt(i) & 0xFF;
			}
			return buf;
		}

		saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), 'magics.xlsx');
	};

	var init = function() {
		getData();
	};

	init();
});