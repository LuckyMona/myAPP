'use strict';

(function () {
	angular.module('LoginCtrl', ['ionic','ngStorage'])
		.controller('LoginCtrl', function($rootScope,$scope, $translate, userFactory, $window, $ionicPopup, $timeout,localStorageService,$state,$localStorage){
      
	      $scope.isShowWarning = false;
	      var loginO = {
	        username:"",
	        password:""
	      }

	      $scope.loginO = loginO;
	      $scope.activeSignIn = function(){

	        var loginReq = {
	          username:$scope.loginO.username,
	          password:$scope.loginO.password,

	        };
	        // var loginReqStr = "username="+$scope.loginO.username + "&password=" +$scope.loginO.password + "&grant_type=password&client_id=123";
	        var loginReqStr = "username=training44&grant_type=password&client_id=27e0501f-5dad-4b7e-b6c7-bd66a20ec626&device_id=123456&device_name=PcClient&password=wrGam13546";
	        //console.log(loginReq);
	        userFactory.login(loginReqStr).then(
	            function(result){
	              console.log(result);
	              if(result.statusText ==='OK'){
	                // var href = $window.location.href;
	                // var url = href.split('#')[0] + "#/tab/newAct";
	                // $window.location.href = url;
	                
	                localStorageService.set('token',result.data);
	                localStorageService.set('staffID', '123');
	                localStorageService.set('UID', 'This_is_UID');
	                localStorageService.set('Name', 'Name');
	                localStorageService.set('username',$scope.loginO.username);
	                //$localStorage.token = result.data;
	                
	                $rootScope.$broadcast('loginSuccess');
	                $state.go('tab.newAct');
	              } else {
	                console.log('登录名或密码不正确');
	                $scope.showAlert();
	              }
	            }
	          )
	      }
	      $scope.showAlert = function(){
	      	var myAlert = $ionicPopup.alert({
	      		title: '账号或密码不正确！',
     			template: '<p style="text-align:center;">请重新输入</p>'
	      	});
	      	myAlert.then(function(res) {
			     console.log('ok');
			});
			$timeout(function() {
				myAlert.close();
			}, 800);
	      }


	    $scope.changeLanguage = function (key) {
	      $translate.use(key);
	    };
	});
})();