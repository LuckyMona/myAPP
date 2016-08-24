'use strict';

(function () {
    angular.module('starter')
        .factory('newActFactory', newActFactoryFunc);

        function newActFactoryFunc($q, $http, PARAMS,$ionicLoading){

			var getDataDict = function (getDownlistReq, currentTrail, maxTrail, defer)
			{
				console.log("Trying to get Data Dict ( " + currentTrail + " out of " + maxTrail + " )");
				
                var url = PARAMS.BASE_URL + 'GetDataDict';
				$http({
                    method: 'POST',
                    url: url,
                    data: getDownlistReq,
                    timeout: 5000
                }).then(
					function onSuccess(result)
					{
						$ionicLoading.hide();
						defer.resolve(result);
					},
					function onErr(result)
					{
						if (currentTrail >= 0 && currentTrail <= maxTrail)
						{
							getDataDict(getDownlistReq, currentTrail + 1, maxTrail, defer);
						}
						else
						{
							$ionicLoading.hide();
							defer.resolve(result);
						}
					}
				);
			};
		
            var _getDownlist = function(getDownlistReq){
                //console.log(getDownlistReq);
                $ionicLoading.show({
                    template: 'Loading...'
                });
                var deferred = $q.defer();
				
				getDataDict(getDownlistReq, 1, 5, deferred);

                return deferred.promise;
            }

            var _getTasklist = function(getTasklistReq){
               
                var deferred = $q.defer();
                /*$http.post(url, req)
                    .then(function(result){
                        deferred.resolve(result);
                    });*/
                var mockTasklistData = {
                    success:true,
                    data:[{
                       author:'Alan',
                       date:'2016/6/7', 
                       time:'13:57',
                       log:'Hello!! Please help me take some photos'
                    },
                    {
                       author:'Alan',
                       date:'2016/6/7', 
                       time:'13:57',
                       log:'Hello!! Please help me take some photos'
                    }]
                }
                deferred.resolve(mockTasklistData);
                return deferred.promise;
            }

            return {
               getDownlist:_getDownlist,
               getTasklist:_getTasklist,

            }
        }

})();