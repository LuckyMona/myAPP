'use strict';

(function () {
	angular.module('starter')
		.factory('categoryFactory', categoryFactoryFunc);

		function categoryFactoryFunc(){
			var _category = "";
			var _getCategory = function(){
				return _category;
			}
			var _setCategory = function(category){
				_category = category;
			}


			return {
				getCategory:_getCategory,
				setCategory:_setCategory
			}
		}


})();