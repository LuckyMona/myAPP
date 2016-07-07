'use strict';

(function () {
	angular.module('starter')
		.factory('userFactory', userFactoryFunc);

		function userFactoryFunc($q, $http){

			// 登录
			var login = function(loginReq){
				console.log(loginReq);
				var deferred = $q.defer();
				/*$http.post(url, loginReq)
					.then(function(result){
						deffered.resolve(result.data);							
					});*/

				/**
				 * [mockLoginData username=1, password=1时可以登录]
				 * @author Mary
				 */
				var mockLoginData = {};
				if(loginReq.username == 1 && loginReq.password == 1){
					mockLoginData = {
						success:true,
					}
				} else {
					mockLoginData = {
						success:false,
					}
				}
				deferred.resolve(mockLoginData);
				return deferred.promise;
			}



			return {
				login:login,
			}
		}
})();