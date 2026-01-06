const Mobile_View = Tile_View.extend({
/**
* Constructor
* This class calls on at present one other Class, animationFrame.js
*	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
*/
construct() { 
		this.SC.construct();
		this._className = "Mobile";
},

/**
* @description Initializes the instance
* @param {Selection} container // the selection on the stage that houses the tile
* @param {String} id // unique name of the new DIV
* @param {String} className // space delimited string of CSS classes that are attached to this instance.
* @param {Interger} x // X coordinate on the stage.
* @param {Interger} y // Y coordinate on the stage.
* @param {Interger} width // Max width of the animation tiles.
* @param {Interger} height // Max height of the animation tiles.
* @param {Array} imgs // Array of image paths for the animations or various frame states
* @param {Interger} startFrame // frame that the animation is set on
* @return 
*/	
init(controller, data) {
	this._controller = controller;
	
  	var container = data.container;
  	var id = data.id;
  	var className = data.className;
  	var x = data.x;
  	var y = data.y;
  	var width = data.w;
  	var height = data.h;
  	var imgs = data.imgs;
  	var startFrame = data.startFrame;
  	var IDOverride = data.IDOverride;
  	
    this.setID(IDOverride);
	var newDiv = document.createElement('div');
	newDiv.id = IDOverride;
	O(container).appendChild(newDiv);//appends the newly created div into the container. 
	this._div = $('#'+IDOverride);//making the jQuery selection reference
	this._div.addClass(className);
	
	this.setDimensions(width,height);
	this.setDefaultLoc(x,y);
	this.setLoc(x,y);
	this._visible = true;
	
	
}

  
  
  
});
