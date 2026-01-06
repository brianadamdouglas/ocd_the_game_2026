/**
* @class Tile_View
* @description The parent View class for all Tiles
*/
class StageMask_View extends Tile_View {

	constructor() { 
	super();
	this._className = "Tile";
}

	/**
* @description Initializes the instance
* @param {Controller} controller // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return 
	*/
	init(controller,data) {
	
	this._controller = controller;
	
	
  	var container = data.container;
  	var id = data.id;
  	var className = data.className
  	var x = data.x;
  	var y = data.y;
  	var width = data.w;
  	var height = data.h;
  	var imgs = data.imgs;
  	var startFrame = data.startFrame;
  	
  	 

  	
	this.setID(id);
	var newDiv = document.createElement('div');
	newDiv.id = id;
	$('body').append(newDiv);//appends the newly created div into the container. 
	this._div = $('#'+id);//making the jQuery selection reference
	this._div.addClass(className);
	/* adding image subclass which adds the images into the currenly empty div*/
	
	
	var imagesData = {
		id:data.id, 
		w:data.w, 
		h:data.h, 
		imgs:data.imgs, 
		startFrame:data.startFrame
	}
	this._imageController = new Images_Controller();
	var newView = new Images_View();
	this._imageController.bindView(newView,imagesData);
	
	/* adding image subclass */

	this.setDimensions(width,height);
	this.setDefaultLoc(x,y);
	this.setLoc(x,y);
	this._visible = true;
}

	/**
* @description Return the dimensions of the PLayer tile;
* @return {Object} the dimensions Object(width, height); 
	*/    
	getDimensions() {
  	return {width:this._width,height:this._height};
}
  
  

  
  
  
}