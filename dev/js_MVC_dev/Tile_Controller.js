/**
* @class Tile_Controller
* @description The general Controller class for all objects on the Stage
*/
var Tile_Controller = Controller.extend({
construct: function() { 
  	this.SC.construct();
	this._registeredQuads;
	this._state;
	this._defaultState;
	this._rect; // Object that contains 4 properties(top,right,bottom,left) that contain the bounding box of the Tile
	this._classContainer;// reference to the containing selectors Class, used for callback functions 
	this._className = "Tile";
	this._mainController;
},


/**
* @description Initializes the instance
* @return 
*/
init: function(){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};	
	
	this.addListners();
},


/**
* @description Creates a reference to the Main_Controller instance 
* @param {Main_Controller} ref // reference to the instance of the class
* @return null 
*/
setMainController:function(ref){
	this._mainController = ref;
},


/**
* @description Set the location for the View 
* @param {Interger} x // x position of the View
* @param {Interger} y // y position of the View
* @return null 
*/
setViewLoc: function(x,y){
  return this._view.setLoc(x,y);
},

/**
* @description Set the styling of the View 
* @param {Object} data // styling data
* @return null 
*/
setViewCSS: function(data){
  return this._view.setCSS(data);
},


/**
* @description Set the visibility of the View 
* @param {Boolean} bool // styling data
* @return null 
*/
setViewVisibility: function(bool){
   this._view.setVisibility(bool);
},

/**
* @description Set the rect Object(top,right,bottom,left)for the _rect property
* @param {Interger} x // the x position 
* @param {Interger} y // the y position 
*/ 
setRect: function(x,y) {
  	this._rect.top = y;
  	this._rect.right = x + this._view.getWidth();
  	this._rect.bottom = y + this._view.getHeight();
  	this._rect.left = x;
},

setViewRotaion:function(degrees){
	this._view.rotateDiv(degrees);
},

/**
* DEPRICATE
*/ 
setState: function(state) {
 	this._state = state;
},

/**
* DEPRICATE
*/ 
checkViewCSSClass: function(c){//String
  return this._view.checkForClass(c);
},

/**
* @description Returns the the View
* @return {Object} // View Object
*/
getView: function(){
  return this._view;
},

/**
* @description Returns the (x,y) position of the View on the stage
* @return {Object} // jQuery.position
*/
getViewLoc: function(){
  return this._view.getLoc();
},

/**
* @description Return the name of the View instance in the DOM
* @return {String} //Name of the View
*/
getViewID: function(){
  return this._view.getID();
},

/**
* @description Query's the View jQuery object from a class
* @param {String} c // the class name 
* @return {Boolean}
*/ 
getViewDivClass: function(s){
  return this._view.checkForClass(s);
},

/**
* @description Return a reference to the jQuery Object in the View
* @return {jQuery}
*/
getViewDIV: function(){
  return this._view.getDiv();
},

/**
* @description Return the name of the Controller Class Child
* @return {String}
*/
getClass: function(){
  return this._className;
},

/**
* @description Return the width of the View
* @return {Interger}
*/
getViewWidth: function(){
  return this._view.getWidth();
},

/**
* @description Return the height of the View
* @return {Interger}
*/
getViewHeight: function(){
  return this._view.getHeight();
},

/**
* @description Return the x position of the View
* @return {Interger}
*/
getViewX: function(){
  return this._view.getX();
},

/**
* @description Return the y position of the View
* @return {Interger}
*/
getViewY: function(){
  return this._view.getY();
},

/**
* @description Return the visibility of the View
* @return {Boolean}
*/
getViewVisibility: function(){
   return this._view.getVisibility();
},

/**
* @description Return the _rect property
* @return {Object} //  rect Object(top,right,bottom,left); 
*/  
getRect: function() {
 	return this._rect;
},

/**
* DEPRICATE
*/  
getState: function() {
 	return this._state;
},


/** 
* @description Create the _registeredQuads Array, used for moving an instance on the stage by pushing or carrying
*/   
createQuadRegistry: function(){
  this._registeredQuads = new Array();
},

hide: function(){
	this._view.hide();
},

show: function(){
	this._view.show();
},


/**
* @description Add a quadrant(x,y) + id to the this.registeredQuads Array
* @param {Array} // [x,y,id]
*/   
registerAQuad: function(quad){
  this._registeredQuads.push(quad)
},

/**
* @description Check to see if the Tile Instance has a listener
* @return {Boolean} does it have a listening tile
*/    
hasListener: function (){
		return false;   
},

/**
* @description Check to see if the Tile Instance has a listener
* @return {Boolean} does it have a listening tile
*/    
hasMultipleListeners: function (){
		return false;   
}

});