/**
* @class Tile_View
* @description The parent View class for all Tiles
*/
const Tile_View = View.extend({

construct() { 
	this.SC.construct();
	this._className = "Tile";
},

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
  	
  	//added 2/24
  	/* let IDOverride;
  	if(data.IDOverride !== undefined){
  		IDOverride = data.IDOverride;
  		id = IDOverride;
  	} */
  	//added 2/24

  	
	this.setID(id);
	const newDiv = document.createElement('div');
	newDiv.id = id;
	O(container).appendChild(newDiv);//appends the newly created div into the container. 
	this._div = $(`#${id}`);//making the jQuery selection reference
	this._div.addClass(className);
	/* adding image subclass which adds the images into the currenly empty div*/
	
	
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
	
	/* adding image subclass */

	this.setDimensions(width,height);
	this.setDefaultLoc(x,y);
	this.setLoc(x,y);
	this._visible = true;
},

  
  

  
  
  
});
