'use strict';

(function () {
    angular.module('starter')
        .factory('uploadFactory', uploadFactoryFunc);

        function uploadFactoryFunc(dbFactory, newActFactory){

            function _coreUpload(){
      
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

            }

            return {
                coreUpload:_coreUpload,
            }
        }
})();