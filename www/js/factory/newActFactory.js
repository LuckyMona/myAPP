'use strict';

(function () {
    angular.module('starter')
        .factory('newActFactory', newActFactoryFunc);

        function newActFactoryFunc($q, $http){

            var _getDownlist = function(getDownlistReq){
                console.log(getDownlistReq);
                var deferred = $q.defer();
                /*$http.post(url, req)
                    .then(function(result){
                        deferred.resolve(result);
                    });*/
                var mockDownlistData = {
                    success:true,
                    data:{
                        location:{
                            'blockA':['floorA1','floorA2'],
                            'blockB':['floorB1','floorB2','floorB3'],
                        },
                        category:['category1', 'category2', 'category3'],
                        review:['reviewUser1', 'reviewUser2', 'reviewUser3'],
                        trade:['trade1', 'trade2', 'trade3'],
                        subcontractor:['subcontractor1','subcontractor2'],
                        jobNumber:{
                            'J1234':'Project AAA',
                            'J2345':'Project BBB',
                            'J3456':'Project CCC',
                        },
                    }
                }
                deferred.resolve(mockDownlistData);
                return deferred.promise;
            }

            var _getTasklist = function(getTasklistReq){
                console.log(getTasklistReq);
                var deferred = $q.defer();
                /*$http.post(url, req)
                    .then(function(result){
                        deferred.resolve(result);
                    });*/
                var mockTaklistData = {
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
                deferred.resolve(mockTaklistData);
                return deferred.promise;
            }

            var _uploadAct = function(uploadActReq){
                console.log(uploadActReq);
                var deferred = $q.defer();
                /*$http.post(url, req)
                    .then(function(result){
                        deferred.resolve(result);
                    });*/

                var uploadActData = {
                    success:true,
                    ActivityId:123,
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