'use strict';
// check if token expires. Refresh Token if it expires
(function () {
    angular.module('starter')
        .factory('chkTokenFactory', chkTokenFactoryFunc);

        function chkTokenFactoryFunc($q, $http){

            var _refreshToken = function(token){
                // check if token expires
                var expireNum = parseFloat(token.expires_in),
                    nowTime = new Date().getTime(),
                    isExpire = expireNum-nowTime>0 ? false : true,
                    df =  $q.defer();
                // if token expires
                if(isExpire){
                    
                    var url = 'https://gcl-oauth-test.azurewebsites.net/token',
                        reFreshTokenReqStr = 'refresh_token=' + token.refresh_token +'&grant_type=refresh_token&client_id=123';
                    $http({
                        method:'POST',
                        headers:{
                            'Content-Type':'application/x-www-form-urlencoded'
                        },
                        url:url,
                        data:reFreshTokenReqStr
                    }).then(function(result){
                        console.log(result);
                        df.resolve(result);
                    });
                    
                }else{
                    // not expire
                    df.resolve('false');
                }
                return df.promise;

            }



            return {
                refreshToken:_refreshToken,
            }



        }




})();

