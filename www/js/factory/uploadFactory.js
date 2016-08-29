'use strict';

(function () {
    angular.module('starter')
        .factory('uploadFactory', uploadFactoryFunc);

        function uploadFactoryFunc(PARAMS, $rootScope, dbFactory, newActFactory, $cordovaNetwork, localStorageService, $timeout, chkTokenFactory, $http, helpToolsFactory, $cordovaFile, $q){

            function _coreUpload(){

                if(_isUploading()) {
                  console.log("Uploading, dont click me!");
                  return;   // 已经在上传
                }
                $rootScope.gotoStopUpload = false;
                $rootScope.isStopping = false;

                _uploadActivity1st();

                // 取出第一条Activity进行Upload
                function _uploadActivity1st(){
                  console.log("_uploadActivity1st!");

                  if(_checkToStopUpload()) {
                    console.log("_uploadActivity1st, stop!");
                    return;  // 需要停止上传
                  }

                  dbFactory.findAll_OrderByCnt('fe_Activity', function(results){
                    if(results.length === 0){
                      $rootScope.isUploading = false;
                      $rootScope.$broadcast('uploadStatusChange');      // 全部Activity都上传完了

                      // 清理残留的图片（孤儿仔，即上传后没有被成功删除的）
                      _deleteOrphanPhoto();    // TODO，放在这个地方是否合适？？？？？

                      return;                               // 没有待上传的Activity
                    }
                    
                    $rootScope.$broadcast('uploadStatusChange');

                    var uploadActReqs = {};
                    uploadActReqs.projectID = results[0].projectId;
                    uploadActReqs.staffID = results[0].StaffID;
                    uploadActReqs.dateCreated = '2016-01-01 00:00:00';   // Dummy data
                    uploadActReqs.uploadActReq = results[0].idData;
                    uploadActReqs.actPhotos = results[0].photos.length>0?results[0].photos.split(','):[];
                    uploadActReqs.actPhotoIds = results[0].photoIds;
                    uploadActReqs.activityId = results[0].ActivityId;

                    var photoIds = results[0].photoIds;
                    if (photoIds === "") {
                      _uploadPhoto(uploadActReqs, 0);
                    } else {
                      var next = photoIds.split(',');
                      _uploadPhoto(uploadActReqs, next.length);  // 跳过已经上传了的图片
                    }

                    // Update db, upload counter + 1
                    var cnt = (results[0].uploadCnt || 0) + 1;
                    dbFactory.update('fe_Activity', 
                      {uploadCnt: cnt},
                      {ActivityId: uploadActReqs.activityId},
                      function(){
                        console.log('update record success, ActivityId=' + uploadActReqs.activityId + ', uploadCnt=' + cnt);
                      },
                      function(){
                        // TODO need to handle this error????????????????????
                        console.log('update record fail, ActivityId=' + uploadActReqs.activityId + ', uploadCnt=' + cnt);
                      });

                  }, function(){
                      $rootScope.isUploading = false;
                      $rootScope.$broadcast('uploadStatusChange');      // hit error
                  });
                }


                // 使用cordova file transfer插件上传图片
                function _uploadPhoto(reqObj, n){

                  if(_checkToStopUpload()) {
                    return;
                  }

                  var actPhotos = reqObj.actPhotos;
                  if(actPhotos.length <= n){
                    _uploadActity(reqObj);  // no photo or all photo aready uploaded, go to upload activity

                    return;
                  }

                  /*
                  var uploadMethod;
                  if (cordova.platformId === "android") {
                    uploadMethod = 'UploadActivityPhoto_Android';
                  } else if (cordova.platformId === "ios") {
                    uploadMethod = 'UploadActivityPhoto_iOS';
                  } else {
                    uploadMethod = 'UploadActivityPhoto_Android';    // Just handle Android and IOS, how about Windows?
                  }
                  */
                  var uploadMethod = 'UploadActivityPhoto';

                  var url = PARAMS.BASE_URL + uploadMethod;
                  var access_token = localStorageService.get('token').access_token;

                  var filePath = actPhotos[n].substr(0, actPhotos[n].lastIndexOf('/'));
                  var fileName1 = actPhotos[n].substr(actPhotos[n].lastIndexOf('/') + 1);         // 原图
                  var fileName2 = fileName1.substr(0, fileName1.lastIndexOf('.'))
                                      //+ "_zip" + fileName1.substr(fileName1.lastIndexOf('.'));  // 压缩图
                                      + "_zip.jpg";  // 压缩图

                  var uploadFileName;
                  _zipImage(filePath, fileName1, fileName2).then(function(){
                      uploadFileName = fileName2; // 压缩成功
                      __upload();
                    },function(){
                      uploadFileName = fileName1; // 压缩失败，或者不需要压缩，使用原图
                      __upload();
                    });

                  // 执行上传
                  function __upload() {
                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.httpMethod = 'POST';
                    options.fileName = uploadFileName;
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = false;
                    options.headers = {
                       Connection: "close"
                    };

                    var projectID = reqObj.projectID;
                    var staffID = reqObj.staffID;
                    var dateCreated = reqObj.dateCreated;
                    var activityID = reqObj.activityId;

                    var params = {};
                    params.all = "{'token':'"+access_token+"','ProjectID':'"+projectID+"','ActivityID':'"+activityID+"','StaffID':'"+staffID+"','DateCreated':'"+dateCreated+"'}";
                    //var params = {'ProjectID':'1','StaffID':'1','DateCreated':'2016-01-01 00:00:00'};
                    
                    options.params = params;

                    var ft = new FileTransfer();
                    ft.upload(filePath + '/' + uploadFileName, encodeURI(url),
                        function(result){
                          var resObj = JSON.parse(result.response.replace(/(^\"*)|(\"*$)/g,''));
                          console.log(resObj);
                          if(resObj.success === "true"){
                            _uploadPhotoWin(reqObj, n, resObj.GUID);

                          }else if(resObj.success==="false" && resObj.error ==="Token Invalid"){
                            // token invalid情况
                              $rootScope.isUploading = false;
                              $rootScope.$broadcast('uploadStatusChange');  
                              helpToolsFactory.tokenInvalidHandler();
                          } else {
                            _uploadPhotoFail(reqObj, n);
                          }
                        },
                        function(){
                          _uploadPhotoFail(reqObj, n);
                        }, options);
                  }
                }

                // 按比例压缩图片
                function _zipImage(filePath, oriFileName, zipFileName) {
                  var deferred = $q.defer();

                  var width;
                  var height;

                  var photoResolution = localStorageService.get('photoReso');
                  if (photoResolution != null && photoResolution != "Original Size") {
                    width = photoResolution.substr(0, photoResolution.indexOf('*'));
                    width = isNaN(width) ? 1600 : width;  // default 1600

                    height = photoResolution.substr(photoResolution.indexOf('*') + 1);
                    height = isNaN(height) ? 1200 : height;  // default 1200
                  

                    window.plugins.imageResizer.resizeImage(
                       function(data) {
                         console.log("_zipImage success, file = " + data.filename);
                         
                         deferred.resolve();
                       }, function (error) {
                         console.log("_zipImage error, error = " + error + ", file = " + data.filename);

                         deferred.reject();
                       }, filePath + "/" + oriFileName, width, height, {
                          format: ImageResizer.FORMAT_JPG,
                          imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
                          resizeType: ImageResizer.RESIZE_TYPE_PIXEL,
                          quality: 100,
                          storeImage: true,
                          pixelDensity: false,
                          directory: filePath,
                          filename: zipFileName,
                          photoAlbum: 0
                       }
                    );
                  } else {
                    $timeout(function(){
                      deferred.reject();
                    },100);
                  }

                  return deferred.promise;
                }

                function _uploadPhotoWin(reqObj, n, photoId) {
                  var actPhotos = reqObj.actPhotos;
                  var photoIds = reqObj.actPhotoIds;
                  if (photoIds === "") {
                    photoIds = photoId;
                  } else {
                    photoIds = photoIds + ',' + photoId;
                  }
                  reqObj.actPhotoIds = photoIds;

                  // Update db
                  dbFactory.update('fe_Activity', 
                    {photoIds: photoIds},
                    {ActivityId: reqObj.activityId},
                    function(){
                      console.log('update record success, ActivityId=' + reqObj.activityId + ', photoIds=' + photoIds);


                      if(actPhotos.length <= n){
                        _uploadActity(reqObj);      // go to upload activity
                      } else {
                        _uploadPhoto(reqObj, n+1);  // go to next
                      }
                    },
                    function(){
                      // TODO need to handle this error????????????????????
                      console.log('update record fail, ActivityId=' + reqObj.activityId + ', photoIds=' + photoIds);

                      $rootScope.isUploading = false;
                      $rootScope.$broadcast('uploadStatusChange');      // hit error
                    });
                }

                function _uploadPhotoFail(reqObj, n) {
                  console.log('Upload photo fail, ActivityId=' + reqObj.activityId + ', Photo index=' + n);

                  $timeout(function() {
                    console.log('Upload photo fail, ActivityId=' + reqObj.activityId + ', Photo index=' + n + ', retry');
                    //_uploadPhoto(reqObj, n);     // retry
                    _uploadActivity1st();    // try another activity
                  }, 10000);
                }

                function _uploadActity(reqObj) {

                  if(_checkToStopUpload()) {
                    return;
                  }

                  var url = PARAMS.BASE_URL + 'UploadActivity';

                  var token = localStorageService.get('token');
                  chkTokenFactory.refreshToken(token)
                    .then(function(result){
                      if(result.statusText ==="OK"){
                        token = result.data;
                        localStorageService.set('token',result.data);
                      }/*else if(result==='false'){
                         // token not expire
                      }*/

                      var uploadActReqStr = reqObj.uploadActReq;
                      var uploadActReqObj = JSON.parse(uploadActReqStr);
                      uploadActReqObj.token = token;
                      uploadActReqObj.Image = reqObj.actPhotoIds;
                      //uploadActReqs[n].uploadActReq = JSON.stringify(uploadActReqObj).replace(/\"/g, "\'");
                      uploadActReqObj.Description = uploadActReqObj.Description.replace("\"", "!~!~`^!~!~"); // 暂时将双引号改为特殊字符
                      var uploadActReqObjStr = JSON.stringify(uploadActReqObj).replace(/\"/g, "\\\"");       // 双引号转义，否则C#会出错
                      uploadActReqObjStr = uploadActReqObjStr.replace("!~!~`^!~!~", "\\\\\\\"");  // 将特殊字符转回双引号

                      var quoteReq = "\"" + uploadActReqObjStr + "\"";
                      $http.post(url, quoteReq)
                        .then(function successCb(result){
                          console.log(result);

                          if(result.data && result.data.success === "true"){
                            _uploadActityWin(reqObj);
                          }else if(result.data && result.data.success==="false" && result.data.error ==="Token Invalid"){
                          // token invalid情况
                              $rootScope.isUploading = false;
                              $rootScope.$broadcast('uploadStatusChange'); 
                              helpToolsFactory.tokenInvalidHandler();
                          } else {
                            _uploadActityFail(reqObj);
                          }

                      }, function errorCb(result){
                          console.log(result);
                          
                          _uploadActityFail(reqObj);
                      });
                    });
                }

                function _uploadActityWin(reqObj) {
                  console.log('_uploadActityWin, ActivityId=' + reqObj.activityId);

                  // Delete activity after upload
                  dbFactory.delete('fe_Activity', {ActivityId: reqObj.activityId}, function(){
                    console.log('_uploadActityWin, delete record success, ActivityId=' + reqObj.activityId);

                    $timeout(function(){
                      $rootScope.$broadcast('saveAct');      // 待上传数字减一
                    },100);

                    var badgeUpload = localStorageService.get('badgeUpload');
                    if(badgeUpload > 0){
                      badgeUpload = badgeUpload - 1;         // 待上传数字减一
                      localStorageService.set('badgeUpload', badgeUpload);
                      $rootScope.$broadcast('updateBadgeUpload',badgeUpload);
                    }

                    // 删除缓存的图片
                    // 通过拍照或者相册选择的照片，都是缓存的图片，上传成功后需要删除（删缓存的，不会删除相册中的图片）
                    var actPhotos = reqObj.actPhotos;
                    for (var i = actPhotos.length - 1; i >= 0; i--) {
                      var filePath = actPhotos[i].substr(0, actPhotos[i].lastIndexOf('/'));
                      var fileName1 = actPhotos[i].substr(actPhotos[i].lastIndexOf('/') + 1);         // 原图
                      var fileName2 = fileName1.substr(0, fileName1.lastIndexOf('.'))
                                      //+ "_zip" + fileName1.substr(fileName1.lastIndexOf('.'));  // 压缩图
                                      + "_zip.jpg";  // 压缩图
                      var fileName3 = fileName1.substr(0, fileName1.lastIndexOf('.'))
                                      //+ "_small" + fileName1.substr(fileName1.lastIndexOf('.'));  // 小图
                                      + "_small.jpg";  // 小图

                      _deleteFile(filePath, fileName1, (actPhotos.length - 1 - i) * 30 + 50);
                      _deleteFile(filePath, fileName2, (actPhotos.length - 1 - i) * 30 + 100);
                      _deleteFile(filePath, fileName3, (actPhotos.length - 1 - i) * 30 + 150);
                    }

                    // 隔3s上传下一条数据
                    $timeout(function() {
                      _uploadActivity1st();   // go to next
                    }, 3000);

                  }, function(){
                      $rootScope.isUploading = false;
                      $rootScope.$broadcast('uploadStatusChange');      // hit error
                  });
                }

                function _uploadActityFail(reqObj) {
                    console.log('_uploadActityFail, ActivityId=' + reqObj.activityId);

                    $timeout(function() {
                      console.log('_uploadActityFail, ActivityId=' + reqObj.activityId + ', retry');
                      //_uploadActity(reqObj)  // retry
                      _uploadActivity1st();    // try another activity
                    }, 10000);
                }

                // 删除文件
                function _deleteFile(filePath, fileName, delay) {
                  $cordovaFile.removeFile(filePath, fileName)
                    .then(function (success) {
                      console.log('_deleteFile success, file=' + filePath + '/' + fileName);
                    }, function (error) {
                      console.log('_deleteFile fail, error = ' + error.message + ', file=' + filePath + '/' + fileName);

                      if (error.message != "NOT_FOUND_ERR" && error.message != "PATH_EXISTS_ERR") {
                        // 写入 localStorage，后面再尝试删除
                        // 延迟写入 localStorage 避免一个Activity有多张图片时的 concurrence 问题
                        $timeout(function(){
                            var orphanPhotos = localStorageService.get('orphanPhotos');
                            if (orphanPhotos === null) {
                              localStorageService.set('orphanPhotos', filePath + '/' + fileName);
                            } else {
                              localStorageService.set('orphanPhotos', orphanPhotos + ',' + filePath + '/' + fileName);
                            };
                          }, delay);
                       }
                    });
                }

                // 清理残留的图片（孤儿仔，即上传后没有被成功删除的）
                function _deleteOrphanPhoto() {
                  var orphanPhotos = localStorageService.get('orphanPhotos');

                  if (orphanPhotos != null) {
                    localStorageService.remove('orphanPhotos');  // remove first

                    var photos = orphanPhotos.split(',');
                    for (var i = photos.length - 1; i >= 0; i--) {

                      var filePath = photos[i].substr(0, photos[i].lastIndexOf('/'));
                      var fileName = photos[i].substr(photos[i].lastIndexOf('/') + 1);
                      
                      _deleteFile(filePath, fileName, (photos.length - 1 - i) * 100);
                    }
                  }

                }

                function _checkToStopUpload() {
                  //停止上传
                  if($rootScope.gotoStopUpload === true ){
                    $rootScope.isUploading = false;
                    $rootScope.isStopping = false;

                    $rootScope.$broadcast('uploadStatusChange');

                    return true;
                  }

                  $rootScope.isUploading = true;
                  return false;
                }
            }

            function _isUploading() {
              return $rootScope.isUploading;
            }

            function _isStopping() {
              return $rootScope.isStopping;
            }

            function _stopUpload() {
              if (_isUploading()) {
                $rootScope.gotoStopUpload = true;
                $rootScope.isStopping = true;
              }
            }

            return {
                coreUpload: _coreUpload,
                isUploading: _isUploading,
                isStopping: _isStopping,
                stopUpload: _stopUpload,
            }
        }
})();