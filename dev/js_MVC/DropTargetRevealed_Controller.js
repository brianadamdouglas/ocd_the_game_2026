class DropTargetRevealed_Controller extends InteractiveTile_Controller { // USES Tile_View
	constructor() { 
	super();
	this._className = "DropTargetRevealed";
}


	interact(){
  this.getViewDIV().show();
}
  
}