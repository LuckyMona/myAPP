'use strict';
(function(){
	// Add method decodeBase64 method to string
	String.prototype.encodeBase64 = function(){
        return window.btoa(unescape(encodeURIComponent(this)));
    }
    String.prototype.decodeBase64 = function(){
        return decodeURIComponent(escape(window.atob(this)));
    };
    
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
		.controller('LoginCtrl', function(PARAMS, $rootScope, $scope, $translate, userFactory, $window, $ionicPopup, $timeout,localStorageService,$state,$localStorage,helpToolsFactory){
      
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
	        userFactory.login(loginReqStr, 0).then(
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
	                
	                // 预留时间，等代码执行到newActCtrl.js的$on处，否则$on接收不到信息
	                $timeout(function(){
	                	console.log('loginSuccess');
	                	$rootScope.$broadcast('loginSuccess');  // 通知去服务器下载更新的数据，如DropDownList，JobList
	                },2000);
	                
	                $state.go('tab.newAct');
	              } else if(result.status < 0) {
	                console.log(helpToolsFactory.i18nT('NET_WORK_ERROR'));
	               	helpToolsFactory.showAlert(helpToolsFactory.i18nT('NET_WORK_ERROR'));
	              } else {
	                console.log(helpToolsFactory.i18nT('INVALID_LOGIN'));
	                helpToolsFactory.showAlert(helpToolsFactory.i18nT('INVALID_LOGIN'));
	              }
	            }
	          )
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