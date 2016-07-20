'use strict';

(function () {
	angular.module('LoginCtrl', ['ionic','ngStorage'])
		.controller('LoginCtrl', function($rootScope,$scope, $translate, userFactory, $window, $ionicPopup, $timeout,localStorageService,$state){
      
	      $scope.isShowWarning = false;
	      var loginO = {
	        username:"",
	        password:""
	      }

	      $scope.loginO = loginO;
	      $scope.activeSignIn = function(){

	        var loginReq = {
	          username:$scope.loginO.username,
	          password:$scope.loginO.password
	        }; 
	        console.log(loginReq);
	        userFactory.login(loginReq).then(
	            function(result){
	              console.log(result);
	              if(result.success){
	                // var href = $window.location.href;
	                // var url = href.split('#')[0] + "#/tab/newAct";
	                // $window.location.href = url;
	                localStorageService.set('token',result.token);
	                //$localStorage.token = result.token;
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