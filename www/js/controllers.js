angular.module('starter.controllers', ['LocalStorageModule','userFactory'])


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
