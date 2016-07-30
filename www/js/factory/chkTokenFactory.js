'use strict';

// check if token expires. Refresh Token if it expires
(function () {

    angular.module('starter')
        .factory('chkTokenFactory', chkTokenFactoryFunc);

        function chkTokenFactoryFunc(PARAMS, $q, $http, $timeout){

            var _refreshToken = function(token){
                // check if token expires
                var expireNum = parseFloat(token.expires_in),
                    nowTime = new Date().getTime(),
                    isExpire = expireNum-nowTime>0 ? false : true,
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

