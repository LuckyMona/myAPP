'use strict';

(function () {
    angular.module('starter')
        .factory('identifyFactory', identifyFactoryFunc);

        function identifyFactoryFunc($q, $http){

            var _reFreshToken = function(token){
                var df =  $q.defer();
                var url = 'https://gcl-oauth-test.azurewebsites.net/token',
                    reFreshTokenReqStr = 'refresh_token=' + token.refresh_token +'&grant_type=refresh_token&client_id=05';
                $http({
                    method:'POST',
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                    url:url
                    data:reFreshTokenReqStr
                }).then(function(result){
                    console.log(result);
                    df.resolve(result.data);
                });

            }

            return {
                reFreshToken:_reFreshToken,
            }



        }




})();

