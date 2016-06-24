angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
.controller('taskListCtrl', function($scope) { 


})
.controller('UploadsCtrl', function($scope, $stateParams, Chats) {
  // $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SystemCtrl', function($scope) {
  // $scope.settings = {
  //   enableFriends: true
  // };
})
.controller('ActiveCtrl', function($scope){
  
})
.controller('IdCtrl', function($scope){
  
})
.controller('newActCtrl', function($scope, $window, $timeout){
    $scope.isTradeShow = false;
    $scope.isReviewShow = false;
    $scope.toggleTradeShow = function(){
      $scope.isTradeShow = !$scope.isTradeShow;
    }

    // floor.html页面单选后跳回来
    $scope.floor = 'A';
    $scope.category = 'A';
    $scope.review = 'Allan';

    var url = "http://" + $window.location.host + "#/tab/newAct";
   
    $scope.$watch("floor", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
        $timeout(function() {
            $window.location.href = url;
        }, 200);
    })

    // category.html页面单选后跳回来
    $scope.$watch("category", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
        $timeout(function() {
            $window.location.href = url;
        }, 200);
    });

    // review.html页面单选后跳回来
    $scope.$watch("review", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
        $timeout(function() {
            $window.location.href = url;
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
    $scope.mockInputData = "Input activity log here ...";
    $scope.mockInputFocus = function($event){
      console.log('onFocus');
      $scope.mockInputData = "";
      $scope.style = {"color":"#000"}
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
});
