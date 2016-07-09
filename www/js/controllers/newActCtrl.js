'use strict';
(function () {
	angular.module('NewActCtrl', ['LocalStorageModule'])
		.controller('NewActCtrl', ['$rootScope', '$scope', '$window', '$timeout','localStorageService','$cordovaCamera',
							function($rootScope, $scope, $window, $timeout,localStorageService,$cordovaCamera){
	
	$scope.isTradeShow = false;
    $scope.isReviewShow = false;
    $scope.attachImgs = [];
    $scope.toggleTradeShow = function(){
      $scope.isTradeShow = !$scope.isTradeShow;
    }

    // floor.html页面单选后跳回来
    $scope.floor = 'A';
    
    $scope.review = 'Allan';

    var href = $window.location.href;
    $scope.m_url = href.split('#')[0] + "#/tab/newAct";
   

    $scope.$watch("floor", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
        $timeout(function() {
            $window.location.href =  $scope.m_url;
        }, 200);
    })

    /*$scope.changeCategory = function(){
    	console.log('changeCategory');
    	$scope.category = "changeCategory";
    }*/

    // category.html页面单选后跳回来
    // $scope.category = 'Select Category';
    $scope.category = 'Select Category';
    $rootScope.$on('categoryChange', function(d, data){
      
      $scope.category = data;
    });

    $scope.review = 'Select User';
    $rootScope.$on('reviewDone', function(d, data){
     
      $scope.reviewStyle = {"color":"#333"};
      $scope.review = data;
    });

    $scope.trade = 'Select Trade';
    $rootScope.$on('tradeDone', function(d, data){
      
      $scope.isTradeShow = true;
      $scope.tradeStyle = {"color":"#333"};
      $scope.trade = data;
    });

    $scope.clearTrade = function(){
       $scope.tradeStyle = {"color":"#ceced2"};
       $scope.trade = 'Select Trade';
    }
   
    // language.html页面单选后跳回来
    $scope.$watch("lan", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
        
        var href = $window.location.href;
        var s_url = href.split('#')[0] + "#/tab/system";
        /*console.log('sm_url:'+ $scope.m_url);*/
        $timeout(function() {
            $window.location.href =  s_url;
            /*console.log('url:' + url);
            console.log('sm_url:'+ $scope.m_url);*/
        }, 200);
    });

    //重构选择跳转
    /*$scope.afterSelect = function(siteName){
      
      var url = "http://" + $window.location.host + "#/tab/newAct";
     
      $scope.$watch(siteName, function(newVal,oldVal){
          console.log('newVal:'+newVal);
          if(newVal==oldVal){
            return;
          }
          $timeout(function() {
              $window.location.href = url;
          }, 500);
      })
    }
    $scope.afterSelect(siteName);*/

    /*
     * translate log_input hint when change language
     * @author Mary
     */
    
    $scope.mockInputData = "Input Diary Entry Here…";

    $rootScope.$on('changeLanguage', function(e, lang){
        
      if(lang === "zh_hk"){
        $scope.mockInputData = "請輸入項目日誌…";
        $scope.category = "選擇類別";
        $scope.review = "選擇用戶";

      } else {
        $scope.mockInputData = "Input Diary Entry Here…";
        $scope.category = "Select Category";
        $scope.review = "Select User";
      }
    });

    /*
     * 从图库选添加照片&&拍照
     * @author Mary
     */
   function _setOptions(srcType) {
        var options = {
            // Some common settings are 20, 50, and 100
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true  //Corrects Android orientation quirks
        }
        return options;
    }

    //拍照
    $scope.takePhoto = function(){
      var options = _setOptions(Camera.PictureSourceType.CAMERA);
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
             
              $cordovaCamera.getPicture(options).then(function(imgURI) {
                //$scope.imgURI = imgURI;
                $scope.attachImgs.unshift({
                  'imgURI':imgURI
                });
              }, function(err) {
                console.debug("Unable to obtain picture: " + error, "app");
              });

              /*$cordovaCamera.cleanup().then(function(){
                console.log('cleanup success');
              },function(){
                console.log('cleanup err');
              });*/
          }
    }

    //新增图片
   
    $scope.getPhoto = function(){

          //var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
          //var options = _setOptions(Camera.PictureSourceType.SAVEDPHOTOALBUM);
           var options = {
            // Some common settings are 20, 50, and 100
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true  //Corrects Android orientation quirks
        }
          //var func = createNewFileEntry;
          /*options.targetHeight = 100;
          options.targetWidth = 100;*/
          // if (selection == "picker-thmb") {
          //     // To downscale a selected image,
          //     // Camera.EncodingType (e.g., JPEG) must match the selected image type.
          //     options.targetHeight = 100;
          //     options.targetWidth = 100;
          // }

          document.addEventListener("deviceready", onDeviceReady, false);
          function onDeviceReady() {
              /*navigator.camera.getPicture(function cameraSuccess(imageUri) {

                  $scope.imgUri = imageUri;

              }, function cameraError(error) {
                  console.debug("Unable to obtain picture: " + error, "app");

              }, options);*/

              $cordovaCamera.getPicture(options).then(function(imgURI) {
                //$scope.imgURI = imgURI;
                $scope.attachImgs.unshift({
                  'imgURI':imgURI
                });
              }, function(err) {
                console.debug("Unable to obtain picture: " + error, "app");
              });

              /*$cordovaCamera.cleanup().then(function(){
                console.log('cleanup success');
              },function(){
                console.log('cleanup err');
              });*/
          }
    }
    

    // log input clear content when focus
    $scope.mockInputFocus = function($event){
      console.log('onFocus');
      $scope.mockInputData = "";
      $scope.style = {"color":"#000"};
      // $event.target.focus();
      /*$event.target.click();*/
      //return true;
      var e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      document.getElementById("mockinput").dispatchEvent(e);
      document.getElementById("mockinput").click();
      //document.getElementById('realInput').onclick();
      // angular.element('#mockinput').trigger('click');
      //angular.element(document.getElementById("mockinput")).triggerHandler('click');
      
     // console.log($event);
    }

    //监控log input高度变化
    /*$scope.$watch("$scope.style.height", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
    });*/

   /* var ele = document.getElementById("mockinput");
     //var h = ele.offsetHeight;
     $scope.$watch('ele.offsetHeight', function(newVal, oldVal){
       console.log('newVal:'+newVal);
       console.log('oldVal:'+oldVal);
     });
     if(ele.offsetHeight>36){
       console.log(ele.offsetHeight);
       var h2 = ele.getBoundingClientRect().height;
       console.log(h2);
     }
    */

		}]);

})();




