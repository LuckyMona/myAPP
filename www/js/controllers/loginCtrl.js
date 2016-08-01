'use strict';
(function(){
	// Add method decodeBase64 method to string
	String.prototype.encodeBase64 = function(){
        return window.btoa(unescape(encodeURIComponent(this)));
    }
    String.prototype.decodeBase64 = function(){
        return decodeURIComponent(escape(window.atob(this)));
    };
    /*var str = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJnYW1za2FcXFRyYWluaW5nNDQiLCJmbiI6IlRyYWluaW5nNDQiLCJtYWlsIjoidHJhaW5pbmc0NEBnYW1tb25jb25zdHJ1Y3Rpb24uY29tIiwiZWlkIjoiZ2Ftc2thXFxUcmFpbmluZzQ0Iiwib2J1IjoiIiwiaGJ1IjoiIiwicGljIjoiaHR0cDovL3RlbXBhZGRyZXNzLmdhbW1vb25jb25zdHJ1Y3Rpb24uY29tL2JsYWgvLmpwZyIsInN0YWZmaWQiOlsiMzU0IzEyMyIsIjM3MyMxNTUiXSwicm9sZSI6WyIzNTQjU0RfQSIsIjM3MyNTRF9SIl0sImlzcyI6Imh0dHA6Ly9pZGVudGl0eS5nYW1tb25jb25zdHJ1Y3Rpb24uY29tIiwiYXVkIjoiaHR0cDovL3NpdGVkaWFyeS5nYW1tb25jb25zdHJ1Y3Rpb24uY29tIiwiZXhwIjoxNDY5ODM1OTgzLCJuYmYiOjE0Njk3OTI3ODN9.udNLRfXtT_9D5KT7BxkGXoj1XQw41jlJG4EZzXBQN6A';
    console.log(str);
    var dotPlace = str.lastIndexOf('.');
    var newStr = str.substr(0,dotPlace);*/
    //var jsonStr = newStr.decodeBase64();
    //console.log(jsonStr);
    //str.replace('/\./');
    //console.log(newStr.decodeBase64());
    /*
    sample:
    var str = 'sdfasdasdfa';
    var base64Str = str.encodeBase64();
    var deBase64Str = base64Str.decodeBase64();
    console.log(base64Str);
    console.log(deBase64Str);*/
})();

(function () {

	angular.module('LoginCtrl', ['ionic','ngStorage'])
		.controller('LoginCtrl', function(PARAMS, $rootScope, $scope, $translate, userFactory, $window, $ionicPopup, $timeout,localStorageService,$state,$localStorage){
      
	      $scope.isShowWarning = false;
	      var loginO = {
	        username:"Training44",    // For testing only
	        password:"wrGam13546"
	        //username:"",
	        //password:""
	      }

	      $scope.loginO = loginO;


	      function decodeToken(token){

	         var accToken = token.access_token;
	         var accTokenArr = accToken.split('.');

	        return accTokenArr[1].decodeBase64();
	      }
	      $scope.activeSignIn = function(){

	        var loginReq = {
	          username:$scope.loginO.username,
	          password:$scope.loginO.password,

	        };

	        var device_id = "123456";     // TODO: hardcode first? but need to get the mobile's device_id???
	        var device_name = "PcClient"; // TODO: hardcode first? but need to get the mobile's device_name???

	        var loginReqStr = "username=" + $scope.loginO.username
	                        + "&grant_type=password&client_id=" + PARAMS.CLIENT_ID
	                        + "&device_id=" + device_id + "&device_name=" + device_name
	                        + "&password=" + $scope.loginO.password;

	        //console.log(loginReq);
	        userFactory.login(loginReqStr).then(
	            function(result){
	              console.log(result);
	              if(result.statusText ==='OK'){
	                
	                localStorageService.set('token',result.data);
	                $localStorage.token = result.data;

	                var accTokenStr = decodeToken(result.data);	                
	                var accToken_Json = JSON.parse(accTokenStr);
	               
	                console.log(accToken_Json);

	                var staffProjectObjArr = [];
	                
	                accToken_Json.staffid.forEach(function(item, index, arr){
	                	//var staff_project_Arr = item.split("#");
	                	var staff_project_Obj = {
	                		ProjectID:item.split("#")[0],
	                		StaffID:item.split("#")[1],
	                	}
	                	console.log(staff_project_Obj);
	                	staffProjectObjArr.push(staff_project_Obj);

	                });

	                localStorageService.set('Project#Staff', accToken_Json.staffid);
	                localStorageService.set('UID', accToken_Json.uid);
	                localStorageService.set('Name', accToken_Json.fn);
	                localStorageService.set('access#exp',accToken_Json.exp);
	                localStorageService.set('username',$scope.loginO.username);
	                //$localStorage.token = result.data;
	                
	                $rootScope.$broadcast('loginSuccess');  // 通知去服务器下载更新的数据，如DropDownList，JobList
	                $state.go('tab.newAct');
	              } else if(result.status < 0) {
	                console.log('网络连接错误');
	                $scope.showAlert('网络连接错误');
	              } else {
	                console.log('账号或密码不正确！');
	                $scope.showAlert('账号或密码不正确！');
	              }
	            }
	          )
	      }
	      $scope.showAlert = function(msg){
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

	       $scope.activeClear = function(){
	      	$scope.loginO.username = "";
	      	$scope.loginO.password = "";
	      }

	    $scope.changeLanguage = function (key) {
	      $translate.use(key);
	    };
	});
})();