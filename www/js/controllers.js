
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
.controller('taskListCtrl', function($scope,$window, $timeout,localStorageService){
    // var href =  $window.location.href.split('#')[0] + "#/tab/taskList";
    var getTasklist = function(){
       $scope.tasklists = localStorageService.get('tasklistData');
       console.log($scope.tasklists);
    }
    getTasklist();


})
.controller('UploadsCtrl', function($rootScope, $scope, $stateParams, localStorageService, dbFactory) {
   console.log('UploadsCtrl');
   // $scope.uploadItems = dbFactory.findAll('fe_Activity') || "";
   dbFactory.findAll('fe_Activity', function(results){
        $scope.uploadItems = results;
   });
   
   $rootScope.$on('saveAct', function(){
        //$scope.uploadItems = localStorageService.get('actDatas');
        // console.log('on saveAct');
        dbFactory.findAll('fe_Activity', function(results){
            $scope.uploadItems = results;
            // console.log('$scope.uploadItems:'+$scope.uploadItems);
        });
        
   });
})

.controller('SystemCtrl', function($rootScope, $scope,$window,$timeout,localStorageService, $state) {
  
   $scope.jobList = 'J1';
   $scope.allow3G = false;

    // jobList.html页面单选后跳回来    
    $scope.$watch("jobList", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        console.log('oldVal:'+oldVal);
        if(newVal==oldVal){
          return;
        }
        $state.go('tab.system');
    });

    // 监听是否选中Allow 3G
    $scope.$watch('allow3G', function(newVal, oldVal){
        console.log('allow3G newVal：'+newVal);
        localStorageService.set('allow3G',newVal);
        $rootScope.$broadcast('allow3G_Change');
    })

    $scope.signOut = function(){
        localStorageService.clearAll();
        $state.go('tab.newAct');
    }
})

.controller('ActiveCtrl', function($scope){
  
})
.controller('IdCtrl', function($scope){
  
})
.controller('newActCtrl', function($rootScope, $scope, $window, $timeout,localStorageService,$cordovaCamera){ 
})
.controller('FloorCtrl', function($rootScope, $scope, localStorageService, $state, $ionicViewSwitcher){
    
    //$scope.a = {"floorModel":""};
    $scope.floorModel = ''; 
    $scope.floorItems = localStorageService.get('floorItems');
    
    $scope.$watch('floorModel', function(newVal,oldVal){
        console.log('floorNewVal:'+ newVal);
        if(newVal === oldVal){
          return;
        }
        // localStorageService.set('floorSelected', newVal);
        $rootScope.$broadcast('floorChange', newVal);
        // console.log('$state');
        $state.go('tab.newAct');
        $ionicViewSwitcher.nextDirection("back");

    });

    /*$scope.radioChange = function(){
        console.log('radioChange');
    }*/
    // $scope.$watch('test', function(){
    //     console.log('radioChange');
    // });

})
.controller('BlockCtrl', function($scope,localStorageService,$state){
    $scope.blockItems = localStorageService.get('blockItems');

    $scope.getFloor = function(block){
        // console.log('getFloor:'+block);
        var locations = localStorageService.get('downlistData').location;
        
        for(var i in locations){
            if(i === block){
                localStorageService.set('floorItems', locations[i]);
            }
        }
        localStorageService.set('blockSelected',block);
        $state.go('floor');
    }
    
})

.controller('CategoryCtrl', function($rootScope,$scope, categoryFactory, localStorageService, $state, $ionicViewSwitcher){
    
    $scope.category = "";
    $scope.categoryItems = localStorageService.get('categoryItems');
    $scope.$watch('category', function(newVal, oldVal){
    console.log('newVal:'+newVal);
    // console.log('oldVal:'+oldVal);
    if(newVal==oldVal){
      return;
    } 
    
    $rootScope.$broadcast('categoryChange',newVal);
    $state.go('tab.newAct');
    $ionicViewSwitcher.nextDirection("back");
    
  });
})
.controller('LanguageCtrl', function($scope){
    $scope.lan = 'En';
})

.controller('ReviewCtrl', function($rootScope,$scope, localStorageService, $state, $ionicViewSwitcher){

    var reviewItems = localStorageService.get('reviewItems');
    console.log('reviewItems'+reviewItems);

    $scope.reviewList = [];

    for(var i=0, len=reviewItems.length; i<len; i++){
        $scope.reviewList.push({
            text:reviewItems[i], checked:false
        });
    }
    // [{text:'Alan', checked:false}]
  
    $scope.reviewDone = function(){
      
      var reviewData = [];
      var arr = $scope.reviewList;
      for(var i=0, len=arr.length; i<len; i++){
        if(arr[i].checked){
          reviewData.push(arr[i].text);
        } else continue;
      }
      console.log('reviewData:'+reviewData.join(','));
      
      if(reviewData.length >0 ){
        $rootScope.$broadcast('reviewDone',reviewData.join(','));
      }
      $state.go('tab.newAct');
      $ionicViewSwitcher.nextDirection("back");
  }
})
.controller('TradeCtrl', function($rootScope,$scope,$state, $ionicViewSwitcher){
  
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
    
      if ( reviewData.length>0){
        $rootScope.$broadcast('tradeDone',reviewData.join(','));
      }
      $state.go('tab.newAct');
      $ionicViewSwitcher.nextDirection("back");


  }
})
.controller('SubcontractorCtrl', function($rootScope,$scope,$state, $ionicViewSwitcher){
 
  // $scope.category = 'Category A';
  $scope.subcontractor = "Select Subcontractor";
  $scope.subcontractorList = [
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
      $state.go('tab.newAct');
      $ionicViewSwitcher.nextDirection("back");


  }
});
/*.controller('TabCtrl', function($scope,$window, $timeout,localStorageService){
    var href =  $window.location.href.split('#')[0] + "#/tab/taskList";
    $scope.tabGetTasklist = function(){
        var taskListData = localStorageService.get('tasklistData');
    }
})*/
