// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var appVersion = "0.0.0";
angular.module('starter', [
  'ionic', 
  'starter.controllers', 
  'starter.services',
  'pascalprecht.translate',
  'LocalStorageModule',
  'userPref',
  'translation',
  'ngCordova',
  'LoginCtrl',
  'NewActCtrl',
  'ngStorage'
])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    cordova.getAppVersion(function(version) {
        appVersion = version;
    })
  });
})
/*.directive('spyStyle',function(){
  return {
    link: function(scope, ele, attrs){
      scope.$watch(function(){
        //return ele.css(attrs['spyAttribute']);
        return ele.css('height');
      }, styleChangedCallBack, true);

      function styleChangedCallBack(newValue, oldValue) {
        console.log('here');
                if (newValue !== oldValue) {
                    // do something interesting here
                    // invoking callback function:
                    //scope[attrs['spyStyle']](newValue);
                    console.log('styleChange');
                    var ele = document.getElementById("lastEle");
                    var newMarginBottom = parseInt(newValue - oldValue + 100) + "px";
                    ele.style.marginBottom = newMarginBottom;
                }
            }


    }
  }
})*/
/*.directive('targetStyle', function(){
  return {
    link: function(scope, ele, attrs){
      scope.$watch('_height', function(newH, oldH){
        console.log('target');
        ele.attr( 'style', 'margin-bottom: ' + (100 + newH - oldH) + 'px' );
      })
    }
  }
})
.directive('spyStyle',function(){
  return {
    link: function(scope, ele, attrs){
      scope.$watch(function(){
        console.log('spy');
        scope._height = ele.offsetHeight;
      });*/

      /*function styleChangedCallBack(newValue, oldValue) {
                if (newValue !== oldValue) {
                    // do something interesting here
                    // invoking callback function:
                    //scope[attrs['spyStyle']](newValue);
                    var ele = document.getElementById("lastEle");
                    var newMarginBottom = parseInt(newValue - oldValue + 100) + "px";
                    ele.style.marginBottom = newMarginBottom;
                }
            }


    }
  }
})*/

.config(function($stateProvider, $urlRouterProvider, $localStorageProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    // controller: 'TabCtrl'
  })

  // Each tab has its own nav history stack:
  .state('login', {
    url: '/login',
    abstract: true,
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
    // views: {
    //   'login': {
    //     templateUrl: 'templates/login.html',
    //     controller: 'LoginCtrl'
    //   }
    // }
  })
  .state('login.active', {
    url:'/active',
    views:{
      'login-active':{
        templateUrl:'templates/login-active.html',
        controller:'LoginCtrl'
      }
    }
  })
  .state('login.id', {
    url:'/id',
    views:{
      'login-id':{
        templateUrl:'templates/login-id.html',
        controller:'LoginCtrl'
      }
    }
  })
  .state('tab.taskList', {
    url: '/taskList',
    views: {
      'tab-taskList': {
        templateUrl: 'templates/tab-taskList.html',
        controller: 'taskListCtrl'
      }
    }
  })
  
  .state('tab.uploads', {
      url: '/uploads',
      views: {
        'tab-uploads': {
          templateUrl: 'templates/tab-uploads.html',
          controller: 'UploadsCtrl'
        }
      }
    })
    /*.state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })*/

  .state('tab.system', {
    url: '/system',
    views: {
      'tab-system': {
        templateUrl: 'templates/tab-system.html',
        controller: 'SystemCtrl'
      }
    }
  })
  .state('tab.newAct', {
    url: '/newAct',
    /*templateUrl: 'templates/newAct.html',
    controller: 'NewActCtrl'*/
    views: {
      'tab-newAct': {
        templateUrl: 'templates/tab-newAct.html',
        controller: 'NewActCtrl'
      }
    }
  })
  .state('photo', {
    url: '/photo',
    templateUrl: 'templates/photo.html',
    // controller: 'NewActCtrl'
    /*views: {
      'tab-newAct': {
        templateUrl: 'templates/tab-newAct.html',
        controller: 'NewActCtrl'
      }
    }*/
  })
  .state('block', {
    url: '/block',
    templateUrl: 'templates/block.html',
    controller: 'BlockCtrl'
    
  })
  .state('floor', {
    url: '/floor',
    templateUrl: 'templates/floor.html',
    // controller: 'FloorCtrl'
    // views: {
    //   'newAct': {
    //     templateUrl: 'templates/floor.html',
    //     controller: 'FloorCtrl'
    //   }
    // }
  })
  .state('category', {
    url: '/category',
    templateUrl: 'templates/category.html',
    // controller: 'CategoryCtrl'
    // views: {
    //   'newAct': {
    //     templateUrl: 'templates/floor.html',
    //     controller: 'FloorCtrl'
    //   }
    // }
  })
  .state('language', {
    url: '/language',
    templateUrl: 'templates/language.html',
    controller: 'NewActCtrl'
    
  })
  .state('trade', {
    url: '/trade',
    templateUrl: 'templates/trade.html',
    controller: 'TradeCtrl'
    
  })
  .state('subcontractor', {
    url: '/subcontractor',
    templateUrl: 'templates/subcontractor.html',
    controller: 'SubcontractorCtrl'
    
  })
  .state('review', {
    url: '/review',
    templateUrl: 'templates/review.html',
    controller: 'ReviewCtrl'
    
  })
  .state('jobList', {
    url: '/jobList',
    templateUrl: 'templates/jobList.html',
    controller: 'SystemCtrl'
    
  });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/taskList');
  var token = $localStorageProvider.get('token');
  if(token){

    $urlRouterProvider.otherwise('/tab/newAct');
  } else {
    $urlRouterProvider.otherwise('/login/active');
  }
});
