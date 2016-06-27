/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'my-app',
      templateUrl: 'app/templates/home.tpl.html'
    })
    .Class({
      constructor: function() {
      }
    });
})(window.app || (window.app = {}));