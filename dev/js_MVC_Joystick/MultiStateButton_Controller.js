var MultiStateButton_Controller = Button_Controller.extend({ // USES Tile_View
construct: function() { 
		this.SC.construct();
		this._className = "Button";
		this._downEvent = "";
		this._pressEvent = "";
		this._releaseEvent = "";
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
	if(data.downFunction!=undefined){
		this.setDownEvent(data.downFunction);
	}
	if(data.pressFunction!=undefined){
		this.setPressEvent(data.pressFunction);
	}
	if(data.releaseFunction!=undefined){
		this.setReleaseEvent(data.releaseFunction);
	}

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
	if(this._downEvent!=""){
		g_eventHandler.dispatchAnEventOneTarget(this._downEvent,{target:this._target}); 
	}
	 
},

/**
* @description Public function that calls this.gameEngineTargetHitCallback
* @param {Class} droppedClassReference // a reference to the Stick Object instance that is placed on the DropTarget instance 
*/   
onRelease: function(){
	if(this._releaseEvent!=""){
		g_eventHandler.dispatchAnEventOneTarget(this._releaseEvent,{target:this._target});  
	}
	//g_eventHandler.dispatchAnEventOneTarget(this._buttonEvent,{target:this._target});  
},

/**
* @description Public function that calls this.gameEngineTargetHitCallback
* @param {Class} droppedClassReference // a reference to the Stick Object instance that is placed on the DropTarget instance 
*/   
onPress: function(){
	if(this._pressEvent!=""){
		g_eventHandler.dispatchAnEventOneTarget(this._pressEvent,{target:this._target});  
	}
	//g_eventHandler.dispatchAnEventOneTarget(this._buttonEvent,{target:this._target});  
}
  
});
