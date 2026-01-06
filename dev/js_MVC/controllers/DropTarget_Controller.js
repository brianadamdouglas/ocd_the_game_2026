class DropTarget_Controller extends Tile_Controller { /// USES DropTarget_View 
	constructor() { 
		super();
		this._dropTargetFunctionName;//reference to a unique dropTarget function defined in the gameEngineExtension file, sent from the gameBoard reference
		this._className = "DropTarget";
}


	/**
* @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
* @param {Function} func 
	*/  
	setDropTargetReaction(str){    
	this._dropTargetFunctionName = str; 
	g_eventHandler.addAListener(str, g_mainGameController);
}


	/**
* @description Public function that calls this.gameEngineTargetHitCallback
* @param {Class} droppedClassReference // a reference to the Stick Object instance that is placed on the DropTarget instance 
	*/   
	actedUpon(droppedClassReference){
		g_eventHandler.dispatchAnEvent(this._dropTargetFunctionName,{target:this, droppedItemController:droppedClassReference});
	}
  
}