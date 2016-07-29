'use strict';

(function () {
	angular.module('starter')
		.factory('userFactory', userFactoryFunc);

		function userFactoryFunc($q, $http,PARAMS){

			// 登录
			var login = function(loginReq){
				console.log(loginReq);

				var defer = $q.defer();
				var token_url = PARAMS.AUTH_SERVER;
				$http({
					method:'POST',
					headers:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					url:token_url,
					data:loginReq})
					.then(function(result){
						console.log(result);
						defer.resolve(result);							
					});

				/**
				 * [mockLoginData username=1, password=1时可以登录]
				 * @author Mary
				 */
				/*var mockLoginData = {};
				if(loginReq.username == 1 && loginReq.password == 1){
					mockLoginData = {
						success:true,
						token:123
					}
				} else {
					mockLoginData = {
						success:false,
					}
				}
				deferred.resolve(mockLoginData);*/
				return defer.promise;
			}

			return {
				login:login
			}
		}
})();