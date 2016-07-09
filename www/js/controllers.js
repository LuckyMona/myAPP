
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
})
.controller('BlockCtrl', function($scope){
 
})

.controller('CategoryCtrl', function($rootScope,$scope, categoryFactory, $window, $timeout){
  var href = $window.location.href;
  var m_url = href.split('#')[0] + "#/tab/newAct";

  // $scope.category = 'Category A';
  $scope.$watch('category', function(newVal, oldVal){
    console.log('newVal:'+newVal);
    console.log('oldVal:'+oldVal);
    if(newVal==oldVal){
      return;
    } 
    
    $rootScope.$broadcast('categoryChange',newVal);
    
    $timeout(function() {
        $window.location.href =  m_url;
    }, 200);


  });
})
.controller('LanguageCtrl', function($scope){
  $scope.lan = 'En';
})
.controller('ReviewCtrl', function($rootScope,$scope, $window, $timeout){
  var href = $window.location.href;
  var m_url = href.split('#')[0] + "#/tab/newAct";

  // $scope.category = 'Category A';
  $scope.review = "Select User";
  $scope.devList = [
    {text:'Alan', checked:false},
    {text:'Ross', checked:false},
    {text:'Ruby', checked:false}
   
  ];
  $scope.reviewDone = function(){
      
      var reviewData = [];
      var arr = $scope.devList;
      for(var i=0, len=arr.length; i<len; i++){
        if(arr[i].checked){
          reviewData.push(arr[i].text);
        } else continue;
      }
      console.log(reviewData);

      $rootScope.$broadcast('reviewDone',reviewData.join(','));
      $timeout(function() {
        $window.location.href =  m_url;
    }, 200);


  }
})
.controller('TradeCtrl', function($rootScope,$scope, $window, $timeout){
  var href = $window.location.href;
  var m_url = href.split('#')[0] + "#/tab/newAct";

  // $scope.category = 'Category A';
  $scope.trade = "Select User";
  $scope.tradeList = [
    {text:'trade1', checked:false},
    {text:'trade2', checked:false},
    {text:'trade3', checked:false}
   
  ];
  $scope.tradeDone = function(){
      
      var reviewData = [];
      var arr = $scope.tradeList;
      for(var i=0, len=arr.length; i<len; i++){
        if(arr[i].checked){
          reviewData.push(arr[i].text);
        } else continue;
      }
      console.log(reviewData);

      $rootScope.$broadcast('tradeDone',reviewData.join(','));
      $timeout(function() {
        $window.location.href =  m_url;
    }, 200);


  }
});
