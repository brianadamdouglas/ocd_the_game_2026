/**
* @class Controller
* @description The basic Controller class
*/
const Controller = Class.extend({
/**
* Constructor
*/
construct() { 
	this._view;
},

/**
* @description Initializes the instance
* @return 
*/
init(){
	this.addListners();
},

/**
* @description Bind a View class instance to the Controller
* @param {Controller} controller // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return null
*/
bindView(view, data){
  this.init();
  this._view = view;
  this._view.init(this,data);
},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners(){
},

/**
* @description Handle an Event from the global EventHandler class
* @param {String} event // the controller associated with the view
* @param {Object} data // package of data
* @return null
*/
handleAnEvent(event, data){
  this[event](data);
}
 
});
