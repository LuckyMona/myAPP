'use strict';

(function () {
    angular.module('starter')
        .factory('uploadFactory', uploadFactoryFunc);

        function uploadFactoryFunc($rootScope, dbFactory, newActFactory, $cordovaNetwork, localStorageService, $timeout, chkTokenFactory){

            var _self = this;
            // 使用cordova file transfer插件上传图片
            function _uploadPhoto(imgURI){

                var win = function (r) {
                    console.log("Code = " + r.responseCode);
                    console.log("Response = " + r.response);
                    console.log("Sent = " + r.bytesSent);
                }

                var fail = function (error) {
                    alert("An error has occurred: Code = " + error.code);
                    console.log("upload error source " + error.source);
                    console.log("upload error target " + error.target);
                }

                var url = PARAMS.BASE_URL + 'UploadActivityPhoto';
                // var testUrl = 'http://192.168.12.200:8733/WcfServiceLibrary1/Test/rest/GetData';
                // var testUrl2 = 'http://192.168.12.200:8733/Test/rest/SaveImage';
                var access_token = localStorageService.get('token').access_token;
                //var access_tokenStr = JSON.stringify(token).replace("\"","\'");

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.httpMethod = 'POST';
                options.fileName = imgURI.substr(imgURI.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;
                options.headers = {
                   Connection: "close"
                };

                var params = {};
                params.all = "{'token':'"+access_token+"','ProjectID':'1','StaffID':'1','DateCreated':'2016-01-01 00:00:00'}";
                //var params = {'ProjectID':'1','StaffID':'1','DateCreated':'2016-01-01 00:00:00'};
                
                options.params = params;

                var ft = new FileTransfer();
                ft.upload(imgURI, encodeURI(url), win, fail, options);

            }

            function _coreUpload(isListenStop){
                //onDeviceReady();
                document.addEventListener("deviceready",onDeviceReady, false);
                function onDeviceReady(){

                  //监听allow3G的改变,如果 not allow3G且手机连接的为3G网，就停止上传
                  if(isListenStop){
                    $rootScope.$on('allow3G_Change', function(d, data){
                        var type = $cordovaNetwork.getNetwork();
                        if(data === false && type==="CELL_3G"){
                            stopUpload();
                        }
                    });
                  }
                }
                
                function stopUpload(){
                    return;
                }
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
                        var uploadActReq = results[i].idData;
                        
                        // 单条内容中的photos数组
                        
                        // 单条内容由数据和photos组成
                        uploadActReqs.push({
                            //ProjectID:results[i].projectId,
                            //StaffID:results[i].StaffID,
                            //DateCreated:results[i].DateCreated,
                            uploadActReq: uploadActReq,
                            actPhotos: results[i].photos.split(','),
                            ActivityID:results[i].ActivityId,
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
                    // may error, dealing done 
                    var token = localStorageService.get('token');
                    chkTokenFactory.refreshToken(token)
                      .then(function(result){
                        if(result.statusText ==="OK"){
                          token = result.data;
                          localStorageService.set('token',result.data);
                        }else if(result==='false'){
                           return;
                        }
                      });
                    
                    var uploadActReqStr = uploadActReqs[n].uploadActReq;
                    var uploadActReqObj = JSON.parse(uploadActReqStr);
                    uploadActReqObj.token = token;
                    uploadActReqs[n].uploadActReq = JSON.stringify(uploadActReqObj).replace(/\"/g, "\'");

                    console.log(uploadActReqs[n].uploadActReq);

                    newActFactory.uploadAct(uploadActReqs[n].uploadActReq)
                      .then(function(result){
                        console.log(result);
                        if(result.success){
                          console.log('the  NO. '+n+' uploadAct success!');
                          //console.log('ActivityId:'+ result.ActivityId);

                          // 把ActivityId存入本地数据库，调用在定义后面
                            var updateActivityIdSuccess = function(){
                              var lenPhoto = uploadActReqs[n].actPhotos.length;
                              var uploadActPhotosReq = [];
                              if(lenPhoto>0){
                                  for(var j = 0; j<lenPhoto; j++ ){
                                  uploadActPhotosReq.push({
                                    ActivityId:uploadActReqs[n].ActivityID,
                                    photo:uploadActReqs[n].actPhotos[j],
                                  });
                                }
                              }

                              // 上传每一条数据中的照片部分，递归
                              var uploadPhotoRecur = function(k){
                                  if(k < uploadActPhotosReq.length){
                                      console.log(uploadActPhotosReq[k]);
                                      var uploadPhotoAct = function(uploadActPhotosReq){
                                            _self.uploadPhoto(uploadActPhotosReq[k])
                                            .then(function(result){
                                                if(result.success){
                                                  console.log('th NO. '+k+' photo upload success!');
                                                  //从本地删除已经上传的photo，防止如果没有完成整条数据上传，下次重试的时候，重复上传
                                                  //dbFactory.update('fe_Activity',{ActivityId:uploadActReqs[n].ActivityID}, k);
                                                  uploadPhotoRecur(k+1);
                                                } else {
                                                  console.log('th NO. '+k+' photo upload fail, retry!');
                                                  uploadPhotoAct(uploadActPhotosReq);
                                                }
                                            });
                                      }
                                      // may error done dealing
                                      uploadPhotoAct(uploadActPhotosReq[k]);
                                  } else {
                                      // 这条数据全部上传完毕
                                      console.log('the NO.' +n +'data_s all photos upload!');
                                      
                                      // 更新Task List，从本地列表中减去这条数据
                                      // may error
                                      dbFactory.delete('fe_Activity',{ActivityId:result.ActivityID});
                                      $timeout(function(){
                                        $rootScope.$broadcast('saveAct');
                                      },100);
                                      var badgeUpload = localStorageService.get('badgeUpload');
                                      if(badgeUpload === 0){
                                        return;
                                      }
                                      badgeUpload = badgeUpload-1;
                                      localStorageService.set('badgeUpload', badgeUpload);
                                      $rootScope.$broadcast('updateBadgeUpload',badgeUpload);
                                      // 隔3s上传下一条数据
                                      $timeout(function() {
                                        uploadActRecur(n+1);
                                      }, 3000);
                                  }
                              }
                              var k = 0;
                              uploadPhotoRecur(k);
                          }

                          // may error done dealing
                          
                          var updateActivityId = function(){

                              dbFactory.update('fe_Activity', 
                                { ActivityId:result.ActivityID},
                                // {createdOn:uploadActReqs[n].uploadActReq.createdOn});
                                {ActivityId:uploadActReqs[n].ActivityID},
                                updateActivityIdSuccess,
                                function(){
                                  console.log('updateActivityId fail, do retry');
                                  //updateActivityId();
                                });
                          }
                          updateActivityId();
                        } else {
                          console.log('the NO.' +n +'data_s upload fail, retry!');
                          // uploadActRecur(n);
                        }
                      })
                   } else return;
                }
                });

            }

            return {
                coreUpload:_coreUpload,
                uploadPhoto:_uploadPhoto,
            }
        }
})();