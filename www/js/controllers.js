angular.module('starter.controllers', ['LocalStorageModule'])


// .controller('DashCtrl', function($scope) {})

// .controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   };
// })
.controller('taskListCtrl', function($scope) { 


})
.controller('UploadsCtrl', function($scope, $stateParams) {
  // $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SystemCtrl', function($scope,$window,$timeout) {
  // $scope.settings = {
  //   enableFriends: true
  // };
   $scope.jobList = 'J1';

  // jobList.html页面单选后跳回来
    var href = $window.location.href;
    $scope.m_url = href.split('#')[0] + "#/tab/system";
    $scope.$watch("jobList", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        console.log('oldVal:'+oldVal);
        if(newVal==oldVal){
          return;
        }
        $timeout(function() {
            $window.location.href =  $scope.m_url;
        }, 200);
    });

})
.controller('ActiveCtrl', function($scope){
  
})
.controller('IdCtrl', function($scope){
  
})
.controller('newActCtrl', function($rootScope, $scope, $window, $timeout,localStorageService,$cordovaCamera){
    $scope.isTradeShow = false;
    $scope.isReviewShow = false;
    $scope.attachImgs = [];
    $scope.toggleTradeShow = function(){
      $scope.isTradeShow = !$scope.isTradeShow;
    }

    // floor.html页面单选后跳回来
    $scope.floor = 'A';
    $scope.category = 'A';
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

    // category.html页面单选后跳回来
    $scope.$watch("category", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        console.log('oldVal:'+oldVal);
        if(newVal==oldVal){
          return;
        }
        $timeout(function() {
            $window.location.href =  $scope.m_url;
        }, 200);
    });

    // review.html页面单选后跳回来
    $scope.$watch("review", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
        /*var href = $window.location.href;
        var url = href.split('#')[0] + "#/tab/newAct";
        console.log('sm_url:'+ $scope.m_url);*/
        $timeout(function() {
            $window.location.href =  $scope.m_url;
            /*console.log('url:' + url);
            console.log('sm_url:'+ $scope.m_url);*/
        }, 200);
    });

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
    $scope.mockInputData = "Input Diary entry here…";
    $rootScope.$on('changeLanguage', function(e, lang){
        
      if(lang === "zh_hk"){
        $scope.mockInputData = "請輸入項目日誌…";
      } else {
        $scope.mockInputData = "Input Diary entry here…";
      }
    });

    /*
     * attach photo to site by retrieving photos from image gallery
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
            allowEdit: true,
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
                $scope.attachImgs.push({
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
          var options = _setOptions(Camera.PictureSourceType.SAVEDPHOTOALBUM);
           
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
                $scope.attachImgs.push({
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

})
.controller('BlockCtrl', function($scope){
 
})

/*.controller('FloorCtrl', function($scope, $window){
    $scope.floor = 'A';
    var url = "http://" + $window.location.host + "#/tab/newAct";
   
    $scope.$watch("floor", function(newVal,oldVal){
      console.log('newVal:'+newVal);
      $window.location.href = url;
     
    })
})*/

.controller('CategoryCtrl', function($scope){
  $scope.category = 'A';
})
.controller('LanguageCtrl', function($scope){
  $scope.lan = 'En';
})
.controller('ReviewCtrl', function($scope){
  $scope.review = 'Allan';
})
.controller('LoginCtrl', function($scope, $translate){
  
    $scope.changeLanguage = function (key) {
      $translate.use(key);
    };
});
