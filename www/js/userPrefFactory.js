'use strict';
(function(){
	angular.module('userPref',['LocalStorageModule'])
		.factory('userPref', UserPrefFactory);

		function UserPrefFactory(localStorageService){
			var _setLanguage = function (lang) {
	            return localStorageService.set('language', lang);
	        };
	        var _getLanguage = function () {
	            return localStorageService.get('language');
	        };

	         return {
	            setLanguage: _setLanguage,
	            getLanguage: _getLanguage
	        };
		}
})()