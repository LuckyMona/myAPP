'use strict';

(function () {
    angular.module('starter')
        .factory('helpToolsFactory', helpToolsFactoryFunc);

        function helpToolsFactoryFunc($ionicPopup,$timeout,$ionicLoading){

            // 弹窗，有确认按钮
            var showAlert = function(msg){
                var myAlert = $ionicPopup.alert({
                    title: '提示',
                    template: '<p style="text-align:center;">' + msg + '</p>'
                });
                myAlert.then(function(res) {
                     console.log('ok');
                });
                $timeout(function() {
                    myAlert.close();
                }, 2000);
            }

            // 弹窗，无确认按钮，自动关闭
            var showMsg = function(msg){
                $ionicLoading.show({
                    template:msg
                });

                $timeout(function() {
                    $ionicLoading.hide();
                }, 1000);
            }

            return {
                showAlert:showAlert,
                showMsg:showMsg,
            }
        }

})();