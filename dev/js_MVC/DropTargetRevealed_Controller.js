const DropTargetRevealed_Controller = InteractiveTile_Controller.extend({ // USES Tile_View
construct() { 
	this.SC.construct();
	this._className = "DropTargetRevealed";
},


interact(){
  this.getViewDIV().show();
}
  
});
