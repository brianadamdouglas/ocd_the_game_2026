/**
* @class InteractiveTile_Controller
* @description The Controller parent class for all interactive elements 
*/
class InteractiveTile_Controller extends Tile_Controller { // USES Tile_View
	constructor() { 
	super();
	this._interactState = false;
	this._thoughtType;
	this._objectType;
	this._className = "InteractiveTile";
}


	/**
* @description Removes all reference to the Controller instance in the quadTree in the main gameEngine
	*/   
	removeQuads(){
		for(let i = 0; i<this._registeredQuads.length; i++){
			g_eventHandler.dispatchAnEvent("removeRect",{quads:this._registeredQuads[i]});
		} 	
		this._registeredQuads = [];
	}

	/**
* @description Repopulates the quadtree with the reference to the Controller instance where possible
	*/    
	createQuads(){
		const id = this.getViewID().replace("sprite_tile","");
		g_eventHandler.dispatchAnEvent("registerRect",{controller:this, id:id});
	}


	/**
* @description Conduit for the mobile "tap", dispatches an Event with a reference to the interactWithStationaryItem function in the main gameEngine
	*/ 
	onPressForInteraction(){
		g_eventHandler.dispatchAnEvent("interactWithStationaryItem",{controller:this});
	}

	/**
* @description Set the this.thoughtType property  // reference to removeRect funcion
* @param {String} thoughtType // the name of the thought type
	*/  
	setThoughtType(thoughtType) {
  	this._thoughtType = thoughtType;
}

	/**
* @description Set the this.thoughtType property  // reference to removeRect funcion
* @param {String} thoughtType // the name of the thought type
	*/  
	setObjectType(objectType) {
  	this._objectType = objectType;
}

	/**
* @description Get the this.thoughtType property 
* @return {String} thoughtType
	*/ 
	getThoughtType() {
  	return this._thoughtType;
}

	/**
* @description Get the this.thoughtType property 
* @return {String} thoughtType
	*/ 
	getObjectType() {
  	return this._objectType;
}

	/**
* @description Public function that calls the private function this.interact 
	*/  
	actedUpon() {
  this.interact();
}


	/**
* @description At it's most basic it turns this._interactState true and false
	*/   
	interact(){
  this._interactState = ! this._interactState;
}
  
}