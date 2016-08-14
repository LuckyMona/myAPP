'use strict';

(function () {
    angular.module('starter')
        .factory('newActFactory', newActFactoryFunc);

        function newActFactoryFunc($q, $http, PARAMS,$ionicLoading){

            var _getDownlist = function(getDownlistReq){
                //console.log(getDownlistReq);
                $ionicLoading.show({
                    template: 'Loading...'
                });
                var deferred = $q.defer();
                var url = PARAMS.BASE_URL + 'GetDataDict';
                $http.post(url, getDownlistReq)
                    .then(function successCb(result){
                        $ionicLoading.hide();
                        deferred.resolve(result);
                    },function errorCb(result){
                        $ionicLoading.hide();
                        deferred.resolve(result);
                        
                    });
                
               /* var mockDownlistData = {data:{
    "success": "true", 
    "LU_Location": [
        {
            "LocationID": "1", 
            "ProjectID": "1", 
            "ZoneName": "ZoneName1", 
            "AreaName": "AreaName1"
        }, 
        {
            "LocationID": "4", 
            "ProjectID": "1", 
            "ZoneName": "ZoneName2", 
            "AreaName": "AreaName2"
        }, 
        {
            "LocationID": "6", 
            "ProjectID": "1", 
            "ZoneName": "ZoneName3", 
            "AreaName": "AreaName3"
        }, 
        {
            "LocationID": "7", 
            "ProjectID": "1", 
            "ZoneName": "ZoneName4", 
            "AreaName": "AreaName4"
        }, 
        {
            "LocationID": "9", 
            "ProjectID": "2", 
            "ZoneName": "ZoneName5", 
            "AreaName": "AreaName5"
        }, 
        {
            "LocationID": "10", 
            "ProjectID": "2", 
            "ZoneName": "ZoneName6", 
            "AreaName": "AreaName6"
        }
    ], 
    "LU_Category": [
        {
            "CategoryID": "1", 
            "CategoryName": "Eng", 
            "CategoryChineseName": "中文"
        }, 
        {
            "CategoryID": "3", 
            "CategoryName": "Eng2", 
            "CategoryChineseName": "中文2"
        }
    ], 
    "LU_Trade": [
        {
            "TradeID": "2", 
            "ProjectID": "1", 
            "TradeName": "ta", 
            "TradeChineseName": "ta_zh"
        }, 
        {
            "TradeID": "3", 
            "ProjectID": "1", 
            "TradeName": "tb", 
            "TradeChineseName": "tb_zh"
        }
    ], 
    "LU_Company": [
        {
            "CompanyID": "1", 
            "ProjectID": "1", 
            "CompanyName": "ca", 
            "CompanyChineseName": "ca_zh"
        }, 
        {
            "CompanyID": "2", 
            "ProjectID": "1", 
            "CompanyName": "cb", 
            "CompanyChineseName": "cb_zh"
        }
    ], 
    "LU_Project": [
        {
            "ProjectID": "1", 
            "ProjectNO": "1", 
            "ProjectName": "1"
        }
    ], 
    "tbl_UserProfile": [
        {
            "StaffID": "1", 
            "Name": "Name1", 
            "ProjectID": "1"
        }
    ]
}};
                deferred.resolve(mockDownlistData); */
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