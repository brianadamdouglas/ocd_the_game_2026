var DropTargetRevealed_Controller = InteractiveTile_Controller.extend({ // USES Tile_View
construct: function() { 
	this.SC.construct();
	this._className = "DropTargetRevealed";
},


interact: function(){
  this.getViewDIV().show();
}
  
});
