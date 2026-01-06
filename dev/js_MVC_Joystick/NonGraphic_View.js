var NonGraphic_View = Tile_View.extend({ // also used for the rotater div , perhaps I should rename this.
/**
* Constructor
* This class calls on at present one other Class, animationFrame.js
*	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
*/
construct: function() { 
	this.SC.construct();
	this._className = "NonGraphic_View";
},



init: function(controller,data) {
	
	this._controller = controller;
	
	
  	var container = data.container;
  	var id = data.id;
  	var className = data.className
  	var x = data.x;
  	var y = data.y;
  	var width = data.w;
  	var height = data.h;
  	
	this.setID(id);
	var newDiv = document.createElement('div');
	newDiv.id = id;

	O(container).appendChild(newDiv);//appends the newly created div into the container. 
	this._div = $('#'+id);//making the jQuery selection reference
	this._div.addClass(className);

	this.setDimensions(width,height);
	this.setDefaultLoc(x,y);
	this.setLoc(x,y);
	this._visible = true;
}
  
  
  
});
