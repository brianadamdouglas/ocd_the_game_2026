class HingedDoor_Controller extends InteractiveTile_Controller {
	constructor() { 
	super();
	this._listener1;
	this._listener2;
	this._listenerString1;
	this._listenerString2;
	this._defaultVisibility;
	//console.log("New Door");
	this._className = "HingedDoor";
	
}

	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
	g_eventHandler.addAListener("resetState", this);
}

	setDefaultVisibility(b){
	this._defaultVisibility = b;
}
	/**
* @description Set the reference to the listener instance
* @param {Class} listener // reference to another Tile Selector's Class instance
	*/    
	setListener1(listener) {
  	this._listener1 = listener;
  	//console.log(listener);
}

	/**
* @description Set the reference to the listener instance
* @param {Class} listener // reference to another Tile Selector's Class instance
	*/    
	setListener2(listener) {
  	this._listener2 = listener;
  	//console.log(listener);
}

	/**
* @description Check to see if the Tile Instance has a listener
* @return {Boolean} does it have a listening tile
	*/      
	hasMultipleListeners(){
		return true;   
}

	/**
* @description Set the reference to a String version of listener's Tile Name, in the game engine after building the stage 
	* we register pairs of Selectors that have a symbiotic relationship, it uses the string name to ultimately find it's pait which can be set
	* once all the tiles are on the stage
* @param {String} listenerString // the listener string reference
	*/   
	setListenerString1(listenerString) {
  	this._listenerString1 = listenerString;
  	//console.log(listenerString);
}

	/**
* @description Set the reference to a String version of listener's Tile Name, in the game engine after building the stage 
	* we register pairs of Selectors that have a symbiotic relationship, it uses the string name to ultimately find it's pait which can be set
	* once all the tiles are on the stage
* @param {String} listenerString // the listener string reference
	*/   
	setListenerString2(listenerString) {
  	this._listenerString2 = listenerString;
  	//console.log(listenerString);
  	//console.log("stringSet");
}

	/**
* @description Returns the previously set listenerString used in the registerPairs function in the game engine
* @return {String} the listener string reference
	*/   
	getListenerString1() {
  	return this._listenerString1;
}

	/**
* @description Returns the previously set listenerString used in the registerPairs function in the game engine
* @return {String} the listener string reference
	*/   
	getListenerString2() {
  	return this._listenerString2;
}

	/**
* @description Turns the instance this.Interact to true of false. It also shows and hides this._div
	*/  
	interact(){
  this._interactState = ! this._interactState;
  if(!this._interactState){
    this._view.getImageController().hideFrameNum(0);
  	//this.images[0].hide()
  	this.setViewVisibility(false);
  }else{
    this._view.getImageController().showFrameNum(0);
  	//this.images[0].show();
  	this.setViewVisibility(true);
  }
}


	/**
* @description Public function that calls the private function this.interact. It tells the listener to interact as well.(might change to acted upon); 
	*/ 
	actedUpon(){
  if(this._interactState){
  	  this.interact();
  	  this._listener1.interact();
      this._listener2.interact();
      //setCanMoveForward(true);
      
      //checkForHit();
      g_eventHandler.dispatchAnEvent("checkForHit",{});
      g_eventHandler.dispatchAnEvent("setCanMoveForward",{bool:true});
  }
 
}

	/**
* @description Sets the visibility to true or false
	*/  
	setVisibility(b){
  this._interactState = b;
  if(!this._interactState){
    this._view.getImageController().hideFrameNum(0);
  	//this.images[0].hide();
  	this.setViewVisibility(false);
  }else{
    this._view.getImageController().showFrameNum(0);
  	//this.images[0].show();
  	this.setViewVisibility(true);
  }
}

	resetState(){
	this.setVisibility(this._defaultVisibility);
}
  
}