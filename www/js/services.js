'use strict';
(function(){
  angular.module('starter.services', [])

  .factory('Languages', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var en = {
      'title':'HelloMary'
    }
    var ch = {
      'title':'你好Mary'
    }

    return {
      getCh: function() {
        return ch;
      },
      
      getEn: function() {
        return en;
      }
    };
  });
})();