'use strict';

(function () {
    angular.module('starter')
        .factory('newActFactory', newActFactoryFunc);

        function newActFactoryFunc($q, $http, PARAMS){

            var _getDownlist = function(getDownlistReq){
                console.log(getDownlistReq);
                
                var deferred = $q.defer();
                var url = PARAMS.BASE_URL + 'GetDataDict';
                $http.post(url, getDownlistReq)
                    .then(function(result){
                        console.log('GetDataDict result:'+result);
                        console.log(result);
                        deferred.resolve(result);
                    });
                /*var mockDownlistData = {
                    success:true,
                    data:{
                        location:{
                            'blockA':['floorA1','floorA2'],
                            'blockB':['floorB1','floorB2','floorB3'],
                        },
                        category:['category1', 'category2', 'category3'],
                        review:['reviewUser1', 'reviewUser2', 'reviewUser3'],
                        trade:['trade1', 'trade2', 'trade3', 'trade4', 'trade5', 'trade6', 'trade7'],
                        subcontractor:['subcontractor1','subcontractor2'],
                        jobNumber:{
                            'J1234':'Project AAA',
                            'J2345':'Project BBB',
                            'J3456':'Project CCC',
                        },
                    }
                }*/
                /*var mockDownlistData = {data:{
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
                deferred.resolve(mockDownlistData);*/
                return deferred.promise;
            }

            var _getTasklist = function(getTasklistReq){
                console.log('getTasklistReq:');
                console.log(getTasklistReq);
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

            var _uploadAct = function(uploadActReq){
                console.log(uploadActReq);
                var url = PARAMS.BASE_URL + 'UploadActivity';
                var deferred = $q.defer();
                var quoteReq = "\""+uploadActReq+"\"";
                console.log(quoteReq);
                /*$http.post(url, quoteReq)
                    .then(function(result){
                        console.log(result);
                        deferred.resolve(result.data);
                    });*/

                var uploadActData = {
                    success:true,
                    ActivityID:123,
                }
                deferred.resolve(uploadActData);
                return deferred.promise;
            }

            var _uploadPhotoAct = function(uploadPhotoAct){
                console.log(uploadPhotoAct);
                var deferred = $q.defer();
                /*$http.post(url, req)
                    .then(function(result){
                        deferred.resolve(result);
                    });*/
                var uploadPhotoActData = {
                    success:true,
                }
                deferred.resolve(uploadPhotoActData);
                return deferred.promise;
            }



            return {
               getDownlist:_getDownlist,
               getTasklist:_getTasklist,
               uploadAct:_uploadAct,
               uploadPhotoAct:_uploadPhotoAct,
               
            }
        }

})();