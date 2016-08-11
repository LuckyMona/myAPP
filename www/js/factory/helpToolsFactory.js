'use strict';

(function () {
    angular.module('starter')
        .factory('helpToolsFactory', helpToolsFactoryFunc);

        function helpToolsFactoryFunc($ionicPopup, $timeout, $ionicLoading, $translate){

            // 弹窗，有确认按钮
            var showAlert = function(msg){
                var myAlert = $ionicPopup.alert({
                    title: i18nT('TIPS'),
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

            // confirm弹窗，有取消和确认按钮
            var showConfirm = function(title, msg, sureCb, cancelCb){
                var confirmPopup = $ionicPopup.confirm({
                    title: title,
                    template: msg,
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        sureCb();
                    } else {
                        cancelCb();
                    }
                });
            }
            
            // i18n
            var i18nT = function(key) {
                if (key) {
                    return $translate.instant(key);
                }
                
                return key;
            }

            return {
                showAlert:showAlert,
                showMsg:showMsg,
                i18nT:i18nT,
                showConfirm:showConfirm,
            }
        }

})();