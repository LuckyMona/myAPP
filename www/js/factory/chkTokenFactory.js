'use strict';

// check if token expires. Refresh Token if it expires
(function () {

    angular.module('starter')
        .factory('chkTokenFactory', chkTokenFactoryFunc);

        function chkTokenFactoryFunc(PARAMS, $q, $http, $timeout, localStorageService,$ionicLoading){

            var _refreshToken = function(token){
                // check if token expires
                var tokenExp = isNaN(localStorageService.get('access#exp')) ? 0 : parseFloat(localStorageService.get('access#exp'));
                var expireNum = tokenExp,
                    nowTime = new Date().getTime(),
                    isExpire = expireNum-nowTime/1000 > 0 ? false : true,      // tokenExp的单位是秒？而不是毫秒
                    df =  $q.defer(),
                    device_id = '123456'; // TODO hard code

                // if token expires
                if(isExpire){
                    // TODO sleep 1s for testing, should remove sleep when deploy
                    $timeout(function(){
                        var url = PARAMS.AUTH_SERVER,
                            reFreshTokenReqStr = 'refresh_token=' 
                                                + token.refresh_token 
                                                + '&grant_type=refresh_token&client_id='
                                                + PARAMS.CLIENT_ID
                                                + '&device_id='
                                                + device_id;

                        $ionicLoading.show({
                            template: 'Loading...'
                        });
                        $http({
                            method:'POST',
                            headers:{
                                'Content-Type':'application/x-www-form-urlencoded'
                            },
                            url:url,
                            data:reFreshTokenReqStr
                        }).then(function(result){
                            console.log(result);
                            $ionicLoading.hide();
                            df.resolve(result);
                        },function(result){
                            $ionicLoading.hide();
                            df.resolve(result);
                        });
                    },1000);
                    
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

