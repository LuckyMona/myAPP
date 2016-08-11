'use strict';

(function () {
	angular.module('starter')
		.factory('userFactory', userFactoryFunc);

		function userFactoryFunc($q, $http, PARAMS, $translate, $ionicLoading, helpToolsFactory){

			// 登录
			var login = function(loginReq, trailCount){
                console.log(loginReq + ' - ' + trailCount + '-th trail');

				// Setup the loader
				$ionicLoading.show({
					template: helpToolsFactory.i18nT('LOADING')
				});

				var defer = $q.defer();
				var token_url = PARAMS.AUTH_SERVER;
				return $http({
                    method:'POST',
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded'
                    },
                    url:token_url,
                    data:loginReq,
                    timeout:5000
                })
                .then(function successCallback(result){
                    console.log(result);
                    $ionicLoading.hide();
                    defer.resolve(result);
                    return defer.promise;
                }, function errorCallback(result) {
                    if (trailCount >= 5 || result.status != -1)//retry within 5 times or is a valid error response(e.g. 400/401/404 etc.)
                    {
                        //no longer retry
                        console.log(result);
                        $ionicLoading.hide();
                        defer.resolve(result);
                        return defer.promise;
                    }
                    else
                    {
                        console.log("retry login ...");
                        return login(loginReq, trailCount + 1);
                    }
                });
            }

			return {
				login:login
			}
		}
})();