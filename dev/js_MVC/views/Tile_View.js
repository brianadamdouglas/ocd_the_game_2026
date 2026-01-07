/**
* @class Tile_View
* @description The parent View class for all Tiles
*/
class Tile_View extends View {

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
	
	
  	const container = data.container;
  	let id = data.id;
  	const className = data.className
  	const x = data.x;
  	const y = data.y;
  	const width = data.w;
  	const height = data.h;
  	const imgs = data.imgs;
  	const startFrame = data.startFrame;
  	

  	
	this.setID(id);
	const newDiv = document.createElement('div');
	newDiv.id = id;
	O(container).appendChild(newDiv);//appends the newly created div into the container. 
	this._div = $(`#${id}`);//making the jQuery selection reference
	this._div.addClass(className);

	const imagesData = {
		id:data.id, 
		w:data.w, 
		h:data.h, 
		imgs:data.imgs, 
		startFrame:data.startFrame
	}
	this._imageController = new Images_Controller();
	const newView = new Images_View();
	this._imageController.bindView(newView,imagesData);
	

	this.setDimensions(width,height);
	this.setDefaultLoc(x,y);
	this.setLoc(x,y);
	this._visible = true;
}

  
  

  
  
  
}