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
                        reviewUser:['reviewUser1', 'reviewUser2', 'reviewUser3'],
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

            return {
               getDownlist:_getDownlist
            }
        }

})();