var TileController = Controller.extend({
/**
* Constructor
* This class calls on at present one other Class, animationFrame.js
*	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
*/
construct: function() { 
  	this.SC.construct();
	this._registeredQuads;
	this._state;
	this._defaultState;
	this._classContainer;// reference to the containing selectors Class, used for callback functions 
},

getViewRect: function(){
  return this._view.getRect();
},

getViewLoc: function(){
  return this._view.getLoc();
}


/** POSSIBLE CONTROLLER ATTRIBUTE
* @description Return the width of the instance's this._div
* @return {Interger}
*/  
getState: function() {
 	return this._state;
},

/** POSSIBLE CONTROLLER ATTRIBUTE
* @description Return the width of the instance's this._div
* @return {Interger}
*/  
setState: function(state) {
 	this._state = state;
},


/** POSSIBLE CONTROLLER ATTRIBUTE
* @description Create the this.registeredQuads Array, used for moving an instance on the stage by pushing or carrying
*/   
createQuadRegistry: function(){
  this._registeredQuads = new Array();
},


/** POSSIBLE CONTROLLER ATTRIBUTE
* @description Add a quadrant to the this.registeredQuads Array
* @param {Object} quad
*/   
registerAQuad: function(quad){//quad is an x,y point from multiDimensional Array
  this._registeredQuads.push(quad)
}

});