var Button_Controller = Tile_Controller.extend({ // USES Tile_View
construct: function() { 
		this.SC.construct();
		this.interactState = false;
		this._target;
		this._buttonEvent;
		this._downEvent;
		this._pressEvent;
		this._releaseEvent;
		this._className = "Button";
		
  },
  

  
bindView: function(view, data){
  this.init(data);
  this._view = view;
  this._view.init(this,data);
  this._view.getDiv().on("vmousedown",this.onDown.bind(this));
  this._view.getDiv().on("vmouseup",this.onRelease.bind(this));
  this._view.getDiv().on("taphold",this.onPress.bind(this));
},

/**
* @description Initializes the instance
* @return 
*/
init: function(data){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};	
	this._target = data.buttonTarget;
	this.setButtonEvent(data.buttonFunction);
},


/**
* @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
* @param {Function} func 
*/  
/* setContainer: function(controller){  
	this._container = controller; 
}, */


/**
* @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
* @param {Function} func 
*/  
setButtonEvent: function(str){  
	this._buttonEvent = str; 
},

/**
* @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
* @param {Function} func 
*/  
setDownEvent: function(str){  
	this._downEvent = str; 
},

/**
* @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
* @param {Function} func 
*/  
setPressEvent: function(str){  
	this._pressEvent = str; 
},

/**
* @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
* @param {Function} func 
*/  
setReleaseEvent: function(str){  
	this._releaseEvent = str; 
},



/**
* @description Public function that calls this.gameEngineTargetHitCallback
* @param {Class} droppedClassReference // a reference to the Stick Object instance that is placed on the DropTarget instance 
*/   
onDown: function(){
	g_eventHandler.dispatchAnEventOneTarget(this._buttonEvent,{target:this._target});  
},

/**
* @description Public function that calls this.gameEngineTargetHitCallback
* @param {Class} droppedClassReference // a reference to the Stick Object instance that is placed on the DropTarget instance 
*/   
onRelease: function(){
	//g_eventHandler.dispatchAnEventOneTarget(this._buttonEvent,{target:this._target});  
},

/**
* @description Public function that calls this.gameEngineTargetHitCallback
* @param {Class} droppedClassReference // a reference to the Stick Object instance that is placed on the DropTarget instance 
*/   
onPress: function(){
	//g_eventHandler.dispatchAnEventOneTarget(this._buttonEvent,{target:this._target});  
}
  
});
