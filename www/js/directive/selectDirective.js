'use strict';

(function () {
    angular.module('starter')
        .directive('mySelect',['$rootScope','$window','$timeout',
                        function($rootScope, $window, $timeout){
            return {
                restrict:'A',
                replace:false,
               
                scope: {
                    selectItemName:'@'
                },
                //template:'<div style="margin-top:56px;">{{selectItemName}}</div>',
                templateUrl: 'templates/select-directive.html',
                link:function(scope, element, attrs){
                    var href = $window.location.href;
                    var m_url = href.split('#')[0] + "#/tab/newAct";

                    console.log(attrs.selectItemName);
                    // $scope.category = 'Category A';
                    /*$scope.$watch(selectItemName, function(newVal, oldVal){
                    console.log('newVal:'+newVal);
                    console.log('oldVal:'+oldVal);
                    if(newVal==oldVal){
                      return;
                    } 
                    
                    $rootScope.$broadcast(selectItemName+'change', newVal);

                    $timeout(function() {
                        $window.location.href =  m_url;
                    }, 200);


                    });*/

                }
            }
        }]);

})()