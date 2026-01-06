/**
* @class InteractiveTile_Controller
* @description The Controller parent class for all interactive elements 
*/
var InteractiveTile_Controller = Tile_Controller.extend({ // USES Tile_View
construct: function() { 
	this.SC.construct();
	this._interactState = false;
	this._thoughtType;
	this._objectType;
	this._className = "InteractiveTile";
},


/**
* @description Removes all reference to the Controller instance in the quadTree in the main gameEngine
*/   
removeQuads: function(){
	for(var i = 0; i<this._registeredQuads.length; i++){
	  g_eventHandler.dispatchAnEvent("removeRect",{quads:this._registeredQuads[i]})
	} 	
	this._registeredQuads = new Array();
},

/**
* @description Repopulates the quadtree with the reference to the Controller instance where possible
*/    
createQuads: function(){

  var id = this.getViewID().replace("sprite_tile","");

  g_eventHandler.dispatchAnEvent("registerRect",{controller:this, id:id})
},


/**
* @description Conduit for the mobile "tap", dispatches an Event with a reference to the interactWithStationaryItem function in the main gameEngine
*/ 
onPressForInteraction:function(){
  g_eventHandler.dispatchAnEvent("interactWithStationaryItem",{controller:this})
},

/**
* @description Set the this.thoughtType property  // reference to removeRect funcion
* @param {String} thoughtType // the name of the thought type
*/  
setThoughtType: function(thoughtType) {
  	this._thoughtType = thoughtType;
},

/**
* @description Set the this.thoughtType property  // reference to removeRect funcion
* @param {String} thoughtType // the name of the thought type
*/  
setObjectType: function(objectType) {
  	this._objectType = objectType;
},

/**
* @description Get the this.thoughtType property 
* @return {String} thoughtType
*/ 
getThoughtType: function() {
  	return this._thoughtType;
},

/**
* @description Get the this.thoughtType property 
* @return {String} thoughtType
*/ 
getObjectType: function() {
  	return this._objectType;
},

/**
* @description Public function that calls the private function this.interact 
*/  
actedUpon: function() {
  this.interact();
},


/**
* @description At it's most basic it turns this._interactState true and false
*/   
interact: function(){
  this._interactState = ! this._interactState;
}
  
});
