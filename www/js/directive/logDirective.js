'use strict';

(function () {
    angular.module('starter')
        .directive('logdirective',function($interval,$ionicScrollDelegate){

            return {
                //restrict:"A",
                link:function(scope, ele, attrs){
                    var timer = null;
                    var memHeight = ele[0].offsetHeight;

                    ele.on('focus', function(){
                        $ionicScrollDelegate.scrollTo(0, 300, true);
                        console.log('focus');
                        $interval.cancel(timer);
                        console.log(timer);
                        timer = $interval(function(){
                            var oldVal = memHeight;
                            var newVal = ele[0].offsetHeight;
                            memHeight = newVal;
                            if(newVal !== oldVal){
                                console.log('height changed!');
                                
                                document.getElementById('lastEle').style.marginBottom = (100 + newVal) + 'px';
                                $ionicScrollDelegate.scrollBy(0,300+newVal,true);                                
                                
                                return;
                            }
                            //console.log('interval');

                        },1000);

                        console.log(timer);
                        timer.then(function(){
                            console.log('timer resolved');
                        }, function(){
                            console.log('timer rejected');
                        });
                    });

                    ele.on('blur', function(){
                        console.log('blur');
                        $interval.cancel(timer);
                        console.log(timer);
                    });
                      
                }
            }
        });

})();