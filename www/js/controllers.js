
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
.controller('UploadsCtrl', function($rootScope, $scope, $stateParams, localStorageService, dbFactory, uploadFactory) {
   console.log('UploadsCtrl');
   // $scope.uploadItems = dbFactory.findAll('fe_Activity') || "";
   dbFactory.findAll('fe_Activity', function(results){
        $scope.uploadItems = results;
   });
   $scope.startUpload = function(){
        console.log('startUpload clicked!');
        
        // isStartUpload 只有当allow3G=false并且手机连的是3G网才可以手动上传
        var isStartUpload = localStorageService.get('isStartUpload');
        if(isStartUpload ==="true"){
            uploadFactory.coreUpload(false);
            return;
        }
        console.log('not allowed manual upload');
   }
   $rootScope.$on('saveAct', function(){
        //$scope.uploadItems = localStorageService.get('actDatas');
        // console.log('on saveAct');
        dbFactory.findAll('fe_Activity', function(results){
            $scope.uploadItems = results;
            // console.log('$scope.uploadItems:'+$scope.uploadItems);
        });
        
   });
})

.controller('SystemCtrl', function($rootScope, $scope, $window,$timeout,localStorageService, $state, $ionicViewSwitcher, $translate) {
  
   
    $scope.allow3G = false;
    // $scope.isGray_language = false;
    // $scope.isGray_jobNumber = false;
    $scope.signOut = function(){
        // TODO 不应该clearAll，保留字段：ActivityId_fake / badgeUpload
        // 删除字段：token / tasklistData
        // localStorageService.clearAll();
        localStorageService.remove('token','tasklistData','badgeTask');
        $state.go('login.active');
    }

    $rootScope.$on('jobNumberSelect', function(d, data){
        $scope.jobNumber = data;
    })

    var langKey = localStorageService.get('NG_TRANSLATE_LANG_KEY');
    var getLang = function(langKey){
        if(langKey == "zh_hk"){
            $scope.lang = '繁體中文';
        } else {
           $scope.lang = 'English'; 
        }
    }
    getLang(langKey);

    $rootScope.$on('changeLanguage', function(d, data){
        getLang(data);
        $translate.use(data);
        
    });
})
.controller('LangCtrl',function($rootScope, $scope, $state, $ionicViewSwitcher){
    // language.html页面单选后跳回来
    $scope.$watch("lan", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
        
        $rootScope.$broadcast('changeLanguage', newVal);
        /*console.log('sm_url:'+ $scope.m_url);*/
        $state.go('tab.system');
        $ionicViewSwitcher.nextDirection("back");
    });
    
})
.controller('TabCtrl', function($rootScope, $scope, localStorageService){
  
    $scope.badgeUpload = localStorageService.get('badgeUpload') || 0;
    $rootScope.$on('updateBadgeUpload', function(d, data){
        $scope.badgeUpload = data;
    });

    $scope.badgeTask = localStorageService.get('badgeTask') || 0;
    $rootScope.$on('updateBadgeTask',function(d, data){
        $scope.badgeTask = data;
    });

    $rootScope.$on('jobNumberSelect', function(d, data){
        $scope.jobNumber = data;
    })
})
.controller('IdCtrl', function($scope){
  
})
.controller('JobListCtrl', function($rootScope, $scope,localStorageService,$state,$ionicViewSwitcher){
    var jobList =  localStorageService.get('downlistData').jobNumber;
    console.log(jobList);
    var jobListArr = [];
    for(var i in jobList){
        jobListArr.push({
            jobNumber:i,
            jobName:jobList[i]
        });
    }
    $scope.jobListArr = jobListArr;

    // jobList.html页面单选后跳回来
    $scope.jobList = 'J1';    
    $scope.$watch("jobList", function(newVal,oldVal){
        console.log('jobList newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
        $rootScope.$broadcast('jobNumberSelect', newVal);
        $state.go('tab.system');
        $ionicViewSwitcher.nextDirection("back");
    });
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
    {text:'trade3', checked:false},
    {text:'trade4', checked:false},
    {text:'trade5', checked:false},
    {text:'trade6', checked:false},
    {text:'trade7trade7trade7trade7trade7trade7trade7trade7trade7trade7trade7trade7trade7trade7trade7trade7trade7', checked:false},
    
   
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
