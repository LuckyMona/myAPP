'use strict';
(function () {
	angular.module('NewActCtrl', ['LocalStorageModule'])
		.controller('NewActCtrl', ['$rootScope', '$scope', '$window', '$timeout','localStorageService','$cordovaCamera','newActFactory','$translateLocalStorage', '$cordovaNetwork','dbFactory', 'uploadFactory',
							function($rootScope, $scope, $window, $timeout,localStorageService,$cordovaCamera,newActFactory, $translateLocalStorage, $cordovaNetwork,dbFactory,uploadFactory){
	
	  $scope.isTradeShow = false;
    $scope.isReviewShow = false;
    $scope.attachImgs = [];
    $scope.isGray_location = true;
    $scope.isGray_category = true;
    $scope.isGray_review = true;
    $scope.isGray_trade = true;
    $scope.isGray_subcontractor = true;
    $scope.isGray_mockinput = true;

    $scope.toggleTradeShow = function(){
      $scope.isTradeShow = !$scope.isTradeShow;
    }
    // 获取APP Version
    /*var chkAppVersion = function(){
      var version = "";
      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
        if (window.cordova){
            cordova.getAppVersion.getVersionNumber().then(function (version) {
               version = version;
            });
        }
      }
      var chkAppVersionReq = {
        version:version
      }
    };
    chkAppVersion();*/

    // 获取Task List的数据
    var getTasklist = function(){
      console.log('getTasklist');
      var token = localStorageService.get('token');
      var getTasklistReq = {
        token:token
      }

      newActFactory.getTasklist(getTasklistReq)
        .then(function(result){
            if(result.success){
              console.log('tasklistData:');
              console.log(result.data);
              localStorageService.set('tasklistData', result.data);
            }
        })
    }
    

    // 获取下拉菜单的数据
    var getDownlist = function(){
      console.log('getDownlist');
      var token = localStorageService.get('token');
      var getDownlistReq = {
        token:token
      }

      newActFactory.getDownlist(getDownlistReq)
        .then(function(result){
          if(result.success){
            // console.log('downlistData:');
            // console.log(result.data);
            localStorageService.set('downlistData', result.data);
          }
        });
    }

    var initNewAct = function(){
      getTasklist();
      getDownlist();
    }

    initNewAct();
    $rootScope.$on('loginSuccess', function(){
      initNewAct();
    })

    // 获取地址下拉菜单
    $scope.getLocationBlock = function(){
      var locations = localStorageService.get('downlistData').location;
      var blockItems = [];
      for(var i in locations){
        console.log('i:'+i);
        blockItems.push(i);
      }
      console.log('blockItems:' + blockItems);
      localStorageService.set('blockItems', blockItems);

      $timeout(function() {
          $window.location.href =  $window.location.href.split('#')[0] + "#/block";
      }, 100);
      
    }

    // 获取Category下拉菜单
    $scope.getCategory = function(){
      var categoryItems = localStorageService.get('downlistData').category;
      localStorageService.set('categoryItems', categoryItems);
      $timeout(function() {
          $window.location.href =  $window.location.href.split('#')[0] + "#/category";
      }, 100);
    }
    
    // 获取值为数组的下拉菜单
    $scope.getArrayList = function(listName){
      console.log('listName:'+listName);
      var listItems = localStorageService.get('downlistData')[listName];
           
      localStorageService.set(listName+'Items', listItems);
      $timeout(function() {
          $window.location.href =  $window.location.href.split('#')[0] + "#/" + listName;
      }, 100);
    }


    $scope.locationOn = false;    //是否选择
    $scope.categoryOn = false;    //是否选择

    // floor.html页面单选后跳回来
    $scope.floor = 'A';
    var href = $window.location.href;
    $scope.m_url = href.split('#')[0] + "#/tab/newAct";
   

    /*$scope.$watch("floor", function(newVal,oldVal){
        console.log('newVal:'+newVal);
        if(newVal==oldVal){
          return;
        }
        $timeout(function() {
            $window.location.href =  $scope.m_url;
        }, 200);
    })*/

    /*$scope.changeCategory = function(){
    	console.log('changeCategory');
    	$scope.category = "changeCategory";
    }*/

    if(localStorageService.get('location') ){
      $scope.location =  localStorageService.get('location');
      $scope.locationOn = true;
    } else {
      var localLang = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
      //if(localStorageService.get('NG_TRANSLATE_LANG_KEY'))
      if(localLang == 'zh_hk'){
        $scope.location = '選擇地址';
      } else {
        $scope.location = 'Select Location';
      }
    }
    
    $rootScope.$on('floorChange', function(d, data){
      var block = localStorageService.get('blockSelected');
      var locationStr = block + " / " + data;
      $scope.isGray_location = false;
      $scope.location = locationStr;
      $scope.locationOn = true;
      localStorageService.set('location', locationStr);

    });

 
   
    /*
     * [onSelect 监听选项改变]
     * @param  {string}  selectName [选项名]
     * @param  {Boolean} isMulti    [是否为多选]
     * @author Mary Tien
     */
    
    $scope.reviewOn = false;
    $scope.tradeOn = false;
    $scope.subcontractorOn = false;
    var onSelect = function(selectName, isMulti){
        $scope[selectName] = 'Select ' + selectName.substring(0,1).toUpperCase()+selectName.substring(1);
        if(selectName === 'review')
        {
          $scope[selectName] = 'Select User';
        }
        if(selectName ==="category"){
          if(localStorageService.get('category')){
            $scope.category =  localStorageService.get('category');
            $scope.categoryOn = true;
          } else {
            var localLang = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
            if(localLang ==="zh_hk"){
              $scope.category = '選擇類別';
            } else {
              $scope.category = 'Select Category';
            }
          }
        }
        
        if(isMulti){
            $rootScope.$on(selectName + 'Done', function(d, data){

                $scope['is'+selectName+'Show'] = true;
                $scope['isGray_'+ selectName] = false;
                $scope[selectName] = data;
                $scope[selectName + 'On'] = true;  //是否选择
            });
            return;
        }
        $rootScope.$on(selectName + 'Change', function(d, data){
            $scope['isGray_'+ selectName] = false;
            $scope[selectName] = data;
            if(selectName === 'category'){
              localStorageService.set('category', data);
            }
            $scope[selectName + 'On'] = true;  //是否选择
        });
    }
    onSelect('review', true);
    onSelect('trade', true);
    onSelect('category', false);

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
        $scope.review = "選擇用戶";
        if(!localStorageService.get('location')){
          $scope.location = "選擇地址";
        }

        if(!localStorageService.get('category')){
          $scope.category = "選擇類別";
        }
      } else {
        $scope.mockInputData = "Input Diary Entry Here…";
        $scope.category = localStorageService.get('category') || "Select Category";
        $scope.review = "Select User";
        $scope.location = localStorageService.get('location') || "Select Location";
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
            saveToPhotoAlbum:true,
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
            saveToPhotoAlbum:true,
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
                console.debug("Unable to obtain picture: " + err, "app");
              });

              /*$cordovaCamera.cleanup().then(function(){
                console.log('cleanup success');
              },function(){
                console.log('cleanup err');
              });*/
          }
    }
    

    // log input clear content when focus
    $scope.isMockInputVal = false; // 是否填写
    $scope.mockInputFocus = function($event){
      console.log('onFocus');
      $scope.mockInputData = "";
      $scope.isGray_mockinput = false;
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
    $scope.mockInputBlur = function(){
      var mockInputCont = document.getElementById("mockinput").innerHTML;

      if(mockInputCont){
          $scope.isMockInputVal = true;
          console.log('mockinputCont:'+mockInputCont);
          console.log('$scope.isMockInputVal:'+$scope.isMockInputVal);
          $scope.mockInputData = mockInputCont;
      }
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

    var showTime = function(){
      var d = new Date();
      var date = (d.getFullYear()) + "/" + 
           (d.getMonth() + 1) + "/" +
           (d.getDate()) + " " + 
           (d.getHours()) + ":" + 
           (d.getMinutes());

      console.log('date:'+ date);
      return date;
    }
    //$scope.test_a = 'aa';
  
    //dbFactory.dropTbl('test');
    // dbFactory.createTbl('test',['aa','bb']);
    // dbFactory.save('test',{
    //   aa:'123aaa'
    // });
   
    /*db.transaction(function(tx){
      tx.executeSql('DROP TABLE fe_Activity');
      tx.executeSql('DROP TABLE fe_Activity2');
      tx.executeSql('CREATE TABLE IF NOT EXISTS fe_Activity'+
        ' (ActivityId_fake unique, Project, Location, Category, Review, Trade, Subcontractor, CreatedOn, Description)');
      //tx.executeSql('CREATE TABLE IF NOT EXISTS fe_Activity4 (ActivityId_fake unique, Location, Category)');
      // tx.executeSql('INSERT INTO PHOTOS (id, testArr) VALUES (2, "1,2,3")');
      //tx.executeSql('INSERT INTO fe_Activity (ActivityId_fake, Location) VALUES (23, ?)',[$scope.test_a]);
      //tx.executeSql('INSERT INTO fe_Activity4 (ActivityId_fake, Location) VALUES (23, ?)',[$scope.test_a]);
    });*/

    


    // 保存数据
    
    // dbFactory.dropTbl('fe_Activity');
    $scope.saveAct = function(){
      console.log('start saveAct');
      $timeout(function() {
          var confirmBy = $scope.locationOn && $scope.categoryOn && ( $scope.attachImgs.length>0 || $scope.isMockInputVal)
          /*console.log($scope.locationOn);
          console.log($scope.categoryOn);
          console.log($scope.attachImgs.length>0 || $scope.isMockInputVal);
          console.log($scope.isMockInputVal);

          console.log('confirmBy：'+ confirmBy);*/
          if(confirmBy){
            console.log('saveAct confirmBy');
            
            var time = showTime(),
                review = $scope.reviewOn? $scope.review:"",
                trade = $scope.tradeOn? $scope.trade:"",
                subcontractor = $scope.subcontractorOn? $scope.subcontractor:"",
                log = $scope.isMockInputVal? $scope.mockInputData:"";
            
            var ActivityId_fake = localStorageService.get('ActivityId_fake') || 0;
            var attPhotos = $scope.attachImgs;
            var photosArr = [];
            for(var m=0, phLen = attPhotos.length; m<phLen; m++ ){
                photosArr.push(attPhotos[m].imgURI);
            }             
            /*db.transaction(function(tx){
              tx.executeSql('SELECT * FROM fe_Activity', [], function(tx, results){
                console.log('results');
                for(var i=0, rowLen = results.rows.length; i<rowLen; i++){
                  console.log('Location:'+results.rows.item(i).Location);
                  console.log('Category:'+results.rows.item(i).Category);
                }
                
              });
            })*/

            var fieldArr = [];
            var actData = {
              ActivityId:ActivityId_fake,
              projectId:123,
              location: $scope.location,
              category: $scope.category,
              review: review,
              trade: trade,
              subcontractor: subcontractor,
              photos: photosArr.join(',') || "",
              photoLength:$scope.attachImgs.length,
              description: log,
              createdOn:time,
            }

            for(var i_fld in actData){
              fieldArr.push(i_fld);
            }

            // console.log('fieldArr:'+fieldArr);
            dbFactory.createTbl('fe_Activity',fieldArr);
            dbFactory.save('fe_Activity',actData);
            ActivityId_fake ++;
            localStorageService.set('ActivityId_fake',ActivityId_fake);

            $timeout(function() {
              $rootScope.$broadcast('saveAct');
            }, 100);
            
            doUpload();
            clearNewAct();
          } else {
            //TODO
            alert('Please select location and category, fill in log or attach images');
          }
      }, 100);     
      
    }

    
    // newAct页面清空
    var clearNewAct = function(){
        console.log('clearNewAct');
        var keyLang = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
        console.log('keyLang:'+keyLang);

        if(keyLang === "zh_hk"){
          //console.log('zh_hk');
          $scope.mockInputData = "請輸入項目日誌…";
          //$scope.category = "選擇類別";
          $scope.review = "選擇用戶";
          $scope.trade = "選擇交易";
          $scope.subcontractor = "選擇分判商";
          //$scope.location = "選擇地址";

        } else {
          //console.log('us_en');
          $scope.mockInputData = "Input Diary Entry Here…";
          console.log($scope.mockInputData);
          //$scope.category = "Select Category";
          $scope.review = "Select User";
          $scope.trade = "Select Trade";
          $scope.subcontractor = "Select Subcontractor";
          
          //$scope.location = "Select Location";
        }
        //$scope.isGray_location = true;
        //$scope.isGray_category = true;
        $scope.isGray_review = true;
        $scope.isGray_trade = true;
        $scope.isGray_subcontractor = true;
        $scope.isGray_mockinput = true;
        $scope.attachImgs = [];
    }

    // 根据网络情况调用上传
    doUpload();
    
    function doUpload(){

        // 在chrome上测试
        // uploadFactory.coreUpload();
        document.addEventListener("deviceready",onDeviceReady, false);
        //devicereadyFunc();
        function onDeviceReady(){
            var type = $cordovaNetwork.getNetwork();
            console.log('getNetwork:'+ type);
            console.log('getNetwork');
            //var isOnline = $cordovaNetwork.isOnline();
            //var isOffline = $cordovaNetwork.isOffline(); 
            
            //设备联网事件
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
              
              console.log('device is online');
              var allow3G = localStorageService.get('allow3G') || false;

              if(networkState === "wifi"){
                uploadFactory.coreUpload();
              } else if(networkState === "CELL_3G" && allow3G === true){
                uploadFactory.coreUpload();
              } else if(networkState === "CELL_3G" && allow3G === false){
                // TODO当用户点击start upload的时候再上传
              }
            });  
            
              
            
        }
    }

    //上传
    /*function coreUpload(){
      
      // N条内容数组
      var uploadActReqs = [];
      
      // may error
      dbFactory.findAll('fe_Activity', function(results){
        
        console.log(results[0]);
        var len = results.length;
        if(len>0){
            console.log('results.length>0');
            for(var i=0; i<len; i++ )
            {   
                // 单条内容中不包括photo的部分
                var uploadActReq = {
                      ActivityId: results[i].ActivityId, // activityId怎么获取的？
                      projectId: results[i].projectId,
                      location: results[i].location,
                      category: results[i].category,
                      review: results[i].review,
                      trade: results[i].trade,
                      subcontractor: results[i].subcontractor,
                      description: results[i].description,
                      createdOn: results[i].createdOn,
                }

                // 单条内容中的photos数组
                
                // 单条内容由数据和photos组成
                uploadActReqs.push({
                    uploadActReq: uploadActReq,
                    actPhotos: results[i].photos.split(',')
                });
            }                
        };
      
        console.log('uploadActReqs:'+ uploadActReqs);
            
        //  if(type === 'wifi')
        //  if(true)
        //  {
        //  console.log('wifi');

        // 上传每一条数据，递归
        var n = 0;
        uploadActRecur(n);
        function uploadActRecur(n){
          // console.log('n:'+n);
      
          if(n<uploadActReqs.length){
            // may error done dealing
            newActFactory.uploadAct(uploadActReqs[n].uploadActReq)
              .then(function(result){
                if(result.success){

                  console.log('the  NO. '+n+' uploadAct success!');
                  //console.log('ActivityId:'+ result.ActivityId);

                  // may error done dealing
                  // 把ActivityId存入本地数据库
                  function updateActivityId(){
                      dbFactory.update('fe_Activity',
                        {ActivityId:result.ActivityId},
                        // {createdOn:uploadActReqs[n].uploadActReq.createdOn});
                        {ActivityId:uploadActReqs[n].uploadActReq.ActivityId},updateActivityIdSuccess,
                        function(){
                          console.log('updateActivityId fail, do retry');
                          updateActivityId();
                        });
                  }

                  function updateActivityIdSuccess(){
                      var lenPhoto = uploadActReqs[n].actPhotos.length;
                      var uploadActPhotosReq = [];
                      if(lenPhoto>0){
                          for(var j = 0; j<lenPhoto; j++ ){
                          uploadActPhotosReq.push({
                            ActivityId:result.ActivityId,
                            photo:uploadActReqs[n].actPhotos[j],
                          });
                        }
                      }

                      // 上传每一条数据中的照片部分，递归
                      var k = 0;
                      uploadPhotoRecur(k);
                      function uploadPhotoRecur(k){
                          if(k < uploadActPhotosReq.length){

                              // may error done dealing
                              uploadPhotoAct(uploadActPhotosReq[k]);
                              function uploadPhotoAct(uploadActPhotosReq){
                                  newActFactory.uploadPhotoAct(uploadActPhotosReq)
                                    .then(function(result){
                                        if(result.success){
                                          console.log('th NO. '+k+' photo upload success!');
                                          uploadPhotoRecur(k+1);
                                        } else {
                                          console.log('th NO. '+k+' photo upload fail, retry!');
                                          uploadPhotoAct(uploadActPhotosReq);
                                        }
                                    });
                              }
                          } else {
                              // 这条数据全部上传完毕
                              console.log('the NO.' +n +'data_s all photos upload!');
                              
                              // 更新Task List，从本地列表中减去这条数据
                              // may error
                              dbFactory.delete('fe_Activity',{ActivityId:result.ActivityId});
                              $timeout(function(){
                                $rootScope.$broadcast('saveAct');
                              },100);
                              
                              // 隔3s上传下一条数据
                              $timeout(function() {
                                uploadActRecur(n+1);
                              }, 3000);
                          }
                      }
                  }
                } else {
                  console.log('the NO.' +n +'data_s upload fail, retry!');
                  uploadActRecur(n);
                }
              })
           } else return;
        }
      });
 
    }*/
          
          // listen for Online event
          /*$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            var onlineState = networkState;
          })

          // listen for Offline event
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            var offlineState = networkState;
          })*/

       

    


    
		}]);

})();




