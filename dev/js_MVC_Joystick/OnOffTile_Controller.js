var OnOffTile_Controller = InteractiveTile_Controller.extend({
construct: function() { 
	this.SC.construct();
	this._frames = [0,1];
	this._className = "OnOff";
},


/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("interact", this);
	g_eventHandler.addAListener("resetState", this);
},


/**
* @description turns on one of two frames based on this.interactState
* @return {}
*/    
interact: function(){
  this._interactState = ! this._interactState;
  this._frames.unshift(this._frames.pop());
  this._view.getImageController().showFrameNum(this._frames[0]);
  this._view.getImageController().hideFrameNum(this._frames[1]);
},

resetState:function(){
	this._interactState = false;
	this._frames = [0,1];
	this._view.getImageController().showFrameNum(this._frames[0]);
  	this._view.getImageController().hideFrameNum(this._frames[1]);
}
  
});