class ButtonOnOff_Controller extends OnOffTile_Controller { // USES Tile_View
	constructor() { 
		super();
		this.interactState = false;
		this._target;
		this._buttonEvent;
		this._className = "Button";
		//console.log("i'm here");
		
  }
  

  
	bindView(view, data){
  this.init(data);
  this._view = view;
  this._view.init(this,data);
  this._view.getDiv().on("tap",this.actedUpon.bind(this));
}

	/**
* @description Initializes the instance
* @return 
	*/
	init(data){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};	
	this._target = data.buttonTarget;
	this.setButtonEvent(data.buttonFunction);
	//console.log('hey');
}


	/**
* @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
* @param {Function} func 
	*/  
/* setContainer(controller){  
	this._container = controller; 
}, */


	/**
* @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
* @param {Function} func 
	*/  
	setButtonEvent(str){  
	this._buttonEvent = str; 
}


	/**
* @description Public function that calls this.gameEngineTargetHitCallback
* @param {Class} droppedClassReference // a reference to the Stick Object instance that is placed on the DropTarget instance 
	*/   
	actedUpon(){
	this.interact();
	g_eventHandler.dispatchAnEventOneTarget(this._buttonEvent,{target:this._target});
}
  
}