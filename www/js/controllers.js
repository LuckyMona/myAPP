
angular.module('starter.controllers', ['LocalStorageModule', 'ngStorage'])


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
       
    }
    getTasklist();


})
.controller('UploadsCtrl', function($rootScope, $scope, $stateParams, localStorageService, dbFactory, uploadFactory,$translateLocalStorage,$state, $ionicViewSwitcher) {
   
   // $scope.uploadItems = dbFactory.findAll('fe_Activity') || "";
   dbFactory.findAll('fe_Activity', function(results){
        //console.log();
        results.forEach(function(item, index, arr){
          item.photos = item.photos.split(',');
        });
        $scope.uploadItems = results;
   });
   $scope.isUploadMaskShow = false;

    $scope.editItem = function(item){
      console.log(item);
      $rootScope.$broadcast('editItem', item);
      $state.go('tab.newAct');
      $ionicViewSwitcher.nextDirection("forward");
    }

   function toggleLang(isStopUpload){
      var langKey = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
      var oStartUpload = document.getElementById('startUpload');
      if(isStopUpload==="true"){
        if(langKey === "us_en"){
          oStartUpload.innerHTML = "<p>Stop</p><p class='no-mg'>Upload</p>";
        }else if(langKey === "zh_hk"){
            oStartUpload.innerHTML = "<p>停止</p><p class='no-mg'>上傳</p>";
        }
      }else if(isStopUpload===""){
        if(langKey === "us_en"){
          oStartUpload.innerHTML = "<p>Start</p><p class='no-mg'>Upload</p>";
        }else if(langKey === "zh_hk"){
            oStartUpload.innerHTML = "<p>开始</p><p class='no-mg'>上傳</p>";
        }
      }
   }
   
   $rootScope.$on('changeLanguage',function(){
    toggleLang(localStorageService.get('isStopUpload'));
   });
   $scope.startUpload = function(){
        console.log('startUpload clicked!');

        // isStartUpload 只有当allow3G=false并且手机连的是3G网才可以手动上传
        var isStartUpload = localStorageService.get('isStartUpload');
        if(isStartUpload == null){ isStartUpload = "true"; } 
        //isStopUpload用来区分是start还是stop
        var isStopUpload = localStorageService.get('isStopUpload') || "";

        if(isStartUpload ==="true" && isStopUpload === "" && $scope.uploadItems.length>0){
        
            $scope.isUploadMaskShow = true;
            
            localStorageService.set('isStopUpload',"true")
            toggleLang("true");
            uploadFactory.coreUpload(false, function(){
                //全部上传完成后
                $scope.isUploadMaskShow = false;
                localStorageService.set('isStopUpload',"");
                toggleLang("");                
            });
            //点过start upload就把isStartUpload设为"",这样再点的时候就进不来这个if分支
            //localStorageService.set('isStartUpload',"");
            //return;
        }else if(isStartUpload ==="" || isStopUpload ==="true"){
          //已经弹出蒙版的情况，或者不允许点击StartUpload的情况，就要隐藏蒙版，按钮变为"Start"
          $scope.isUploadMaskShow = false;    //隐藏蒙版
          toggleLang("");                     //按钮变为"Start"
          localStorageService.set('isStopUpload',"");
          $rootScope.$broadcast('stopUpload');
          console.log('not allowed manual upload');
        }


        //alert('not allowed manual upload');
   }
   $rootScope.$on('saveAct', function(){
        //$scope.uploadItems = localStorageService.get('actDatas');
        // console.log('on saveAct');
        dbFactory.findAll('fe_Activity', function(results){
            
            var i, len = results.length;
            for(i=0; i<len; i++){
              results[i].photos = results[i].photos.split(',');
            }
            $scope.uploadItems = results;
            // console.log('$scope.uploadItems:'+$scope.uploadItems);
        });
        
   });
})

.controller('SystemCtrl', function($rootScope, $scope, $window,$timeout,localStorageService, $state, $ionicViewSwitcher, $translate, $localStorage) {
  
    $scope.UID = localStorageService.get('UID');
    $scope.Name = localStorageService.get('Name');
    $scope.allow3G = false;
    // $scope.isGray_language = false;
    // $scope.isGray_jobNumber = false;
    $scope.signOut = function(){
        
        // 删除字段：token / tasklistData / badgeTask
        localStorageService.remove('token','tasklistData','badgeTask');
        delete $localStorage.token;
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

    //当切换Allow 3G时触发
    $scope.$watch('allow3G', function(newVal, oldVal){
      console.log('change allow3G');
      console.log(newVal);
      $rootScope.$broadcast('allow3G_Change', newVal);
     
    });
})
.controller('LangCtrl',function($rootScope, $scope, $state, $ionicViewSwitcher,$translateLocalStorage){
    // language.html页面单选后跳回来
    $scope.$watch("lan", function(newVal,oldVal){
        
        if(newVal==oldVal){
          return;
        }
        $translateLocalStorage.set('NG_TRANSLATE_LANG_KEY',newVal);
        
        $rootScope.$broadcast('changeLanguage', newVal);
        /*console.log('sm_url:'+ $scope.m_url);*/
        $state.go('tab.system');
        $ionicViewSwitcher.nextDirection("back");
    });
    
})
.controller('TabCtrl', function($rootScope, $scope, localStorageService){
  
    $scope.badgeUpload = localStorageService.get('badgeUpload') || 0;
    $scope.uploadNum = localStorageService.get('badgeUpload') || 0;
    $rootScope.$on('updateBadgeUpload', function(d, data){
        $scope.badgeUpload = data;
        $scope.uploadNum = data;
    });

    $scope.badgeTask = localStorageService.get('badgeTask') || 0;
    $rootScope.$on('updateBadgeTask',function(d, data){
        $scope.badgeTask = data;
    });

    $scope.jobNumber = localStorageService.get('projectNo');
    $rootScope.$on('jobNumberSelect', function(d, data){
        $scope.jobNumber = data;
    })
})
.controller('PhotoCtrl', function($scope,localStorageService, $state, $ionicViewSwitcher, $rootScope){
  
  $scope.parent = {
    photoList:localStorageService.get('photoList'),
  }
  // 选择几张
  $scope.selectNum = 0;
  // 是否长按呼出选择icon
  $scope.isCallSelect = false;
  // 点击图片放大
  $scope.bigImage = false;
  $scope.showBigImg = function(imgUri){
    if($scope.isCallSelect === false){
      console.log(imgUri);
      $scope.bigImgUrl = imgUri;
      $scope.bigImage = true;
    }
    return;
  }
  $scope.hideBigImg = function(){
    
    $scope.bigImage = false;
  }

  //$scope.isShowSelectIcon = false;

  // handler of on-hold event
  $scope.callSelect = function(photoItem){

    console.log('callSelect');
    $scope.parent.photoList.forEach(function(item, index, arr){
      item.isShowSelectIcon = true;
      item.isSelected = false;
    });
    $scope.selectNum = 1;
    photoItem.isSelected = true;
    $scope.isCallSelect = true;
  }

  $scope.doSelect = function(photoItem){
      console.log('doSelect');
      if($scope.isCallSelect === true){
          if(photoItem.isSelected === true){
            photoItem.isSelected = false;
             $scope.selectNum --;
          }else{
            photoItem.isSelected = true;
            $scope.selectNum ++;
          }
      }
      return;
  }

  $scope.deletePhoto = function(){
    var photoListArr = $scope.parent.photoList;
  /*  photoListArr.forEach(function(item, index, arr){
        if(item.isSelected ===true){
          arr.splice(index,1);
        }
    });*/

    var i=0;
    for(i; i<photoListArr.length; ){
      if(photoListArr[i].isSelected===true){
        photoListArr.splice(i,1);
      }else {i++;}
    }

    $scope.parent.photoList = photoListArr;
    $scope.isCallSelect = false;
    localStorageService.set('photoList',photoListArr);
    $rootScope.$broadcast('deletePhotoDone', $scope.parent.photoList);
    $state.go('tab.newAct');
    $ionicViewSwitcher.nextDirection("back");
  }

})
.controller('JobListCtrl', function($rootScope, $scope,localStorageService,$state,$ionicViewSwitcher, $ionicHistory, helpToolsFactory){
    /*var jobList =  localStorageService.get('downlistData').jobNumber;
    console.log(jobList);
    var jobListArr = [];
    for(var i in jobList){
        jobListArr.push({
            jobNumber:i,
            jobName:jobList[i]
        });
    }*/
    $scope.jobListGoBack = function(){
      
      //$scope.jobList = localStorageService.get('jobList')||undefined;
      //console.log($scope.jobList);

      if((localStorageService.get('jobList')||undefined) === undefined){
        helpToolsFactory.showAlert('Please select your job!');
        return;
      }
      var from = $rootScope.jobList_fromState;
      
      $state.go(from);
      $ionicViewSwitcher.nextDirection("back");
    }
    $scope.jobListArr = localStorageService.get('jobItems');

    //console.log(typeof $scope.jobListArr);

    // jobList.html页面单选后跳回来
    //$scope.jobList = 'J1';
    $scope.$watch("jobList", function(newVal,oldVal){
        
        if(newVal==oldVal){
          return;
        }
        $scope.jobList = newVal;
        localStorageService.set('jobList', newVal);

        var selectProject =  $scope.jobListArr.filter(function(item, index, arr){
          return(item.ProjectID === newVal);
        });
        $rootScope.$broadcast('jobNumberSelect',selectProject[0].ProjectNo);
        localStorageService.set('projectID',newVal);
        localStorageService.set('projectNo',selectProject[0].ProjectNo);
        var StaffID = "";
        $scope.jobListArr.forEach(function(item, index, arr){
            if(item.ProjectID === newVal){
              StaffID = item.StaffID;
            }
        });

        localStorageService.set('staffID',StaffID);
        var back = $ionicHistory.backView().stateName;
        
        $state.go(back);
        $ionicViewSwitcher.nextDirection("back");
    });
})
.controller('FloorCtrl', function($rootScope, $scope, localStorageService, $state, $ionicViewSwitcher){

    $rootScope.$on('blockSelected',function(d,data){
      var floorNameArr = [];
      data.forEach(function(item, index, arr){
        floorNameArr.push(item.AreaName);
      });
      $scope.floorItems = floorNameArr;
    });

    $scope.floorModel = ''; 
    var floorItems = localStorageService.get('floorItems');
    var floorNameArr = [];
    floorItems.forEach(function(item, index, arr){
      floorNameArr.push(item.AreaName);
    });
    $scope.floorItems = floorNameArr;
    
    $scope.$watch('floorModel', function(newVal,oldVal){
        
        if(newVal === oldVal){
          return;
        }
        
        floorItems = localStorageService.get('floorItems');
        var selItems = floorItems.filter(function(item, index, arr){
          return (item.AreaName ===newVal)
        });

        $rootScope.$broadcast('floorChange', selItems);
        $state.go('tab.newAct');
        $ionicViewSwitcher.nextDirection("back");

    });
})
.controller('BlockCtrl', function($rootScope,$scope,localStorageService,$state, $ionicViewSwitcher){
    $scope.blockItems = localStorageService.get('blockItems');

    $scope.getFloor = function(block){
        var locations = $scope.blockItems,
            i,
            len = locations.length,
            areaArr = [];
        
        for(i=0; i<len; i++){
            if(locations[i].ZoneName === block){
                areaArr.push({
                  AreaName:locations[i].AreaName,
                  locationID:locations[i].LocationID
                });
            }
        }
        
        localStorageService.set('floorItems',areaArr);
        localStorageService.set('blockSelected',block);
        $rootScope.$broadcast('blockSelected',areaArr);
        $state.go('floor');
        $ionicViewSwitcher.nextDirection("forward");
    }
    
})

.controller('CategoryCtrl', function($rootScope,$scope, categoryFactory, localStorageService, $state, $ionicViewSwitcher){
    
    $scope.category = "";
    $scope.categoryItems = localStorageService.get('categoryItems');
    $scope.$watch('category', function(newVal, oldVal){
    
    // console.log('oldVal:'+oldVal);
    if(newVal==oldVal){
      return;
    }

    var textVal ='';
    var i=0, len = $scope.categoryItems.length;
    for(var i=0; i<len; i++ ){
      if($scope.categoryItems[i].CategoryID === newVal){
        textVal = $scope.categoryItems[i].name;
        break;
      }
    } 
    
    $rootScope.$broadcast('categoryChange',{
      categoryData:textVal,
      categoryID:newVal,

    });
    $state.go('tab.newAct');
    $ionicViewSwitcher.nextDirection("back");
    
  });
})
.controller('LanguageCtrl', function($scope){
    $scope.lan = 'En';
})

.controller('ReviewCtrl', function($rootScope,$scope, localStorageService, $state, $ionicViewSwitcher){

    var reviewItems = localStorageService.get('reviewItems');
    

    for(var i=0, len=reviewItems.length; i<len; i++){
        reviewItems[i].checked = false;
    }
     $scope.reviewList = reviewItems;
    // [{text:'Alan', checked:false}]
  
    $scope.reviewDone = function(){
      
      var reviewData = [],
          reviewID = [];
      var arr = $scope.reviewList;
      for(var i=0, len=arr.length; i<len; i++){
        if(arr[i].checked){
          reviewData.push(arr[i].Name);
          reviewID.push(arr[i].StaffID);
        } else continue;
      }
      //console.log('reviewData:'+reviewData.join(','));
      //console.log('reviewID:'+reviewID.join(','));
      
      if(reviewData.length >0 ){
        $rootScope.$broadcast('reviewDone',{
          "reviewData":reviewData.join(','),
          "reviewID":reviewID.join(','),
        });
      }
      $state.go('tab.newAct');
      $ionicViewSwitcher.nextDirection("back");
  }
})
.controller('TradeCtrl', function($rootScope,$scope,$state, $ionicViewSwitcher, localStorageService){
  
  // $scope.category = 'Category A';
  $scope.trade = "Select Trade";
  //$scope.tradeList = [];

  var tradeItems = localStorageService.get('tradeItems');
  for(var i=0, len = tradeItems.length; i<len; i++){
    
    tradeItems[i].checked = false;
  }
  $scope.tradeList = tradeItems;
  $scope.tradeDone = function(){
      
      var tradeData = [];
      var tradeID = [];
      var arr = $scope.tradeList;
      for(var i=0, len=arr.length; i<len; i++){
        if(arr[i].checked){
          tradeData.push(arr[i].langName);
          tradeID.push(arr[i].TradeID);
        } else continue;
      }
    
      if ( tradeData.length>0){
        $rootScope.$broadcast('tradeDone',{
          "tradeData":tradeData.join(','),
          "tradeID":tradeID.join(','),
        });
      }
      $state.go('tab.newAct');
      $ionicViewSwitcher.nextDirection("back");


  }
})
.controller('CompanyCtrl', function($rootScope,$scope,$state, $ionicViewSwitcher,localStorageService){
 
  // $scope.category = 'Category A';
  $scope.company = "Select Subcontractor";
  var companyItems = localStorageService.get('companyItems');
  for(var i=0, len=companyItems.length; i<len; i++ ){
    companyItems[i].checked =false;
  }
  $scope.companyList = companyItems;
  /*var mock = [
    {text:'trade1', checked:false},
    {text:'trade2', checked:false},
    {text:'trade3', checked:false}
  ];*/
  $scope.companyDone = function(){
      
      var companyData = [];
      var companyID = [];
      var arr = $scope.companyList;
      for(var i=0, len=arr.length; i<len; i++){
        if(arr[i].checked){
          companyData.push(arr[i].langName);
          companyID.push(arr[i].CompanyID);
        } else continue;
      }
      

      $rootScope.$broadcast('companyDone',{
        companyData:companyData.join(','),
        companyID:companyID.join(','),
      });
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
