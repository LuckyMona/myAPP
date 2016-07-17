'use strict';

(function () {
    angular.module('starter')
        .factory('dbFactory', dbFactoryFunc);

        function dbFactoryFunc(){
            var db = openDatabase('siteDiaryDB', '1.0', 'siteDiaryDB', 2*1024*1024);
            

            var _createTbl = function(tblName, fieldArr){
                var fieldStr = fieldArr.join(',');
                db.transaction(function(tx){
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tblName + ' ('+ fieldStr +')' );
                });
            }

            var _dropTbl = function(tblName){
                console.log('drop');
                db.transaction(function(tx){
                    tx.executeSql('DROP TABLE '+tblName);
                });
            }

            var _save = function(tblName, dataObj){
                db.transaction(function(tx){
                    var saveStr = "(",
                        saveStrQ = "(",
                        saveArr = [];
                    for(var i in dataObj){
                        saveStr += (i +",");
                        saveStrQ += '?,';
                        saveArr.push(dataObj[i]);
                    }
                    saveStr = saveStr.substring(0, saveStr.length-1)+')';
                    saveStrQ = saveStrQ.substring(0, saveStrQ.length-1)+')';
                    var insertStr = 'INSERT INTO '+tblName+' '+saveStr+' VALUES '+saveStrQ;
                    // console.log('saveStr:'+saveStr);
                    // console.log('saveStrQ:'+saveStrQ);
                    // console.log('insertStr:'+insertStr);
                    // console.log('saveArr:'+saveArr);
                    // console.log('type saveArr:'+ Array.isArray(saveArr));
                    //dbFactory.save('test', { aa:'123aaa' });
                    tx.executeSql(insertStr, saveArr);
                    //tx.executeSql('INSERT INTO test (aa) VALUES (?)', ['123aaa']);
                });
            }

            var _findAll = function(tblName, successCb){
                var rowArr = [];
                db.transaction(function(tx){
                    tx.executeSql('SELECT * FROM '+tblName, [], function(tx, results){
                        var rowLen = results.rows.length,i;
                        for(i=0; i<rowLen; i++){
                            // console.log('results.rows.item(i)'+results.rows.item(i));
                            rowArr.push(results.rows.item(i));
                        }
                        // console.log('rowArr:'+rowArr);
                        if(successCb){
                            successCb(rowArr);
                        }
                    });
                 });
                
            }

            var _update = function(tblName, setObj, condiObj){
                var setStr = "",
                    condiStr = "";
                for(var iSet in setObj){
                    setStr += (iSet + " = "+ setObj[iSet] +",");
                }
                setStr = setStr.substring(0, setStr.length-1);
                for(var iCondi in condiObj){
                    condiStr += (iCondi +" = "+condiObj[iCondi]);
                }
                
                var updateStr = 'UPDATE '+tblName+' SET '+setStr+' WHERE '+ condiStr;
                // console.log('updateStr:'+updateStr);
                db.transaction(function(tx){
                    tx.executeSql(updateStr, [], function(){
                    // tx.executeSql('UPDATE fe_Activity SET ActivityId = 123 WHERE ActivityId = 2', [], function(){
                        console.log('update succe');
                    },function(){
                        console.log('update fail');
                    });
                });
            }

            var _delete = function(tblName, condiObj){
                var condiStr = "";
                for(var iCondi in condiObj){
                    condiStr += (iCondi +" = "+condiObj[iCondi]);
                }
                db.transaction(function(tx){
                    tx.executeSql('DELETE FROM fe_Activity WHERE ActivityID = 123',[],function(){
                        console.log('delete success');
                    },function(){
                        console.log('delete fail');
                    })
                    //tx.executeSql('DELETE FROM '+tblName+' WHERE '+condiStr);
                });
            }

            return {
                createTbl : _createTbl,
                save : _save,
                dropTbl:_dropTbl,
                findAll:_findAll,
                update:_update,
                delete:_delete,
            }
        }
})();

