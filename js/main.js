const app = angular.module('mmApp', ['ngResource']);

app.controller('AppController', ($scope, $resource) => {

	let dataList = [];
	let magicList = [];
	let categoryList = [];
	let originalMagicList = [];
	let backgroundColors = [];
	$scope.submitFlg = false;
	$scope.isPriest = false;
	$scope.isFairyTamer = false;
	$scope.magics = [];
	$scope.headerList = [];
	let sortByMagicId = true;

	// skillインデックス格納用変数
	let sorcererSI;
	let conjurerSI;
	let priestSI;
	let magitecSI;
	let fairyTamerSI;

	// skillId格納用変数
	let sorcererSId;
	let conjurerSId;
	let priestSId;
	let magitecSId;
	let fairyTamerSId;

	// magicインデックス格納用変数
	let sorcererMI;
	let conjurerMI;
	let wizardMI;
	let priestMI;
	let magitecMI;
	let fairyTamerMI;

	// magicId格納用変数
	let sorcererMId;
	let conjurerMId;
	let wizardMId;
	let priestMId;
	let magitecMId;
	let fairyTamerMId;

	// jsonファイルからデータを取得
	const getData = () => {
		console.log('getData start');

		$resource('./source/data.json').get(data => {
			dataList = data;
			$scope.skills = dataList.skills;
			$scope.gods = dataList.gods;
			$scope.fairyTamerElements = dataList.fairyTamerElements;
			$scope.headerList = dataList.headers;
			magicList = dataList.magics;
			categoryList = dataList.categories;
			backgroundColors = dataList.backgroundColors;

			// skillIndex,skillIdを格納
			dataList.skills.forEach((skill, index) => {
				if(skill.name === 'ソーサラー') {
					sorcererSI = index;
					sorcererSId = skill.id;
				} else if(skill.name === 'コンジャラー') {
					conjurerSI = index;
					conjurerSId = skill.id;
				} else if(skill.name === 'プリースト') {
					priestSI = index;
					priestSId = skill.id;
				} else if(skill.name === 'マギテック') {
					magitecSI = index;
					magitecSId = skill.id;
				} else if(skill.name === 'フェアリーテイマー') {
					fairyTamerSI = index;
					fairyTamerSId = skill.id;
				}
			});

			// magicIndex,magicIdを格納
			magicList.forEach((magic, index) => {
				if(magic.skillName === '真語魔法') {
					sorcererMI = index;
					sorcererMId = magic.magicId;
				} else if(magic.skillName === '操霊魔法') {
					conjurerMI = index;
					conjurerMId = magic.magicId;
				} else if(magic.skillName === '深智魔法') {
					wizardMI = index;
					wizardMId = magic.magicId;
				} else if(magic.skillName === '神聖魔法') {
					priestMI = index;
					priestMId = magic.magicId;
				} else if(magic.skillName === '魔導機術') {
					magitecMI = index;
					magitecMId = magic.magicId;
				} else if(magic.skillName === '妖精魔法') {
					fairyTamerMI = index;
					fairyTamerMId = magic.magicId;
				}
			});
		});

		console.log('getData end');
	};

	// 信仰する神のinput表示制御
	const isPriest = () => {
		if($scope.skills[priestSI].checked) {
			$scope.isPriest = true;
			return;
		}
		$scope.isPriest = false;
		return;
	};

	// 契約属性のinput表示制御
	const isFairyTamer = () => {
		if($scope.skills[fairyTamerSI].checked) {
			$scope.isFairyTamer = true;
			return;
		}
		$scope.isFairyTamer = false;
		return;
	};

	// 技能レベルinputのdisabled制御
	$scope.isChecked = skillId => {
		// プリーストかチェック
		if(skillId === priestSId) {
			isPriest();
		}
		// フェアリーテイマーかチェック
		if(skillId === fairyTamerSId) {
			isFairyTamer();
		}
		// チェックが付いているならdisabledはfalse
		if($scope.skills[skillId-1].checked) {
			return false;
		}
		return true;
	};

	// ng-repeat契約属性から基本と特殊を外す
	$scope.ftFilter = element => {
		return element.id < 7 ? true : false;
	};

	// 妖精魔法各属性の入力上限値を監視
	$scope.changeMax = () => {
		let totalFairy = 0;
		let fairyCapacity = 0;
		for(let i = 0; i < 6; i++) {
			totalFairy = totalFairy + $scope.fairyTamerElements[i].level;
		}
		$scope.fairyTamerElements.forEach(element => {
			fairyCapacity = element.level + ($scope.skills[fairyTamerSI].level * 2 - totalFairy);
			// フェアリーテイマー技能レベルが最大値
			element.max = fairyCapacity < $scope.skills[fairyTamerSI].level ? fairyCapacity : $scope.skills[fairyTamerSI].level;
		});
	};

	// ソーサラー、コンジャラー、マギテック用魔法取得
	const getStandardMagics = (index, skillLevel) => {
		magicList[index].magics.map(magic => {
			if(magic.rank <= skillLevel) {
				magic.magicId = magicList[index].magicId;
				magic.skillName = magicList[index].skillName;
				magic.category = categoryList[magic.categoryId-1].name;
				$scope.magics.push(magic);
			}
		});
	};

	// プリースト用魔法取得
	const getPriestMagics = (index, skillLevel) => {
		magicList[index].magics.map(magic => {
			if((magic.godId === 0 && magic.rank <= skillLevel) || (magic.godId === $scope.selectedGod.id && magic.rank <= skillLevel)) {
				magic.magicId = magicList[index].magicId;
				magic.skillName = magic.godId === 0 ? magicList[index].skillName : '特殊' + magicList[index].skillName;
				magic.category = categoryList[magic.categoryId-1].name;
				$scope.magics.push(magic);
			}
		});
	};

	// フェアリーテイマー魔法フィルタ
	const addFairyTamerMagic = (index, i, upperLimitRank, skillName) => {
		magicList[index].magics.map(magic => {
			if (magic.fairyElementId === i + 1 && magic.rank <= upperLimitRank) {
				magic.magicId = magicList[index].magicId;
				magic.skillName = skillName + '(' + $scope.fairyTamerElements[i].name + ')';
				magic.category = categoryList[magic.categoryId-1].name;
				$scope.magics.push(magic);
			}
		});
		return;
	};

	// フェアリーテイマー用魔法取得
	const getFairyTamerMagicList = (index, skillLevel) => {
		// 総契約妖精数
		const totalFairyNumber = skillLevel * 2;
		// 各属性の最低レベル、判定用に初期値100
		let availableSpecialLevel = 100;
		$scope.fairyTamerElements.forEach((element, i) => {
			if(i < 6) { // 土、水・氷、炎、風、光、闇の場合
				// 当該属性の契約妖精数
				const targetElementNumber = element.level;
				// 他属性の契約妖精数
				const otherElementsNumber = targetElementNumber !== 0 ? totalFairyNumber - targetElementNumber : 0;
				// 取得可能当該属性ランク
				const upperLimitRank = targetElementNumber + Math.ceil(otherElementsNumber / 2) <= targetElementNumber * 2 ?
					targetElementNumber + Math.ceil(otherElementsNumber / 2) :
					targetElementNumber * 2;
				addFairyTamerMagic(index, i, upperLimitRank, magicList[index].skillName);
				// 現在最低レベルと当該属性のレベルを比較し、下回れば更新 ⇒ Math.min()がNaN返すんだけどなんで？
				if(targetElementNumber < availableSpecialLevel) {
					availableSpecialLevel = targetElementNumber;
				}
			} else if(i === 6) { // 基本の場合
				addFairyTamerMagic(index, i, skillLevel, magicList[index].skillName);
			} else { // 特殊の場合
				addFairyTamerMagic(index, i, availableSpecialLevel, magicList[index].skillName);
			}
		});
	};

	// 表示ボタン押下イベント
	$scope.submit = () => {
		console.log("submit start");
		// submitする度に初期化
		$scope.magics = [];
		$scope.submitFlg = true;
		sortByMagicId = true;

		// 真語魔法取得
		if($scope.skills[sorcererSI].checked){
			getStandardMagics(sorcererMI, $scope.skills[sorcererSI].level);
		}
		// 操霊魔法取得
		if($scope.skills[conjurerSI].checked){
			getStandardMagics(conjurerMI, $scope.skills[conjurerSI].level);
		}
		// 深智魔法取得
		if($scope.skills[sorcererSI].checked && $scope.skills[conjurerSI].checked) {
			const skillLevel = $scope.skills[sorcererSI].level <= $scope.skills[conjurerSI].level ? $scope.skills[sorcererSI].level : $scope.skills[conjurerSI].level;
			getStandardMagics(wizardMI, skillLevel);
		}
		// 神聖魔法取得
		if($scope.skills[priestSI].checked){
			getPriestMagics(priestMI, $scope.skills[priestSI].level);
		}
		// 魔導機術取得
		if($scope.skills[magitecSI].checked){
			getStandardMagics(magitecMI, $scope.skills[magitecSI].level);
		}
		// 妖精魔法取得
		if($scope.skills[fairyTamerSI].checked){
			getFairyTamerMagicList(fairyTamerMI, $scope.skills[fairyTamerSI].level);
		}

		originalMagicList = $scope.magics;

		console.log('submit finished');
	};

	// ソートに応じて系統か種別のカラムに背景色を付ける
	$scope.getBackgroundColor = (magic, header) => {
		// 系統ソートの場合
		if(sortByMagicId && header.displayName === $scope.headerList[0].displayName) {
			// 神聖魔法、妖精魔法以外
			if(magic.magicId !== priestMId && magic.magicId !== fairyTamerMId) {
				return backgroundColors[0].colors[magic.magicId-1].color;
			}
			// 神聖魔法
			if(magic.magicId === priestMId) {
				if(magic.godId === 0) {
					return backgroundColors[0].colors[magic.magicId-1].colors[0].color;
				}
				return backgroundColors[0].colors[magic.magicId-1].colors[1].color;
			}
			// 妖精魔法
			if(magic.magicId === fairyTamerMId) {
				return backgroundColors[0].colors[magic.magicId-1].colors[magic.fairyElementId-1].color;
			}
		// 種別ソートの場合
		} else if(!sortByMagicId && header.displayName === $scope.headerList[4].displayName) {
			return backgroundColors[1].colors[magic.categoryId-1].color;
		}
	};

	// ソートボタン押下イベント
	$scope.sortMagic = index => {
		// 系統ソート
		if(index === 0) {
			sortByMagicId = true;
			$scope.magics = _.sortBy(_.sortBy(_.sortBy(_.sortBy(originalMagicList, 'rank'), 'fairyElementId'), 'godId'), 'magicId');
		// 種別ソート
		} else {
			sortByMagicId = false;
			$scope.magics = _.sortBy(_.sortBy(_.sortBy(_.sortBy(_.sortBy(originalMagicList, 'fairyElementId'), 'godId'), 'skillId'), 'rank'), 'categoryId');
		}
	};

	// CSV出力は不要
	// $scope.outputCSV = () => {
	// 	console.log('ouputCSV start');
	// 	let csvText = '';
	// 	let headerArray = [];
	// 	for (let i = 0; i < $scope.headerList.length; i++) {
	// 		headerArray.push($scope.headerList[i].displayName);
	// 	}
	// 	csvText = headerArray.join() + '\n';

	// 	$scope.magics.map(magic => {
	// 		let magicTextArray = [];
	// 		for(let i = 0; i < $scope.headerList.length; i++) {
	// 			magicTextArray.push(magic[$scope.headerList[i].name]);
	// 		}
	// 		csvText = csvText + magicTextArray.join() + '\n';
	// 	});

	// 	const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
	// 	const blob = new Blob([ bom, csvText ], {'type':'text/plain'});

	// 	if(window.navigator.msSaveBlob) {
	// 		window.navigator.msSaveBlob(blob, 'magics.csv');
	// 		window.navigator.nsSaveOrOpenBlob(blob, 'magics.csv');
	// 	} else {
	// 		document.getElementById('download').href = window.URL.createObjectURL(blob);
	// 	}
	// };

	// Excel出力ボタン押下イベント
	$scope.outputExcel = () => {
		const wopts = {
			bookType: 'xlsx',
			bookSST: false,
			type: 'binary'
		};
		let workbook = {SheetNames: [], Sheets: {}};

		document.querySelectorAll('table.table-to-export').forEach((currentValue, index) => {
			let n = currentValue.getAttribute('data-sheet-name');
			if (!n) {
				n = 'Sheet' + index;
			}
			workbook.SheetNames.push(n);
			workbook.Sheets[n] = XLSX.utils.table_to_sheet(currentValue, wopts);
		});

		const wbout = XLSX.write(workbook, wopts);

		function s2ab(s) {
			const buf = new ArrayBuffer(s.length);
			const view = new Uint8Array(buf);
			for (let i = 0; i != s.length; ++i) {
				view[i] = s.charCodeAt(i) & 0xFF;
			}
			return buf;
		}

		saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), '取得魔法一覧.xlsx');
	};

	const init = () => {
		console.log('init start');

		getData();

		console.log('init end');
	};

	init();
});