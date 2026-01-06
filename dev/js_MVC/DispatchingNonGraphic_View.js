/**
* @class DispatchingNonGraphic_View
* @description This cview class has no graphical representation on the stage. It also Dispatches an Event
*/
class DispatchingNonGraphic_View extends Tile_View {
	constructor() { 
	super();
	this._className = "NonGraphic_View";
	
	

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
		var x = data.x; 
		var y = data.y; 
		var width = data.width; 
		var height = data.height;

	
	var newDiv = document.createElement('div');
	newDiv.id = id;
	O(container).appendChild(newDiv);
	this._div = $('#' + id);
	this.rect = {top:y, right:(x + width), bottom:(y + height), left:x };

	
	this.setDimensions(width,height);
	this.setDefaultLoc(x,y);
	this.setLoc(x,y);
	this.dispatchRectInfo(this.rect, id);
}

	/**
* @description Set the location for the View instance in the Stage View
* @param {Interger} x // the x position of the View instance
* @param {Interger} y // the y position of the View instance
	*/  
	setLoc(x,y) {
  	this._x = x;
  	this._y = y;
 	this._div.css('left',x);
	this._div.css('top',y);
}


	/**
* @description Dispatch an Event containg the Rect information for the View
* @param {Object} rect // the rect of the View instance
* @param {String} id // the id of the View instance
	*/  
	dispatchRectInfo(rect, id){
	g_eventHandler.dispatchAnEventOneTarget("setNonGraphicRect",{id:id, rect:rect, target:this._controller});
}

}