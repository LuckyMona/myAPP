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

            var _findAll = function(tblName){
                var rowArr = [];
                db.transaction(function(tx){
                    tx.executeSql('SELECT * FROM '+tblName, [], function(tx, results){
                       
                        var rowLen = results.rows.length,i;
                        for(i=0; i<len; i++){
                            rowArr.push(results.rows.item(i));
                        }

                    });
                 });
                return rowArr;
            }

            return {
                createTbl : _createTbl,
                save : _save,
                dropTbl:_dropTbl,
                findAll:_findAll,
            }
        }
})();

