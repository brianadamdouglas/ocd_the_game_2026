/**
* @class Controller
* @description The basic Controller class
*/
var Controller = Class.extend({
/**
* Constructor
*/
construct: function() { 
	this._view;
},

/**
* @description Initializes the instance
* @return 
*/
init: function(){
	this.addListners();
},

/**
* @description Bind a View class instance to the Controller
* @param {Controller} controller // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return null
*/
bindView: function(view, data){
  this.init();
  this._view = view;
  this._view.init(this,data);
},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
},

/**
* @description Handle an Event from the global EventHandler class
* @param {String} event // the controller associated with the view
* @param {Object} data // package of data
* @return null
*/
handleAnEvent:function(event, data){
  this[event](data);
}
 
});
