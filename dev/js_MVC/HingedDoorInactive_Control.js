const HingedDoorInactive_Controller = HingedDoor_Controller.extend({
construct() { 
	this.SC.construct();
	//console.log("New Door");
	this._className = "HingedDoorInactive";
	
},



/**
* @description Public function that calls the private function this.interact. It tells the listener to interact as well.(might change to acted upon); 
*/ 
actedUpon(){
 
}
  
});